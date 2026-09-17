export const revalidate = 60;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import DynamicSectionRenderer from "@/components/common/DynamicSectionRenderer";
import { Quote } from "lucide-react";
import { getCachedPageContent } from "@/lib/pageContentCache";

export const metadata = {
  title: "Chairman's Message | Cambridge International School, Mandi",
  description: "Read the visionary message from Sh. Bhim Singh Jamwal, Chairman of Cambridge International School Mandi.",
};

export default async function ChairmanMessagePage() {
  const pageData: any = await getCachedPageContent("chairman-message");

  const custom = pageData?.customStylesJson ? JSON.parse(pageData.customStylesJson) : {};
  const sections = pageData?.sectionsJson ? JSON.parse(pageData.sectionsJson) : [];

  const title = pageData?.heroTitle || "Visionary Leadership & Societal Commitment";
  const badge = pageData?.heroBadge || "Chairman's Desk";
  const description = pageData?.heroSubtitle || "A personal message from Sh. Bhim Singh Jamwal on shaping future leaders with courage, character, and global competence.";
  const authorName = custom.authorName || custom.chairmanName || "Sh. Bhim Singh Jamwal";
  const authorTitle = custom.authorTitle || custom.chairmanTitle || "Chairman & Managing Trustee";
  const authorOrg = custom.authorOrg || custom.chairmanOrg || "Cambridge Education Foundation";
  const authorImage = custom.authorImage || custom.chairmanImage || pageData?.heroImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";
  const quote = custom.quote || custom.chairmanQuote || '"Education is the most powerful weapon which you can use to change the world."';
  const quoteAuthor = custom.quoteAuthor || "Nelson Mandela";
  const headline = custom.storyHeadline || "Dear Parents, Educators, and Esteemed Students,";

  const defaultParagraphs = [
    "It brings me immense joy and pride to welcome you to Cambridge International School, Mandi. When we laid the foundation stone of this institution, our guiding ambition was clear: to bring the highest international standards of learning to the children of Himachal Pradesh without compelling families to seek boarding thousands of miles away.",
    "Today, CIS Mandi stands tall as a beacon of academic distinction, technological innovation, and ethical uprightness. We understand that the 21st-century world demands far more than rote memorization. It requires problem-solvers, resilient innovators, ethical decision-makers, and compassionate citizens.",
    "Our 10-acre Himalayan campus provides the optimal synthesis of physical fitness, mental agility, and spiritual peace. From our state-of-the-art Robotics and AI laboratories to our Olympic-standard swimming pool and synthetic athletic tracks, every infrastructure element has been built to inspire greatness.",
    "I invite you to partner with us in this noble mission of sculpting young minds. Together, let us empower our children to soar on global wings while keeping their roots firmly anchored in the timeless values of our culture."
  ];

  const storyParagraphs = custom.mainStory || custom.chairmanMessage
    ? (custom.mainStory || custom.chairmanMessage).split(/\n\n+/).filter(Boolean)
    : defaultParagraphs;

  return (
    <div>
      <PageHeader
        badge={badge}
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Chairman's Message" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-card p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src={authorImage}
                alt={authorName}
                className="w-full h-80 object-cover rounded-2xl shadow-md"
              />
              <div className="mt-4 text-center space-y-1">
                <h3 className="text-xl font-bold text-school-primary dark:text-white">
                  {authorName}
                </h3>
                <p className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                  {authorTitle}
                </p>
                <p className="text-[11px] text-slate-500">{authorOrg}</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <p className="font-bold">{quote}</p>
              {quoteAuthor && <p className="text-[11px] opacity-80">— {quoteAuthor}</p>}
            </div>
          </div>

          {/* Letter Column */}
          <div className="lg:col-span-8 glass-card p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative">
            <Quote className="w-12 h-12 text-amber-400/20 absolute top-8 right-8 pointer-events-none" />

            <div className="space-y-4 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
              <h2 className="text-2xl font-bold text-school-primary dark:text-white">
                {headline}
              </h2>

              {storyParagraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-base text-school-primary dark:text-white font-heading">
                  {authorName}
                </p>
                <p className="text-xs text-slate-500">{authorTitle}, CIS Mandi</p>
              </div>
              <div className="font-serif italic text-xl text-slate-400">
                {authorName}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Modular Canvas Sections */}
        {sections && sections.length > 0 && (
          <DynamicSectionRenderer sections={sections} customStyles={custom} />
        )}
      </div>
    </div>
  );
}
