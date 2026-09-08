import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { BookOpen, CheckCircle2, ArrowRight, Sparkles, BookMarked, Globe } from "lucide-react";

export const metadata = {
  title: "Central Digital Library | Cambridge International School, Mandi",
  description: "Discover the 25,000+ volume knowledge repository and digital e-library at Cambridge Mandi.",
};

export default function LibraryPage() {
  const features = [
    "Vast physical collection of 25,000+ fiction, non-fiction, reference & encyclopedic titles",
    "Subscriptions to 40+ national and international academic journals & periodicals",
    "Digital E-Library kiosks with Kindle readers and access to global research repositories",
    "Dedicated junior storytelling reading lounge with colorful beanbags & picture books",
    "Silent research cubicles and collaborative group study chambers",
    "Automated barcode issue & return system with online parent book tracking catalog",
  ];

  return (
    <div>
      <PageHeader
        badge="Knowledge & Research Hub"
        title="Central Digital Library & Reading Lounge"
        description="A serene haven of literature, scientific journals, and digital research archives fostering a deep passion for reading."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Central Library" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              25,000+ Books & Digital Journals
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Igniting the Imagination and Sustaining Deep Research
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              The Central Library of CIS Mandi is the intellectual heartbeat of our campus. Bathed in natural Himalayan sunlight with panoramic mountain views, it provides an inspiring atmosphere for reading, creative writing, and competitive exam preparation.
            </p>

            <div className="space-y-2.5 pt-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Explore Campus Admissions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80"
                alt="Central Library"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
