import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { BookOpen, CheckCircle2, ArrowRight, Lightbulb, Compass, Award } from "lucide-react";

export const metadata = {
  title: "Primary Wing (Grades 1-5) | Cambridge International School, Mandi",
  description: "Learn about the Primary School curriculum and experiential learning at Cambridge Mandi.",
};

export default function PrimaryPage() {
  const subjects = [
    { name: "English Language Arts", desc: "Grammar, creative writing, public speaking, and reading comprehension" },
    { name: "Mathematics & Logic", desc: "Concept-first arithmetic, geometry, mental math, and Vedic tricks" },
    { name: "Environmental Studies (EVS)", desc: "Scientific curiosity, Himalayan flora & fauna, and conservation" },
    { name: "Second Language (Hindi)", desc: "Literature, poetry, grammar, and expressive articulation" },
    { name: "Digital Coding & ICT", desc: "Block coding with Scratch, digital safety, and typing fluency" },
    { name: "Visual & Performing Arts", desc: "Sketching, Indian classical music, theater drama, and folk dance" },
  ];

  return (
    <div>
      <PageHeader
        badge="Foundational Stage"
        title="Primary Wing (Grades 1 to 5)"
        description="Fostering academic confidence, conceptual clarity, and boundless creativity during the critical formative years."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "Primary Wing" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Ages 6 to 10 Years
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Building Solid Intellectual & Moral Foundations
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              In the Primary Wing of CIS Mandi, education transitions into structured inquiry. Students are encouraged to experiment, ask probing questions, and understand the real-world application of concepts.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Our 4K interactive smart classrooms, well-stocked junior library, and dedicated outdoor activity periods ensure that every child develops both high cognitive aptitude and physical stamina.
            </p>

            <div className="pt-2">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Register for Grade 1-5 Admissions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
                alt="Primary Students"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-school-primary dark:text-white text-center">
            Primary Curricular Areas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((s, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-school-primary dark:text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-school-secondary" />
                  <span>{s.name}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
