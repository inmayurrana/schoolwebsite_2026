import React from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, CheckCircle2, ArrowRight, Sparkles, Award, Cpu, Compass, FlaskConical } from "lucide-react";

export const metadata = {
  title: "Academics Overview | Cambridge International School, Mandi",
  description: "Explore the comprehensive CBSE & Cambridge integrated academic framework at Cambridge Mandi from Pre-Primary to Class XII.",
};

export default function AcademicsPage() {
  const sections = [
    {
      title: "Pre-Primary (Early Years)",
      grades: "Nursery, LKG, UKG (Age 3-5)",
      desc: "Montessori & Reggio Emilia inspired play-way foundation cultivating phonetics, sensory motor skills, and creative imagination.",
      link: "/academics/pre-primary",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Primary Wing",
      grades: "Grades 1 to 5 (Age 6-10)",
      desc: "Experiential learning building robust fundamentals in mathematics, scientific curiosity, language literacy, and digital coding basics.",
      link: "/academics/primary",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Middle School Wing",
      grades: "Grades 6 to 8 (Age 11-13)",
      desc: "Inquiry-based STEM curriculum, hands-on physics, chemistry & biology laboratories, robotics engineering, and foreign languages.",
      link: "/academics/middle-school",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Senior Secondary Wing",
      grades: "Grades 9 to 12 (Age 14-18)",
      desc: "Rigorous CBSE Board mastery with specialized 4-stream choices (Medical, Non-Med, Commerce, Humanities) + JEE/NEET Foundation.",
      link: "/academics/senior-secondary",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div>
      <PageHeader
        badge="Academic Framework"
        title="Comprehensive Learning Continuum (K-12)"
        description="Empowering students through CBSE curriculum excellence, Cambridge inquiry methodologies, and state-of-the-art STEM laboratories."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
            CBSE Affiliation No. 630198
          </span>
          <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
            Where Curiosity Transforms into Intellectual Mastery
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Our academic roadmap is designed to guide learners seamlessly across four developmental stages, equipping them with the depth, versatility, and analytical prowess needed for global success.
          </p>
        </div>

        {/* 4 Wings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sec.color} flex items-center justify-center text-white shadow-md`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                    {sec.grades}
                  </span>
                  <h3 className="text-xl font-bold text-school-primary dark:text-white mt-1">
                    {sec.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={sec.link}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-school-secondary hover:text-blue-700 dark:hover:text-amber-400 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore {sec.title} Wing</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Stream Differentiators */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pedagogical Edge</span>
            <h3 className="text-2xl font-bold text-school-primary dark:text-white mt-1">
              Integrated Competitive Exam Coaching & Research Focus
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Tailored preparation seamlessly embedded within the regular school timetable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <FlaskConical className="w-6 h-6 text-school-secondary" />
              <h4 className="font-bold text-sm text-school-primary dark:text-white">JEE & NEET Prep</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dedicated coaching module for Classes 11 & 12 led by IIT & AIIMS alumni mentors.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <Cpu className="w-6 h-6 text-amber-500" />
              <h4 className="font-bold text-sm text-school-primary dark:text-white">Olympiads & STEM</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Structured mentorship for National Science Olympiad, Math Olympiad, and Robotics.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <Award className="w-6 h-6 text-emerald-500" />
              <h4 className="font-bold text-sm text-school-primary dark:text-white">University Placements</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Career counseling and portfolio building for top Indian & global university admissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
