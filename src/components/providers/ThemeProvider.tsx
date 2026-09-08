"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Language = "en" | "hi";

interface ThemeConfigData {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  darkBgColor?: string;
  cardBgColor?: string;
  textColor?: string;
  glassOpacity?: number;
  glowIntensity?: number;
  fontFamily?: string;
  borderRadius?: string;
  logoMode?: string;
  logoImageUrl?: string | null;
  logoHeight?: number;
  customCss?: string;
  headerButtonsJson?: string | null;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  themeConfig: ThemeConfigData | null;
  refreshTheme: () => Promise<void>;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    applyNow: "Apply for Admission",
    scheduleVisit: "Schedule a Campus Tour",
    downloadProspectus: "Download Prospectus",
    virtualTour: "360° Virtual Tour",
    cbseAffiliated: "CBSE Affiliated No. 630198 | Senior Secondary",
    admissionsOpen: "Admissions Open for Session 2025-2026 (Nursery to Grade XI)",
    callUs: "Call Admissions",
    contactUs: "Contact Us",
    quickEnquiry: "Quick Enquiry",
    academics: "Academics",
    facilities: "Campus Facilities",
    aboutUs: "About Us",
    admissions: "Admissions",
    gallery: "Gallery",
    newsEvents: "News & Events",
    mandatoryDisclosure: "CBSE Mandatory Disclosure",
    exploreCampus: "Explore Cambridge Mandi",
    whyChooseUs: "Why Cambridge Mandi?",
    students: "Happy Students",
    faculty: "Expert Faculty",
    distinction: "Distinction Rate",
    awards: "State & National Awards",
    latestAnnouncements: "Latest Circulars & Notices",
    viewAll: "View All",
    readMore: "Read More",
    applyOnline: "Online Registration Form",
  },
  hi: {
    applyNow: "प्रवेश के लिए आवेदन करें",
    scheduleVisit: "कैंपस भ्रमण का समय तय करें",
    downloadProspectus: "विवरणिका डाउनलोड करें",
    virtualTour: "360° वर्चुअल टूर",
    cbseAffiliated: "सीबीएसई संबद्धता सं. 630198 | सीनियर सेकेंडरी",
    admissionsOpen: "सत्र 2025-2026 के लिए प्रवेश प्रारंभ (नर्सरी से 11वीं कक्षा)",
    callUs: "प्रवेश हेल्पलाइन",
    contactUs: "संपर्क करें",
    quickEnquiry: "त्वरित पूछताछ",
    academics: "शिक्षा व पाठ्यक्रम",
    facilities: "परिसर सुविधाएं",
    aboutUs: "हमारे बारे में",
    admissions: "प्रवेश प्रक्रिया",
    gallery: "चित्र दीर्घा",
    newsEvents: "समाचार एवं कार्यक्रम",
    mandatoryDisclosure: "सीबीएसई अनिवार्य प्रकटीकरण",
    exploreCampus: "कैम्ब्रिज मंडी का अन्वेषण करें",
    whyChooseUs: "कैम्ब्रिज इंटरनेशनल ही क्यों?",
    students: "उत्साही विद्यार्थी",
    faculty: "अनुभवी शिक्षक",
    distinction: "विशिष्टता दर",
    awards: "राष्ट्रीय व राज्य पुरस्कार",
    latestAnnouncements: "नवीनतम सूचनाएं व परिपत्र",
    viewAll: "सभी देखें",
    readMore: "और पढ़ें",
    applyOnline: "ऑनलाइन प्रवेश फॉर्म",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");
  const [themeConfig, setThemeConfig] = useState<ThemeConfigData | null>(null);
  const [mounted, setMounted] = useState(false);

  const applyThemeVariables = (cfg: ThemeConfigData) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (cfg.primaryColor) root.style.setProperty("--color-school-primary", cfg.primaryColor);
    if (cfg.secondaryColor) root.style.setProperty("--color-school-secondary", cfg.secondaryColor);
    if (cfg.accentColor) root.style.setProperty("--color-school-accent", cfg.accentColor);
    if (cfg.darkBgColor) root.style.setProperty("--color-school-dark", cfg.darkBgColor);
    if (cfg.cardBgColor) root.style.setProperty("--color-school-card", cfg.cardBgColor);
    if (cfg.glassOpacity !== undefined) root.style.setProperty("--glass-opacity", String(cfg.glassOpacity));
    if (cfg.glowIntensity !== undefined) root.style.setProperty("--glow-intensity", String(cfg.glowIntensity));
    if (cfg.fontFamily) root.style.setProperty("--site-font", cfg.fontFamily);
  };

  const fetchTheme = async () => {
    try {
      const res = await fetch("/api/theme");
      if (res.ok) {
        const data = await res.json();
        if (data.theme) {
          setThemeConfig(data.theme);
          applyThemeVariables(data.theme);
        }
      }
    } catch (err) {
      console.warn("Theme load fallback to defaults:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("cis_theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
    const savedLang = localStorage.getItem("cis_lang") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }

    fetchTheme();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("cis_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("cis_lang", lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage: changeLanguage,
        t,
        themeConfig,
        refreshTheme: fetchTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
