import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { appCache } from "@/lib/cache";
import { invalidatePageCache, getCachedPageContent } from "@/lib/pageContentCache";
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

    const defaultPage = getPageDefault(slug);

    if (!page) {
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
      ...defaultPage,
      ...page,
      heroBadge: page.heroBadge || defaultPage.heroBadge,
      heroTitle: page.heroTitle || defaultPage.heroTitle,
      heroSubtitle: page.heroSubtitle || defaultPage.heroSubtitle,
      heroImage: page.heroImage || defaultPage.heroImage,
      heroCtaText: page.heroCtaText || defaultPage.heroCtaText,
      heroCtaLink: page.heroCtaLink || defaultPage.heroCtaLink,
      sections: parsedSections.length > 0 ? parsedSections : defaultPage.sections,
      customStyles: {
        ...defaultPage.customStyles,
        ...parsedStyles,
      },
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

    // Cross-page sync for Leadership data
    if (slug === "home") {
      if (data.customStyles?.principalImage || data.customStyles?.principalName || data.customStyles?.principalMessage || data.customStyles?.principalQuote) {
        try {
          const pCurrent = await prisma.pageContent.findUnique({ where: { slug: "principal-message" } });
          if (pCurrent) {
            const pStyles = pCurrent.customStylesJson ? JSON.parse(pCurrent.customStylesJson) : {};
            if (data.customStyles.principalImage) pStyles.authorImage = data.customStyles.principalImage;
            if (data.customStyles.principalName) pStyles.authorName = data.customStyles.principalName;
            if (data.customStyles.principalTitle) pStyles.authorTitle = data.customStyles.principalTitle;
            if (data.customStyles.principalQuote) pStyles.quote = data.customStyles.principalQuote;
            if (data.customStyles.principalMessage) pStyles.mainStory = data.customStyles.principalMessage;
            await prisma.pageContent.update({
              where: { slug: "principal-message" },
              data: { customStylesJson: JSON.stringify(pStyles) },
            });
          }
        } catch (_) {}
      }

      if (data.customStyles?.chairmanImage || data.customStyles?.chairmanName || data.customStyles?.chairmanMessage || data.customStyles?.chairmanQuote) {
        try {
          const cCurrent = await prisma.pageContent.findUnique({ where: { slug: "chairman-message" } });
          if (cCurrent) {
            const cStyles = cCurrent.customStylesJson ? JSON.parse(cCurrent.customStylesJson) : {};
            if (data.customStyles.chairmanImage) cStyles.authorImage = data.customStyles.chairmanImage;
            if (data.customStyles.chairmanName) cStyles.authorName = data.customStyles.chairmanName;
            if (data.customStyles.chairmanTitle) cStyles.authorTitle = data.customStyles.chairmanTitle;
            if (data.customStyles.chairmanQuote) cStyles.quote = data.customStyles.chairmanQuote;
            if (data.customStyles.chairmanMessage) cStyles.mainStory = data.customStyles.chairmanMessage;
            await prisma.pageContent.update({
              where: { slug: "chairman-message" },
              data: { customStylesJson: JSON.stringify(cStyles) },
            });
          }
        } catch (_) {}
      }
    } else if (slug === "principal-message") {
      if (data.customStyles?.authorImage || data.customStyles?.authorName || data.customStyles?.mainStory || data.customStyles?.quote) {
        try {
          const homeCurrent = await prisma.pageContent.findUnique({ where: { slug: "home" } });
          if (homeCurrent) {
            const homeStyles = homeCurrent.customStylesJson ? JSON.parse(homeCurrent.customStylesJson) : {};
            if (data.customStyles.authorImage) homeStyles.principalImage = data.customStyles.authorImage;
            if (data.customStyles.authorName) homeStyles.principalName = data.customStyles.authorName;
            if (data.customStyles.authorTitle) homeStyles.principalTitle = data.customStyles.authorTitle;
            if (data.customStyles.quote) homeStyles.principalQuote = data.customStyles.quote;
            if (data.customStyles.mainStory) homeStyles.principalMessage = data.customStyles.mainStory;
            await prisma.pageContent.update({
              where: { slug: "home" },
              data: { customStylesJson: JSON.stringify(homeStyles) },
            });
          }
        } catch (_) {}
      }
    } else if (slug === "chairman-message") {
      if (data.customStyles?.authorImage || data.customStyles?.authorName || data.customStyles?.mainStory || data.customStyles?.quote) {
        try {
          const homeCurrent = await prisma.pageContent.findUnique({ where: { slug: "home" } });
          if (homeCurrent) {
            const homeStyles = homeCurrent.customStylesJson ? JSON.parse(homeCurrent.customStylesJson) : {};
            if (data.customStyles.authorImage) homeStyles.chairmanImage = data.customStyles.authorImage;
            if (data.customStyles.authorName) homeStyles.chairmanName = data.customStyles.authorName;
            if (data.customStyles.authorTitle) homeStyles.chairmanTitle = data.customStyles.chairmanTitle;
            if (data.customStyles.quote) homeStyles.chairmanQuote = data.customStyles.quote;
            if (data.customStyles.mainStory) homeStyles.chairmanMessage = data.customStyles.mainStory;
            await prisma.pageContent.update({
              where: { slug: "home" },
              data: { customStylesJson: JSON.stringify(homeStyles) },
            });
          }
        } catch (_) {}
      }
    }

    // Invalidate all RAM caches immediately so changes are 100% live
    appCache.invalidateAll();
    invalidatePageCache();

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("Page PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update page" }, { status: 500 });
  }
}
