import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const pages = await prisma.pageContent.findMany({
      orderBy: { pageName: "asc" },
    });
    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error("Pages GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    if (!data.slug || !data.pageName) {
      return NextResponse.json({ error: "Slug and page name are required" }, { status: 400 });
    }

    const page = await prisma.pageContent.upsert({
      where: { slug: data.slug },
      update: {
        pageName: data.pageName,
        heroBadge: data.heroBadge,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImage: data.heroImage,
        heroCtaText: data.heroCtaText,
        heroCtaLink: data.heroCtaLink,
        sectionsJson: typeof data.sectionsJson === "string" ? data.sectionsJson : JSON.stringify(data.sectionsJson || []),
        customStylesJson: typeof data.customStylesJson === "string" ? data.customStylesJson : JSON.stringify(data.customStylesJson || {}),
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        updatedBy: auth.name || "Admin",
      },
      create: {
        slug: data.slug,
        pageName: data.pageName,
        heroBadge: data.heroBadge,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImage: data.heroImage,
        heroCtaText: data.heroCtaText,
        heroCtaLink: data.heroCtaLink,
        sectionsJson: typeof data.sectionsJson === "string" ? data.sectionsJson : JSON.stringify(data.sectionsJson || []),
        customStylesJson: typeof data.customStylesJson === "string" ? data.customStylesJson : JSON.stringify(data.customStylesJson || {}),
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        updatedBy: auth.name || "Admin",
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("Pages POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to save page" }, { status: 500 });
  }
}
