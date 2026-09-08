import React from "react";
import PageHeader from "@/components/ui/PageHeader";
import Link from "next/link";
import { Video, Play, Sparkles, ArrowRight, Eye } from "lucide-react";

export const metadata = {
  title: "Video Gallery | Cambridge International School, Mandi",
  description: "Watch campus walkthroughs, annual function performances, and robotics highlights from Cambridge Mandi.",
};

export default function VideoGalleryPage() {
  const videos = [
    {
      title: "Campus Aerial Drone Walkthrough 2025",
      desc: "An inspiring panoramic view of the 10-acre Himalayan campus, Shivalik mountains, and world-class sports arenas.",
      thumbnail: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
      duration: "04:15",
      category: "Campus Tour",
    },
    {
      title: "Annual Cultural Day 'Udaan' Grand Finale",
      desc: "Spectacular Himachali folk dance, symphonic orchestra, and drama presentations by our students.",
      thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
      duration: "08:30",
      category: "Cultural",
    },
    {
      title: "STEM & Robotics Championship Winning Rover Demo",
      desc: "Student innovators demonstrate the AI landslide detection robot designed in our robotics maker lab.",
      thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
      duration: "05:40",
      category: "Innovation",
    },
    {
      title: "Annual Sports Meet & Aquatic Relays Highlights",
      desc: "Thrilling track sprint finals, heated swimming relays, and basketball championship trophy celebrations.",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      duration: "06:10",
      category: "Sports",
    },
  ];

  return (
    <div>
      <PageHeader
        badge="Cinematic Moments"
        title="Official School Video Gallery"
        description="Experience the vibrant energy, performances, and student innovation of Cambridge Mandi in motion."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery", href: "/gallery" },
          { label: "Video Gallery" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((vid, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl group flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-slate-950">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-7 h-7 fill-slate-950 ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-mono px-2.5 py-1 rounded-lg">
                  {vid.duration}
                </span>
                <span className="absolute top-3 left-3 bg-school-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {vid.category}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-bold text-base sm:text-lg text-school-primary dark:text-white">
                  {vid.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {vid.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
