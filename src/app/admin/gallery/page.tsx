"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  Upload,
  Link as LinkIcon,
  ArrowLeft,
  Save,
  Search,
  Sparkles,
  AlertTriangle,
  FolderPlus,
  Star,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface GalleryPhotoItem {
  id?: string;
  url: string;
  title?: string;
  caption?: string;
  type?: string;
  sortOrder?: number;
}

interface AlbumGroup {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  description?: string | null;
  isFeatured: boolean;
  items: GalleryPhotoItem[];
  createdAt?: string;
}

const CATEGORIES = [
  "Campus",
  "Sports",
  "Annual Day",
  "Science & Robotics",
  "Excursions",
  "Celebrations",
  "Academics",
];

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<AlbumGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"LIST" | "EDITOR">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Multi-upload state
  const [uploadingBatch, setUploadingBatch] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const batchFileInputRef = useRef<HTMLInputElement | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Campus",
    coverImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
    description: "",
    isFeatured: false,
    items: [] as GalleryPhotoItem[],
  });

  const [urlInput, setUrlInput] = useState("");

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.albums) setAlbums(data.albums);
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "Campus",
      coverImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
      description: "",
      isFeatured: false,
      items: [],
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (alb: AlbumGroup) => {
    setEditingId(alb.id);
    setFormData({
      title: alb.title,
      category: alb.category || "Campus",
      coverImage: alb.coverImage || "",
      description: alb.description || "",
      isFeatured: alb.isFeatured,
      items: (alb.items || []).map((it, idx) => ({ ...it, sortOrder: it.sortOrder ?? idx + 1 })),
    });
    setViewMode("EDITOR");
  };

  // Upload Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) {
        setFormData((prev) => ({ ...prev, coverImage: json.url }));
      }
    } catch (err) {
      console.error("Cover upload error:", err);
    }
  };

  // Multi-Image Batch Upload
  const handleBatchImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingBatch(true);
    const total = files.length;
    setUploadProgress({ current: 0, total });

    const newUploadedItems: GalleryPhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) {
          newUploadedItems.push({
            id: `photo_${Date.now()}_${i}`,
            url: json.url,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            caption: "",
            type: "IMAGE",
            sortOrder: formData.items.length + newUploadedItems.length + 1,
          });
        }
      } catch (err) {
        console.error("Batch upload failed for file:", file.name, err);
      }
      setUploadProgress({ current: i + 1, total });
    }

    setFormData((prev) => {
      const combined = [...prev.items, ...newUploadedItems];
      // If cover is default placeholder, set first uploaded image as cover
      const newCover =
        prev.coverImage.includes("unsplash") && newUploadedItems.length > 0
          ? newUploadedItems[0].url
          : prev.coverImage;
      return {
        ...prev,
        coverImage: newCover,
        items: combined,
      };
    });

    setUploadingBatch(false);
    setUploadProgress(null);
    if (batchFileInputRef.current) batchFileInputRef.current.value = "";
  };

  // Add Single URL Image
  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    const newItem: GalleryPhotoItem = {
      id: `photo_${Date.now()}`,
      url: urlInput.trim(),
      title: "Campus Photo",
      caption: "",
      type: "IMAGE",
      sortOrder: formData.items.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setUrlInput("");
  };

  // Remove Photo from Group
  const handleRemovePhoto = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // Update Photo metadata
  const handleUpdatePhoto = (idx: number, updates: Partial<GalleryPhotoItem>) => {
    setFormData((prev) => {
      const items = [...prev.items];
      if (!items[idx]) return prev;
      items[idx] = { ...items[idx], ...updates };
      return { ...prev, items };
    });
  };

  // Move Photo Left / Right
  const handleMovePhoto = (idx: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= formData.items.length) return;
    setFormData((prev) => {
      const items = [...prev.items];
      const [moved] = items.splice(idx, 1);
      items.splice(targetIdx, 0, moved);
      return { ...prev, items };
    });
  };

  // Set as Cover
  const handleSetAsCover = (url: string) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  // Save Album & All Images to Database
  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter an Album / Group Title.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        coverImage: formData.coverImage,
        description: formData.description,
        isFeatured: formData.isFeatured,
        items: formData.items,
      };

      if (editingId) {
        const res = await fetch(`/api/gallery/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setSavedToast(true);
          setTimeout(() => {
            setSavedToast(false);
            setViewMode("LIST");
            fetchAlbums();
          }, 1200);
        } else {
          alert(json.error || "Failed to update album");
        }
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setSavedToast(true);
          setTimeout(() => {
            setSavedToast(false);
            setViewMode("LIST");
            fetchAlbums();
          }, 1200);
        } else {
          alert(json.error || "Failed to create album");
        }
      }
    } catch (err) {
      console.error("Save album error:", err);
      alert("Network error while saving album.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Album
  const handleDeleteAlbum = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setAlbums((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) setViewMode("LIST");
      } else {
        alert(json.error || "Failed to delete album");
      }
    } catch (err) {
      console.error("Delete album error:", err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredAlbums = albums.filter((alb) => {
    const matchesSearch =
      alb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alb.description && alb.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === "ALL" || alb.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={coverFileInputRef}
        onChange={handleCoverUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={batchFileInputRef}
        onChange={handleBatchImageUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ImageIcon className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Photo Gallery & Albums Studio
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Create photo groups, upload batch images, and organize campus memories with interactive lightbox.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {viewMode === "LIST" ? (
            <>
              <Link
                href="/gallery"
                target="_blank"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Gallery</span>
              </Link>
              <button
                type="button"
                onClick={openCreateEditor}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-lg transition-all cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                <span>+ Create Album Group</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Albums</span>
            </button>
          )}
        </div>
      </div>

      {/* TOAST SUCCESS NOTIFICATION */}
      {savedToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-emerald-500 text-slate-950 px-6 py-3 rounded-2xl shadow-2xl font-extrabold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 stroke-[3]" />
          <span>Album & Photos Saved Successfully!</span>
        </div>
      )}

      {/* VIEW 1: ALBUMS / GROUPS LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
              {["ALL", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-slate-950 shadow"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search albums..."
                className="w-full bg-slate-950 pl-9 pr-3 py-1.5 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Albums Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-xs">Loading albums and photos...</p>
            </div>
          ) : filteredAlbums.length === 0 ? (
            <div className="bg-slate-900/50 rounded-3xl p-12 border border-slate-800 text-center space-y-4">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-white">No Photo Groups Found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Create your first photo album (e.g. Annual Day, Sports Meet, Robotics Fest) and upload high-resolution campus photos.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateEditor}
                className="px-5 py-2.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Group & Upload Photos</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((alb) => (
                <div
                  key={alb.id}
                  className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl hover:border-amber-400/60 transition-all flex flex-col justify-between group"
                >
                  {/* Album Cover */}
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={alb.coverImage}
                      alt={alb.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-amber-400 border border-slate-700 uppercase tracking-wider backdrop-blur-sm">
                        {alb.category}
                      </span>
                      {alb.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>

                    {/* Photo Count Badge */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/90 text-white px-2.5 py-1 rounded-xl text-[11px] font-bold border border-slate-800 flex items-center space-x-1 backdrop-blur-sm">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>{alb.items?.length || 0} Photos</span>
                    </div>
                  </div>

                  {/* Album Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white line-clamp-1">{alb.title}</h3>
                      {alb.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {alb.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => openEditEditor(alb)}
                        className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400 text-amber-400 hover:text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Upload / Edit Photos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(alb.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Delete Album"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: GROUP / ALBUM EDITOR & MULTI-IMAGE UPLOADER */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveAlbum} className="space-y-8">
          {/* STEP 1: GROUP INFO */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center space-x-2 text-amber-400 border-b border-slate-800 pb-3">
              <FolderPlus className="w-5 h-5" />
              <h2 className="text-base font-extrabold text-white">
                Step 1: Group / Album Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cover Image Column */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Album Cover Photo</label>
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group/cover">
                  <img
                    src={formData.coverImage}
                    alt="Album Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Title, Category & Description */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Group / Album Title <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Annual Sports Meet 2025"
                      className="w-full bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Short Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the event, celebrations or campus activities..."
                    className="w-full bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <label className="inline-flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-950 border-slate-800"
                  />
                  <span>Feature this album on homepage highlights</span>
                </label>
              </div>
            </div>
          </div>

          {/* STEP 2: UPLOAD MULTIPLE IMAGES INTO THIS GROUP */}
          <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 text-amber-400">
                  <Layers className="w-5 h-5" />
                  <h2 className="text-base font-extrabold text-white">
                    Step 2: Upload Images to "{formData.title || "This Group"}" ({formData.items.length} Photos)
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select and upload multiple photos at once. Add captions and arrange display order.
                </p>
              </div>

              {/* Multi-upload buttons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => batchFileInputRef.current?.click()}
                  disabled={uploadingBatch}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {uploadingBatch ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        Uploading ({uploadProgress?.current}/{uploadProgress?.total})...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>+ Batch Upload Photos</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick URL Adder */}
            <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
              <LinkIcon className="w-4 h-4 text-slate-500 ml-2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste direct image URL (https://images.unsplash.com/...)"
                className="flex-1 bg-transparent px-2 py-1 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl cursor-pointer"
              >
                Add URL Photo
              </button>
            </div>

            {/* Photos List Grid */}
            {formData.items.length === 0 ? (
              <div className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  No photos in this group yet. Click <strong>+ Batch Upload Photos</strong> above to add multiple images.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {formData.items.map((photo, pIdx) => {
                  const isCover = formData.coverImage === photo.url;
                  return (
                    <div
                      key={photo.id || pIdx}
                      className="bg-slate-950 rounded-2xl border border-slate-800 p-2.5 space-y-2 relative group/item hover:border-amber-400/60 transition-all"
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900">
                        <img
                          src={photo.url}
                          alt={photo.title || `Photo ${pIdx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {isCover && (
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
                            ★ Cover
                          </span>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(pIdx, "left")}
                            disabled={pIdx === 0}
                            className="p-1 text-white hover:text-amber-400 disabled:opacity-20"
                            title="Move Left"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetAsCover(photo.url)}
                            className="p-1 text-white hover:text-amber-400"
                            title="Set as Album Cover"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(pIdx, "right")}
                            disabled={pIdx === formData.items.length - 1}
                            className="p-1 text-white hover:text-amber-400 disabled:opacity-20"
                            title="Move Right"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(pIdx)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Photo Caption / Title */}
                      <input
                        type="text"
                        value={photo.title || ""}
                        onChange={(e) => handleUpdatePhoto(pIdx, { title: e.target.value })}
                        placeholder={`Photo #${pIdx + 1} Caption...`}
                        className="w-full bg-transparent text-[11px] text-slate-300 focus:outline-none border-b border-dashed border-transparent hover:border-slate-700 truncate"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTTOM SUBMIT BAR */}
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("LIST")}
              className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || uploadingBatch}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xl flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Album & Photos...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Album & All Photos</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Photo Album?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this album and all its associated photos from the database? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteAlbum(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Album</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
