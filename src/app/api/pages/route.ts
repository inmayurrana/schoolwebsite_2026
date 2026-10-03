import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { invalidatePageCache, invalidateVisibilityCache } from "@/lib/pageContentCache";
import { logAuditAction } from "@/lib/audit";

export async function GET() {
  try {
    const pages = await prisma.pageContent.findMany({
      orderBy: { pageName: "asc" },
    });

    const formatted = pages.map((p) => {
      let customStyles: any = {};
      try {
        if (p.customStylesJson) customStyles = JSON.parse(p.customStylesJson);
      } catch (_) {}

      return {
        slug: p.slug,
        path: customStyles.path || `/${p.slug}`,
        name: p.pageName,
        category: customStyles.category || "Custom",
        description: p.heroSubtitle || customStyles.description || "",
        isCustom: Boolean(customStyles.isCustomPage),
        menuLocation: customStyles.menuLocation || "none",
        menuLabel: customStyles.menuLabel || p.pageName,
        isPublished: p.isPublished,
        updatedAt: p.updatedAt,
      };
    });

    return NextResponse.json({ pages, list: formatted });
  } catch (error: any) {
    console.error("Pages GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    if (!data.slug || !data.pageName) {
      return NextResponse.json({ error: "Slug and page name are required" }, { status: 400 });
    }

    const cleanSlug = data.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_/]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanSlug) {
      return NextResponse.json({ error: "Invalid URL slug" }, { status: 400 });
    }

    // Check collision if this is an explicit new page creation
    if (data.isNewPage) {
      const existing = await prisma.pageContent.findUnique({
        where: { slug: cleanSlug },
      });
      if (existing) {
        return NextResponse.json(
          { error: `A page with URL slug "/${cleanSlug}" already exists. Please choose a different slug.` },
          { status: 409 }
        );
      }
    }

    // Default template builders based on user selection
    let defaultSections: any[] = [];
    let initialCustomStyles: any = {
      category: data.category || "Custom",
      path: `/${cleanSlug}`,
      description: data.description || data.heroSubtitle || "",
      isCustomPage: true,
      menuLocation: data.menuLocation || "none",
      menuLabel: data.menuLabel || data.pageName,
      menuOrder: data.menuOrder || 10,
    };

    if (data.preset === "form") {
      initialCustomStyles.embeddedFormSlug = data.embeddedFormSlug || "contact";
      defaultSections = [
        {
          id: `sec_${Date.now()}_1`,
          type: "banner",
          title: "Registration & Application Details",
          subtitle: "Please fill out the official digital form below. All submissions are encrypted and routed directly to the administration desk.",
          badge: "Online Portal",
          badgeColor: "amber",
          layout: "banner",
          items: [],
        },
      ];
    } else if (data.preset === "pdf") {
      initialCustomStyles.embeddedPdfUrl = data.embeddedPdfUrl || "/uploads/prospectus.pdf";
      initialCustomStyles.embeddedPdfTitle = data.embeddedPdfTitle || `${data.pageName} - Official PDF Document`;
      initialCustomStyles.embeddedPdfHeight = 650;
      defaultSections = [
        {
          id: `sec_${Date.now()}_1`,
          type: "features_grid",
          title: "Document Highlights & Instructions",
          subtitle: "Official circular, curriculum handbook, and policy guidelines published for parental and student reference.",
          badge: "Document Viewer",
          badgeColor: "emerald",
          layout: "grid_2",
          items: [
            {
              title: "Digital Document Verification",
              description: "This document is verified and authenticated by Cambridge International School Mandi.",
              badge: "Verified",
              badgeColor: "emerald",
            },
            {
              title: "Direct Download Access",
              description: "You may preview this document online or download an offline copy using the PDF controls below.",
              badge: "Downloadable",
              badgeColor: "blue",
            },
          ],
        },
      ];
    } else if (data.preset === "story") {
      initialCustomStyles.storyHeadline = `About ${data.pageName}`;
      initialCustomStyles.mainStory = `${data.pageName} at Cambridge International School Mandi fosters excellence, experiential inquiry, and values-led holistic education.\n\nOur campus provides state-of-the-art facilities, dedicated mentors, and benchmark international standards.`;
      initialCustomStyles.stats = [
        { number: "100%", label: "Curriculum Excellence" },
        { number: "15:1", label: "Student-Mentor Ratio" },
        { number: "10+ Acres", label: "Himalayan Campus" },
      ];
      defaultSections = [
        {
          id: `sec_${Date.now()}_1`,
          type: "features_grid",
          title: "Key Highlights & Distinctions",
          subtitle: "Comprehensive curriculum benchmarks, experiential laboratories, and student mentorship.",
          badge: "Highlights",
          badgeColor: "amber",
          layout: "grid_3",
          items: [
            {
              title: "World-Class Infrastructure",
              description: "Modern smart-enabled classrooms, innovation labs, and serene learning spaces.",
              badge: "Campus",
              badgeColor: "blue",
            },
            {
              title: "Global Pedagogy",
              description: "Blending CBSE academic rigor with Cambridge inquiry-based conceptual learning.",
              badge: "Academics",
              badgeColor: "emerald",
            },
            {
              title: "Holistic Development",
              description: "Nurturing sportsmanship, performing arts, leadership, and emotional resilience.",
              badge: "Growth",
              badgeColor: "purple",
            },
          ],
        },
      ];
    } else if (data.preset === "media") {
      defaultSections = [
        {
          id: `sec_${Date.now()}_1`,
          type: "features_grid",
          title: "Media Gallery & Visual Tour",
          subtitle: "Explore high-definition moments, student achievements, and campus celebrations.",
          badge: "Visual Showcase",
          badgeColor: "purple",
          layout: "grid_2",
          items: [
            {
              title: "Academic & STEM Celebrations",
              description: "Students actively presenting innovative science exhibits and coding projects.",
              image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
              badge: "STEM",
              badgeColor: "blue",
            },
            {
              title: "Athletics & Cultural Festivities",
              description: "Annual sports meet, football tournaments, and vibrant performing arts.",
              image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
              badge: "Sports & Arts",
              badgeColor: "amber",
            },
          ],
        },
      ];
    } else {
      // Default blank modular canvas
      defaultSections = [
        {
          id: `sec_${Date.now()}_1`,
          type: "features_grid",
          title: "Overview & Features",
          subtitle: "Click any block on the canvas to customize headings, add images, links, and UI effects.",
          badge: "Overview",
          badgeColor: "amber",
          layout: "grid_3",
          items: [
            {
              title: "First Feature Block",
              description: "Describe the first salient aspect of this page. You can customize text, badges, and images.",
              badge: "Feature 1",
              badgeColor: "blue",
            },
            {
              title: "Second Feature Block",
              description: "Add details, interactive links, or custom 3D card effects from the canvas editor.",
              badge: "Feature 2",
              badgeColor: "emerald",
            },
          ],
        },
      ];
    }

    // Merge existing customStyles if passed
    if (data.customStyles) {
      initialCustomStyles = { ...initialCustomStyles, ...data.customStyles };
    } else if (data.customStylesJson) {
      try {
        const parsed = typeof data.customStylesJson === "string" ? JSON.parse(data.customStylesJson) : data.customStylesJson;
        initialCustomStyles = { ...initialCustomStyles, ...parsed };
      } catch (_) {}
    }

    const sectionsJson =
      data.sections && Array.isArray(data.sections) && data.sections.length > 0
        ? JSON.stringify(data.sections)
        : data.sectionsJson
        ? (typeof data.sectionsJson === "string" ? data.sectionsJson : JSON.stringify(data.sectionsJson))
        : JSON.stringify(defaultSections);

    const customStylesJson = JSON.stringify(initialCustomStyles);

    const page = await prisma.pageContent.upsert({
      where: { slug: cleanSlug },
      update: {
        pageName: data.pageName,
        heroBadge: data.heroBadge || `${data.pageName} • Cambridge Mandi`,
        heroTitle: data.heroTitle || data.pageName,
        heroSubtitle: data.heroSubtitle || data.description || "Empowering students with benchmark curriculum, smart labs, and sports excellence in Mandi, HP.",
        heroImage: data.heroImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
        heroMediaType: data.heroMediaType || "IMAGE",
        heroVideoUrl: data.heroVideoUrl || undefined,
        heroOverlayOpacity: data.heroOverlayOpacity !== undefined ? parseFloat(data.heroOverlayOpacity) : 0.45,
        heroCtaText: data.heroCtaText || "Explore Details",
        heroCtaLink: data.heroCtaLink || "#",
        sectionsJson,
        customStylesJson,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        updatedBy: user.name || user.email || "Admin",
      },
      create: {
        slug: cleanSlug,
        pageName: data.pageName,
        heroBadge: data.heroBadge || `${data.pageName} • Cambridge Mandi`,
        heroTitle: data.heroTitle || data.pageName,
        heroSubtitle: data.heroSubtitle || data.description || "Empowering students with benchmark curriculum, smart labs, and sports excellence in Mandi, HP.",
        heroImage: data.heroImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
        heroMediaType: data.heroMediaType || "IMAGE",
        heroVideoUrl: data.heroVideoUrl || undefined,
        heroOverlayOpacity: data.heroOverlayOpacity !== undefined ? parseFloat(data.heroOverlayOpacity) : 0.45,
        heroCtaText: data.heroCtaText || "Explore Details",
        heroCtaLink: data.heroCtaLink || "#",
        sectionsJson,
        customStylesJson,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        updatedBy: user.name || user.email || "Admin",
      },
    });

    await logAuditAction({
      req,
      userId: user.id,
      userName: user.name || user.email,
      action: data.isNewPage ? "CREATE_PAGE" : "UPDATE_PAGE",
      entity: "PageContent",
      entityId: cleanSlug,
      message: `${data.isNewPage ? "Created new" : "Saved"} website page "${data.pageName}" (/${cleanSlug}) with preset "${data.preset || "standard"}"`,
      metadata: {
        slug: cleanSlug,
        pageName: data.pageName,
        preset: data.preset,
        menuLocation: initialCustomStyles.menuLocation,
        category: initialCustomStyles.category,
      },
    });

    invalidatePageCache(cleanSlug);
    invalidateVisibilityCache();

    return NextResponse.json({
      success: true,
      page: {
        ...page,
        sections: JSON.parse(page.sectionsJson || "[]"),
        customStyles: JSON.parse(page.customStylesJson || "{}"),
      },
    });
  } catch (error: any) {
    console.error("Pages POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to save page" }, { status: 500 });
  }
}
