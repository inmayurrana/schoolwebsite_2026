import React from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { BookOpen, ArrowRight, FlaskConical, Cpu, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Academics Overview | Cambridge International School, Mandi",
  description: "Explore the comprehensive CBSE & Cambridge integrated academic framework at Cambridge Mandi from Pre-Primary to Class XII.",
};

const DEFAULT_SECTIONS = [
  {
    title: "Pre-Primary (Early Years)",
    grades: "Nursery, LKG, UKG (Age 3-5)",
    desc: "Montessori & Reggio Emilia inspired play-way foundation cultivating phonetics, sensory motor skills, and creative imagination.",
    link: "/academics/pre-primary",
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
  },
  {
    title: "Primary Wing",
    grades: "Grades 1 to 5 (Age 6-10)",
    desc: "Experiential learning building robust fundamentals in mathematics, scientific curiosity, language literacy, and digital coding basics.",
    link: "/academics/primary",
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800",
  },
  {
    title: "Middle School Wing",
    grades: "Grades 6 to 8 (Age 11-13)",
    desc: "Inquiry-based STEM curriculum, hands-on physics, chemistry & biology laboratories, robotics engineering, and foreign languages.",
    link: "/academics/middle-school",
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  },
  {
    title: "Senior Secondary Wing",
    grades: "Grades 9 to 12 (Age 14-18)",
    desc: "Rigorous CBSE Board mastery with specialized 4-stream choices (Medical, Non-Med, Commerce, Humanities) + JEE/NEET Foundation.",
    link: "/academics/senior-secondary",
    color: "from-purple-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
  },
];

import { getCachedPageContent } from "@/lib/pageContentCache";

export default async function AcademicsPage() {
  const pageData: any = await getCachedPageContent("academics");

  const custom = pageData?.customStylesJson ? JSON.parse(pageData.customStylesJson) : {};

  let dynamicSections = [
    {
      title: custom.wing1Title || DEFAULT_SECTIONS[0].title,
      grades: custom.wing1Badge || DEFAULT_SECTIONS[0].grades,
      desc: custom.wing1Desc || DEFAULT_SECTIONS[0].desc,
      link: custom.wing1Link || DEFAULT_SECTIONS[0].link,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: custom.wing2Title || DEFAULT_SECTIONS[1].title,
      grades: custom.wing2Badge || DEFAULT_SECTIONS[1].grades,
      desc: custom.wing2Desc || DEFAULT_SECTIONS[1].desc,
      link: custom.wing2Link || DEFAULT_SECTIONS[1].link,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: custom.wing3Title || DEFAULT_SECTIONS[2].title,
      grades: custom.wing3Badge || DEFAULT_SECTIONS[2].grades,
      desc: custom.wing3Desc || DEFAULT_SECTIONS[2].desc,
      link: custom.wing3Link || DEFAULT_SECTIONS[2].link,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: custom.wing4Title || DEFAULT_SECTIONS[3].title,
      grades: custom.wing4Badge || DEFAULT_SECTIONS[3].grades,
      desc: custom.wing4Desc || DEFAULT_SECTIONS[3].desc,
      link: custom.wing4Link || DEFAULT_SECTIONS[3].link,
      color: "from-purple-500 to-pink-600",
    },
  ];

  if (pageData?.sectionsJson) {
    try {
      const parsedBlocks = JSON.parse(pageData.sectionsJson);
      if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0 && parsedBlocks[0].items?.length > 0) {
        dynamicSections = parsedBlocks[0].items.map((it: any, idx: number) => ({
          title: it.title || DEFAULT_SECTIONS[idx]?.title || "Academic Stage",
          grades: it.badge || DEFAULT_SECTIONS[idx]?.grades || "Grades",
          desc: it.description || DEFAULT_SECTIONS[idx]?.desc || "",
          link: it.link || DEFAULT_SECTIONS[idx]?.link || "/academics",
          color: DEFAULT_SECTIONS[idx]?.color || "from-amber-500 to-orange-600",
        }));
      }
    } catch (_) {}
  }

  const badge = pageData?.heroBadge || "Academic Curriculum • Cambridge International School";
  const title = pageData?.heroTitle || "Academic Curriculum";
  const description = pageData?.heroSubtitle || "Integrated CBSE & Cambridge framework";
  const affiliation = custom.affiliationLabel || "CBSE Affiliation No. 630198";
  const headline = custom.storyHeadline || "Welcome to Academic Curriculum";
  const mainStory = custom.mainStory || "Integrated CBSE & Cambridge framework. Cambridge International School Mandi fosters an engaging, safe, and academically rigorous environment where every learner thrives.";
  const pedagogyBadge = custom.pedagogyBadge || "Pedagogical Edge";
  const pedagogyTitle = custom.pedagogyTitle || "Integrated Competitive Exam Coaching & Research Focus";
  const pedagogySubtitle = custom.pedagogySubtitle || "Tailored preparation seamlessly embedded within the regular school timetable.";

  return (
    <div>
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
            {affiliation}
          </span>
          <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
            {headline}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {mainStory}
          </p>
        </div>

        {/* 4 Wings Cards with Dynamic Hover Color-Shifting Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dynamicSections.map((sec, idx) => {
            const hoverConfig = [
              {
                // Pre-Primary (Amber/Orange)
                bg: "hover:bg-gradient-to-br hover:from-amber-500/15 hover:via-orange-500/10 hover:to-white dark:hover:from-amber-950/40 dark:hover:via-orange-950/20 dark:hover:to-slate-900",
                border: "hover:border-amber-400 dark:hover:border-amber-400",
                shadow: "hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.25)]",
                text: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
                badge: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
              },
              {
                // Primary (Blue/Indigo)
                bg: "hover:bg-gradient-to-br hover:from-blue-500/15 hover:via-indigo-500/10 hover:to-white dark:hover:from-blue-950/40 dark:hover:via-indigo-950/20 dark:hover:to-slate-900",
                border: "hover:border-blue-400 dark:hover:border-blue-400",
                shadow: "hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.25)]",
                text: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
                badge: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
              },
              {
                // Middle School (Emerald/Teal)
                bg: "hover:bg-gradient-to-br hover:from-emerald-500/15 hover:via-teal-500/10 hover:to-white dark:hover:from-emerald-950/40 dark:hover:via-teal-950/20 dark:hover:to-slate-900",
                border: "hover:border-emerald-400 dark:hover:border-emerald-400",
                shadow: "hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.25)]",
                text: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
                badge: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
              },
              {
                // Senior Secondary (Purple/Pink)
                bg: "hover:bg-gradient-to-br hover:from-purple-500/15 hover:via-pink-500/10 hover:to-white dark:hover:from-purple-950/40 dark:hover:via-pink-950/20 dark:hover:to-slate-900",
                border: "hover:border-purple-400 dark:hover:border-purple-400",
                shadow: "hover:shadow-[0_20px_50px_-10px_rgba(168,85,247,0.25)]",
                text: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
                badge: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
              },
            ][idx % 4];

            return (
              <div
                key={idx}
                className={`glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 ${hoverConfig.bg} ${hoverConfig.border} ${hoverConfig.shadow}`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${sec.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`text-xs font-semibold text-school-secondary uppercase tracking-wider transition-colors duration-300 ${hoverConfig.badge}`}>
                      {sec.grades}
                    </span>
                    <h3 className={`text-xl font-bold text-school-primary dark:text-white mt-1 transition-colors duration-300 ${hoverConfig.text}`}>
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
                    className={`inline-flex items-center space-x-2 text-xs font-bold text-school-secondary hover:text-blue-700 dark:hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300 ${hoverConfig.text}`}
                  >
                    <span>Explore {sec.title} Wing</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stream Differentiators */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{pedagogyBadge}</span>
            <h3 className="text-2xl font-bold text-school-primary dark:text-white mt-1">
              {pedagogyTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              {pedagogySubtitle}
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
