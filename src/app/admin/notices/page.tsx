"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  Link as LinkIcon,
  ArrowLeft,
  Save,
  Search,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Eye,
  Sliders,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NoticeItem {
  id: string;
  text: string;
  link: string;
  badge: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

const BADGE_PRESETS = [
  "Notice Board",
  "Admissions 2025-26",
  "Olympiad & Laurels",
  "Urgent Alert",
  "CBSE Compliance",
  "Examination Datesheet",
  "Campus Event",
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"LIST" | "EDITOR">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [formData, setFormData] = useState({
    text: "",
    link: "/news",
    badge: "Notice Board",
    priority: 10,
    isActive: true,
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notices?all=true");
      const data = await res.json();
      if (data.notices) setNotices(data.notices);
    } catch (err) {
      console.error("Failed to load notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      text: "",
      link: "/news",
      badge: "Notice Board",
      priority: 10,
      isActive: true,
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (n: NoticeItem) => {
    setEditingId(n.id);
    setFormData({
      text: n.text,
      link: n.link,
      badge: n.badge,
      priority: n.priority,
      isActive: n.isActive,
    });
    setViewMode("EDITOR");
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      alert("Notice text is required.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      if (editingId) {
        const res = await fetch(`/api/notices/${editingId}`, {
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
            fetchNotices();
          }, 1200);
        } else {
          alert(json.error || "Failed to update notice");
        }
      } else {
        const res = await fetch("/api/notices", {
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
            fetchNotices();
          }, 1200);
        } else {
          alert(json.error || "Failed to create notice");
        }
      }
    } catch (err) {
      console.error("Save notice error:", err);
      alert("Error saving notice to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        setDeleteConfirmId(null);
        if (editingId === id) setViewMode("LIST");
      } else {
        alert(json.error || "Failed to delete notice");
      }
    } catch (err) {
      console.error("Delete notice error:", err);
      alert("Error communicating with server.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    try {
      for (const id of selectedIds) {
        await fetch(`/api/notices/${id}`, { method: "DELETE" });
      }
      setNotices((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
      setSelectedIds([]);
      setShowBulkConfirm(false);
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("Error deleting notices.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotices.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredNotices = notices.filter((n) => {
    return (
      n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.link.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Bell className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Notice Board & Marquee Alerts Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Publish live scrolling notices, urgent campus alerts, admissions flash tickers, and destination links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && viewMode === "LIST" && (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors animate-in fade-in"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          {viewMode === "EDITOR" ? (
            <button
              onClick={() => setViewMode("LIST")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Notices</span>
            </button>
          ) : (
            <button
              onClick={openCreateEditor}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Notice in Full Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL WORKSPACE NOTICE EDITOR */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveNotice} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? "✏️ Edit Notice Ticker Alert" : "✨ Publish New Scrolling Notice"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1">
                  {formData.text || "Untitled Notice Alert"}
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
                    <span>Delete Notice</span>
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
                      <span>Saving Notice...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingId ? "Save Changes" : "Publish Notice Live"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Notice Text Announcement *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. 🌟 Admissions Open for Session 2025-2026: Nursery to Grade XI (Science, Commerce, Humanities)"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 text-sm font-semibold focus:border-amber-400 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Target Link / URL *</label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="/admissions/apply, /news, or https://..."
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full bg-slate-950 text-white pl-9 pr-3 py-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Notice Board / Urgent Alert"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Badge Presets */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 font-medium">Quick Badge Categories:</span>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setFormData({ ...formData, badge: preset })}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          formData.badge === preset
                            ? "bg-amber-400 text-slate-950 border-amber-300 font-bold shadow"
                            : "bg-slate-950 text-slate-400 hover:text-white border-slate-800"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Display Priority (Higher = First)</label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Publication Status</label>
                    <div className="pt-2.5">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500"
                        />
                        <span className="font-bold text-emerald-400">Active (Live in Ticker)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Marquee Preview Studio */}
              <div className="lg:col-span-5 space-y-5 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="font-black text-sm text-white flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Live Notice Board Preview</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Simulated rendering in the school top marquee ticker bar.
                    </p>
                  </div>

                  {/* Simulated Ticker Bar */}
                  <div className="p-3 bg-gradient-to-r from-school-primary via-blue-950 to-school-primary rounded-xl border border-slate-700 shadow-xl space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                        {formData.badge || "Notice"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-white font-medium text-xs">
                      <span>{formData.text || "Your notice announcement will scroll here..."}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Target Link: {formData.link}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-white font-bold text-xs">💡 Quick Navigation Tip:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Visitors clicking this scrolling notice on the home page or header will automatically be routed to <code className="text-amber-400 font-mono">{formData.link || "/news"}</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* VIEW 2: NOTICES DIRECTORY LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notices by text, badge, or link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">
                Total: {filteredNotices.length} Notices
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="p-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredNotices.length > 0 &&
                        selectedIds.length === filteredNotices.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded text-school-secondary cursor-pointer"
                    />
                  </th>
                  <th className="p-3.5 font-bold">Badge & Announcement Text</th>
                  <th className="p-3.5 font-bold">Target Destination URL</th>
                  <th className="p-3.5 font-bold">Priority</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading notice ticker alerts...
                    </td>
                  </tr>
                ) : filteredNotices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No notices created yet. Click 'Add Notice in Full Workspace' to post announcements.
                    </td>
                  </tr>
                ) : (
                  filteredNotices.map((n) => {
                    const isSelected = selectedIds.includes(n.id);
                    return (
                      <tr
                        key={n.id}
                        className={`transition-colors ${
                          isSelected ? "bg-slate-900/90" : "hover:bg-slate-900/50"
                        }`}
                      >
                        <td className="p-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(n.id)}
                            className="w-4 h-4 rounded text-school-secondary cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 space-y-1 max-w-md">
                          <span className="bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                            {n.badge}
                          </span>
                          <p className="font-semibold text-white text-xs leading-snug">{n.text}</p>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-blue-400">
                          <a
                            href={n.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center space-x-1"
                          >
                            <span>{n.link}</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="p-3.5 font-mono text-slate-400 font-bold">
                          {n.priority}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-bold text-[11px] ${
                              n.isActive ? "text-emerald-400" : "text-slate-500"
                            }`}
                          >
                            {n.isActive ? "● Active" : "○ Inactive"}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => openEditEditor(n)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                            >
                              <Edit3 className="w-3 h-3 text-school-secondary" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(n.id)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                              title="Delete Notice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Notice Alert?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this notice announcement from the marquee ticker and database?
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
                onClick={() => handleDeleteSingle(deleteConfirmId)}
                disabled={deleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{deleting ? "Deleting..." : "Yes, Delete Notice"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Delete {selectedIds.length} Notices?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete all {selectedIds.length} selected notices from the marquee ticker?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowBulkConfirm(false)}
                disabled={bulkDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {bulkDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{bulkDeleting ? `Deleting ${selectedIds.length}...` : `Yes, Delete ${selectedIds.length} Notices`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
