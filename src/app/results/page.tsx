import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Award, CheckCircle2, Trophy, Star, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "CBSE Board Results & Analytics | Cambridge International School, Mandi",
  description: "Exemplary CBSE Class X and XII Board Examination analytics and district toppers from Cambridge Mandi.",
};

export default function ResultsPage() {
  const toppers = [
    { name: "Aarav Thakur", stream: "Class XII (Science - PCM)", score: "99.2%", rank: "District Rank 1 (JEE AIR 412)", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300" },
    { name: "Sneha Kapoor", stream: "Class XII (Humanities)", score: "98.8%", rank: "State Rank 1 (100 in Pol Sci & Hist)", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" },
    { name: "Kartik Sen", stream: "Class XII (Commerce)", score: "97.6%", rank: "District Rank 2 (100 in Accounts)", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" },
    { name: "Priyanshi Verma", stream: "Class X CBSE Boards", score: "99.0%", rank: "District Topper (100 in Math & Science)", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300" },
  ];

  const highlights = [
    { label: "100% Pass Rate", desc: "Consecutive 100% pass results in both Class X and Class XII CBSE Boards" },
    { label: "86.4% School Average", desc: "Aggregate batch average across all academic streams" },
    { label: "42 Students > 95%", desc: "Scoring exceptional distinctions in major core subjects" },
    { label: "Zero Compartments", desc: "Exemplary individual student mentoring and remedial support" },
  ];

  return (
    <div>
      <PageHeader
        badge="Academic Benchmark"
        title="CBSE Board Results & Distinction Analytics"
        description="A legacy of academic brilliance reflected in stellar CBSE Class X & XII Board percentiles and premier university placements."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Results" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((h, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <span className="text-2xl sm:text-3xl font-black text-school-primary dark:text-amber-400 block font-heading">
                {h.label}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">{h.desc}</p>
            </div>
          ))}
        </div>

        {/* Toppers Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              CBSE Class X & XII Stars
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white mt-1">
              Our Stellar Board Toppers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toppers.map((t, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-3 group"
              >
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
                />
                <div className="space-y-1">
                  <span className="text-2xl font-black text-school-secondary dark:text-amber-400 block font-heading">
                    {t.score}
                  </span>
                  <h3 className="font-bold text-base text-school-primary dark:text-white">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-500">{t.stream}</p>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    {t.rank}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
