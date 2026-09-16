import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { appCache } from "@/lib/cache";

import { getPageDefault } from "@/lib/pageRegistry";

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
      const defaultPage = getPageDefault(slug);
      const response = NextResponse.json({ page: defaultPage });
      response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      return response;
    }

    let parsedSections = [];
    try {
      parsedSections = page.sectionsJson ? JSON.parse(page.sectionsJson) : [];
      if (!Array.isArray(parsedSections)) parsedSections = [];
    } catch (_) {
      parsedSections = [];
    }

    let parsedStyles = {};
    try {
      parsedStyles = page.customStylesJson ? JSON.parse(page.customStylesJson) : {};
      if (typeof parsedStyles !== "object" || parsedStyles === null) parsedStyles = {};
    } catch (_) {
      parsedStyles = {};
    }

    const pageData = {
      ...page,
      sections: parsedSections,
      customStyles: parsedStyles,
    };

    const response = NextResponse.json({ page: pageData });
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    return response;
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
    const { slug } = await params;
    const data = await req.json();

    const sectionsJson = typeof data.sections === "object" ? JSON.stringify(data.sections) : (data.sectionsJson || "[]");
    const customStylesJson = typeof data.customStyles === "object" ? JSON.stringify(data.customStyles) : (data.customStylesJson || "{}");

    const page = await prisma.pageContent.upsert({
      where: { slug },
      update: {
        pageName: data.pageName || slug,
        heroBadge: data.heroBadge,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImage: data.heroImage,
        heroMediaType: data.heroMediaType || "IMAGE",
        heroVideoUrl: data.heroVideoUrl !== undefined ? data.heroVideoUrl : undefined,
        heroOverlayOpacity: data.heroOverlayOpacity !== undefined ? parseFloat(data.heroOverlayOpacity) : 0.45,
        heroCtaText: data.heroCtaText,
        heroCtaLink: data.heroCtaLink,
        sectionsJson,
        customStylesJson,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        updatedBy: "Admin",
      },
      create: {
        slug,
        pageName: data.pageName || slug,
        heroBadge: data.heroBadge,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroImage: data.heroImage,
        heroMediaType: data.heroMediaType || "IMAGE",
        heroVideoUrl: data.heroVideoUrl !== undefined ? data.heroVideoUrl : undefined,
        heroOverlayOpacity: data.heroOverlayOpacity !== undefined ? parseFloat(data.heroOverlayOpacity) : 0.45,
        heroCtaText: data.heroCtaText,
        heroCtaLink: data.heroCtaLink,
        sectionsJson,
        customStylesJson,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        updatedBy: "Admin",
      },
    });

    // Invalidate all RAM caches immediately so changes are 100% live
    appCache.invalidateAll();

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("Page PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update page" }, { status: 500 });
  }
}
