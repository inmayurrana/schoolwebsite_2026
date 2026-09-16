import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { appCache } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const body = await req.json();
    const { slug, isPublished, pageName } = body;

    if (!slug) {
      return NextResponse.json({ error: "Page slug is required" }, { status: 400 });
    }

    const updated = await prisma.pageContent.upsert({
      where: { slug },
      update: {
        isPublished: Boolean(isPublished),
        updatedBy: user?.name || "Admin",
      },
      create: {
        slug,
        pageName: pageName || slug,
        isPublished: Boolean(isPublished),
        updatedBy: user?.name || "Admin",
      },
    });

    // Invalidate all page caches immediately
    appCache.invalidateAll();

    // Record audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: user?.id || null,
          userName: user?.name || "Administrator",
          action: isPublished ? "PAGE_ENABLED" : "PAGE_DISABLED",
          entity: "PageContent",
          entityId: updated.id,
          details: `Page "${updated.pageName}" (${slug}) was ${isPublished ? "ENABLED (Visible)" : "DISABLED (Hidden)"} by admin.`,
        },
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      slug: updated.slug,
      isPublished: updated.isPublished,
      page: updated,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Toggle page status error:", error);
    return NextResponse.json({ error: error.message || "Failed to toggle page status" }, { status: 500 });
  }
}
