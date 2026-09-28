"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Check,
  X,
  Sliders,
  Eye,
  RotateCcw,
  Save,
  ArrowRight,
  Layers,
  MousePointer,
  Maximize2,
  Compass,
  Zap,
  AlignLeft,
  Activity,
  CheckCircle2,
  Palette,
  Loader2,
  Info
} from "lucide-react";

export interface UiEffectsConfig {
  spotlightCards: boolean;
  magneticButtons: boolean;
  imageZoom: boolean;
  floatingHeader: boolean;
  slidingTabs: boolean;
  readingProgressBar: boolean;
  marqueeTicker: boolean;
  kineticTypography: boolean;
  spotlightGlowColor: string;
  photoLightBorderEffect: boolean;
  photoLightBorderMode: "spectrum" | "cyanGold" | "aurora" | "sunset";
}

const DEFAULT_EFFECTS_CONFIG: UiEffectsConfig = {
  spotlightCards: true,
  magneticButtons: true,
  imageZoom: true,
  floatingHeader: true,
  slidingTabs: true,
  readingProgressBar: true,
  marqueeTicker: true,
  kineticTypography: true,
  spotlightGlowColor: "rgba(245, 158, 11, 0.22)", // Royal Amber Gold
  photoLightBorderEffect: true,
  photoLightBorderMode: "cyanGold",
};

const GLOW_COLOR_PRESETS = [
  { name: "Royal Amber Gold", value: "rgba(245, 158, 11, 0.25)", colorClass: "bg-amber-400" },
  { name: "Sapphire Blue", value: "rgba(0, 102, 255, 0.28)", colorClass: "bg-blue-500" },
  { name: "Himalayan Emerald", value: "rgba(16, 185, 129, 0.25)", colorClass: "bg-emerald-400" },
  { name: "Electric Indigo", value: "rgba(99, 102, 241, 0.28)", colorClass: "bg-indigo-500" },
  { name: "Cyber Rose", value: "rgba(244, 63, 94, 0.25)", colorClass: "bg-rose-500" },
  { name: "Subtle White Glass", value: "rgba(255, 255, 255, 0.16)", colorClass: "bg-white" },
];

const PRESETS = [
  {
    name: "Squarespace Ultra Modern",
    description: "All 8 cinematic effects enabled with high-fidelity spotlight and magnetic interactions",
    config: {
      spotlightCards: true,
      magneticButtons: true,
      imageZoom: true,
      floatingHeader: true,
      slidingTabs: true,
      readingProgressBar: true,
      marqueeTicker: true,
      kineticTypography: true,
      spotlightGlowColor: "rgba(245, 158, 11, 0.25)",
      photoLightBorderEffect: true,
      photoLightBorderMode: "cyanGold" as const,
    },
  },
  {
    name: "Clean & High Performance",
    description: "Focused micro-interactions with subtle image zooms and reading bar",
    config: {
      spotlightCards: true,
      magneticButtons: true,
      imageZoom: true,
      floatingHeader: false,
      slidingTabs: true,
      readingProgressBar: true,
      marqueeTicker: false,
      kineticTypography: false,
      spotlightGlowColor: "rgba(0, 102, 255, 0.22)",
      photoLightBorderEffect: true,
      photoLightBorderMode: "spectrum" as const,
    },
  },
  {
    name: "Minimalist Classic",
    description: "Traditional layouts with lightweight interactive tabs and buttons",
    config: {
      spotlightCards: false,
      magneticButtons: true,
      imageZoom: false,
      floatingHeader: false,
      slidingTabs: true,
      readingProgressBar: false,
      marqueeTicker: true,
      kineticTypography: false,
      spotlightGlowColor: "rgba(255, 255, 255, 0.12)",
      photoLightBorderEffect: false,
      photoLightBorderMode: "cyanGold" as const,
    },
  },
];

interface UiEffectsSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (newConfig: UiEffectsConfig) => void;
}

export default function UiEffectsSelectorModal({
  isOpen,
  onClose,
  onSaved,
}: UiEffectsSelectorModalProps) {
  const [config, setConfig] = useState<UiEffectsConfig>(DEFAULT_EFFECTS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"effects" | "presets" | "playground">("effects");

  // Playground interactive state
  const playgroundCardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [demoTabIndex, setDemoTabIndex] = useState(0);

  // Load active effects from API
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("/api/ui-effects")
      .then((res) => res.json())
      .then((data) => {
        if (data.config) {
          setConfig({ ...DEFAULT_EFFECTS_CONFIG, ...data.config });
        }
      })
      .catch((err) => console.error("Error loading UI effects:", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  // Handle card spotlight hover in playground
  const handlePlaygroundMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playgroundCardRef.current) return;
    const rect = playgroundCardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleToggle = (key: keyof UiEffectsConfig) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/ui-effects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        // Apply globally to root dataset
        if (typeof document !== "undefined") {
          document.documentElement.dataset.spotlightCards = String(config.spotlightCards);
          document.documentElement.dataset.magneticButtons = String(config.magneticButtons);
          document.documentElement.dataset.imageZoom = String(config.imageZoom);
          document.documentElement.dataset.floatingHeader = String(config.floatingHeader);
          document.documentElement.dataset.slidingTabs = String(config.slidingTabs);
          document.documentElement.dataset.readingProgressBar = String(config.readingProgressBar);
          document.documentElement.dataset.marqueeTicker = String(config.marqueeTicker);
          document.documentElement.dataset.kineticTypography = String(config.kineticTypography);
          document.documentElement.style.setProperty("--spotlight-glow-color", config.spotlightGlowColor);
        }
        if (onSaved) onSaved(config);
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save UI effects config:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const effectItems = [
    {
      key: "spotlightCards" as const,
      name: "Spotlight Cursor Hover",
      tag: "Squarespace Signature",
      desc: "Radial glow highlight tracks the exact user cursor position over cards & containers.",
      icon: MousePointer,
      color: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30",
    },
    {
      key: "magneticButtons" as const,
      name: "Magnetic CTA & Sliding Arrow",
      tag: "Micro-Interaction",
      desc: "Buttons feature a sliding directional arrow and fluid hover expansion with tactile feedback.",
      icon: Zap,
      color: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30",
    },
    {
      key: "imageZoom" as const,
      name: "Cinematic Image Hover Zoom",
      tag: "Visual Depth",
      desc: "Smooth cubic-bezier image scaling (1.05x) with crisp boundary clipping and soft shadow lift.",
      icon: Maximize2,
      color: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30",
    },
    {
      key: "floatingHeader" as const,
      name: "Frosted Floating Header Dock",
      tag: "Modern Nav",
      desc: "Transforms navigation into an elevated, glassmorphic floating pill dock on scroll.",
      icon: Compass,
      color: "from-indigo-500/20 to-indigo-600/10 text-indigo-400 border-indigo-500/30",
    },
    {
      key: "slidingTabs" as const,
      name: "Animated Sliding Pill Tabs",
      tag: "Fluid State",
      desc: "Active tab background indicator glides seamlessly between sections with spring physics.",
      icon: Layers,
      color: "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30",
    },
    {
      key: "readingProgressBar" as const,
      name: "Hairline Reading Progress Bar",
      tag: "Scroll Feedback",
      desc: "A sleek, glowing gradient progress bar at the very top of the viewport reflecting scroll position.",
      icon: Activity,
      color: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30",
    },
    {
      key: "marqueeTicker" as const,
      name: "Infinite Marquee Ticker",
      tag: "Dynamic Strip",
      desc: "Silky-smooth CSS transform ticker for school announcements and achievements.",
      icon: AlignLeft,
      color: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30",
    },
    {
      key: "kineticTypography" as const,
      name: "Kinetic Typography & Reveal",
      tag: "Scroll Reveal",
      desc: "Subtle staggered entrance animations for section titles, stats, and key highlights.",
      icon: Sparkles,
      color: "from-amber-400/20 to-orange-500/10 text-amber-300 border-amber-400/30",
    },
  ];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(245,158,11,0.12)] flex flex-col max-h-[92vh] overflow-hidden text-white">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-school-secondary flex items-center justify-center text-slate-950 shadow-lg shadow-amber-400/20 font-black">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Modern UI Effects Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Squarespace Inspired
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure cinematic animations and interactive effects without touching any text or images
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700/50"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("effects")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "effects"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Effects Selection ({Object.values(config).filter((v) => v === true).length}/8)</span>
            </button>

            <button
              onClick={() => setActiveTab("presets")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "presets"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Presets & Glow</span>
            </button>

            <button
              onClick={() => setActiveTab("playground")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "playground"
                  ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Test Playground</span>
            </button>
          </div>

          <button
            onClick={() => setConfig(DEFAULT_EFFECTS_CONFIG)}
            className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center space-x-1 transition-colors cursor-pointer"
            title="Reset to recommended defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Loading UI effects configuration...
              </p>
            </div>
          ) : activeTab === "effects" ? (
            <div className="space-y-6">
              {/* Effects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {effectItems.map((item) => {
                const isEnabled = Boolean(config[item.key]);
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.key}
                    onClick={() => handleToggle(item.key)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-3.5 select-none ${
                      isEnabled
                        ? "bg-slate-800/90 border-amber-400/40 shadow-lg shadow-amber-400/5 hover:border-amber-400/70"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-85"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 border ${item.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                            {item.tag}
                          </span>
                        </div>

                        {/* Switch Pill */}
                        <div
                          className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                            isEnabled ? "bg-amber-400" : "bg-slate-700"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-slate-950 shadow transform transition-transform duration-200 ease-in-out ${
                              isEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Multi-Light Photo Border Studio Settings (CMS Dashboard Control) */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-sky-400/20 text-amber-400 border border-amber-400/30">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Faculty & Mentor Photo Frame Multi-Light Border FX</h3>
                    <p className="text-[11px] text-slate-400">
                      Configure the luminous multi-light border on mentor photos. Strictly on the border of the photo with zero background light spill.
                    </p>
                  </div>
                </div>

                <label className="cursor-pointer inline-flex items-center space-x-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold shrink-0">
                  <input
                    type="checkbox"
                    checked={config.photoLightBorderEffect !== false}
                    onChange={(e) => setConfig((prev) => ({ ...prev, photoLightBorderEffect: e.target.checked }))}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <span className={config.photoLightBorderEffect !== false ? "text-amber-400" : "text-slate-400"}>
                    {config.photoLightBorderEffect !== false ? "Border FX: Enabled" : "Border FX: Disabled"}
                  </span>
                </label>
              </div>

              {config.photoLightBorderEffect !== false && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    Select Multi-Light Border Preset:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "spectrum", label: "🌈 Prism Spectrum", desc: "Full spectrum multi-color" },
                      { id: "cyanGold", label: "⚡ Cyber Cyan-Gold", desc: "Amber & high-contrast cyan" },
                      { id: "aurora", label: "🌿 Aurora Emerald", desc: "Eco green & sky wave" },
                      { id: "sunset", label: "🌅 Sunset Flare", desc: "Warm ruby & gold laser" },
                    ].map((mode) => {
                      const isSelected = (config.photoLightBorderMode || "cyanGold") === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setConfig((prev) => ({ ...prev, photoLightBorderMode: mode.id as any }))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-800 border-amber-400 shadow-md font-bold text-white scale-[1.02]"
                              : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                          }`}
                        >
                          <span className="text-xs font-bold block">{mode.label}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{mode.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          ) : activeTab === "presets" ? (
            /* Presets & Glow Palette */
            <div className="space-y-6">
              {/* Presets List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" />
                  <span>Curated Style Bundles</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PRESETS.map((p) => (
                    <div
                      key={p.name}
                      onClick={() => setConfig(p.config)}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-amber-400/40 hover:bg-slate-800/50 transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-amber-400 font-bold">Apply</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glow Color Customizer */}
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Spotlight Glow Color</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Controls the tint of the radial spotlight cursor highlight
                    </p>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow-md"
                    style={{ backgroundColor: config.spotlightGlowColor }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-1">
                  {GLOW_COLOR_PRESETS.map((color) => {
                    const isSelected = config.spotlightGlowColor === color.value;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setConfig((prev) => ({ ...prev, spotlightGlowColor: color.value }))}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-800 border-amber-400 ring-2 ring-amber-400/20"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${color.colorClass} shadow-inner`} />
                        <span className="text-[10px] font-medium text-slate-300 text-center leading-tight truncate w-full">
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Live Interactive Playground */
            <div className="space-y-6">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-start space-x-2.5 text-blue-200 text-xs">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Test live effects below. Hover your mouse over the card to observe the cursor spotlight, try the magnetic sliding-arrow CTA button, or switch tabs to test the animated indicator.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Interactive Spotlight Card */}
                <div
                  ref={playgroundCardRef}
                  onMouseMove={handlePlaygroundMouseMove}
                  className="relative p-6 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden group select-none shadow-xl transition-all"
                  style={{
                    background: config.spotlightCards
                      ? `radial-gradient(320px circle at ${mousePos.x}% ${mousePos.y}%, ${config.spotlightGlowColor}, transparent 80%), #051329`
                      : "#051329",
                  }}
                >
                  <div className="relative z-10 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                      <MousePointer className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Cursor Spotlight Demonstration
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Move your cursor across this container. Notice the dynamic ambient glow following your exact coordinates with zero performance lag.
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-amber-300/80 bg-amber-400/10 px-2 py-1 rounded">
                        x: {Math.round(mousePos.x)}% | y: {Math.round(mousePos.y)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Magnetic CTA Button with Sliding Arrow */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Magnetic Button & Micro-Arrow
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      Hover over the button below. Observe the smooth horizontal arrow slide and hover expansion.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 text-slate-950 transition-all cursor-pointer shadow-lg group relative overflow-hidden ${
                        config.magneticButtons
                          ? "bg-amber-400 hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98] shadow-amber-400/20"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      <span>Explore Cambridge Mandi</span>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform duration-200 ${
                          config.magneticButtons ? "group-hover:translate-x-1.5" : ""
                        }`}
                      />
                    </button>

                    {/* Animated Sliding Pill Tab Demonstration */}
                    <div className="pt-2">
                      <p className="text-[10px] text-slate-400 font-semibold mb-1.5">
                        Sliding Pill Tab Switcher:
                      </p>
                      <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center relative">
                        {["Curriculum", "Admissions", "Campus"].map((tab, idx) => (
                          <button
                            key={tab}
                            onClick={() => setDemoTabIndex(idx)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center relative z-10 ${
                              demoTabIndex === idx
                                ? "bg-amber-400 text-slate-950 shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            {savedSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center space-x-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Modern UI effects applied successfully!</span>
              </span>
            ) : (
              <span>Changes take effect site-wide instantly upon saving.</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Applying Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save & Apply UI Effects</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
