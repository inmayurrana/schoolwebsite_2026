import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Cpu, FlaskConical, Globe2, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Middle School (Grades 6-8) | Cambridge International School, Mandi",
  description: "Discover Middle School STEM inquiry, robotics, science labs, and leadership at Cambridge Mandi.",
};

export default function MiddleSchoolPage() {
  return (
    <div>
      <PageHeader
        badge="Preparatory & Middle Wing"
        title="Middle School (Grades 6 to 8)"
        description="Transitioning to advanced conceptual inquiry, laboratory experimentation, coding, and inter-school leadership."
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
              Ages 11 to 13 Years
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              Inquiry, Innovation & Scientific Discovery
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Middle School marks a vital developmental bridge where students transition into specialized disciplines. At CIS Mandi, science branches into dedicated Physics, Chemistry, and Biology laboratories, while mathematics expands into rigorous algebra and geometry.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Students begin weekly sessions in the <strong>Himalayan Robotics & AI Innovation Lab</strong>, participating in Hackathons, Model United Nations (MUN), and Olympiad training camps.
            </p>

            <div className="pt-2">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Apply for Grade 6-8 Admissions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"
                alt="Middle School Science"
                className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Feature 3-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <FlaskConical className="w-8 h-8 text-school-secondary" />
            <h3 className="font-bold text-base text-school-primary dark:text-white">Hands-on Science Labs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Individual lab stations for Physics, Chemistry, and Biology practicals every week.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Cpu className="w-8 h-8 text-amber-500" />
            <h3 className="font-bold text-base text-school-primary dark:text-white">Robotics & Arduino</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Students build obstacle-avoiding rovers, sensor circuits, and Python automation scripts.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Globe2 className="w-8 h-8 text-emerald-500" />
            <h3 className="font-bold text-base text-school-primary dark:text-white">Third Language Options</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Choice between Sanskrit and French to foster multilingual versatility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
