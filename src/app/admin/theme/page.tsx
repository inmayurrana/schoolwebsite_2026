"use client";

import React, { useState, useEffect } from "react";
import {
  Palette,
  Save,
  CheckCircle2,
  Sparkles,
  Sliders,
  Type,
  Layers,
  RotateCcw,
  Loader2,
  Eye,
  Check,
  Upload,
  Image as ImageIcon,
  GraduationCap,
  Lock,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const themePresets = [
  {
    name: "Cambridge Royal Gold & Deep Navy",
    primaryColor: "#0A2540",
    secondaryColor: "#0066FF",
    accentColor: "#F4B400",
    darkBgColor: "#030816",
    cardBgColor: "#0f172a",
    textColor: "#FFFFFF",
    glassOpacity: 0.85,
    glowIntensity: 1.0,
    fontFamily: "Inter",
  },
  {
    name: "Himalayan Emerald & Alpine Gold",
    primaryColor: "#064e3b",
    secondaryColor: "#059669",
    accentColor: "#fbbf24",
    darkBgColor: "#022c22",
    cardBgColor: "#064e3b",
    textColor: "#FFFFFF",
    glassOpacity: 0.88,
    glowIntensity: 1.2,
    fontFamily: "Outfit",
  },
  {
    name: "Midnight Sapphire Luxury",
    primaryColor: "#0f172a",
    secondaryColor: "#38bdf8",
    accentColor: "#38bdf8",
    darkBgColor: "#020617",
    cardBgColor: "#1e293b",
    textColor: "#FFFFFF",
    glassOpacity: 0.82,
    glowIntensity: 1.4,
    fontFamily: "Plus Jakarta Sans",
  },
  {
    name: "Imperial Crimson & Royal Amber",
    primaryColor: "#881337",
    secondaryColor: "#e11d48",
    accentColor: "#f59e0b",
    darkBgColor: "#4c0519",
    cardBgColor: "#881337",
    textColor: "#FFFFFF",
    glassOpacity: 0.85,
    glowIntensity: 1.1,
    fontFamily: "Inter",
  },
];

interface HeaderButtonConfig {
  id: string;
  label: string;
  url: string;
  variant: "primary" | "secondary" | "accent" | "outline" | "login";
  openNewTab?: boolean;
  isVisible: boolean;
}

const DEFAULT_HEADER_BUTTONS: HeaderButtonConfig[] = [
  {
    id: "apply-admission",
    label: "Apply for Admission",
    url: "/admissions/apply",
    variant: "primary",
    isVisible: true,
  },
  {
    id: "pay-fee",
    label: "Pay Fee Online",
    url: "/admissions/fees-structure",
    variant: "accent",
    isVisible: true,
  },
];

export default function AdminThemeStudio() {
  const { themeConfig, refreshTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "Cambridge Royal Gold & Deep Navy",
    primaryColor: "#0A2540",
    secondaryColor: "#0066FF",
    accentColor: "#F4B400",
    darkBgColor: "#030816",
    cardBgColor: "#0f172a",
    textColor: "#FFFFFF",
    glassOpacity: 0.85,
    glowIntensity: 1.0,
    fontFamily: "Inter",
    logoMode: "TEXT_AND_ICON", // IMAGE_ONLY, TEXT_AND_ICON, IMAGE_AND_TEXT
    logoImageUrl: "",
    logoHeight: 48,
    headerButtonsJson: JSON.stringify(DEFAULT_HEADER_BUTTONS),
  });

  const [headerButtons, setHeaderButtons] = useState<HeaderButtonConfig[]>(DEFAULT_HEADER_BUTTONS);
  const [editingButtonIndex, setEditingButtonIndex] = useState<number | null>(null);
  const [newButtonForm, setNewButtonForm] = useState<HeaderButtonConfig>({
    id: "",
    label: "",
    url: "",
    variant: "primary",
    openNewTab: false,
    isVisible: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch("/api/theme");
        const data = await res.json();
        if (data.theme) {
          let parsedButtons = DEFAULT_HEADER_BUTTONS;
          if (data.theme.headerButtonsJson) {
            try {
              const p = JSON.parse(data.theme.headerButtonsJson);
              if (Array.isArray(p) && p.length > 0) parsedButtons = p;
            } catch (e) {}
          }
          setHeaderButtons(parsedButtons);

          setFormData({
            name: data.theme.name || "Cambridge Royal Gold & Deep Navy",
            primaryColor: data.theme.primaryColor || "#0A2540",
            secondaryColor: data.theme.secondaryColor || "#0066FF",
            accentColor: data.theme.accentColor || "#F4B400",
            darkBgColor: data.theme.darkBgColor || "#030816",
            cardBgColor: data.theme.cardBgColor || "#0f172a",
            textColor: data.theme.textColor || "#FFFFFF",
            glassOpacity: data.theme.glassOpacity ?? 0.85,
            glowIntensity: data.theme.glowIntensity ?? 1.0,
            fontFamily: data.theme.fontFamily || "Inter",
            logoMode: data.theme.logoMode || "TEXT_AND_ICON",
            logoImageUrl: data.theme.logoImageUrl || "",
            logoHeight: data.theme.logoHeight || 48,
            headerButtonsJson: JSON.stringify(parsedButtons),
          });
        }
      } catch (err) {
        console.error("Failed to load theme:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTheme();
  }, []);

  const applyPreset = (preset: typeof themePresets[0]) => {
    setFormData((prev) => ({
      ...prev,
      ...preset,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          logoImageUrl: data.url,
          logoMode: "IMAGE_ONLY",
        }));
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddOrUpdateButton = () => {
    if (!newButtonForm.label.trim() || !newButtonForm.url.trim()) {
      alert("Button label and destination URL are required.");
      return;
    }

    let updated: HeaderButtonConfig[];
    if (editingButtonIndex !== null) {
      updated = headerButtons.map((b, i) =>
        i === editingButtonIndex ? { ...newButtonForm, id: b.id || `btn-${Date.now()}` } : b
      );
    } else {
      updated = [
        ...headerButtons,
        {
          ...newButtonForm,
          id: `btn-${Date.now()}`,
        },
      ];
    }

    setHeaderButtons(updated);
    setFormData((prev) => ({ ...prev, headerButtonsJson: JSON.stringify(updated) }));
    setEditingButtonIndex(null);
    setNewButtonForm({
      id: "",
      label: "",
      url: "",
      variant: "primary",
      openNewTab: false,
      isVisible: true,
    });
  };

  const handleEditButton = (index: number) => {
    setEditingButtonIndex(index);
    setNewButtonForm(headerButtons[index]);
  };

  const handleDeleteButton = (index: number) => {
    const updated = headerButtons.filter((_, i) => i !== index);
    setHeaderButtons(updated);
    setFormData((prev) => ({ ...prev, headerButtonsJson: JSON.stringify(updated) }));
    if (editingButtonIndex === index) {
      setEditingButtonIndex(null);
      setNewButtonForm({ id: "", label: "", url: "", variant: "primary", openNewTab: false, isVisible: true });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const payload = {
      ...formData,
      headerButtonsJson: JSON.stringify(headerButtons),
    };

    try {
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
        if (refreshTheme) await refreshTheme();
      }
    } catch (err) {
      console.error("Theme save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Palette className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Theme, Branding & Header Action Buttons Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Customize school logos, theme colors, and configure header action buttons & Login portal URLs in full workspace.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Saved in Database!</span>
            </>
          ) : saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Saving Theme...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Theme & Buttons</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Cards */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          One-Click Luxury Preset Palettes
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {themePresets.map((preset) => {
            const isCurrent = formData.primaryColor === preset.primaryColor;
            return (
              <div
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                  isCurrent
                    ? "bg-slate-900 border-amber-400 ring-2 ring-amber-400/50 shadow-xl"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white line-clamp-1">{preset.name}</span>
                  {isCurrent && <Check className="w-4 h-4 text-amber-400" />}
                </div>

                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow"
                    style={{ backgroundColor: preset.primaryColor }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow"
                    style={{ backgroundColor: preset.secondaryColor }}
                    title="Secondary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow"
                    style={{ backgroundColor: preset.accentColor }}
                    title="Accent"
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-white/20 shadow"
                    style={{ backgroundColor: preset.darkBgColor }}
                    title="Dark BG"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Editor: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Logo, Action Buttons, Colors (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: HEADER ACTION BUTTONS & LOGIN PORTAL CONFIGURATOR */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <span>Header Action Buttons & Login Portal</span>
              </h2>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                Navbar CTAs
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Display a custom <strong>Login button</strong> (or parent/staff portal URL), add more CTA action buttons, and edit or delete existing header buttons.
            </p>

            {/* List of Configured Buttons */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Configured Header Buttons ({headerButtons.length})
              </label>

              <div className="space-y-2">
                {headerButtons.map((btn, index) => (
                  <div
                    key={btn.id || index}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      {btn.variant === "login" ? (
                        <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                          <Lock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-white text-xs block">{btn.label}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{btn.url}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          btn.variant === "login"
                            ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                            : btn.variant === "accent"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {btn.variant.toUpperCase()}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleEditButton(index)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Button"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteButton(index)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                        title="Delete Button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button Editor Form (Add or Edit) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>
                    {editingButtonIndex !== null
                      ? `Edit Button #${editingButtonIndex + 1}`
                      : "Add New Header Action Button"}
                  </span>
                </span>
                {editingButtonIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingButtonIndex(null);
                      setNewButtonForm({ id: "", label: "", url: "", variant: "primary", openNewTab: false, isVisible: true });
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Button Label *</label>
                  <input
                    type="text"
                    placeholder="e.g. Portal Login, Pay Fee, ERP"
                    value={newButtonForm.label}
                    onChange={(e) => setNewButtonForm({ ...newButtonForm, label: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Destination URL / Route *</label>
                  <input
                    type="text"
                    placeholder="/admin/login, https://erp.cismandi.edu.in..."
                    value={newButtonForm.url}
                    onChange={(e) => setNewButtonForm({ ...newButtonForm, url: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Visual Style</label>
                  <select
                    value={newButtonForm.variant}
                    onChange={(e: any) => setNewButtonForm({ ...newButtonForm, variant: e.target.value })}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                  >
                    <option value="login">🔐 Login Style (Outline + Lock Icon)</option>
                    <option value="primary">✨ Primary Gradient Sapphire</option>
                    <option value="accent">⭐ Accent Vibrant Gold</option>
                    <option value="outline">🔲 Clean Glass Outline</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Link Target</label>
                  <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newButtonForm.openNewTab}
                        onChange={(e) => setNewButtonForm({ ...newButtonForm, openNewTab: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-400"
                      />
                      <span className="text-slate-300">Open in New Browser Tab</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddOrUpdateButton}
                  className="inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingButtonIndex !== null ? "Update Button" : "Add Button to Navbar"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: HEADER SCHOOL LOGO */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>Navbar & Header Logo / Branding</span>
            </h2>

            {/* Logo Display Mode Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Logo Display Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logoMode: "IMAGE_ONLY" })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    formData.logoMode === "IMAGE_ONLY"
                      ? "bg-slate-900 border-blue-500 text-white ring-2 ring-blue-500/30 shadow-lg"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Image Only</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Display custom logo graphic in place of school name text.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logoMode: "TEXT_AND_ICON" })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    formData.logoMode === "TEXT_AND_ICON"
                      ? "bg-slate-900 border-blue-500 text-white ring-2 ring-blue-500/30 shadow-lg"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Icon + Text</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Classic Cambridge graduation cap badge & formatted text.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, logoMode: "IMAGE_AND_TEXT" })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    formData.logoMode === "IMAGE_AND_TEXT"
                      ? "bg-slate-900 border-blue-500 text-white ring-2 ring-blue-500/30 shadow-lg"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold text-xs flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Image + Text</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Display logo image on left with school name text on right.
                  </p>
                </button>
              </div>
            </div>

            {/* Logo Image Upload & Settings */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Upload Custom School Logo Image / Crest
                  </label>
                  <label className="cursor-pointer inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 shadow-sm transition-all">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{uploadingLogo ? "Uploading Logo..." : "Choose Logo File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.logoImageUrl && (
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-3">
                    <img
                      src={formData.logoImageUrl}
                      alt="Logo Preview"
                      style={{ height: `${formData.logoHeight}px` }}
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoImageUrl: "" })}
                      className="text-rose-400 hover:text-rose-300 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[11px] text-slate-400">Or Paste Public Logo Image URL</label>
                <input
                  type="url"
                  value={formData.logoImageUrl}
                  onChange={(e) => setFormData({ ...formData, logoImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 text-xs"
                />
              </div>

              {/* Logo Height Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Logo Height in Navigation Bar</span>
                  <span className="font-mono text-amber-400">{formData.logoHeight}px</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="72"
                  step="2"
                  value={formData.logoHeight}
                  onChange={(e) => setFormData({ ...formData, logoHeight: parseInt(e.target.value) })}
                  className="w-full accent-school-secondary"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: COLOR CONTROLS */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Palette className="w-5 h-5 text-amber-400" />
              <span>Brand Colors & Backgrounds</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-slate-300 block">Primary Brand Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-300 block">Secondary Accent Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-300 block">Accent Gold / Highlight</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-300 block">Deep Dark Canvas Background</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.darkBgColor}
                    onChange={(e) => setFormData({ ...formData, darkBgColor: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={formData.darkBgColor}
                    onChange={(e) => setFormData({ ...formData, darkBgColor: e.target.value })}
                    className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Real-Time Component Sandbox Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Live Header & Navbar Sandbox Simulation
          </label>

          <div
            className="rounded-3xl p-6 border shadow-2xl space-y-6 transition-all duration-300"
            style={{
              backgroundColor: formData.darkBgColor,
              borderColor: formData.primaryColor,
            }}
          >
            {/* Live Header & Buttons Preview */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Navbar Brand & Action Buttons
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">● Active</span>
              </div>

              {/* Brand Simulation */}
              <div className="flex items-center space-x-3 pt-1">
                {formData.logoMode === "IMAGE_ONLY" && formData.logoImageUrl ? (
                  <img
                    src={formData.logoImageUrl}
                    alt="Logo"
                    style={{ height: `${formData.logoHeight}px` }}
                    className="w-auto object-contain max-h-16"
                  />
                ) : formData.logoMode === "IMAGE_AND_TEXT" && formData.logoImageUrl ? (
                  <>
                    <img
                      src={formData.logoImageUrl}
                      alt="Logo"
                      style={{ height: `${formData.logoHeight}px` }}
                      className="w-auto object-contain max-h-14"
                    />
                    <div className="flex flex-col">
                      <span className="font-heading font-extrabold text-sm text-white leading-tight">
                        CAMBRIDGE
                      </span>
                      <span
                        className="text-[9px] font-bold tracking-widest uppercase"
                        style={{ color: formData.secondaryColor }}
                      >
                        International School, Mandi
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-amber-400 shadow-md border border-amber-400/30 flex-shrink-0"
                      style={{
                        background: `linear-gradient(to top right, ${formData.primaryColor}, ${formData.secondaryColor})`,
                      }}
                    >
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading font-extrabold text-sm text-white leading-tight">
                        CAMBRIDGE
                      </span>
                      <span
                        className="text-[9px] font-bold tracking-widest uppercase"
                        style={{ color: formData.secondaryColor }}
                      >
                        International School, Mandi
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons Rendered in Sandbox */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                {headerButtons.map((btn, idx) => (
                  <div
                    key={idx}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                      btn.variant === "login"
                        ? "bg-slate-800 text-amber-400 border border-slate-700"
                        : btn.variant === "accent"
                        ? "bg-amber-400 text-slate-950 font-black"
                        : btn.variant === "outline"
                        ? "bg-transparent text-white border border-slate-700"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {btn.variant === "login" && <Lock className="w-3 h-3" />}
                    <span>{btn.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl border space-y-2 bg-slate-900/60 border-slate-800">
              <h4 className="text-sm font-bold text-white">Live Glassmorphism Card</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click <strong>"Save Theme & Buttons"</strong> to apply changes to the live website immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
