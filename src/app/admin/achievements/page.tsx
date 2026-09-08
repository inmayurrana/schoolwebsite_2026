"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  Image as ImageIcon,
  Video,
  Upload,
  Link as LinkIcon,
  ArrowLeft,
  Save,
  Search,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface AchievementItem {
  id: string;
  studentName: string;
  grade: string;
  title: string;
  category: string;
  year: string;
  rank: string;
  description: string;
  photoUrl: string;
  mediaType?: "IMAGE" | "VIDEO";
  videoUrl?: string | null;
  isFeatured: boolean;
}

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
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

  const [formData, setFormData] = useState({
    studentName: "",
    grade: "Class X",
    title: "",
    category: "ACADEMIC",
    year: "2024-2025",
    rank: "1st Position",
    description: "",
    mediaType: "IMAGE" as "IMAGE" | "VIDEO",
    photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
    videoUrl: "",
    isFeatured: true,
  });

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/achievements");
      const data = await res.json();
      if (data.achievements) setAchievements(data.achievements);
    } catch (err) {
      console.error("Failed to load achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      studentName: "",
      grade: "Class X",
      title: "",
      category: "ACADEMIC",
      year: "2024-2025",
      rank: "1st Position",
      description: "",
      mediaType: "IMAGE",
      photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
      videoUrl: "",
      isFeatured: true,
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (ach: AchievementItem) => {
    setEditingId(ach.id);
    setFormData({
      studentName: ach.studentName,
      grade: ach.grade,
      title: ach.title,
      category: ach.category,
      year: ach.year,
      rank: ach.rank || "",
      description: ach.description,
      mediaType: ach.mediaType === "VIDEO" ? "VIDEO" : "IMAGE",
      photoUrl: ach.photoUrl || "",
      videoUrl: ach.videoUrl || "",
      isFeatured: ach.isFeatured,
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
          setFormData((prev) => ({ ...prev, photoUrl: json.url, mediaType: "IMAGE" }));
        } else {
          setFormData((prev) => ({ ...prev, videoUrl: json.url, mediaType: "VIDEO" }));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSaveAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.title.trim()) {
      alert("Student name and award title are required.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      if (editingId) {
        const res = await fetch(`/api/achievements/${editingId}`, {
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
            fetchAchievements();
          }, 1200);
        } else {
          alert(json.error || "Failed to update achievement");
        }
      } else {
        const res = await fetch("/api/achievements", {
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
            fetchAchievements();
          }, 1200);
        } else {
          alert(json.error || "Failed to create achievement");
        }
      }
    } catch (err) {
      console.error("Save achievement error:", err);
      alert("Error saving achievement to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setAchievements((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) setViewMode("LIST");
      } else {
        alert(json.error || "Failed to delete achievement");
      }
    } catch (err) {
      console.error("Delete achievement error:", err);
      alert("Error deleting achievement from database.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredAchievements = achievements.filter((ach) => {
    const matchCat = selectedCategory === "ALL" || ach.category === selectedCategory;
    const matchSearch =
      ach.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const ytId = extractYouTubeId(formData.videoUrl);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Hall of Fame & Student Laurels Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Publish academic Olympiad honors, national sports gold medals, and robotics championships in full workspace.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "EDITOR" ? (
            <button
              onClick={() => setViewMode("LIST")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Laurels</span>
            </button>
          ) : (
            <button
              onClick={openCreateEditor}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Laurels in Full Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL WORKSPACE EDITOR */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveAchievement} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? "✏️ Edit Student Achievement" : "✨ Record Student Laurel / Award"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {formData.studentName ? `${formData.studentName} — ${formData.title}` : "New Student Award"}
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
                    <span>Delete Laurel</span>
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
                      <span>Saving Laurel...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingId ? "Save Changes" : "Publish to Hall of Fame"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Student / Team Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma & CIS Robotics Team"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Class / Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. Grade X-A / Senior Secondary"
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Award / Honor Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gold Medalist — National Science Olympiad 2024"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 text-sm font-semibold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    >
                      <option value="ACADEMIC">📚 Academic & CBSE</option>
                      <option value="OLYMPIAD">🧪 Olympiads & STEM</option>
                      <option value="SPORTS">🏆 Sports & Athletics</option>
                      <option value="ROBOTICS">🤖 Robotics & AI</option>
                      <option value="ARTS">🎭 Arts & Music</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Rank / Standing</label>
                    <input
                      type="text"
                      placeholder="e.g. 1st Position / Gold"
                      value={formData.rank}
                      onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Academic Year</label>
                    <input
                      type="text"
                      placeholder="2024-2025"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Citation / Description</label>
                  <textarea
                    rows={6}
                    placeholder="Provide details of the competition, opposing schools, certificate honors, and cash scholarship..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none leading-relaxed text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Photo & Video Media Studio */}
              <div className="lg:col-span-5 space-y-5 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-black text-sm text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Achievement Media Engine</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload student certificate photo or ceremony video link.
                  </p>
                </div>

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
                    <span>Student Photo</span>
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
                    <span>Ceremony Video</span>
                  </button>
                </div>

                {formData.mediaType === "IMAGE" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="font-semibold text-slate-300">Upload Photo File</label>
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMedia ? "Uploading..." : "Upload Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload(e, "IMAGE")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 text-[11px]">Or Photo URL:</label>
                      <input
                        type="url"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl}
                          alt="Student Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-500 flex items-center justify-center h-full italic">
                          No photo selected
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {formData.mediaType === "VIDEO" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="font-semibold text-slate-300">Upload Video</label>
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMedia ? "Uploading..." : "Upload MP4"}</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleMediaUpload(e, "VIDEO")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 text-[11px]">Or YouTube Link:</label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                      {ytId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=0&controls=1`}
                          title="YouTube Preview"
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : formData.videoUrl ? (
                        <video src={formData.videoUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-500 italic">No video link provided</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* VIEW 2: LAURELS LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search laurels by student or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {["ALL", "ACADEMIC", "OLYMPIAD", "SPORTS", "ROBOTICS", "ARTS"].map((cat) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-950 animate-pulse rounded-2xl border border-slate-800" />
              ))
            ) : filteredAchievements.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3">
                <Award className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-white">No Laurels Recorded</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Add Laurels in Full Workspace' to record student accomplishments.
                </p>
              </div>
            ) : (
              filteredAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
                >
                  <div className="relative h-48 bg-slate-900">
                    <img
                      src={ach.photoUrl}
                      alt={ach.studentName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-school-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {ach.category}
                    </span>
                    {ach.rank && (
                      <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                        {ach.rank}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-amber-400 font-bold block">{ach.grade} • {ach.year}</span>
                      <h3 className="font-bold text-sm text-white line-clamp-1 mt-0.5">{ach.studentName}</h3>
                      <p className="text-xs text-slate-300 font-semibold mt-1">{ach.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{ach.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditEditor(ach)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                      >
                        <Edit3 className="w-3 h-3 text-school-secondary" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(ach.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                        title="Delete Achievement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Student Laurel?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this student achievement record from the database?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAchievement(deleteConfirmId)}
                disabled={deleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{deleting ? "Deleting..." : "Yes, Delete Laurel"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
