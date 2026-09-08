"use client";

import React from "react";
import { Users, GraduationCap, Award, Trophy, BookCheck, ShieldCheck } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

export default function StatsCounter() {
  const { t } = useTheme();

  const stats = [
    {
      icon: Users,
      value: "2,500+",
      label: t("students"),
      sublabel: "From Pre-Primary to Class XII",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: GraduationCap,
      value: "150+",
      label: t("faculty"),
      sublabel: "Trained & Cambridge Certified",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Award,
      value: "98.4%",
      label: t("distinction"),
      sublabel: "CBSE Board Exam Avg Percentile",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Trophy,
      value: "45+",
      label: t("awards"),
      sublabel: "National & State Laurels",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <section className="relative z-20 -mt-12 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
      {/* Ambient Glass Glow Orbs */}
      <div className="glass-orb-blue -top-20 left-1/4 opacity-40" />
      <div className="glass-orb-gold -bottom-20 right-1/4 opacity-30" />

      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="glass-card-interactive flex items-center space-x-4 p-5 sm:p-6 rounded-2xl group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-white/20`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-school-primary dark:text-white block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                  {stat.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                  {stat.sublabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
