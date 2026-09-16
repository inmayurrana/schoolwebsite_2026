"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Award, Search, Users, Sparkles, BookOpen, List, LayoutGrid, ShieldCheck, CheckCircle2 } from "lucide-react";
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
 * 3D Tilt List Row with dynamic specular glare & multi-layer parallax depth
 */
function Faculty3DListRow({ member, index }: { member: FacultyMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
    const rotateY = ((x - centerX) / centerX) * 9;

    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.22,
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
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.025, y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="relative z-10 hover:z-20 cursor-pointer"
    >
      <div
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
        className="glass-card group relative rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800/80 shadow-lg bg-white/90 dark:bg-slate-900/90 hover:border-amber-400/60 hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-6 overflow-hidden backdrop-blur-md"
      >
        {/* Dynamic 3D Glare Light */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: tilt.glareOpacity,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.3) 0%, rgba(56, 189, 248, 0.15) 40%, transparent 75%)`,
          }}
        />

        {/* 3D Parallax Layer 1: Avatar Portrait */}
        <div
          style={{ transform: "translateZ(35px)", transformStyle: "preserve-3d" }}
          className="relative shrink-0"
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl group-hover:border-amber-400 transition-colors">
            <OptimizedImage
              src={member.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=75"}
              alt={member.name}
              className="w-full h-full group-hover:scale-115 transition-transform duration-300 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {member.isLeadership && (
            <span
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 p-1.5 rounded-full shadow-lg border border-white/40"
              title="Academic Leadership"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        {/* 3D Parallax Layer 2: Main Info */}
        <div
          style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }}
          className="flex-1 space-y-2.5 min-w-0 transition-transform duration-300 group-hover:scale-[1.02] origin-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-xl font-bold font-heading text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
              {member.name}
            </h3>
            <span className="bg-school-primary/10 dark:bg-school-primary/40 text-school-primary dark:text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-400/20 shadow-sm">
              {member.department}
            </span>
            {member.isLeadership && (
              <span className="bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Leadership Pillar</span>
              </span>
            )}
          </div>

          <div className="text-xs sm:text-sm font-semibold text-school-secondary dark:text-sky-400">
            {member.designation}
          </div>

          {/* Qualification & Experience Pills */}
          <div
            style={{ transform: "translateZ(30px)" }}
            className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300 pt-0.5"
          >
            {member.qualification && (
              <div className="inline-flex items-center space-x-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-medium">{member.qualification}</span>
              </div>
            )}
            {member.experience && (
              <div className="inline-flex items-center space-x-1.5 bg-slate-100/90 dark:bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
                <Award className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span className="font-medium">{member.experience}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {member.bio && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 pt-1">
              {member.bio}
            </p>
          )}
        </div>

        
      </div>
    </motion.div>
  );
}

/**
 * 3D Tilt Grid Card
 */
function Faculty3DGridCard({ member, index }: { member: FacultyMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, glareOpacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.25,
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
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="relative z-10 hover:z-20 cursor-pointer"
    >
      <div
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.12s ease-out",
        }}
        className="glass-card group rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-xl bg-white/90 dark:bg-slate-900/90 flex flex-col hover:shadow-2xl hover:border-amber-400/50 transition-shadow duration-300 relative backdrop-blur-md"
      >
        {/* Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-20"
          style={{
            opacity: tilt.glareOpacity,
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(251, 191, 36, 0.35) 0%, rgba(56, 189, 248, 0.15) 45%, transparent 70%)`,
          }}
        />

        {/* 3D Photo Area */}
        <div
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
          className="relative h-64 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden"
        >
          <OptimizedImage
            src={member.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=75"}
            alt={member.name}
            className="w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Badges */}
          <div
            style={{ transform: "translateZ(40px)" }}
            className="absolute top-4 left-4 flex flex-wrap gap-1.5"
          >
            <span className="bg-school-primary/95 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-amber-400/30 shadow-md">
              {member.department}
            </span>
            {member.isLeadership && (
              <span className="bg-gradient-to-r from-amber-500 to-amber-300 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Leadership</span>
              </span>
            )}
          </div>
        </div>

        {/* 3D Text Area */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="p-6 flex-1 flex flex-col justify-between space-y-4 transition-transform duration-300 group-hover:scale-[1.02] origin-top"
        >
          <div className="space-y-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-school-secondary dark:text-sky-400 mt-0.5">
                {member.designation}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
              {member.qualification && (
                <div className="flex items-start space-x-2">
                  <GraduationCap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{member.qualification}</span>
                </div>
              )}
              {member.experience && (
                <div className="flex items-start space-x-2">
                  <Award className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{member.experience}</span>
                </div>
              )}
            </div>

            {member.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                {member.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FacultyDirectoryClient({ initialFaculty }: Props) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const departments = useMemo(() => {
    const set = new Set<string>();
    initialFaculty.forEach((f) => {
      if (f.department) set.add(f.department);
    });
    return ["All", ...Array.from(set)];
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
        className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md space-y-6 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty by name, department, or subject..."
              className="w-full bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-400 dark:focus:border-amber-400 shadow-inner transition-all"
            />
          </div>

          {/* Controls: Counter + View Switcher */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Users className="w-4 h-4 text-amber-500" />
              <span><strong>{filteredFaculty.length}</strong> of <strong>{initialFaculty.length}</strong> Educators</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-slate-900 text-school-primary dark:text-amber-300 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List View</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                title="Grid View"
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-slate-900 text-school-primary dark:text-amber-300 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedDept === dept
                  ? "bg-school-primary text-white shadow-md shadow-school-primary/20 dark:bg-amber-400 dark:text-slate-950 scale-105"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {dept}
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
                className="text-xs font-bold text-amber-500 hover:underline pt-2"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : viewMode === "list" ? (
            <motion.div key="list-container" className="space-y-4">
              {filteredFaculty.map((member, idx) => (
                <Faculty3DListRow key={member.id} member={member} index={idx} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredFaculty.map((member, idx) => (
                <Faculty3DGridCard key={member.id} member={member} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}