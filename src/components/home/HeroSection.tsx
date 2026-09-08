"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Download,
  Calendar,
  Eye,
  ShieldCheck,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  FileText,
  Youtube,
  ExternalLink,
  Maximize2,
  Tv,
} from "lucide-react";
import QuickEnquiryModal from "../ui/QuickEnquiryModal";
import { useTheme } from "../providers/ThemeProvider";

interface HeroData {
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroMediaType?: string; // "VIDEO" | "IMAGE" | "SPLIT"
  heroVideoUrl?: string;
  heroOverlayOpacity?: number;
  heroCtaText?: string;
  heroCtaLink?: string;
}

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

function extractVimeoId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/);
  return m ? m[1] : null;
}

export default function HeroSection({ initialData }: { initialData?: HeroData }) {
  const { t } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("ADMISSION");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [heroData, setHeroData] = useState<HeroData>(
    initialData || {
      heroBadge: "CBSE Affiliated No. 630198 • Admissions Open 2027–28",
      heroTitle: "EDUCATING FOR A BETTER WORLD",
      heroSubtitle:
        "At Cambridge International School, Mandi (CBSE Affiliated No. 630198), we nurture visionary thinkers, scientific innovators, and compassionate global leaders amidst Himalayan serenity.",
      heroImage:
        "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80",
      heroMediaType: "VIDEO",
      heroVideoUrl: "https://youtu.be/slAltokCyL0",
      heroOverlayOpacity: 0.35,
      heroCtaText: "Apply for Admission 2027",
      heroCtaLink: "/admissions/apply",
    }
  );

  useEffect(() => {
    async function loadDynamicHero() {
      try {
        const res = await fetch("/api/pages/home");
        if (res.ok) {
          const data = await res.json();
          if (data.page) {
            setHeroData({
              heroBadge: data.page.heroBadge,
              heroTitle: data.page.heroTitle || "EDUCATING FOR A BETTER WORLD",
              heroSubtitle: data.page.heroSubtitle,
              heroImage: data.page.heroImage,
              heroMediaType: data.page.heroMediaType || "VIDEO",
              heroVideoUrl: data.page.heroVideoUrl || "https://youtu.be/slAltokCyL0",
              heroOverlayOpacity: data.page.heroOverlayOpacity ?? 0.35,
              heroCtaText: data.page.heroCtaText,
              heroCtaLink: data.page.heroCtaLink,
            });
          }
        }
      } catch (err) {
        // fallback
      }
    }
    loadDynamicHero();
  }, []);

  // Request sound unmuting and high definition on YouTube iframe message
  useEffect(() => {
    const youtubeId = extractYouTubeId(heroData.heroVideoUrl);
    if (!youtubeId) return;

    const unmuteTimer = setTimeout(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "unMute", args: [] }),
          "*"
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
          "*"
        );
      }
    }, 1500);

    const interval = setInterval(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setPlaybackQuality", args: ["hd1080"] }),
          "*"
        );
      }
    }, 2000);

    return () => {
      clearTimeout(unmuteTimer);
      clearInterval(interval);
    };
  }, [heroData.heroVideoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isPlaying) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
          "*"
        );
        setIsPlaying(false);
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "*"
        );
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
    }

    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (nextMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "mute", args: [] }),
          "*"
        );
      } else {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "unMute", args: [] }),
          "*"
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "setVolume", args: [100] }),
          "*"
        );
      }
    }
  };

  const isVideoMode = heroData.heroMediaType !== "IMAGE";
  const youtubeId = isVideoMode ? extractYouTubeId(heroData.heroVideoUrl) : null;
  const vimeoId = isVideoMode && !youtubeId ? extractVimeoId(heroData.heroVideoUrl) : null;

  return (
    <section className="relative w-full overflow-hidden min-h-[640px] lg:min-h-[780px] flex items-center justify-center text-white bg-slate-950">
      {/* 1. Cinematic Full-HD Background Video / Image Layer */}
      {isVideoMode ? (
        youtubeId ? (
          /* High-Definition 1080p YouTube Stream with Exact 16:9 Cover Geometry */
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-950">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=0&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080&hd=1`}
              title="Campus YouTube Hero Video in 1080p HD"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              style={{
                width: "100vw",
                height: "56.25vw", // 16:9 aspect ratio
                minHeight: "100vh",
                minWidth: "177.77vh",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                filter: "contrast(1.06) saturate(1.12) brightness(1.02)",
              }}
              className="pointer-events-none object-cover will-change-transform"
            />
          </div>
        ) : vimeoId ? (
          /* Vimeo Full-HD Autoplay Stream */
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-950">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=0&quality=1080p`}
              title="Campus Vimeo Hero Video in HD"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{
                width: "100vw",
                height: "56.25vw",
                minHeight: "100vh",
                minWidth: "177.77vh",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              className="pointer-events-none object-cover"
            />
          </div>
        ) : (
          /* Native Direct MP4 / WebM Background Video in Crisp Hardware Accelerated Mode */
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-950">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              poster={
                heroData.heroImage ||
                "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80"
              }
              style={{
                filter: "contrast(1.05) saturate(1.1) brightness(1.02)",
                transform: "translateZ(0)",
              }}
              className="absolute inset-0 w-full h-full object-cover will-change-transform transition-all duration-1000"
            >
              <source
                src={
                  heroData.heroVideoUrl ||
                  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-school-campus-41551-large.mp4"
                }
                type="video/mp4"
              />
            </video>
          </div>
        )
      ) : (
        /* Static Image Background */
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 z-0"
          style={{
            backgroundImage: `url(${
              heroData.heroImage ||
              "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80"
            })`,
          }}
        />
      )}

      {/* 2. Balanced Cinematic Contrast Overlay */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/25 pointer-events-none transition-opacity duration-300"
        style={{
          opacity:
            heroData.heroOverlayOpacity !== undefined
              ? heroData.heroOverlayOpacity + 0.15
              : 0.5,
        }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent pointer-events-none" />

      {/* Atmospheric Glow Highlights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-school-secondary/20 rounded-full blur-3xl pointer-events-none z-[2]" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none z-[2]" />

      {/* 3. Floating Right-Edge Vertical "ADMISSIONS OPEN 2027–28" Tab */}
      <Link
        href="/admissions/apply"
        className="hero-cta-sweep fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex items-center space-x-2 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs py-5 px-2.5 rounded-l-2xl shadow-[0_0_30px_rgba(244,180,0,0.45)] transition-all duration-300 group hover:-translate-x-1 border-y border-l border-amber-200/90 [writing-mode:vertical-rl] tracking-widest uppercase cursor-pointer"
        title="Apply for Admission 2027-28"
      >
        <FileText className="w-4 h-4 rotate-90 mb-1 group-hover:scale-110 transition-transform" />
        <span className="font-heading">ADMISSIONS OPEN 2027–28</span>
      </Link>

      {/* 4. Main Hero Content Container */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10 py-20 sm:py-28 lg:py-36">
        <div className="max-w-4xl space-y-6 text-left">
          {/* Admissions Badge with Text Glow & Beacon */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-950/90 border border-amber-400/60 shadow-[0_0_20px_rgba(244,180,0,0.25)] hover:shadow-[0_0_30px_rgba(244,180,0,0.45)] transition-all">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-[0_0_10px_#f59e0b]"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest hero-gold-shimmer font-heading">
              {heroData.heroBadge || "CBSE Affiliated No. 630198 • Admissions Open 2027–28"}
            </span>
          </div>

          {/* Grand Headline with Multi-Layer Text Effects & Shimmer */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-heading leading-[1.08] tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] uppercase select-none">
            {heroData.heroTitle === "EDUCATING FOR A BETTER WORLD" ? (
              <>
                <span className="hero-headline-shimmer block sm:inline">EDUCATING FOR A </span>
                <span className="hero-gold-shimmer relative inline-block drop-shadow-[0_0_35px_rgba(244,180,0,0.45)]">
                  BETTER WORLD
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent rounded-full opacity-80" />
                </span>
              </>
            ) : (
              <span className="hero-headline-shimmer">{heroData.heroTitle || "EDUCATING FOR A BETTER WORLD"}</span>
            )}
          </h1>

          {/* Subtitle description with Deep Text Shadow */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-100 max-w-3xl leading-relaxed font-medium hero-text-shadow-deep">
            {heroData.heroSubtitle ||
              "At Cambridge International School, Mandi, we blend Cambridge inquiry-based pedagogy, STEM innovation labs, and Olympic sports to nurture visionary thinkers."}
          </p>

          {/* Action CTA Button with Shimmer Sweep & Radiant Glow */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={heroData.heroCtaLink || "/admissions/apply"}
              className="hero-cta-sweep inline-flex items-center space-x-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl shadow-[0_0_35px_rgba(244,180,0,0.45)] hover:shadow-[0_0_55px_rgba(244,180,0,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-200/80 cursor-pointer group"
            >
              <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform duration-300" />
              <span className="tracking-wide">{heroData.heroCtaText || "Apply for Admission 2027"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Micro Credentials Row with Crystal-Clear High-Contrast Cards */}
          <div className="pt-8 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#0A2540]/90 dark:bg-[#0d1f33] border border-blue-400/30 hover:border-blue-400 shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-400/40 shadow">
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-black text-white block tracking-wide">
                  CBSE Affiliated 630198
                </span>
                <span className="text-[11px] text-blue-200 font-medium block mt-0.5">
                  Senior Secondary
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#0A2540]/90 dark:bg-[#0d1f33] border border-amber-400/30 hover:border-amber-400 shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-400/40 shadow">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-black text-white block tracking-wide">
                  10-Acre Campus
                </span>
                <span className="text-[11px] text-amber-200 font-medium block mt-0.5">
                  Alpine Serenity
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#0A2540]/90 dark:bg-[#0d1f33] border border-emerald-400/30 hover:border-emerald-400 shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-400/40 shadow">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-black text-white block tracking-wide">
                  100% Board Results
                </span>
                <span className="text-[11px] text-emerald-200 font-medium block mt-0.5">
                  District Distinctions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Floating Interactive Video Controls */}
      {isVideoMode && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-2 bg-slate-950/95 p-2 rounded-full border border-slate-700 shadow-2xl">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-black text-emerald-400">
            <Tv className="w-3 h-3" />
            <span>1080p HD</span>
          </div>

          {/* Sound Mute / Unmute Audio Toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Allow video sound (Unmute)" : "Mute video sound"}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
              isMuted
                ? "bg-amber-500/25 hover:bg-amber-500/35 text-amber-300 border border-amber-400/50 animate-pulse"
                : "bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-400/50"
            }`}
            title={isMuted ? "Click to allow sound (turn sound ON)" : "Click to mute sound"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                <span>Sound: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>Sound: ON</span>
              </>
            )}
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* YouTube Link */}
          {youtubeId && (
            <a
              href={heroData.heroVideoUrl || `https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">YouTube</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          )}
        </div>
      )}

      <QuickEnquiryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalType}
      />
    </section>
  );
}
