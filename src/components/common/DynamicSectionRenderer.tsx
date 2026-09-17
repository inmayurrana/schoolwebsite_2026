"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, HelpCircle, BarChart3, ExternalLink } from "lucide-react";
import { SectionBlock, SectionItem, CustomStyles } from "@/lib/pageRegistry";

interface DynamicSectionRendererProps {
  sections?: SectionBlock[];
  customStyles?: CustomStyles;
  className?: string;
}

export default function DynamicSectionRenderer({
  sections = [],
  customStyles,
  className = "",
}: DynamicSectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  const BADGE_CLASSES: Record<string, string> = {
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const SHADOW_CLASSES: Record<string, string> = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.2)]",
    neon: "shadow-[0_0_30px_rgba(59,130,246,0.25)]",
  };

  const HOVER_CLASSES: Record<string, string> = {
    none: "",
    lift: "hover:-translate-y-2 transition-all duration-300",
    scale: "hover:scale-[1.03] transition-all duration-300",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-300",
    border: "hover:border-amber-400 dark:hover:border-amber-400 transition-all duration-300",
  };

  const ROUNDING_CLASSES: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-2xl",
    "2xl": "rounded-3xl",
    "3xl": "rounded-[32px]",
    full: "rounded-full",
  };

  const RATIO_CLASSES: Record<string, string> = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "3/4": "aspect-[3/4]",
    "21/9": "aspect-[21/9]",
    auto: "aspect-auto",
  };

  const PADDING_CLASSES: Record<string, string> = {
    none: "py-0",
    compact: "py-6 sm:py-8",
    normal: "py-12 sm:py-16",
    spacious: "py-20 sm:py-24",
  };

  const getGridClass = (layout?: string) => {
    switch (layout) {
      case "grid_1":
      case "banner":
        return "grid grid-cols-1 gap-8";
      case "grid_2":
      case "split":
        return "grid grid-cols-1 md:grid-cols-2 gap-8";
      case "grid_4":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
      case "list":
        return "flex flex-col space-y-6";
      case "grid_3":
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  return (
    <div className={`space-y-16 ${className}`}>
      {sections.map((sec, secIdx) => {
        const bgStyle: React.CSSProperties = {};
        if (sec.bgColor) bgStyle.backgroundColor = sec.bgColor;
        if (sec.bgGradient) bgStyle.backgroundImage = sec.bgGradient;
        if (sec.borderColor) bgStyle.borderColor = sec.borderColor;
        if (sec.borderWidth) bgStyle.borderWidth = `${sec.borderWidth}px`;

        const paddingClass = PADDING_CLASSES[sec.paddingY || "normal"] || "py-12 sm:py-16";
        const sectionRounding = ROUNDING_CLASSES[sec.borderRadius || "2xl"] || "rounded-3xl";
        const sectionShadow = SHADOW_CLASSES[sec.shadow || "none"] || "";

        return (
          <section
            key={sec.id || `section_${secIdx}`}
            style={bgStyle}
            className={`relative transition-all duration-300 ${paddingClass} ${
              sec.bgColor || sec.bgGradient ? `p-6 sm:p-10 ${sectionRounding} ${sectionShadow} border border-slate-200 dark:border-slate-800` : ""
            }`}
          >
            {/* Section Header */}
            {(sec.badge || sec.title || sec.subtitle) && (
              <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-14">
                {sec.badge && (
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      BADGE_CLASSES[sec.badgeColor || "amber"] || BADGE_CLASSES.amber
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{sec.badge}</span>
                  </span>
                )}
                {sec.title && (
                  <h2
                    style={sec.titleColor ? { color: sec.titleColor } : undefined}
                    className="text-2xl sm:text-4xl font-extrabold text-school-primary dark:text-white tracking-tight"
                  >
                    {sec.title}
                  </h2>
                )}
                {sec.subtitle && (
                  <p
                    style={sec.subtitleColor ? { color: sec.subtitleColor } : undefined}
                    className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                  >
                    {sec.subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Section Content Items */}
            {sec.items && sec.items.length > 0 && (
              <div className={getGridClass(sec.layout)}>
                {sec.items.map((item, itemIdx) => {
                  const itemBgStyle: React.CSSProperties = {};
                  if (item.bgColor) itemBgStyle.backgroundColor = item.bgColor;
                  if (item.borderColor) itemBgStyle.borderColor = item.borderColor;
                  if (item.borderWidth) itemBgStyle.borderWidth = `${item.borderWidth}px`;

                  const itemRounding = ROUNDING_CLASSES[item.borderRadius || "2xl"] || "rounded-2xl";
                  const itemShadow = SHADOW_CLASSES[item.shadow || "md"] || "shadow-md";
                  const itemHover = HOVER_CLASSES[item.hoverEffect || "lift"] || HOVER_CLASSES.lift;
                  const ratioClass = RATIO_CLASSES[item.imageRatio || "16/9"] || "aspect-video";
                  const imgRounding = ROUNDING_CLASSES[item.imageRounding || "2xl"] || "rounded-xl";
                  const isHorizontal = item.imagePosition === "left" || item.imagePosition === "right";

                  const ContentBlock = (
                    <div className="space-y-3 flex-1">
                      {item.badge && (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                            BADGE_CLASSES[item.badgeColor || "amber"] || BADGE_CLASSES.amber
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.title && (
                        <h3
                          style={item.titleColor ? { color: item.titleColor } : undefined}
                          className={`font-bold text-school-primary dark:text-white leading-snug ${
                            item.titleSize === "2xl"
                              ? "text-2xl"
                              : item.titleSize === "xl"
                              ? "text-xl"
                              : item.titleSize === "lg"
                              ? "text-lg"
                              : item.titleSize === "sm"
                              ? "text-sm"
                              : "text-base sm:text-lg"
                          }`}
                        >
                          {item.title}
                        </h3>
                      )}

                      {item.description && (
                        <p
                          style={item.descColor ? { color: item.descColor } : undefined}
                          className={`text-slate-600 dark:text-slate-400 leading-relaxed ${
                            item.fontSize === "xs"
                              ? "text-xs"
                              : item.fontSize === "base"
                              ? "text-base"
                              : item.fontSize === "lg"
                              ? "text-lg"
                              : "text-sm"
                          }`}
                        >
                          {item.description}
                        </p>
                      )}

                      {(item.link || item.buttonText) && (
                        <div className="pt-2">
                          <Link
                            href={item.link || "#"}
                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-school-primary dark:text-amber-400 hover:text-amber-600 transition-colors group-hover:translate-x-1 duration-200"
                          >
                            <span>{item.buttonText || "Explore Details"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <div
                      key={item.id || `item_${itemIdx}`}
                      style={itemBgStyle}
                      className={`group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 ${itemRounding} ${itemShadow} ${itemHover} flex flex-col justify-between overflow-hidden ${
                        isHorizontal ? "md:flex-row md:items-center md:space-x-6" : "space-y-4"
                      }`}
                    >
                      {/* Image Top / Left */}
                      {item.image && (item.imagePosition === "top" || item.imagePosition === "left" || !item.imagePosition) && (
                        <div
                          className={`relative overflow-hidden ${imgRounding} ${ratioClass} ${
                            isHorizontal ? "w-full md:w-5/12 flex-shrink-0" : "w-full"
                          }`}
                          style={item.imageHeight ? { height: `${item.imageHeight}px` } : undefined}
                        >
                          <img
                            src={item.image}
                            alt={item.title || "Section visual"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Text content */}
                      {ContentBlock}

                      {/* Image Right / Bottom */}
                      {item.image && (item.imagePosition === "right" || item.imagePosition === "bottom") && (
                        <div
                          className={`relative overflow-hidden ${imgRounding} ${ratioClass} ${
                            isHorizontal ? "w-full md:w-5/12 flex-shrink-0" : "w-full mt-4"
                          }`}
                          style={item.imageHeight ? { height: `${item.imageHeight}px` } : undefined}
                        >
                          <img
                            src={item.image}
                            alt={item.title || "Section visual"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
