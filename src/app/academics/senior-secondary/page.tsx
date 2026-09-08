import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Award, BookOpen, CheckCircle2, ArrowRight, Sparkles, Building, Landmark, Microscope } from "lucide-react";

export const metadata = {
  title: "Senior Secondary (Grades 9-12) | Cambridge International School, Mandi",
  description: "Explore Senior Secondary Streams: Science (Medical/Non-Med), Commerce, and Humanities with integrated competitive coaching at Cambridge Mandi.",
};

export default function SeniorSecondaryPage() {
  const streams = [
    {
      name: "Science: Non-Medical (PCM)",
      icon: Microscope,
      subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science / Python", "English Core", "Physical Education"],
      careers: "IIT-JEE, Engineering, Architecture, Data Science, Aerospace, Defense (NDA)",
    },
    {
      name: "Science: Medical (PCB)",
      icon: Sparkles,
      subjects: ["Physics", "Chemistry", "Biology", "Biotechnology / Psychology", "English Core", "Physical Education"],
      careers: "NEET, MBBS, AIIMS, BDS, Veterinary, Biomedical Engineering, Pharmacy",
    },
    {
      name: "Commerce Stream",
      icon: Landmark,
      subjects: ["Accountancy", "Business Studies", "Economics", "Applied Mathematics / IP", "English Core", "Physical Education"],
      careers: "Chartered Accountancy (CA), CS, B.Com (Hons), Finance, Corporate Law, Business Management",
    },
    {
      name: "Humanities & Liberal Arts",
      icon: Building,
      subjects: ["Political Science", "History", "Psychology / Sociology", "Economics", "English Core", "Fine Arts"],
      careers: "Civil Services (UPSC), Law (CLAT), International Relations, Journalism, Public Policy",
    },
  ];

  return (
    <div>
      <PageHeader
        badge="Senior Wing & CBSE Boards"
        title="Senior Secondary (Grades 9 to 12)"
        description="Benchmark CBSE Board preparation across 4 specialized streams with integrated JEE/NEET coaching and university placement mentorship."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "Senior Secondary" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
            CBSE Senior Secondary Affiliation No. 630198
          </span>
          <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
            4 Dedicated Streams Crafted for Global Careers
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Our Senior Secondary wing is led by specialized Master's & Doctorate faculty with proven track records in guiding students to top percentiles in Class 10 & 12 Board examinations and national entrance tests.
          </p>
        </div>

        {/* 4 Stream Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {streams.map((stream, idx) => {
            const Icon = stream.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-school-primary text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-school-primary dark:text-white">
                        {stream.name}
                      </h3>
                      <span className="text-xs font-semibold text-school-secondary">CBSE Curriculum</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Offered Subject Combinations:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {stream.subjects.map((sub, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-school-primary dark:text-amber-400">Career Trajectories: </strong>
                    <span>{stream.careers}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href="/admissions/apply"
                    className="w-full inline-flex items-center justify-center space-x-2 bg-school-primary hover:bg-school-primary-light text-white font-bold text-xs py-2.5 rounded-xl shadow transition-colors"
                  >
                    <span>Apply for {stream.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
