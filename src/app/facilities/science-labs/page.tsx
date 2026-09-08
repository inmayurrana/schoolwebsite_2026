import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { FlaskConical, CheckCircle2, ArrowRight, ShieldCheck, Microscope, Sparkles } from "lucide-react";

export const metadata = {
  title: "Science Laboratories | Cambridge International School, Mandi",
  description: "Modern Physics, Chemistry, Biology, and Biotechnology laboratories at Cambridge Mandi.",
};

export default function ScienceLabsPage() {
  const labs = [
    {
      name: "Advanced Physics Laboratory",
      desc: "Equipped with optical benches, laser optics, digital oscilloscopes, mechanics apparatus, and astronomical telescopes.",
    },
    {
      name: "Chemistry Laboratory & Fume Hoods",
      desc: "Individual chemical reagent stations, electronic analytical balances, fire-retardant counters, and automated eye-wash stations.",
    },
    {
      name: "Biology & Life Sciences Lab",
      desc: "High-resolution binocular compound microscopes, human anatomical models, preserved specimen archives, and botany cultivation beds.",
    },
    {
      name: "Biotechnology & Micro-Research Suite",
      desc: "Electrophoresis kits, centrifuges, PCR thermocyclers, and sterile laminar flow benches for Class XI-XII research projects.",
    },
  ];

  return (
    <div>
      <PageHeader
        badge="Hands-on Scientific Inquiry"
        title="Science & Biotechnology Laboratories"
        description="Encouraging empirical experimentation, hypothesis testing, and laboratory safety in purpose-built science suites."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Science Labs" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Empirical Learning
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Where Young Scientists Discover Truth Through Experimentation
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              At CIS Mandi, science is taught not through passive memorization, but through active tactile experimentation. Each student performs individual practicals under the close guidance of specialized lab demonstrators and senior faculty.
            </p>

            <div className="pt-2">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Apply for Senior Science Batch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
                alt="Science Lab"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* 4 Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labs.map((lab, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-base text-school-primary dark:text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{lab.name}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                {lab.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
