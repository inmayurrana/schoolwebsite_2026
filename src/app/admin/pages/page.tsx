"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Eye,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  MoveUp,
  MoveDown,
  Loader2,
  ExternalLink,
  Video,
  Film,
  Sliders,
} from "lucide-react";
import Link from "next/link";

interface SectionItem {
  title: string;
  description: string;
  image?: string;
  badge?: string;
  link?: string;
  icon?: string;
}

interface SectionBlock {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  items: SectionItem[];
}

interface PageData {
  id?: string;
  slug: string;
  pageName: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  heroMediaType?: string;
  heroVideoUrl?: string;
  heroOverlayOpacity?: number;
  heroCtaText?: string;
  heroCtaLink?: string;
  sections: SectionBlock[];
  isPublished?: boolean;
}

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

function extractVimeoId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/);
  return m ? m[1] : null;
}

const defaultPages = [
  { slug: "home", name: "🏠 Home Page" },
  { slug: "facilities", name: "🏛️ 10-Acre Campus & Facilities" },
  { slug: "about", name: "📖 About Cambridge Mandi" },
  { slug: "academics", name: "🎓 Academic Pathways" },
  { slug: "admissions", name: "📝 Admissions Hub & Policies" },
  { slug: "student-life", name: "⚽ Student Life & Co-Curricular" },
  { slug: "contact", name: "📍 Contact & Location" },
];

export default function AdminPageEditor() {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("home");
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingItemIdx, setUploadingItemIdx] = useState<string | null>(null);

  // Load all pages list
  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await fetch("/api/pages");
        const data = await res.json();
        if (data.pages) setPages(data.pages);
      } catch (err) {
        console.error("Failed to load pages list:", err);
      }
    }
    fetchPages();
  }, []);

  // Load selected page data
  useEffect(() => {
    async function loadPageDetails() {
      try {
        setLoading(true);
        setSavedSuccess(false);
        const res = await fetch(`/api/pages/${selectedSlug}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentPage(data.page);
        } else {
          // Fallback template
          setCurrentPage({
            slug: selectedSlug,
            pageName: defaultPages.find((p) => p.slug === selectedSlug)?.name || selectedSlug,
            heroBadge: "Cambridge International School Mandi",
            heroTitle: "Inspiring Excellence Amidst Himalayan Serenity",
            heroSubtitle: "Empowering students with innovative pedagogy, digital smart labs, and Olympic sports.",
            heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
            heroCtaText: "Apply Now",
            heroCtaLink: "/admissions/apply",
            sections: [],
            isPublished: true,
          });
        }
      } catch (err) {
        console.error("Failed to load page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPageDetails();
  }, [selectedSlug]);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url && currentPage) {
        setCurrentPage({ ...currentPage, heroImage: json.url });
      }
    } catch (err) {
      console.error("Hero upload failed:", err);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleHeroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url && currentPage) {
        setCurrentPage({
          ...currentPage,
          heroVideoUrl: json.url,
          heroMediaType: "VIDEO",
        });
      }
    } catch (err) {
      console.error("Hero video upload failed:", err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleItemImageUpload = async (
    secIdx: number,
    itemIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !currentPage) return;

    setUploadingItemIdx(`${secIdx}-${itemIdx}`);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) {
        const newSections = [...currentPage.sections];
        newSections[secIdx].items[itemIdx].image = json.url;
        setCurrentPage({ ...currentPage, sections: newSections });
      }
    } catch (err) {
      console.error("Item upload failed:", err);
    } finally {
      setUploadingItemIdx(null);
    }
  };

  const handleSavePage = async () => {
    if (!currentPage) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/pages/${currentPage.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPage),
      });

      if (!res.ok) {
        // If not existing, post to /api/pages
        await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...currentPage,
            sectionsJson: JSON.stringify(currentPage.sections),
          }),
        });
      }

      setSavedSuccess(true);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    if (!currentPage) return;
    const newSection: SectionBlock = {
      id: `section_${Date.now()}`,
      type: "features_grid",
      title: "New Highlights Section",
      subtitle: "Customize section subtitle and description text",
      items: [
        {
          title: "New Facility / Feature Card",
          description: "Describe this distinctive offering or benchmark standard.",
          image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
          badge: "Featured",
          link: "/facilities",
        },
      ],
    };
    setCurrentPage({
      ...currentPage,
      sections: [...currentPage.sections, newSection],
    });
  };

  const removeSection = (secIdx: number) => {
    if (!currentPage) return;
    const newSections = currentPage.sections.filter((_, idx) => idx !== secIdx);
    setCurrentPage({ ...currentPage, sections: newSections });
  };

  const addItemToSection = (secIdx: number) => {
    if (!currentPage) return;
    const newSections = [...currentPage.sections];
    newSections[secIdx].items.push({
      title: "New Highlight Card",
      description: "Enter card details, curriculum highlights, or lab specifications here.",
      image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
      badge: "Active",
      link: "#",
    });
    setCurrentPage({ ...currentPage, sections: newSections });
  };

  const removeItemFromSection = (secIdx: number, itemIdx: number) => {
    if (!currentPage) return;
    const newSections = [...currentPage.sections];
    newSections[secIdx].items = newSections[secIdx].items.filter((_, idx) => idx !== itemIdx);
    setCurrentPage({ ...currentPage, sections: newSections });
  };

  return (
    <div className="space-y-8 max-w-full">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Visual Page & Content Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Universal Page Customizer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify any text, headline, subtitle, hero image, section block, and button link in real time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={selectedSlug === "home" ? "/" : `/${selectedSlug}`}
            target="_blank"
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
          >
            <span>Preview Live Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSavePage}
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 text-amber-400" />
                <span>Publish Changes Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold">
              Page '{currentPage?.pageName}' updated successfully and published to the live portal!
            </span>
          </div>
          <Link
            href={selectedSlug === "home" ? "/" : `/${selectedSlug}`}
            target="_blank"
            className="text-amber-400 underline font-bold"
          >
            Inspect Live View →
          </Link>
        </div>
      )}

      {/* Page Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Select Page to Edit
        </label>
        <div className="flex flex-wrap gap-2.5">
          {defaultPages.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                selectedSlug === p.slug
                  ? "bg-school-secondary text-white ring-2 ring-school-secondary/40 shadow-lg scale-105"
                  : "bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {loading || !currentPage ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-school-secondary mx-auto" />
          <p className="text-xs text-slate-400">Loading page layout & sections...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 1. Hero Banner Editor Card */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Hero Header & Visual Banner</h2>
                  <p className="text-xs text-slate-400">Topmost introduction section of the page</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Text Inputs */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hero Badge / Tagline Text</label>
                  <input
                    type="text"
                    value={currentPage.heroBadge || ""}
                    onChange={(e) => setCurrentPage({ ...currentPage, heroBadge: e.target.value })}
                    placeholder="e.g. CBSE Affiliated No. 630198"
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hero Main Headline *</label>
                  <input
                    type="text"
                    required
                    value={currentPage.heroTitle || ""}
                    onChange={(e) => setCurrentPage({ ...currentPage, heroTitle: e.target.value })}
                    placeholder="e.g. Inspiring Excellence Amidst Himalayan Serenity"
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-bold text-sm focus:outline-none focus:border-school-secondary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hero Description Paragraph *</label>
                  <textarea
                    rows={3}
                    required
                    value={currentPage.heroSubtitle || ""}
                    onChange={(e) => setCurrentPage({ ...currentPage, heroSubtitle: e.target.value })}
                    placeholder="Detailed introductory text..."
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-school-secondary leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">Call To Action (CTA) Button Text</label>
                    <input
                      type="text"
                      value={currentPage.heroCtaText || ""}
                      onChange={(e) => setCurrentPage({ ...currentPage, heroCtaText: e.target.value })}
                      placeholder="e.g. Apply for Admission"
                      className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-300">CTA Button Destination URL</label>
                    <input
                      type="text"
                      value={currentPage.heroCtaLink || ""}
                      onChange={(e) => setCurrentPage({ ...currentPage, heroCtaLink: e.target.value })}
                      placeholder="e.g. /admissions/apply"
                      className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Media (Video / Image) Studio */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Hero Media Display Type
                  </label>
                  <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrentPage({ ...currentPage, heroMediaType: "VIDEO" })}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                        currentPage.heroMediaType !== "IMAGE"
                          ? "bg-school-secondary text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Background Video</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage({ ...currentPage, heroMediaType: "IMAGE" })}
                      className={`px-3 py-1 rounded-lg font-bold flex items-center space-x-1.5 transition-all ${
                        currentPage.heroMediaType === "IMAGE"
                          ? "bg-school-secondary text-white shadow"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Static Image</span>
                    </button>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="relative h-60 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group shadow-inner">
                  {currentPage.heroMediaType !== "IMAGE" ? (
                    currentPage.heroVideoUrl ? (
                      extractYouTubeId(currentPage.heroVideoUrl) ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(
                            currentPage.heroVideoUrl
                          )}?autoplay=1&mute=1&loop=1&playlist=${extractYouTubeId(
                            currentPage.heroVideoUrl
                          )}&controls=0&showinfo=0&rel=0`}
                          title="YouTube Preview"
                          className="w-full h-full pointer-events-none object-cover scale-110"
                        />
                      ) : (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          src={currentPage.heroVideoUrl}
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                        No Video Configured
                      </div>
                    )
                  ) : currentPage.heroImage ? (
                    <img
                      src={currentPage.heroImage}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                      No Image Configured
                    </div>
                  )}

                  {/* Dark Vignette Overlay Preview */}
                  <div
                    className="absolute inset-0 bg-slate-950 pointer-events-none transition-opacity"
                    style={{
                      opacity: currentPage.heroOverlayOpacity !== undefined ? currentPage.heroOverlayOpacity : 0.45,
                    }}
                  />

                  {/* Hover Upload Trigger */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 space-x-3">
                    {currentPage.heroMediaType !== "IMAGE" ? (
                      <label className="cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>{uploadingVideo ? "Uploading Video..." : "Upload MP4 Video"}</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={handleHeroVideoUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <label className="cursor-pointer bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>{uploadingHero ? "Uploading Image..." : "Upload New Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleHeroImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Video Controls & URL Inputs */}
                {currentPage.heroMediaType !== "IMAGE" ? (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] text-slate-300 font-semibold">
                          Background Video URL (YouTube, Vimeo, MP4, WebM)
                        </label>
                        {extractYouTubeId(currentPage.heroVideoUrl) && (
                          <span className="text-[10px] text-red-400 font-bold">
                            ✓ YouTube Stream Detected
                          </span>
                        )}
                      </div>
                      <input
                        type="url"
                        value={currentPage.heroVideoUrl || ""}
                        onChange={(e) => setCurrentPage({ ...currentPage, heroVideoUrl: e.target.value })}
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Quick Sample Drone Videos */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Quick Pick Sample Campus Drone Videos:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            label: "Campus Drone Aerial",
                            url: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-school-campus-41551-large.mp4",
                          },
                          {
                            label: "Himalayan Nature Valley",
                            url: "https://assets.mixkit.co/videos/preview/mixkit-curved-road-surrounded-by-forest-trees-aerial-view-40748-large.mp4",
                          },
                          {
                            label: "Modern Academic Wing",
                            url: "https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-hallway-43391-large.mp4",
                          },
                        ].map((vSample, vIdx) => (
                          <button
                            type="button"
                            key={vIdx}
                            onClick={() => setCurrentPage({ ...currentPage, heroVideoUrl: vSample.url, heroMediaType: "VIDEO" })}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 text-left transition-all text-[10px] font-bold text-slate-300 hover:text-white"
                          >
                            <Film className="w-3.5 h-3.5 text-amber-400 mb-1" />
                            <span className="block truncate">{vSample.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Hero Poster Image URL</label>
                      <input
                        type="url"
                        value={currentPage.heroImage || ""}
                        onChange={(e) => setCurrentPage({ ...currentPage, heroImage: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 text-xs"
                      />
                    </div>

                    {/* Quick Image Presets */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Quick Pick Sample Campus Images:
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Campus Quadrangle", url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&auto=format&fit=crop&q=80" },
                          { label: "Smart Lab", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80" },
                          { label: "Robotics", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80" },
                          { label: "Sports", url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80" },
                        ].map((sample, sIdx) => (
                          <button
                            type="button"
                            key={sIdx}
                            onClick={() => setCurrentPage({ ...currentPage, heroImage: sample.url })}
                            className="group relative h-12 rounded-lg overflow-hidden border border-slate-800 hover:border-amber-400 transition-all"
                            title={sample.label}
                          >
                            <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dark Vignette Overlay Opacity Slider */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>Background Video/Image Contrast Overlay</span>
                    <span className="font-mono text-amber-400">
                      {Math.round((currentPage.heroOverlayOpacity !== undefined ? currentPage.heroOverlayOpacity : 0.45) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={currentPage.heroOverlayOpacity !== undefined ? currentPage.heroOverlayOpacity : 0.45}
                    onChange={(e) => setCurrentPage({ ...currentPage, heroOverlayOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-school-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Modular Sections List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Modular Content Sections ({currentPage.sections.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Add feature grids, highlights, card decks, and image showcases.
                </p>
              </div>

              <button
                onClick={addSection}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Content Section</span>
              </button>
            </div>

            {currentPage.sections.length === 0 ? (
              <div className="bg-slate-950 p-12 rounded-3xl border border-dashed border-slate-800 text-center space-y-3">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No custom modular sections added to this page yet.</p>
                <button
                  onClick={addSection}
                  className="bg-school-secondary text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Create First Section Block
                </button>
              </div>
            ) : (
              currentPage.sections.map((section, secIdx) => (
                <div
                  key={section.id || secIdx}
                  className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative"
                >
                  {/* Section Header Controls */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-950 text-blue-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-blue-800">
                        Section #{secIdx + 1}
                      </span>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                        {section.type}
                      </span>
                    </div>

                    <button
                      onClick={() => removeSection(secIdx)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Section Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Section Title *</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...currentPage.sections];
                          newSections[secIdx].title = e.target.value;
                          setCurrentPage({ ...currentPage, sections: newSections });
                        }}
                        className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Section Subtitle / Description</label>
                      <input
                        type="text"
                        value={section.subtitle}
                        onChange={(e) => {
                          const newSections = [...currentPage.sections];
                          newSections[secIdx].subtitle = e.target.value;
                          setCurrentPage({ ...currentPage, sections: newSections });
                        }}
                        className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800"
                      />
                    </div>
                  </div>

                  {/* Section Cards / Items List */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-amber-400">
                        Section Highlight Cards ({section.items?.length || 0})
                      </h4>
                      <button
                        onClick={() => addItemToSection(secIdx)}
                        className="inline-flex items-center space-x-1 text-xs text-school-secondary hover:underline font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Card Item</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.items?.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 relative group"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-mono text-slate-500">
                              Item #{itemIdx + 1}
                            </span>
                            <button
                              onClick={() => removeItemFromSection(secIdx, itemIdx)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="font-semibold text-slate-300">Card Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newSections = [...currentPage.sections];
                                newSections[secIdx].items[itemIdx].title = e.target.value;
                                setCurrentPage({ ...currentPage, sections: newSections });
                              }}
                              className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 font-bold text-xs"
                            />
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="font-semibold text-slate-300">Description</label>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const newSections = [...currentPage.sections];
                                newSections[secIdx].items[itemIdx].description = e.target.value;
                                setCurrentPage({ ...currentPage, sections: newSections });
                              }}
                              className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 text-xs"
                            />
                          </div>

                          {/* Item Image Uploader & Preview */}
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <label className="font-semibold text-slate-300">Image Asset</label>
                              <label className="cursor-pointer text-[11px] text-school-secondary hover:underline flex items-center space-x-1">
                                <Upload className="w-3 h-3" />
                                <span>
                                  {uploadingItemIdx === `${secIdx}-${itemIdx}` ? "Uploading..." : "Upload New"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleItemImageUpload(secIdx, itemIdx, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {item.image && (
                              <div className="h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                                <img
                                  src={item.image}
                                  alt="Card preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            <input
                              type="url"
                              value={item.image || ""}
                              onChange={(e) => {
                                const newSections = [...currentPage.sections];
                                newSections[secIdx].items[itemIdx].image = e.target.value;
                                setCurrentPage({ ...currentPage, sections: newSections });
                              }}
                              placeholder="https://..."
                              className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 text-[11px]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-0.5">
                              <label className="text-[10px] text-slate-400">Badge Text</label>
                              <input
                                type="text"
                                value={item.badge || ""}
                                onChange={(e) => {
                                  const newSections = [...currentPage.sections];
                                  newSections[secIdx].items[itemIdx].badge = e.target.value;
                                  setCurrentPage({ ...currentPage, sections: newSections });
                                }}
                                placeholder="e.g. Featured"
                                className="w-full bg-slate-950 text-white p-1.5 rounded-lg border border-slate-800 text-xs"
                              />
                            </div>

                            <div className="space-y-0.5">
                              <label className="text-[10px] text-slate-400">Target Link</label>
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => {
                                  const newSections = [...currentPage.sections];
                                  newSections[secIdx].items[itemIdx].link = e.target.value;
                                  setCurrentPage({ ...currentPage, sections: newSections });
                                }}
                                placeholder="e.g. /facilities"
                                className="w-full bg-slate-950 text-white p-1.5 rounded-lg border border-slate-800 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
