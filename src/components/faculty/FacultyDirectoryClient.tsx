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
} from "lucide-react";
import Faculty3DBackground from "./Faculty3DBackground";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
 * 3D Executive List Row with dynamic specular glare, zoom triggers & multi-layer parallax
 */
function Faculty3DListRow({
  member,
  index,
  onOpenZoom,
}: {
  member: FacultyMember;
  index: number;
  onOpenZoom: (m: FacultyMember) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.28,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.018, y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="relative z-10 hover:z-20 group cursor-pointer"
      onClick={() => onOpenZoom(member)}
    >
      <div
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
        className="glass-card relative rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-lg hover:shadow-2xl hover:border-amber-400/60 bg-white/95 dark:bg-slate-900/95 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 overflow-hidden backdrop-blur-xl transition-all duration-300"
      >
        {/* Dynamic 3D Specular Light */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: tilt.glareOpacity,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.32) 0%, rgba(56, 189, 248, 0.18) 35%, transparent 70%)`,
          }}
        />

        {/* Left & Middle Block: Avatar + Academic Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
          {/* 3D Parallax Avatar with Zoom Lens Overlay */}
          <div
            style={{ transform: "translateZ(38px)", transformStyle: "preserve-3d" }}
            className="relative shrink-0"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-xl group-hover:border-amber-400 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all duration-500 bg-slate-100 dark:bg-slate-950">
              <OptimizedImage
                src={
                  member.photoUrl ||
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=75"
                }
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-120 group-hover:rotate-1 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />

              {/* Hover Zoom Prompt Badge */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-amber-400 text-slate-950 px-2 py-1 rounded-full text-[10px] font-black flex items-center space-x-1 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                  <ZoomIn className="w-3 h-3" />
                  <span>Zoom</span>
                </div>
              </div>
            </div>

            {/* Leadership Star / Sparkle Badge */}
            {member.isLeadership && (
              <span
                style={{ transform: "translateZ(48px)" }}
                className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 p-1.5 rounded-full shadow-lg border border-white/70 animate-pulse"
                title="Leadership Pillar"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950" />
              </span>
            )}
          </div>

          {/* Academic Profile Details */}
          <div
            style={{ transform: "translateZ(26px)", transformStyle: "preserve-3d" }}
            className="space-y-2 flex-1 min-w-0"
          >
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

        {/* Right Block: 3D Interactive Action Column */}
        <div
          style={{ transform: "translateZ(32px)", transformStyle: "preserve-3d" }}
          className="flex sm:flex-row lg:flex-col items-center sm:items-end justify-between lg:justify-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80 pt-4 lg:pt-0 lg:pl-6"
        >
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
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>3D Zoom Profile</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 3D Tilt Grid Card with depth layers, dynamic lighting and zoom preview
 */
function Faculty3DGridCard({
  member,
  index,
  onOpenZoom,
}: {
  member: FacultyMember;
  index: number;
  onOpenZoom: (m: FacultyMember) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -11;
    const rotateY = ((x - centerX) / centerX) * 11;

    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.32,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="relative z-10 hover:z-20 cursor-pointer group"
      onClick={() => onOpenZoom(member)}
    >
      <div
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
        className="glass-card rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white/95 dark:bg-slate-900/95 flex flex-col hover:shadow-2xl hover:border-amber-400/60 transition-all duration-300 relative backdrop-blur-xl"
      >
        {/* Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-20"
          style={{
            opacity: tilt.glareOpacity,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.35) 0%, rgba(56, 189, 248, 0.18) 45%, transparent 70%)`,
          }}
        />

        {/* 3D Photo Area with Interactive Zoom */}
        <div
          style={{ transform: "translateZ(32px)", transformStyle: "preserve-3d" }}
          className="relative h-64 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden"
        >
          <OptimizedImage
            src={
              member.photoUrl ||
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=450&auto=format&fit=crop&q=75"
            }
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-118 group-hover:rotate-1 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Floating Badges */}
          <div
            style={{ transform: "translateZ(46px)" }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none"
          >
            <span className="bg-school-primary/90 dark:bg-slate-950/90 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-400/40 shadow-lg tracking-wider">
              {member.department}
            </span>

            {member.isLeadership && (
              <span className="bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1 border border-white/60">
                <Star className="w-3 h-3 fill-slate-950" />
                <span>Leadership</span>
              </span>
            )}
          </div>

          {/* Quick Zoom Overlay on Photo */}
          <div className="absolute bottom-3 right-3 z-10">
            <div className="bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white p-2 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 shadow-lg flex items-center space-x-1.5 text-xs font-bold">
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase font-black tracking-wider">Zoom</span>
            </div>
          </div>
        </div>

        {/* 3D Content Area */}
        <div
          style={{ transform: "translateZ(26px)" }}
          className="p-6 flex-1 flex flex-col justify-between space-y-4 transition-transform duration-300 group-hover:scale-[1.01] origin-top"
        >
          <div className="space-y-2.5">
            <div>
              <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors tracking-tight">
                {member.name}
              </h3>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                {member.designation}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
              {member.qualification && (
                <div className="flex items-start space-x-2">
                  <GraduationCap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{member.qualification}</span>
                </div>
              )}
              {member.experience && (
                <div className="flex items-start space-x-2">
                  <Award className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium">{member.experience}</span>
                </div>
              )}
            </div>

            {member.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {member.bio}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
              Cambridge International
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom(member);
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-black text-amber-500 hover:text-amber-400 transition-colors"
            >
              <span>View Profile</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * High-End 3D Zoom Profile Modal with interactive magnification & credentials
 */
function Faculty3DZoomModal({
  member,
  onClose,
}: {
  member: FacultyMember;
  onClose: () => void;
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const [modalTilt, setModalTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalCardRef.current) return;
    const rect = modalCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setModalTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setModalTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Cinematic Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl cursor-pointer"
      />

      {/* 3D Floating Modal Card */}
      <motion.div
        ref={modalCardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-400/40 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white backdrop-blur-2xl"
      >
        <div
          style={{
            transform: `rotateX(${modalTilt.rotateX}deg) rotateY(${modalTilt.rotateY}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
          className="p-6 sm:p-10 space-y-8"
        >
          {/* Header bar with Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-300">
                Educator 3D Zoom Profile
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Profile (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left 5 Cols: Interactive Zoom Portrait */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.3)] bg-slate-950 aspect-[4/5] group flex items-center justify-center">
                <div
                  className="w-full h-full transition-transform duration-300 ease-out"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    cursor: zoomLevel > 1 ? "grab" : "zoom-in",
                  }}
                  onClick={() => setZoomLevel((prev) => (prev >= 2 ? 1 : prev + 0.5))}
                >
                  <img
                    src={
                      member.photoUrl ||
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=85"
                    }
                    alt={member.name}
                    className="w-full h-full object-cover select-none"
                  />
                </div>

                {/* Floating Zoom Controls Bar */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 z-20">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                    disabled={zoomLevel <= 1}
                    className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>

                  <span className="text-[11px] font-bold text-amber-400 min-w-[45px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>

                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    disabled={zoomLevel >= 2.5}
                    className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 text-slate-400 hover:text-white border-l border-white/20 pl-2 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                Click photo or use controls to zoom into details
              </p>
            </div>

            {/* Right 7 Cols: Full Profile Information */}
            <div className="md:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-md">
                    {member.department}
                  </span>
                  {member.isLeadership && (
                    <span className="bg-amber-500/20 text-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-400/40 flex items-center space-x-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>Leadership Pillar</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-4xl font-black font-heading text-white">
                  {member.name}
                </h2>
                <p className="text-base sm:text-lg font-bold text-sky-400">
                  {member.designation}
                </p>
              </div>

              {/* Badges Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-amber-400 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Qualification
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {member.qualification || "Post-Graduate Certified"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-sky-400/20 text-sky-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Teaching Experience
                    </span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {member.experience || "Senior Mentor"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Biography Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Pedagogy & Background
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                  {member.bio ||
                    `${member.name} plays a vital role in our academic ecosystem at Cambridge International School, Mandi, inspiring students toward academic excellence, critical inquiry, and compassionate global citizenship.`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Send Email ({member.email})</span>
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Close Preview</span>
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
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
      {/* 3D Background Orbital Mesh */}
      <Faculty3DBackground />

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
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                title="Executive List View"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-school-primary dark:text-amber-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">3D List</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="3D Card Grid View"
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-school-primary dark:text-amber-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">3D Grid</span>
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
                <Faculty3DListRow
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
                <Faculty3DGridCard
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

      {/* 3D Zoom Profile Lightbox Modal */}
      <AnimatePresence>
        {zoomMember && (
          <Faculty3DZoomModal
            member={zoomMember}
            onClose={() => setZoomMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}