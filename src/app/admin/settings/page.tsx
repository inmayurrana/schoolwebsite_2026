"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Save,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Globe,
  MessageCircle,
  Building2,
  Sparkles,
  Loader2,
  RefreshCw,
  HelpCircle,
  Info,
  ExternalLink,
  Compass,
  Navigation,
  Crosshair,
  Layers,
  Map as MapIcon,
  Search,
} from "lucide-react";
import dynamic from "next/dynamic";

const InteractivePinDropperMap = dynamic(
  () => import("@/components/admin/InteractivePinDropperMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-800 text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-amber-400 mr-2" />
        <span>Loading Interactive Pin Dropper Map Canvas...</span>
      </div>
    ),
  }
);

interface SettingItem {
  id?: string;
  key: string;
  value: string;
  category?: string;
  description?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    cbse_affiliation_no: "630198",
    school_code: "43190",
    school_level: "Senior Secondary",
    school_name: "Cambridge International School, Mandi",
    school_tagline: "Educating for a Better World",
    contact_phone: "+91 1905 223456 / +91 98160 99999",
    whatsapp_number: "+919816099999",
    contact_email: "admissions@cismandi.org",
    school_address: "Village Lunapani, Tehsil Balh, District Mandi, Himachal Pradesh - 175021, India",
    latitude: "31.7078",
    longitude: "76.9311",
    school_map_zoom: "15",
    school_map_type: "m",
    map_display_mode: "PLACE",
    google_map_query: "Cambridge International School, Lunapani, Mandi, Himachal Pradesh",
    google_map_embed_url: "",
    google_map_place_url: "https://maps.google.com/?q=Cambridge+International+School+Lunapani+Mandi+Himachal+Pradesh",
    academic_year: "2027-2028",
    admission_status: "OPEN",
    facebook_url: "https://facebook.com/cismandi",
    instagram_url: "https://instagram.com/cismandi_official",
    youtube_url: "https://youtube.com/@cismandi",
    campus_drive_time: "5 Minutes drive from Mandi Town / Victoria Bridge",
    campus_transport_info: "GPS Monitored School Bus Transport Across Mandi & Ner Chowk",
  });

  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationNotice, setLocationNotice] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings && Array.isArray(data.settings)) {
        const map: Record<string, string> = {};
        data.settings.forEach((s: SettingItem) => {
          map[s.key] = s.value;
        });
        setSettings((prev) => ({ ...prev, ...map }));
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDetectLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationNotice("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingLocation(true);
    setLocationNotice("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setSettings((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setDetectingLocation(false);
        setLocationNotice(`📍 Detected exact device coordinates: ${lat}, ${lng}`);
        setTimeout(() => setLocationNotice(""), 6000);
      },
      (err) => {
        setDetectingLocation(false);
        setLocationNotice("Could not fetch device location: " + err.message);
        setTimeout(() => setLocationNotice(""), 6000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const applyPresetLocation = (lat: string, lng: string, name: string) => {
    setSettings((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setLocationNotice(`📍 Applied Preset: ${name} (${lat}, ${lng})`);
    setTimeout(() => setLocationNotice(""), 5000);
  };

  const handlePinLocationChange = (lat: string, lng: string, zoom: string) => {
    setSettings((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      school_map_zoom: zoom || prev.school_map_zoom || "15",
    }));
  };

  const handleDirectSaveLocation = async (lat: string, lng: string, zoom: string) => {
    setSettings((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      school_map_zoom: zoom || prev.school_map_zoom || "15",
    }));

    const settingsArray = [
      { key: "latitude", value: lat, category: "CONTACT" },
      { key: "longitude", value: lng, category: "CONTACT" },
      { key: "school_map_zoom", value: zoom || settings.school_map_zoom || "15", category: "CONTACT" },
      { key: "school_map_type", value: settings.school_map_type || "m", category: "CONTACT" },
    ];

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: settingsArray }),
    });

    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error || "Failed to save marked pin location");
    }
  };

  const formatDMS = (latStr: string, lngStr: string) => {
    const lat = parseFloat(latStr) || 31.7078;
    const lng = parseFloat(lngStr) || 76.9311;
    const latDeg = Math.floor(Math.abs(lat));
    const latMin = Math.floor((Math.abs(lat) - latDeg) * 60);
    const latSec = Math.floor(((Math.abs(lat) - latDeg) * 60 - latMin) * 60);
    const latDir = lat >= 0 ? "N" : "S";

    const lngDeg = Math.floor(Math.abs(lng));
    const lngMin = Math.floor((Math.abs(lng) - lngDeg) * 60);
    const lngSec = Math.floor(((Math.abs(lng) - lngDeg) * 60 - lngMin) * 60);
    const lngDir = lng >= 0 ? "E" : "W";

    return `${latDir} ${latDeg}° ${latMin}' ${latSec}'' | ${lngDir} ${lngDeg}° ${lngMin}' ${lngSec}''`;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        category:
          key.startsWith("cbse_") || key.startsWith("school_")
            ? "GENERAL"
            : key.startsWith("contact_") || key.startsWith("whatsapp_") || key.startsWith("campus_") || key === "latitude" || key === "longitude" || key.startsWith("google_map_")
            ? "CONTACT"
            : key.includes("url")
            ? "SOCIAL"
            : "ADMISSION",
      }));

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-white">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
          <p className="text-xs text-slate-400">Loading Portal Settings & Identity Variables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>School Identity & Global Variables</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1">
            School Information & Contact Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your CBSE Affiliation Number, School Code, Admissions Helpline Phone Numbers, and contact channels across the whole website.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Reload</span>
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs rounded-2xl flex items-center space-x-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm text-white">Settings Successfully Updated!</p>
            <p className="text-[11px] text-emerald-300/90 mt-0.5">
              The CBSE affiliation number, school code, and phone numbers are now live across the top bar, footer, and inquiry widgets.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs rounded-2xl flex items-center space-x-3 shadow-lg">
          <Info className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: CBSE Affiliation & School Credentials */}
        <div className="bg-[#0d1f33] border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">CBSE Affiliation & Accreditation Details</h2>
              <p className="text-xs text-slate-400">
                These values reflect on the Top Bar, Footer, and Mandatory Disclosure pages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                <span>CBSE Affiliation Number *</span>
              </label>
              <input
                type="text"
                required
                value={settings.cbse_affiliation_no || ""}
                onChange={(e) => handleChange("cbse_affiliation_no", e.target.value)}
                placeholder="e.g. 630198"
                className="w-full bg-[#051329] text-white font-mono px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">Appears in TopBar and Footer (e.g. 630198)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                <span>CBSE School Code *</span>
              </label>
              <input
                type="text"
                required
                value={settings.school_code || ""}
                onChange={(e) => handleChange("school_code", e.target.value)}
                placeholder="e.g. 43190"
                className="w-full bg-[#051329] text-white font-mono px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">Appears in the Footer accreditation card (e.g. 43190)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                School Level / Classification
              </label>
              <input
                type="text"
                value={settings.school_level || "Senior Secondary"}
                onChange={(e) => handleChange("school_level", e.target.value)}
                placeholder="e.g. Senior Secondary"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Official School Name
              </label>
              <input
                type="text"
                value={settings.school_name || ""}
                onChange={(e) => handleChange("school_name", e.target.value)}
                placeholder="Cambridge International School, Mandi"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Admissions Helpline & Phone Numbers */}
        <div className="bg-[#0d1f33] border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Admissions Helplines & Contact Information</h2>
              <p className="text-xs text-slate-400">
                Displayed in the Top Bar, Contact page, Footer, and WhatsApp popup widget.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                <span>Admissions & Main Phone Numbers *</span>
              </label>
              <input
                type="text"
                required
                value={settings.contact_phone || ""}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                placeholder="+91 1905 223456 / +91 98160 99999"
                className="w-full bg-[#051329] text-white font-mono px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">
                Shown in the Top Bar (e.g. &quot;Admissions: +91 1905 223456 / +91 98160 99999&quot;) and contact cards.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Helpline Number</span>
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ""}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="+919816099999"
                className="w-full bg-[#051329] text-white font-mono px-4 py-3 rounded-xl border border-slate-700 focus:border-emerald-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">Used for the floating WhatsApp chat widget.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Official Admissions Email</span>
              </label>
              <input
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                placeholder="admissions@cismandi.org"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Campus Physical Address</span>
              </label>
              <textarea
                rows={2}
                value={settings.school_address || ""}
                onChange={(e) => handleChange("school_address", e.target.value)}
                placeholder="Near Victoria Bridge, Gutkar / Mandi Bypass, Mandi, Himachal Pradesh - 175001, India"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2.5: Campus Location & Google Maps Configuration Studio */}
        <div className="bg-[#0d1f33] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/30 shadow-inner">
                <MapIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-white">Campus Location & Google Maps Studio</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    Live GPS Pin
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set and mark the exact GPS coordinates and Google Map embed for the Interactive Campus Explorer & Contact page.
                </p>
              </div>
            </div>

            {/* Quick DMS Badge */}
            <div className="flex items-center space-x-2 bg-[#051329] px-3.5 py-1.5 rounded-xl border border-sky-500/30 text-sky-300 font-mono text-[11px] self-start sm:self-auto shadow-sm">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatDMS(settings.latitude, settings.longitude)}</span>
            </div>
          </div>

          {/* Interactive Click-to-Drop Pin Map Studio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Interactive Pin Dropper Canvas (Click anywhere or drag marker to set exact school pin)</span>
              </span>
              <span className="text-[11px] text-amber-300 font-semibold hidden sm:inline">
                ✨ Click map or search landmark to drop pin
              </span>
            </div>

            <InteractivePinDropperMap
              initialLat={parseFloat(settings.latitude) || 31.7078}
              initialLng={parseFloat(settings.longitude) || 76.9311}
              initialZoom={parseInt(settings.school_map_zoom) || 15}
              initialLayer={settings.school_map_type || "m"}
              onLocationChange={handlePinLocationChange}
              onSave={handleDirectSaveLocation}
              schoolAddress={settings.school_address}
            />
          </div>

          {/* Map Display Mode Selector */}
          <div className="bg-[#051329] p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Maps Display & Marker Mode</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Choose how the school appears on Google Maps across the website:
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => handleChange("map_display_mode", "PLACE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    (settings.map_display_mode || "PLACE") === "PLACE"
                      ? "bg-amber-400 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🏫 Official Place Listing (Recommended)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("map_display_mode", "COORDINATES")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    settings.map_display_mode === "COORDINATES"
                      ? "bg-amber-400 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>🎯 Dropped GPS Pin</span>
                </button>
              </div>
            </div>

            {(settings.map_display_mode || "PLACE") === "PLACE" && (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-amber-300">
                  Google Maps Place Query / Landmark Name
                </label>
                <input
                  type="text"
                  value={settings.google_map_query || "Cambridge International School, Lunapani, Mandi, Himachal Pradesh"}
                  onChange={(e) => handleChange("google_map_query", e.target.value)}
                  placeholder="e.g. Cambridge International School, Lunapani, Mandi, Himachal Pradesh"
                  className="w-full bg-[#0d1f33] text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        "google_map_query",
                        "Cambridge International School, Lunapani, Mandi, Himachal Pradesh"
                      )
                    }
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold border border-slate-700"
                  >
                    📍 Lunapani Campus (Official)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        "google_map_query",
                        "Cambridge International School, Mandi, Himachal Pradesh"
                      )
                    }
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-semibold border border-slate-700"
                  >
                    📍 Mandi Valley Query
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Coordinate & Map Control Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                <span>Latitude (Decimal) *</span>
              </label>
              <input
                type="text"
                required
                value={settings.latitude || "31.7078"}
                onChange={(e) => handleChange("latitude", e.target.value)}
                placeholder="e.g. 31.7078"
                className="w-full bg-[#051329] text-white font-mono px-4 py-2.5 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">North latitude coordinate (e.g. 31.7078)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                <span>Longitude (Decimal) *</span>
              </label>
              <input
                type="text"
                required
                value={settings.longitude || "76.9311"}
                onChange={(e) => handleChange("longitude", e.target.value)}
                placeholder="e.g. 76.9311"
                className="w-full bg-[#051329] text-white font-mono px-4 py-2.5 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">East longitude coordinate (e.g. 76.9311)</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Default Map Zoom Level
              </label>
              <select
                value={settings.school_map_zoom || "15"}
                onChange={(e) => handleChange("school_map_zoom", e.target.value)}
                className="w-full bg-[#051329] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              >
                <option value="12">12 - District View</option>
                <option value="13">13 - City / Valley View</option>
                <option value="14">14 - Town View</option>
                <option value="15">15 - Campus View (Recommended)</option>
                <option value="16">16 - Street Close-Up</option>
                <option value="17">17 - High Precision Landmark</option>
                <option value="18">18 - Building Footprint</option>
              </select>
              <p className="text-[10px] text-slate-400">Initial zoom depth for visitors</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Map Layer Type</span>
              </label>
              <select
                value={settings.school_map_type || "m"}
                onChange={(e) => handleChange("school_map_type", e.target.value)}
                className="w-full bg-[#051329] text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              >
                <option value="m">Standard Street Roadmap</option>
                <option value="k">Satellite Imagery (Himalayan Terrain)</option>
                <option value="p">Terrain & Elevation Contours</option>
                <option value="h">Hybrid (Satellite + Road Labels)</option>
              </select>
              <p className="text-[10px] text-slate-400">Visual style of Google Map</p>
            </div>
          </div>

          {/* Optional Direct URLs / Custom Embed Override */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Custom Google Maps Embed URL / &lt;iframe&gt; (Optional Override)
              </label>
              <input
                type="text"
                value={settings.google_map_embed_url || ""}
                onChange={(e) => {
                  let val = e.target.value;
                  const match = val.match(/src=["']([^"']+)["']/);
                  if (match) val = match[1];
                  handleChange("google_map_embed_url", val);
                }}
                placeholder="Paste iframe code or leave blank for auto-generation"
                className="w-full bg-[#051329] text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">
                Paste a Google Maps &lt;iframe&gt; code if you have a custom Google Business listing embed.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Google Maps Navigation / Place Link (Optional)
              </label>
              <input
                type="text"
                value={settings.google_map_place_url || ""}
                onChange={(e) => handleChange("google_map_place_url", e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full bg-[#051329] text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">
                Used for &quot;Get Driving Directions&quot; buttons opening the Google Maps app.
              </p>
            </div>
          </div>

          {/* Live Google Map Preview Box */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Google Map Marker Preview (What Parents & Visitors See)</span>
              </span>

              <div className="flex items-center space-x-3">
                <a
                  href={
                    settings.google_map_place_url ||
                    (settings.map_display_mode === "COORDINATES"
                      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${settings.latitude || "31.7078"},${settings.longitude || "76.9311"}`
                        )}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          settings.google_map_query || "Cambridge International School, Lunapani, Mandi, Himachal Pradesh"
                        )}`)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={
                    settings.google_map_place_url ||
                    (settings.map_display_mode === "COORDINATES"
                      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${settings.latitude || "31.7078"},${settings.longitude || "76.9311"}`
                        )}`
                      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          settings.google_map_query || "Cambridge International School, Lunapani, Mandi, Himachal Pradesh"
                        )}`)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Get Driving Directions</span>
                  <Navigation className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-slate-700 bg-slate-950 shadow-inner">
              <iframe
                title="School Location Live Preview"
                src={
                  settings.google_map_embed_url && settings.google_map_embed_url.trim().length > 0
                    ? settings.google_map_embed_url
                    : settings.map_display_mode === "COORDINATES"
                    ? `https://maps.google.com/maps?q=${encodeURIComponent(
                        `${settings.latitude || "31.7078"},${settings.longitude || "76.9311"}`
                      )}&hl=en&z=${settings.school_map_zoom || "15"}&t=${
                        settings.school_map_type || "m"
                      }&output=embed`
                    : `https://maps.google.com/maps?q=${encodeURIComponent(
                        settings.google_map_query || "Cambridge International School, Lunapani, Mandi, Himachal Pradesh"
                      )}&hl=en&z=${settings.school_map_zoom || "15"}&t=${
                        settings.school_map_type || "m"
                      }&output=embed`
                }
                className="w-full h-full border-0"
                loading="lazy"
              />

              {/* Floating Coordinates Overlay in Preview */}
              <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur border border-slate-700 text-white px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center space-x-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Query: {settings.map_display_mode === "COORDINATES" ? `${settings.latitude}, ${settings.longitude}` : (settings.google_map_query || "Cambridge International School, Lunapani, Mandi")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2.6: Verified Campus Location & Connectivity Card Highlights */}
        <div className="bg-[#0d1f33] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Verified Campus Location & Connectivity Card Highlights
              </h2>
              <p className="text-xs text-slate-400">
                Customise every line shown on the &quot;Verified Campus Location&quot; card beside the Google Map on the Home and Facilities pages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-200">
                Location Card Campus Title / School Name
              </label>
              <input
                type="text"
                value={settings.school_name || "Cambridge International School, Mandi"}
                onChange={(e) => handleChange("school_name", e.target.value)}
                placeholder="Cambridge International School, Mandi"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-200">
                Location Card Campus Address Line
              </label>
              <input
                type="text"
                value={settings.school_address || ""}
                onChange={(e) => handleChange("school_address", e.target.value)}
                placeholder="Village Lunapani, Tehsil Balh, District Mandi, Himachal Pradesh - 175021, India"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Highlight 1: Campus Proximity / Drive Time</span>
              </label>
              <input
                type="text"
                value={settings.campus_drive_time || "5 Minutes drive from Mandi Town / Victoria Bridge"}
                onChange={(e) => handleChange("campus_drive_time", e.target.value)}
                placeholder="5 Minutes drive from Mandi Town / Victoria Bridge"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">First highlight item with yellow pin icon</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Highlight 2: Admissions Helpline Number</span>
              </label>
              <input
                type="text"
                value={settings.contact_phone || ""}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                placeholder="+91 1905 243366 / +91 8580579409"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">Second highlight item with blue phone icon</p>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-200 flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Highlight 3: School Bus & Transport Fleet Coverage</span>
              </label>
              <input
                type="text"
                value={settings.campus_transport_info || "GPS Monitored School Bus Transport Across Mandi & Ner Chowk"}
                onChange={(e) => handleChange("campus_transport_info", e.target.value)}
                placeholder="GPS Monitored School Bus Transport Across Mandi & Ner Chowk"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-amber-400 focus:outline-none text-xs"
              />
              <p className="text-[10px] text-slate-400">Third highlight item with purple compass icon</p>
            </div>
          </div>

          {/* Live In-Settings Visual Card Preview */}
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              ✨ Live Card Preview
            </p>
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700 space-y-3 max-w-md">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Campus Location</span>
              </div>
              <h4 className="text-base font-extrabold text-white">
                {settings.school_name || "Cambridge International School, Mandi"}
              </h4>
              <p className="text-xs text-slate-300">
                {settings.school_address || "Village Lunapani, Tehsil Balh, District Mandi, Himachal Pradesh - 175021, India"}
              </p>
              <div className="space-y-1.5 pt-1 text-xs text-slate-300">
                <div className="bg-slate-800/80 p-2 rounded-xl flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{settings.campus_drive_time || "5 Minutes drive from Mandi Town / Victoria Bridge"}</span>
                </div>
                <div className="bg-slate-800/80 p-2 rounded-xl flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="truncate">Admissions Helpline: {settings.contact_phone || "+91 1905 243366 / +91 8580579409"}</span>
                </div>
                <div className="bg-slate-800/80 p-2 rounded-xl flex items-center space-x-2">
                  <Compass className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span className="truncate">{settings.campus_transport_info || "GPS Monitored School Bus Transport Across Mandi & Ner Chowk"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Academic Session & Admission Status */}
        <div className="bg-[#0d1f33] border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-400/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Session & Admissions Status</h2>
              <p className="text-xs text-slate-400">
                Control current academic year tags and live registration flags.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Current Academic Session
              </label>
              <input
                type="text"
                value={settings.academic_year || "2027-2028"}
                onChange={(e) => handleChange("academic_year", e.target.value)}
                placeholder="e.g. 2027-2028"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Admission Portal Status
              </label>
              <select
                value={settings.admission_status || "OPEN"}
                onChange={(e) => handleChange("admission_status", e.target.value)}
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              >
                <option value="OPEN">🟢 OPEN (Accepting Applications)</option>
                <option value="CLOSED">🔴 CLOSED</option>
                <option value="WAITLIST">🟡 WAITLIST ONLY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Social Media Channels & Embedded Feeds */}
        <div className="bg-[#0d1f33] border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-400/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Social Media Links & Live Embeds</h2>
                <p className="text-xs text-slate-400">
                  Configure Facebook Page Stream and YouTube Channel Video embeds displayed on the Home Page and footer.
                </p>
              </div>
            </div>
            <Link
              href="/admin/social-media"
              className="inline-flex items-center space-x-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold px-3.5 py-1.5 rounded-xl border border-rose-500/30 transition-colors self-start sm:self-auto"
            >
              <span>Dedicated Social Studio</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#051329] rounded-2xl border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">Display Social Feeds on Home Page</p>
                <p className="text-[11px] text-slate-400">Shows the live interactive YouTube broadcast player and Facebook stream on homepage</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.show_social_embeds_home !== "false"}
                  onChange={(e) => handleChange("show_social_embeds_home", e.target.checked ? "true" : "false")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Facebook Page URL</label>
                <input
                  type="text"
                  value={settings.facebook_url || ""}
                  onChange={(e) => handleChange("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/cismandi"
                  className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
                />
                <p className="text-[10px] text-slate-400">Official Facebook page link</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">Facebook Embed / Plugin URL (Optional)</label>
                <input
                  type="text"
                  value={settings.facebook_embed_url || ""}
                  onChange={(e) => handleChange("facebook_embed_url", e.target.value)}
                  placeholder="https://www.facebook.com/plugins/page.php?href=..."
                  className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
                />
                <p className="text-[10px] text-slate-400">Leave blank to automatically embed Facebook timeline from Page URL</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">YouTube Channel URL</label>
                <input
                  type="text"
                  value={settings.youtube_url || ""}
                  onChange={(e) => handleChange("youtube_url", e.target.value)}
                  placeholder="https://youtube.com/@cismandi"
                  className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
                />
                <p className="text-[10px] text-slate-400">Channel link for subscribe buttons</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200">YouTube Video / Playlist Embed URL</label>
                <input
                  type="text"
                  value={settings.youtube_embed_url || ""}
                  onChange={(e) => handleChange("youtube_embed_url", e.target.value)}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID or watch URL"
                  className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
                />
                <p className="text-[10px] text-slate-400">Video or channel livestream to showcase in the Home Page player</p>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-200">Instagram Profile URL</label>
                <input
                  type="text"
                  value={settings.instagram_url || ""}
                  onChange={(e) => handleChange("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/cismandi_official"
                  className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Save Bar */}
        <div className="sticky bottom-6 z-20 bg-slate-900/95 backdrop-blur border border-slate-700 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Click save to apply changes globally across all pages.
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs px-8 py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
