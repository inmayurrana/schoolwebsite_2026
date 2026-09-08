"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ArrowRight } from "lucide-react";

interface Notice {
  id?: string;
  text: string;
  link: string;
  badge?: string;
}

const DEFAULT_NOTICES: Notice[] = [
  { text: "🌟 Admissions Open for Session 2027-2028: Nursery to Grade XI (Science, Commerce, Humanities)", link: "/admissions/apply", badge: "Admissions" },
  { text: "🏆 Cambridge Mandi Robotics Team Wins National STEM Olympiad Gold Medal in New Delhi", link: "/news", badge: "Laurels" },
  { text: "📅 Annual Cultural Extravaganza 'Udaan' scheduled for next month — Book your visitor pass", link: "/events", badge: "Events" },
  { text: "📄 CBSE Mandatory Public Disclosure SARAS Documents for Session 2027-28 updated", link: "/mandatory-disclosure", badge: "CBSE" },
  { text: "🏅 100% CBSE Class X & XII Board Exam Pass Rate with 42 State Distinctions", link: "/results", badge: "Academics" },
];

export default function NoticeTicker() {
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const res = await fetch("/api/notices");
        const data = await res.json();
        if (data.notices && data.notices.length > 0) {
          setNotices(data.notices);
        }
      } catch (err) {
        // Fallback to default
      }
    };
    loadNotices();
  }, []);

  const displayList = notices.length > 0 ? notices.concat(notices) : DEFAULT_NOTICES.concat(DEFAULT_NOTICES);

  return (
    <div className="bg-gradient-to-r from-school-primary via-blue-950 to-school-primary text-white text-xs py-2.5 px-4 overflow-hidden border-b border-blue-900/50 relative w-full select-none shadow-sm">
      <div className="w-full max-w-[1920px] mx-auto flex items-center">
        {/* Left Glass Gold Badge */}
        <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3.5 py-1 rounded-full font-extrabold uppercase tracking-wider text-[10px] flex-shrink-0 z-10 shadow-lg border border-amber-300/60">
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>Notice Board</span>
        </div>

        {/* Marquee Ticker */}
        <div className="overflow-hidden whitespace-nowrap ml-4 flex-1">
          <div className="inline-flex space-x-12 animate-marquee">
            {displayList.map((notice, idx) => (
              <Link
                key={idx}
                href={notice.link || "/news"}
                className="inline-flex items-center space-x-2.5 text-slate-200 hover:text-amber-400 transition-colors group py-0.5"
              >
                {notice.badge && (
                  <span className="glass-badge px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-300 border border-amber-400/30">
                    {notice.badge}
                  </span>
                )}
                <span className="font-medium tracking-wide">{notice.text}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
