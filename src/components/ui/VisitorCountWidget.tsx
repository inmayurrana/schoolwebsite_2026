"use client";

import React, { useState, useEffect } from "react";
import { Eye, Users, Activity } from "lucide-react";

export default function VisitorCountWidget() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [todayVisitors, setTodayVisitors] = useState<number | null>(null);
  const [liveOnline, setLiveOnline] = useState<number>(1);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Generate or fetch persistent unique client ID
    let clientId = "";
    try {
      clientId = localStorage.getItem("cis_visitor_client_id") || "";
      if (!clientId) {
        clientId = "cis_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        localStorage.setItem("cis_visitor_client_id", clientId);
      }
    } catch {
      clientId = "cis_anon_" + Math.random().toString(36).substring(2, 9);
    }

    async function recordAndFetch() {
      try {
        const hasCountedSession = sessionStorage.getItem("cis_visited_session");
        let res: Response;

        if (!hasCountedSession) {
          sessionStorage.setItem("cis_visited_session", "true");
          res = await fetch("/api/visitor-count", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId }),
          });
        } else {
          res = await fetch(`/api/visitor-count?cid=${encodeURIComponent(clientId)}`);
        }

        if (res.ok) {
          const data = await res.json();
          if (typeof data.totalVisitors === "number") setVisitorCount(data.totalVisitors);
          if (typeof data.todayVisitors === "number") setTodayVisitors(data.todayVisitors);
          if (typeof data.liveOnline === "number") setLiveOnline(data.liveOnline);
        }
      } catch (err) {
        // fail gracefully
      } finally {
        setLoaded(true);
      }
    }

    recordAndFetch();

    // Heartbeat every 40s to keep live visitor count accurate and updated
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/visitor-count?cid=${encodeURIComponent(clientId)}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.liveOnline === "number") setLiveOnline(data.liveOnline);
          if (typeof data.todayVisitors === "number") setTodayVisitors(data.todayVisitors);
          if (typeof data.totalVisitors === "number") setVisitorCount(data.totalVisitors);
        }
      } catch {
        // network silent
      }
    }, 40000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-slate-100/90 dark:bg-slate-950/90 py-2.5 sm:py-3 border-t border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-none transition-colors">
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 text-xs">
        {/* Left: Compact Label & Status Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-6 h-6 rounded-md bg-amber-500/10 dark:bg-amber-400/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">
            Website Visitors
          </span>
          <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verified</span>
          </span>
        </div>

        {/* Right: Small-size Counter Metrics */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs">
          {/* Total Visits */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md shadow-2xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Total:</span>
            <span className="font-bold font-mono text-slate-900 dark:text-amber-400 text-xs sm:text-sm">
              {visitorCount !== null ? visitorCount.toLocaleString("en-IN") : "..."}
            </span>
          </div>

          {/* Today's Visits */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md shadow-2xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Today:</span>
            <span className="font-bold font-mono text-slate-900 dark:text-white text-xs sm:text-sm">
              {todayVisitors !== null ? todayVisitors.toLocaleString("en-IN") : "..."}
            </span>
          </div>

          {/* Real Live Online Visitors */}
          <div className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 px-2.5 py-1 rounded-md shadow-2xs text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold font-mono text-xs sm:text-sm">
              {liveOnline} Live Now
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
