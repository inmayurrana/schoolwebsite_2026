"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

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

export default function Navbar() {
  const pathname = usePathname();
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

  const [navLinks, setNavLinks] = useState<any[]>(DEFAULT_NAV_LINKS);

  useEffect(() => {
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
            setSiteSettings((prev) => ({ ...prev, ...map }));

            if (map.header_nav_links) {
              try {
                const parsed = JSON.parse(map.header_nav_links);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setNavLinks(parsed);
                }
              } catch (e) {}
            }
          }
        }
      } catch (e) {}
    }
    loadSettings();
  }, []);

  const logoUrl = siteSettings.header_logo_url || themeConfig?.logoImageUrl;
  const logoMode = siteSettings.header_logo_mode || themeConfig?.logoMode || "IMAGE_ONLY";
  const logoHeight = parseInt(siteSettings.header_logo_height) || themeConfig?.logoHeight || 48;

  // Reset imgError when logoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const showImageOnly = logoMode === "IMAGE_ONLY" && logoUrl && !imgError;
  const showImageAndText = logoMode === "IMAGE_AND_TEXT" && logoUrl && !imgError;

  let headerButtons: any[] = [
    { id: "apply-btn", label: "Apply for Admission", url: "/admissions/apply", variant: "primary", isVisible: true },
    { id: "pay-btn", label: "Pay Fee Online", url: "/admissions/fees-structure", variant: "accent", isVisible: true },
  ];

  if (siteSettings.header_buttons_json) {
    try {
      const parsed = JSON.parse(siteSettings.header_buttons_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        headerButtons = parsed;
      }
    } catch (e) {}
  } else if (themeConfig?.headerButtonsJson) {
    try {
      const parsed = JSON.parse(themeConfig.headerButtonsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
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

  return (
    <>
      {/* Top Notification & Fast Access Bar */}
      {topBarVisible && (
        <header className="bg-school-primary text-white text-xs border-b border-white/10 relative z-50 w-full">
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
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
              <Link
                href="/mandatory-disclosure"
                className="hover:text-amber-400 transition-colors hidden lg:inline"
              >
                CBSE Mandatory Disclosure
              </Link>

              <Link
                href="/downloads"
                className="hover:text-amber-400 transition-colors hidden sm:inline"
              >
                Downloads
              </Link>

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
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-20">
            {/* School Logo & Brand */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-3 group py-1 cursor-pointer select-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 border-0 ring-0 rounded-xl transition-all"
              title="Cambridge International School Mandi - Home"
              aria-label="Cambridge International School Mandi Homepage"
            >
              {showImageOnly ? (
                <img
                  src={logoUrl!}
                  alt="Cambridge International School, Mandi"
                  style={{ height: `${logoHeight}px` }}
                  onError={() => setImgError(true)}
                  className="w-auto object-contain max-h-16 group-hover:scale-105 transition-transform"
                />
              ) : showImageAndText ? (
                <>
                  <img
                    src={logoUrl!}
                    alt="Cambridge Logo"
                    style={{ height: `${logoHeight}px` }}
                    onError={() => setImgError(true)}
                    className="w-auto object-contain max-h-14 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-school-primary dark:text-white leading-tight tracking-tight">
                      {siteSettings.header_brand_title || "CAMBRIDGE"}
                    </span>
                    <span className="text-[11px] font-bold tracking-widest text-school-secondary uppercase">
                      {siteSettings.header_brand_subtitle || "International School, Mandi"}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                      {siteSettings.header_brand_tagline || "Himachal Pradesh • CBSE Affiliated"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-school-primary to-school-secondary flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-105 transition-transform border border-amber-400/40 flex-shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-school-primary dark:text-white leading-tight tracking-tight">
                      {siteSettings.header_brand_title || "CAMBRIDGE"}
                    </span>
                    <span className="text-[11px] font-bold tracking-widest text-school-secondary uppercase">
                      {siteSettings.header_brand_subtitle || "International School, Mandi"}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                      {siteSettings.header_brand_tagline || "Himachal Pradesh • CBSE Affiliated"}
                    </span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation Links with Glass Dropdowns */}
            <div className="hidden xl:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((item) => (
                <div
                  key={item.key}
                  className="relative group"
                  onMouseEnter={() => item.children && setActiveDropdown(item.key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      pathname === item.href
                        ? "text-school-secondary dark:text-amber-400 font-extrabold bg-blue-50/80 dark:bg-white/5"
                        : item.highlight
                        ? "text-school-secondary dark:text-amber-400 hover:bg-slate-100/60 dark:hover:bg-white/5"
                        : "text-slate-700 dark:text-slate-200 hover:text-school-secondary dark:hover:text-amber-400 hover:bg-slate-100/60 dark:hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.children && (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </Link>

                  {/* Mega Glass Dropdown Menu */}
                  {item.children && activeDropdown === item.key && (
                    <div className="absolute top-full left-0 w-80 glass-panel rounded-2xl shadow-2xl p-3 pt-2 grid gap-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map((child: any, idx: number) => (
                        <Link
                          key={idx}
                          href={child.href}
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
            <div className="hidden sm:flex items-center space-x-2.5">
              {headerButtons.map((btn: any) => {
                if (btn.isVisible === false) return null;

                if (btn.variant === "login") {
                  return (
                    <Link
                      key={btn.id}
                      href={btn.url || "/admin/login"}
                      target={btn.openNewTab ? "_blank" : undefined}
                      rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                      className="glass-btn inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-amber-400 dark:hover:text-amber-400 transition-all shadow-sm group cursor-pointer"
                      title={btn.label || "Login Portal"}
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                      <span>{btn.label || "Login"}</span>
                    </Link>
                  );
                }

                if (btn.variant === "outline") {
                  return (
                    <Link
                      key={btn.id}
                      href={btn.url || "#"}
                      target={btn.openNewTab ? "_blank" : undefined}
                      rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                      className="glass-btn inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-school-primary dark:text-white transition-all"
                    >
                      <span>{btn.label}</span>
                    </Link>
                  );
                }

                if (btn.variant === "accent") {
                  return (
                    <Link
                      key={btn.id}
                      href={btn.url || "#"}
                      target={btn.openNewTab ? "_blank" : undefined}
                      rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg hover:scale-105 border border-amber-300/60"
                    >
                      <span>{btn.label}</span>
                    </Link>
                  );
                }

                // Default Primary Gradient Button (e.g. Apply Now)
                return (
                  <Link
                    key={btn.id}
                    href={btn.url || "/admissions/apply"}
                    target={btn.openNewTab ? "_blank" : undefined}
                    rel={btn.openNewTab ? "noopener noreferrer" : undefined}
                    className="relative inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-school-secondary via-blue-600 to-school-primary hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:shadow-glow-blue hover:scale-105 transition-all duration-300 border border-blue-400/30"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{btn.label || t("applyNow")}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex xl:hidden items-center space-x-2">
              <Link
                href="/admissions/apply"
                className="bg-gradient-to-r from-school-secondary to-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow"
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
            {navLinks.map((section: any) => (
              <div key={section.key} className="space-y-2 border-b border-slate-200/40 dark:border-white/5 pb-4 last:border-0">
                <Link
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
                        href={item.href}
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
              <Link
                href="/admissions/apply"
                onClick={() => setMobileOpen(false)}
                className="w-full bg-gradient-to-r from-school-secondary to-blue-600 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Apply for Admission 2027</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
