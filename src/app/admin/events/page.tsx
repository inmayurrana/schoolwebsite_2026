"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Clock,
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
import { formatDate } from "@/lib/utils";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  venue: string;
  startDate: string;
  endDate?: string | null;
  category: string;
  coverImage: string;
  mediaType?: "IMAGE" | "VIDEO";
  videoUrl?: string | null;
  isPublished: boolean;
}

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
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
    title: "",
    description: "",
    venue: "Main Auditorium, CIS Mandi",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: "",
    category: "Academic",
    mediaType: "IMAGE" as "IMAGE" | "VIDEO",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
    videoUrl: "",
    isPublished: true,
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      venue: "Main Auditorium, CIS Mandi",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: "",
      category: "Academic",
      mediaType: "IMAGE",
      coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
      videoUrl: "",
      isPublished: true,
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (ev: EventItem) => {
    setEditingId(ev.id);
    setFormData({
      title: ev.title,
      description: ev.description,
      venue: ev.venue,
      startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 16) : "",
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : "",
      category: ev.category,
      mediaType: ev.mediaType === "VIDEO" ? "VIDEO" : "IMAGE",
      coverImage: ev.coverImage || "",
      videoUrl: ev.videoUrl || "",
      isPublished: ev.isPublished,
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
      console.error("Upload error:", err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startDate) {
      alert("Event title and start date are required.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      if (editingId) {
        const res = await fetch(`/api/events/${editingId}`, {
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
            fetchEvents();
          }, 1200);
        } else {
          alert(json.error || "Failed to update event");
        }
      } else {
        const res = await fetch("/api/events", {
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
            fetchEvents();
          }, 1200);
        } else {
          alert(json.error || "Failed to create event");
        }
      }
    } catch (err) {
      console.error("Save event error:", err);
      alert("Error saving event to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) setViewMode("LIST");
      } else {
        alert(json.error || "Failed to delete event");
      }
    } catch (err) {
      console.error("Delete event error:", err);
      alert("Error deleting event from database.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchCat = selectedCategory === "ALL" || ev.category === selectedCategory;
    const matchSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const ytId = extractYouTubeId(formData.videoUrl);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <CalendarIcon className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Events & Academic Calendar Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Schedule competitions, annual functions, sports meets, and parent-teacher orientations in full work area.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "EDITOR" ? (
            <button
              onClick={() => setViewMode("LIST")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Calendar</span>
            </button>
          ) : (
            <button
              onClick={openCreateEditor}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Schedule Event in Full Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL WORKSPACE EVENT EDITOR */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveEvent} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? "✏️ Edit Event Details" : "✨ Schedule New School Event"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {formData.title || "Untitled School Event"}
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
                    <span>Delete Event</span>
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
                      <span>Saving Event...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingId ? "Save Changes" : "Publish Event"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Athletic Meet & Torch Relay 2025"
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
                      <option value="Academic">📚 Academic & Exams</option>
                      <option value="Sports">⚽ Sports & Athletics</option>
                      <option value="Cultural">🎭 Cultural & Annual Fest</option>
                      <option value="Competition">🏆 Olympiad & Competition</option>
                      <option value="Celebration">🎉 National Celebrations</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Venue / Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Main Auditorium / Olympic Synthetic Turf"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Start Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">End Date & Time (Optional)</label>
                    <input
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Description & Agenda *</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Provide event overview, schedule, student reporting time, and chief guest details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none leading-relaxed text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Media Studio (5 Cols) */}
              <div className="lg:col-span-5 space-y-5 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-black text-sm text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Event Media Studio</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload event poster or video preview clip.
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
                    <span>Poster Image</span>
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
                    <span>Video Teaser</span>
                  </button>
                </div>

                {formData.mediaType === "IMAGE" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="font-semibold text-slate-300">Upload Poster File</label>
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingMedia ? "Uploading..." : "Upload Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload(e, "IMAGE")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 text-[11px]">Or Image Link:</label>
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                      {formData.coverImage ? (
                        <img
                          src={formData.coverImage}
                          alt="Poster Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-500 flex items-center justify-center h-full italic">
                          No poster selected
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

      {/* VIEW 2: EVENTS LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events by title or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {["ALL", "Academic", "Sports", "Cultural", "Competition", "Celebration"].map((cat) => (
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
                <div key={i} className="h-72 bg-slate-950 animate-pulse rounded-2xl border border-slate-800" />
              ))
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3">
                <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-white">No Events Scheduled</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Schedule Event in Full Workspace' to add your first school function.
                </p>
              </div>
            ) : (
              filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
                >
                  <div className="relative h-48 bg-slate-900">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-school-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {ev.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(ev.startDate)}</span>
                      </div>
                      <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">{ev.title}</h3>
                      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-school-secondary" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-emerald-400 font-bold">● Scheduled</span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditEditor(ev)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                        >
                          <Edit3 className="w-3 h-3 text-school-secondary" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(ev.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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
              <h3 className="text-base font-bold text-white">Delete Event?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this event from the calendar and database?
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
                onClick={() => handleDeleteEvent(deleteConfirmId)}
                disabled={deleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{deleting ? "Deleting..." : "Yes, Delete Event"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
