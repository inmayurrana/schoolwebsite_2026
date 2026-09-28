export const revalidate = 60;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { getCachedPageContent } from "@/lib/pageContentCache";
import { DEFAULT_PAGE_REGISTRY } from "@/lib/pageRegistry";

export const metadata = {
  title: "Fees Structure 2025-26 | Cambridge International School, Mandi",
  description: "Transparent fee structure for Pre-Primary, Primary, Middle, and Senior Secondary wings at Cambridge Mandi.",
};

const DEFAULT_FEES_COLUMNS: string[] = [
  "Academic Wing / Grades",
  "One-Time Admission Fee",
  "Annual Composite Fee",
  "Quarterly Tuition Installment",
  "Lab & STEM Fee / Year",
];

const DEFAULT_FEES_ROWS: string[][] = [
  ["Nursery", "₹13,000", "₹10,800", "₹8,163", "₹0"],
  ["KG 1", "₹13,000", "₹10,800", "₹7,038", "₹0"],
  ["KG 2", "₹13,000", "₹10,800", "₹7,110", "₹0"],
  ["Grades 1", "₹13,000", "₹10,800", "₹7,140", "₹2,000"],
  ["Grades 2", "₹13,000", "₹10,800", "₹7,170", "₹2,000"],
  ["Grades 3", "₹13,000", "₹10,800", "₹7,260", "₹2,000"],
  ["Grades 4", "₹13,000", "₹10,800", "₹7,350", "₹2,000"],
  ["Grades 5", "₹13,000", "₹10,800", "₹7,440", "₹2,000"],
  ["Grades 6 to 8", "₹15,000", "₹12,000", "₹8,500", "₹3,000"],
  ["Grades 9 & 10", "₹18,000", "₹14,000", "₹9,800", "₹4,000"],
  ["Grades 11 & 12", "₹20,000", "₹16,000", "₹11,500", "₹5,000"],
];

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
  
  // Dynamic columns support
  const feesColumns: string[] = Array.isArray(customStyles.feesTableColumns) && customStyles.feesTableColumns.length > 0
    ? customStyles.feesTableColumns
    : DEFAULT_FEES_COLUMNS;

  // Dynamic rows support with backward compatibility
  const feesRows: string[][] = Array.isArray(customStyles.feesTableRows) && customStyles.feesTableRows.length > 0
    ? customStyles.feesTableRows
    : (Array.isArray(customStyles.feeTiers) && customStyles.feeTiers.length > 0
        ? customStyles.feeTiers.map((t: any) => [
            t.wing || "",
            formatCurrency(Number(t.admissionFee) || 0),
            formatCurrency(Number(t.annualCompositeFee) || 0),
            formatCurrency(Number(t.quarterlyTuition) || 0),
            formatCurrency(Number(t.activityAndLabFee) || 0),
          ])
        : DEFAULT_FEES_ROWS);

  // Dynamic Fee Cards support with backward compatibility
  const feeCards: Array<{
    id?: string;
    title: string;
    description: string;
    items: Array<{ label: string; value: string; isHighlight?: boolean }>;
  }> = Array.isArray(customStyles.feeCards)
    ? customStyles.feeCards
    : [
        ...(customStyles.transportTitle && customStyles.transportTitle !== "NA"
          ? [
              {
                id: "card_transport",
                title: customStyles.transportTitle,
                description: customStyles.transportDesc || "Transport charges are slab-based depending on distance from campus:",
                items: Array.isArray(customStyles.transportSlabs) && customStyles.transportSlabs.length > 0
                  ? customStyles.transportSlabs.map((s: any) => ({
                      label: s.slab || s.range || "",
                      value: s.fee || "",
                    }))
                  : DEFAULT_TRANSPORT_SLABS.map((s) => ({ label: s.slab, value: s.fee })),
              },
            ]
          : !customStyles.transportTitle
          ? [
              {
                id: "card_transport",
                title: "Optional School Transport (GPS Monitored)",
                description: "Transport charges are slab-based depending on distance from campus (covering Mandi City, Gutkar, Sundernagar, Pandoh, and adjoining valleys):",
                items: DEFAULT_TRANSPORT_SLABS.map((s) => ({ label: s.slab, value: s.fee })),
              },
            ]
          : []),
        ...(customStyles.hostelTitle && customStyles.hostelTitle !== "NA"
          ? [
              {
                id: "card_hostel",
                title: customStyles.hostelTitle,
                description: customStyles.hostelDesc || "Includes room accommodation, 4 meals daily, 24x7 resident warden care:",
                items: Array.isArray(customStyles.hostelFees) && customStyles.hostelFees.length > 0
                  ? customStyles.hostelFees.map((h: any) => ({
                      label: h.item || h.label || "",
                      value: h.fee || "",
                      isHighlight: !!h.isHighlight,
                    }))
                  : DEFAULT_HOSTEL_FEES.map((h) => ({ label: h.item, value: h.fee, isHighlight: h.isHighlight })),
              },
            ]
          : !customStyles.hostelTitle
          ? [
              {
                id: "card_hostel",
                title: "Residential Hostel & Boarding (Optional)",
                description: "Includes air-conditioned/heated room accommodation, 4 nutritious hygienic meals daily, 24x7 resident warden care, laundry, evening tutoring, and medical cover:",
                items: DEFAULT_HOSTEL_FEES.map((h) => ({ label: h.item, value: h.fee, isHighlight: h.isHighlight })),
              },
            ]
          : []),
      ];

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
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-school-primary text-white">
                <tr>
                  {feesColumns.map((col: string, idx: number) => (
                    <th key={idx} className="p-4 font-bold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {feesRows.map((row: string[], idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    {feesColumns.map((_: any, cIdx: number) => (
                      <td
                        key={cIdx}
                        className={`p-4 ${
                          cIdx === 0
                            ? "font-bold text-school-primary dark:text-amber-300"
                            : cIdx === 3
                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                            : "text-slate-700 dark:text-slate-300 font-medium"
                        }`}
                      >
                        {row[cIdx] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optional Add-on Cards */}
        {feeCards.length > 0 && (
          <div
            className={`grid grid-cols-1 ${
              feeCards.length === 1
                ? "max-w-2xl mx-auto"
                : feeCards.length === 2
                ? "md:grid-cols-2"
                : "md:grid-cols-2 lg:grid-cols-3"
            } gap-8`}
          >
            {feeCards.map((card: any, idx: number) => (
              <div
                key={card.id || idx}
                className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-school-primary dark:text-white">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  )}
                </div>

                {Array.isArray(card.items) && card.items.length > 0 && (
                  <div className="text-xs sm:text-sm space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-300">
                    {card.items.map((item: any, iIdx: number) => (
                      <div
                        key={iIdx}
                        className={`flex justify-between items-center py-1.5 ${
                          iIdx < card.items.length - 1
                            ? "border-b border-slate-100 dark:border-slate-800/60"
                            : ""
                        }`}
                      >
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {item.label}
                        </span>
                        <span
                          className={`font-bold ${
                            item.isHighlight
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
