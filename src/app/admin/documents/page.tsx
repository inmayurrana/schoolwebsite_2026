"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  X,
  Loader2,
  ArrowLeft,
  Save,
  Search,
  Sparkles,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DocItem {
  id: string;
  title: string;
  category: string;
  docNumber?: string | null;
  fileUrl: string;
  fileType: string;
  fileSize?: string | null;
  targetAudience: string;
  publishedDate: string;
  isPublic?: boolean;
}

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"LIST" | "EDITOR">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [formData, setFormData] = useState({
    title: "",
    category: "CIRCULAR",
    docNumber: "",
    fileUrl: "",
    fileSize: "1.5 MB",
    targetAudience: "ALL",
    isPublic: true,
  });

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (data.documents) setDocs(data.documents);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "CIRCULAR",
      docNumber: `CIS-DOC-${Date.now().toString().slice(-4)}`,
      fileUrl: "",
      fileSize: "1.5 MB",
      targetAudience: "ALL",
      isPublic: true,
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (doc: DocItem) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      category: doc.category,
      docNumber: doc.docNumber || "",
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize || "1.5 MB",
      targetAudience: doc.targetAudience,
      isPublic: doc.isPublic !== undefined ? doc.isPublic : true,
    });
    setViewMode("EDITOR");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (json.url) {
        setFormData((prev) => ({
          ...prev,
          fileUrl: json.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
          fileSize: json.size || `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        }));
      }
    } catch (err) {
      console.error("Document upload error:", err);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.fileUrl.trim()) {
      alert("Document title and uploaded file URL are required.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      if (editingId) {
        const res = await fetch(`/api/documents/${editingId}`, {
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
            fetchDocs();
          }, 1200);
        } else {
          alert(json.error || "Failed to update document");
        }
      } else {
        const res = await fetch("/api/documents", {
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
            fetchDocs();
          }, 1200);
        } else {
          alert(json.error || "Failed to create document");
        }
      }
    } catch (err) {
      console.error("Save document error:", err);
      alert("Error saving document to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setDocs((prev) => prev.filter((d) => d.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) setViewMode("LIST");
      } else {
        alert(json.error || "Failed to delete document");
      }
    } catch (err) {
      console.error("Delete doc error:", err);
      alert("Error deleting document from database.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredDocs = docs.filter((d) => {
    const matchCat = selectedCategory === "ALL" || d.category === selectedCategory;
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.docNumber && d.docNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Documents & Official Circulars Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Upload PDF circulars, fee structures, syllabus guides, and CBSE compliance files in full workspace.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "EDITOR" ? (
            <button
              onClick={() => setViewMode("LIST")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Documents</span>
            </button>
          ) : (
            <button
              onClick={openCreateEditor}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Upload Document in Full Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL WORKSPACE DOCUMENT EDITOR */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveDocument} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? "✏️ Edit Document Metadata" : "✨ Upload Official School Document"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {formData.title || "Untitled Document"}
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
                    <span>Delete Document</span>
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
                      <span>Saving Document...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingId ? "Save Changes" : "Publish Document"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Fee Structure & Transport Schedule 2025-26"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 text-sm font-semibold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Document Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    >
                      <option value="CIRCULAR">📢 Official Circular & Notice</option>
                      <option value="SYLLABUS">📚 Academic Syllabus & Curriculum</option>
                      <option value="DATESHEET">📅 Exam Datesheet & Time Table</option>
                      <option value="PROSPECTUS">📖 School Prospectus & Brochure</option>
                      <option value="MANDATORY_DISCLOSURE">🏛️ CBSE Mandatory Disclosure</option>
                      <option value="FORM">📝 Application & Registration Form</option>
                      <option value="BOOK_LIST">📋 Prescribed Books List</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Target Audience</label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    >
                      <option value="ALL">Public / All Visitors</option>
                      <option value="PARENTS">Parents & Guardians</option>
                      <option value="STUDENTS">Students Only</option>
                      <option value="STAFF">Faculty & Staff</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Document / Reference Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CIS/MND/CIR/2025/084"
                    value={formData.docNumber || ""}
                    onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* PDF & File Uploader Studio */}
              <div className="lg:col-span-5 space-y-5 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-black text-sm text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>File Storage & Verification</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload PDF file or provide direct storage URL.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-semibold text-slate-300">Upload PDF / File *</label>
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingFile ? "Uploading to Storage..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xlsx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-400 text-[11px]">Storage URL:</label>
                    <input
                      type="text"
                      required
                      placeholder="/uploads/... or https://..."
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {formData.fileUrl && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">Verified Upload</span>
                        <span className="text-[10px] text-slate-400 font-mono">{formData.fileSize}</span>
                      </div>
                      <a
                        href={formData.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Uploaded PDF File</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* VIEW 2: DOCUMENTS LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search documents by title or ref #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {["ALL", "CIRCULAR", "SYLLABUS", "DATESHEET", "PROSPECTUS", "MANDATORY_DISCLOSURE", "FORM"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedCategory === cat
                      ? "bg-school-secondary text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {cat.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-44 bg-slate-950 animate-pulse rounded-2xl border border-slate-800" />
              ))
            ) : filteredDocs.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-white">No Documents Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Upload Document in Full Workspace' to upload circulars, syllabus files, and datesheets.
                </p>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-school-secondary/20 text-school-secondary border border-school-secondary/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {doc.category.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatDate(doc.publishedDate)}</span>
                    </div>

                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">{doc.title}</h3>
                    {doc.docNumber && (
                      <span className="text-[11px] text-amber-400/90 font-mono block">
                        Ref: {doc.docNumber}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View File</span>
                    </a>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => openEditEditor(doc)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                      >
                        <Edit3 className="w-3 h-3 text-school-secondary" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(doc.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                        title="Delete Document"
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
              <h3 className="text-base font-bold text-white">Delete Document?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this document and circular from the database?
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
                onClick={() => handleDeleteDoc(deleteConfirmId)}
                disabled={deleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{deleting ? "Deleting..." : "Yes, Delete Document"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
