import React from "react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ShieldCheck, Clock, User, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  let logs: any[] = [];
  try {
    logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (err) {
    console.error("Audit log error:", err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Security & Compliance
          </span>
          <h1 className="text-2xl font-bold font-heading text-white">
            Administrative Audit Trail & Access Logs ({logs.length})
          </h1>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3.5 font-bold">Timestamp</th>
              <th className="p-3.5 font-bold">User / Actor</th>
              <th className="p-3.5 font-bold">Action</th>
              <th className="p-3.5 font-bold">Entity</th>
              <th className="p-3.5 font-bold">Details</th>
              <th className="p-3.5 font-bold">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="p-3.5 font-bold text-white">{log.userName}</td>
                  <td className="p-3.5">
                    <span className="bg-blue-950 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-amber-400 font-semibold">{log.entity}</td>
                  <td className="p-3.5 text-slate-300 max-w-xs truncate">{log.details || "—"}</td>
                  <td className="p-3.5 font-mono text-slate-500">{log.ipAddress || "127.0.0.1"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
