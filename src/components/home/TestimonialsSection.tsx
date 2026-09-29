"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import {
  TestimonialItem,
  TestimonialsConfig,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CONFIG,
} from "@/types/testimonials";

interface TestimonialsSectionProps {
  initialTestimonials?: TestimonialItem[];
  initialConfig?: Partial<TestimonialsConfig>;
}

export default function TestimonialsSection({
  initialTestimonials,
  initialConfig,
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    initialTestimonials && initialTestimonials.length > 0
      ? initialTestimonials
      : DEFAULT_TESTIMONIALS
  );

  const [config, setConfig] = useState<TestimonialsConfig>({
    ...DEFAULT_CONFIG,
    ...(initialConfig || {}),
  });

  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter active testimonials
  const activeTestimonials = testimonials.filter((t) => t.isActive !== false);

  // Sync with live updates (custom event from CMS or storage)
  useEffect(() => {
    async function refreshFromApi() {
      try {
        const res = await fetch(`/api/testimonials?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && Array.isArray(data.testimonials)) {
            setTestimonials(data.testimonials);
          }
          if (data.config && typeof data.config === "object") {
            setConfig((prev) => ({ ...prev, ...data.config }));
          }
        }
      } catch (_) {}
    }

    const handleCustomEvent = () => refreshFromApi();
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "cis_testimonials_updated") {
        refreshFromApi();
      }
    };

    window.addEventListener("cis_testimonials_updated", handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("cis_testimonials_updated", handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  // Safe bounds check for active testimonials
  const list = activeTestimonials.length > 0 ? activeTestimonials : DEFAULT_TESTIMONIALS;
  const safeIndex = current >= list.length ? 0 : current;
  const t = list[safeIndex];

  // Autoplay functionality
  useEffect(() => {
    if (!config.autoplay || isHovered || list.length <= 1) return;

    const intervalMs = Math.max(3000, (config.autoplaySpeed || 6) * 1000);
    timerRef.current = setInterval(() => {
      setCurrent((curr) => (curr >= list.length - 1 ? 0 : curr + 1));
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.autoplay, config.autoplaySpeed, isHovered, list.length]);

  const prev = () => {
    setCurrent((curr) => (curr === 0 ? list.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrent((curr) => (curr >= list.length - 1 ? 0 : curr + 1));
  };

  // Determine Star Color class
  const getStarColorClass = () => {
    switch (config.starColor) {
      case "yellow":
        return "fill-yellow-400 text-yellow-400";
      case "emerald":
        return "fill-emerald-400 text-emerald-400";
      case "amber":
      default:
        return "fill-amber-400 text-amber-400";
    }
  };

  // Determine Card Style
  const renderCardWrapper = (content: React.ReactNode) => {
    if (config.cardStyle === "aurora") {
      return (
        <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-amber-400/40 via-sky-400/40 to-indigo-500/40 shadow-2xl transition-all duration-300">
          <div className="bg-slate-900/90 dark:bg-[#07172f]/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            {content}
          </div>
        </div>
      );
    }

    if (config.cardStyle === "navy") {
      return (
        <div className="bg-gradient-to-br from-slate-900 via-[#0a2347] to-slate-950 border border-amber-400/35 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-950/60 relative overflow-hidden transition-all duration-300">
          {content}
        </div>
      );
    }

    if (config.cardStyle === "clean") {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden transition-all duration-300">
          {content}
        </div>
      );
    }

    // Default: Glass
    return (
      <div className="glass-panel border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden transition-all duration-300">
        {content}
      </div>
    );
  };

  return (
    <section
      className="py-20 lg:py-28 bg-[#f0f7ff]/40 dark:bg-[#051329] relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Floating Glass Glow Orbs */}
      {config.ambientGlow === "purple-gold" && (
        <>
          <div className="glass-orb-purple -top-20 left-10 opacity-30 pointer-events-none" />
          <div className="glass-orb-gold -bottom-20 right-10 opacity-30 pointer-events-none" />
        </>
      )}
      {config.ambientGlow === "blue-cyan" && (
        <>
          <div className="glass-orb-blue -top-20 left-1/4 opacity-35 pointer-events-none" />
          <div className="glass-orb-blue -bottom-20 right-1/4 opacity-35 pointer-events-none" />
        </>
      )}
      {config.ambientGlow === "emerald-amber" && (
        <>
          <div className="glass-orb-gold -top-20 left-10 opacity-30 pointer-events-none" />
          <div className="glass-orb-purple -bottom-20 right-10 opacity-30 pointer-events-none" />
        </>
      )}

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 glass-badge-gold px-4 py-1.5 rounded-full text-amber-500 font-bold text-xs uppercase tracking-wider shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{config.badge || "Parent & Alumni Voices"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-school-primary dark:text-white leading-tight">
            {config.title || "Trusted by Discerning Parents & Inspiring Alumni"}
          </h2>
          {config.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </div>

        {/* Carousel Card Container */}
        <div className="max-w-4xl mx-auto">
          {renderCardWrapper(
            <>
              {/* Optional Quote Icon Watermark */}
              {config.quoteIconStyle === "subtle" && (
                <Quote className="w-24 h-24 text-school-secondary/15 dark:text-white/10 absolute top-6 right-8 pointer-events-none" />
              )}
              {config.quoteIconStyle === "solid" && (
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 absolute top-6 right-8 pointer-events-none">
                  <Quote className="w-8 h-8" />
                </div>
              )}

              <div className="space-y-6 relative z-10">
                {/* Rating & Badge Pill */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${getStarColorClass()}`} />
                    ))}
                  </div>

                  {t.badge && (
                    <span className="inline-flex items-center space-x-1 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{t.badge}</span>
                    </span>
                  )}
                </div>

                {/* Quote Content */}
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 italic leading-relaxed">
                  "{t.content}"
                </p>

                {/* Author Info & Nav Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-200/60 dark:border-white/10">
                  <div className="flex items-center space-x-4">
                    <img
                      src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                      alt={t.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 shadow-lg flex-shrink-0 bg-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-school-primary dark:text-white">
                        {t.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-semibold text-school-secondary dark:text-sky-400">
                        {t.role}
                      </p>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t.relation}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows & Dots */}
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    {/* Index Indicator */}
                    <span className="text-xs font-mono text-slate-400">
                      {safeIndex + 1} / {list.length}
                    </span>

                    <button
                      onClick={prev}
                      className="p-2.5 rounded-xl glass-btn text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors cursor-pointer"
                      aria-label="Previous Testimonial"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={next}
                      className="p-2.5 rounded-xl glass-btn text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors cursor-pointer"
                      aria-label="Next Testimonial"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Dots indicator */}
                {list.length > 1 && (
                  <div className="flex items-center justify-center space-x-1.5 pt-2">
                    {list.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrent(dotIdx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          dotIdx === safeIndex
                            ? "w-8 bg-amber-400"
                            : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
