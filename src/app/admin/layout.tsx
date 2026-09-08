"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Image as ImageIcon,
  Award,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Bell,
  MessageSquare,
  Lock,
  Layers,
  Palette,
  LayoutTemplate,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Skip auth layout for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok || !data.authenticated) {
          router.push("/admin/login");
        } else {
          setUser(data.user);
        }
      } catch (err) {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-school-secondary border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Verifying Administrator Session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Page & Content Studio", href: "/admin/pages", icon: Layers, badge: "Editor" },
    { label: "Theme & Visual Effects", href: "/admin/theme", icon: Palette, badge: "Colors" },
    { label: "Header & Footer Studio", href: "/admin/header-footer", icon: LayoutTemplate, badge: "Menu" },
    { label: "Mandatory Disclosure", href: "/admin/mandatory-disclosure", icon: ShieldCheck, badge: "CBSE" },
    { label: "Admissions Hub", href: "/admin/admissions", icon: Users, badge: "Live" },
    { label: "Visitor Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { label: "News & Bulletins", href: "/admin/news", icon: Bell },
    { label: "Notice Board & Ticker", href: "/admin/notices", icon: Bell, badge: "Ticker" },
    { label: "Events & Calendar", href: "/admin/events", icon: Calendar },
    { label: "Media Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Documents & Circulars", href: "/admin/documents", icon: FileText },
    { label: "Achievements", href: "/admin/achievements", icon: Award },
    { label: "Faculty Directory", href: "/admin/faculty", icon: BookOpen },
    { label: "Careers & Openings", href: "/admin/careers", icon: Briefcase },
    { label: "Security & Audit Trail", href: "/admin/audit-logs", icon: ShieldCheck },
    { label: "User Management & RBAC", href: "/admin/users", icon: Users, badge: "RBAC" },
    { label: "Settings & Backup", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Ambient Glass Glow Orbs */}
      <div className="glass-orb-blue -top-24 left-1/4 opacity-25" />
      <div className="glass-orb-purple bottom-10 right-1/4 opacity-20" />

      {/* Mobile Header */}
      <div className="lg:hidden glass-nav p-4 flex items-center justify-between relative z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-school-secondary to-blue-600 text-amber-400 flex items-center justify-center font-bold shadow">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-sm text-white">CIS Mandi CMS</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 glass-btn rounded-xl text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass-panel border-r border-slate-200/50 dark:border-white/10 p-5 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-school-secondary to-blue-600 flex items-center justify-center text-amber-400 shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-sm text-white block tracking-tight">
                CAMBRIDGE MANDI
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                Admin Studio
              </span>
            </div>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-school-secondary to-blue-600 text-white shadow-lg font-bold border border-blue-400/40"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center space-x-3 px-1">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold text-xs shadow">
              {user?.name ? user.name[0] : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Admin"}</p>
              <span className="text-[10px] font-semibold text-emerald-400 block truncate">
                {user?.role || "SUPER_ADMIN"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 inline-flex items-center justify-center space-x-1.5 glass-btn text-slate-300 text-[11px] font-medium py-2 rounded-xl transition-all"
            >
              <span>View Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl glass-btn text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 min-w-0 bg-slate-950 min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
