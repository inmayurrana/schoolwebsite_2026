"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  Lock,
  Mail,
  Phone,
  Building,
  ArrowLeft,
  Save,
  Search,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string | null;
  permissionsJson?: string | null;
  avatar?: string | null;
  phone?: string | null;
  isActive: boolean;
  twoFactor: boolean;
  lastLogin?: string | null;
  createdAt: string;
}

const ROLES = [
  {
    key: "SUPER_ADMIN",
    label: "Super Administrator",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    desc: "Complete, unrestricted access to system settings, database backups, users, audit logs, and page studios.",
  },
  {
    key: "ADMIN",
    label: "School Administrator / Principal",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    desc: "Manages admissions, academic bulletins, mandatory disclosure, faculty directory, and campus facilities.",
  },
  {
    key: "STAFF_EDITOR",
    label: "Staff / Teacher Editor",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    desc: "Creates and publishes circulars, homework assignments, student achievements, and media albums.",
  },
  {
    key: "ADMISSIONS_OFFICER",
    label: "Admissions Officer",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    desc: "Reviews student admission applications, schedules entrance tests, and manages parent inquiries.",
  },
];

const PERMISSIONS = [
  { key: "manage_pages", label: "Page & Visual Studio Editor", category: "Content" },
  { key: "manage_news", label: "News & Bulletins Manager", category: "Content" },
  { key: "manage_gallery", label: "Media Gallery & Videos", category: "Content" },
  { key: "manage_events", label: "Events & Calendar Manager", category: "Content" },
  { key: "manage_documents", label: "Documents & Circulars Upload", category: "Content" },
  { key: "manage_disclosure", label: "CBSE Mandatory Disclosure", category: "Compliance" },
  { key: "manage_admissions", label: "Admissions Hub & Student Records", category: "Admissions" },
  { key: "manage_inquiries", label: "Parent Helpline Inquiries", category: "Inquiries" },
  { key: "manage_faculty", label: "Faculty Directory & Careers", category: "Staff" },
  { key: "manage_users", label: "User Management & RBAC Roles", category: "Security" },
  { key: "manage_theme", label: "Theme & Logo Visual Customizer", category: "Design" },
  { key: "manage_settings", label: "System Backup & Global Config", category: "System" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"LIST" | "EDITOR">("LIST");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF_EDITOR",
    department: "Academics",
    phone: "",
    isActive: true,
    permissions: [] as string[],
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateEditor = () => {
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "STAFF_EDITOR",
      department: "Academics",
      phone: "",
      isActive: true,
      permissions: ["manage_news", "manage_documents", "manage_gallery"],
    });
    setViewMode("EDITOR");
  };

  const openEditEditor = (u: UserItem) => {
    setEditingId(u.id);
    let parsedPerms: string[] = [];
    try {
      if (u.permissionsJson) parsedPerms = JSON.parse(u.permissionsJson);
    } catch (e) {}

    setFormData({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      department: u.department || "General",
      phone: u.phone || "",
      isActive: u.isActive,
      permissions: parsedPerms,
    });
    setViewMode("EDITOR");
  };

  const togglePermission = (permKey: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permKey)
          : [...prev.permissions, permKey],
      };
    });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required.");
      return;
    }
    if (!editingId && (!formData.password || formData.password.length < 6)) {
      alert("Please provide a password of at least 6 characters for the new user.");
      return;
    }

    setSubmitting(true);
    setSavedToast(false);

    try {
      if (editingId) {
        const res = await fetch(`/api/users/${editingId}`, {
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
            fetchUsers();
          }, 1200);
        } else {
          alert(json.error || "Failed to update user");
        }
      } else {
        const res = await fetch("/api/users", {
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
            fetchUsers();
          }, 1200);
        } else {
          alert(json.error || "Failed to create user");
        }
      }
    } catch (err) {
      console.error("Save user error:", err);
      alert("Error communicating with server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setDeleteConfirmId(null);
        if (editingId === id) setViewMode("LIST");
      } else {
        alert(json.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Error communicating with server.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = selectedRoleFilter === "ALL" || u.role === selectedRoleFilter;
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchRole && matchSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Shield className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              User Management & Role-Based Access Control (RBAC)
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Create administrator accounts, assign security roles, and configure granular permissions across all CMS studios.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "EDITOR" ? (
            <button
              onClick={() => setViewMode("LIST")}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Users Directory</span>
            </button>
          ) : (
            <button
              onClick={openCreateEditor}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>Create User in Full Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: FULL WORKSPACE USER & RBAC EDITOR */}
      {viewMode === "EDITOR" && (
        <form onSubmit={handleSaveUser} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? "✏️ Edit Administrator Account" : "✨ Create New User & Assign Role"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {formData.name || "New Administrator Account"}
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
                    <span>Delete User</span>
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
                      <span>User Saved in Database!</span>
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Account...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingId ? "Save User Changes" : "Create Account Now"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Form Fields in Full Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
              {/* Account Credentials & Info (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Jamwal"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rajesh.j@cismandi.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">
                      {editingId ? "Update Password (leave blank to keep current)" : "Password *"}
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder={editingId ? "••••••••" : "Min 6 characters"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full bg-slate-950 text-white pl-9 pr-3 py-3 rounded-xl border border-slate-800 font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 font-semibold focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Administration">Administration & Leadership</option>
                      <option value="Academics">Academics & Faculty</option>
                      <option value="Admissions">Admissions & Public Relations</option>
                      <option value="Examination">Examination & CBSE Cell</option>
                      <option value="Sports">Sports & Physical Education</option>
                      <option value="IT">IT & Systems Support</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">Account Status</label>
                    <div className="flex items-center space-x-4 pt-2.5">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500"
                        />
                        <span className="font-bold text-emerald-400">Active Account</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-3 pt-2">
                  <label className="font-bold text-slate-300 uppercase tracking-wider block">
                    Select RBAC Security Role *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ROLES.map((r) => {
                      const isSelected = formData.role === r.key;
                      return (
                        <div
                          key={r.key}
                          onClick={() => setFormData({ ...formData, role: r.key })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-slate-950 border-amber-400 ring-1 ring-amber-400/50"
                              : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{r.label}</span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${r.badgeColor}`}
                            >
                              {r.key}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                            {r.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Permission Matrix (5 Cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950/80 p-5 sm:p-6 rounded-2xl border border-slate-800">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-black text-sm text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Granular Studio Permissions</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Toggle individual modules this administrator can view and edit.
                  </p>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {PERMISSIONS.map((perm) => {
                    const isChecked =
                      formData.role === "SUPER_ADMIN" || formData.permissions.includes(perm.key);
                    const isSuperAdminDisabled = formData.role === "SUPER_ADMIN";

                    return (
                      <label
                        key={perm.key}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-slate-900 border-slate-700 text-white"
                            : "bg-slate-950/50 border-slate-850 text-slate-400"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs block">{perm.label}</span>
                          <span className="text-[10px] text-slate-500 font-mono uppercase">
                            {perm.category}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSuperAdminDisabled}
                          onChange={() => togglePermission(perm.key)}
                          className="w-4 h-4 rounded text-school-secondary focus:ring-0"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* VIEW 2: USERS DIRECTORY LIST */}
      {viewMode === "LIST" && (
        <div className="space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {["ALL", "SUPER_ADMIN", "ADMIN", "STAFF_EDITOR", "ADMISSIONS_OFFICER"].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setSelectedRoleFilter(roleKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedRoleFilter === roleKey
                      ? "bg-school-secondary text-white shadow"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {roleKey.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-slate-950 animate-pulse rounded-2xl border border-slate-800" />
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-3 text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3">
                <Users className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-white">No Users Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Create User in Full Workspace' to add your staff and administrators.
                </p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const roleMeta = ROLES.find((r) => r.key === u.role) || ROLES[2];
                return (
                  <div
                    key={u.id}
                    className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-school-secondary/20 text-school-secondary font-black text-sm flex items-center justify-center border border-school-secondary/30">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">{u.name}</h3>
                            <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${roleMeta.badgeColor}`}
                        >
                          {u.role}
                        </span>
                      </div>

                      <div className="text-xs space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Department:</span>
                          <span className="font-semibold text-white">{u.department || "General"}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Status:</span>
                          <span
                            className={`font-bold ${
                              u.isActive ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {u.isActive ? "● Active" : "○ Suspended"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Registered:</span>
                          <span className="text-slate-300">{formatDate(u.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditEditor(u)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors border border-slate-800"
                      >
                        <Edit3 className="w-3 h-3 text-school-secondary" />
                        <span>Edit Role</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(u.id)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Delete User Account?</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this administrator account? This user will lose access to all CMS portals immediately.
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
                onClick={() => handleDeleteUser(deleteConfirmId)}
                disabled={deleting}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{deleting ? "Deleting..." : "Yes, Delete Account"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
