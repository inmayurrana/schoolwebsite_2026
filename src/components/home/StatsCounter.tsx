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
    <section className="relative z-20 -mt-12 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 transition-colors duration-500">
      {/* Ambient Glass Glow Orbs */}
      <div className="glass-orb-blue -top-20 left-1/4 opacity-40" />
      <div className="glass-orb-gold -bottom-20 right-1/4 opacity-30" />

      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 hover:bg-gradient-to-br hover:from-white hover:via-amber-50/20 hover:to-white dark:hover:from-slate-900 dark:hover:via-amber-950/15 dark:hover:to-slate-900 hover:border-amber-400/50 transition-all duration-500">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const statHoverConfigs = [
            {
              bg: "hover:bg-gradient-to-br hover:from-blue-500/15 hover:via-indigo-500/10 hover:to-white dark:hover:from-blue-950/40 dark:hover:via-indigo-950/20 dark:hover:to-[#071933]",
              border: "hover:border-blue-400 dark:hover:border-blue-400",
              shadow: "hover:shadow-[0_20px_45px_-12px_rgba(59,130,246,0.3)]",
            },
            {
              bg: "hover:bg-gradient-to-br hover:from-amber-500/15 hover:via-orange-500/10 hover:to-white dark:hover:from-amber-950/40 dark:hover:via-orange-950/20 dark:hover:to-[#071933]",
              border: "hover:border-amber-400 dark:hover:border-amber-400",
              shadow: "hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.3)]",
            },
            {
              bg: "hover:bg-gradient-to-br hover:from-emerald-500/15 hover:via-teal-500/10 hover:to-white dark:hover:from-emerald-950/40 dark:hover:via-teal-950/20 dark:hover:to-[#071933]",
              border: "hover:border-emerald-400 dark:hover:border-emerald-400",
              shadow: "hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.3)]",
            },
            {
              bg: "hover:bg-gradient-to-br hover:from-purple-500/15 hover:via-pink-500/10 hover:to-white dark:hover:from-purple-950/40 dark:hover:via-pink-950/20 dark:hover:to-[#071933]",
              border: "hover:border-purple-400 dark:hover:border-purple-400",
              shadow: "hover:shadow-[0_20px_45px_-12px_rgba(168,85,247,0.3)]",
            },
          ];
          const hoverConfig = statHoverConfigs[idx % statHoverConfigs.length];

          return (
            <div
              key={idx}
              className={`glass-card-interactive flex items-center space-x-4 p-5 sm:p-6 rounded-2xl group transition-all duration-300 ${hoverConfig.bg} ${hoverConfig.border} ${hoverConfig.shadow}`}
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
