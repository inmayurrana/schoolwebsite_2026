"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  FileSpreadsheet,
  Eye,
  Trash2,
  Calendar,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertTriangle,
  CheckSquare,
  Square,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Application {
  id: string;
  applicationNo: string;
  studentName: string;
  dob: string;
  gender: string;
  bloodGroup?: string | null;
  gradeApplying: string;
  academicYear: string;
  stream?: string | null;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  previousSchool?: string | null;
  previousGrade?: string | null;
  previousMarks?: string | null;
  status: string;
  transportRequired: boolean;
  hostelRequired: boolean;
  documentsJson?: string | null;
  remarks?: string | null;
  interviewDate?: string | null;
  feeReceiptNo?: string | null;
  submittedAt: string;
}

export default function AdminAdmissionsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admissions");
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to load admissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admissions/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        setDeleteConfirmId(null);
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(null);
        }
      } else {
        alert(json.error || "Failed to delete application");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting application from server.");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    try {
      for (const id of selectedIds) {
        await fetch(`/api/admissions/${id}`, { method: "DELETE" });
      }
      setApplications((prev) => prev.filter((app) => !selectedIds.includes(app.id)));
      setSelectedIds([]);
      setShowBulkConfirm(false);
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("Error during bulk delete.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApps.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApps.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesGrade = gradeFilter === "ALL" || app.gradeApplying === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  const exportCSV = () => {
    const headers = [
      "App No",
      "Student Name",
      "DOB",
      "Gender",
      "Grade",
      "Academic Year",
      "Father Name",
      "Mother Name",
      "Phone",
      "Email",
      "City",
      "Transport",
      "Hostel",
      "Status",
      "Submitted At",
    ];

    const rows = filteredApps.map((a) => [
      a.applicationNo,
      `"${a.studentName}"`,
      a.dob,
      a.gender,
      `"${a.gradeApplying}"`,
      a.academicYear,
      `"${a.fatherName}"`,
      `"${a.motherName}"`,
      a.phone,
      a.email,
      a.city,
      a.transportRequired ? "Yes" : "No",
      a.hostelRequired ? "Yes" : "No",
      a.status,
      formatDate(a.submittedAt),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Online Applications Pipeline ({applications.length})
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Review admissions dossiers, schedule entrance interviews, export Excel reports, and delete candidate records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors animate-in fade-in"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={exportCSV}
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student, ID, parent, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-white pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-school-secondary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-900 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUBMITTED">SUBMITTED (New)</option>
          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
          <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
          <option value="PROVISIONALLY_ADMITTED">PROVISIONALLY_ADMITTED</option>
          <option value="ADMITTED">ADMITTED (Enrolled)</option>
          <option value="REJECTED">REJECTED</option>
        </select>

        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="bg-slate-900 text-white px-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none"
        >
          <option value="ALL">All Grades</option>
          <option value="Nursery / Pre-KG">Nursery / Pre-KG</option>
          <option value="Grade I">Grade I</option>
          <option value="Grade V">Grade V</option>
          <option value="Grade VI">Grade VI</option>
          <option value="Grade IX">Grade IX</option>
          <option value="Grade XI">Grade XI</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3.5 w-10">
                <input
                  type="checkbox"
                  checked={
                    filteredApps.length > 0 && selectedIds.length === filteredApps.length
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded text-school-secondary cursor-pointer"
                  title="Select All"
                />
              </th>
              <th className="p-3.5 font-bold">App No & Student</th>
              <th className="p-3.5 font-bold">Grade / Stream</th>
              <th className="p-3.5 font-bold">Parent & Contact</th>
              <th className="p-3.5 font-bold">Facilities</th>
              <th className="p-3.5 font-bold">Status</th>
              <th className="p-3.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading applications...
                </td>
              </tr>
            ) : filteredApps.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No applications found.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedIds.includes(app.id);
                return (
                  <tr
                    key={app.id}
                    className={`transition-colors ${
                      isSelected ? "bg-slate-900/90" : "hover:bg-slate-900/50"
                    }`}
                  >
                    <td className="p-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(app.id)}
                        className="w-4 h-4 rounded text-school-secondary cursor-pointer"
                      />
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-white text-sm">{app.studentName}</p>
                      <p className="font-mono text-[11px] text-amber-400 font-bold">
                        {app.applicationNo}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        DOB: {app.dob} ({app.gender})
                      </p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-white">{app.gradeApplying}</span>
                      {app.stream && <p className="text-[10px] text-slate-400">{app.stream}</p>}
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <p className="font-medium text-slate-200">{app.fatherName}</p>
                      <p className="text-[11px] text-slate-400">{app.phone}</p>
                      <p className="text-[10px] text-slate-500">{app.email}</p>
                    </td>
                    <td className="p-3.5 space-y-1">
                      {app.transportRequired && (
                        <span className="bg-sky-950 text-sky-400 border border-sky-800 text-[10px] px-2 py-0.5 rounded-full block w-max">
                          Bus Transport
                        </span>
                      )}
                      {app.hostelRequired && (
                        <span className="bg-purple-950 text-purple-400 border border-purple-800 text-[10px] px-2 py-0.5 rounded-full block w-max">
                          Hostel Boarding
                        </span>
                      )}
                      {!app.transportRequired && !app.hostelRequired && (
                        <span className="text-slate-500 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={app.status}
                        disabled={updating}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="bg-slate-900 text-white px-2.5 py-1 text-[11px] rounded-lg border border-slate-700 font-bold focus:outline-none"
                      >
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                        <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
                        <option value="PROVISIONALLY_ADMITTED">PROVISIONALLY_ADMITTED</option>
                        <option value="ADMITTED">ADMITTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-school-secondary text-slate-200 hover:text-white transition-colors"
                          title="View Complete Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(app.id)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                          title="Delete Application"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Candidate Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {selectedApp.applicationNo}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedApp.studentName}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDeleteConfirmId(selectedApp.id)}
                  className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors border border-rose-800/80"
                  title="Delete Application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-bold">Academic Intent</p>
                <p className="text-white">Grade: {selectedApp.gradeApplying}</p>
                {selectedApp.stream && <p className="text-white">Stream: {selectedApp.stream}</p>}
                <p className="text-slate-400">Year: {selectedApp.academicYear}</p>
              </div>

              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-slate-400 font-bold">Personal Particulars</p>
                <p className="text-white">DOB: {selectedApp.dob}</p>
                <p className="text-white">Gender: {selectedApp.gender}</p>
                <p className="text-white">Blood: {selectedApp.bloodGroup || "N/A"}</p>
              </div>

              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <p className="text-slate-400 font-bold">Father's Info</p>
                <p className="text-white">{selectedApp.fatherName}</p>
                <p className="text-slate-300">{selectedApp.fatherPhone}</p>
              </div>

              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <p className="text-slate-400 font-bold">Mother's Info</p>
                <p className="text-white">{selectedApp.motherName}</p>
                <p className="text-slate-300">{selectedApp.motherPhone}</p>
              </div>

              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-800 col-span-2">
                <p className="text-slate-400 font-bold">Residential Address</p>
                <p className="text-white">{selectedApp.address}</p>
                <p className="text-slate-300">
                  {selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500 font-mono">
                Submitted on {formatDate(selectedApp.submittedAt)}
              </span>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setDeleteConfirmId(selectedApp.id)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white text-xs font-bold border border-rose-800/80 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Application</span>
                </button>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Application Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Admission Application?</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently delete this admission application from the database? This action cannot be undone.
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
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{deleting ? "Deleting..." : "Yes, Delete Application"}</span>
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
              <h3 className="text-base font-bold text-white">
                Delete {selectedIds.length} Applications?
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              You have selected {selectedIds.length} student application records. Are you sure you want to delete all selected records permanently from the database?
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
                {bulkDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>
                  {bulkDeleting
                    ? `Deleting ${selectedIds.length}...`
                    : `Yes, Delete ${selectedIds.length} Records`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
