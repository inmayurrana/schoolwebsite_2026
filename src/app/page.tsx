import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Award,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import StatsCounter from "@/components/home/StatsCounter";
import LeadershipMessages from "@/components/home/LeadershipMessages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AcademicStreams from "@/components/home/AcademicStreams";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Campus3DViewer from "@/components/3d/Campus3DViewer";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

// Server component fetching live news, events, achievements, and gallery
export default async function HomePage() {
  let newsList: any[] = [];
  let eventsList: any[] = [];
  let achievementsList: any[] = [];
  let galleryAlbums: any[] = [];

  try {
    newsList = await prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    eventsList = await prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "asc" },
      take: 3,
    });

    achievementsList = await prisma.achievement.findMany({
      where: { isFeatured: true },
      take: 3,
    });

    galleryAlbums = await prisma.galleryAlbum.findMany({
      take: 3,
    });
  } catch (error) {
    console.error("Database query fallback in home page:", error);
  }

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Statistics Counter */}
      <StatsCounter />

      {/* 3. Leadership Messages */}
      <LeadershipMessages />

      {/* 4. Academic Continuum */}
      <AcademicStreams />

      {/* 5. 10 Reasons Why Choose Us */}
      <WhyChooseUs />

      {/* 6. Interactive Campus Explorer Map */}
      <section className="py-20 bg-blue-50/40 dark:bg-[#051329]">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
          <Campus3DViewer />
        </div>
      </section>

      {/* 7. Student Achievements & Hall of Fame */}
      <section className="py-20 bg-[#f0f7ff] dark:bg-[#071933] relative overflow-hidden">
        {/* Ambient Glass Glow Orbs */}
        <div className="glass-orb-gold -top-20 left-1/4 opacity-25" />
        <div className="glass-orb-blue bottom-0 right-1/4 opacity-25" />

        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-amber-500 font-bold text-xs uppercase tracking-wider glass-badge-gold px-4 py-1.5 rounded-full mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Excellence & Laurels</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-school-primary dark:text-white">
                Student Achievements & Hall of Fame
              </h2>
            </div>
            <Link
              href="/achievements"
              className="inline-flex items-center space-x-1 text-sm font-bold text-school-secondary hover:text-blue-700 dark:hover:text-amber-400 group"
            >
              <span>View All Laurels</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievementsList.map((ach) => (
              <div
                key={ach.id}
                className="glass-card-interactive rounded-3xl overflow-hidden shadow-xl group flex flex-col justify-between"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={ach.photoUrl}
                    alt={ach.studentName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg border border-amber-300">
                    {ach.category}
                  </span>
                </div>
                <div className="p-6 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{ach.grade}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{ach.rank}</span>
                  </div>
                  <h3 className="text-lg font-bold text-school-primary dark:text-white">
                    {ach.studentName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Latest News & Upcoming Events Split Grid */}
      <section className="py-20 bg-white dark:bg-[#051329] relative overflow-hidden">
        <div className="glass-orb-purple -top-24 right-10 opacity-20" />
        <div className="glass-orb-blue bottom-10 left-10 opacity-25" />

        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* News Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-school-secondary uppercase tracking-wider glass-badge px-3 py-1 rounded-full inline-block mb-2">
                    School Bulletins
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
                    Latest News & Updates
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="text-xs font-bold text-school-secondary hover:underline flex items-center space-x-1 group"
                >
                  <span>View All News</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-4">
                {newsList.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news`}
                    className="glass-card-interactive rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 group block"
                  >
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full sm:w-36 h-28 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex flex-col justify-between space-y-1">
                      <div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-1">
                          <span className="glass-badge text-school-secondary px-2 py-0.5 rounded font-semibold text-[10px]">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                        <h3 className="text-sm font-bold text-school-primary dark:text-white group-hover:text-school-secondary dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Events Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider glass-badge-gold px-3 py-1 rounded-full inline-block mb-2">
                    School Calendar
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white">
                    Upcoming Events
                  </h2>
                </div>
                <Link
                  href="/events"
                  className="text-xs font-bold text-amber-500 hover:underline flex items-center space-x-1 group"
                >
                  <span>Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-4">
                {eventsList.map((ev) => (
                  <div
                    key={ev.id}
                    className="glass-card-interactive rounded-2xl p-4 flex items-start space-x-4 group"
                  >
                    {/* Date Block */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-school-primary to-school-secondary text-white flex flex-col items-center justify-center flex-shrink-0 shadow-lg border border-white/20">
                      <span className="text-xs uppercase font-bold text-amber-300">
                        {new Date(ev.startDate).toLocaleString("default", { month: "short" })}
                      </span>
                      <span className="text-xl font-extrabold">
                        {new Date(ev.startDate).getDate()}
                      </span>
                    </div>

                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold text-school-secondary glass-badge px-2 py-0.5 rounded">
                        {ev.category}
                      </span>
                      <h3 className="text-sm font-bold text-school-primary dark:text-white group-hover:text-school-secondary dark:group-hover:text-amber-400 transition-colors">
                        {ev.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <TestimonialsSection />

      {/* 10. Grand Call to Action Banner */}
      <section className="py-20 bg-gradient-to-r from-school-primary via-blue-950 to-school-primary text-white relative overflow-hidden">
        {/* Ambient Glass Glow */}
        <div className="glass-orb-gold -top-20 left-1/4 opacity-25" />
        <div className="glass-orb-blue -bottom-20 right-1/4 opacity-30" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xl border border-amber-300/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admissions Open 2025–2026</span>
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white leading-tight">
            Begin Your Child's Journey of Global Excellence in Mandi
          </h2>

          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Join the Cambridge family. Experience our state-of-the-art campus, caring faculty, and inspiring Himalayan learning environment.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="/admissions/apply"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all border border-amber-300/60"
            >
              <span>Apply Online Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admissions/procedure"
              className="glass-btn inline-flex items-center space-x-2 text-white font-bold text-sm px-6 py-4 rounded-2xl transition-all"
            >
              <span>View Admission Process</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
