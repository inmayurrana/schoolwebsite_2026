import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Target, Compass, Eye, Heart, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Mission & Vision | Cambridge International School, Mandi",
  description: "Explore the core mission, vision, and values that guide Cambridge International School Mandi.",
};

export default function MissionVisionPage() {
  const coreValues = [
    { title: "Integrity & Ethics", desc: "Upholding unwavering honesty, transparency, and moral courage in all academic and personal pursuits." },
    { title: "Academic Inquisitiveness", desc: "Fostering a spirit of question-driven inquiry, empirical experimentation, and intellectual rigor." },
    { title: "Empathy & Compassion", desc: "Cultivating genuine care for diverse communities, mutual respect, and active civic participation." },
    { title: "Environmental Stewardship", desc: "Protecting our pristine Himalayan ecosystems and instilling eco-conscious lifestyle choices." },
    { title: "Global Citizenship", desc: "Understanding interconnected global cultures while remaining firmly anchored in Indian heritage." },
    { title: "Resilience & Grit", desc: "Encouraging sportsmanship, perseverance through adversity, and continuous self-improvement." },
  ];

  return (
    <div>
      <PageHeader
        badge="Philosophy & Core Values"
        title="Mission, Vision & Guiding Philosophy"
        description="Our mission is to foster compassionate, intellectually versatile, and future-ready global leaders empowered with character and wisdom."
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
            <h2 className="text-2xl font-extrabold text-school-primary dark:text-white">
              Our Vision
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              "To be recognized as the premier Himalayan center of benchmark international education, empowering young minds with critical intelligence, creative ingenuity, and ethical leadership to build a progressive and harmonious global society."
            </p>
          </div>

          {/* Mission Card */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-school-primary dark:text-white">
              Our Mission
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              "To provide an inclusive, safe, and academically stimulating learning ecosystem combining experiential CBSE-Cambridge pedagogy, world-class STEM robotics infrastructure, competitive athletic training, and profound moral values."
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
              The 6 Core Values of CIS Mandi
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              The moral compass guiding our students, educators, and administrative community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2.5"
              >
                <div className="flex items-center space-x-2 text-school-secondary dark:text-amber-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{val.title}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
