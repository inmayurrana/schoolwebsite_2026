"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Sparkles,
  AlertTriangle,
  Search,
  Eye,
  X,
  Copy,
  Check,
  ExternalLink,
  User,
  MessageCircle,
  RotateCcw,
  Archive,
  ShieldAlert,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentGrade?: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  responseNotes?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
}

interface InquiryStats {
  activeCount: number;
  deletedCount: number;
  totalCount: number;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InquiryStats>({
    activeCount: 0,
    deletedCount: 0,
    totalCount: 0,
  });
  const [viewTab, setViewTab] = useState<"active" | "deleted">("active");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchInquiries = async (targetView = viewTab) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/inquiries?view=${targetView}`);
      const data = await res.json();
      if (data.inquiries) setInquiries(data.inquiries);
      if (data.stats) setStats(data.stats);
    } catch (err) {
      console.error("Failed to load inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(viewTab);
    setSelectedIds([]);
  }, [viewTab]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
      );
      setSelectedInquiry((prev) =>
        prev && prev.id === id ? { ...prev, status: newStatus } : prev
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSelectedIds((prev) => prev.filter((i) => i !== id));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        setDeleteConfirmId(null);
        await fetchInquiries(viewTab);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/inquiries/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        setShowBulkConfirm(false);
        await fetchInquiries(viewTab);
      }
    } catch (err) {
      console.error("Bulk delete failed:", err);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}/restore`, {
        method: "POST",
      });
      if (res.ok) {
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(null);
        }
        await fetchInquiries(viewTab);
      }
    } catch (err) {
      console.error("Restore failed:", err);
    } finally {
      setRestoringId(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredInquiries.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredInquiries = inquiries.filter((inq) => {
    return (
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Banner / Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
              Inquiries & Campus Tour Bookings
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Active inquiries reflect live on the CMS dashboard. Deletions are audited with real public IP and trigger automated email alerts.
          </p>
        </div>

        {viewTab === "active" && selectedIds.length > 0 && (
          <button
            onClick={() => setShowBulkConfirm(true)}
            className="inline-flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-colors animate-in fade-in"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedIds.length})</span>
          </button>
        )}
      </div>

      {/* Tabs Bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewTab("active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              viewTab === "active"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Active Inquiries</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                viewTab === "active"
                  ? "bg-slate-950/20 text-slate-950 font-black"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {stats.activeCount}
            </span>
          </button>

          <button
            onClick={() => setViewTab("deleted")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              viewTab === "deleted"
                ? "bg-rose-600 text-white shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Deleted / Trash</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                viewTab === "deleted"
                  ? "bg-white/20 text-white font-black"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {stats.deletedCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, email, subject..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              {viewTab === "active" && (
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredInquiries.length > 0 &&
                      selectedIds.length === filteredInquiries.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-school-secondary cursor-pointer"
                  />
                </th>
              )}
              <th className="p-3.5 font-bold">Inquirer</th>
              <th className="p-3.5 font-bold">Category & Subject</th>
              <th className="p-3.5 font-bold">Message Content</th>
              <th className="p-3.5 font-bold">Status</th>
              <th className="p-3.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={viewTab === "active" ? 6 : 5} className="p-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
                  Loading inquiries...
                </td>
              </tr>
            ) : filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={viewTab === "active" ? 6 : 5} className="p-12 text-center text-slate-400">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-slate-300">
                    {viewTab === "active"
                      ? "No active visitor inquiries found."
                      : "Trash is empty. No deleted inquiries."}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {viewTab === "active"
                      ? "New parent enquiries from the website will appear here in real-time."
                      : "When inquiries are deleted, they are securely preserved here for audit recovery."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq) => {
                const isSelected = selectedIds.includes(inq.id);
                return (
                  <tr
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected ? "bg-slate-900/90" : "hover:bg-slate-900/70"
                    }`}
                  >
                    {viewTab === "active" && (
                      <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(inq.id)}
                          className="w-4 h-4 rounded text-school-secondary cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="p-3.5">
                      <p className="font-bold text-white group-hover:text-amber-400 transition-colors flex items-center space-x-1.5">
                        <span>{inq.name}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{inq.phone}</p>
                      <p className="text-[10px] text-slate-500">{inq.email}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-block bg-blue-950/80 border border-blue-800/80 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                        {inq.inquiryType}
                        {inq.studentGrade ? ` • Grade ${inq.studentGrade}` : ""}
                      </span>
                      <p className="font-semibold text-slate-200 line-clamp-1">{inq.subject}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {formatDate(inq.createdAt)}
                      </p>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="line-clamp-2 text-slate-400 text-[11px] leading-relaxed">
                        {inq.message}
                      </p>
                    </td>
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      {viewTab === "active" ? (
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className="bg-slate-900 text-white px-2 py-1 text-[11px] rounded-lg border border-slate-700 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="NEW">NEW</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-block bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            DELETED
                          </span>
                          {inq.deletedBy && (
                            <p className="text-[10px] text-slate-400">By: {inq.deletedBy}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition-colors border border-slate-700"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {viewTab === "active" ? (
                          <button
                            onClick={() => setDeleteConfirmId(inq.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-400 hover:text-white transition-colors border border-rose-900/40"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(inq.id)}
                            disabled={restoringId === inq.id}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 text-emerald-300 hover:text-white transition-colors border border-emerald-800 text-[11px] font-bold"
                            title="Restore Inquiry"
                          >
                            {restoringId === inq.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            <span>Restore</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================
          INQUIRY DETAIL MODAL WITH FULL CONTENT & ACTIONS
         ======================================================== */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-200 overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {selectedInquiry.inquiryType}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedInquiry.isDeleted || selectedInquiry.status === "DELETED"
                        ? "bg-rose-950 text-rose-300 border-rose-800"
                        : selectedInquiry.status === "RESOLVED"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                        : selectedInquiry.status === "IN_PROGRESS"
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : selectedInquiry.status === "CLOSED"
                        ? "bg-slate-800 text-slate-400 border-slate-700"
                        : "bg-blue-950 text-blue-300 border-blue-800"
                    }`}
                  >
                    {selectedInquiry.isDeleted ? "DELETED" : selectedInquiry.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2 pt-1">
                  <User className="w-5 h-5 text-amber-400" />
                  <span>{selectedInquiry.name}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Submitted on {formatDate(selectedInquiry.createdAt)}
                  {selectedInquiry.deletedAt && (
                    <span className="text-rose-400 block mt-0.5">
                      • Deleted on {formatDate(selectedInquiry.deletedAt)}{" "}
                      {selectedInquiry.deletedBy ? `by ${selectedInquiry.deletedBy}` : ""}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {!selectedInquiry.isDeleted && selectedInquiry.status !== "DELETED" ? (
                  <button
                    onClick={() => setDeleteConfirmId(selectedInquiry.id)}
                    className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white transition-colors border border-rose-800/80"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleRestore(selectedInquiry.id)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Lead</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact Details</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Phone */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Phone Number
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm font-mono">
                      {selectedInquiry.phone || "Not provided"}
                    </span>
                    {selectedInquiry.phone && (
                      <div className="flex items-center space-x-1.5">
                        <a
                          href={`tel:${selectedInquiry.phone.replace(/[^0-9+]/g, "")}`}
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Email Address
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 truncate mr-2" title={selectedInquiry.email}>
                      {selectedInquiry.email || "Not provided"}
                    </span>
                    {selectedInquiry.email && (
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || "Your Inquiry - Cambridge International School")}`}
                        className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors shrink-0"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Student Grade (if available) */}
                {selectedInquiry.studentGrade && (
                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      Target Grade
                    </span>
                    <span className="font-bold text-amber-400 text-sm">
                      {selectedInquiry.studentGrade}
                    </span>
                  </div>
                )}

                {/* Subject */}
                <div className={`bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 ${!selectedInquiry.studentGrade ? "sm:col-span-2" : ""}`}>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Subject / Topic
                  </span>
                  <span className="font-bold text-white text-sm">
                    {selectedInquiry.subject || "General Query"}
                  </span>
                </div>
              </div>
            </div>

            {/* Message / Query Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Message Content</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(selectedInquiry.message);
                      setCopiedField("message");
                      setTimeout(() => setCopiedField(null), 2000);
                    }
                  }}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  {copiedField === "message" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedInquiry.message || "No message content provided."}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {!selectedInquiry.isDeleted && selectedInquiry.status !== "DELETED" ? (
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-400">Update Status:</span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                    className="bg-slate-950 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Archived in Audit Trail</span>
                </div>
              )}

              <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                {selectedInquiry.email && (
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || "Inquiry Response - Cambridge International School")}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Single Inquiry Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Visitor Inquiry?</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This inquiry will be removed from the active dashboard, recorded in the Security Audit Log with your real public IP address, and an alert email will be sent to administrators.
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
                <span>{deleting ? "Deleting..." : "Yes, Delete & Notify"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4 text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">
                Delete {selectedIds.length} Inquiries?
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete {selectedIds.length} selected inquiries? They will be excluded from the live dashboard, logged in the Security Audit Trail with real public IP, and an alert email will be sent.
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
