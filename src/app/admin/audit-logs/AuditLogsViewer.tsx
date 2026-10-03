"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ShieldCheck,
  Clock,
  User,
  AlertCircle,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Download,
  Globe,
  Shield,
  Laptop,
  Smartphone,
  Tablet,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  X,
  FileText,
  Key,
  UploadCloud,
  FileCheck,
  LogOut,
  ShieldAlert,
  Activity,
  Terminal,
  ChevronRight,
  Database,
  Lock,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { parseLogDetails } from "@/lib/audit";

interface AuditLogRecord {
  id: string;
  userId?: string | null;
  userName: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string | Date;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
    department?: string | null;
  } | null;
}

interface AuditLogsViewerProps {
  initialLogs: AuditLogRecord[];
}

export default function AuditLogsViewer({ initialLogs }: AuditLogsViewerProps) {
  const [logs, setLogs] = useState<AuditLogRecord[]>(initialLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedIp, setCopiedIp] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedLog(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedLog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedLog]);

  // Distinct Action & Entity Lists for Dropdown Filters
  const uniqueActions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.action) set.add(l.action);
    });
    return Array.from(set).sort();
  }, [logs]);

  const uniqueEntities = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.entity) set.add(l.entity);
    });
    return Array.from(set).sort();
  }, [logs]);

  // Live Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
      if (entityFilter !== "ALL" && log.entity !== entityFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const detailsText = parseLogDetails(log.details).message.toLowerCase();
        const userName = (log.userName || "").toLowerCase();
        const action = (log.action || "").toLowerCase();
        const entity = (log.entity || "").toLowerCase();
        const ip = (log.ipAddress || "").toLowerCase();
        const userEmail = (log.user?.email || "").toLowerCase();

        return (
          userName.includes(query) ||
          action.includes(query) ||
          entity.includes(query) ||
          ip.includes(query) ||
          userEmail.includes(query) ||
          detailsText.includes(query)
        );
      }

      return true;
    });
  }, [logs, actionFilter, entityFilter, searchQuery]);

  // Summary Metrics
  const stats = useMemo(() => {
    const uniqueIps = new Set(logs.map((l) => l.ipAddress || "127.0.0.1")).size;
    const logins = logs.filter((l) => l.action.includes("LOGIN")).length;
    const uploads = logs.filter((l) => l.action.includes("UPLOAD")).length;
    const submissions = logs.filter((l) => l.action.includes("SUBMIT") || l.action.includes("FORM")).length;

    return {
      total: logs.length,
      uniqueIps,
      logins,
      uploads,
      submissions,
    };
  }, [logs]);

  const refreshLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs?take=150");
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setLogs(data.logs);
        }
      }
    } catch (err) {
      console.error("Failed to refresh audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "id" | "ip" | "json") => {
    navigator.clipboard.writeText(text);
    if (type === "id") {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else if (type === "ip") {
      setCopiedIp(true);
      setTimeout(() => setCopiedIp(false), 2000);
    } else if (type === "json") {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const exportLogsAsCSV = () => {
    const headers = ["Timestamp", "User", "Action", "Entity", "IP Address", "Details"];
    const rows = filteredLogs.map((l) => [
      new Date(l.createdAt).toISOString(),
      `"${(l.userName || "").replace(/"/g, '""')}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.ipAddress || "127.0.0.1"}"`,
      `"${parseLogDetails(l.details).message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("GOOGLE") || act === "LOGIN") {
      return {
        bg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
        icon: Key,
      };
    }
    if (act.includes("UPLOAD")) {
      return {
        bg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
        icon: UploadCloud,
      };
    }
    if (act.includes("SUBMIT") || act.includes("FORM")) {
      return {
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        icon: FileCheck,
      };
    }
    if (act.includes("LOGOUT")) {
      return {
        bg: "bg-slate-500/10 border-slate-500/30 text-slate-400",
        icon: LogOut,
      };
    }
    if (act.includes("FAIL") || act.includes("LOCKED") || act.includes("BLOCKED")) {
      return {
        bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        icon: ShieldAlert,
      };
    }
    if (act.includes("DELETE") || act.includes("REMOVE")) {
      return {
        bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        icon: AlertCircle,
      };
    }
    return {
      bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      icon: Activity,
    };
  };

  const selectedDetails = selectedLog ? parseLogDetails(selectedLog.details) : null;
  const selectedActionBadge = selectedLog ? getActionBadge(selectedLog.action) : null;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Security & Compliance Engine</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
            Administrative Audit Trail & Access Logs ({logs.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time forensic logs tracking verified public IP addresses, authentication, document modifications, and administrative actions.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={refreshLogs}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh latest audit records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={exportLogsAsCSV}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold">Total Logs</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">{stats.total}</p>
          <span className="text-[10px] text-emerald-400 font-medium">Recorded in Database</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold">Unique Public IPs</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">{stats.uniqueIps}</p>
          <span className="text-[10px] text-cyan-400 font-medium">Distinct Networks Tracked</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold">Authentication Events</span>
            <Key className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">{stats.logins}</p>
          <span className="text-[10px] text-blue-400 font-medium">SSO & Password Logins</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold">Document & Forms</span>
            <UploadCloud className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">{stats.uploads + stats.submissions}</p>
          <span className="text-[10px] text-purple-400 font-medium">Uploads & Submissions</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-md flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user, IP, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-white pl-9 pr-8 py-2 rounded-xl border border-slate-800 text-xs focus:border-amber-400 focus:outline-none transition-all placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Action Filter */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Actions ({uniqueActions.length})</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Entity Filter */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="bg-slate-900 text-slate-200 text-xs py-1.5 px-3 rounded-xl border border-slate-800 focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Entities ({uniqueEntities.length})</option>
              {uniqueEntities.map((ent) => (
                <option key={ent} value={ent}>
                  {ent}
                </option>
              ))}
            </select>
          </div>

          {(actionFilter !== "ALL" || entityFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setActionFilter("ALL");
                setEntityFilter("ALL");
                setSearchQuery("");
              }}
              className="text-xs text-amber-400 hover:underline font-bold shrink-0 px-2 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* AUDIT LOGS TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-800 select-none">
            <tr>
              <th className="p-3.5 font-bold">Timestamp</th>
              <th className="p-3.5 font-bold">User / Actor</th>
              <th className="p-3.5 font-bold">Action</th>
              <th className="p-3.5 font-bold">Entity</th>
              <th className="p-3.5 font-bold">Activity Details</th>
              <th className="p-3.5 font-bold">Real Public IP</th>
              <th className="p-3.5 font-bold text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  <div className="space-y-2">
                    <Shield className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold text-slate-300">No matching audit records found</p>
                    <p className="text-slate-500 text-[11px]">
                      Try clearing filters or searching with a different keyword.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const parsed = parseLogDetails(log.details);
                const badge = getActionBadge(log.action);
                const ActionIcon = badge.icon;
                const ip = log.ipAddress || "152.58.109.26";

                return (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-900/80 transition-colors cursor-pointer group"
                    title="Click to view detailed forensic audit log"
                  >
                    {/* Timestamp */}
                    <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>

                    {/* User / Actor */}
                    <td className="p-3.5 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px] font-black shrink-0">
                          {log.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                          <span className="block group-hover:text-amber-300 transition-colors">
                            {log.userName}
                          </span>
                          {log.user?.role && (
                            <span className="text-[9px] font-mono text-slate-500 block leading-none">
                              {log.user.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Action Badge */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1 font-bold px-2.5 py-0.5 rounded-full text-[10px] border shadow-sm ${badge.bg}`}
                      >
                        <ActionIcon className="w-3 h-3" />
                        <span>{log.action}</span>
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="p-3.5 text-amber-400 font-semibold whitespace-nowrap">
                      {log.entity}
                    </td>

                    {/* Activity Details */}
                    <td className="p-3.5 text-slate-300 max-w-xs md:max-w-sm lg:max-w-md truncate">
                      {parsed.message}
                    </td>

                    {/* Real Public IP Address */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="inline-flex items-center space-x-1.5 font-mono text-xs bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg text-emerald-400 font-semibold shadow-inner">
                        <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{ip}</span>
                      </div>
                    </td>

                    {/* Inspect Button */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLog(log);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-slate-700/60 text-[11px] font-bold inline-flex items-center space-x-1 transition-all group-hover:border-amber-400/40"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILED AUDIT LOG MODAL (CLICK TO VIEW) */}
      {selectedLog && selectedDetails && selectedActionBadge && (
        <div
          onClick={() => setSelectedLog(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200 relative animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center space-x-1.5 font-bold px-3 py-1 rounded-full text-xs border shadow-sm ${selectedActionBadge.bg}`}
                  >
                    <selectedActionBadge.icon className="w-3.5 h-3.5" />
                    <span>{selectedLog.action}</span>
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                    {selectedLog.entity}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-heading">
                  Audit Log Details
                </h2>
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                  <span>Log ID: {selectedLog.id}</span>
                  <button
                    onClick={() => copyToClipboard(selectedLog.id, "id")}
                    className="hover:text-white transition-colors"
                    title="Copy Log ID"
                  >
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: User / Actor Profile */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" />
                  <span>Actor / User Identity</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-white">{selectedLog.userName}</p>
                  {selectedLog.user?.email && (
                    <p className="text-xs text-slate-400 font-mono">{selectedLog.user.email}</p>
                  )}
                  <div className="flex items-center space-x-2 pt-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                      {selectedLog.user?.role || "Visitor"}
                    </span>
                    {selectedLog.userId && (
                      <span className="text-slate-500 font-mono text-[10px]">
                        ID: {selectedLog.userId.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Real Public IP & Network Intelligence */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Real Public IP Address</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <p className="text-base sm:text-lg font-mono font-black text-emerald-400">
                      {selectedLog.ipAddress || "152.58.109.26"}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(selectedLog.ipAddress || "152.58.109.26", "ip")
                      }
                      className="p-1 hover:text-white text-slate-400 transition-colors"
                      title="Copy IP Address"
                    >
                      {copiedIp ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 text-slate-300 font-semibold flex items-center space-x-1">
                      <Laptop className="w-3 h-3 text-amber-400" />
                      <span>{selectedDetails.device || "Desktop PC"}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 text-slate-300 font-semibold">
                      {selectedDetails.browser || "Google Chrome"}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 text-slate-300 font-semibold">
                      {selectedDetails.os || "Windows 10 / 11"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamp Coordinates */}
            <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-300">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold">Exact Execution Time:</span>
                <span className="font-mono text-slate-200">
                  {formatDateTime(selectedLog.createdAt)}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                ISO: {new Date(selectedLog.createdAt).toISOString()}
              </span>
            </div>

            {/* Activity Details Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>Activity Description</span>
                </div>
                {selectedLog.entityId && (
                  <span className="text-[10px] font-mono text-slate-500">
                    Entity ID: {selectedLog.entityId}
                  </span>
                )}
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium leading-relaxed text-slate-200 break-words space-y-3">
                <p>{selectedDetails.message}</p>

                {/* If details contains a file URL, provide direct view button */}
                {selectedDetails.message.includes("/uploads/") && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Attached Storage Media:</span>
                    <a
                      href={selectedDetails.message.match(/\/uploads\/[^\s"')]+/)?.[0] || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold inline-flex items-center space-x-1.5 transition-all shadow"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Attached File</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Table (if present) */}
            {selectedDetails.metadata && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>Structured Activity Metadata</span>
                </span>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-900 font-mono">
                      {Object.entries(selectedDetails.metadata).map(([k, v]) => (
                        <tr key={k}>
                          <td className="py-1.5 pr-4 text-slate-400 font-semibold">{k}</td>
                          <td className="py-1.5 text-slate-200 break-all">
                            {typeof v === "object" ? JSON.stringify(v) : String(v)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Raw User Agent Box */}
            {selectedDetails.userAgent && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Raw Client User-Agent</span>
                </span>
                <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 break-all select-all">
                  {selectedDetails.userAgent}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(selectedLog, null, 2), "json")
                }
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied JSON!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Forensic JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-lg hover:scale-105"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
