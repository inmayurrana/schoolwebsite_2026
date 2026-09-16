export const revalidate = 60;
import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Quote } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Principal's Message | Cambridge International School, Mandi",
  description: "Welcome address and academic roadmap from Dr. Sunita Sharma, Principal of Cambridge International School Mandi.",
};

export default async function PrincipalMessagePage() {
  let pageData: any = null;
  try {
    pageData = await prisma.pageContent.findUnique({
      where: { slug: "principal-message" },
    });
  } catch (_) {}

  const custom = pageData?.customStylesJson ? JSON.parse(pageData.customStylesJson) : {};

  const title = pageData?.heroTitle || "Fostering Curiosity, Character & Excellence";
  const badge = pageData?.heroBadge || "Principal's Desk";
  const description = pageData?.heroSubtitle || "Welcome to an educational sanctuary where every child's innate potential is recognized, nurtured, and elevated.";
  const authorName = custom.authorName || "Dr. Sunita Sharma";
  const authorTitle = custom.authorTitle || "Principal & Academic Director";
  const authorOrg = custom.authorOrg || "Cambridge International School Mandi";
  const authorImage = custom.authorImage || pageData?.heroImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80";
  const quote = custom.quote || '"The mind is not a vessel to be filled, but a fire to be kindled."';
  const quoteAuthor = custom.quoteAuthor || "Plutarch";
  const headline = custom.storyHeadline || "Welcome to Cambridge International School Mandi";

  const defaultParagraphs = [
    "At Cambridge International School Mandi, our mission transcends traditional textbook instruction. We aim to kindle an enduring passion for discovery, critical inquiry, and creative expression in every student entrusted to our care.",
    "Our pedagogy marries international academic benchmarks with compassionate values. Through experiential learning in smart classrooms, high-tech robotics innovation labs, and holistic sports development, our students blossom into well-rounded, courageous innovators ready to lead with empathy.",
    "I invite all parents and guardians to walk alongside us in this exhilarating educational odyssey."
  ];

  const storyParagraphs = custom.mainStory
    ? custom.mainStory.split(/\n\n+/).filter(Boolean)
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
          { label: "Principal's Message" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16">
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
      </div>
    </div>
  );
}
