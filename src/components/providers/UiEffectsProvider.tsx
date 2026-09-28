"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import UiEffectsSelectorModal, {
  UiEffectsConfig,
} from "@/components/ui/UiEffectsSelectorModal";

interface UiEffectsContextType {
  config: UiEffectsConfig;
  updateConfig: (newConfig: Partial<UiEffectsConfig>) => void;
  openSelectorModal: () => void;
  closeSelectorModal: () => void;
  isModalOpen: boolean;
}

const DEFAULT_CONFIG: UiEffectsConfig = {
  spotlightCards: true,
  magneticButtons: true,
  imageZoom: true,
  floatingHeader: true,
  slidingTabs: true,
  readingProgressBar: true,
  marqueeTicker: true,
  kineticTypography: true,
  spotlightGlowColor: "rgba(245, 158, 11, 0.22)",
  photoLightBorderEffect: true,
  photoLightBorderMode: "cyanGold",
};

const UiEffectsContext = createContext<UiEffectsContextType | undefined>(undefined);

export function UiEffectsProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<UiEffectsConfig>(DEFAULT_CONFIG);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Apply attributes to document root
  const applyConfigToDOM = useCallback((cfg: UiEffectsConfig) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.dataset.spotlightCards = String(cfg.spotlightCards);
    root.dataset.magneticButtons = String(cfg.magneticButtons);
    root.dataset.imageZoom = String(cfg.imageZoom);
    root.dataset.floatingHeader = String(cfg.floatingHeader);
    root.dataset.slidingTabs = String(cfg.slidingTabs);
    root.dataset.readingProgressBar = String(cfg.readingProgressBar);
    root.dataset.marqueeTicker = String(cfg.marqueeTicker);
    root.dataset.kineticTypography = String(cfg.kineticTypography);
    root.style.setProperty("--spotlight-glow-color", cfg.spotlightGlowColor);
  }, []);

  // Fetch initial config from backend
  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/ui-effects");
      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          const merged = { ...DEFAULT_CONFIG, ...data.config };
          setConfig(merged);
          applyConfigToDOM(merged);
        }
      }
    } catch (err) {
      console.warn("Using default UI effects config:", err);
      applyConfigToDOM(DEFAULT_CONFIG);
    }
  }, [applyConfigToDOM]);

  useEffect(() => {
    applyConfigToDOM(DEFAULT_CONFIG);
    fetchConfig();
  }, [fetchConfig, applyConfigToDOM]);

  // Scroll listener for reading progress bar
  useEffect(() => {
    if (!config.readingProgressBar) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const scrollPercent = (totalScroll / windowHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [config.readingProgressBar]);

  // Mouse listener for spotlight cards
  useEffect(() => {
    if (!config.spotlightCards) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(".sqsp-spotlight, .spotlight-card, .clean-card, .glass-card");
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      (target as HTMLElement).style.setProperty("--mouse-x", `${x}%`);
      (target as HTMLElement).style.setProperty("--mouse-y", `${y}%`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [config.spotlightCards]);

  const updateConfig = (newConfig: Partial<UiEffectsConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      applyConfigToDOM(updated);
      return updated;
    });
  };

  return (
    <UiEffectsContext.Provider
      value={{
        config,
        updateConfig,
        openSelectorModal: () => setIsModalOpen(true),
        closeSelectorModal: () => setIsModalOpen(false),
        isModalOpen,
      }}
    >
      {/* 1. Hairline Reading Progress Bar (Squarespace style) */}
      {config.readingProgressBar && (
        <div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 z-[99999] pointer-events-none transition-transform duration-75 origin-left"
          style={{
            transform: `scaleX(${Math.max(scrollProgress / 100, 0.005)})`,
            boxShadow: "0 0 14px rgba(245, 158, 11, 0.85), 0 0 5px rgba(56, 189, 248, 0.7)",
          }}
        />
      )}

      {children}

      {/* Global UI Effects Selector Modal */}
      <UiEffectsSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(newCfg) => {
          setConfig(newCfg);
          applyConfigToDOM(newCfg);
        }}
      />
    </UiEffectsContext.Provider>
  );
}

export function useUiEffects() {
  const context = useContext(UiEffectsContext);
  if (!context) {
    return {
      config: DEFAULT_CONFIG,
      updateConfig: () => {},
      openSelectorModal: () => {},
      closeSelectorModal: () => {},
      isModalOpen: false,
    };
  }
  return context;
}
