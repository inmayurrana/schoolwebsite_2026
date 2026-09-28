"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Award,
  Search,
  Users,
  Sparkles,
  BookOpen,
  List,
  LayoutGrid,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Mail,
  ArrowRight,
  ExternalLink,
  Briefcase,
  Star,
  RotateCcw,
  Copy,
  Check,
  Tv,
} from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useUiEffects } from "@/components/providers/UiEffectsProvider";

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string;
  email?: string | null;
  photoUrl: string;
  bio?: string | null;
  sortOrder: number;
  isLeadership: boolean;
}

interface Props {
  initialFaculty: FacultyMember[];
}

/**
 * Modern High-Impact Faculty List Card with smooth mouse-over zoom
 */
function FacultyListRow({
  member,
  index,
  onOpenZoom,
}: {
  member: FacultyMember;
  index: number;
  onOpenZoom: (m: FacultyMember) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="relative z-10 hover:z-20 group cursor-pointer"
      onClick={() => onOpenZoom(member)}
    >
      <div className="relative rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-amber-400/80 bg-white/95 dark:bg-slate-900/95 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden backdrop-blur-xl transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-amber-50/20 group-hover:to-white dark:group-hover:from-slate-900 dark:group-hover:via-amber-950/10 dark:group-hover:to-slate-900">
        
        {/* Subtle hover gradient glow border line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400 transition-all duration-500" />

        {/* Left & Middle Block: Avatar with Hover Zoom + Academic Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
          {/* Avatar Container with smooth hover zoom */}
          <div className="relative shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg group-hover:border-amber-400 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all duration-300 bg-slate-100 dark:bg-slate-950">
              <OptimizedImage
                src={
                  member.photoUrl ||
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=75"
                }
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-115"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />

              {/* Hover Zoom Prompt Badge */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-amber-400 text-slate-950 px-2 py-1 rounded-full text-[10px] font-black flex items-center space-x-1 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <ZoomIn className="w-3 h-3" />
                  <span>HD Zoom</span>
                </div>
              </div>
            </div>

            {/* Leadership Star / Sparkle Badge */}
            {member.isLeadership && (
              <span
                className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 p-1.5 rounded-full shadow-lg border border-white/80 animate-pulse"
                title="Leadership Pillar"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950" />
              </span>
            )}
          </div>

          {/* Academic Profile Details */}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors tracking-tight">
                {member.name}
              </h3>

              <span className="bg-school-primary/10 dark:bg-amber-400/10 text-school-primary dark:text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-school-primary/20 dark:border-amber-400/30 shadow-xs">
                {member.department}
              </span>

              {member.isLeadership && (
                <span className="bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-amber-600 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-400/40 flex items-center space-x-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Leadership Pillar</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400">
              {member.designation}
            </p>

            {/* Qualifications & Experience Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-600 dark:text-slate-300">
              {member.qualification && (
                <div className="inline-flex items-center space-x-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {member.qualification}
                  </span>
                </div>
              )}
              {member.experience && (
                <div className="inline-flex items-center space-x-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {member.experience}
                  </span>
                </div>
              )}
            </div>

            {member.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                {member.bio}
              </p>
            )}
          </div>
        </div>

        {/* Right Block: Action Column */}
        <div className="flex sm:flex-row lg:flex-col items-center sm:items-end justify-between lg:justify-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80 pt-4 lg:pt-0 lg:pl-6">
          <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Educator</span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                title={`Email ${member.name}`}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom(member);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>View HD Profile</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Advanced High-End HD Faculty Grid Card with Precision Optics & Viewfinder HUD
 */
function FacultyGridCard({
  member,
  index,
  onOpenZoom,
}: {
  member: FacultyMember;
  index: number;
  onOpenZoom: (m: FacultyMember) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
      className="relative z-10 hover:z-20 cursor-pointer group flex flex-col h-full"
      onClick={() => onOpenZoom(member)}
    >
      <div className="spotlight-card sqsp-spotlight rounded-[28px] overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-lg hover:shadow-[0_25px_60px_-12px_rgba(15,23,42,0.18),0_0_35px_rgba(245,158,11,0.2)] dark:hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_40px_rgba(245,158,11,0.25)] bg-white/95 dark:bg-[#0c1424]/95 flex flex-col flex-1 hover:border-amber-400/80 dark:hover:border-amber-400/80 transition-all duration-500 relative backdrop-blur-2xl">
        
        {/* Ambient Ring Inset for Refined Glass Depth */}
        <div className="absolute inset-0 rounded-[28px] pointer-events-none ring-1 ring-inset ring-black/5 dark:ring-white/10 group-hover:ring-amber-400/30 transition-all duration-300 z-20" />

        {/* Photo Viewport */}
        <div className="relative h-72 sm:h-76 w-full bg-slate-950 overflow-hidden">
          <OptimizedImage
            src={
              member.photoUrl ||
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
            }
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Cinematic Vignette Overlays: Top Ambient Shade & Bottom Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none z-10" />

          {/* Floating Badges: Department & Leadership */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
            {/* Department Tag with Neon Pulsing Beacon */}
            <span className="bg-slate-950/80 dark:bg-slate-900/85 backdrop-blur-xl text-amber-300 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-amber-400/40 shadow-xl tracking-wider flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span>{member.department}</span>
            </span>

            {/* Leadership Gold Foil Badge */}
            {member.isLeadership && (
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/30 flex items-center space-x-1 border border-white/80 ring-2 ring-amber-400/30 tracking-wider">
                <Star className="w-3 h-3 fill-slate-950 text-slate-950 shrink-0" />
                <span>Leadership</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Area with Advanced UI & HUD Credential Chips */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Header: Name + Verified Check + Designation */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-black font-heading text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors tracking-tight flex items-center">
                  <span>{member.name}</span>
                  <span title="Verified Faculty Profile" className="inline-flex items-center ml-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/15 shrink-0" />
                  </span>
                </h3>
              </div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-md border border-sky-200 dark:border-sky-800/50 mt-1">
                <span>{member.designation}</span>
              </div>
            </div>

            {/* Credential HUD Chips: Education & Experience */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {member.qualification && (
                <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 px-3 py-2 rounded-2xl border border-slate-200/70 dark:border-white/5 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">Education</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{member.qualification}</p>
                  </div>
                </div>
              )}
              {member.experience && (
                <div className="flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 px-3 py-2 rounded-2xl border border-slate-200/70 dark:border-white/5 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/20">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none mb-0.5">Experience</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{member.experience}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Truncated Bio Preview */}
            {member.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                {member.bio}
              </p>
            )}
          </div>

          {/* Action Bar & Accreditation Footer */}
          <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Cambridge International</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom(member);
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 group-hover:bg-amber-500 group-hover:text-slate-950 dark:group-hover:text-slate-950 px-3.5 py-1.5 rounded-full border border-amber-500/30 group-hover:border-amber-500 transition-all duration-300 shadow-xs cursor-pointer group/cta"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * State-of-the-Art Interactive HD Profile Modal with Lens Inspection & Dossier
 */
function FacultyHDProfileModal({
  member,
  onClose,
}: {
  member: FacultyMember;
  onClose: () => void;
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<"bio" | "specialization" | "contact">("bio");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { config: uiConfig } = useUiEffects();
  const lightBorderActive = uiConfig?.photoLightBorderEffect ?? true;
  const activeLightMode = uiConfig?.photoLightBorderMode || "spectrum";

  const lightGradients = {
    spectrum: "conic-gradient(from 0deg, #F59E0B, #00F0FF, #3B82F6, #10B981, #EC4899, #8B5CF6, #F59E0B)",
    cyanGold: "conic-gradient(from 0deg, #F59E0B, #00F0FF, #F59E0B, #00F0FF, #F59E0B)",
    aurora: "conic-gradient(from 0deg, #10B981, #00F0FF, #6366F1, #10B981, #00F0FF)",
    sunset: "conic-gradient(from 0deg, #F59E0B, #EF4444, #EC4899, #8B5CF6, #F59E0B)",
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopyEmail = () => {
    if (!member.email) return;
    navigator.clipboard.writeText(member.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleToggleZoom = () => {
    setZoomLevel((prev) => (prev >= 2 ? 1 : prev + 0.5));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Cinematic Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-2xl cursor-pointer"
      />

      {/* Modern Interactive HD Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 25 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white backdrop-blur-3xl overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_#10b981]"></span>
            </span>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-300">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Mentors</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close Profile (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left 5 Cols: Interactive HD Zoom Visual Inspector with Multi-Light Frame */}
            <div className="md:col-span-5 space-y-4">
              
              {/* Multi-Light Photo Frame Chassis: Light effect confined strictly to the border of the photo */}
              <div className="relative rounded-[30px] p-[2.5px] overflow-hidden flex items-center justify-center shadow-2xl bg-slate-900 border border-slate-800">
                
                {/* Sharp Rotating Multi-Light Laser Beam Border (Confined strictly to photo border perimeter) */}
                {lightBorderActive && (
                  <div className="absolute inset-0 rounded-[30px] overflow-hidden pointer-events-none">
                    <div 
                      className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 animate-[spin_5s_linear_infinite]"
                      style={{
                        background: lightGradients[activeLightMode] || lightGradients.spectrum,
                      }}
                    />
                  </div>
                )}

                {/* Core Obsidian Frame Body */}
                <div className="relative w-full aspect-[4/5] rounded-[27.5px] overflow-hidden bg-slate-950 z-10 flex items-center justify-center">

                  {/* Multi-Color Neon Viewfinder Brackets */}
                  <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_10px_#00F0FF] rounded-tl pointer-events-none z-20" />
                  <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 shadow-[0_0_10px_#F59E0B] rounded-tr pointer-events-none z-20" />
                  <div className="absolute bottom-16 left-3.5 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400 shadow-[0_0_10px_#10B981] rounded-bl pointer-events-none z-20" />
                  <div className="absolute bottom-16 right-3.5 w-3.5 h-3.5 border-b-2 border-r-2 border-fuchsia-400 shadow-[0_0_10px_#EC4899] rounded-br pointer-events-none z-20" />

                  {/* 1080p HD Badge on Photo */}
                  <div className="absolute top-3 left-3 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-400/50 text-[10px] font-black text-emerald-400 shadow-md">
                    <Tv className="w-3 h-3" />
                    <span>1080p Ultra-HD</span>
                  </div>

                  {member.isLeadership && (
                    <div className="absolute top-3 right-3 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-lg border border-white/80">
                      <Star className="w-3 h-3 fill-slate-950" />
                      <span>Leadership</span>
                    </div>
                  )}

                  {/* Magnified Image Container */}
                  <div
                    className="w-full h-full transition-transform duration-300 ease-out overflow-hidden flex items-center justify-center"
                    style={{
                      cursor: zoomLevel > 1 ? "grab" : "zoom-in",
                    }}
                    onClick={handleToggleZoom}
                    title="Click to zoom in/out"
                  >
                    <img
                      src={
                        member.photoUrl ||
                        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85"
                      }
                      alt={member.name}
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transition: "transform 0.25s ease-out",
                      }}
                      className="w-full h-full object-cover select-none will-change-transform"
                    />
                  </div>

                  {/* Floating Zoom Controls Bar */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 z-20 shadow-xl">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                        disabled={zoomLevel <= 1}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>

                      <span className="text-[11px] font-black text-amber-400 min-w-[50px] text-center font-mono">
                        {Math.round(zoomLevel * 100)}%
                      </span>

                      <button
                        onClick={() => setZoomLevel((z) => Math.min(2.5, +(z + 0.25).toFixed(2)))}
                        disabled={zoomLevel >= 2.5}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 cursor-pointer transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-1 border-l border-white/20 pl-2">
                      <button
                        onClick={() => setZoomLevel(1)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/10 cursor-pointer transition-colors text-[10px] font-bold flex items-center space-x-1"
                        title="Reset Zoom (100%)"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center space-x-1 pt-1">
                <ZoomIn className="w-3 h-3 text-amber-400" />
                <span>Click image to toggle zoom or use controls (+/-)</span>
              </p>
            </div>

            {/* Right 7 Cols: Full Profile Information & Interactive Tabs */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Name & Academic Rank Headline */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
                    {member.department}
                  </span>
                  
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Cambridge Faculty</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight">
                  {member.name}
                </h2>
                
                <p className="text-base sm:text-lg font-bold text-sky-400">
                  {member.designation}
                </p>
              </div>

              {/* 4-Card Credentials Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Qualification
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {member.qualification || "Post-Graduate"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-sky-400/20 text-sky-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Lead Experience
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {member.experience || "Senior Mentor"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-purple-400/20 text-purple-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Academic Wing
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {member.department}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pedagogy Standard
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      CBSE / Cambridge
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Tabs */}
              <div className="space-y-3">
                <div className="flex border-b border-white/10 space-x-2">
                  <button
                    onClick={() => setActiveTab("bio")}
                    className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeTab === "bio"
                        ? "border-amber-400 text-amber-300"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Academic Biography
                  </button>
                  <button
                    onClick={() => setActiveTab("specialization")}
                    className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeTab === "specialization"
                        ? "border-amber-400 text-amber-300"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Specializations & Subjects
                  </button>
                  {member.email && (
                    <button
                      onClick={() => setActiveTab("contact")}
                      className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                        activeTab === "contact"
                          ? "border-amber-400 text-amber-300"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Direct Contact
                    </button>
                  )}
                </div>

                {/* Tab 1: Biography */}
                {activeTab === "bio" && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2">
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {member.bio ||
                        `${member.name} serves as a foundational educator at Cambridge International School, Mandi, empowering students with rigorous scientific inquiry, critical analysis, and compassionate leadership.`}
                    </p>
                  </div>
                )}

                {/* Tab 2: Specialization */}
                {activeTab === "specialization" && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-2.5 text-xs text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Specialized Curriculum: <strong>CBSE & Cambridge Analytical Inquiry</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Domain Focus: <strong>{member.department} Mentorship & Character Development</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Teaching Methodology: <strong>Experiential Hands-on Discovery & Student Engagement</strong></span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Direct Contact */}
                {activeTab === "contact" && member.email && (
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-700">
                      <div className="flex items-center space-x-2 text-xs">
                        <Mail className="w-4 h-4 text-amber-400" />
                        <span className="font-mono text-slate-200">{member.email}</span>
                      </div>
                      <button
                        onClick={handleCopyEmail}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        {copiedEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Send Official Email</span>
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer ml-auto"
                >
                  <span>Close Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function FacultyDirectoryClient({ initialFaculty }: Props) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [zoomMember, setZoomMember] = useState<FacultyMember | null>(null);

  // Calculate department list with counts
  const departmentsWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: initialFaculty.length };
    initialFaculty.forEach((f) => {
      if (f.department) {
        counts[f.department] = (counts[f.department] || 0) + 1;
      }
    });

    const depts = ["All", ...Object.keys(counts).filter((k) => k !== "All")];
    return depts.map((d) => ({ name: d, count: counts[d] || 0 }));
  }, [initialFaculty]);

  const filteredFaculty = useMemo(() => {
    return initialFaculty.filter((f) => {
      const matchesDept = selectedDept === "All" || f.department === selectedDept;
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        (f.qualification && f.qualification.toLowerCase().includes(q));
      return matchesDept && matchesSearch;
    });
  }, [initialFaculty, selectedDept, searchTerm]);

  return (
    <div className="relative space-y-8">
      {/* Clean Modern Ambient Background Glow (3D Wireframe Removed) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-400/5 dark:bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-32 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Filter & Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl space-y-6 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty by name, department, or qualification..."
              className="w-full bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white pl-11 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 shadow-inner transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Educator Counter + View Switcher */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
              <Users className="w-4 h-4 text-amber-500" />
              <span>
                Showing <strong>{filteredFaculty.length}</strong> of{" "}
                <strong>{initialFaculty.length}</strong> Educators
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-school-primary dark:text-amber-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List View</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-school-primary dark:text-amber-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Department Filter Pills with Count Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {departmentsWithCounts.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => setSelectedDept(name)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 cursor-pointer ${
                selectedDept === name
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 scale-105"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <span>{name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedDept === name
                    ? "bg-slate-950/20 text-slate-950"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Faculty Content Area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {filteredFaculty.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-white/70 dark:bg-slate-900/60 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8 space-y-3 backdrop-blur-sm"
            >
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Educators Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No faculty profiles matched your search or department filter.
              </p>
              <button
                onClick={() => {
                  setSelectedDept("All");
                  setSearchTerm("");
                }}
                className="text-xs font-bold text-amber-500 hover:underline pt-2 cursor-pointer"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : viewMode === "list" ? (
            <motion.div key="list-container" className="space-y-4">
              {filteredFaculty.map((member, idx) => (
                <FacultyListRow
                  key={member.id}
                  member={member}
                  index={idx}
                  onOpenZoom={setZoomMember}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid-container"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredFaculty.map((member, idx) => (
                <FacultyGridCard
                  key={member.id}
                  member={member}
                  index={idx}
                  onOpenZoom={setZoomMember}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* State-of-the-Art Interactive HD Profile Modal */}
      <AnimatePresence>
        {zoomMember && (
          <FacultyHDProfileModal
            member={zoomMember}
            onClose={() => setZoomMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}