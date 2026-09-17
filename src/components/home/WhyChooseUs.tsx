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
    <section className="py-20 lg:py-28 relative overflow-hidden bg-white dark:bg-[#071933] w-full">
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

        {/* 8-Card Responsive Wide Grid with Glass Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {customReasons.map((reason: any, idx: number) => {
            const Icon = DEFAULT_ICONS[idx % DEFAULT_ICONS.length] || Globe;
            const colorClass = reason.color || defaultReasons[idx % defaultReasons.length]?.color || "from-blue-500 to-indigo-600";
            return (
              <div
                key={idx}
                className="glass-card-interactive p-7 rounded-3xl flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${colorClass} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/20`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-school-primary dark:text-white leading-snug">
                    {reason.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {reason.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-school-secondary dark:text-amber-400 group-hover:translate-x-1 transition-transform">
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
