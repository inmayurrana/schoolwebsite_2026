import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const pages = await prisma.pageContent.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        pageName: true,
        heroSubtitle: true,
        customStylesJson: true,
      },
    });

    const menuItems: Array<{
      title: string;
      href: string;
      desc: string;
      menuLocation: string;
      menuOrder: number;
    }> = [];

    for (const p of pages) {
      if (p.customStylesJson) {
        try {
          const cs = JSON.parse(p.customStylesJson);
          if (cs.menuLocation && cs.menuLocation !== "none") {
            menuItems.push({
              title: cs.menuLabel || p.pageName,
              href: cs.path || `/${p.slug}`,
              desc: p.heroSubtitle || cs.description || "",
              menuLocation: cs.menuLocation,
              menuOrder: cs.menuOrder || 10,
            });
          }
        } catch (_) {}
      }
    }

    menuItems.sort((a, b) => a.menuOrder - b.menuOrder);

    return NextResponse.json({ menuItems });
  } catch (error: any) {
    console.error("Menu items GET error:", error);
    return NextResponse.json({ menuItems: [] });
  }
}
