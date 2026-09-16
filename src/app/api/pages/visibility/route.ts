import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pages = await prisma.pageContent.findMany({
      select: {
        slug: true,
        pageName: true,
        isPublished: true,
      },
    });

    const visibilityMap: Record<string, boolean> = {};
    pages.forEach((p) => {
      visibilityMap[p.slug] = p.isPublished;
    });

    const response = NextResponse.json({
      success: true,
      visibility: visibilityMap,
      pages,
      timestamp: Date.now(),
    });

    // Ensure browsers and clients always get 100% fresh visibility states
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    return response;
  } catch (error: any) {
    console.error("Pages visibility GET error:", error);
    return NextResponse.json({ error: "Failed to fetch visibility" }, { status: 500 });
  }
}
