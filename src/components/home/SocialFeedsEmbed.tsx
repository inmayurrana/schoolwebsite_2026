"use client";

import React, { useState } from "react";
import {
  Video,
  Play,
  ExternalLink,
  Sparkles,
  Share2,
  Tv,
  CheckCircle2,
  Heart,
  Globe,
} from "lucide-react";
import Link from "next/link";

interface SocialFeedsEmbedProps {
  facebookUrl?: string;
  facebookEmbedUrl?: string;
  youtubeUrl?: string;
  youtubeEmbedUrl?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

// Helper to extract or generate clean YouTube embed URL
function getCleanYouTubeEmbed(url?: string): string {
  if (!url) {
    return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"; // Fallback demo or default school video
  }
  if (url.includes("embed/")) {
    return url;
  }
  // If standard youtube watch link
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return url;
}

// Helper to extract or generate clean Facebook Page embed URL
function getCleanFacebookEmbed(fbUrl?: string, customEmbed?: string): string {
  if (customEmbed && customEmbed.trim()) {
    let embed = customEmbed.trim();
    if (embed.includes("height=")) {
      embed = embed.replace(/height=\d+/, "height=800");
    }
    return embed;
  }
  const targetPage = fbUrl || "https://www.facebook.com/cismandi";
  const encoded = encodeURIComponent(targetPage);
  return `https://www.facebook.com/plugins/page.php?href=${encoded}&tabs=timeline&width=500&height=800&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
}

export default function SocialFeedsEmbed({
  facebookUrl = "https://facebook.com/cismandi",
  facebookEmbedUrl = "",
  youtubeUrl = "https://youtube.com/@cismandi",
  youtubeEmbedUrl = "https://www.youtube-nocookie.com/embed/48fO2u80pBs",
  title = "Live Social Feeds & Video Hub",
  subtitle = "Stay connected with daily campus highlights, student broadcasts, and Facebook community updates from Mandi.",
  className = "",
}: SocialFeedsEmbedProps) {
  const [activeTab, setActiveTab] = useState<"all" | "youtube" | "facebook">("all");

  const finalYouTubeSrc = getCleanYouTubeEmbed(youtubeEmbedUrl || youtubeUrl);
  const finalFacebookSrc = getCleanFacebookEmbed(facebookUrl, facebookEmbedUrl);

  return (
    <section className={`py-20 bg-[#0A192F] dark:bg-[#051329] hover:bg-[#0c1f3b] dark:hover:bg-[#071933] transition-colors duration-500 text-white relative overflow-hidden ${className}`}>
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10 dark:border-slate-800">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider bg-rose-500/20 border border-rose-500/35 px-3.5 py-1.5 rounded-full shadow-sm">
              <Tv className="w-3.5 h-3.5 text-rose-400" />
              <span>Campus Live Broadcasts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight drop-shadow-sm">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 dark:text-slate-300 leading-relaxed font-medium">
              {subtitle}
            </p>
          </div>

          {/* Social Channels CTA Pills */}
          <div className="flex items-center space-x-3">
            <Link
              href={youtubeUrl}
              target="_blank"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Subscribe on YouTube</span>
            </Link>
            <Link
              href={facebookUrl}
              target="_blank"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Follow on Facebook</span>
            </Link>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden items-center justify-center p-1 bg-slate-800/80 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "all"
                ? "bg-amber-400 text-slate-950 shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            All Feeds
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("youtube")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "youtube"
                ? "bg-rose-600 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            🎥 YouTube
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("facebook")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "facebook"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            📘 Facebook
          </button>
        </div>

        {/* FEEDS GRID (YOUTUBE + FACEBOOK) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* YOUTUBE CHANNEL / VIDEO EMBED (7 COLS) */}
          {(activeTab === "all" || activeTab === "youtube") && (
            <div
              className={`lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 flex flex-col justify-between min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] ${
                activeTab === "youtube" ? "col-span-12" : ""
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-school-primary dark:text-white">
                      Official YouTube Channel & Broadcasts
                    </h3>
                    <p className="text-xs text-slate-500">Cambridge International School Mandi</p>
                  </div>
                </div>

                <Link
                  href={youtubeUrl}
                  target="_blank"
                  className="text-xs font-bold text-rose-600 hover:text-rose-500 flex items-center space-x-1"
                >
                  <span>Channel</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* YouTube Video Player Iframe - Expanded Height */}
              <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] xl:h-[660px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center">
                <iframe
                  src={finalYouTubeSrc}
                  title="Cambridge Mandi YouTube Channel Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Highlights Ribbon */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Annual Day Specials</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Robotics Laurels</span>
                  </span>
                </div>
                <Link
                  href={youtubeUrl}
                  target="_blank"
                  className="font-bold text-school-primary dark:text-amber-400 hover:underline"
                >
                  Watch all 50+ campus videos →
                </Link>
              </div>
            </div>
          )}

          {/* FACEBOOK PAGE STREAM (5 COLS) */}
          {(activeTab === "all" || activeTab === "facebook") && (
            <div
              className={`lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 flex flex-col justify-between min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] ${
                activeTab === "facebook" ? "col-span-12" : ""
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center font-black text-xl">
                    f
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-school-primary dark:text-white">
                      Facebook Community Stream
                    </h3>
                    <p className="text-xs text-slate-500">Live Posts, Announcements & Events</p>
                  </div>
                </div>

                <Link
                  href={facebookUrl}
                  target="_blank"
                  className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center space-x-1"
                >
                  <span>Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Facebook Page Plugin Iframe - Expanded Height */}
              <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] xl:h-[660px] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <iframe
                  src={finalFacebookSrc}
                  title="Cambridge Mandi Facebook Page Stream"
                  className="w-full h-full border-0"
                  scrolling="yes"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>

              {/* Bottom Quick Follow Link */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Stay updated on Facebook</span>
                <Link
                  href={facebookUrl}
                  target="_blank"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Visit Facebook Page →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
