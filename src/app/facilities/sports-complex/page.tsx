import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Trophy, CheckCircle2, ArrowRight, ShieldCheck, Flame, Compass } from "lucide-react";

export const metadata = {
  title: "Sports Complex & Aquatic Center | Cambridge International School, Mandi",
  description: "Olympic standard sports infrastructure, semi-Olympic heated swimming pool, FIFA turf, and synthetic courts at Cambridge Mandi.",
};

export default function SportsComplexPage() {
  const sports = [
    { title: "Heated Semi-Olympic Swimming Pool", desc: "6-lane 25m all-weather temperature-controlled pool with NIS certified coaches & lifeguards." },
    { title: "FIFA-Standard Football Turf", desc: "Lush green natural grass pitch surrounded by Himalayan mountains with international dimension markings." },
    { title: "FIBA Basketball & Tennis Arena", desc: "Multi-court cushioned synthetic surfaces with floodlights for evening training camps." },
    { title: "Indoor Badminton & Table Tennis Hall", desc: "Wooden spring-floored 4-court badminton arena and automated TT ball-serving machines." },
    { title: "10m Air Rifle Shooting Range", desc: "Olympic electronic target scoring systems coached by former national marksmen." },
    { title: "Martial Arts, Taekwondo & Yoga", desc: "Dedicated dojo and open-air yoga pavilion promoting mind-body equilibrium and self-defense." },
  ];

  return (
    <div>
      <PageHeader
        badge="Athletic Excellence"
        title="Olympic Sports Complex & Aquatic Center"
        description="Fostering physical stamina, teamwork, resilience, and championship pedigree across 12+ competitive sporting disciplines."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Facilities", href: "/facilities" },
          { label: "Sports Complex" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Champions in the Making
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              World-Class Arenas Nurturing National Champions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              At CIS Mandi, physical education is an integral pillar of character building. Directed by Col. (Retd.) Harpreet Singh and NIS certified trainers, our athletic program has produced national medalists in swimming, sprint athletics, and shooting.
            </p>

            <div className="pt-2">
              <Link
                href="/admissions/apply"
                className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                <span>Apply for Sports Excellence Batches</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80"
                alt="Sports Complex"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* 6 Sports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-base text-school-primary dark:text-white flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{item.title}</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
