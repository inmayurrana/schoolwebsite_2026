import { PrismaClient } from "@prisma/client";
import { DEFAULT_PAGE_REGISTRY } from "../src/lib/pageRegistry";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Syncing all 36 rich page definitions to prisma.pageContent...");

  for (const [slug, def] of Object.entries(DEFAULT_PAGE_REGISTRY)) {
    const existing = await prisma.pageContent.findUnique({ where: { slug } });

    // Check if existing has generic dummy "<PageName> - Key Highlights"
    let existingSections: any[] = [];
    if (existing?.sectionsJson) {
      try {
        existingSections = typeof existing.sectionsJson === "string" ? JSON.parse(existing.sectionsJson) : existing.sectionsJson;
      } catch (e) {}
    }

    const isGenericDummy =
      !existing ||
      !Array.isArray(existingSections) ||
      existingSections.length === 0 ||
      (existingSections.length === 1 && existingSections[0]?.title?.includes("Key Highlights"));

    let existingCustom: any = {};
    if (existing?.customStylesJson) {
      try {
        existingCustom = typeof existing.customStylesJson === "string" ? JSON.parse(existing.customStylesJson) : existing.customStylesJson;
      } catch (e) {}
    }

    const mergedCustom = {
      ...def.customStyles,
      ...existingCustom,
    };

    const sectionsToSave = isGenericDummy && def.sections?.length > 0
      ? def.sections
      : (existingSections.length > 0 ? existingSections : def.sections);

    await prisma.pageContent.upsert({
      where: { slug },
      update: {
        pageName: def.pageName,
        heroBadge: existing?.heroBadge && !existing.heroBadge.includes("Key Highlights") ? existing.heroBadge : def.heroBadge,
        heroTitle: existing?.heroTitle && existing.heroTitle !== slug ? existing.heroTitle : def.heroTitle,
        heroSubtitle: existing?.heroSubtitle || def.heroSubtitle,
        heroImage: existing?.heroImage || def.heroImage,
        heroMediaType: def.heroMediaType || "IMAGE",
        heroVideoUrl: def.heroVideoUrl,
        heroOverlayOpacity: def.heroOverlayOpacity ?? 0.45,
        heroCtaText: existing?.heroCtaText || def.heroCtaText,
        heroCtaLink: existing?.heroCtaLink || def.heroCtaLink,
        sectionsJson: JSON.stringify(sectionsToSave),
        customStylesJson: JSON.stringify(mergedCustom),
        isPublished: existing?.isPublished !== undefined ? existing.isPublished : def.isPublished,
      },
      create: {
        slug,
        pageName: def.pageName,
        heroBadge: def.heroBadge,
        heroTitle: def.heroTitle,
        heroSubtitle: def.heroSubtitle,
        heroImage: def.heroImage,
        heroMediaType: def.heroMediaType || "IMAGE",
        heroVideoUrl: def.heroVideoUrl,
        heroOverlayOpacity: def.heroOverlayOpacity ?? 0.45,
        heroCtaText: def.heroCtaText,
        heroCtaLink: def.heroCtaLink,
        sectionsJson: JSON.stringify(def.sections || []),
        customStylesJson: JSON.stringify(def.customStyles || {}),
        isPublished: def.isPublished ?? true,
      },
    });

    console.log(`✅ Synced [${slug}]: "${def.pageName}" with ${sectionsToSave.length} sections.`);
  }

  console.log("🎉 All 36 website pages successfully populated with rich tailored content in DB!");
}

main()
  .catch((e) => {
    console.error("Sync failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
