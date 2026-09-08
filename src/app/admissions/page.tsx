import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Sparkles, CheckCircle2, ArrowRight, Download, Calendar, ShieldCheck, FileText, Phone, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Admissions 2027-2028 | Cambridge International School, Mandi",
  description: "Enroll your child in Cambridge International School Mandi for Session 2027-28. Explore eligibility, procedure, fees, and apply online.",
};

export default function AdmissionsHubPage() {
  const steps = [
    { num: "01", title: "Online Registration", desc: "Fill out the online application form with student details and academic records." },
    { num: "02", title: "Interaction / Entrance Test", desc: "Short friendly interaction for Early Years or conceptual aptitude assessment for Grades 6-11." },
    { num: "03", title: "Provisional Offer & Document Verification", desc: "Receive admission confirmation offer and submit required birth/transfer certificates." },
    { num: "04", title: "Fee Payment & Welcome Kit", desc: "Complete enrollment fee payment and collect school uniform, books, and orientation packet." },
  ];

  return (
    <div>
      <PageHeader
        badge="Session 2027–2028 Open"
        title="Admissions Hub — Cambridge Mandi"
        description="Join an inspiring community dedicated to academic rigor, character building, and international excellence in Himachal Pradesh."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-school-primary via-blue-900 to-school-primary text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              Limited Seats per Grade
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Admissions Open for Nursery to Grade XI
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              We maintain a low 1:15 mentor-student ratio to ensure every child receives personalized attention and accelerated learning support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              href="/admissions/apply"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all text-center"
            >
              Fill Online Application
            </Link>
            <a
              href="/sample-documents/CIS_Mandi_Prospectus_2025_2026.pdf"
              download
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl border border-white/20 text-center"
            >
              Download Prospectus
            </a>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
              4-Step Simple Admission Process
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Transparent, hassle-free, and parent-friendly registration workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 relative overflow-hidden"
              >
                <span className="text-4xl font-black text-school-secondary/15 dark:text-white/10 absolute top-3 right-4">
                  {step.num}
                </span>
                <span className="w-8 h-8 rounded-full bg-school-secondary text-white font-bold text-xs flex items-center justify-center shadow">
                  {step.num}
                </span>
                <h4 className="font-bold text-base text-school-primary dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links to Sub-pages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/admissions/procedure"
            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-school-primary hover:text-white transition-all group border border-slate-200 dark:border-slate-700 space-y-2"
          >
            <h4 className="font-bold text-base text-school-primary dark:text-white group-hover:text-white">
              Admission Procedure & Age Matrix →
            </h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-200">
              Check minimum age requirements and document verification checklist.
            </p>
          </Link>

          <Link
            href="/admissions/fees-structure"
            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-school-primary hover:text-white transition-all group border border-slate-200 dark:border-slate-700 space-y-2"
          >
            <h4 className="font-bold text-base text-school-primary dark:text-white group-hover:text-white">
              Fees Structure & Schedule →
            </h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-200">
              View transparent breakdown of admission, tuition, transport & hostel fees.
            </p>
          </Link>

          <Link
            href="/admissions/scholarships"
            className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-school-primary hover:text-white transition-all group border border-slate-200 dark:border-slate-700 space-y-2"
          >
            <h4 className="font-bold text-base text-school-primary dark:text-white group-hover:text-white">
              Scholarships & Fee Waivers →
            </h4>
            <p className="text-xs text-slate-500 group-hover:text-slate-200">
              Learn about merit concessions for board toppers, sports laureates & defence.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
