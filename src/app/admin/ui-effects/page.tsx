"use client";

import React, { useState } from "react";
import UiEffectsSelectorModal from "@/components/ui/UiEffectsSelectorModal";
import { Sparkles, Sliders, ExternalLink, ArrowRight, ShieldCheck, Palette, Zap } from "lucide-react";
import Link from "next/link";

export default function AdminUiEffectsPage() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Interactive Visual Experience</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            Modern UI Effects Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure cutting-edge interactive effects inspired by modern award-winning web designs — including cursor spotlight cards, magnetic CTA buttons, floating frosted header docks, and kinetic reading progress bars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/25 transition-all cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Effects Studio</span>
          </button>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Spotlight Cursor Glow</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dynamic radial light follow effect that illuminates card borders and surfaces as the visitor’s cursor moves across them.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Magnetic CTA Buttons</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            High-polish tactile micro-motion on buttons with automatic sliding arrow transitions and spring response.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Floating Header Dock</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Detached glassmorphic floating navigation pill with frosted backdrop blur and soft ambient edge lighting.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Hairline Reading Bar</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ultra-fine multi-color scroll progress indicator fixed to the top edge of all pages, tracking page traversal in real time.
          </p>
        </div>
      </div>

      {/* Main Studio Modal Trigger Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-blue-500/10 border-2 border-amber-400/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-xl font-black font-heading text-white">
            Configure Live Visual Effects
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Click below to open the full interactive configuration studio with live toggle controls, instant preview, and custom spotlight color palettes.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Sliders className="w-4 h-4" />
          <span>Launch Interactive Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* The Full Modern UI Effects Studio Modal */}
      <UiEffectsSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
