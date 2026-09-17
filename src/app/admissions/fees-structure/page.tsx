export const revalidate = 60;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Download, ArrowRight } from "lucide-react";
import { getCachedPageContent } from "@/lib/pageContentCache";
import { DEFAULT_PAGE_REGISTRY } from "@/lib/pageRegistry";

export const metadata = {
  title: "Fees Structure 2025-26 | Cambridge International School, Mandi",
  description: "Transparent fee structure for Pre-Primary, Primary, Middle, and Senior Secondary wings at Cambridge Mandi.",
};

const DEFAULT_FEE_TIERS = [
  {
    wing: "Pre-Primary (Nursery, LKG, UKG)",
    admissionFee: 15000,
    annualCompositeFee: 42000,
    quarterlyTuition: 10500,
    activityAndLabFee: 4000,
  },
  {
    wing: "Primary Wing (Grades 1 to 5)",
    admissionFee: 18000,
    annualCompositeFee: 48000,
    quarterlyTuition: 12000,
    activityAndLabFee: 5500,
  },
  {
    wing: "Middle School (Grades 6 to 8)",
    admissionFee: 20000,
    annualCompositeFee: 54000,
    quarterlyTuition: 13500,
    activityAndLabFee: 7000,
  },
  {
    wing: "Secondary Wing (Grades 9 & 10)",
    admissionFee: 22000,
    annualCompositeFee: 62000,
    quarterlyTuition: 15500,
    activityAndLabFee: 8500,
  },
  {
    wing: "Senior Secondary (Grades 11 & 12)",
    admissionFee: 25000,
    annualCompositeFee: 72000,
    quarterlyTuition: 18000,
    activityAndLabFee: 10000,
  },
];

const DEFAULT_TRANSPORT_SLABS = [
  { slab: "0 – 5 km (Mandi Town & Vicinity)", fee: "₹1,800 / month" },
  { slab: "5 – 12 km (Gutkar / Nerchowk sector)", fee: "₹2,400 / month" },
  { slab: "12 – 22 km (Sundernagar / Outskirts)", fee: "₹3,100 / month" },
];

const DEFAULT_HOSTEL_FEES = [
  { item: "Annual Boarding & Hostel Fee", fee: "₹1,25,000 / year", isHighlight: true },
  { item: "Payable in 2 equal installments (April & October)", fee: "₹62,500 / term", isHighlight: false },
];

export default async function FeesStructurePage() {
  const pageData = await getCachedPageContent("fees-structure");
  const defaults = DEFAULT_PAGE_REGISTRY["fees-structure"];

  let customStyles: any = {};
  if (pageData?.customStylesJson) {
    try {
      customStyles = typeof pageData.customStylesJson === "string" ? JSON.parse(pageData.customStylesJson) : pageData.customStylesJson;
    } catch (_) {}
  }

  const badge = pageData?.heroBadge || defaults?.heroBadge || "Academic Year 2025–26";
  const title = pageData?.heroTitle || defaults?.heroTitle || "Fee Structure & Payment Schedule";
  const description = pageData?.heroSubtitle || defaults?.heroSubtitle || "Completely transparent, regulated fee structure with zero hidden charges. Installment options available for quarterly payments.";

  const tableBadge = customStyles.feesTableBadge || "Approved by Management & PTA";
  const tableTitle = customStyles.feesTableTitle || "Tuition & Composite Fee Breakdown";
  const feeTiers = Array.isArray(customStyles.feeTiers) && customStyles.feeTiers.length > 0
    ? customStyles.feeTiers
    : DEFAULT_FEE_TIERS;

  const transportTitle = customStyles.transportTitle || "Optional School Transport (GPS Monitored)";
  const transportDesc = customStyles.transportDesc || "Transport charges are slab-based depending on distance from campus (covering Mandi City, Gutkar, Sundernagar, Pandoh, and adjoining valleys):";
  const transportSlabs = Array.isArray(customStyles.transportSlabs) && customStyles.transportSlabs.length > 0
    ? customStyles.transportSlabs
    : DEFAULT_TRANSPORT_SLABS;

  const hostelTitle = customStyles.hostelTitle || "Residential Hostel & Boarding (Optional)";
  const hostelDesc = customStyles.hostelDesc || "Includes air-conditioned/heated room accommodation, 4 nutritious hygienic meals daily, 24x7 resident warden care, laundry, evening tutoring, and medical cover:";
  const hostelFees = Array.isArray(customStyles.hostelFees) && customStyles.hostelFees.length > 0
    ? customStyles.hostelFees
    : DEFAULT_HOSTEL_FEES;

  const ctaText = customStyles.ctaText || pageData?.heroCtaText || defaults?.heroCtaText || "Proceed to Online Application";
  const ctaLink = customStyles.ctaLink || pageData?.heroCtaLink || defaults?.heroCtaLink || "/admissions/apply";

  return (
    <div>
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Fees Structure" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Table */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
                {tableBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
                {tableTitle}
              </h2>
            </div>

            <a
              href="/sample-documents/Fee_Structure_CIS_Mandi_2025_2026.pdf"
              download
              className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-800 dark:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-amber-500" />
              <span>Download Official Fee Schedule (PDF)</span>
            </a>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-school-primary text-white">
                <tr>
                  <th className="p-4 font-bold">Academic Wing / Grades</th>
                  <th className="p-4 font-bold">One-Time Admission Fee</th>
                  <th className="p-4 font-bold">Annual Composite Fee</th>
                  <th className="p-4 font-bold">Quarterly Tuition Installment</th>
                  <th className="p-4 font-bold">Lab & STEM Fee / Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {feeTiers.map((tier: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-bold text-school-primary dark:text-amber-300">{tier.wing}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{formatCurrency(Number(tier.admissionFee) || 0)}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(Number(tier.annualCompositeFee) || 0)}</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(Number(tier.quarterlyTuition) || 0)}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{formatCurrency(Number(tier.activityAndLabFee) || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional Add-ons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-school-primary dark:text-white">
              {transportTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {transportDesc}
            </p>
            <div className="text-xs space-y-1.5 pt-2 text-slate-700 dark:text-slate-300">
              {transportSlabs.map((s: any, idx: number) => (
                <div key={idx} className={`flex justify-between py-1 ${idx < transportSlabs.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
                  <span>{s.slab || s.range}</span>
                  <span className="font-bold">{s.fee}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-school-primary dark:text-white">
              {hostelTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {hostelDesc}
            </p>
            <div className="text-xs space-y-1.5 pt-2 text-slate-700 dark:text-slate-300">
              {hostelFees.map((h: any, idx: number) => (
                <div key={idx} className={`flex justify-between py-1 ${idx < hostelFees.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
                  <span>{h.item || h.label}</span>
                  <span className={`font-bold ${h.isHighlight ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{h.fee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="text-center pt-4">
          <Link
            href={ctaLink}
            className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
