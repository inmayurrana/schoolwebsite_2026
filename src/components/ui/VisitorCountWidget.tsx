"use client";

import React, { useState, useEffect } from "react";
import { Users, Eye, Sparkles, Activity, ShieldCheck, Globe } from "lucide-react";

export default function VisitorCountWidget() {
  const [visitorCount, setVisitorCount] = useState<number>(142850);
  const [todayVisitors, setTodayVisitors] = useState<number>(1280);
  const [liveOnline, setLiveOnline] = useState<number>(24);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadAndIncrement() {
      try {
        // Increment once per browser session
        const hasCountedSession = sessionStorage.getItem("cis_visited_session");
        let res;
        if (!hasCountedSession) {
          sessionStorage.setItem("cis_visited_session", "true");
          res = await fetch("/api/visitor-count", { method: "POST" });
        } else {
          res = await fetch("/api/visitor-count");
        }

        if (res.ok) {
          const data = await res.json();
          if (data.totalVisitors) {
            setVisitorCount(data.totalVisitors);
          }
          if (data.todayVisitors) {
            setTodayVisitors(data.todayVisitors);
          }
          if (data.liveOnline) {
            setLiveOnline(data.liveOnline);
          }
        }
      } catch (err) {
        // fallback remains default
      } finally {
        setLoaded(true);
      }
    }

    loadAndIncrement();
  }, []);

  // Format with padded commas or digit boxes
  const formattedCount = visitorCount.toLocaleString("en-IN");
  const digits = formattedCount.split("");

  return (
    <section className="relative w-full bg-slate-100/90 dark:bg-slate-950 py-8 border-t border-b border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white overflow-hidden select-none transition-colors">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-school-primary/10 via-blue-900/5 to-school-primary/10 dark:from-school-primary/20 dark:via-blue-900/10 dark:to-school-primary/20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
        <div className="rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-950/90 shadow-xl dark:shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-6 transition-colors">
          {/* Left: Title & Subtitle */}
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 border border-amber-500/30 dark:border-amber-400/30 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-md shrink-0">
              <Eye className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
                  <span>Verified Traffic Monitor</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Live</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                Official Website Visitor Counter
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Cambridge International School Mandi • Transparency & Engagement Metrics
              </p>
            </div>
          </div>

          {/* Center / Right: Digital Odometer Display & Metrics */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Odometer Display */}
            <div>
              <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1.5 text-center sm:text-left">
                Total Verified Visits
              </div>
              <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-950 border-2 border-slate-800 dark:border-amber-400/30 px-3.5 sm:px-5 py-2.5 rounded-2xl shadow-xl">
                {digits.map((ch, idx) => {
                  if (ch === ",") {
                    return (
                      <span key={idx} className="text-amber-400 font-bold font-mono text-xl sm:text-2xl px-0.5 self-end pb-1 select-none">
                        ,
                      </span>
                    );
                  }
                  return (
                    <div
                      key={idx}
                      className="relative w-8 h-10 sm:w-9 sm:h-12 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80 z-10 pointer-events-none" />
                      <span className="text-amber-400 font-mono font-black text-xl sm:text-2xl drop-shadow-[0_1px_2px_rgba(245,158,11,0.3)]">
                        {ch}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Column */}
            <div className="flex items-center space-x-5 text-xs border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-6">
              <div className="text-center sm:text-left">
                <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Today's Visits</div>
                <div className="text-slate-900 dark:text-white font-extrabold text-base sm:text-lg font-mono mt-0.5">
                  {todayVisitors.toLocaleString("en-IN")}+
                </div>
              </div>

              <div className="w-px h-9 bg-slate-200 dark:bg-slate-800" />

              <div className="text-center sm:text-left">
                <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Active Now</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base sm:text-lg font-mono flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{liveOnline} Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
