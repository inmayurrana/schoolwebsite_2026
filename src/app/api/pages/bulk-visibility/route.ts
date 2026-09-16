import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { appCache } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const body = await req.json();
    const { visibilityMap, pagesList } = body;

    if (!visibilityMap || typeof visibilityMap !== "object") {
      return NextResponse.json({ error: "Invalid visibility payload" }, { status: 400 });
    }

    // Batch upsert all page visibility records in a transaction
    const operations = Object.entries(visibilityMap).map(([slug, isPublished]) => {
      const pageInfo = Array.isArray(pagesList) ? pagesList.find((p: any) => p.slug === slug) : null;
      const pageName = pageInfo?.name?.replace(/[^a-zA-Z0-9 &]/g, "").trim() || slug;

      return prisma.pageContent.upsert({
        where: { slug },
        update: {
          isPublished: Boolean(isPublished),
          updatedBy: user?.name || "Admin",
        },
        create: {
          slug,
          pageName,
          isPublished: Boolean(isPublished),
          updatedBy: user?.name || "Admin",
        },
      });
    });

    await prisma.$transaction(operations);

    // Invalidate all RAM caches immediately so changes are 100% live
    appCache.invalidateAll();

    // Log the bulk update action
    try {
      await prisma.auditLog.create({
        data: {
          userId: user?.id || null,
          userName: user?.name || "Administrator",
          action: "BULK_VISIBILITY_APPLY",
          entity: "PageContent",
          details: `Applied visibility status for ${Object.keys(visibilityMap).length} website pages live.`,
        },
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: "All page visibility changes applied live to website.",
      visibility: visibilityMap,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Bulk visibility apply error:", error);
    return NextResponse.json({ error: error.message || "Failed to apply visibility changes" }, { status: 500 });
  }
}
