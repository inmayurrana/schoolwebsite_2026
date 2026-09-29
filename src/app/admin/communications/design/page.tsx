"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Server,
  Mail,
  ShieldCheck,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Palette,
  Image as ImageIcon,
} from "lucide-react";

export default function EmailDesignPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [schoolName, setSchoolName] = useState("Cambridge International School, Mandi");
  const [schoolLogo, setSchoolLogo] = useState("/images/crest.png");
  const [primaryColor, setPrimaryColor] = useState("#0A2540");
  const [secondaryColor, setSecondaryColor] = useState("#0066FF");
  const [headerText, setHeaderText] = useState("Cambridge International School, Mandi");
  const [footerText, setFooterText] = useState("This is an official automated notification from Cambridge International School CMS.");
  const [address, setAddress] = useState("Lunapani, Tehsil Balh, Distt Mandi, H.P. - 175021");
  const [phone, setPhone] = useState("+91 98050 39389");
  const [website, setWebsite] = useState("https://cismandi.edu.in");

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/email/design");
      const data = await res.json();
      if (data.success && data.setting) {
        const s = data.setting;
        setSchoolName(s.schoolName || "Cambridge International School, Mandi");
        setSchoolLogo(s.schoolLogo || "/images/crest.png");
        setPrimaryColor(s.primaryColor || "#0A2540");
        setSecondaryColor(s.secondaryColor || "#0066FF");
        setHeaderText(s.headerText || "Cambridge International School, Mandi");
        setFooterText(s.footerText || "This is an official automated notification from Cambridge International School CMS.");
        setAddress(s.address || "Lunapani, Tehsil Balh, Distt Mandi, H.P. - 175021");
        setPhone(s.phone || "+91 98050 39389");
        setWebsite(s.website || "https://cismandi.edu.in");
      }
    } catch (err) {
      showToast("error", "Failed to fetch email design settings");
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/email/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName,
          schoolLogo,
          primaryColor,
          secondaryColor,
          headerText,
          footerText,
          address,
          phone,
          website,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Email design & branding settings saved!");
      } else {
        showToast("error", data.error || "Failed to save");
      }
    } catch (err: any) {
      showToast("error", err.message || "Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-bold transition-all border ${
            toast.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-400"
              : "bg-rose-900 text-rose-100 border-rose-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-300" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header & Sub-navigation Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">
              <span>Communications</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Email Design & Branding</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              Email Design & Branding Studio
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Customize institutional colors, banner crest, footer disclaimers, and typography across all HTML emails.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <Link
            href="/admin/communications/email"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Email Settings</span>
          </Link>
          <Link
            href="/admin/communications/alerts"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>Email Alerts</span>
          </Link>
          <Link
            href="/admin/communications/templates"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Email Templates</span>
          </Link>
          <Link
            href="/admin/communications/notifications"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Form Notifications</span>
          </Link>
          <Link
            href="/admin/communications/logs"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Email Logs & Queue</span>
          </Link>
          <Link
            href="/admin/communications/design"
            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Email Branding & Design</span>
          </Link>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Brand Colors & Header Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                School Display Name in Email Header
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Header Crest / Logo Image URL
              </label>
              <input
                type="text"
                value={schoolLogo}
                onChange={(e) => setSchoolLogo(e.target.value)}
                placeholder="/images/crest.png"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-semibold text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Primary Header Color (Hex)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-11 h-11 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono font-bold uppercase focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Secondary Accent Color (Buttons & Links)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-11 h-11 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono font-bold uppercase focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center space-x-2 text-sm font-black text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Institutional Footer & Contact Information</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Campus Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Official Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
                Website URL
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-2">
              Confidentiality / Automated Email Disclaimer
            </label>
            <textarea
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            <span>{saving ? "Saving Changes..." : "Save Branding Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
