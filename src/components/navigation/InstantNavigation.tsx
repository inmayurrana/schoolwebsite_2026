"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

const CRITICAL_ROUTES = [
  "/",
  "/about",
  "/about/mission-vision",
  "/about/chairman-message",
  "/about/principal-message",
  "/academics",
  "/admissions",
  "/admissions/apply",
  "/facilities",
  "/facilities/smart-classrooms",
  "/facilities/robotics-lab",
  "/facilities/sports-complex",
  "/contact",
  "/achievements",
  "/gallery",
  "/downloads",
  "/careers",
];

export default function InstantNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1. Idle Background Warmup of Core Routes
  useEffect(() => {
    const idlePrefetch = () => {
      // Prefetch critical pages sequentially during browser idle
      let index = 0;
      const prefetchNext = () => {
        if (index >= CRITICAL_ROUTES.length) return;
        const route = CRITICAL_ROUTES[index++];
        try {
          router.prefetch(route);
        } catch (_) {}

        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(prefetchNext, { timeout: 1500 });
        } else {
          setTimeout(prefetchNext, 80);
        }
      };

      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(prefetchNext, { timeout: 2000 });
      } else {
        setTimeout(prefetchNext, 200);
      }
    };

    idlePrefetch();
  }, [router]);

  // 2. High-Performance Pointer & Hover Preloader
  useEffect(() => {
    const handlePreload = (e: Event) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/admin") &&
        !href.startsWith("/api") &&
        !href.startsWith("/_next") &&
        !href.includes("#")
      ) {
        try {
          router.prefetch(href);
        } catch (_) {}
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      // If internal navigation to a different path
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("/api") &&
        !href.includes("#") &&
        href !== pathname
      ) {
        setIsNavigating(true);
        setProgress(25);
        const t1 = setTimeout(() => setProgress(75), 100);
        const t2 = setTimeout(() => setProgress(90), 300);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    };

    // Listen on pointer events for fastest possible reaction (fires before click)
    document.addEventListener("pointerenter", handlePreload, { passive: true, capture: true });
    document.addEventListener("pointerdown", handlePreload, { passive: true, capture: true });
    document.addEventListener("touchstart", handlePreload, { passive: true });
    document.addEventListener("click", handleClick, { passive: true, capture: true });

    return () => {
      document.removeEventListener("pointerenter", handlePreload, { capture: true });
      document.removeEventListener("pointerdown", handlePreload, { capture: true });
      document.removeEventListener("touchstart", handlePreload);
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [router, pathname]);

  // 3. Complete and Fade-out Progress Bar on Route Change
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-all duration-300 ease-out"
      style={{
        opacity: isNavigating ? 1 : 0,
      }}
    >
      {/* Sleek 2.5px Golden Progress Line */}
      <div
        className="h-[2.5px] bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 shadow-[0_0_12px_rgba(251,191,36,0.85)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
