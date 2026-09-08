"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Sparkles,
  CheckCircle2,
  X,
  Loader2,
  Image as ImageIcon,
  Video,
  Upload,
  Link as LinkIcon,
  Youtube,
  ArrowLeft,
  Save,
  Search,
  Calendar,
  Layers,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  mediaType?: "IMAGE" | "VIDEO";
  videoUrl?: string | null;
  category: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string;
  author?: string;
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

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"LIST" | "EDITOR">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [formData, setFormData] = useState<{
    title: string;
    excerpt: string;
    content: string;
    category: string;
    mediaType: "IMAGE" | "VIDEO";
    coverImage: string;
    videoUrl: string;
    isPublished: boolean;
    isFeatured: boolean;
  }>({
    title: "",
    excerpt: "",
    content: "",
    category: "Announcements",
    mediaType: "IMAGE",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    videoUrl: "",
    isPublished: true,
    isFeatured: false,
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.news) setNews(data.news);
    } catch (err) {
      console.error("Failed to load news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Announcements",
      mediaType: "IMAGE",
      coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      videoUrl: "",
      isPublished: true,
      isFeatured: false,
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (item: NewsItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      mediaType: item.mediaType === "VIDEO" ? "VIDEO" : "IMAGE",
      coverImage: item.coverImage || "",
      videoUrl: item.videoUrl || "",
      isPublished: item.isPublished,
      isFeatured: item.isFeatured,
    });
    setViewMode("EDITOR");
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "IMAGE" | "VIDEO") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (json.url) {
        if (type === "IMAGE") {
          setFormData((prev) => ({ ...prev, coverImage: json.url, mediaType: "IMAGE" }));
        } else {
          setFormData((prev) => ({ ...prev, videoUrl: json.url, mediaType: "VIDEO" }));
        }
      }
    } catch (err) {
      console.error("Media upload error:", err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please provide both article title and content body.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      if (editingId) {
        // Update existing article
        const res = await fetch(`/api/news/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setSavedToast(true);
          setTimeout(() => {
            setSavedToast(false);
            setViewMode("LIST");
            fetchNews();
          }, 1200);
        } else {
          alert(json.error || "Failed to update article");
        }
      } else {
        // Create new article
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setSavedToast(true);
          setTimeout(() => {
            setSavedToast(false);
            setViewMode("LIST");
            fetchNews();
          }, 1200);
        } else {
          alert(json.error || "Failed to create article");
        }
      }
    } catch (err) {
      console.error("Save article failed:", err);
      alert("Error saving article to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setNews((prev) => prev.filter((n) => n.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) {
          setViewMode("LIST");
        }
      } else {
        alert(json.error || "Failed to delete article");
      }
    } catch (err) {
      console.error("Delete article error:", err);
      alert("Error deleting article from database.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredNews = news.filter((item) => {
    const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const ytId = extractYouTubeId(formData.videoUrl);
  const vmId = !ytId ? extractVimeoId(formData.videoUrl) : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Bell className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              School Bulletins & Articles Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Create, edit, and publish news circulars with high-resolution image uploads and full-HD video streaming.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "EDITOR" ? (
            <button
              onClick={() => setViewMode("LIST")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Articles</span>
            </button>
          ) : (
            <button
              onClick={openCreateEditor}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Create Article in Full Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL WORK AREA ARTICLE EDITOR */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveArticle} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            {/* Editor Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? "✏️ Editing Existing Article" : "✨ New Article / Bulletin Studio"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {formData.title || "Untitled School Announcement"}
                </h2>
              </div>

              <div className="flex items-center space-x-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(editingId)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-bold border border-rose-800/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Article</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {savedToast ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      <span>Saved in Database!</span>
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Storage & DB...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingId ? "Update Article" : "Publish Article Now"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Two-Column Editor Layout in Full Screen Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              {/* Left Column: Article Metadata & Text Body (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Olympiad Gold Medalists & Annual Exhibition"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 text-sm font-semibold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Announcements">📢 Announcements</option>
                      <option value="Academics">📚 Academics & Curriculum</option>
                      <option value="Achievements">🏆 Achievements & Awards</option>
                      <option value="Sports">⚽ Sports & Athletics</option>
                      <option value="Cultural">🎭 Cultural & Arts</option>
                      <option value="Circulars">📋 Circulars & Notices</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Visibility Status</label>
                    <div className="flex items-center space-x-4 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500"
                        />
                        <span className="font-bold text-emerald-400">Published</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-400"
                        />
                        <span className="font-bold text-amber-400">Pin as Featured</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Short Summary / Excerpt *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief 1-2 sentence overview shown in feeds and cards..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">
                    Full Content / Article Body *
                  </label>
                  <textarea
                    rows={12}
                    required
                    placeholder="Write the complete announcement text, circular instructions, dates, achievements details, or press release..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none leading-relaxed font-sans text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Right Column: Media Studio (Images & Videos) (5 Cols) */}
              <div className="lg:col-span-5 space-y-5 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-black text-sm text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Media Studio (Image & Video)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload image/video file or paste external YouTube/image link.
                  </p>
                </div>

                {/* Media Type Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: "IMAGE" })}
                    className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg font-bold text-xs transition-all ${
                      formData.mediaType === "IMAGE"
                        ? "bg-school-secondary text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Image Media</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: "VIDEO" })}
                    className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg font-bold text-xs transition-all ${
                      formData.mediaType === "VIDEO"
                        ? "bg-amber-500 text-slate-950 shadow font-black"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Media</span>
                  </button>
                </div>

                {/* IMAGE CONFIGURATION */}
                {formData.mediaType === "IMAGE" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="font-semibold text-slate-300">Upload Image File</label>
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMedia ? "Uploading..." : "Upload from Computer"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload(e, "IMAGE")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 text-[11px]">
                        Or Direct Image Link / URL:
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Image Live Preview */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Live Preview:</span>
                      <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                        {formData.coverImage ? (
                          <img
                            src={formData.coverImage}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-slate-500 italic">No image selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* VIDEO CONFIGURATION */}
                {formData.mediaType === "VIDEO" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="font-semibold text-slate-300">Upload Video File</label>
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMedia ? "Uploading..." : "Upload MP4 / WebM"}</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg"
                          onChange={(e) => handleMediaUpload(e, "VIDEO")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 text-[11px]">
                        Or YouTube / Vimeo / Video Link:
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Video Live Preview */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Live Video Preview:</span>
                      <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                        {ytId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0&controls=1&rel=0`}
                            title="YouTube Preview"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : vmId ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${vmId}`}
                            title="Vimeo Preview"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : formData.videoUrl ? (
                          <video
                            src={formData.videoUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-slate-500 italic">No video link provided</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* VIEW 2: ARTICLES & BULLETINS DIRECTORY LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {[
                "ALL",
                "Announcements",
                "Academics",
                "Achievements",
                "Sports",
                "Cultural",
                "Circulars",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === cat
                      ? "bg-school-secondary text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-72 bg-slate-950 animate-pulse rounded-2xl border border-slate-800" />
              ))
            ) : filteredNews.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3">
                <Bell className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-white">No Bulletins Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Create Article in Full Workspace' to draft your first news announcement with photos or videos.
                </p>
                <button
                  onClick={openCreateEditor}
                  className="inline-flex items-center space-x-1.5 bg-school-secondary text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Now</span>
                </button>
              </div>
            ) : (
              filteredNews.map((item) => {
                const isVideo = item.mediaType === "VIDEO" || Boolean(item.videoUrl);
                return (
                  <div
                    key={item.id}
                    className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
                  >
                    {/* Media Thumbnail */}
                    <div className="relative h-48 bg-slate-900">
                      {isVideo ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-amber-400">
                          <Video className="w-10 h-10 opacity-70" />
                          <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300">
                            Video Article
                          </span>
                        </div>
                      ) : (
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      <span className="absolute top-2.5 left-2.5 bg-school-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                        {item.category}
                      </span>
                      {item.isFeatured && (
                        <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{formatDate(item.publishedAt)}</span>
                          <span>•</span>
                          <span>{item.author || "Admin Office"}</span>
                        </div>
                        <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>

                      {/* Action Buttons: Edit in Full Work Area & Delete */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold ${item.isPublished ? "text-emerald-400" : "text-amber-400"}`}>
                          {item.isPublished ? "● Published" : "○ Draft"}
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => openEditEditor(item)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                            title="Edit in Full Workspace"
                          >
                            <Edit3 className="w-3 h-3 text-school-secondary" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Article Permanently?</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this news article? This action cannot be undone and will remove it permanently from the school website and database.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteConfirmId)}
                disabled={deleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{deleting ? "Deleting..." : "Yes, Delete Article"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
