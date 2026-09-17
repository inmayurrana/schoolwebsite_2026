"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  MapPin,
  Navigation,
  ExternalLink,
  Map as MapIcon,
  Phone,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface Campus3DViewerProps {
  customStyles?: Record<string, any>;
}

export default function Campus3DViewer({ customStyles }: Campus3DViewerProps = {}) {
  const [mapLayer, setMapLayer] = useState<string>("m");

  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    latitude: "31.6130",
    longitude: "76.9386",
    school_address: "Village Lunapani, Tehsil Balh, District Mandi, Himachal Pradesh - 175021, India",
    school_map_zoom: "15",
    school_map_type: "m",
    google_map_embed_url: "",
    google_map_place_url: "",
    contact_phone: "+91 1905 223456 / +91 98160 99999",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Array.isArray(data.settings)) {
            const map: Record<string, string> = {};
            data.settings.forEach((s: any) => {
              map[s.key] = s.value;
            });
            setSiteSettings((prev) => ({ ...prev, ...map }));
            if (map.school_map_type) {
              setMapLayer(map.school_map_type);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load map settings:", e);
      }
    }
    loadSettings();
  }, []);

  const lat = siteSettings.latitude || "31.6130";
  const lng = siteSettings.longitude || "76.9386";
  const zoom = siteSettings.school_map_zoom || "15";

  const formatDMS = (latStr: string, lngStr: string) => {
    const latNum = parseFloat(latStr) || 31.6130;
    const lngNum = parseFloat(lngStr) || 76.9386;
    const latDeg = Math.floor(Math.abs(latNum));
    const latMin = Math.floor((Math.abs(latNum) - latDeg) * 60);
    const latSec = Math.floor(((Math.abs(latNum) - latDeg) * 60 - latMin) * 60);
    const latDir = latNum >= 0 ? "N" : "S";

    const lngDeg = Math.floor(Math.abs(lngNum));
    const lngMin = Math.floor((Math.abs(lngNum) - lngDeg) * 60);
    const lngSec = Math.floor(((Math.abs(lngNum) - lngDeg) * 60 - lngMin) * 60);
    const lngDir = lngNum >= 0 ? "E" : "W";

    return `${latDir} ${latDeg}° ${latMin}' ${latSec}'' | ${lngDir} ${lngDeg}° ${lngMin}' ${lngSec}'' (Mandi HP)`;
  };

  const googleMapEmbedUrl =
    siteSettings.google_map_embed_url && siteSettings.google_map_embed_url.trim().length > 0
      ? (siteSettings.google_map_embed_url.match(/src=["']([^"']+)["']/)
          ? siteSettings.google_map_embed_url.match(/src=["']([^"']+)["']/)![1]
          : siteSettings.google_map_embed_url.trim())
      : siteSettings.map_display_mode === "COORDINATES"
      ? `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&hl=en&z=${zoom}&t=${mapLayer}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(
          siteSettings.google_map_query || "Cambridge International School, Lunapani, Mandi, Himachal Pradesh"
        )}&hl=en&z=${zoom}&t=${mapLayer}&output=embed`;

  const directionsUrl =
    siteSettings.google_map_place_url && siteSettings.google_map_place_url.trim().length > 0
      ? siteSettings.google_map_place_url
      : siteSettings.map_display_mode === "COORDINATES"
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          siteSettings.google_map_query || "Cambridge International School, Lunapani, Mandi, Himachal Pradesh"
        )}`;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
      {/* Header & Map Layer Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-school-secondary font-semibold text-xs uppercase tracking-wider">
            <MapIcon className="w-4 h-4 text-school-secondary" />
            <span>Interactive Campus Location</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-school-primary dark:text-white mt-1">
            Cambridge Mandi Campus Map & Directions
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore our campus on Google Maps with real-time navigation and GPS location directions.
          </p>
        </div>

        {/* Map Layer Switchers */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setMapLayer("m")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mapLayer === "m"
                ? "bg-school-primary text-amber-400 shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setMapLayer("k")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mapLayer === "k"
                ? "bg-school-primary text-amber-400 shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapLayer("p")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mapLayer === "p"
                ? "bg-school-primary text-amber-400 shadow-md"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* LIVE GOOGLE MAP & LOCATION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Map Column */}
        <div className="lg:col-span-7 relative min-h-[420px] rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-slate-950 shadow-inner flex flex-col justify-between">
          <iframe
            title="Cambridge International School Mandi Google Map"
            src={googleMapEmbedUrl}
            className="w-full h-full min-h-[420px] border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Top Coordinates Floating Overlay */}
          <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur text-sky-300 px-3 py-1.5 rounded-xl border border-sky-900 text-xs font-mono flex items-center space-x-2 shadow-lg">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatDMS(lat, lng)}</span>
          </div>

          {/* Bottom Actions Floating Overlay */}
          <div className="absolute bottom-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 text-xs flex items-center space-x-1.5 pointer-events-auto">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold truncate max-w-[220px] sm:max-w-none">
                Cambridge Mandi Campus Pin
              </span>
            </div>

            <div className="flex items-center space-x-2 pointer-events-auto">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-lg transition-transform hover:scale-105"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>

              <a
                href={
                  siteSettings.google_map_place_url ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${lat},${lng}`
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/90 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-700 flex items-center space-x-1.5 shadow-lg transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                <span>Open Fullscreen</span>
              </a>
            </div>
          </div>
        </div>

        {/* Location & Directions Detail Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-school-secondary text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Campus Location</span>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-school-primary dark:text-white">
                {customStyles?.school_name || siteSettings.school_name || "Cambridge International School, Mandi"}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {customStyles?.school_address ||
                  siteSettings.school_address ||
                  "Village Lunapani, Tehsil Balh, District Mandi, Himachal Pradesh - 175021, India"}
              </p>
            </div>

            {/* Key Campus Highlights */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Campus Access & Connectivity
              </p>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-center space-x-2.5">
                  <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>
                    {customStyles?.campus_drive_time ||
                      siteSettings.campus_drive_time ||
                      "5 Minutes drive from Mandi Town / Victoria Bridge"}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-school-secondary flex-shrink-0" />
                  <span>
                    Admissions Helpline:{" "}
                    {customStyles?.contact_phone ||
                      siteSettings.contact_phone ||
                      "+91 1905 243366 / +91 8580579409"}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-center space-x-2.5">
                  <Compass className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>
                    {customStyles?.campus_transport_info ||
                      siteSettings.campus_transport_info ||
                      "GPS Monitored School Bus Transport Across Mandi & Ner Chowk"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-3 space-y-2.5">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl transition-all shadow-lg text-xs"
            >
              <Navigation className="w-4 h-4 text-slate-950" />
              <span>Get Driving Directions in Google Maps</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-1.5 bg-school-primary hover:bg-school-primary-light text-white font-bold py-2.5 px-3 rounded-xl transition-colors text-xs text-center"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Page</span>
              </Link>

              <Link
                href="/admissions"
                className="inline-flex items-center justify-center space-x-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-2.5 px-3 rounded-xl transition-colors text-xs text-center"
              >
                <span>Admission Enquiry</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
