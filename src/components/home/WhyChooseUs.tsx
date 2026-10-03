"use client";

import React, { useEffect, useState } from "react";
import {
  Compass,
  Cpu,
  Trophy,
  Home,
  Bus,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  TreePine,
  UserCheck,
  Globe,
  BookOpen,
} from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

const DEFAULT_ICONS = [Globe, Cpu, Trophy, Home, Bus, UserCheck, ShieldCheck, TreePine];

const defaultReasons = [
  {
    title: "Cambridge & CBSE Blended Pedagogy",
    desc: "Inquiry-based international pedagogical methods blended seamlessly with CBSE curriculum standards and assessment framework.",
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Himalayan STEM, AI & Robotics Lab",
    desc: "Equipped with 3D printers, IoT hardware, Arduino & Raspberry Pi kits, and drone test bays for hands-on engineering.",
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Olympic Sports & Heated Aquatic Center",
    desc: "Semi-Olympic heated pool, FIFA-standard synthetic football field, tennis courts, and indoor multi-sport auditorium.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Safe Residential Boarding & Hostel",
    desc: "Modern temperature-controlled dormitories, 24x7 resident wardens, hygienic multi-cuisine dining, and evening academic tutoring.",
    color: "from-purple-600 to-pink-600",
  },
  {
    title: "GPS & CCTV Monitored Bus Fleet",
    desc: "Comfortable air-conditioned transport fleet with live parent tracking apps covering Mandi, Sundernagar, Gutkar, and surrounding valleys.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "1:15 Teacher-Student Mentorship",
    desc: "Individualized attention with dedicated mentor-teachers who monitor both academic trajectory and emotional well-being.",
    color: "from-rose-500 to-red-600",
  },
  {
    title: "100% Safety & CCTV Campus",
    desc: "Gated 10-acre Himalayan perimeter with 200+ HD night-vision cameras, biometric turnstiles, and female security personnel.",
    color: "from-teal-500 to-emerald-600",
  },
  {
    title: "Himalayan Eco-Leadership & Clean Air",
    desc: "Pristine mountain environment promoting mental clarity, alpine treks, nature conservation projects, and organic farming.",
    color: "from-green-600 to-emerald-700",
  },
];

interface WhyChooseUsProps {
  customStyles?: any;
}

export default function WhyChooseUs({ customStyles }: WhyChooseUsProps) {
  const { t } = useTheme();

  const customReasons = Array.isArray(customStyles?.why_choose_us_cards) && customStyles.why_choose_us_cards.length > 0
    ? customStyles.why_choose_us_cards
    : defaultReasons;

  const badgeText = customStyles?.why_choose_us_badge || "Benchmark Quality Standards";
  const titleText = customStyles?.why_choose_us_title || t("whyChooseUs") || "Why Cambridge Mandi?";
  const subtitleText = customStyles?.why_choose_us_subtitle || "Discover what sets Cambridge International School Mandi apart as the finest CBSE day & residential institution in Himachal Pradesh.";

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-white dark:bg-[#071933] hover:bg-[#fffdf7] dark:hover:bg-[#081e3d] transition-colors duration-500 w-full">
      {/* Ambient Glass Glow Orbs */}
      <div className="glass-orb-gold -top-20 left-10 opacity-30" />
      <div className="glass-orb-blue bottom-10 right-10 opacity-35" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 glass-badge px-4 py-1.5 rounded-full uppercase tracking-wider text-xs font-bold text-school-secondary dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{badgeText}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-school-primary dark:text-white tracking-tight">
            {titleText}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {subtitleText}
          </p>
        </div>

        {/* 8-Card Responsive Wide Grid with Dynamic Hover Color-Shifting Effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {customReasons.map((reason: any, idx: number) => {
            const Icon = DEFAULT_ICONS[idx % DEFAULT_ICONS.length] || Globe;
            const colorClass = reason.color || defaultReasons[idx % defaultReasons.length]?.color || "from-blue-500 to-indigo-600";
            
            const hoverConfig = [
              // 0: Blue (Blended Pedagogy)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-blue-500/15 hover:via-indigo-500/10 hover:to-white dark:hover:from-blue-950/40 dark:hover:via-indigo-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-blue-400 dark:hover:border-blue-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(59,130,246,0.3)]",
                hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
              },
              // 1: Amber/Orange (STEM & Robotics)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-amber-500/15 hover:via-orange-500/10 hover:to-white dark:hover:from-amber-950/40 dark:hover:via-orange-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-amber-400 dark:hover:border-amber-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(245,158,11,0.3)]",
                hoverText: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
              },
              // 2: Emerald/Teal (Olympic Sports & Aquatic Center)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-emerald-500/15 hover:via-teal-500/10 hover:to-white dark:hover:from-emerald-950/40 dark:hover:via-teal-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.3)]",
                hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
              },
              // 3: Purple/Rose (Boarding & Hostel)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-purple-500/15 hover:via-pink-500/10 hover:to-white dark:hover:from-purple-950/40 dark:hover:via-pink-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-purple-400 dark:hover:border-purple-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(168,85,247,0.3)]",
                hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
              },
              // 4: Sky/Blue (GPS Bus Fleet)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-sky-500/15 hover:via-blue-500/10 hover:to-white dark:hover:from-sky-950/40 dark:hover:via-blue-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-sky-400 dark:hover:border-sky-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(14,165,233,0.3)]",
                hoverText: "group-hover:text-sky-600 dark:group-hover:text-sky-400",
              },
              // 5: Rose/Red (Mentorship)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-rose-500/15 hover:via-red-500/10 hover:to-white dark:hover:from-rose-950/40 dark:hover:via-red-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-rose-400 dark:hover:border-rose-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(244,63,94,0.3)]",
                hoverText: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
              },
              // 6: Teal/Cyan (100% Safety & CCTV Campus)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-teal-500/15 hover:via-cyan-500/10 hover:to-white dark:hover:from-teal-950/40 dark:hover:via-cyan-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-teal-400 dark:hover:border-teal-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(20,184,166,0.3)]",
                hoverText: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
              },
              // 7: Forest Green (Eco-Leadership & Clean Air)
              {
                hoverBg: "hover:bg-gradient-to-br hover:from-emerald-500/15 hover:via-green-500/10 hover:to-white dark:hover:from-emerald-950/40 dark:hover:via-green-950/20 dark:hover:to-[#071933]",
                hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-400",
                hoverShadow: "hover:shadow-[0_20px_45px_-12px_rgba(16,185,129,0.3)]",
                hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
              },
            ][idx % 8];

            return (
              <div
                key={idx}
                className={`glass-card-interactive p-7 rounded-3xl flex flex-col justify-between group border border-slate-200/90 dark:border-white/10 transition-all duration-300 hover:-translate-y-1.5 ${hoverConfig.hoverBg} ${hoverConfig.hoverBorder} ${hoverConfig.hoverShadow}`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${colorClass} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 border border-white/20`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className={`text-lg font-bold text-school-primary dark:text-white leading-snug transition-colors duration-300 ${hoverConfig.hoverText}`}>
                    {reason.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {reason.desc}
                  </p>
                </div>

                <div className={`pt-4 mt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-school-secondary dark:text-amber-400 group-hover:translate-x-1 transition-all duration-300 ${hoverConfig.hoverText}`}>
                  <span>Explore Standard</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
