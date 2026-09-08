"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
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
  Mail,
  GraduationCap,
  Briefcase,
} from "lucide-react";

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string;
  email?: string | null;
  photoUrl: string;
  bio?: string | null;
  isLeadership: boolean;
}

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"LIST" | "EDITOR">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "Sciences",
    qualification: "",
    experience: "",
    email: "",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    bio: "",
    isLeadership: false,
  });

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/faculty");
      const data = await res.json();
      if (data.faculty) setFaculty(data.faculty);
    } catch (err) {
      console.error("Failed to load faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      name: "",
      designation: "",
      department: "Sciences",
      qualification: "",
      experience: "",
      email: "",
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      bio: "",
      isLeadership: false,
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (f: FacultyMember) => {
    setEditingId(f.id);
    setFormData({
      name: f.name,
      designation: f.designation,
      department: f.department,
      qualification: f.qualification,
      experience: f.experience,
      email: f.email || "",
      photoUrl: f.photoUrl || "",
      bio: f.bio || "",
      isLeadership: f.isLeadership,
    });
    setViewMode("EDITOR");
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (json.url) {
        setFormData((prev) => ({ ...prev, photoUrl: json.url }));
      }
    } catch (err) {
      console.error("Photo upload error:", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      alert("Faculty name and designation are required.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      if (editingId) {
        const res = await fetch(`/api/faculty/${editingId}`, {
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
            fetchFaculty();
          }, 1200);
        } else {
          alert(json.error || "Failed to update faculty member");
        }
      } else {
        const res = await fetch("/api/faculty", {
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
            fetchFaculty();
          }, 1200);
        } else {
          alert(json.error || "Failed to add faculty member");
        }
      }
    } catch (err) {
      console.error("Save faculty error:", err);
      alert("Error saving faculty to database.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/faculty/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setFaculty((prev) => prev.filter((f) => f.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) setViewMode("LIST");
      } else {
        alert(json.error || "Failed to delete faculty member");
      }
    } catch (err) {
      console.error("Delete faculty error:", err);
      alert("Error deleting faculty from database.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredFaculty = faculty.filter((f) => {
    const matchDept = selectedDepartment === "ALL" || f.department === selectedDepartment;
    const matchSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Faculty & Department Directory Studio
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Manage teacher profiles, academic qualifications, leadership designations, and portrait photos in full workspace.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "EDITOR" ? (
            <button
              onClick={() => setViewMode("LIST")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
          ) : (
            <button
              onClick={openCreateEditor}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Faculty in Full Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL WORKSPACE FACULTY EDITOR */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveFaculty} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? "✏️ Edit Faculty Profile" : "✨ Add New Teacher Profile"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {formData.name ? `${formData.name} — ${formData.designation || "Faculty"}` : "New Faculty Member"}
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
                    <span>Delete Profile</span>
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
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingId ? "Save Changes" : "Publish Faculty Profile"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Faculty Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Priyanka Jamwal"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principal / PGT Mathematics / HOD Sciences"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3.5 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Administration">🏛️ Administration & Leadership</option>
                      <option value="Sciences">🧪 Physics, Chem, Bio</option>
                      <option value="Mathematics">📐 Mathematics & Stats</option>
                      <option value="Humanities">🌍 Humanities & Social Sciences</option>
                      <option value="Languages">📖 English & Hindi</option>
                      <option value="Computer Science">💻 CS, AI & Robotics</option>
                      <option value="Sports">⚽ Sports & Physical Education</option>
                      <option value="Performing Arts">🎭 Music & Performing Arts</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Qualifications *</label>
                    <input
                      type="text"
                      placeholder="e.g. BSc. (Hons), MSc. BEd, PhD"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 15+ Years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      placeholder="teacher@cismandi.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Leadership Team</label>
                    <div className="pt-2.5">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isLeadership}
                          onChange={(e) => setFormData({ ...formData, isLeadership: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-400"
                        />
                        <span className="font-bold text-amber-400">Pin to Leadership & Principal Desk</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 uppercase tracking-wider">Teacher Biography</label>
                  <textarea
                    rows={6}
                    placeholder="Pedagogical philosophy, achievements, research publications, and subject specializations..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-slate-950 text-white p-4 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none leading-relaxed text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Portrait Photo Studio */}
              <div className="lg:col-span-5 space-y-5 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-black text-sm text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Faculty Portrait Studio</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload teacher photograph or provide image URL.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-semibold text-slate-300">Upload Portrait</label>
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-400 text-[11px]">Or Photo Link / URL:</label>
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="w-full bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 font-mono text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                    {formData.photoUrl ? (
                      <img
                        src={formData.photoUrl}
                        alt="Faculty Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-500 italic">No portrait selected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* VIEW 2: FACULTY LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teachers by name or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {["ALL", "Administration", "Sciences", "Mathematics", "Humanities", "Languages", "Computer Science", "Sports"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedDepartment === dept
                      ? "bg-school-secondary text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-950 animate-pulse rounded-2xl border border-slate-800" />
              ))
            ) : filteredFaculty.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-white">No Faculty Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Add Faculty in Full Workspace' to add your teachers and academic leadership.
                </p>
              </div>
            ) : (
              filteredFaculty.map((f) => (
                <div
                  key={f.id}
                  className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
                >
                  <div className="relative h-56 bg-slate-900">
                    <img
                      src={f.photoUrl}
                      alt={f.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 bg-school-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      {f.department}
                    </span>
                    {f.isLeadership && (
                      <span className="absolute top-2.5 right-2.5 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                        Leadership
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-white">{f.name}</h3>
                      <p className="text-xs font-semibold text-amber-400">{f.designation}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{f.qualification} • {f.experience}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditEditor(f)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                      >
                        <Edit3 className="w-3 h-3 text-school-secondary" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(f.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                        title="Delete Faculty Member"
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
              <h3 className="text-base font-bold text-white">Delete Faculty Member?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this faculty profile from the school directory and database?
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
                onClick={() => handleDeleteFaculty(deleteConfirmId)}
                disabled={deleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{deleting ? "Deleting..." : "Yes, Delete Profile"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
