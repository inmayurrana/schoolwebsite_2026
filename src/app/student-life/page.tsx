import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Sparkles, Palette, Music, Compass, Flag, Heart, Users, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Student Life & Clubs | Cambridge International School, Mandi",
  description: "Explore the vibrant student life, 4-house system, Model UN, music, drama, and adventure clubs at Cambridge Mandi.",
};

export default function StudentLifePage() {
  const houses = [
    { name: "Himalaya House (Blue)", motto: "Fortitude & Grandeur", color: "from-blue-600 to-indigo-700" },
    { name: "Shivalik House (Green)", motto: "Growth & Harmony", color: "from-emerald-600 to-teal-700" },
    { name: "Beas House (Red)", motto: "Passion & Energy", color: "from-rose-600 to-red-700" },
    { name: "Pir Panjal House (Yellow)", motto: "Wisdom & Radiance", color: "from-amber-500 to-orange-600" },
  ];

  const clubs = [
    { title: "Model United Nations & Debating", desc: "Developing diplomatic discourse, global problem-solving, and parliamentary oratorical skills." },
    { title: "Robotics & AI Innovation Circle", desc: "Building hardware prototypes, drone telemetry, and competitive hackathon projects." },
    { title: "Eco-Warriors & Nature Conservation", desc: "Tree plantation drives, plastic-free campaigns, and Himalayan river preservation." },
    { title: "Performing Arts, Music & Theater", desc: "Indian classical instrumental music, western choir, theater productions, and classical dance." },
    { title: "Visual Arts & Pottery Studio", desc: "Canvas oil painting, clay sculpting, digital graphic design, and calligraphy." },
    { title: "Himalayan Adventure & Trekking", desc: "Organized mountain treks, rock climbing, camping, and outdoor leadership camps." },
  ];

  return (
    <div>
      <PageHeader
        badge="Holistic Development"
        title="Student Life, House System & Co-Curriculars"
        description="Fostering teamwork, creative expression, leadership, and camaraderie through 15+ student clubs and house competitions."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Student Life" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16">
        {/* House System */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
              Camaraderie & Healthy Competition
            </span>
            <h2 className="text-3xl font-extrabold text-school-primary dark:text-white">
              The Four School Houses
            </h2>
            <p className="text-xs text-slate-500">
              Every student belongs to one of four houses, competing annually for the prestigious Cock House Championship Trophy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {houses.map((h, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3 text-center group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${h.color} text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform`}>
                  <Flag className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-school-primary dark:text-white">{h.name}</h3>
                <p className="text-xs text-slate-500 italic">"{h.motto}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-school-primary dark:text-white text-center">
            Active Student Clubs & Societies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((c, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-school-primary dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{c.title}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 pl-6">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
