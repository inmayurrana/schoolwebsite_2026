"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Phone,
  Sun,
  Moon,
  Globe,
  FileText,
  Award,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  BookOpen,
  Building2,
  Users,
  Calendar,
  Lock,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { getInitialDisabledSlugs, fetchClientDisabledSlugs, updateClientVisibilityCache } from "@/lib/clientVisibility";

const DEFAULT_NAV_LINKS = [
  {
    label: "Home",
    key: "home",
    href: "/",
  },
  {
    label: "About Us",
    key: "about",
    href: "/about",
    children: [
      { title: "About School & Heritage", href: "/about", desc: "Our history, Cambridge legacy & Himalayan campus" },
      { title: "Mission & Vision", href: "/about/mission-vision", desc: "Core values, philosophy & global perspective" },
      { title: "Chairman's Message", href: "/about/chairman-message", desc: "Guiding vision & leadership ethos" },
      { title: "Principal's Desk", href: "/about/principal-message", desc: "Welcome address & academic excellence" },
        { title: "Faculty & Mentors", href: "/about/faculty", desc: "Our experienced teachers, department heads & mentors" },
    ],
  },
  {
    label: "Academics",
    key: "academics",
    href: "/academics",
    children: [
      { title: "Academic Curriculum", href: "/academics", desc: "CBSE & Cambridge integrated learning framework" },
      { title: "Pre-Primary (Early Years)", href: "/academics/pre-primary", desc: "Montessori & experiential kindergarten" },
      { title: "Primary Wing (Grades 1-5)", href: "/academics/primary", desc: "Foundational conceptual knowledge" },
      { title: "Middle School (Grades 6-8)", href: "/academics/middle-school", desc: "STEM, critical thinking & discovery" },
      { title: "Senior Secondary (Grades 9-12)", href: "/academics/senior-secondary", desc: "Medical, Non-Med, Commerce & Humanities" },
    ],
  },
  {
    label: "Admissions",
    key: "admissions",
    href: "/admissions",
    highlight: true,
    children: [
      { title: "Admissions 2027-28 Hub", href: "/admissions", desc: "Overview, eligibility criteria & age matrix" },
      { title: "Admission Procedure", href: "/admissions/procedure", desc: "Step-by-step registration & enrollment" },
      { title: "Fees Structure & Schedule", href: "/admissions/fees-structure", desc: "Transparent tuition & transport breakdown" },
      { title: "Scholarships & Awards", href: "/admissions/scholarships", desc: "Merit, sports & defence fee waivers" },
      { title: "Apply Online (Registration)", href: "/admissions/apply", desc: "Fill dynamic admission form & get Instant ID" },
    ],
  },
  {
    label: "Campus Facilities",
    key: "facilities",
    href: "/facilities",
    children: [
      { title: "Facilities Overview", href: "/facilities", desc: "World-class 10-acre Himalayan campus infrastructure" },
      { title: "Smart Classrooms", href: "/facilities/smart-classrooms", desc: "4K interactive panels & digital podiums" },
      { title: "Science & AI Labs", href: "/facilities/science-labs", desc: "Physics, Chemistry, Biology & Biotech" },
      { title: "Robotics & Innovation Lab", href: "/facilities/robotics-lab", desc: "3D printing, IoT, drones & humanoid robots" },
      { title: "Central Library", href: "/facilities/library", desc: "25,000+ books & digital e-learning pods" },
      { title: "Sports Complex", href: "/facilities/sports-complex", desc: "Olympic heated pool, FIFA turf & synthetic courts" },
      { title: "Residential Hostel", href: "/facilities/hostel", desc: "Safe boarding with nutritious dining & study halls" },
      { title: "Transport Fleet", href: "/facilities/transport", desc: "GPS & CCTV enabled luxury bus fleet in Mandi" },
    ],
  },
  {
    label: "Student Life & Laurels",
    key: "student-life",
    href: "/student-life",
    children: [
      { title: "Student Life & Clubs", href: "/student-life", desc: "House system, MUN, arts, dance & music" },
      { title: "Hall of Fame & Achievements", href: "/achievements", desc: "National Olympiads & sports gold medalists" },
      { title: "CBSE Board Results", href: "/results", desc: "Class 10 & 12 state toppers & subject distinctions" },
      { title: "Photo & Video Gallery", href: "/gallery", desc: "Campus albums, celebrations & event archives" },
      { title: "360° Virtual Campus Tour", href: "/virtual-tour", desc: "Immersive panoramic walk through CIS Mandi" },
    ],
  },
  {
    label: "Disclosures & Connect",
    key: "compliance",
    href: "/contact",
    children: [
      { title: "Latest News & Circulars", href: "/news", desc: "Official school bulletins & notifications" },
      { title: "Upcoming Events Calendar", href: "/events", desc: "Competitions, sports meet & annual fest" },
      { title: "Downloads & Documents", href: "/downloads", desc: "Syllabus, book lists, datesheets & forms" },
      { title: "CBSE Mandatory Disclosure", href: "/mandatory-disclosure", desc: "OASIS / SARAS compliance documents" },
      { title: "CBSE School Information", href: "/cbse-information", desc: "Affiliation status, committee & faculty list" },
      { title: "Careers at CIS Mandi", href: "/careers", desc: "Teaching vacancies & online application" },
      { title: "Contact Us & Location", href: "/contact", desc: "Inquiries, helpline numbers & Google Maps" },
    ],
  },
  {
    label: "Login",
    key: "login",
    href: "https://econnectapp.jupsoft.com/sisStudentLoginNew.aspx?id=oclymPdodvY=",
    children: [
      {
        title: "Student Login",
        href: "https://econnectapp.jupsoft.com/sisStudentLoginNew.aspx?id=oclymPdodvY=",
        desc: "Student & Parent eConnect Portal (Fee receipts, Report cards & Attendance)",
        external: true,
      },
      {
        title: "Staff ERP Login",
        href: "https://econnectapp.jupsoft.com/sisLogin.aspx?id=3niF+20efVQ=",
        desc: "Staff, Teacher & Employee eConnect ERP Portal",
        external: true,
      },
      {
        title: "Admin CMS Login",
        href: "/admin/login",
        desc: "School website content management system",
      },
    ],
  },
];

let cachedSiteSettings: Record<string, string> | null = null;
let cachedNavLinks: any[] | null = null;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { theme, toggleTheme, language, setLanguage, t, themeConfig } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    cbse_affiliation_no: "630198",
    school_code: "43190",
    school_level: "Senior Secondary",
    contact_phone: "+91 1905 223456 / +91 98160 99999",
  });

  const [navLinks, setNavLinks] = useState<any[]>(cachedNavLinks || DEFAULT_NAV_LINKS);
  const [disabledSlugs, setDisabledSlugs] = useState<Set<string>>(() => getInitialDisabledSlugs());

  useEffect(() => {
    async function loadVisibility(force = false) {
      const set = await fetchClientDisabledSlugs(force);
      setDisabledSlugs(new Set(set));
    }
    loadVisibility();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cis_page_visibility_updated" || e.key === "cis_disabled_slugs") {
        loadVisibility(true);
      }
    };
    window.addEventListener("storage", handleStorage);

    // Custom local event listener for instant in-memory sync (0ms)
    const handleCustomVisibility = (e?: any) => {
      if (e?.detail?.disabledSlugs && Array.isArray(e.detail.disabledSlugs)) {
        updateClientVisibilityCache(e.detail.disabledSlugs);
        setDisabledSlugs(new Set(e.detail.disabledSlugs));
      } else {
        loadVisibility(true);
      }
    };
    window.addEventListener("cis_visibility_changed", handleCustomVisibility);

    // BroadcastChannel support for multi-tab in-memory sync
    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("cis_visibility_channel");
        channel.onmessage = (event) => {
          if (event?.data?.disabledSlugs && Array.isArray(event.data.disabledSlugs)) {
            updateClientVisibilityCache(event.data.disabledSlugs);
            setDisabledSlugs(new Set(event.data.disabledSlugs));
          } else {
            loadVisibility(true);
          }
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

  const isPathDisabled = (href: string): boolean => {
    if (!href || href.startsWith("http") || href.startsWith("#")) return false;
    const clean = href.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
    const lastSeg = clean.split("/").pop() || "";
    return (
      disabledSlugs.has(clean) ||
      disabledSlugs.has("/" + clean) ||
      disabledSlugs.has(lastSeg) ||
      disabledSlugs.has("/" + lastSeg) ||
      disabledSlugs.has(href.toLowerCase())
    );
  };

  const visibleNavLinks = React.useMemo(() => {
    if (disabledSlugs.size === 0) return navLinks;
    return navLinks
      .map((item: any) => {
        // If the main parent item is disabled, hide the entire section
        if (isPathDisabled(item.href) || isPathDisabled(item.key)) {
          return null;
        }
        if (item.children && Array.isArray(item.children)) {
          const validChildren = item.children.filter((child: any) => !isPathDisabled(child.href));
          // If all sub-pages are disabled, hide parent
          if (validChildren.length === 0) return null;
          return { ...item, children: validChildren };
        }
        return item;
      })
      .filter(Boolean);
  }, [navLinks, disabledSlugs]);


  useEffect(() => {
    if (cachedSiteSettings && cachedNavLinks) {
      setSiteSettings(cachedSiteSettings);
      setNavLinks(cachedNavLinks);
      return;
    }

    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Array.isArray(data.settings)) {
            const map: Record<string, string> = {};
            data.settings.forEach((s: any) => {
              map[s.key] = s.value;
            });
            cachedSiteSettings = { ...siteSettings, ...map };
            setSiteSettings(cachedSiteSettings);

            if (map.header_nav_links) {
              try {
                const parsed = JSON.parse(map.header_nav_links);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  cachedNavLinks = parsed;
                  setNavLinks(parsed);
                }
              } catch (e) {}
            }
          }
        }

        // Fetch custom pages configured with menu locations
        try {
          const menuRes = await fetch("/api/pages/menu-items", { cache: "no-store" });
          if (menuRes.ok) {
            const menuData = await menuRes.json();
            if (menuData.menuItems && Array.isArray(menuData.menuItems) && menuData.menuItems.length > 0) {
              setNavLinks((prevLinks) => {
                return prevLinks.map((cat: any) => {
                  const itemsForCat = menuData.menuItems.filter((mi: any) => mi.menuLocation === cat.key);
                  if (itemsForCat.length === 0) return cat;

                  const existingHrefs = new Set((cat.children || []).map((c: any) => c.href));
                  const newChildren = [...(cat.children || [])];

                  for (const mi of itemsForCat) {
                    if (!existingHrefs.has(mi.href)) {
                      newChildren.push({
                        title: mi.title,
                        href: mi.href,
                        desc: mi.desc,
                      });
                    }
                  }
                  return { ...cat, children: newChildren };
                });
              });
            }
          }
        } catch (_) {}
      } catch (e) {}
    }
    loadSettings();
  }, []);

  const logoUrl = siteSettings.header_logo_url || themeConfig?.logoImageUrl;
  const logoMode = siteSettings.header_logo_mode || themeConfig?.logoMode || "IMAGE_ONLY";
  const logoHeight = parseInt(siteSettings.header_logo_height) || themeConfig?.logoHeight || 48;

  // School Logo Border Light & Celestial Shining Settings
  const logoBorderLightEnabled = siteSettings.header_logo_border_light_enabled === "true";
  const logoBorderColor = siteSettings.header_logo_border_color || "#F59E0B";
  const logoBorderWidth = parseFloat(siteSettings.header_logo_border_width) || 2;
  const logoLightStyle = siteSettings.header_logo_light_style || "glow";
  const logoGlowIntensity = siteSettings.header_logo_glow_intensity || "vibrant";
  const logoBgContainer = siteSettings.header_logo_bg_container || "TRANSPARENT";
  const logoBorderRadius = siteSettings.header_logo_border_radius || "rounded-xl";
  const logoShineEnabled = siteSettings.header_logo_shine_enabled === "true";
  const logoShineStyle = siteSettings.header_logo_shine_style || "sweep";
  const logoShineSpeed = siteSettings.header_logo_shine_speed || "normal";

  // Compute Shadow Bloom for School Logo
  let logoShadow = "none";
  if (logoBorderLightEnabled && logoLightStyle !== "laser-border" && logoLightStyle !== "orbit-beam") {
    const op1 = logoGlowIntensity === "soft" ? "66" : logoGlowIntensity === "medium" ? "99" : "dd";
    const op2 = logoGlowIntensity === "soft" ? "33" : logoGlowIntensity === "medium" ? "66" : "aa";
    if (logoLightStyle === "neon") {
      logoShadow = `0 0 10px ${logoBorderColor}${op1}, inset 0 0 6px ${logoBorderColor}${op2}`;
    } else if (logoLightStyle === "dual") {
      logoShadow = `0 0 0 1.5px #ffffff, 0 0 14px ${logoBorderColor}${op1}, inset 0 0 4px ${logoBorderColor}${op2}`;
    } else if (logoLightStyle === "plasma-halo") {
      logoShadow = `0 0 4px #ffffff, 0 0 16px ${logoBorderColor}, 0 0 32px ${logoBorderColor}aa, inset 0 0 8px ${logoBorderColor}77`;
    } else if (logoLightStyle === "crystal-glass") {
      logoShadow = `inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.7), 0 4px 16px 0 ${logoBorderColor}55`;
    } else if (logoLightStyle === "subtle") {
      logoShadow = `0 0 6px ${logoBorderColor}${op2}`;
    } else {
      // default radiant glow
      logoShadow = `0 0 12px ${logoBorderColor}${op1}, 0 0 24px ${logoBorderColor}${op2}, inset 0 0 4px ${logoBorderColor}${op2}`;
    }
  }

  // Reset imgError when logoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const showImageOnly = logoMode === "IMAGE_ONLY" && logoUrl && !imgError;
  const showImageAndText = logoMode === "IMAGE_AND_TEXT" && logoUrl && !imgError;

  let headerButtons: any[] = [
    { id: "apply-btn", label: "Apply for Admission", url: "/admissions/apply", variant: "primary", isVisible: true },
    { id: "careers-btn", label: "Careers", url: "/careers", variant: "secondary", isVisible: true },
    { id: "pay-btn", label: "Pay Fee Online", url: "/admissions/fees-structure", variant: "accent", isVisible: true },
  ];

  if (siteSettings.header_buttons_json) {
    try {
      const parsed = JSON.parse(siteSettings.header_buttons_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure Careers button is present after Apply for Admission
        const hasCareers = parsed.some((b: any) => b.url === "/careers" || b.id?.includes("career") || b.label?.toLowerCase().includes("career"));
        if (!hasCareers) {
          const applyIdx = parsed.findIndex((b: any) => b.url?.includes("/admissions/apply") || b.id?.includes("apply"));
          const careerBtn = { id: "btn-careers", label: "Careers", url: "/careers", variant: "secondary", isVisible: true };
          if (applyIdx !== -1) {
            parsed.splice(applyIdx + 1, 0, careerBtn);
          } else {
            parsed.splice(1, 0, careerBtn);
          }
        }
        headerButtons = parsed;
      }
    } catch (e) {}
  } else if (themeConfig?.headerButtonsJson) {
    try {
      const parsed = JSON.parse(themeConfig.headerButtonsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasCareers = parsed.some((b: any) => b.url === "/careers" || b.id?.includes("career") || b.label?.toLowerCase().includes("career"));
        if (!hasCareers) {
          const applyIdx = parsed.findIndex((b: any) => b.url?.includes("/admissions/apply") || b.id?.includes("apply"));
          const careerBtn = { id: "careers-link", label: "Careers", url: "/careers", variant: "secondary", isVisible: true };
          if (applyIdx !== -1) {
            parsed.splice(applyIdx + 1, 0, careerBtn);
          } else {
            parsed.splice(1, 0, careerBtn);
          }
        }
        headerButtons = parsed;
      }
    } catch (e) {}
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const topBarVisible = siteSettings.header_topbar_visible !== "false";

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Top Notification & Fast Access Bar */}
      {topBarVisible && (
        <header className="bg-school-primary text-white text-xs border-b border-white/10 relative z-50 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
            {/* Left: Affiliation & Helpline */}
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1 text-amber-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {siteSettings.header_affiliation_text ||
                    `CBSE Affiliated No. ${siteSettings.cbse_affiliation_no || "630198"} | ${siteSettings.school_level || "Senior Secondary"}`}
                </span>
              </span>
              <span className="hidden md:inline text-white/40">|</span>
              <span className="hidden md:flex items-center space-x-1 text-slate-300">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>
                  {siteSettings.header_phone_text ||
                    `Admissions: ${siteSettings.contact_phone || "+91 1905 223456 / +91 98160 99999"}`}
                </span>
              </span>
            </div>

            {/* Right: Quick Links, Language & Theme Toggle */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {!isPathDisabled("/mandatory-disclosure") && (
              <Link prefetch={true}
                href="/mandatory-disclosure"
                className="hover:text-amber-400 transition-colors hidden lg:inline"
              >
                CBSE Mandatory Disclosure
              </Link>
              )}



              {/* Theme Toggle */}
              {siteSettings.header_show_theme_toggle !== "false" && (
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 hover:text-amber-400 transition-colors"
                >
                  {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Clean Sticky Header */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          scrolled ? "glass-nav shadow-lg" : "bg-white dark:bg-[#030816] border-b border-slate-200 dark:border-slate-800 shadow-sm"
        }`}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center justify-between h-20 w-full gap-2 xl:gap-4">
            {/* School Logo & Brand - Anchored Left */}
            <Link prefetch={true}
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex-shrink-0 flex items-center space-x-3 group py-1 cursor-pointer select-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 border-0 ring-0 rounded-xl transition-all mr-2 lg:mr-4"
              title="Cambridge International School Mandi - Home"
              aria-label="Cambridge International School Mandi Homepage"
            >
              {showImageOnly ? (
                <div
                  className={`relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 ${
                    logoBgContainer === "WHITE_CONTAINER"
                      ? "bg-white/95 px-3 py-1.5 shadow-sm"
                      : logoBgContainer === "GLASS_CONTAINER"
                      ? "bg-white/10 dark:bg-white/5 backdrop-blur-md px-3 py-1.5"
                      : logoBgContainer === "NAVY_CONTAINER"
                      ? "bg-[#0A2540] px-3 py-1.5"
                      : "bg-transparent p-0.5"
                  } ${logoBorderRadius}`}
                  style={{
                    border:
                      logoBorderLightEnabled && logoLightStyle !== "laser-border"
                        ? `${logoBorderWidth}px solid ${logoBorderColor}`
                        : "none",
                    boxShadow: logoBorderLightEnabled ? logoShadow : "none",
                  }}
                >
                  {/* Laser / Orbit Border FX */}
                  {logoBorderLightEnabled && logoLightStyle === "laser-border" && (
                    <div className="absolute -inset-[2.5px] rounded-[inherit] overflow-hidden pointer-events-none -z-10">
                      <div
                        className="absolute -inset-[100%] w-[300%] h-[300%]"
                        style={{
                          background: `conic-gradient(from 0deg, transparent 0deg, ${logoBorderColor} 60deg, #ffffff 120deg, ${logoBorderColor} 180deg, transparent 240deg)`,
                          animation: "logoLaserSpin 3.5s linear infinite",
                        }}
                      />
                    </div>
                  )}
                  {logoBorderLightEnabled && logoLightStyle === "orbit-beam" && (
                    <div className="absolute -inset-[2px] rounded-[inherit] overflow-hidden pointer-events-none -z-10">
                      <div
                        className="absolute -inset-[100%] w-[300%] h-[300%]"
                        style={{
                          background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${logoBorderColor} 330deg, #ffffff 360deg)`,
                          animation: "logoLaserSpin 2.0s linear infinite",
                        }}
                      />
                    </div>
                  )}

                  <img
                    src={logoUrl!}
                    alt="Cambridge International School, Mandi"
                    style={{ maxHeight: `${Math.min(logoHeight, 64)}px` }}
                    onError={() => setImgError(true)}
                    className="w-auto max-w-[210px] sm:max-w-xs object-contain group-hover:scale-105 transition-transform relative z-10"
                  />

                  {/* Shining Effects Layer */}
                  {logoShineEnabled && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-20">
                      {logoShineStyle === "sweep" && (
                        <div
                          className="absolute top-0 bottom-0 w-[55%] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none transform -skew-x-25"
                          style={{
                            animation: `logoShineSweep ${
                              logoShineSpeed === "fast" ? 2.5 : logoShineSpeed === "gentle" ? 6 : 4
                            }s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                          }}
                        />
                      )}
                      {logoShineStyle === "gold" && (
                        <div
                          className="absolute top-0 bottom-0 w-[55%] bg-gradient-to-r from-transparent via-amber-300/85 to-transparent pointer-events-none transform -skew-x-25"
                          style={{
                            animation: `logoShineSweep ${
                              logoShineSpeed === "fast" ? 2.5 : logoShineSpeed === "gentle" ? 6 : 4
                            }s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                          }}
                        />
                      )}
                      {logoShineStyle === "rainbow" && (
                        <div
                          className="absolute inset-0 mix-blend-color-dodge opacity-60 pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(115deg, transparent 15%, rgba(255,0,128,0.45) 25%, rgba(0,242,254,0.55) 45%, rgba(255,230,0,0.65) 55%, rgba(168,85,247,0.55) 70%, transparent 85%)",
                            backgroundSize: "200% 200%",
                            animation: `logoRainbowPrism ${
                              logoShineSpeed === "fast" ? 3 : logoShineSpeed === "gentle" ? 7 : 4.5
                            }s ease-in-out infinite`,
                          }}
                        />
                      )}
                      {logoShineStyle === "cyber-arc" && (
                        <div
                          className="absolute inset-0 rounded-[inherit] pointer-events-none"
                          style={{
                            border: `1.5px solid #00F2FE`,
                            animation: `logoCyberArc ${
                              logoShineSpeed === "fast" ? 2.5 : logoShineSpeed === "gentle" ? 5 : 3.5
                            }s ease-in-out infinite`,
                          }}
                        >
                          <div className="absolute top-0 left-1/4 w-3.5 h-[2px] bg-white shadow-[0_0_10px_#00F2FE]" />
                          <div className="absolute bottom-0 right-1/4 w-3.5 h-[2px] bg-white shadow-[0_0_10px_#A855F7]" />
                        </div>
                      )}
                      {logoShineStyle === "star" && (
                        <>
                          <div
                            className="absolute top-1 right-2 pointer-events-none z-30"
                            style={{ animation: `logoStarGleam 2.2s ease-in-out infinite alternate` }}
                          >
                            <div className="relative flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                              <div className="absolute w-5 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
                              <div className="absolute h-5 w-[1.5px] bg-gradient-to-b from-transparent via-white to-transparent" />
                              <div className="absolute w-3 h-[1px] bg-amber-300 transform rotate-45" />
                              <div className="absolute w-3 h-[1px] bg-amber-300 transform -rotate-45" />
                            </div>
                          </div>
                          <div
                            className="absolute bottom-1 left-3 pointer-events-none z-30"
                            style={{ animation: `logoStarGleam 2.8s ease-in-out 0.8s infinite alternate` }}
                          >
                            <div className="relative flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                              <div className="absolute w-4 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                              <div className="absolute h-4 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
                            </div>
                          </div>
                        </>
                      )}
                      {logoShineStyle === "meteor" && (
                        <div
                          className="absolute -top-6 -left-12 w-28 h-40 pointer-events-none overflow-hidden z-30"
                          style={{
                            animation: `logoCometStreak ${
                              logoShineSpeed === "fast" ? 2 : logoShineSpeed === "gentle" ? 5 : 3.2
                            }s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
                          }}
                        >
                          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_14px_#ffffff,0_0_24px_#F59E0B]" />
                          <div className="h-0.5 w-24 bg-gradient-to-r from-white via-amber-300 to-transparent -translate-y-1.5" />
                        </div>
                      )}
                      {logoShineStyle === "diamond" && (
                        <>
                          <div
                            className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none z-30"
                            style={{
                              animation: `logoDiamondGlint ${
                                logoShineSpeed === "fast" ? 2.2 : logoShineSpeed === "gentle" ? 4.5 : 3.0
                              }s ease-in-out infinite`,
                            }}
                          >
                            <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
                            <div className="absolute w-5 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
                            <div className="absolute h-5 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent" />
                          </div>
                          <div
                            className="absolute top-1/3 right-1/4 w-3.5 h-3.5 flex items-center justify-center pointer-events-none z-30"
                            style={{
                              animation: `logoDiamondGlint ${
                                logoShineSpeed === "fast" ? 2.6 : logoShineSpeed === "gentle" ? 5.0 : 3.6
                              }s ease-in-out 1.2s infinite`,
                            }}
                          >
                            <div className="w-1 h-1 bg-amber-200 rounded-full shadow-[0_0_8px_#F59E0B]" />
                            <div className="absolute w-4 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                            <div className="absolute h-4 w-0.5 bg-gradient-to-b from-transparent via-amber-200 to-transparent" />
                          </div>
                        </>
                      )}
                      {logoShineStyle === "aurora" && (
                        <div
                          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
                          style={{
                            background:
                              "linear-gradient(120deg, rgba(16,185,129,0.35), rgba(0,242,254,0.45), rgba(168,85,247,0.35), rgba(245,158,11,0.35))",
                            backgroundSize: "250% 250%",
                            animation: `logoAuroraFlow ${
                              logoShineSpeed === "fast" ? 3 : logoShineSpeed === "gentle" ? 8 : 5
                            }s ease-in-out infinite`,
                          }}
                        />
                      )}
                      {logoShineStyle === "pulse" && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-amber-300/30 to-purple-400/20 mix-blend-overlay pointer-events-none"
                          style={{
                            animation: `logoHoloPulse ${
                              logoShineSpeed === "fast" ? 2.2 : logoShineSpeed === "gentle" ? 5 : 3.5
                            }s ease-in-out infinite alternate`,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : showImageAndText ? (
                <>
                  <div
                    className={`relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 ${
                      logoBgContainer === "WHITE_CONTAINER"
                        ? "bg-white/95 px-2 py-1 shadow-sm"
                        : logoBgContainer === "GLASS_CONTAINER"
                        ? "bg-white/10 dark:bg-white/5 backdrop-blur-md px-2 py-1"
                        : logoBgContainer === "NAVY_CONTAINER"
                        ? "bg-[#0A2540] px-2 py-1"
                        : "bg-transparent p-0.5"
                    } ${logoBorderRadius}`}
                    style={{
                      border:
                        logoBorderLightEnabled && logoLightStyle !== "laser-border" && logoLightStyle !== "orbit-beam"
                          ? `${logoBorderWidth}px solid ${logoBorderColor}`
                          : "none",
                      boxShadow: logoBorderLightEnabled ? logoShadow : "none",
                    }}
                  >
                    {logoBorderLightEnabled && logoLightStyle === "laser-border" && (
                      <div className="absolute -inset-[2.5px] rounded-[inherit] overflow-hidden pointer-events-none -z-10">
                        <div
                          className="absolute -inset-[100%] w-[300%] h-[300%]"
                          style={{
                            background: `conic-gradient(from 0deg, transparent 0deg, ${logoBorderColor} 60deg, #ffffff 120deg, ${logoBorderColor} 180deg, transparent 240deg)`,
                            animation: "logoLaserSpin 3.5s linear infinite",
                          }}
                        />
                      </div>
                    )}
                    {logoBorderLightEnabled && logoLightStyle === "orbit-beam" && (
                      <div className="absolute -inset-[2px] rounded-[inherit] overflow-hidden pointer-events-none -z-10">
                        <div
                          className="absolute -inset-[100%] w-[300%] h-[300%]"
                          style={{
                            background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${logoBorderColor} 330deg, #ffffff 360deg)`,
                            animation: "logoLaserSpin 2.0s linear infinite",
                          }}
                        />
                      </div>
                    )}

                    <img
                      src={logoUrl!}
                      alt="Cambridge Logo"
                      style={{ height: `${logoHeight}px` }}
                      onError={() => setImgError(true)}
                      className="w-auto object-contain max-h-16 group-hover:scale-105 transition-transform relative z-10"
                    />

                    {logoShineEnabled && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-20">
                        {logoShineStyle === "sweep" && (
                          <div
                            className="absolute top-0 bottom-0 w-[55%] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none transform -skew-x-25"
                            style={{
                              animation: `logoShineSweep ${
                                logoShineSpeed === "fast" ? 2.5 : logoShineSpeed === "gentle" ? 6 : 4
                              }s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                            }}
                          />
                        )}
                        {logoShineStyle === "gold" && (
                          <div
                            className="absolute top-0 bottom-0 w-[55%] bg-gradient-to-r from-transparent via-amber-300/85 to-transparent pointer-events-none transform -skew-x-25"
                            style={{
                              animation: `logoShineSweep ${
                                logoShineSpeed === "fast" ? 2.5 : logoShineSpeed === "gentle" ? 6 : 4
                              }s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                            }}
                          />
                        )}
                        {logoShineStyle === "rainbow" && (
                          <div
                            className="absolute inset-0 mix-blend-color-dodge opacity-60 pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(115deg, transparent 15%, rgba(255,0,128,0.45) 25%, rgba(0,242,254,0.55) 45%, rgba(255,230,0,0.65) 55%, rgba(168,85,247,0.55) 70%, transparent 85%)",
                              backgroundSize: "200% 200%",
                              animation: `logoRainbowPrism ${
                                logoShineSpeed === "fast" ? 3 : logoShineSpeed === "gentle" ? 7 : 4.5
                              }s ease-in-out infinite`,
                            }}
                          />
                        )}
                        {logoShineStyle === "cyber-arc" && (
                          <div
                            className="absolute inset-0 rounded-[inherit] pointer-events-none"
                            style={{
                              border: `1.5px solid #00F2FE`,
                              animation: `logoCyberArc ${
                                logoShineSpeed === "fast" ? 2.5 : logoShineSpeed === "gentle" ? 5 : 3.5
                              }s ease-in-out infinite`,
                            }}
                          >
                            <div className="absolute top-0 left-1/4 w-3.5 h-[2px] bg-white shadow-[0_0_10px_#00F2FE]" />
                            <div className="absolute bottom-0 right-1/4 w-3.5 h-[2px] bg-white shadow-[0_0_10px_#A855F7]" />
                          </div>
                        )}
                        {logoShineStyle === "star" && (
                          <>
                            <div
                              className="absolute top-1 right-2 pointer-events-none z-30"
                              style={{ animation: `logoStarGleam 2.2s ease-in-out infinite alternate` }}
                            >
                              <div className="relative flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                                <div className="absolute w-5 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
                                <div className="absolute h-5 w-[1.5px] bg-gradient-to-b from-transparent via-white to-transparent" />
                              </div>
                            </div>
                            <div
                              className="absolute bottom-1 left-2 pointer-events-none z-30"
                              style={{ animation: `logoStarGleam 2.8s ease-in-out 0.8s infinite alternate` }}
                            >
                              <div className="relative flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                                <div className="absolute w-4 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                                <div className="absolute h-4 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
                              </div>
                            </div>
                          </>
                        )}
                        {logoShineStyle === "meteor" && (
                          <div
                            className="absolute -top-6 -left-12 w-28 h-40 pointer-events-none overflow-hidden z-30"
                            style={{
                              animation: `logoCometStreak ${
                                logoShineSpeed === "fast" ? 2 : logoShineSpeed === "gentle" ? 5 : 3.2
                              }s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
                            }}
                          >
                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_14px_#ffffff,0_0_24px_#F59E0B]" />
                            <div className="h-0.5 w-24 bg-gradient-to-r from-white via-amber-300 to-transparent -translate-y-1.5" />
                          </div>
                        )}
                        {logoShineStyle === "diamond" && (
                          <>
                            <div
                              className="absolute top-1/2 left-1/3 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none z-30"
                              style={{
                                animation: `logoDiamondGlint ${
                                  logoShineSpeed === "fast" ? 2.2 : logoShineSpeed === "gentle" ? 4.5 : 3.0
                                }s ease-in-out infinite`,
                              }}
                            >
                              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
                              <div className="absolute w-5 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
                              <div className="absolute h-5 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent" />
                            </div>
                            <div
                              className="absolute top-1/3 right-1/4 w-3.5 h-3.5 flex items-center justify-center pointer-events-none z-30"
                              style={{
                                animation: `logoDiamondGlint ${
                                  logoShineSpeed === "fast" ? 2.6 : logoShineSpeed === "gentle" ? 5.0 : 3.6
                                }s ease-in-out 1.2s infinite`,
                              }}
                            >
                              <div className="w-1 h-1 bg-amber-200 rounded-full shadow-[0_0_8px_#F59E0B]" />
                              <div className="absolute w-4 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                              <div className="absolute h-4 w-0.5 bg-gradient-to-b from-transparent via-amber-200 to-transparent" />
                            </div>
                          </>
                        )}
                        {logoShineStyle === "aurora" && (
                          <div
                            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
                            style={{
                              background:
                                "linear-gradient(120deg, rgba(16,185,129,0.35), rgba(0,242,254,0.45), rgba(168,85,247,0.35), rgba(245,158,11,0.35))",
                              backgroundSize: "250% 250%",
                              animation: `logoAuroraFlow ${
                                logoShineSpeed === "fast" ? 3 : logoShineSpeed === "gentle" ? 8 : 5
                              }s ease-in-out infinite`,
                            }}
                          />
                        )}
                        {logoShineStyle === "pulse" && (
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-amber-300/30 to-purple-400/20 mix-blend-overlay pointer-events-none"
                            style={{
                              animation: `logoHoloPulse ${
                                logoShineSpeed === "fast" ? 2.2 : logoShineSpeed === "gentle" ? 5 : 3.5
                              }s ease-in-out infinite alternate`,
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-school-primary dark:text-white leading-tight tracking-tight whitespace-nowrap">
                      {siteSettings.header_brand_title || "CAMBRIDGE"}
                    </span>
                    <span className="text-[11px] font-bold tracking-widest text-school-secondary uppercase whitespace-nowrap">
                      {siteSettings.header_brand_subtitle || "International School, Mandi"}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium whitespace-nowrap">
                      {siteSettings.header_brand_tagline || "Himachal Pradesh • CBSE Affiliated"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-school-primary to-school-secondary flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-105 transition-transform border border-amber-400/40 flex-shrink-0 relative overflow-hidden`}
                    style={{
                      boxShadow: logoBorderLightEnabled ? logoShadow : undefined,
                    }}
                  >
                    <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />

                    {logoShineEnabled && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] z-20">
                        <div
                          className="absolute top-0 bottom-0 w-[60%] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none transform -skew-x-25"
                          style={{
                            animation: `logoShineSweep 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading font-extrabold text-base sm:text-lg text-school-primary dark:text-white leading-tight tracking-tight whitespace-nowrap">
                      {siteSettings.header_brand_title || "CAMBRIDGE"}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-school-secondary uppercase whitespace-nowrap">
                      {siteSettings.header_brand_subtitle || "International School, Mandi"}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium whitespace-nowrap">
                      {siteSettings.header_brand_tagline || "Himachal Pradesh • CBSE Affiliated"}
                    </span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation Links with Clean Single-Line Alignment */}
            <div className="hidden xl:flex items-center justify-center flex-1 space-x-1 2xl:space-x-2 min-w-0">
              {visibleNavLinks.map((item: any) => (
                <div
                  key={item.key}
                  className="relative group flex-shrink-0"
                  onMouseEnter={() => item.children && setActiveDropdown(item.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href} prefetch={true}
                    className={`inline-flex items-center space-x-1 px-2.5 2xl:px-3 py-2 rounded-xl text-[13px] 2xl:text-sm font-semibold tracking-tight whitespace-nowrap transition-all ${
                      pathname === item.href
                        ? "text-school-secondary dark:text-amber-400 font-extrabold bg-blue-50/80 dark:bg-white/5"
                        : item.highlight
                        ? "text-school-secondary dark:text-amber-400 hover:bg-slate-100/60 dark:hover:bg-white/5"
                        : "text-slate-700 dark:text-slate-200 hover:text-school-secondary dark:hover:text-amber-400 hover:bg-slate-100/60 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.children && (
                      <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-200 shrink-0 ml-0.5" />
                    )}
                  </Link>

                  {/* Mega Glass Dropdown Menu */}
                  {item.children && activeDropdown === item.key && (
                    <div className="absolute top-full left-0 w-80 glass-panel rounded-2xl shadow-2xl p-3 pt-2 grid gap-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map((child: any, idx: number) => (
                        <Link
                          key={idx}
                          href={child.href} prefetch={true}
                          target={child.external ? "_blank" : undefined}
                          rel={child.external ? "noopener noreferrer" : undefined}
                          className="p-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 transition-all group/item block border border-transparent hover:border-slate-200/50 dark:hover:border-white/10"
                        >
                          <div className="font-bold text-xs text-school-primary dark:text-white group-hover/item:text-school-secondary dark:group-hover/item:text-amber-400 flex items-center justify-between">
                            <span className="flex items-center space-x-1.5">
                              <span>{child.title}</span>
                              {child.external && (
                                <ExternalLink className="w-3 h-3 text-amber-500 flex-shrink-0" />
                              )}
                            </span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-school-secondary dark:text-amber-400" />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {child.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions: Header Action Buttons */}
            <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
              {headerButtons.map((btn: any) => {
                if (btn.isVisible === false) return null;

                if (btn.variant === "login") {
                  return (
                    <Link prefetch={true}
                      key={btn.id}
                      href={btn.url || "/admin/login"}
                      target={btn.openNewTab ? "_blank" : undefined}
                      rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                      className="glass-btn inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-400 dark:hover:text-amber-400 transition-all shadow-sm group cursor-pointer whitespace-nowrap"
                      title={btn.label || "Login Portal"}
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                      <span className="whitespace-nowrap">{btn.label || "Login"}</span>
                    </Link>
                  );
                }

                if (btn.variant === "secondary" || btn.url === "/careers" || btn.id === "btn-careers" || btn.id === "careers-btn" || btn.label?.toLowerCase() === "careers") {
                  const isCareer = btn.url === "/careers" || btn.id?.includes("career") || btn.label?.toLowerCase().includes("career");
                  return (
                    <Link prefetch={true}
                      key={btn.id}
                      href={btn.url || (isCareer ? "/careers" : "#")}
                      target={btn.openNewTab ? "_blank" : undefined}
                      rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                      className="glass-btn inline-flex items-center space-x-1.5 px-3.5 2xl:px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-school-secondary dark:hover:text-amber-400 hover:bg-slate-100/80 dark:hover:bg-white/10 transition-all shadow-sm hover:scale-105 border border-slate-200 dark:border-white/10 whitespace-nowrap group cursor-pointer"
                      title={btn.label || (isCareer ? "Careers" : "Link")}
                    >
                      {isCareer && (
                        <Briefcase className="w-3.5 h-3.5 text-school-secondary dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                      )}
                      <span className="whitespace-nowrap">{btn.label || (isCareer ? "Careers" : "Learn More")}</span>
                    </Link>
                  );
                }

                if (btn.variant === "outline") {
                  return (
                    <Link prefetch={true}
                      key={btn.id}
                      href={btn.url || "#"}
                      target={btn.openNewTab ? "_blank" : undefined}
                      rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                      className="glass-btn inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-school-primary dark:text-white transition-all whitespace-nowrap"
                    >
                      <span className="whitespace-nowrap">{btn.label}</span>
                    </Link>
                  );
                }

                if (btn.variant === "accent") {
                  return (
                    <Link prefetch={true}
                      key={btn.id}
                      href={btn.url || "#"}
                      target={btn.openNewTab ? "_blank" : undefined}
                      rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center space-x-1.5 px-3.5 2xl:px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-md hover:scale-105 border border-amber-300/60 whitespace-nowrap"
                    >
                      <span className="whitespace-nowrap">{btn.label}</span>
                    </Link>
                  );
                }

                // Default Primary Gradient Button (e.g. Apply Now)
                return (
                  <Link prefetch={true}
                    key={btn.id}
                    href={btn.url || "/admissions/apply"}
                    target={btn.openNewTab ? "_blank" : undefined}
                    rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                    className="relative inline-flex items-center justify-center space-x-1.5 bg-gradient-to-r from-school-secondary via-blue-600 to-school-primary hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs px-4 2xl:px-5 py-2 rounded-xl shadow-md hover:shadow-glow-blue hover:scale-105 transition-all duration-300 border border-blue-400/30 whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="whitespace-nowrap">{btn.label || t("applyNow")}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex xl:hidden items-center space-x-2">
              <Link prefetch={true}
                href="/admissions/apply"
                className="bg-gradient-to-r from-school-secondary to-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow whitespace-nowrap"
              >
                Apply
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 rounded-xl glass-btn text-slate-700 dark:text-slate-200"
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Glass Drawer */}
        {mobileOpen && (
          <div className="xl:hidden glass-panel border-b border-slate-200/60 dark:border-white/10 max-h-[85vh] overflow-y-auto px-4 py-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
            {visibleNavLinks.map((section: any) => (
              <div key={section.key} className="space-y-2 border-b border-slate-200/40 dark:border-white/5 pb-4 last:border-0">
                <Link prefetch={true}
                  href={section.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-bold text-sm text-school-primary dark:text-white flex items-center justify-between"
                >
                  <span className={section.highlight ? "text-school-secondary dark:text-amber-400 font-extrabold" : ""}>
                    {section.label}
                  </span>
                </Link>
                {section.children && (
                  <div className="pl-3 space-y-2 border-l border-slate-200 dark:border-slate-800">
                    {section.children.map((item: any, idx: number) => (
                      <Link
                        key={idx}
                        href={item.href} prefetch={true}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className="block text-xs text-slate-600 dark:text-slate-300 hover:text-school-secondary dark:hover:text-amber-400 py-1"
                      >
                        <div className="font-semibold flex items-center space-x-1">
                          <span>{item.title}</span>
                          {item.external && <ExternalLink className="w-3 h-3 text-amber-500" />}
                        </div>
                        {item.desc && <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-2 space-y-2">
              <Link prefetch={true}
                href="/admissions/apply"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-gradient-to-r from-school-secondary to-blue-600 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Apply for Admission 2027</span>
              </Link>
              <Link prefetch={true}
                href="/careers"
                onClick={() => setMobileOpen(false)}
                className="w-full glass-btn text-slate-800 dark:text-slate-100 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 border border-slate-200 dark:border-white/10 hover:border-amber-400/50"
              >
                <Briefcase className="w-4 h-4 text-school-secondary dark:text-amber-400" />
                <span>Careers at CIS Mandi</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
