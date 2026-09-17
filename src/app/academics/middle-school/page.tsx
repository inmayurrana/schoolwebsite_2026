export const revalidate = 60;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Cpu, FlaskConical, Globe2, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Middle School (Grades 6-8) | Cambridge International School, Mandi",
  description: "Discover Middle School STEM inquiry, robotics, science labs, and leadership at Cambridge Mandi.",
};

import { getCachedPageContent } from "@/lib/pageContentCache";

export default async function MiddleSchoolPage() {
  const pageData: any = await getCachedPageContent("middle-school");
  const custom = pageData?.customStylesJson ? JSON.parse(pageData.customStylesJson) : {};

  const badge = pageData?.heroBadge || "Preparatory & Middle Wing";
  const title = pageData?.heroTitle || "Middle School (Grades 6 to 8)";
  const description =
    pageData?.heroSubtitle ||
    "Transitioning to advanced conceptual inquiry, laboratory experimentation, coding, and inter-school leadership.";

  const ageGroup = custom.wingAgeGroup || "Ages 11 to 13 Years";
  const headline = custom.wingHeadline || "Inquiry, Innovation & Scientific Discovery";
  const p1 =
    custom.wingParagraph1 ||
    "Middle School marks a vital developmental bridge where students transition into specialized disciplines. At CIS Mandi, science branches into dedicated Physics, Chemistry, and Biology laboratories, while mathematics expands into rigorous algebra and geometry.";
  const p2 =
    custom.wingParagraph2 ||
    "Students begin weekly sessions in the Himalayan Robotics & AI Innovation Lab, participating in Hackathons, Model United Nations (MUN), and Olympiad training camps.";
  const ctaText = custom.wingCtaText || "Apply for Grade 6-8 Admissions";
  const ctaLink = custom.wingCtaLink || "/admissions/apply";
  const heroImage =
    pageData?.heroImage ||
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80";

  const defaultFeatures = [
    { title: "Hands-on Science Labs", desc: "Individual lab stations for Physics, Chemistry, and Biology practicals every week.", icon: FlaskConical, color: "text-school-secondary" },
    { title: "Robotics & Arduino", desc: "Students build obstacle-avoiding rovers, sensor circuits, and Python automation scripts.", icon: Cpu, color: "text-amber-500" },
    { title: "Third Language Options", desc: "Choice between Sanskrit and French to foster multilingual versatility.", icon: Globe2, color: "text-emerald-500" },
  ];
  const rawFeatures = Array.isArray(custom.middleFeatures) && custom.middleFeatures.length > 0 ? custom.middleFeatures : defaultFeatures;
  const features = rawFeatures.map((f: any, idx: number) => ({
    title: f.title,
    desc: f.desc,
    Icon: [FlaskConical, Cpu, Globe2][idx % 3],
    color: ["text-school-secondary", "text-amber-500", "text-emerald-500"][idx % 3],
  }));

  return (
    <div>
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "Middle School" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {ageGroup}
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              {headline}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {p1}
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              {p2}
            </p>

            <div className="pt-2">
              <Link
                href={ctaLink}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={heroImage}
                alt="Middle School Science"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Feature 3-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat: any, idx: number) => {
            const Icon = feat.Icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <Icon className={`w-8 h-8 ${feat.color}`} />
                <h3 className="font-bold text-base text-school-primary dark:text-white">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
