import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Award, Trophy, Shield, Heart, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Scholarships & Awards | Cambridge International School, Mandi",
  description: "Explore merit-based, sports, and defence scholarships offered by Cambridge International School Mandi.",
};

export default function ScholarshipsPage() {
  const schemes = [
    {
      title: "Academic Super-Achiever Scholarship (Class XI)",
      discount: "Up to 50% Tuition Fee Waiver",
      eligibility: "Students securing 95%+ aggregate in CBSE / ICSE Class X Board examinations.",
      icon: Award,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Himalayan National Sports Laureate Scholarship",
      discount: "25% to 100% Tuition Fee Waiver",
      eligibility: "Medalists and official state representatives in National Games / CBSE National Athletics / Swimming / Shooting / Badminton.",
      icon: Trophy,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Armed Forces & Martyr's Ward Concession",
      discount: "20% Tuition Fee Waiver",
      eligibility: "Children of serving / retired Indian Armed Forces (Army, Navy, Air Force) and Paramilitary personnel.",
      icon: Shield,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Sibling Advantage Waiver",
      discount: "15% Tuition Waiver on Second Child",
      eligibility: "Applicable to families with two or more biological siblings enrolled simultaneously at CIS Mandi.",
      icon: Heart,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div>
      <PageHeader
        badge="Financial Aid & Laurels"
        title="Scholarships & Merit Fee Concessions"
        description="Rewarding academic brilliance, sports prowess, and honoring our valiant armed forces personnel."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "/admissions" },
          { label: "Scholarships" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schemes.map((scheme, idx) => {
            const Icon = scheme.icon;
            return (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${scheme.color} text-white flex items-center justify-center shadow-md`}>
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
            href="/admissions/apply"
            className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all"
          >
            <span>Apply Online with Scholarship Request</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
