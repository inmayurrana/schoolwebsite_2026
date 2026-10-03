export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/PageHeader";
import DynamicSectionRenderer from "@/components/common/DynamicSectionRenderer";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";
import { getCachedPageContent } from "@/lib/pageContentCache";
import { getPageDefault } from "@/lib/pageRegistry";
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Maximize2,
  FileCheck2,
  BookOpen,
} from "lucide-react";

interface CatchAllPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  if (!slugPath || slugPath.startsWith("api") || slugPath.startsWith("admin")) {
    return { title: "Page Not Found | Cambridge International School Mandi" };
  }

  const candidateSlug = slugPath.split("/").pop() || slugPath;
  const page: any = await getCachedPageContent(candidateSlug);
  const title = page?.heroTitle || page?.pageName || "Cambridge International School Mandi";
  const desc = page?.heroSubtitle || "Cambridge International School Mandi, Himachal Pradesh";

  return {
    title: `${title} | Cambridge International School, Mandi`,
    description: desc,
  };
}

export default async function CatchAllCustomPage({ params }: CatchAllPageProps) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;

  if (
    !slugPath ||
    slugPath.startsWith("api") ||
    slugPath.startsWith("admin") ||
    slugPath.startsWith("_next") ||
    slugPath.startsWith("uploads") ||
    slugPath === "favicon.ico"
  ) {
    notFound();
  }

  const candidateSlug = slugPath.split("/").pop() || slugPath;

  // 1. Fetch from Cache / Database
  let pageData: any = await getCachedPageContent(candidateSlug);

  // Fallback to exact path slug lookup if different
  if (!pageData && candidateSlug !== slugPath) {
    pageData = await getCachedPageContent(slugPath);
  }

  // 2. If not in DB, check Default Page Registry
  if (!pageData) {
    const defaultPage = getPageDefault(candidateSlug);
    if (defaultPage && defaultPage.slug === candidateSlug) {
      pageData = defaultPage;
    }
  }

  // If still not found, return 404
  if (!pageData) {
    notFound();
  }

  // If page is explicitly unpublished (hidden by admin)
  if (pageData.isPublished === false) {
    notFound();
  }

  // Parse Sections
  let sections: any[] = [];
  if (pageData.sectionsJson) {
    try {
      sections = JSON.parse(pageData.sectionsJson);
    } catch (_) {
      sections = [];
    }
  } else if (Array.isArray(pageData.sections)) {
    sections = pageData.sections;
  }

  // Parse Custom Styles
  let customStyles: any = {};
  if (pageData.customStylesJson) {
    try {
      customStyles = JSON.parse(pageData.customStylesJson);
    } catch (_) {
      customStyles = {};
    }
  } else if (pageData.customStyles && typeof pageData.customStyles === "object") {
    customStyles = pageData.customStyles;
  }

  const heroBadge = pageData.heroBadge || `${pageData.pageName} • Cambridge Mandi`;
  const heroTitle = pageData.heroTitle || pageData.pageName;
  const heroSubtitle = pageData.heroSubtitle || "";
  const heroImage = pageData.heroImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80";
  const heroMediaType = pageData.heroMediaType || "IMAGE";
  const heroVideoUrl = pageData.heroVideoUrl;
  const heroOverlayOpacity = pageData.heroOverlayOpacity ?? 0.45;
  const heroCtaText = pageData.heroCtaText;
  const heroCtaLink = pageData.heroCtaLink;

  const embeddedPdfUrl = customStyles.embeddedPdfUrl;
  const embeddedPdfTitle = customStyles.embeddedPdfTitle || `${pageData.pageName} - Official PDF Document`;
  const embeddedPdfHeight = customStyles.embeddedPdfHeight || 680;

  const embeddedFormSlug = customStyles.embeddedFormSlug;
  const stats = Array.isArray(customStyles.stats) ? customStyles.stats : [];
  const documents = Array.isArray(customStyles.documents) ? customStyles.documents : [];

  return (
    <div>
      <PageHeader
        badge={heroBadge}
        title={heroTitle}
        description={heroSubtitle}
        image={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          ...(customStyles.category && customStyles.category !== "Core" && customStyles.category !== "Custom"
            ? [{ label: customStyles.category }]
            : []),
          { label: pageData.pageName },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Main Story / Headline Narrative Card if configured */}
        {(customStyles.storyHeadline || customStyles.mainStory) && (
          <div className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            {customStyles.storyHeadline && (
              <h2 className="text-2xl sm:text-3xl font-black text-school-primary dark:text-white">
                {customStyles.storyHeadline}
              </h2>
            )}
            {customStyles.mainStory && (
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {customStyles.mainStory}
              </p>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE EMBEDDED PDF PREVIEW SHOWCASE */}
        {/* ========================================================================= */}
        {embeddedPdfUrl && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      Official Document
                    </span>
                    <span className="text-xs text-slate-400">• Interactive PDF Viewer</span>
                  </div>
                  <h3 className="text-lg font-bold text-school-primary dark:text-white mt-0.5">
                    {embeddedPdfTitle}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={embeddedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
                  title="Open in new window / fullscreen"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Fullscreen</span>
                </a>
                <a
                  href={embeddedPdfUrl}
                  download
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive PDF Viewport */}
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner relative">
              <iframe
                src={`${embeddedPdfUrl}#toolbar=1&navpanes=0&view=FitH`}
                className="w-full border-0 rounded-2xl"
                style={{ height: `${embeddedPdfHeight}px` }}
                title={embeddedPdfTitle}
              />
              <div className="p-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>💡 Tip: Use the PDF toolbar above to zoom, page through, search, or print this document.</span>
                <a
                  href={embeddedPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-500 hover:underline"
                >
                  Direct PDF Link &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE EMBEDDED DYNAMIC FORM */}
        {/* ========================================================================= */}
        {embeddedFormSlug && embeddedFormSlug !== "none" && (
          <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-school-primary dark:text-white">
                  Official Digital Submission Portal
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill in the verified details below. Your submission is encrypted and acknowledged instantly.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <DynamicFormRenderer formSlug={embeddedFormSlug} />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULAR DYNAMIC SECTIONS (FEATURES GRID, BANNER, FAQ, SPLIT, STATS, CTA) */}
        {/* ========================================================================= */}
        {sections && sections.length > 0 && (
          <DynamicSectionRenderer sections={sections} customStyles={customStyles} />
        )}

        {/* Key Statistics Bar if present */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((st: any, idx: number) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1.5 shadow-lg"
              >
                <div className="text-3xl font-black text-amber-500">{st.number}</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{st.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Downloadable Documents List if present */}
        {documents.length > 0 && (
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-school-primary dark:text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Official Downloads & Related Files</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {documents.map((doc: any, idx: number) => (
                <a
                  key={doc.id || idx}
                  href={doc.fileUrl || "/uploads/prospectus.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-amber-500">
                        {doc.title}
                      </div>
                      {doc.fileSize && (
                        <div className="text-[10px] text-slate-400">{doc.fileSize}</div>
                      )}
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-500 shrink-0 ml-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
