import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import { prisma } from "@/lib/prisma";
import { Award, Trophy, Sparkles, Medal, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Hall of Fame & Achievements | Cambridge International School, Mandi",
  description: "Celebrate the national, state, and international laurels won by Cambridge Mandi students across Academics, STEM, and Sports.",
};

export default async function AchievementsPage() {
  let achievements: any[] = [];
  try {
    achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error fetching achievements:", err);
  }

  return (
    <div>
      <PageHeader
        badge="Hall of Fame"
        title="Student Achievements & National Laurels"
        description="Celebrating our young scholars, roboticists, athletes, and artists who continue to bring glory to Himachal Pradesh on national and global platforms."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Achievements" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all group flex flex-col justify-between"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={ach.photoUrl}
                  alt={ach.studentName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-school-primary/90 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      {ach.category}
                    </span>
                    <p className="text-white text-xs font-semibold mt-1 opacity-90">{ach.year}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-school-secondary">{ach.grade}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      {ach.rank}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-school-primary dark:text-white">
                    {ach.studentName}
                  </h3>
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
