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

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

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
  const ytPlayerRef = useRef<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("ADMISSION");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [origin, setOrigin] = useState("");

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

  const [affiliationNo, setAffiliationNo] = useState("630198");
  const [schoolLevel, setSchoolLevel] = useState("Senior Secondary");
  const [badge1Title, setBadge1Title] = useState("");
  const [badge1Subtitle, setBadge1Subtitle] = useState("");
  const [badge2Title, setBadge2Title] = useState("10-Acre Campus");
  const [badge2Subtitle, setBadge2Subtitle] = useState("Alpine Serenity");
  const [badge3Title, setBadge3Title] = useState("100% Board Results");
  const [badge3Subtitle, setBadge3Subtitle] = useState("District Distinctions");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

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

        // Fetch dynamic site settings for affiliation number and badges
        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const sData = await settingsRes.json();
          const sMap = sData.settingsMap || {};
          if (Array.isArray(sData.settings)) {
            sData.settings.forEach((s: any) => {
              if (s.key && s.value) sMap[s.key] = s.value;
            });
          }

          if (sMap.cbse_affiliation_no) setAffiliationNo(sMap.cbse_affiliation_no);
          if (sMap.school_level) setSchoolLevel(sMap.school_level);
          if (sMap.hero_badge_1_title) setBadge1Title(sMap.hero_badge_1_title);
          if (sMap.hero_badge_1_subtitle) setBadge1Subtitle(sMap.hero_badge_1_subtitle);
          if (sMap.hero_badge_2_title) setBadge2Title(sMap.hero_badge_2_title);
          if (sMap.hero_badge_2_subtitle) setBadge2Subtitle(sMap.hero_badge_2_subtitle);
          if (sMap.hero_badge_3_title) setBadge3Title(sMap.hero_badge_3_title);
          if (sMap.hero_badge_3_subtitle) setBadge3Subtitle(sMap.hero_badge_3_subtitle);
        }
      } catch (err) {
        // fallback
      }
    }
    loadDynamicHero();
  }, []);

  const isVideoMode = heroData.heroMediaType !== "IMAGE";
  const youtubeId = isVideoMode ? extractYouTubeId(heroData.heroVideoUrl) : null;
  const vimeoId = isVideoMode && !youtubeId ? extractVimeoId(heroData.heroVideoUrl) : null;

  // Unified controller to guarantee playback and sound ON
  const enableSoundAndPlay = () => {
    setIsMuted(false);
    setIsPlaying(true);

    // 1. YouTube IFrame API instance
    if (ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.playVideo === "function") {
          ytPlayerRef.current.playVideo();
        }
        if (typeof ytPlayerRef.current.unMute === "function") {
          ytPlayerRef.current.unMute();
        }
        if (typeof ytPlayerRef.current.setVolume === "function") {
          ytPlayerRef.current.setVolume(100);
        }
      } catch (err) {}
    }

    // 2. Direct postMessage to YouTube iframe (dual format for broad compatibility)
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const cw = iframeRef.current.contentWindow;
        cw.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: "" }), "*");
        cw.postMessage(JSON.stringify({ event: "command", func: "playVideo", args: [] }), "*");
        cw.postMessage(JSON.stringify({ event: "command", func: "unMute", args: "" }), "*");
        cw.postMessage(JSON.stringify({ event: "command", func: "unMute", args: [] }), "*");
        cw.postMessage(JSON.stringify({ event: "command", func: "setVolume", args: [100] }), "*");
      } catch (err) {}
    }

    // 3. HTML5 Video Element
    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      } catch (err) {}
    }
  };

  // Initialize official YouTube Iframe Player API for precise sound and play control
  useEffect(() => {
    if (!youtubeId || typeof window === "undefined") return;

    const setupPlayer = () => {
      if (!window.YT || !window.YT.Player || !iframeRef.current) return;
      try {
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.destroy();
          } catch (e) {}
        }

        ytPlayerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event: any) => {
              try {
                event.target.playVideo();
                event.target.unMute();
                event.target.setVolume(100);
              } catch (e) {}
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
                try {
                  event.target.unMute();
                  event.target.setVolume(100);
                } catch (e) {}
              }
            },
          },
        });
      } catch (err) {
        // Fallback handled by postMessage timers
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        setupPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const first = document.getElementsByTagName("script")[0];
        first?.parentNode?.insertBefore(tag, first);
      }
    }

    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }
    };
  }, [youtubeId, heroData.heroVideoUrl]);

  // Guarantee automatic background video playback on mount with periodic triggers
  useEffect(() => {
    if (youtubeId) {
      const timers = [150, 450, 1000, 1800, 2800, 4200].map((delay) =>
        setTimeout(() => {
          enableSoundAndPlay();
        }, delay)
      );

      const qualityTimer = setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({ event: "command", func: "setPlaybackQuality", args: ["hd1080"] }),
              "*"
            );
          } catch (e) {}
        }
      }, 2500);

      return () => {
        timers.forEach(clearTimeout);
        clearTimeout(qualityTimer);
      };
    } else if (videoRef.current) {
      videoRef.current.defaultMuted = false;
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy deferred unmuted autoplay, start muted first so it runs, then unmute on first gesture
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [youtubeId, heroData.heroVideoUrl]);

  // Seamlessly unlock sound on ANY user gesture if browser policy temporarily deferred audio
  useEffect(() => {
    const unlockAudio = () => {
      enableSoundAndPlay();
    };

    const events = ["click", "pointerdown", "touchstart", "keydown", "wheel", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, unlockAudio, { passive: true }));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, unlockAudio));
    };
  }, []);

  const togglePlay = () => {
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);

    if (ytPlayerRef.current) {
      try {
        if (nextPlaying) {
          ytPlayerRef.current.playVideo();
        } else {
          ytPlayerRef.current.pauseVideo();
        }
      } catch (e) {}
    }

    if (videoRef.current) {
      if (nextPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }

    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: nextPlaying ? "playVideo" : "pauseVideo",
            args: "",
          }),
          "*"
        );
      } catch (e) {}
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (nextMuted) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.mute === "function") {
        try {
          ytPlayerRef.current.mute();
        } catch (e) {}
      }
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "mute", args: "" }),
            "*"
          );
        } catch (e) {}
      }
    } else {
      enableSoundAndPlay();
    }
  };

  const currentOrigin =
    origin || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

  return (
    <section
      onClick={() => enableSoundAndPlay()}
      className="relative w-full overflow-hidden min-h-[640px] lg:min-h-[780px] flex items-center justify-center text-white bg-slate-950"
    >
      {/* 1. Cinematic Full-HD Background Video / Image Layer */}
      {isVideoMode ? (
        youtubeId ? (
          /* High-Definition 1080p YouTube Stream with Exact 16:9 Cover Geometry */
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-slate-950">
            <iframe
              ref={iframeRef}
              id="hero-youtube-iframe"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(
                currentOrigin
              )}&widget_referrer=${encodeURIComponent(currentOrigin)}&vq=hd1080&hd=1`}
              title="Campus YouTube Hero Video in 1080p HD"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              onLoad={() => {
                enableSoundAndPlay();
              }}
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
              src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=${isMuted ? 1 : 0}&quality=1080p`}
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
                  {badge1Title || `CBSE Affiliated ${affiliationNo || "630198"}`}
                </span>
                <span className="text-[11px] text-blue-200 font-medium block mt-0.5">
                  {badge1Subtitle || schoolLevel || "Senior Secondary"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#0A2540]/90 dark:bg-[#0d1f33] border border-amber-400/30 hover:border-amber-400 shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-400/40 shadow">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-black text-white block tracking-wide">
                  {badge2Title || "10-Acre Campus"}
                </span>
                <span className="text-[11px] text-amber-200 font-medium block mt-0.5">
                  {badge2Subtitle || "Alpine Serenity"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3.5 p-4 rounded-2xl bg-[#0A2540]/90 dark:bg-[#0d1f33] border border-emerald-400/30 hover:border-emerald-400 shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-400/40 shadow">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-black text-white block tracking-wide">
                  {badge3Title || "100% Board Results"}
                </span>
                <span className="text-[11px] text-emerald-200 font-medium block mt-0.5">
                  {badge3Subtitle || "District Distinctions"}
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
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
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
