export const revalidate = 60;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Award, Trophy, Shield, Heart, ArrowRight } from "lucide-react";
import { getCachedPageContent } from "@/lib/pageContentCache";
import { DEFAULT_PAGE_REGISTRY } from "@/lib/pageRegistry";

export const metadata = {
  title: "Scholarships & Awards | Cambridge International School, Mandi",
  description: "Explore merit-based, sports, and defence scholarships offered by Cambridge International School Mandi.",
};

const DEFAULT_SCHEMES = [
  {
    title: "Academic Super-Achiever Scholarship (Class XI)",
    discount: "Up to 50% Tuition Fee Waiver",
    eligibility: "Students securing 95%+ aggregate in CBSE / ICSE Class X Board examinations.",
    iconName: "award",
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Himalayan National Sports Laureate Scholarship",
    discount: "25% to 100% Tuition Fee Waiver",
    eligibility: "Medalists and official state representatives in National Games / CBSE National Athletics / Swimming / Shooting / Badminton.",
    iconName: "trophy",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Armed Forces & Martyr's Ward Concession",
    discount: "20% Tuition Fee Waiver",
    eligibility: "Children of serving / retired Indian Armed Forces (Army, Navy, Air Force) and Paramilitary personnel.",
    iconName: "shield",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Sibling Advantage Waiver",
    discount: "15% Tuition Waiver on Second Child",
    eligibility: "Applicable to families with two or more biological siblings enrolled simultaneously at CIS Mandi.",
    iconName: "heart",
    color: "from-purple-500 to-pink-600",
  },
];

export default async function ScholarshipsPage() {
  const pageData = await getCachedPageContent("scholarships");
  const defaults = DEFAULT_PAGE_REGISTRY["scholarships"];

  let customStyles: any = {};
  if (pageData?.customStylesJson) {
    try {
      customStyles = typeof pageData.customStylesJson === "string" ? JSON.parse(pageData.customStylesJson) : pageData.customStylesJson;
    } catch (_) {}
  }

  const badge = pageData?.heroBadge || defaults?.heroBadge || "Financial Aid & Laurels";
  const title = pageData?.heroTitle || defaults?.heroTitle || "Scholarships & Merit Fee Concessions";
  const description = pageData?.heroSubtitle || defaults?.heroSubtitle || "Rewarding academic brilliance, sports prowess, and honoring our valiant armed forces personnel.";

  const schemes = Array.isArray(customStyles.schemes) && customStyles.schemes.length > 0
    ? customStyles.schemes
    : DEFAULT_SCHEMES;

  const ctaText = customStyles.ctaText || pageData?.heroCtaText || defaults?.heroCtaText || "Apply Online with Scholarship Request";
  const ctaLink = customStyles.ctaLink || pageData?.heroCtaLink || defaults?.heroCtaLink || "/admissions/apply";

  const getIcon = (idx: number, iconName?: string) => {
    if (iconName === "trophy" || idx === 1) return Trophy;
    if (iconName === "shield" || idx === 2) return Shield;
    if (iconName === "heart" || idx === 3) return Heart;
    return Award;
  };

  return (
    <div>
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Scholarships" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schemes.map((scheme: any, idx: number) => {
            const Icon = getIcon(idx, scheme.iconName);
            const colorClass = scheme.color || "from-amber-500 to-orange-600";
            return (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${colorClass} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full">
                    {scheme.discount}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-school-primary dark:text-white">
                  {scheme.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Eligibility: </strong>
                  {scheme.eligibility}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href={ctaLink}
            className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
