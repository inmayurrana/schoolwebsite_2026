"use client";

import React, { useState } from "react";
import { Layers, Compass, Maximize2, Sparkles, MapPin, Eye } from "lucide-react";
import Link from "next/link";

interface CampusZone {
  id: string;
  name: string;
  category: string;
  coords: { x: number; y: number };
  description: string;
  image: string;
  features: string[];
  link: string;
}

const campusZones: CampusZone[] = [
  {
    id: "admin-block",
    name: "Main Administrative Block & Reception",
    category: "Administration",
    coords: { x: 30, y: 40 },
    description: "Architectural masterpiece housing the Principal's Desk, Admissions Helpdesk, Conference Boardroom, and visitor lounge.",
    image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
    features: ["Admissions Helpdesk", "Conference Suite", "Visitor Lounge", "Accounts & Records"],
    link: "/about",
  },
  {
    id: "smart-classrooms",
    name: "Digital Smart Classrooms Wing",
    category: "Academic",
    coords: { x: 50, y: 35 },
    description: "Fully air-conditioned, digitally equipped smart classrooms with 4K touch panels, ergonomic seating, and acoustic insulation.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
    features: ["4K Interactive Flat Panels", "AI-Assisted Learning", "Ergonomic Furniture", "CCTV Monitored"],
    link: "/facilities/smart-classrooms",
  },
  {
    id: "stem-robotics",
    name: "Himalayan STEM & Robotics Innovation Lab",
    category: "Innovation",
    coords: { x: 70, y: 45 },
    description: "State-of-the-art innovation center with 3D printers, drone test bays, robotics kits, Arduino, and IoT development boards.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    features: ["3D Printing Stations", "Drone Prototyping", "Robotics Kits", "AI Coding Rigs"],
    link: "/facilities/robotics-lab",
  },
  {
    id: "sports-arena",
    name: "Olympic Sports Complex & Aquatic Center",
    category: "Sports",
    coords: { x: 25, y: 70 },
    description: "Semi-Olympic heated swimming pool, synthetic tennis/basketball courts, FIFA-grade turf, and indoor badminton arena.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    features: ["Semi-Olympic Pool", "FIFA Turf", "FIBA Basketball Court", "Badminton Arena"],
    link: "/facilities/sports-complex",
  },
  {
    id: "library",
    name: "Central Knowledge Hub & Digital E-Library",
    category: "Academic",
    coords: { x: 60, y: 65 },
    description: "Spacious library with 25,000+ volumes, international research journals, kindle reading kiosks, and silent study chambers.",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80",
    features: ["25,000+ Books", "Digital E-Catalog", "Kindle Kiosks", "Research Pods"],
    link: "/facilities/library",
  },
  {
    id: "hostel-residence",
    name: "Himalayan Residential Hostel & Dining Hall",
    category: "Residential",
    coords: { x: 80, y: 75 },
    description: "Home away from home with temperature-controlled dorms, 24x7 medical infirmary, nutritious hygienic dining, and pastoral care.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
    features: ["24x7 Resident Warden", "Multi-Cuisine Dining", "Wi-Fi & Study Rooms", "Medical Infirmary"],
    link: "/facilities/hostel",
  },
];

export default function Campus3DViewer() {
  const [activeZone, setActiveZone] = useState<CampusZone>(campusZones[0]);
  const [filter, setFilter] = useState<string>("ALL");

  const categories = ["ALL", "Academic", "Innovation", "Sports", "Residential", "Administration"];

  const filteredZones = filter === "ALL" ? campusZones : campusZones.filter((z) => z.category === filter);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-school-secondary font-semibold text-sm">
            <Compass className="w-4 h-4 animate-spin" />
            <span>INTERACTIVE CAMPUS EXPLORER</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white mt-1">
            Cambridge Mandi Campus Map & Facilities
          </h3>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === cat
                  ? "bg-school-primary text-amber-400 dark:bg-school-secondary dark:text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Interactive Schematic Campus Grid */}
        <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] bg-gradient-to-br from-slate-900 via-school-primary to-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
          {/* Background Grid Lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Compass Rose */}
          <div className="absolute top-4 left-4 flex items-center space-x-1.5 text-[11px] text-sky-400 font-mono bg-slate-950/80 px-2.5 py-1 rounded-lg border border-sky-900">
            <Compass className="w-3.5 h-3.5" />
            <span>N 31° 42' 28'' | E 76° 55' 52'' (Mandi HP)</span>
          </div>

          {/* Mountain Silhouettes Accent */}
          <div className="absolute bottom-0 inset-x-0 h-28 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Pins */}
          {filteredZones.map((zone) => {
            const isSelected = activeZone.id === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone)}
                style={{
                  top: `${zone.coords.y}%`,
                  left: `${zone.coords.x}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Ping Ring */}
                  {isSelected && (
                    <span className="absolute w-12 h-12 rounded-full bg-amber-400/40 animate-ping" />
                  )}
                  {/* Marker Node */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      isSelected
                        ? "bg-amber-400 text-slate-950 scale-125 ring-4 ring-white/40"
                        : "bg-school-secondary text-white hover:scale-110 hover:bg-amber-400 hover:text-slate-950"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  {/* Tooltip on Hover */}
                  <span className="absolute top-10 whitespace-nowrap bg-slate-950/95 text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {zone.name}
                  </span>
                </div>
              </button>
            );
          })}

          <div className="absolute bottom-4 right-4 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 text-xs flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Click pins on map to inspect facilities</span>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          <div className="relative rounded-2xl overflow-hidden shadow-lg h-52 group">
            <img
              src={activeZone.image}
              alt={activeZone.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
              <span className="bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {activeZone.category}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-school-primary dark:text-white">
              {activeZone.name}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
              {activeZone.description}
            </p>
          </div>

          {/* Key Features Pill List */}
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
              Facility Highlights
            </p>
            <div className="grid grid-cols-2 gap-2">
              {activeZone.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/70 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-school-secondary" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Link */}
          <div className="pt-2">
            <Link
              href={activeZone.link}
              className="w-full inline-flex items-center justify-center space-x-2 bg-school-primary hover:bg-school-primary-light text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md text-sm"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Explore Full {activeZone.category} Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
