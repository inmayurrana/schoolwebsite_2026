"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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
    school_address: "Near Victoria Bridge, Gutkar / Mandi Bypass, Mandi, Himachal Pradesh - 175001, India",
    academic_year: "2027-2028",
    admission_status: "OPEN",
    facebook_url: "https://facebook.com/cismandi",
    instagram_url: "https://instagram.com/cismandi_official",
    youtube_url: "https://youtube.com/@cismandi",
  });

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
            : key.startsWith("contact_") || key.startsWith("whatsapp_")
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

        {/* Section 4: Social Media Channels */}
        <div className="bg-[#0d1f33] border border-blue-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-700/60">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-400/30">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Social Media Links</h2>
              <p className="text-xs text-slate-400">
                Official social profile handles linked in the website footer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Facebook Page URL</label>
              <input
                type="text"
                value={settings.facebook_url || ""}
                onChange={(e) => handleChange("facebook_url", e.target.value)}
                placeholder="https://facebook.com/cismandi"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Instagram Profile URL</label>
              <input
                type="text"
                value={settings.instagram_url || ""}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                placeholder="https://instagram.com/cismandi_official"
                className="w-full bg-[#051329] text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-400 focus:outline-none text-xs"
              />
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
