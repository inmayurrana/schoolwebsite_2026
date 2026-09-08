"use client";

import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Compass, Sparkles, Eye, ArrowRight, Layers, MapPin, Maximize2 } from "lucide-react";
import Link from "next/link";

interface TourPoint {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  hotspots: { title: string; x: number; y: number }[];
}

const tourPoints: TourPoint[] = [
  {
    id: "quadrangle",
    name: "Himalayan Central Quadrangle & Academic Block",
    category: "Campus Core",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400",
    description: "The magnificent heart of Cambridge Mandi overlooking the snow-dusted Shivalik ridges.",
    hotspots: [
      { title: "Administrative Block", x: 25, y: 45 },
      { title: "Smart Academic Wing", x: 65, y: 40 },
      { title: "Central Amphitheatre", x: 45, y: 70 },
    ],
  },
  {
    id: "smart-lab",
    name: "4K Digital Smart Classroom & Innovation Pods",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400",
    description: "Equipped with 86-inch interactive panels, acoustic paneling, and ergonomic seating.",
    hotspots: [
      { title: "4K Interactive Panel", x: 50, y: 35 },
      { title: "Digital Podiums", x: 30, y: 60 },
      { title: "Collaborative Study Pods", x: 75, y: 65 },
    ],
  },
  {
    id: "robotics-suite",
    name: "STEM, AI & Robotics Innovation Lab",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400",
    description: "Maker space equipped with 3D printers, IoT hardware, Arduino & Raspberry Pi rigs, and drone test bays.",
    hotspots: [
      { title: "3D Printing Stations", x: 20, y: 50 },
      { title: "Drone Bay", x: 50, y: 40 },
      { title: "IoT Sensor Bench", x: 80, y: 55 },
    ],
  },
  {
    id: "aquatics",
    name: "Semi-Olympic Heated Swimming Pool",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400",
    description: "6-lane temperature-controlled indoor pool with certified national life coaches.",
    hotspots: [
      { title: "Starting Blocks", x: 30, y: 65 },
      { title: "Spectator Gallery", x: 70, y: 35 },
    ],
  },
];

export default function VirtualTourPage() {
  const [activePoint, setActivePoint] = useState<TourPoint>(tourPoints[0]);

  return (
    <div>
      <PageHeader
        badge="360° Interactive Experience"
        title="Virtual Campus Tour & Panoramic Exploration"
        description="Experience Cambridge International School Mandi from anywhere in the world with high-resolution panoramic views."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Virtual Tour" },
        ]}
      />

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-12 space-y-10">
        {/* Tour Point Navigation Selector */}
        <div className="flex flex-wrap gap-2.5">
          {tourPoints.map((tp) => (
            <button
              key={tp.id}
              onClick={() => setActivePoint(tp)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2 ${
                activePoint.id === tp.id
                  ? "bg-school-primary text-amber-400 dark:bg-school-secondary dark:text-white shadow-lg scale-105"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{tp.name}</span>
            </button>
          ))}
        </div>

        {/* 360 Viewport Container */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 h-[500px] sm:h-[600px] group bg-slate-950">
          <img
            src={activePoint.image}
            alt={activePoint.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Hotspots */}
          {activePoint.hotspots.map((hs, idx) => (
            <div
              key={idx}
              style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="relative flex items-center justify-center group/spot">
                <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping" />
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg cursor-pointer">
                  +
                </div>
                <div className="absolute bottom-8 whitespace-nowrap bg-slate-950/90 text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-xl border border-white/20 opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none">
                  📍 {hs.title}
                </div>
              </div>
            </div>
          ))}

          {/* Overlay Info Card */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white space-y-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {activePoint.category}
            </span>
            <h3 className="text-xl font-bold font-heading">{activePoint.name}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{activePoint.description}</p>
          </div>

          <div className="absolute top-6 right-6 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hover over + pins to inspect focal zones</span>
          </div>
        </div>
      </div>
    </div>
  );
}
