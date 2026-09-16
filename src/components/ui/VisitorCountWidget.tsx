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
    <section className="relative w-full bg-slate-900/90 dark:bg-black/90 py-8 border-t border-b border-slate-800/80 text-white overflow-hidden select-none">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-school-primary/20 via-blue-900/10 to-school-primary/20 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800/90 bg-slate-950/80 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Title & Subtitle */}
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg shrink-0">
              <Eye className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  <span>Verified Traffic Monitor</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Live</span>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white mt-0.5">
                Official Website Visitor Counter
              </h3>
              <p className="text-xs text-slate-400">
                Cambridge International School Mandi • Transparency & Engagement Metrics
              </p>
            </div>
          </div>

          {/* Center / Right: Digital Odometer Display */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Odometer Display */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/90 border-2 border-amber-400/30 px-4 sm:px-6 py-3 rounded-2xl shadow-inner">
              {digits.map((ch, idx) => {
                if (ch === ",") {
                  return (
                    <span key={idx} className="text-amber-400/80 font-bold text-xl sm:text-2xl px-0.5">
                      ,
                    </span>
                  );
                }
                return (
                  <span
                    key={idx}
                    className="w-8 h-10 sm:w-9 sm:h-12 flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-700/80 text-amber-400 font-mono font-black text-xl sm:text-2xl rounded-lg shadow-md"
                  >
                    {ch}
                  </span>
                );
              })}
            </div>

            {/* Quick Metrics Column */}
            <div className="flex items-center space-x-4 text-xs border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
              <div className="text-center sm:text-left">
                <div className="text-slate-400 text-[11px] font-medium">Today's Visits</div>
                <div className="text-white font-extrabold text-sm sm:text-base font-mono">
                  {todayVisitors.toLocaleString("en-IN")}+
                </div>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              <div className="text-center sm:text-left">
                <div className="text-slate-400 text-[11px] font-medium">Active Now</div>
                <div className="text-emerald-400 font-extrabold text-sm sm:text-base font-mono flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
