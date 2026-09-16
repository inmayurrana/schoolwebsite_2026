"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  Layers,
  ArrowRight,
  MoveUp,
  MoveDown,
  Loader2,
  ExternalLink,
  Video,
  Film,
  Sliders,
  Palette,
  Type,
  FileDown,
  GraduationCap,
  BarChart3,
  Download,
  Laptop,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Copy,
  FolderDown,
  MessageSquareQuote,
  Crop,
  Settings,
  X,
  Check,
  Zap,
} from "lucide-react";
import Link from "next/link";

export interface SectionItem {
  title: string;
  description: string;
  image?: string;
  badge?: string;
  link?: string;
  icon?: string;
  imageSize?: "small" | "medium" | "large" | "full";
  imageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "auto";
  imageRounding?: "none" | "md" | "2xl" | "full";
  imageAlign?: "left" | "center" | "right";
  textAlign?: "left" | "center" | "right";
}

export interface SectionBlock {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  badge?: string;
  layout?: "grid_3" | "grid_2" | "grid_4" | "split" | "list";
  bgColor?: string;
  items: SectionItem[];
}

export interface DocumentAttachment {
  id?: string;
  title: string;
  fileUrl: string;
  category?: string;
  fileSize?: string;
}

export interface StatMetric {
  number: string;
  label: string;
  icon?: string;
}

export interface CustomStyles {
  accentColor?: string;
  bgColor?: string;
  fontFamily?: string;
  textColor?: string;
  storyHeadline?: string;
  mainStory?: string;
  authorName?: string;
  authorTitle?: string;
  authorOrg?: string;
  authorImage?: string;
  authorImageSize?: "small" | "medium" | "large" | "full";
  authorImageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "auto";
  authorImageRounding?: "none" | "md" | "2xl" | "full";
  quote?: string;
  quoteAuthor?: string;
  documents?: DocumentAttachment[];
  stats?: StatMetric[];
}

export interface PageData {
  id?: string;
  slug: string;
  pageName: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroImageSize?: "small" | "medium" | "large" | "full";
  heroImageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "auto";
  heroImageRounding?: "none" | "md" | "2xl" | "full";
  heroMediaType?: string;
  heroVideoUrl?: string;
  heroOverlayOpacity?: number;
  heroCtaText?: string;
  heroCtaLink?: string;
  sections: SectionBlock[];
  customStyles?: CustomStyles;
  isPublished?: boolean;
}

interface VisualCanvasEditorProps {
  page: PageData;
  onChange: (updated: PageData) => void;
  onSave: () => void;
  saving: boolean;
  savedSuccess: boolean;
  onUploadImage: (file: File) => Promise<string | null>;
}

export default function VisualCanvasEditor({
  page,
  onChange,
  onSave,
  saving,
  savedSuccess,
  onUploadImage,
}: VisualCanvasEditorProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoom, setZoom] = useState<number>(100);
  const [selectedElement, setSelectedElement] = useState<{
    type: "hero" | "styling" | "story" | "section" | "item" | "doc" | "stat";
    secIdx?: number;
    itemIdx?: number;
    docIdx?: number;
    statIdx?: number;
  }>({ type: "hero" });

  const [activeImageTarget, setActiveImageTarget] = useState<{
    type: "hero" | "author" | "item";
    secIdx?: number;
    itemIdx?: number;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger file upload for specific target
  const triggerImageUpload = (
    type: "hero" | "author" | "item",
    secIdx?: number,
    itemIdx?: number
  ) => {
    setActiveImageTarget({ type, secIdx, itemIdx });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImageTarget) return;

    setIsUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) {
        if (activeImageTarget.type === "hero") {
          onChange({ ...page, heroImage: url });
        } else if (activeImageTarget.type === "author") {
          onChange({
            ...page,
            customStyles: {
              ...page.customStyles,
              authorImage: url,
            },
          });
        } else if (
          activeImageTarget.type === "item" &&
          activeImageTarget.secIdx !== undefined &&
          activeImageTarget.itemIdx !== undefined
        ) {
          const newSecs = [...(page.sections || [])];
          newSecs[activeImageTarget.secIdx].items[activeImageTarget.itemIdx].image = url;
          onChange({ ...page, sections: newSecs });
        }
      }
    } finally {
      setIsUploading(false);
      setActiveImageTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Section manipulation helpers
  const addSection = (layoutType: "grid_3" | "grid_2" | "split" = "grid_3") => {
    const newSec: SectionBlock = {
      id: `sec_${Date.now()}`,
      type: "modular_cards",
      title: "New Highlight Section",
      subtitle: "Customize section subtitle and description directly on the canvas",
      badge: "Featured Highlights",
      layout: layoutType,
      items: [
        {
          title: "World-Class Infrastructure",
          description: "Smart digital classrooms, laboratories, and interactive learning pods.",
          image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
          badge: "Benchmark",
          link: "/facilities",
          imageSize: "full",
          imageRatio: "16/9",
          imageRounding: "2xl",
        },
        {
          title: "Experiential Cambridge Pedagogy",
          description: "Holistic student-centric curriculum emphasizing critical inquiry and leadership.",
          image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
          badge: "Global Ethos",
          link: "/academics",
          imageSize: "full",
          imageRatio: "16/9",
          imageRounding: "2xl",
        },
      ],
    };
    const updated = [...(page.sections || []), newSec];
    onChange({ ...page, sections: updated });
    setSelectedElement({ type: "section", secIdx: updated.length - 1 });
  };

  const removeSection = (secIdx: number) => {
    const updated = (page.sections || []).filter((_, idx) => idx !== secIdx);
    onChange({ ...page, sections: updated });
    setSelectedElement({ type: "hero" });
  };

  const moveSection = (secIdx: number, direction: "up" | "down") => {
    const newSecs = [...(page.sections || [])];
    const targetIdx = direction === "up" ? secIdx - 1 : secIdx + 1;
    if (targetIdx < 0 || targetIdx >= newSecs.length) return;
    const temp = newSecs[secIdx];
    newSecs[secIdx] = newSecs[targetIdx];
    newSecs[targetIdx] = temp;
    onChange({ ...page, sections: newSecs });
    setSelectedElement({ type: "section", secIdx: targetIdx });
  };

  const addItemToSection = (secIdx: number) => {
    const newSecs = [...(page.sections || [])];
    newSecs[secIdx].items.push({
      title: "New Highlight Card",
      description: "Describe curriculum details, smart facility features, or achievements here.",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
      badge: "Active",
      link: "#",
      imageSize: "full",
      imageRatio: "16/9",
      imageRounding: "2xl",
    });
    onChange({ ...page, sections: newSecs });
  };

  const removeItem = (secIdx: number, itemIdx: number) => {
    const newSecs = [...(page.sections || [])];
    newSecs[secIdx].items = newSecs[secIdx].items.filter((_, idx) => idx !== itemIdx);
    onChange({ ...page, sections: newSecs });
  };

  // Document Helpers
  const addDocument = () => {
    const currentDocs = [...(page.customStyles?.documents || [])];
    currentDocs.push({
      id: `doc_${Date.now()}`,
      title: "Official Prospectus & Academic Curriculum Guide.pdf",
      fileUrl: "/uploads/prospectus.pdf",
      category: "PDF Brochure",
      fileSize: "2.4 MB",
    });
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        documents: currentDocs,
      },
    });
    setSelectedElement({ type: "doc", docIdx: currentDocs.length - 1 });
  };

  // Stat Helpers
  const addStat = () => {
    const currentStats = [...(page.customStyles?.stats || [])];
    currentStats.push({
      number: "100%",
      label: "CBSE Distinction Rate",
    });
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        stats: currentStats,
      },
    });
    setSelectedElement({ type: "stat", statIdx: currentStats.length - 1 });
  };

  const accentColor = page.customStyles?.accentColor || "#F59E0B";
  const fontFamily = page.customStyles?.fontFamily || "Inter";

  const COLOR_PALETTES = [
    { name: "Imperial Gold", hex: "#F59E0B" },
    { name: "Royal Blue", hex: "#2563EB" },
    { name: "Emerald Green", hex: "#10B981" },
    { name: "Sovereign Purple", hex: "#8B5CF6" },
    { name: "Ruby Crimson", hex: "#E11D48" },
    { name: "Cyan Ice", hex: "#06B6D4" },
  ];

  const FONT_OPTIONS = [
    "Inter",
    "Outfit",
    "Plus Jakarta Sans",
    "Playfair Display",
    "Cinzel",
    "Montserrat",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[750px] bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Hidden File Input for One-Click Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* ========================================================
          TOP CANVAS CONTROLS & STATUS BAR
         ======================================================== */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3 flex flex-wrap items-center justify-between gap-4 z-20 backdrop-blur-xl">
        {/* Left: Page Title & Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Live WYSIWYG Canvas Editor
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
            {page.pageName}
          </span>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
            {page.slug === "home" ? "/" : `/${page.slug}`}
          </span>
        </div>

        {/* Center: Device Viewport Switcher & Zoom */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              viewport === "desktop"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="Desktop View (Full Width)"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              viewport === "tablet"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              viewport === "mobile"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>

          <span className="text-slate-700 px-1">|</span>

          {/* Zoom Controls */}
          <button
            type="button"
            onClick={() => setZoom(Math.max(50, zoom - 15))}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-300 w-10 text-center">
            {zoom}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(Math.min(150, zoom + 15))}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          <Link
            href={page.slug === "home" ? "/" : `/${page.slug}`}
            target="_blank"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1.5"
            title="Preview Live Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Preview Live</span>
          </Link>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer border border-amber-300"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Publishing Live...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 fill-slate-950" />
                <span>⚡ Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          MAIN WORKSPACE (LEFT TOOLBAR + CENTER CANVAS + RIGHT INSPECTOR)
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ----------------------------------------------------
            LEFT SIDEBAR: BLOCK INSERTER & THEME TOOLS
           ---------------------------------------------------- */}
        <div className="w-64 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto space-y-4 shrink-0 hidden lg:flex">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2">
                + Insert Canvas Blocks
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => addSection("grid_3")}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/60 text-xs font-bold text-white flex items-center space-x-2 transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>3-Col Feature Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => addSection("grid_2")}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/60 text-xs font-bold text-white flex items-center space-x-2 transition-all"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>2-Col Feature Cards</span>
                </button>

                <button
                  type="button"
                  onClick={addDocument}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/60 text-xs font-bold text-white flex items-center space-x-2 transition-all"
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Downloadable Document</span>
                </button>

                <button
                  type="button"
                  onClick={addStat}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/60 text-xs font-bold text-white flex items-center space-x-2 transition-all"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Metric Stat Counter</span>
                </button>
              </div>
            </div>

            {/* Quick Color Palette */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2 flex items-center space-x-1.5">
                <Palette className="w-3 h-3 text-amber-400" />
                <span>Theme Accent Color</span>
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {COLOR_PALETTES.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...page,
                        customStyles: { ...page.customStyles, accentColor: c.hex },
                      })
                    }
                    className={`h-7 rounded-lg border flex items-center justify-center transition-all ${
                      accentColor === c.hex
                        ? "border-white ring-2 ring-amber-400"
                        : "border-slate-800 hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {accentColor === c.hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Font Selector */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-2 flex items-center space-x-1.5">
                <Type className="w-3 h-3 text-amber-400" />
                <span>Typography Style</span>
              </span>
              <select
                value={fontFamily}
                onChange={(e) =>
                  onChange({
                    ...page,
                    customStyles: { ...page.customStyles, fontFamily: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-white flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Direct Canvas Editing</span>
            </span>
            <p className="leading-tight">
              Click any text to edit inline. Hover over any image to resize, upload or adjust framing.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------
            CENTER: INTERACTIVE LIVE CANVAS VIEWPORT
           ---------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto bg-slate-950/70 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
          <div
            className={`transition-all duration-300 rounded-3xl overflow-hidden bg-[#030816] text-white shadow-2xl border border-slate-800/80 ${
              viewport === "desktop"
                ? "w-full max-w-6xl"
                : viewport === "tablet"
                ? "w-[768px]"
                : "w-[390px]"
            }`}
            style={{
              fontFamily: fontFamily,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          >
            {/* ========================================================
                CANVAS BLOCK 1: HERO HEADER & BANNER
               ======================================================== */}
            <div
              onClick={() => setSelectedElement({ type: "hero" })}
              className={`relative py-16 sm:py-20 px-6 sm:px-12 border-b transition-all group/hero cursor-pointer ${
                selectedElement.type === "hero"
                  ? "border-amber-400/80 ring-2 ring-amber-400/40"
                  : "border-slate-800/60 hover:border-slate-700"
              }`}
            >
              {/* Floating Hero Quick Toolbar */}
              <div className="absolute top-4 right-4 z-30 opacity-0 group-hover/hero:opacity-100 transition-opacity bg-slate-900/95 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 shadow-2xl backdrop-blur-xl text-xs">
                <span className="text-[10px] font-extrabold uppercase text-amber-400">
                  Hero Banner Block
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerImageUpload("hero");
                  }}
                  className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold flex items-center space-x-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Replace Poster</span>
                </button>
              </div>

              {/* Hero Background Image / Video Layer */}
              {page.heroImage ? (
                <div
                  className="absolute inset-0 bg-cover bg-center pointer-events-none transition-transform duration-700"
                  style={{
                    backgroundImage: `url(${page.heroImage})`,
                    opacity: 1 - (page.heroOverlayOpacity ?? 0.45),
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-slate-950 to-blue-950/40 pointer-events-none" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030816] via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-4xl">
                {/* Editable Badge */}
                <div>
                  <input
                    type="text"
                    value={page.heroBadge || ""}
                    onChange={(e) => onChange({ ...page, heroBadge: e.target.value })}
                    placeholder="Top Badge Tag..."
                    className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-400 w-auto inline-block font-sans"
                  />
                </div>

                {/* Editable Hero Headline */}
                <div>
                  <textarea
                    rows={2}
                    value={page.heroTitle || ""}
                    onChange={(e) => onChange({ ...page, heroTitle: e.target.value })}
                    placeholder="Enter Main Hero Headline Here..."
                    className="w-full bg-transparent text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight leading-tight focus:outline-none focus:bg-slate-900/60 p-2 rounded-2xl border border-transparent hover:border-slate-700 focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Editable Subtitle */}
                <div>
                  <textarea
                    rows={2}
                    value={page.heroSubtitle || ""}
                    onChange={(e) => onChange({ ...page, heroSubtitle: e.target.value })}
                    placeholder="Enter Page Subtitle / Narrative Overview..."
                    className="w-full bg-transparent text-sm sm:text-base text-slate-300 focus:outline-none focus:bg-slate-900/60 p-2 rounded-2xl border border-transparent hover:border-slate-700 focus:border-amber-400 resize-none leading-relaxed"
                  />
                </div>

                {/* Hero CTA Button */}
                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="text"
                    value={page.heroCtaText || ""}
                    onChange={(e) => onChange({ ...page, heroCtaText: e.target.value })}
                    placeholder="Button Label (e.g. Explore Offerings)"
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white border border-amber-300 w-64"
                  />
                  <input
                    type="text"
                    value={page.heroCtaLink || ""}
                    onChange={(e) => onChange({ ...page, heroCtaLink: e.target.value })}
                    placeholder="Link URL (/admissions)"
                    className="bg-slate-900/90 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-mono w-48"
                  />
                </div>
              </div>
            </div>

            {/* ========================================================
                CANVAS BLOCK 2: EDITORIAL STORY & LEADERSHIP LETTER
               ======================================================== */}
            <div
              onClick={() => setSelectedElement({ type: "story" })}
              className={`p-6 sm:p-12 border-b transition-all group/story cursor-pointer relative ${
                selectedElement.type === "story"
                  ? "border-amber-400/80 ring-2 ring-amber-400/40 bg-slate-950/40"
                  : "border-slate-800/60 hover:border-slate-700 bg-slate-950/20"
              }`}
            >
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/story:opacity-100 transition-opacity bg-slate-900/95 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs">
                <span className="text-[10px] font-extrabold uppercase text-purple-400">
                  Leadership & Narrative Block
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Author Portrait & Image Controls */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group/img">
                    {page.customStyles?.authorImage ? (
                      <img
                        src={page.customStyles.authorImage}
                        alt="Author Portrait"
                        className={`w-full object-cover object-top transition-all ${
                          page.customStyles?.authorImageRatio === "1/1"
                            ? "aspect-square"
                            : page.customStyles?.authorImageRatio === "16/9"
                            ? "aspect-video"
                            : "h-72"
                        } ${
                          page.customStyles?.authorImageRounding === "full"
                            ? "rounded-full"
                            : page.customStyles?.authorImageRounding === "none"
                            ? "rounded-none"
                            : "rounded-2xl"
                        }`}
                      />
                    ) : (
                      <div className="h-72 flex flex-col items-center justify-center text-slate-600 space-y-2">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-xs">No Photo Set</span>
                      </div>
                    )}

                    {/* On-Canvas Image Controls Overlay */}
                    <div className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 space-y-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerImageUpload("author");
                        }}
                        className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xl hover:bg-amber-300"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>

                      {/* Image Sizing Quick Toggles */}
                      <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-[10px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                authorImageRatio: "3/4",
                              },
                            });
                          }}
                          className="px-2 py-0.5 rounded text-slate-300 hover:text-white"
                        >
                          Portrait
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                authorImageRatio: "1/1",
                              },
                            });
                          }}
                          className="px-2 py-0.5 rounded text-slate-300 hover:text-white"
                        >
                          Square
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Author Name & Title Inputs */}
                  <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-center">
                    <input
                      type="text"
                      value={page.customStyles?.authorName || ""}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, authorName: e.target.value },
                        })
                      }
                      placeholder="Author / Sign-off Name..."
                      className="w-full bg-transparent text-center font-bold text-white text-base focus:outline-none focus:bg-slate-950 p-1 rounded-lg border border-transparent hover:border-slate-700"
                    />
                    <input
                      type="text"
                      value={page.customStyles?.authorTitle || ""}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, authorTitle: e.target.value },
                        })
                      }
                      placeholder="Designation / Role..."
                      className="w-full bg-transparent text-center font-semibold text-xs text-amber-400 focus:outline-none focus:bg-slate-950 p-1 rounded-lg border border-transparent hover:border-slate-700"
                    />
                  </div>
                </div>

                {/* Right: Narrative Story Paragraphs & Quote */}
                <div className="lg:col-span-8 space-y-4">
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || ""}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          storyHeadline: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter Story Section Headline..."
                    className="w-full bg-transparent text-2xl font-bold font-heading text-white focus:outline-none focus:bg-slate-900/60 p-2 rounded-xl border border-transparent hover:border-slate-700 focus:border-amber-400"
                  />

                  <textarea
                    rows={7}
                    value={page.customStyles?.mainStory || ""}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          mainStory: e.target.value,
                        },
                      })
                    }
                    placeholder="Write your speech, mission statement, or facility specifications here..."
                    className="w-full bg-transparent text-slate-300 text-sm leading-relaxed focus:outline-none focus:bg-slate-900/60 p-3 rounded-xl border border-transparent hover:border-slate-700 focus:border-amber-400 resize-y"
                  />

                  {/* Quote Block */}
                  <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-2xl space-y-2">
                    <input
                      type="text"
                      value={page.customStyles?.quote || ""}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, quote: e.target.value },
                        })
                      }
                      placeholder='Inspirational Quote (e.g. "Education is the most powerful weapon...")'
                      className="w-full bg-transparent text-amber-200 font-bold text-xs italic focus:outline-none focus:bg-slate-950 p-1 rounded"
                    />
                    <input
                      type="text"
                      value={page.customStyles?.quoteAuthor || ""}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, quoteAuthor: e.target.value },
                        })
                      }
                      placeholder="Quote Citation (e.g. Nelson Mandela)"
                      className="w-full bg-transparent text-amber-400/80 text-[11px] focus:outline-none focus:bg-slate-950 p-1 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                CANVAS BLOCK 3: KEY STATS COUNTERS
               ======================================================== */}
            {page.customStyles?.stats && page.customStyles.stats.length > 0 && (
              <div
                onClick={() => setSelectedElement({ type: "stat", statIdx: 0 })}
                className="p-6 sm:p-8 bg-slate-900/60 border-b border-slate-800/80 relative group/stats cursor-pointer"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {page.customStyles.stats.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1 relative group/st"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = (page.customStyles?.stats || []).filter(
                            (_, idx) => idx !== sIdx
                          );
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, stats: updated },
                          });
                        }}
                        className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover/st:opacity-100 transition-opacity"
                        title="Delete Stat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="text"
                        value={st.number || ""}
                        onChange={(e) => {
                          const updated = [...(page.customStyles?.stats || [])];
                          updated[sIdx].number = e.target.value;
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, stats: updated },
                          });
                        }}
                        placeholder="100%"
                        className="w-full bg-transparent text-center text-2xl sm:text-3xl font-black text-amber-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={st.label || ""}
                        onChange={(e) => {
                          const updated = [...(page.customStyles?.stats || [])];
                          updated[sIdx].label = e.target.value;
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, stats: updated },
                          });
                        }}
                        placeholder="Benchmark Metric"
                        className="w-full bg-transparent text-center text-xs text-slate-300 font-semibold focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                CANVAS BLOCK 4: MODULAR SECTIONS & FEATURE CARDS
               ======================================================== */}
            {(page.sections || []).map((section, secIdx) => (
              <div
                key={section.id || secIdx}
                onClick={() => setSelectedElement({ type: "section", secIdx })}
                className={`p-6 sm:p-12 border-b transition-all relative group/sec cursor-pointer ${
                  selectedElement.type === "section" && selectedElement.secIdx === secIdx
                    ? "border-amber-400/80 ring-2 ring-amber-400/40 bg-slate-950/40"
                    : "border-slate-800/60 hover:border-slate-700"
                }`}
              >
                {/* Floating Section Toolbar */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover/sec:opacity-100 transition-opacity bg-slate-900/95 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center space-x-2 text-xs shadow-2xl backdrop-blur-xl">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400">
                    Section #{secIdx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(secIdx, "up");
                    }}
                    disabled={secIdx === 0}
                    className="p-1 hover:text-amber-400 disabled:opacity-30"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(secIdx, "down");
                    }}
                    disabled={secIdx === (page.sections || []).length - 1}
                    className="p-1 hover:text-amber-400 disabled:opacity-30"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItemToSection(secIdx);
                    }}
                    className="px-2 py-1 bg-amber-400 text-slate-950 rounded-lg font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(secIdx);
                    }}
                    className="p-1 text-rose-400 hover:text-rose-300"
                    title="Delete Section"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Section Header */}
                <div className="max-w-2xl mx-auto text-center space-y-2 mb-8">
                  <input
                    type="text"
                    value={section.title || ""}
                    onChange={(e) => {
                      const newSecs = [...(page.sections || [])];
                      newSecs[secIdx].title = e.target.value;
                      onChange({ ...page, sections: newSecs });
                    }}
                    placeholder="Enter Section Title..."
                    className="w-full bg-transparent text-center text-2xl sm:text-3xl font-extrabold font-heading text-white focus:outline-none focus:bg-slate-900/60 p-1.5 rounded-xl border border-transparent hover:border-slate-700"
                  />
                  <input
                    type="text"
                    value={section.subtitle || ""}
                    onChange={(e) => {
                      const newSecs = [...(page.sections || [])];
                      newSecs[secIdx].subtitle = e.target.value;
                      onChange({ ...page, sections: newSecs });
                    }}
                    placeholder="Enter Section Subtitle Description..."
                    className="w-full bg-transparent text-center text-xs sm:text-sm text-slate-400 focus:outline-none focus:bg-slate-900/60 p-1 rounded-lg border border-transparent hover:border-slate-700"
                  />
                </div>

                {/* Feature Cards Grid */}
                <div
                  className={`grid gap-6 ${
                    section.layout === "grid_2"
                      ? "grid-cols-1 md:grid-cols-2"
                      : section.layout === "grid_4"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {(section.items || []).map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement({ type: "item", secIdx, itemIdx });
                      }}
                      className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-lg space-y-3 p-4 flex flex-col justify-between group/card relative hover:border-amber-400/50 transition-all"
                    >
                      {/* Delete Card Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(secIdx, itemIdx);
                        }}
                        className="absolute top-3 right-3 z-20 text-slate-500 hover:text-rose-400 opacity-0 group-hover/card:opacity-100 transition-opacity bg-slate-950 p-1 rounded-lg border border-slate-800"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-3">
                        {/* Card Image with Floating Upload Controls */}
                        <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video group/cardimg border border-slate-800">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}

                          <label className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover/cardimg:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer p-2 text-center">
                            <Upload className="w-5 h-5 text-amber-400 mb-1" />
                            <span className="text-[11px] font-bold text-white">
                              Upload / Replace Image
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = await onUploadImage(file);
                                if (url) {
                                  const newSecs = [...(page.sections || [])];
                                  newSecs[secIdx].items[itemIdx].image = url;
                                  onChange({ ...page, sections: newSecs });
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Card Badge */}
                        <input
                          type="text"
                          value={item.badge || ""}
                          onChange={(e) => {
                            const newSecs = [...(page.sections || [])];
                            newSecs[secIdx].items[itemIdx].badge = e.target.value;
                            onChange({ ...page, sections: newSecs });
                          }}
                          placeholder="Card Badge (e.g. Featured)"
                          className="bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-md focus:outline-none w-auto"
                        />

                        {/* Card Title */}
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => {
                            const newSecs = [...(page.sections || [])];
                            newSecs[secIdx].items[itemIdx].title = e.target.value;
                            onChange({ ...page, sections: newSecs });
                          }}
                          placeholder="Card Title..."
                          className="w-full bg-transparent text-sm font-bold text-white focus:outline-none focus:bg-slate-950 p-1 rounded-lg border border-transparent hover:border-slate-700"
                        />

                        {/* Card Description */}
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const newSecs = [...(page.sections || [])];
                            newSecs[secIdx].items[itemIdx].description = e.target.value;
                            onChange({ ...page, sections: newSecs });
                          }}
                          placeholder="Card description..."
                          className="w-full bg-transparent text-xs text-slate-400 focus:outline-none focus:bg-slate-950 p-1 rounded-lg border border-transparent hover:border-slate-700 resize-none"
                        />
                      </div>

                      {/* Card Action Link */}
                      <div className="pt-2 border-t border-slate-800/80">
                        <input
                          type="text"
                          value={item.link || ""}
                          onChange={(e) => {
                            const newSecs = [...(page.sections || [])];
                            newSecs[secIdx].items[itemIdx].link = e.target.value;
                            onChange({ ...page, sections: newSecs });
                          }}
                          placeholder="Link URL (/facilities)"
                          className="w-full bg-slate-950 text-slate-400 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ========================================================
                CANVAS BLOCK 5: DOWNLOADABLE DOCUMENTS & PDFS
               ======================================================== */}
            {page.customStyles?.documents && page.customStyles.documents.length > 0 && (
              <div
                onClick={() => setSelectedElement({ type: "doc", docIdx: 0 })}
                className="p-6 sm:p-12 border-b border-slate-800/80 space-y-4 relative group/docs cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
                    <FileDown className="w-5 h-5 text-emerald-400" />
                    <span>Downloadable Official Documents & Guides</span>
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addDocument();
                    }}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {page.customStyles.documents.map((doc, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 relative group/doc"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = (page.customStyles?.documents || []).filter(
                            (_, idx) => idx !== dIdx
                          );
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, documents: updated },
                          });
                        }}
                        className="absolute top-2 right-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover/doc:opacity-100 transition-opacity"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
                          <FileDown className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            value={doc.title || ""}
                            onChange={(e) => {
                              const updated = [...(page.customStyles?.documents || [])];
                              updated[dIdx].title = e.target.value;
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, documents: updated },
                              });
                            }}
                            className="w-full bg-transparent text-xs font-bold text-white focus:outline-none truncate"
                          />
                          <input
                            type="text"
                            value={doc.fileUrl || ""}
                            onChange={(e) => {
                              const updated = [...(page.customStyles?.documents || [])];
                              updated[dIdx].fileUrl = e.target.value;
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, documents: updated },
                              });
                            }}
                            className="w-full bg-transparent text-[11px] font-mono text-slate-500 focus:outline-none truncate"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------
            RIGHT SIDEBAR: ACTIVE ELEMENT INSPECTOR & STYLING
           ---------------------------------------------------- */}
        <div className="w-80 bg-slate-900/95 border-l border-slate-800 p-5 overflow-y-auto space-y-5 shrink-0 hidden xl:block">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>Element Inspector</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {selectedElement.type}
            </span>
          </div>

          {/* INSPECTOR: HERO HEADER */}
          {selectedElement.type === "hero" && (
            <div className="space-y-4 text-xs">
              <span className="font-bold text-white block">Hero Banner Properties</span>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Page Title</label>
                <input
                  type="text"
                  value={page.pageName || ""}
                  onChange={(e) => onChange({ ...page, pageName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Hero Poster Image URL</label>
                <input
                  type="text"
                  value={page.heroImage || ""}
                  onChange={(e) => onChange({ ...page, heroImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 font-mono mb-2"
                />
                <button
                  type="button"
                  onClick={() => triggerImageUpload("hero")}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload From Computer</span>
                </button>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Darkness Overlay ({Math.round((page.heroOverlayOpacity ?? 0.45) * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={page.heroOverlayOpacity ?? 0.45}
                  onChange={(e) =>
                    onChange({ ...page, heroOverlayOpacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* INSPECTOR: STORY BLOCK */}
          {selectedElement.type === "story" && (
            <div className="space-y-4 text-xs">
              <span className="font-bold text-white block">Story & Portrait Properties</span>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Author Photo URL</label>
                <input
                  type="text"
                  value={page.customStyles?.authorImage || ""}
                  onChange={(e) =>
                    onChange({
                      ...page,
                      customStyles: { ...page.customStyles, authorImage: e.target.value },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-300 font-mono mb-2"
                />
                <button
                  type="button"
                  onClick={() => triggerImageUpload("author")}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Author Portrait</span>
                </button>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Photo Rounding</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...page,
                        customStyles: { ...page.customStyles, authorImageRounding: "none" },
                      })
                    }
                    className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  >
                    Sharp
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...page,
                        customStyles: { ...page.customStyles, authorImageRounding: "2xl" },
                      })
                    }
                    className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  >
                    Curved
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...page,
                        customStyles: { ...page.customStyles, authorImageRounding: "full" },
                      })
                    }
                    className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300"
                  >
                    Circle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR: SECTION BLOCK */}
          {selectedElement.type === "section" && selectedElement.secIdx !== undefined && (
            <div className="space-y-4 text-xs">
              <span className="font-bold text-white block">
                Section #{selectedElement.secIdx + 1} Layout
              </span>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Columns Layout</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const newSecs = [...(page.sections || [])];
                      newSecs[selectedElement.secIdx!].layout = "grid_2";
                      onChange({ ...page, sections: newSecs });
                    }}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-slate-300 hover:text-white"
                  >
                    2 Columns
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newSecs = [...(page.sections || [])];
                      newSecs[selectedElement.secIdx!].layout = "grid_3";
                      onChange({ ...page, sections: newSecs });
                    }}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-slate-300 hover:text-white"
                  >
                    3 Columns
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newSecs = [...(page.sections || [])];
                      newSecs[selectedElement.secIdx!].layout = "grid_4";
                      onChange({ ...page, sections: newSecs });
                    }}
                    className="p-2 bg-slate-950 border border-slate-800 rounded-xl font-bold text-slate-300 hover:text-white"
                  >
                    4 Columns
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
