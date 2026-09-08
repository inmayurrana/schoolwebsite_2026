import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Monitor, CheckCircle2, ArrowRight, ShieldCheck, Code2, Server } from "lucide-react";

export const metadata = {
  title: "Computer & Coding Labs | Cambridge International School, Mandi",
  description: "High-speed AI computer workstations, Python coding terminals, and cybersecurity at Cambridge Mandi.",
};

export default function ComputerLabsPage() {
  const highlights = [
    "Over 120 latest-generation Intel Core i7 & GPU-accelerated computing workstations",
    "Dedicated 1 Gbps symmetric optical fiber broadband with redundant failovers",
    "Curriculum covering Python, Java, SQL, Web Development, and Scratch for juniors",
    "Cyber safety firewalls with strict content monitoring and data privacy filters",
    "Uninterrupted industrial online UPS power backup ensuring zero disruption",
  ];

  return (
    <div>
      <PageHeader
        badge="Digital & Coding Literacy"
        title="Computer & AI Computing Laboratories"
        description="Empowering students with 21st-century programming, artificial intelligence, and digital ethics."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Computer Labs" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Computing Excellence
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Cultivating Algorithmic Thinking & AI Fluency
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              In an era powered by software and intelligent algorithms, CIS Mandi equips students with robust computational problem-solving abilities from Grade 1 through Class 12.
            </p>

            <div className="space-y-2.5 pt-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Enroll in AI & CS Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                alt="Computer Lab"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
