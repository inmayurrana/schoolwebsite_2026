import React from "react";
import Link from "next/link";
import { Quote, ArrowRight, GraduationCap, CheckCircle } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";

export interface LeaderProfile {
  name: string;
  title: string;
  org: string;
  image: string;
  quote: string;
  message?: string;
  link: string;
  badge1?: string;
  badge2?: string;
  tag?: string;
}

interface LeadershipMessagesProps {
  chairman?: Partial<LeaderProfile> | null;
  principal?: Partial<LeaderProfile> | null;
}

export default function LeadershipMessages({ chairman, principal }: LeadershipMessagesProps) {
  const chairmanData: LeaderProfile = {
    name: chairman?.name || "Sh. Bhim Singh Jamwal",
    title: chairman?.title || "Chairman & Managing Trustee",
    org: chairman?.org || "Cambridge Education Foundation",
    image: chairman?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    quote: chairman?.quote || '"Education is the most powerful weapon which you can use to change the world."',
    message:
      chairman?.message ||
      "When we founded Cambridge International School Mandi, our guiding ambition was clear: to bring the highest international benchmarks of holistic education to Himachal Pradesh. We are dedicated to sculpting confident global leaders grounded in strong ethical values, innovative inquiry, and Himalayan resilience.",
    link: chairman?.link || "/about/chairman-message",
    badge1: chairman?.badge1 !== undefined ? chairman.badge1 : "",
    badge2: chairman?.badge2 !== undefined ? chairman.badge2 : "",
    tag: chairman?.tag || "VISION 2030",
  };

  const principalData: LeaderProfile = {
    name: principal?.name || "Mrs. Priyanka Jamwal",
    title: principal?.title || "Principal & Academic Director",
    org: principal?.org || "Cambridge International School Mandi",
    image: principal?.image || "/uploads/Mrs_-Priyanka-Jamwal_0f45e295f9f7.webp",
    quote: principal?.quote || '"The mind is not a vessel to be filled, but a fire to be kindled."',
    message:
      principal?.message ||
      "At Cambridge International School Mandi, our mission transcends traditional textbook instruction. We kindle an enduring passion for discovery, critical inquiry, and creative expression to empower every child to turn challenges into launching pads for greatness and global benchmark achievement.",
    link: principal?.link || "/about/principal-message",
    badge1: principal?.badge1 !== undefined ? principal.badge1 : "",
    badge2: principal?.badge2 !== undefined ? principal.badge2 : "",
    tag: principal?.tag || "ACADEMIC ETHOS",
  };

  const chairmanBadges = [chairmanData.badge1, chairmanData.badge2].filter(
    (b): b is string => Boolean(b && b.trim() && b.trim() !== "none")
  );
  const principalBadges = [principalData.badge1, principalData.badge2].filter(
    (b): b is string => Boolean(b && b.trim() && b.trim() !== "none")
  );

  return (
    <section className="py-20 lg:py-28 bg-[#f0f7ff]/50 dark:bg-[#071933] relative w-full overflow-hidden">
      {/* Ambient Glass Glow Orbs */}
      <div className="glass-orb-blue -top-20 left-1/3 opacity-30" />
      <div className="glass-orb-gold bottom-0 right-1/4 opacity-25" />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
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
              {/* Leader Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 bg-slate-800">
                  <img
                    src={chairmanData.image}
                    alt={`Chairman ${chairmanData.name}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-school-primary dark:text-white">
                    {chairmanData.name}
                  </h3>
                  <p className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                    {chairmanData.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{chairmanData.org}</p>
                </div>
              </div>

              {/* Inspirational Quote Badge */}
              <div className="relative bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                <Quote className="w-6 h-6 text-amber-500/40 absolute top-3 right-3" />
                <p className="text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold italic leading-relaxed">
                  {chairmanData.quote}
                </p>
              </div>

              {/* Full Leadership Message */}
              <div className="space-y-2">
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                  {chairmanData.message}
                </p>
              </div>

              {/* Key Distinctions (Omitted if empty) */}
              {chairmanBadges.length > 0 && (
                <div className={`grid ${chairmanBadges.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300`}>
                  {chairmanBadges.map((badge, bIdx) => (
                    <div key={bIdx} className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{badge}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {chairmanData.tag}
              </span>
              <Link
                href={chairmanData.link}
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
              {/* Leader Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-school-secondary shadow-md flex-shrink-0 bg-slate-800">
                  <img
                    src={principalData.image}
                    alt={`Principal ${principalData.name}`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-school-primary dark:text-white">
                    {principalData.name}
                  </h3>
                  <p className="text-xs font-semibold text-school-secondary uppercase tracking-wider">
                    {principalData.title}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{principalData.org}</p>
                </div>
              </div>

              {/* Inspirational Quote Badge */}
              <div className="relative bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <Quote className="w-6 h-6 text-blue-500/40 absolute top-3 right-3" />
                <p className="text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-semibold italic leading-relaxed">
                  {principalData.quote}
                </p>
              </div>

              {/* Full Leadership Message */}
              <div className="space-y-2">
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
                  {principalData.message}
                </p>
              </div>

              {/* Key Distinctions (Omitted if empty) */}
              {principalBadges.length > 0 && (
                <div className={`grid ${principalBadges.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300`}>
                  {principalBadges.map((badge, bIdx) => (
                    <div key={bIdx} className="flex items-center space-x-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{badge}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                {principalData.tag}
              </span>
              <Link
                href={principalData.link}
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
