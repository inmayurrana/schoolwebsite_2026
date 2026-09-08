import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Download, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Fees Structure 2025-26 | Cambridge International School, Mandi",
  description: "Transparent fee structure for Pre-Primary, Primary, Middle, and Senior Secondary wings at Cambridge Mandi.",
};

export default function FeesStructurePage() {
  const feeTiers = [
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

  return (
    <div>
      <PageHeader
        badge="Academic Year 2025–26"
        title="Fee Structure & Payment Schedule"
        description="Completely transparent, regulated fee structure with zero hidden charges. Installment options available for quarterly payments."
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
                Approved by Management & PTA
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
                Tuition & Composite Fee Breakdown
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
                {feeTiers.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-bold text-school-primary dark:text-amber-300">{tier.wing}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{formatCurrency(tier.admissionFee)}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{formatCurrency(tier.annualCompositeFee)}</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(tier.quarterlyTuition)}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{formatCurrency(tier.activityAndLabFee)}</td>
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
              Optional School Transport (GPS Monitored)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transport charges are slab-based depending on distance from campus (covering Mandi City, Gutkar, Sundernagar, Pandoh, and adjoining valleys):
            </p>
            <div className="text-xs space-y-1.5 pt-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>0 – 5 km (Mandi Town & Vicinity)</span>
                <span className="font-bold">₹1,800 / month</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>5 – 12 km (Gutkar / Nerchowk sector)</span>
                <span className="font-bold">₹2,400 / month</span>
              </div>
              <div className="flex justify-between py-1">
                <span>12 – 22 km (Sundernagar / Outskirts)</span>
                <span className="font-bold">₹3,100 / month</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-school-primary dark:text-white">
              Residential Hostel & Boarding (Optional)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Includes air-conditioned/heated room accommodation, 4 nutritious hygienic meals daily, 24x7 resident warden care, laundry, evening tutoring, and medical cover:
            </p>
            <div className="text-xs space-y-1.5 pt-2 text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Annual Boarding & Hostel Fee</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">₹1,25,000 / year</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Payable in 2 equal installments (April & October)</span>
                <span className="font-bold">₹62,500 / term</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="text-center pt-4">
          <Link
            href="/admissions/apply"
            className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all"
          >
            <span>Proceed to Online Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
