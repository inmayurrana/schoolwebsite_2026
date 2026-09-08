import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await prisma.pageContent.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({
      page: {
        ...page,
        sections: JSON.parse(page.sectionsJson || "[]"),
        customStyles: page.customStylesJson ? JSON.parse(page.customStylesJson) : {},
      },
    });
  } catch (error: any) {
    console.error("Page GET by slug error:", error);
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAuth();
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const data = await req.json();

    const page = await prisma.pageContent.update({
      where: { slug },
      data: {
        pageName: data.pageName,
        heroBadge: data.heroBadge,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImage: data.heroImage,
        heroMediaType: data.heroMediaType || "VIDEO",
        heroVideoUrl: data.heroVideoUrl !== undefined ? data.heroVideoUrl : undefined,
        heroOverlayOpacity: data.heroOverlayOpacity !== undefined ? parseFloat(data.heroOverlayOpacity) : undefined,
        heroCtaText: data.heroCtaText,
        heroCtaLink: data.heroCtaLink,
        sectionsJson: typeof data.sections === "object" ? JSON.stringify(data.sections) : data.sectionsJson,
        customStylesJson: typeof data.customStyles === "object" ? JSON.stringify(data.customStyles) : data.customStylesJson,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : undefined,
        updatedBy: auth.name || "Admin",
      },
    });

    // Record audit log entry in database
    await prisma.auditLog.create({
      data: {
        userId: auth.id,
        userName: auth.name || "Administrator",
        action: "PAGE_UPDATE",
        entity: "PageContent",
        entityId: page.id,
        details: `Saved changes to page "${page.pageName}" (${page.slug}) in database.`,
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("Page PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update page" }, { status: 500 });
  }
}
