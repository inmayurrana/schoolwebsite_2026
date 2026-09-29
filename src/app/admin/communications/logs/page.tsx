"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Send,
  Eye,
  ChevronRight,
  Server,
  Mail,
  ShieldCheck,
  Sparkles,
  Inbox,
  Filter,
  Bell,
} from "lucide-react";

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
  const [stats, setStats] = useState({
    totalSent: 0,
    totalFailed: 0,
    totalQueued: 0,
    sentToday: 0,
    sentThisMonth: 0,
  });

  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchQuery) params.append("q", searchQuery);
      params.append("page", String(page));
      params.append("limit", "25");

      const res = await fetch(`/api/email/logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        if (data.pagination) setPagination(data.pagination);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      showToast("error", "Failed to fetch email logs");
    } finally {
      setLoading(false);
    }
  }

  const handleRetry = async (logId: string) => {
    setRetryingId(logId);
    try {
      const res = await fetch(`/api/email/logs/${logId}/retry`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Email resent successfully!");
        fetchLogs();
        if (selectedLog && selectedLog.id === logId) {
          setSelectedLog(null);
        }
      } else {
        showToast("error", data.error || "Retry attempt failed");
      }
    } catch (err: any) {
      showToast("error", err.message || "Retry failed");
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-bold transition-all border ${
            toast.type === "success"
              ? "bg-emerald-900 text-emerald-100 border-emerald-400"
              : "bg-rose-900 text-rose-100 border-rose-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-300" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header & Sub-navigation Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black text-amber-400 uppercase tracking-widest mb-1.5">
              <span>Communications</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Email Logs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-amber-400" />
              Email Logs & Delivery Queue
            </h1>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Live audit trail of all outbound emails, delivery attempts, error diagnostics, and manual retry controls.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLogs}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-black text-white flex items-center gap-2 border border-slate-700 shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Logs</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <Link
            href="/admin/communications/email"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Email Settings</span>
          </Link>
          <Link
            href="/admin/communications/alerts"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Email Alerts</span>
          </Link>
          <Link
            href="/admin/communications/templates"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Email Templates</span>
          </Link>
          <Link
            href="/admin/communications/notifications"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Form Notifications</span>
          </Link>
          <Link
            href="/admin/communications/logs"
            className="px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
            <span>Email Logs & Queue</span>
          </Link>
          <Link
            href="/admin/communications/design"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Email Branding & Design</span>
          </Link>
        </div>
      </div>

      {/* SECTION 36: ANALYTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">Sent Today</span>
          <p className="text-3xl font-black text-white mt-2">{stats.sentToday}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-black text-blue-400 uppercase tracking-wider block">This Month</span>
          <p className="text-3xl font-black text-white mt-2">{stats.sentThisMonth}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">Total Delivered</span>
          <p className="text-3xl font-black text-white mt-2">{stats.totalSent}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-black text-rose-400 uppercase tracking-wider block">Failed / Errors</span>
          <p className="text-3xl font-black text-rose-300 mt-2">{stats.totalFailed}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs font-black text-purple-400 uppercase tracking-wider block">Queued / Retrying</span>
          <p className="text-3xl font-black text-purple-300 mt-2">{stats.totalQueued}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-black text-white uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="ALL" className="bg-slate-900 text-white">All Statuses</option>
            <option value="SENT" className="bg-slate-900 text-white">✓ Sent</option>
            <option value="FAILED" className="bg-slate-900 text-white">✗ Failed</option>
            <option value="QUEUED" className="bg-slate-900 text-white">Queued</option>
            <option value="SENDING" className="bg-slate-900 text-white">Sending</option>
            <option value="RETRYING" className="bg-slate-900 text-white">Retrying</option>
            <option value="CANCELLED" className="bg-slate-900 text-white">Cancelled</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipient or subject..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium text-xs focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* SECTION 20 & 21: EMAIL LOGS TABLE */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-white uppercase tracking-wider text-[11px] font-black">
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Ref / Form</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-300 font-medium">
                    <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-500" />
                    <span>No email delivery logs found matching the filter criteria.</span>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSuccess = log.status === "SENT";
                  const isFail = log.status === "FAILED";
                  const isRetrying = log.status === "RETRYING" || log.status === "SENDING";

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-200 font-mono font-medium">
                        {new Date(log.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[10px] font-black text-slate-100 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                          {log.type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap font-mono text-xs">
                        {log.recipient}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-100 font-medium">
                        {log.subject}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                            isSuccess
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                              : isFail
                              ? "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                              : isRetrying
                              ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                              : "bg-slate-800 text-slate-200 border border-slate-700"
                          }`}
                        >
                          {isSuccess && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                          {isFail && <XCircle className="w-3 h-3 text-rose-300" />}
                          {isRetrying && <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />}
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-200 whitespace-nowrap font-mono text-xs font-semibold">
                        {log.provider}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-xs">
                        {log.submissionId ? (
                          <span className="text-amber-300 font-mono font-bold">
                            {log.submissionId}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLog(log)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700"
                        >
                          View
                        </button>
                        {isFail && (
                          <button
                            type="button"
                            onClick={() => handleRetry(log.id)}
                            disabled={retryingId === log.id}
                            className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-black hover:bg-amber-300 transition-colors disabled:opacity-50"
                          >
                            {retryingId === log.id ? "Retrying..." : "Retry"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-200 font-semibold bg-slate-950">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} logs)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-white font-black text-lg">Email Delivery Diagnostics</span>
              <button onClick={() => setSelectedLog(null)} className="text-slate-300 hover:text-white font-bold text-lg p-1 rounded hover:bg-slate-800">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 font-black uppercase tracking-wider block mb-1">Status:</span>
                  <span className="text-white font-black text-sm">{selectedLog.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-black uppercase tracking-wider block mb-1">Provider:</span>
                  <span className="text-white font-bold">{selectedLog.provider}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-black uppercase tracking-wider block mb-1">Recipient:</span>
                  <span className="text-white font-mono font-bold">{selectedLog.recipient}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-black uppercase tracking-wider block mb-1">Submission ID:</span>
                  <span className="text-amber-300 font-mono font-black">
                    {selectedLog.submissionId || "None"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-black text-white uppercase tracking-wider block mb-1.5">Subject:</span>
                <p className="p-3 bg-slate-950 rounded-xl text-white font-semibold border border-slate-800">
                  {selectedLog.subject}
                </p>
              </div>

              {selectedLog.errorMessage && (
                <div className="p-4 bg-rose-950 border border-rose-500 rounded-xl text-rose-100">
                  <span className="font-black text-rose-300 uppercase tracking-wider block mb-1">Failure Reason:</span>
                  <p className="font-mono text-xs leading-relaxed">{selectedLog.errorMessage}</p>
                </div>
              )}

              {selectedLog.bodySnippet && (
                <div>
                  <span className="text-xs font-black text-white uppercase tracking-wider block mb-1.5">Content Snippet:</span>
                  <p className="p-3 bg-slate-950 rounded-xl text-slate-200 text-xs font-mono leading-relaxed border border-slate-800">
                    {selectedLog.bodySnippet}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-mono font-bold">
                Delivery Attempts: {selectedLog.attempts || 1}
              </span>
              <div className="flex gap-3">
                {selectedLog.status === "FAILED" && (
                  <button
                    type="button"
                    onClick={() => handleRetry(selectedLog.id)}
                    disabled={retryingId === selectedLog.id}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md"
                  >
                    {retryingId === selectedLog.id ? "Retrying..." : "Resend Email Now"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
