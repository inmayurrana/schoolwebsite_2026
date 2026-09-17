"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
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
  Check,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Settings2,
  ToggleLeft,
  ToggleRight,
  Zap,
  CheckCheck,
  CheckSquare,
  RefreshCw,
  Palette,
  Type,
  FileDown,
  GraduationCap,
  BarChart3,
  HelpCircle,
  FolderDown,
  Download,
  BookOpen,
  Layout,
  MessageSquareQuote,
} from "lucide-react";
import Link from "next/link";
import VisualCanvasEditor, { PageData } from "@/components/admin/VisualCanvasEditor";
import { getPageDefault } from "@/lib/pageRegistry";

interface SitePageMeta {
  slug: string;
  path: string;
  name: string;
  category: string;
  description: string;
}

const ALL_SITE_PAGES: SitePageMeta[] = [
  // Core
  { slug: "home", path: "/", name: "🏠 Home Page", category: "Core", description: "Main landing page with hero video, statistics & highlights" },
  // About Us
  { slug: "about", path: "/about", name: "📖 About Cambridge Mandi", category: "About Us", description: "Our heritage, Cambridge legacy & Himalayan sanctuary" },
  { slug: "mission-vision", path: "/about/mission-vision", name: "🎯 Mission & Vision", category: "About Us", description: "Core values, philosophy & global perspective" },
  { slug: "chairman-message", path: "/about/chairman-message", name: "👔 Chairman's Message", category: "About Us", description: "Guiding vision & academic leadership ethos" },
  { slug: "principal-message", path: "/about/principal-message", name: "🎓 Principal's Desk", category: "About Us", description: "Welcome address & academic benchmarks" },
  { slug: "faculty", path: "/about/faculty", name: "👩‍🏫 Faculty & Mentors Directory", category: "About Us", description: "Faculty qualifications, profiles & departments" },
  // Academics
  { slug: "academics", path: "/academics", name: "📚 Academic Curriculum", category: "Academics", description: "Integrated CBSE & Cambridge framework" },
  { slug: "pre-primary", path: "/academics/pre-primary", name: "🌱 Pre-Primary (Early Years)", category: "Academics", description: "Montessori & experiential kindergarten" },
  { slug: "primary", path: "/academics/primary", name: "✏️ Primary Wing (Grades 1-5)", category: "Academics", description: "Foundational conceptual curriculum" },
  { slug: "middle-school", path: "/academics/middle-school", name: "🔭 Middle School (Grades 6-8)", category: "Academics", description: "STEM, critical thinking & discovery" },
  { slug: "senior-secondary", path: "/academics/senior-secondary", name: "🔬 Senior Secondary (Grades 9-12)", category: "Academics", description: "Medical, Non-Med, Commerce & Humanities" },
  // Admissions
  { slug: "admissions", path: "/admissions", name: "📝 Admissions Hub & Policies", category: "Admissions", description: "Eligibility criteria, guidelines & age matrix" },
  { slug: "procedure", path: "/admissions/procedure", name: "📋 Admission Procedure", category: "Admissions", description: "Step-by-step registration & enrollment" },
  { slug: "fees-structure", path: "/admissions/fees-structure", name: "💳 Fees Structure & Schedule", category: "Admissions", description: "Tuition, transport & schedule breakdown" },
  { slug: "scholarships", path: "/admissions/scholarships", name: "🏆 Scholarships & Awards", category: "Admissions", description: "Merit, sports & defence fee waivers" },
  { slug: "apply", path: "/admissions/apply", name: "⚡ Apply Online Registration", category: "Admissions", description: "Interactive dynamic student registration form" },
  // Facilities
  { slug: "facilities", path: "/facilities", name: "🏛️ 10-Acre Campus & Facilities", category: "Facilities", description: "World-class campus infrastructure overview" },
  { slug: "smart-classrooms", path: "/facilities/smart-classrooms", name: "🖥️ Smart Classrooms", category: "Facilities", description: "4K interactive digital podiums & panels" },
  { slug: "science-labs", path: "/facilities/science-labs", name: "🧪 Science & AI Labs", category: "Facilities", description: "Physics, Chemistry, Biology & Biotech labs" },
  { slug: "robotics-lab", path: "/facilities/robotics-lab", name: "🤖 Robotics & Innovation Lab", category: "Facilities", description: "3D printing, IoT, drones & humanoid robots" },
  { slug: "library", path: "/facilities/library", name: "📖 Central Library", category: "Facilities", description: "25,000+ books & digital e-learning pods" },
  { slug: "sports-complex", path: "/facilities/sports-complex", name: "⚽ Olympic Sports Complex", category: "Facilities", description: "Olympic heated pool, FIFA turf & synthetic courts" },
  { slug: "hostel", path: "/facilities/hostel", name: "🛏️ Residential Boarding Hostel", category: "Facilities", description: "Safe boarding with nutritious dining & study halls" },
  { slug: "transport", path: "/facilities/transport", name: "🚌 Transport Fleet", category: "Facilities", description: "GPS & CCTV enabled luxury bus fleet in Mandi" },
  // Student Life
  { slug: "student-life", path: "/student-life", name: "🎨 Student Life & Co-Curricular", category: "Student Life", description: "House system, MUN, arts, dance & music" },
  { slug: "achievements", path: "/achievements", name: "🎖️ Hall of Fame & Achievements", category: "Student Life", description: "National Olympiads & sports gold medalists" },
  { slug: "results", path: "/results", name: "📊 CBSE Board Results", category: "Student Life", description: "Class 10 & 12 state toppers & distinctions" },
  { slug: "gallery", path: "/gallery", name: "📸 Photo & Video Gallery", category: "Student Life", description: "Campus albums, celebrations & event archives" },
  { slug: "virtual-tour", path: "/virtual-tour", name: "🌐 360° Virtual Campus Tour", category: "Student Life", description: "Immersive panoramic walk through CIS Mandi" },
  // Connect & Compliance
  { slug: "news", path: "/news", name: "📰 News & Circulars", category: "Connect", description: "Official school bulletins & circulars" },
  { slug: "events", path: "/events", name: "📅 Upcoming Events Calendar", category: "Connect", description: "Competitions, sports meet & annual fest" },
  { slug: "downloads", path: "/downloads", name: "📥 Downloads & Documents", category: "Connect", description: "Syllabus, book lists, datesheets & forms" },
  { slug: "mandatory-disclosure", path: "/mandatory-disclosure", name: "⚖️ CBSE Mandatory Disclosure", category: "Compliance", description: "OASIS / SARAS compliance documents" },
  { slug: "cbse-information", path: "/cbse-information", name: "🏫 CBSE School Information", category: "Compliance", description: "Affiliation status, committee & faculty list" },
  { slug: "careers", path: "/careers", name: "💼 Careers at CIS Mandi", category: "Connect", description: "Teaching vacancies & online application" },
  { slug: "contact", path: "/contact", name: "📍 Contact & Campus Location", category: "Connect", description: "Inquiries, helpline numbers & Google Maps" },
];

export default function AdminPageEditor() {
  const [activeTab, setActiveTab] = useState<"directory" | "editor">("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>({});
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

  const [selectedSlug, setSelectedSlug] = useState("home");
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [applyingAll, setApplyingAll] = useState(false);

  // 1. Fetch visibility map for all pages
  const fetchVisibility = async () => {
    try {
      const res = await fetch("/api/pages/visibility", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.visibility) {
          setVisibilityMap(data.visibility);
        }
      }
    } catch (err) {
      console.error("Failed to load page visibility:", err);
    }
  };

  useEffect(() => {
    fetchVisibility();
  }, []);

  // Immediate synchronous page switch handler to ensure instant UI update
  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    const meta = ALL_SITE_PAGES.find((p) => p.slug === slug);
    const defaultPage = getPageDefault(slug, meta?.name, meta?.description);
    setCurrentPage({
      ...defaultPage,
      isPublished: visibilityMap[slug] !== false,
    });
  };

  // 2. Load selected page data in visual editor from API / DB
  useEffect(() => {
    let isCurrent = true;
    async function loadPageDetails() {
      try {
        setSavedSuccess(false);
        const res = await fetch(`/api/pages/${selectedSlug}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.page && isCurrent) {
            const meta = ALL_SITE_PAGES.find((p) => p.slug === selectedSlug);
            const defaultPage = getPageDefault(selectedSlug, meta?.name, meta?.description);
            setCurrentPage({
              ...defaultPage,
              ...data.page,
              sections:
                Array.isArray(data.page.sections) && data.page.sections.length > 0
                  ? data.page.sections
                  : (defaultPage.sections || []),
              customStyles: {
                ...defaultPage.customStyles,
                ...(data.page.customStyles || {}),
              },
            });
            return;
          }
        }

        // Fallback to exact rich page structure from registry
        if (isCurrent) {
          const meta = ALL_SITE_PAGES.find((p) => p.slug === selectedSlug);
          const defaultPage = getPageDefault(selectedSlug, meta?.name, meta?.description);
          setCurrentPage({
            ...defaultPage,
            isPublished: visibilityMap[selectedSlug] !== false,
          });
        }
      } catch (err) {
        console.error("Failed to load page:", err);
        if (isCurrent) {
          const meta = ALL_SITE_PAGES.find((p) => p.slug === selectedSlug);
          const defaultPage = getPageDefault(selectedSlug, meta?.name, meta?.description);
          setCurrentPage({
            ...defaultPage,
            isPublished: visibilityMap[selectedSlug] !== false,
          });
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }
    loadPageDetails();
    return () => {
      isCurrent = false;
    };
  }, [selectedSlug]);

  // 3. Quick Checkbox Toggle Handler
  const handleToggleVisibility = async (slug: string, newStatus: boolean, pageName: string) => {
    setTogglingSlug(slug);
    setVisibilityMap((prev) => ({ ...prev, [slug]: newStatus }));
    if (currentPage && currentPage.slug === slug) {
      setCurrentPage({ ...currentPage, isPublished: newStatus });
    }

    try {
      const res = await fetch("/api/pages/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, isPublished: newStatus, pageName }),
      });

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("cis_page_visibility_updated", Date.now().toString());
          window.dispatchEvent(new CustomEvent("cis_visibility_changed"));
          try {
            const ch = new BroadcastChannel("cis_visibility_channel");
            ch.postMessage({ type: "VISIBILITY_UPDATED", slug, isPublished: newStatus });
            ch.close();
          } catch (_) {}
        }
        setToastMessage(
          newStatus
            ? `Page "${pageName}" is now ENABLED. It is live and visible on the website.`
            : `Page "${pageName}" is now DISABLED. It is hidden from menus and visitors.`
        );
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setVisibilityMap((prev) => ({ ...prev, [slug]: !newStatus }));
      }
    } catch (err) {
      console.error("Failed to toggle page visibility:", err);
      setVisibilityMap((prev) => ({ ...prev, [slug]: !newStatus }));
    } finally {
      setTogglingSlug(null);
    }
  };

  // 4. Batch Apply All Visibility Settings Live
  const handleApplyAllLive = async () => {
    setApplyingAll(true);
    try {
      const res = await fetch("/api/pages/bulk-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visibilityMap,
          pagesList: ALL_SITE_PAGES,
        }),
      });

      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("cis_page_visibility_updated", Date.now().toString());
          window.dispatchEvent(new CustomEvent("cis_visibility_changed"));
          try {
            const ch = new BroadcastChannel("cis_visibility_channel");
            ch.postMessage({ type: "VISIBILITY_UPDATED", timestamp: Date.now() });
            ch.close();
          } catch (_) {}
        }
        setToastMessage("✨ All page visibility changes have been applied immediately to the live website!");
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        setToastMessage("❌ Failed to apply changes. Please try again.");
      }
    } catch (err) {
      console.error("Apply all failed:", err);
      setToastMessage("❌ Network error applying changes.");
    } finally {
      setApplyingAll(false);
    }
  };

  const handleBulkSetAll = (status: boolean) => {
    const updated: Record<string, boolean> = {};
    ALL_SITE_PAGES.forEach((p) => {
      updated[p.slug] = status;
    });
    setVisibilityMap(updated);
  };

  // 5. Save and Publish Visual Page Content
  const handleSavePage = async () => {
    if (!currentPage) return;
    setSaving(true);
    try {
      const payload = {
        slug: currentPage.slug,
        pageName: currentPage.pageName || currentPage.slug,
        heroBadge: currentPage.heroBadge,
        heroTitle: currentPage.heroTitle,
        heroSubtitle: currentPage.heroSubtitle,
        heroImage: currentPage.heroImage,
        heroMediaType: currentPage.heroMediaType || "IMAGE",
        heroVideoUrl: currentPage.heroVideoUrl,
        heroOverlayOpacity: currentPage.heroOverlayOpacity ?? 0.45,
        heroCtaText: currentPage.heroCtaText,
        heroCtaLink: currentPage.heroCtaLink,
        sections: currentPage.sections || [],
        customStyles: currentPage.customStyles || {},
        isPublished: currentPage.isPublished !== false,
      };

      const res = await fetch(`/api/pages/${currentPage.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
        if (typeof window !== "undefined") {
          localStorage.setItem("cis_page_visibility_updated", Date.now().toString());
          window.dispatchEvent(new CustomEvent("cis_visibility_changed"));
          try {
            const ch = new BroadcastChannel("cis_visibility_channel");
            ch.postMessage({ type: "PAGE_UPDATED", slug: currentPage.slug });
            ch.close();
          } catch (_) {}
        }
        setToastMessage(`✨ Page "${currentPage.pageName}" saved & published live!`);
        setTimeout(() => {
          setSavedSuccess(false);
          setToastMessage(null);
        }, 5000);
      } else {
        setToastMessage("❌ Failed to save page content. Please try again.");
      }
    } catch (err) {
      console.error("Save page error:", err);
      setToastMessage("❌ Network error saving page.");
    } finally {
      setSaving(false);
    }
  };

  // 6. Direct Image File Upload Handler
  const handleUploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) {
        setToastMessage("Image uploaded successfully!");
        setTimeout(() => setToastMessage(null), 3000);
        return json.url;
      }
      return null;
    } catch (err) {
      console.error("Image upload failed:", err);
      setToastMessage("Failed to upload image.");
      setTimeout(() => setToastMessage(null), 3000);
      return null;
    }
  };

  // Filtered pages for directory
  const categories = useMemo(() => {
    const cats = new Set<string>();
    ALL_SITE_PAGES.forEach((p) => cats.add(p.category));
    return ["ALL", ...Array.from(cats)];
  }, []);

  const filteredDirectoryPages = useMemo(() => {
    return ALL_SITE_PAGES.filter((p) => {
      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
      const matchSearch =
        searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  const totalPages = ALL_SITE_PAGES.length;
  const disabledCount = Object.values(visibilityMap).filter((v) => v === false).length;
  const activeCount = totalPages - disabledCount;

  return (
    <div className="space-y-6 max-w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-amber-400/40 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center space-x-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span>Universal Page & Visual Content Studio</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white mt-1">
            Website Pages & Visual Canvas Studio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live WYSIWYG canvas: click any text to edit inline, hover over images to upload/resize, and drag blocks visually.
          </p>
        </div>

        {/* Stats Pill Badges & Apply Live Button */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center space-x-2">
            <span className="text-slate-400">Total:</span>
            <span className="font-bold text-white">{totalPages}</span>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">{activeCount} Live</span>
          </div>
          {disabledCount > 0 && (
            <div className="bg-rose-950/60 border border-rose-800/80 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="font-bold">{disabledCount} Hidden</span>
            </div>
          )}

          {/* Quick Header Apply Button */}
          <button
            onClick={handleApplyAllLive}
            disabled={applyingAll}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs px-4 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer ml-1"
            title="Apply all visibility settings immediately to the live website"
          >
            {applyingAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Apply Changes Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("directory")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === "directory"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Pages Directory & Checkbox Visibility ({totalPages})</span>
        </button>

        <button
          onClick={() => setActiveTab("editor")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === "editor"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Visual WYSIWYG Canvas Editor ({currentPage?.pageName || selectedSlug})</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: ALL PAGES DIRECTORY WITH ONE-CLICK CHECKBOX
         ======================================================== */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Bulk Actions & Apply Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-amber-500/20 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1 mr-1">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Preset:</span>
              </span>
              <button
                onClick={() => handleBulkSetAll(true)}
                className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-200 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer hover:border-emerald-500"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enable All Pages (38 Live)</span>
              </button>
              <button
                onClick={() => handleBulkSetAll(false)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer hover:border-slate-500"
              >
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Disable All</span>
              </button>
            </div>

            <button
              onClick={handleApplyAllLive}
              disabled={applyingAll}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer border border-amber-300"
            >
              {applyingAll ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Applying Live Changes...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>⚡ Apply Changes Live to Website</span>
                </>
              )}
            </button>
          </div>

          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search page name, slug or path..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pages Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectoryPages.map((page) => {
              const isEnabled = visibilityMap[page.slug] !== false;
              const isBusy = togglingSlug === page.slug;

              return (
                <div
                  key={page.slug}
                  className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isEnabled
                      ? "bg-slate-950/90 border-slate-800 hover:border-slate-700 shadow-md"
                      : "bg-rose-950/20 border-rose-900/40 shadow-inner"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 inline-block mb-1">
                          {page.category}
                        </span>
                        <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
                          <span>{page.name}</span>
                        </h3>
                      </div>

                      {/* Checkbox Status Badge */}
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border flex items-center space-x-1 shrink-0 ${
                          isEnabled
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isEnabled ? "bg-emerald-400" : "bg-rose-400"
                          }`}
                        />
                        <span>{isEnabled ? "Live" : "Hidden"}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{page.description}</p>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800/80 truncate">
                      {page.path}
                    </div>
                  </div>

                  {/* Actions: Checkbox Button & Edit Button */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <label
                      className={`cursor-pointer inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold select-none transition-all ${
                        isBusy
                          ? "opacity-50 pointer-events-none"
                          : isEnabled
                          ? "bg-emerald-950/80 hover:bg-emerald-900/80 border-emerald-700 text-emerald-200"
                          : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={(e) =>
                          handleToggleVisibility(page.slug, e.target.checked, page.name)
                        }
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-950 border-slate-700 cursor-pointer accent-emerald-500"
                      />
                      <span>{isEnabled ? "Enabled (Visible)" : "Disabled (Hidden)"}</span>
                    </label>

                    <div className="flex items-center space-x-1">
                      <Link
                        href={page.path}
                        target="_blank"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => {
                          handleSelectPage(page.slug);
                          setActiveTab("editor");
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Open Canvas Editor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: INTERACTIVE LIVE WYSIWYG CANVAS STUDIO
         ======================================================== */}
      {activeTab === "editor" && (
        <div className="space-y-4">
          {/* Quick Page Selector Bar */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Switch Page Canvas:</span>
              </span>
              <select
                value={selectedSlug}
                onChange={(e) => handleSelectPage(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {categories.filter((c) => c !== "ALL").map((cat) => (
                  <optgroup key={cat} label={cat.toUpperCase()} className="bg-slate-950 text-amber-400 font-bold">
                    {ALL_SITE_PAGES.filter((p) => p.category === cat).map((p) => (
                      <option key={p.slug} value={p.slug} className="bg-slate-900 text-white font-normal">
                        {p.name} ({p.path})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Visibility:</span>
              <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-slate-900 px-3 py-1 rounded-xl border border-slate-700 text-white font-bold">
                <input
                  type="checkbox"
                  checked={currentPage?.isPublished !== false}
                  onChange={(e) => {
                    if (!currentPage) return;
                    const newStatus = e.target.checked;
                    setCurrentPage({ ...currentPage, isPublished: newStatus });
                    handleToggleVisibility(currentPage.slug, newStatus, currentPage.pageName);
                  }}
                  className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                />
                <span className={currentPage?.isPublished !== false ? "text-emerald-400" : "text-rose-400"}>
                  {currentPage?.isPublished !== false ? "Live & Published" : "Hidden (Disabled)"}
                </span>
              </label>
            </div>
          </div>

          {!currentPage ? (
            <div className="py-24 text-center space-y-3 bg-slate-950 rounded-3xl border border-slate-800">
              <Loader2 className="w-9 h-9 animate-spin text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400 font-semibold">Loading interactive canvas workspace...</p>
            </div>
          ) : (
            <VisualCanvasEditor
              key={currentPage.slug || selectedSlug}
              page={currentPage}
              onChange={(updated) => setCurrentPage(updated)}
              onSave={handleSavePage}
              saving={saving}
              savedSuccess={savedSuccess}
              onUploadImage={handleUploadImageFile}
            />
          )}
        </div>
      )}
    </div>
  );
}
