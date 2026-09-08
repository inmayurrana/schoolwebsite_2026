import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { CheckCircle2, FileText, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Admission Procedure & Age Matrix | Cambridge International School, Mandi",
  description: "Detailed step-by-step admission procedure, age eligibility criteria, and required documents for Cambridge Mandi.",
};

export default function AdmissionProcedurePage() {
  const ageMatrix = [
    { grade: "Nursery / Pre-KG", age: "3+ Years as on 31st March 2025" },
    { grade: "LKG / Lower Kindergarten", age: "4+ Years as on 31st March 2025" },
    { grade: "UKG / Upper Kindergarten", age: "5+ Years as on 31st March 2025" },
    { grade: "Grade I", age: "6+ Years as on 31st March 2025" },
    { grade: "Grade II to V", age: "Corresponding age progression + Previous School TC" },
    { grade: "Grade VI to VIII", age: "Previous class marksheet + TC + Aptitude test" },
    { grade: "Grade IX to X", age: "CBSE Registration Eligibility + Class 8/9 Marksheet" },
    { grade: "Grade XI (Science/Commerce/Arts)", age: "Class X Board Marksheet / Pre-board score" },
  ];

  const requiredDocs = [
    "Attested copy of Child's Birth Certificate (issued by Municipal Corp / Gram Panchayat)",
    "Original Transfer Certificate (TC) from previous school counter-signed by Education Officer",
    "Previous Class Marksheet / Progress Card",
    "Recent passport-sized photographs of student (4 copies)",
    "Recent passport-sized photographs of Father and Mother (2 copies each)",
    "Aadhaar Card copies of Student and Parents",
    "Medical Fitness Certificate & Blood Group proof",
    "Caste / Category certificate (if applicable for scholarship quotas)",
  ];

  return (
    <div>
      <PageHeader
        badge="Eligibility & Guidelines"
        title="Admission Procedure & Age Matrix"
        description="Comprehensive guidelines on age eligibility criteria, admission test schedules, and document checklists."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Procedure" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Age Matrix Table */}
        <div className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Eligibility Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
              Age Criteria for Session 2025–2026
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-school-primary text-white">
                <tr>
                  <th className="p-4 font-bold">Grade / Class Applying</th>
                  <th className="p-4 font-bold">Minimum Age Eligibility (as of 31st March 2025)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {ageMatrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-semibold text-school-primary dark:text-amber-400">{item.grade}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{item.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Required Documents */}
        <div className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Verification Checklist
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
              Mandatory Documents for Final Admission
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requiredDocs.map((doc, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center pt-6">
          <Link
            href="/admissions/apply"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all"
          >
            <span>Proceed to Online Application Form</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
