import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Users,
  FileText,
  Bell,
  MessageSquare,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Share2,
  Tv,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  let admissionsCount = 0;
  let pendingAdmissions = 0;
  let inquiriesCount = 0;
  let newsCount = 0;
  let documentsCount = 0;
  let recentAdmissions: any[] = [];
  let recentLogs: any[] = [];

  try {
    admissionsCount = await prisma.admissionApplication.count();
    pendingAdmissions = await prisma.admissionApplication.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    });
    inquiriesCount = await prisma.inquiry.count();
    newsCount = await prisma.news.count();
    documentsCount = await prisma.document.count();

    recentAdmissions = await prisma.admissionApplication.findMany({
      orderBy: { submittedAt: "desc" },
      take: 5,
    });

    recentLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch (err) {
    console.error("Dashboard query error:", err);
  }

  const statCards = [
    {
      title: "Total Admissions",
      value: admissionsCount,
      sublabel: `${pendingAdmissions} Pending Review`,
      icon: Users,
      color: "from-blue-600 to-indigo-700",
      link: "/admin/admissions",
    },
    {
      title: "Visitor Inquiries",
      value: inquiriesCount,
      sublabel: "Prospective Leads",
      icon: MessageSquare,
      color: "from-amber-500 to-orange-600",
      link: "/admin/inquiries",
    },
    {
      title: "News & Bulletins",
      value: newsCount,
      sublabel: "Published on Portal",
      icon: Bell,
      color: "from-emerald-600 to-teal-700",
      link: "/admin/news",
    },
    {
      title: "Active Documents",
      value: documentsCount,
      sublabel: "CBSE & Circular PDFs",
      icon: FileText,
      color: "from-purple-600 to-pink-700",
      link: "/admin/documents",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Executive Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Admin CMS Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time operations, admission pipelines, and dynamic website content management.
          </p>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/social-media"
            className="inline-flex items-center space-x-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-rose-500/30 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Facebook & YouTube</span>
          </Link>

          <Link
            href="/admin/forms"
            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-xl shadow-md transition-all hover:scale-105"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form Builder Studio</span>
          </Link>

          <Link
            href="/admin/header-footer"
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <span>Header & Footer</span>
          </Link>

          <Link
            href="/admin/news"
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Post News</span>
          </Link>

          <Link
            href="/admin/documents"
            className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-school-secondary" />
            <span>Upload Document</span>
          </Link>

          <Link
            href="/admin/admissions"
            className="inline-flex items-center space-x-1.5 bg-school-secondary hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors"
          >
            <span>Review Admissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Link
              key={idx}
              href={c.link}
              className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 shadow-xl hover:-translate-y-1 transition-all group block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{c.title}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${c.color} text-white flex items-center justify-center shadow`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white block font-heading">
                  {c.value}
                </span>
                <span className="text-xs text-amber-400/90 font-medium block mt-1">
                  {c.sublabel}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 2-Column Split: Recent Admissions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Admissions Pipeline */}
        <div className="lg:col-span-7 bg-slate-950/80 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-school-secondary" />
              <span>Recent Admission Applications</span>
            </h2>
            <Link
              href="/admin/admissions"
              className="text-xs text-school-secondary hover:underline font-semibold"
            >
              View All ({admissionsCount})
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {recentAdmissions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No applications yet.</p>
            ) : (
              recentAdmissions.map((app) => (
                <div key={app.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">{app.studentName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {app.applicationNo} • {app.gradeApplying}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === "ADMITTED" || app.status === "PROVISIONALLY_ADMITTED"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : app.status === "INTERVIEW_SCHEDULED"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-blue-950 text-blue-300 border border-blue-800"
                      }`}
                    >
                      {app.status}
                    </span>
                    <Link
                      href="/admin/admissions"
                      className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security & Audit Log Feed */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Recent System Activity</span>
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs text-slate-400 hover:text-white font-semibold"
            >
              Full Trail
            </Link>
          </div>

          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No logs recorded.</p>
            ) : (
              recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-amber-300">{log.userName}</span>
                    <span>{formatDate(log.createdAt)}</span>
                  </div>
                  <p className="font-semibold text-white">{log.action}</p>
                  {log.details && (
                    <p className="text-[11px] text-slate-400 line-clamp-1">{log.details}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Management Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/social-media"
          className="bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-900/90 p-6 rounded-3xl border border-rose-500/30 hover:border-rose-500/60 shadow-xl group transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 mb-4 group-hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
            Facebook & YouTube Channels
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure live video player embeds, Facebook page timeline streams, and social links.
          </p>
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>Open Social Studio →</span>
          </span>
        </Link>

        <Link
          href="/admin/header-footer"
          className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900/90 p-6 rounded-3xl border border-amber-500/30 hover:border-amber-500/60 shadow-xl group transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
            Header & Footer Studio
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Edit menu navigation links, CTA buttons, logo height/branding, and contact information.
          </p>
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>Manage Navigation →</span>
          </span>
        </Link>

        <Link
          href="/admin/pages"
          className="bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-900/90 p-6 rounded-3xl border border-blue-500/30 hover:border-blue-500/60 shadow-xl group transition-all"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
            Page & Content Studio
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visual Canvas drag-and-drop editor for Home, About, Principal desk, and Admissions pages.
          </p>
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400 mt-4 group-hover:translate-x-1 transition-transform">
            <span>Launch Canvas Editor →</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
