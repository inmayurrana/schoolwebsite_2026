"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, Lightbulb, Compass, Award } from "lucide-react";

interface StreamWing {
  id: string;
  title: string;
  grades: string;
  age: string;
  desc: string;
  subjects: string[];
  image: string;
  link: string;
}

const wings: StreamWing[] = [
  {
    id: "pre-primary",
    title: "Pre-Primary / Early Years",
    grades: "Nursery, LKG, UKG",
    age: "3 to 5 Years",
    desc: "A playful, discovery-driven environment nurturing foundational phonics, sensory exploration, motor coordination, and curiosity.",
    subjects: ["Phonics & Storytelling", "Sensory Discovery", "Early Number Sense", "Creative Arts & Clay", "Music & Movement"],
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80",
    link: "/academics/pre-primary",
  },
  {
    id: "primary",
    title: "Primary Wing",
    grades: "Grades 1 to 5",
    age: "6 to 10 Years",
    desc: "Activity-oriented experiential pedagogy cultivating strong fundamentals in literacy, numeracy, environmental awareness, and digital fluency.",
    subjects: ["English Language & Lit", "Mathematics Mastery", "Environmental Science", "Hindi & Regional Lang", "Coding Basics", "Physical Education"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    link: "/academics/primary",
  },
  {
    id: "middle",
    title: "Middle School Wing",
    grades: "Grades 6 to 8",
    age: "11 to 13 Years",
    desc: "Transition from concrete learning to conceptual inquiry, hands-on STEM laboratory experimentation, and active debate.",
    subjects: ["Integrated Sciences (PCB)", "Algebra & Geometry", "Social Sciences & Civics", "Sanskrit / French", "Robotics & AI Lab", "Performing Arts"],
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    link: "/academics/middle-school",
  },
  {
    id: "senior-sec",
    title: "Senior Secondary Wing",
    grades: "Grades 9 to 12",
    age: "14 to 18 Years",
    desc: "Comprehensive CBSE Board mastery with specialized 4-stream choices, JEE/NEET/CUET foundation, and global university placement.",
    subjects: ["Science: Medical (PCB+BioTech)", "Science: Non-Med (PCM+Comp)", "Commerce (Acc, BST, Eco)", "Humanities (Pol Sci, Psych)", "AI & Data Science"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    link: "/academics/senior-secondary",
  },
];

export default function AcademicStreams() {
  const [activeWing, setActiveWing] = useState<StreamWing>(wings[0]);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-[#f0f7ff]/40 dark:bg-[#051329] w-full">
      {/* Ambient Floating Glass Orbs */}
      <div className="glass-orb-purple -top-24 right-10 opacity-30" />
      <div className="glass-orb-blue bottom-10 left-10 opacity-35" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 text-school-secondary font-bold text-xs uppercase tracking-wider glass-badge px-4 py-1.5 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum & Learning Continuum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-school-primary dark:text-white">
            Academic Excellence from Foundation to Senior Secondary
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A seamless educational pathway blending national curriculum benchmarks with international 21st-century inquiry skills.
          </p>
        </div>

        {/* Glass Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {wings.map((wing) => (
            <button
              key={wing.id}
              onClick={() => setActiveWing(wing)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center space-x-2 cursor-pointer ${
                activeWing.id === wing.id
                  ? "bg-gradient-to-r from-school-secondary to-blue-600 text-white shadow-lg scale-105 border border-blue-400/40"
                  : "glass-btn text-slate-700 dark:text-slate-200"
              }`}
            >
              <span>{wing.title}</span>
              <span className="text-[10px] opacity-80 font-normal">({wing.grades})</span>
            </button>
          ))}
        </div>

        {/* Active Wing Glass Showcase */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 glass-badge-gold text-amber-600 dark:text-amber-400 text-xs font-bold px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Age Group: {activeWing.age}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white">
              {activeWing.title} ({activeWing.grades})
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeWing.desc}
            </p>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Key Curricular Highlights
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeWing.subjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="glass-card-interactive flex items-center space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 p-3 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={activeWing.link}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg hover:scale-105 transition-all border border-blue-400/30"
              >
                <span>Explore Full {activeWing.title} Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative group overflow-hidden rounded-2xl shadow-xl border border-white/20">
            <img
              src={activeWing.image}
              alt={activeWing.title}
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
