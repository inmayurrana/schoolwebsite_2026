"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Plus,
  Save,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  Star,
  CheckCircle2,
  AlertCircle,
  Eye,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Sliders,
  Palette,
  ExternalLink,
  RotateCcw,
  Copy,
  X,
  Quote,
  Check,
} from "lucide-react";
import {
  TestimonialItem,
  TestimonialsConfig,
  DEFAULT_TESTIMONIALS,
  DEFAULT_CONFIG,
} from "@/types/testimonials";
import TestimonialsSection from "@/components/home/TestimonialsSection";

const BADGE_PRESETS = [
  "Parent Review",
  "Proud Alumnus",
  "Student Voice",
  "Guardian Review",
  "Alumni Milestone",
  "Community Feedback",
];

const PRESET_AVATARS = [
  { label: "Male Doctor / Professional", url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80" },
  { label: "Female Executive", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" },
  { label: "Young Professional / Engineer", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
  { label: "Female Academic / Scholar", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
  { label: "Male Entrepreneur", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
  { label: "Female Doctor", url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80" },
];

export default function AdminTestimonialsStudio() {
  const [activeTab, setActiveTab] = useState<"voices" | "effects" | "preview">("voices");
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [config, setConfig] = useState<TestimonialsConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TestimonialItem>({
    id: "",
    name: "",
    role: "",
    relation: "",
    content: "",
    rating: 5,
    avatar: "",
    badge: "Parent Review",
    isActive: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing data from API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/testimonials?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && Array.isArray(data.testimonials)) {
            setTestimonials(data.testimonials);
          }
          if (data.config && typeof data.config === "object") {
            setConfig({ ...DEFAULT_CONFIG, ...data.config });
          }
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Save changes live to API
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testimonials,
          config,
        }),
      });

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("cis_testimonials_updated", Date.now().toString());
          window.dispatchEvent(new CustomEvent("cis_testimonials_updated"));
        }
        setToastMessage("✨ Parent & Alumni voices and UI effects saved live on the website!");
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        setToastMessage("❌ Failed to save changes. Please try again.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setToastMessage("❌ Network error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  // Add new voice modal
  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({
      id: "voice-" + Date.now(),
      name: "",
      role: "",
      relation: "",
      content: "",
      rating: 5,
      avatar: PRESET_AVATARS[0].url,
      badge: "Parent Review",
      isActive: true,
    });
    setModalOpen(true);
  };

  // Edit existing voice modal
  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setFormData({ ...testimonials[index] });
    setModalOpen(true);
  };

  // Submit voice form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      alert("Please provide at least author name and testimonial quote.");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...testimonials];
      updated[editingIndex] = formData;
      setTestimonials(updated);
    } else {
      setTestimonials([...testimonials, formData]);
    }

    setModalOpen(false);
    setToastMessage("Voice updated in draft! Click 'Save & Publish Live' to publish.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Delete voice
  const handleDeleteVoice = (index: number) => {
    if (!confirm(`Are you sure you want to remove "${testimonials[index].name}"?`)) return;
    const updated = testimonials.filter((_, i) => i !== index);
    setTestimonials(updated);
  };

  // Duplicate voice
  const handleDuplicateVoice = (index: number) => {
    const original = testimonials[index];
    const clone: TestimonialItem = {
      ...original,
      id: "voice-" + Date.now(),
      name: `${original.name} (Copy)`,
    };
    const updated = [...testimonials];
    updated.splice(index + 1, 0, clone);
    setTestimonials(updated);
  };

  // Reorder voice
  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= testimonials.length) return;
    const updated = [...testimonials];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setTestimonials(updated);
  };

  // Toggle active status
  const handleToggleActive = (index: number) => {
    const updated = [...testimonials];
    updated[index] = {
      ...updated[index],
      isActive: updated[index].isActive === false ? true : false,
    };
    setTestimonials(updated);
  };

  // Handle direct file upload for avatar
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.fileUrl) {
          setFormData((prev) => ({ ...prev, avatar: data.fileUrl }));
        }
      } else {
        alert("Image upload failed. Please try a smaller image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading image file.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Reset to defaults
  const handleResetToDefaults = () => {
    if (!confirm("Reset all voices and UI effects to original defaults?")) return;
    setTestimonials(DEFAULT_TESTIMONIALS);
    setConfig(DEFAULT_CONFIG);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading Parent & Alumni Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-400/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fade-in backdrop-blur-xl">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Community & Voices CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Parent & Alumni Voices Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Add, edit, remove, and reorder parent reviews and alumnus testimonials. Customize text, upload photos, and tailor interactive visual effects in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/#testimonials"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl glass-btn text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span>View on Home Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs transition-all shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Saving Live...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("voices")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "voices"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Manage Voices ({testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("effects")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "effects"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Section Text & UI Effects</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "preview"
              ? "bg-amber-400 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Interactive Preview</span>
        </button>
      </div>

      {/* Tab 1: Manage Voices */}
      {activeTab === "voices" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-slate-400">
                Total Voices: <strong className="text-white">{testimonials.length}</strong>
              </span>
              <span>•</span>
              <span className="text-xs text-slate-400">
                Active on Live Site:{" "}
                <strong className="text-emerald-400">
                  {testimonials.filter((t) => t.isActive !== false).length}
                </strong>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetToDefaults}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset to default testimonials"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Voice</span>
              </button>
            </div>
          </div>

          {/* Testimonial Cards List */}
          <div className="grid grid-cols-1 gap-4">
            {testimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-6 rounded-2xl border transition-all duration-200 ${
                  item.isActive === false
                    ? "bg-slate-950/40 border-slate-800/60 opacity-60"
                    : "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-lg"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Avatar & Details */}
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.avatar || PRESET_AVATARS[0].url}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md flex-shrink-0 bg-slate-800"
                    />
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white">{item.name}</h3>
                        {item.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            {item.badge}
                          </span>
                        )}
                        {item.isActive === false ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Hidden / Draft
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Live on Site
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-sky-400">{item.role}</p>
                      <p className="text-[11px] text-slate-400">{item.relation}</p>

                      {/* Stars */}
                      <div className="flex items-center space-x-1 pt-1">
                        {[...Array(item.rating || 5)].map((_, sIdx) => (
                          <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      {/* Content excerpt */}
                      <p className="text-xs text-slate-300 italic pt-1 line-clamp-2 max-w-3xl">
                        "{item.content}"
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-1.5 self-end md:self-start flex-shrink-0">
                    {/* Active Toggle Switch */}
                    <button
                      onClick={() => handleToggleActive(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        item.isActive === false
                          ? "bg-slate-800 text-slate-400 hover:text-white"
                          : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      }`}
                      title={item.isActive === false ? "Click to enable" : "Click to hide"}
                    >
                      {item.isActive === false ? "Disabled" : "Active"}
                    </button>

                    {/* Move Up */}
                    <button
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      className="p-2 rounded-xl glass-btn text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === testimonials.length - 1}
                      className="p-2 rounded-xl glass-btn text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicateVoice(idx)}
                      className="p-2 rounded-xl glass-btn text-slate-400 hover:text-white cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(idx)}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                      title="Edit details & photo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteVoice(idx)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                      title="Remove voice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Section Text & UI Effects */}
      {activeTab === "effects" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section Headings */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Quote className="w-4 h-4 text-amber-400" />
                <span>Section Headers & Typography</span>
              </h3>
              <p className="text-xs text-slate-400">Configure public titles and descriptions.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Top Badge Pill Text
                </label>
                <input
                  type="text"
                  value={config.badge}
                  onChange={(e) => setConfig({ ...config, badge: e.target.value })}
                  placeholder="Parent & Alumni Voices"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Trusted by Discerning Parents & Inspiring Alumni"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subtitle / Subheading (Optional)
                </label>
                <textarea
                  rows={2}
                  value={config.subtitle || ""}
                  onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  placeholder="Authentic feedback and reflections from our proud parent community and distinguished alumni."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* UI Visual Effects */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Visual UI Effects & Styling</span>
              </h3>
              <p className="text-xs text-slate-400">Glassmorphism, ambient glows, and card finishes.</p>
            </div>

            <div className="space-y-5">
              {/* Card Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Testimonial Card Style
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "glass", label: "Ultra Glass", desc: "Frosted blur with light glow" },
                    { id: "navy", label: "Midnight Luxury", desc: "Deep gradient with gold line" },
                    { id: "clean", label: "Crisp Clean", desc: "Pure solid card with shadow" },
                    { id: "aurora", label: "Aurora Glow", desc: "Vibrant iridescent gradient border" },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setConfig({ ...config, cardStyle: style.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        config.cardStyle === style.id
                          ? "border-amber-400 bg-amber-500/10 text-white"
                          : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold text-xs">{style.label}</div>
                      <div className="text-[10px] text-slate-500">{style.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambient Glow */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Ambient Floating Glow Orbs
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "purple-gold", label: "Purple & Gold Orbs" },
                    { id: "blue-cyan", label: "Cyber Blue & Cyan" },
                    { id: "emerald-amber", label: "Himalayan Emerald" },
                    { id: "none", label: "Disabled / Minimal" },
                  ].map((glow) => (
                    <button
                      key={glow.id}
                      type="button"
                      onClick={() => setConfig({ ...config, ambientGlow: glow.id as any })}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        config.ambientGlow === glow.id
                          ? "border-amber-400 bg-amber-500/10 text-white"
                          : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {glow.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Star Rating Color
                </label>
                <div className="flex items-center space-x-3">
                  {[
                    { id: "amber", label: "Amber Gold", color: "bg-amber-400" },
                    { id: "yellow", label: "Sunflower Yellow", color: "bg-yellow-400" },
                    { id: "emerald", label: "Emerald Sparkle", color: "bg-emerald-400" },
                  ].map((star) => (
                    <button
                      key={star.id}
                      type="button"
                      onClick={() => setConfig({ ...config, starColor: star.id as any })}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        config.starColor === star.id
                          ? "border-amber-400 bg-amber-500/10 text-white"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${star.color}`} />
                      <span>{star.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Watermark Quote Icon */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Quote Watermark Style
                </label>
                <div className="flex items-center space-x-3">
                  {[
                    { id: "subtle", label: "Subtle Watermark" },
                    { id: "solid", label: "Solid Badge" },
                    { id: "none", label: "Hidden" },
                  ].map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setConfig({ ...config, quoteIconStyle: q.id as any })}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        config.quoteIconStyle === q.id
                          ? "border-amber-400 bg-amber-500/10 text-white"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carousel Autoplay */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Carousel Autoplay</div>
                    <div className="text-[11px] text-slate-500">Auto-advance testimonials smoothly</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.autoplay}
                    onChange={(e) => setConfig({ ...config, autoplay: e.target.checked })}
                    className="w-5 h-5 accent-amber-400 cursor-pointer"
                  />
                </div>

                {config.autoplay && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Slide Duration</span>
                      <span className="font-mono text-amber-400">{config.autoplaySpeed || 6} seconds</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={12}
                      step={1}
                      value={config.autoplaySpeed || 6}
                      onChange={(e) => setConfig({ ...config, autoplaySpeed: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Live Interactive Preview */}
      {activeTab === "preview" && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Real-time preview of how Parent & Alumni Voices appear on the live website.</span>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish These Settings Live</span>
            </button>
          </div>

          <div className="border border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
            <TestimonialsSection
              initialTestimonials={testimonials}
              initialConfig={config}
            />
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Voice */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingIndex !== null ? "Edit Voice / Testimonial" : "Add Parent or Alumni Voice"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in author details, quotation text, and upload or choose an avatar image.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl glass-btn text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-5">
              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Author Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sandeep Kaundal"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Profession / Designation
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Consultant Neurosurgeon"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Relationship & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Relation / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    placeholder="e.g. Parent of Aarav Kaundal (Grade X)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Badge Tag (Category)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      placeholder="e.g. Parent Review"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {BADGE_PRESETS.map((bp) => (
                        <button
                          key={bp}
                          type="button"
                          onClick={() => setFormData({ ...formData, badge: bp })}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                            formData.badge === bp
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          {bp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating & Active */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rating (Stars)
                  </label>
                  <div className="flex items-center space-x-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: starVal })}
                        className="cursor-pointer p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            starVal <= (formData.rating || 5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-amber-400 ml-2">
                      {formData.rating || 5} Stars
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActiveModal"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                  />
                  <label htmlFor="isActiveModal" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Publish Live on Website
                  </label>
                </div>
              </div>

              {/* Quote Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Testimonial Quote / Message *
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formData.content.length} characters
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share the full reflection or experience with CIS Mandi..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Photo / Avatar Uploader & Presets */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-semibold text-slate-300">
                  Author Photo / Avatar
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Avatar Preview */}
                  <img
                    src={formData.avatar || PRESET_AVATARS[0].url}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md flex-shrink-0 bg-slate-900"
                  />

                  <div className="space-y-2 flex-1 w-full">
                    {/* URL Input */}
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="Paste image URL or upload file..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                    />

                    {/* Upload Button */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                      >
                        {uploadingImage ? (
                          <>
                            <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                            <span>Uploading & Converting to WebP...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 text-amber-400" />
                            <span>Upload Photo from Computer</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
                    Or select from high-resolution portrait presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AVATARS.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar: preset.url })}
                        className={`relative rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer ${
                          formData.avatar === preset.url
                            ? "border-amber-400 shadow-md ring-2 ring-amber-400/30"
                            : "border-slate-800 opacity-70 hover:opacity-100"
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-10 h-10 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl glass-btn text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  {editingIndex !== null ? "Save Voice Changes" : "Add to Testimonials"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
