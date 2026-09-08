"use client";

import React from "react";
import Link from "next/link";
import { Quote, ArrowRight, Award, GraduationCap, CheckCircle } from "lucide-react";

export default function LeadershipMessages() {
  return (
    <section className="py-20 lg:py-28 bg-[#f0f7ff]/50 dark:bg-[#071933] relative w-full overflow-hidden">
      {/* Ambient Glass Glow Orbs */}
      <div className="glass-orb-blue -top-20 left-1/3 opacity-30" />
      <div className="glass-orb-gold bottom-0 right-1/4 opacity-25" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 text-school-secondary font-bold text-xs uppercase tracking-wider glass-badge px-4 py-1.5 rounded-full">
            <GraduationCap className="w-3.5 h-3.5 text-school-secondary" />
            <span>Guiding Vision & Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-school-primary dark:text-white">
            Messages from Our Leadership
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Fostering an ecosystem of intellectual curiosity, character building, and Himalayan resilience.
          </p>
        </div>

        {/* 2-Column Glass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chairman Card */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  alt="Chairman"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-bold text-school-primary dark:text-white">
                    Sh. Arvind Thakur
                  </h3>
                  <p className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                    Chairman & Managing Trustee
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Cambridge Education Foundation</p>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-8 h-8 text-amber-400/30 absolute -top-3 -left-2" />
                <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed pl-6">
                  "Education is not merely the accumulation of textbooks; it is the ignition of an inner flame of inquiry, moral courage, and compassionate leadership. At Cambridge Mandi, we are dedicated to providing our students with a world-class launchpad right here in the heart of Himachal Pradesh."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Holistic Personality Focus</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Global University Pathways</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                VISION 2030
              </span>
              <Link
                href="/about/chairman-message"
                className="inline-flex items-center space-x-1 text-xs font-bold text-school-secondary hover:text-blue-700 dark:hover:text-amber-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Read Full Chairman Message</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Principal Card */}
          <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                  alt="Principal"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-school-secondary shadow-md flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-bold text-school-primary dark:text-white">
                    Mrs. Priyanka Jamwal
                  </h3>
                  <p className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                    Principal & Academic Director
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">M.Sc., B.Ed., 22+ Years Educational Leadership</p>
                </div>
              </div>

              <div className="relative">
                <Quote className="w-8 h-8 text-blue-400/30 absolute -top-3 -left-2" />
                <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed pl-6">
                  "Every child arrives with unique creative genius. Our role as educators is to provide a caring, academically rigorous space where curiosity is celebrated, questions are encouraged, and students learn to turn obstacles into launching pads for achievement."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>1:15 Mentorship Model</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>STEM & AI Tinkering Labs</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                ACADEMIC ETHOS
              </span>
              <Link
                href="/about/principal-message"
                className="inline-flex items-center space-x-1 text-xs font-bold text-school-secondary hover:text-blue-700 dark:hover:text-amber-400 group-hover:translate-x-1 transition-transform"
              >
                <span>Read Full Principal Message</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
