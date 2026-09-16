"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Home, Phone, ArrowLeft, Building2 } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

let cachedDisabledPaths: Set<string> | null = null;

export default function PageVisibilityGuard({ children }: Props) {
  const pathname = usePathname();
  const [disabledPaths, setDisabledPaths] = useState<Set<string>>(cachedDisabledPaths || new Set());
  const [loaded, setLoaded] = useState(cachedDisabledPaths !== null);

  useEffect(() => {
    async function checkVisibility() {
      try {
        const res = await fetch("/api/pages/visibility", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const disabled = new Set<string>();
          if (data.visibility) {
            Object.entries(data.visibility).forEach(([slug, isPub]) => {
              if (isPub === false) {
                disabled.add(slug.toLowerCase().trim());
                // also match with leading slash
                disabled.add("/" + slug.toLowerCase().trim());
              }
            });
          }
          cachedDisabledPaths = disabled;
          setDisabledPaths(disabled);
        }
      } catch (err) {
        console.error("Failed to check page visibility:", err);
      } finally {
        setLoaded(true);
      }
    }

    checkVisibility();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cis_page_visibility_updated") {
        checkVisibility();
      }
    };
    window.addEventListener("storage", handleStorage);

    const handleCustomVisibility = () => {
      checkVisibility();
    };
    window.addEventListener("cis_visibility_changed", handleCustomVisibility);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("cis_visibility_channel");
        channel.onmessage = () => {
          checkVisibility();
        };
      } catch (_) {}
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cis_visibility_changed", handleCustomVisibility);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  // Admin routes and static files are never guarded
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/api")) {
    return <>{children}</>;
  }

  // Determine slug from pathname:
  // e.g. "/about/faculty" -> check "about/faculty", "faculty", and parent "about"
  const cleanPath = (pathname || "").replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  const pathParts = cleanPath.split("/");
  const firstSegment = pathParts[0] || "";
  const lastSegment = pathParts[pathParts.length - 1] || "home";

  const isCurrentPageDisabled =
    cleanPath === ""
      ? disabledPaths.has("home") || disabledPaths.has("/")
      : disabledPaths.has(cleanPath) ||
        disabledPaths.has("/" + cleanPath) ||
        disabledPaths.has(lastSegment) ||
        disabledPaths.has("/" + lastSegment) ||
        (pathParts.length > 1 && (disabledPaths.has(firstSegment) || disabledPaths.has("/" + firstSegment)));

  if (loaded && isCurrentPageDisabled) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-lg w-full text-center space-y-6 glass-card p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
              Page Under Maintenance
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              Page Currently Inactive
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              This page has been temporarily unpublished by Cambridge International School administration or is undergoing curriculum updates.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-school-primary text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>Contact School Office</span>
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 flex items-center justify-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Cambridge International School, Mandi</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
