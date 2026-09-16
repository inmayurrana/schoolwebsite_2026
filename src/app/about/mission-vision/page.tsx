export const revalidate = 60;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Target, Compass, Eye, Heart, Shield, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Mission & Vision | Cambridge International School, Mandi",
  description: "Explore the core mission, vision, and values that guide Cambridge International School Mandi.",
};

export default async function MissionVisionPage() {
  let pageData: any = null;
  try {
    pageData = await prisma.pageContent.findUnique({
      where: { slug: "mission-vision" },
    });
  } catch (_) {}

  const custom = pageData?.customStylesJson ? JSON.parse(pageData.customStylesJson) : {};

  const title = pageData?.heroTitle || "Mission, Vision & Guiding Philosophy";
  const badge = pageData?.heroBadge || "Philosophy & Core Values";
  const description = pageData?.heroSubtitle || "Our mission is to foster compassionate, intellectually versatile, and future-ready global leaders empowered with character and wisdom.";

  const missionText = custom.missionText || "To create a stimulating, safe, and holistic learning sanctuary where every student discovers their innate brilliance, achieves benchmark academic excellence, and cultivates compassionate leadership rooted in Indian cultural ethos.";
  const visionText = custom.visionText || "To be universally acclaimed as Himachal Pradesh's benchmark center for progressive education, inspiring generations of resilient global thinkers, ethical problem solvers, and visionary change-makers.";

  return (
    <div>
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Mission & Vision" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* Mission & Vision 2-Col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-school-secondary to-blue-600 text-white flex items-center justify-center shadow-lg">
              <Eye className="w-7 h-7 text-amber-300" />
            </div>
            <span className="text-xs font-bold text-school-secondary dark:text-sky-400 uppercase tracking-widest block">
              Our Vision
            </span>
            <h2 className="text-2xl font-bold text-school-primary dark:text-white">
              Shaping Future-Ready Global Citizens
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {visionText}
            </p>
          </div>

          {/* Mission Card */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-school-primary to-blue-950 text-white flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
              Our Mission
            </span>
            <h2 className="text-2xl font-bold text-school-primary dark:text-white">
              Holistic Excellence & Character Building
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              {missionText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
