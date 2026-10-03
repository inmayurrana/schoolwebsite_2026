export const dynamic = "force-dynamic";
export const revalidate = 0;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { ShieldCheck, Lock, FileText, CheckCircle2, Download, ArrowRight } from "lucide-react";
import { getCachedPageContent } from "@/lib/pageContentCache";
import { getPageDefault } from "@/lib/pageRegistry";
import DynamicSectionRenderer from "@/components/common/DynamicSectionRenderer";

export const metadata = {
  title: "Privacy Policy & Terms | Cambridge International School, Mandi",
  description: "Privacy Policy, terms of service, and student data protection standards for Cambridge Mandi.",
};

export default async function PrivacyPolicyPage() {
  const cachedPage: any = await getCachedPageContent("privacy-policy");
  const defaultPage = getPageDefault("privacy-policy");

  let parsedSections = defaultPage.sections || [];
  if (cachedPage?.sectionsJson) {
    try {
      const parsed = JSON.parse(cachedPage.sectionsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsedSections = parsed;
      }
    } catch (_) {}
  } else if (cachedPage?.sections && Array.isArray(cachedPage.sections) && cachedPage.sections.length > 0) {
    parsedSections = cachedPage.sections;
  }

  let customStyles: any = defaultPage.customStyles || {};
  if (cachedPage?.customStylesJson) {
    try {
      const parsed = JSON.parse(cachedPage.customStylesJson);
      customStyles = { ...customStyles, ...parsed };
    } catch (_) {}
  } else if (cachedPage?.customStyles) {
    customStyles = { ...customStyles, ...cachedPage.customStyles };
  }

  const badge = cachedPage?.heroBadge || defaultPage.heroBadge || "Data Protection & Privacy";
  const title = cachedPage?.heroTitle || defaultPage.heroTitle || "Privacy Policy & Terms of Service";
  const description =
    cachedPage?.heroSubtitle ||
    defaultPage.heroSubtitle ||
    "We are committed to safeguarding student and parent personal information with strict data confidentiality.";

  const primarySection = parsedSections[0];
  const policyItems =
    primarySection?.items && primarySection.items.length > 0
      ? primarySection.items
      : defaultPage.sections?.[0]?.items || [];

  const extraSections = parsedSections.slice(1);
  const documents = Array.isArray(customStyles?.documents) ? customStyles.documents : [];
  const stats = Array.isArray(customStyles?.stats) ? customStyles.stats : [];

  return (
    <div>
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
        {/* Main Policy Card matching original layout */}
        <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          {policyItems.map((item: any, idx: number) => {
            return (
              <section key={item.id || idx} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-base sm:text-lg font-bold text-school-primary dark:text-white">
                    {item.title}
                  </h2>
                  {item.badge && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline pt-1"
                  >
                    <span>{item.buttonText || "Contact or Learn More"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </section>
            );
          })}
        </div>

        {/* Security / Compliance Stats if configured */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat: any, idx: number) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-md"
              >
                <div className="text-2xl font-black text-amber-500">{stat.number}</div>
                <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Compliance Downloadable Documents if present */}
        {documents.length > 0 && (
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2 text-school-primary dark:text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Official Policy & Regulatory Documents</span>
            </div>
            <div className="space-y-2">
              {documents.map((doc: any, idx: number) => (
                <a
                  key={doc.id || idx}
                  href={doc.fileUrl || "/uploads/prospectus.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition-all group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-amber-500">
                      {doc.title}
                    </span>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-500 shrink-0 ml-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Extra Modular Sections if configured in CMS */}
        {extraSections.length > 0 && (
          <div className="pt-8">
            <DynamicSectionRenderer sections={extraSections} customStyles={customStyles} />
          </div>
        )}
      </div>
    </div>
  );
}
