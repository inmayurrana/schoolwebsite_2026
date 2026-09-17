"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink,
  Heart,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

interface FooterColumnLink {
  label: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
}

interface FooterColumn {
  id: string;
  title: string;
  links: FooterColumnLink[];
}

const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: "col-1",
    title: "Academics & Wings",
    links: [
      { label: "Early Years / Pre-Primary", href: "/academics/pre-primary" },
      { label: "Primary Wing (Grade 1-5)", href: "/academics/primary" },
      { label: "Middle Wing (Grade 6-8)", href: "/academics/middle-school" },
      { label: "Senior Secondary (Science/Comm/Arts)", href: "/academics/senior-secondary" },
      { label: "Faculty & Mentors Directory", href: "/about/faculty" },
      { label: "STEM & AI Robotics Lab", href: "/facilities/robotics-lab" },
      { label: "Olympic Sports Complex", href: "/facilities/sports-complex" },
      { label: "Himalayan Residential Hostel", href: "/facilities/hostel" },
    ],
  },
  {
    id: "col-2",
    title: "Admissions & Hubs",
    links: [
      { label: "Online Admission Form 2027-28", href: "/admissions/apply", highlight: true },
      { label: "Admission Procedure & Criteria", href: "/admissions/procedure" },
      { label: "Fees Structure Matrix", href: "/admissions/fees-structure" },
      { label: "Merit & Sports Scholarships", href: "/admissions/scholarships" },
      { label: "CBSE Mandatory Disclosure (OASIS)", href: "/mandatory-disclosure" },
      { label: "Downloads, Forms & Syllabus", href: "/downloads" },
      { label: "Careers & Faculty Vacancies", href: "/careers" },
    ],
  },
  {
    id: "col-3",
    title: "Campus Facilities",
    links: [
      { label: "Smart 4K Classrooms", href: "/facilities/smart-classrooms" },
      { label: "Science & AI Labs", href: "/facilities/science-labs" },
      { label: "Central Digital Library", href: "/facilities/library" },
      { label: "Transport Fleet & Routes", href: "/facilities/transport" },
      { label: "Photo & Video Gallery", href: "/gallery" },
      { label: "360° Virtual Campus Tour", href: "/virtual-tour" },
    ],
  },
];

export default function Footer() {
  const { themeConfig } = useTheme();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
    cbse_affiliation_no: "630198",
    school_code: "43190",
    school_level: "Senior Secondary",
    contact_phone: "+91 1905 223456 / +91 98160 99999",
    contact_email: "admissions@cismandi.org",
    school_address: "Cambridge International School, Near Victoria Bridge, Mandi, Himachal Pradesh - 175001",
  });

  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>(DEFAULT_FOOTER_COLUMNS);
  const [disabledSlugs, setDisabledSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadVisibility() {
      try {
        const res = await fetch("/api/pages/visibility", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.visibility) {
            const set = new Set<string>();
            Object.entries(data.visibility).forEach(([k, v]) => {
              if (v === false) {
                set.add(k.toLowerCase().trim());
                set.add("/" + k.toLowerCase().trim());
              }
            });
            setDisabledSlugs(set);
          }
        }
      } catch (_) {}
    }
    loadVisibility();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cis_page_visibility_updated") {
        loadVisibility();
      }
    };
    window.addEventListener("storage", handleStorage);

    const handleCustomVisibility = () => {
      loadVisibility();
    };
    window.addEventListener("cis_visibility_changed", handleCustomVisibility);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        channel = new BroadcastChannel("cis_visibility_channel");
        channel.onmessage = () => {
          loadVisibility();
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

            if (map.footer_columns_json) {
              try {
                const parsed = JSON.parse(map.footer_columns_json);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setFooterColumns(parsed);
                }
              } catch (e) {}
            }
          }
        }
      } catch (e) {}
    }
    loadSettings();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  // Determine separate footer logo
  const footerLogoUrl = siteSettings.footer_logo_url || themeConfig?.logoImageUrl || "";
  const footerLogoHeight = parseInt(siteSettings.footer_logo_height) || themeConfig?.logoHeight || 52;
  const footerLogoContainer = siteSettings.footer_logo_container || "WHITE_CONTAINER";

  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-b from-[#020617] via-[#051322] to-slate-950 text-white relative overflow-hidden border-t border-white/10 w-full">
      {/* Decorative Glow */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-school-primary/30 to-transparent pointer-events-none" />

      {/* Main Footer Container */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: School Identity & Accreditations */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center space-x-3 group cursor-pointer" aria-label="Cambridge Mandi Homepage">
              {footerLogoUrl ? (
                <div
                  className={
                    footerLogoContainer === "WHITE_CONTAINER"
                      ? "bg-white px-3.5 py-1.5 rounded-xl shadow-md inline-flex items-center group-hover:scale-105 transition-transform"
                      : footerLogoContainer === "GLASS_CONTAINER"
                      ? "bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 inline-flex items-center group-hover:scale-105 transition-transform"
                      : "inline-flex items-center group-hover:scale-105 transition-transform"
                  }
                >
                  <img
                    src={footerLogoUrl}
                    alt="Cambridge International School, Mandi"
                    style={{ height: `${footerLogoHeight}px` }}
                    className="w-auto object-contain max-h-20"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-school-secondary flex items-center justify-center text-amber-400 shadow-xl border border-amber-400/30 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
              )}
              {themeConfig?.logoMode !== "IMAGE_ONLY" && !footerLogoUrl && (
                <div>
                  <span className="font-heading font-extrabold text-xl text-white tracking-tight group-hover:text-amber-300 transition-colors">
                    {siteSettings.header_brand_title || "CAMBRIDGE"}
                  </span>
                  <span className="block text-xs font-bold text-amber-400 tracking-widest uppercase">
                    {siteSettings.header_brand_subtitle || "International School, Mandi"}
                  </span>
                </div>
              )}
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              {siteSettings.footer_about_text ||
                "Cambridge International School Mandi is a premier CBSE day-cum-residential co-educational institution in Himachal Pradesh. We blend global Cambridge pedagogical standards with Indian cultural ethos to nurture compassionate, future-ready global leaders."}
            </p>

            {/* CBSE Accreditation Badge */}
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex items-center space-x-3">
              <ShieldCheck className="w-8 h-8 text-amber-400 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">
                  {siteSettings.footer_affiliation_badge || `CBSE Affiliated ${siteSettings.school_level || "Senior Secondary"} School`}
                </p>
                <p className="text-slate-400">
                  {siteSettings.footer_affiliation_sub ||
                    `Affiliation No. ${siteSettings.cbse_affiliation_no || "630198"} | School Code: ${siteSettings.school_code || "43190"}`}
                </p>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-2 space-y-2">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Connect With Us On Social Media
              </p>
              <div className="flex items-center space-x-2.5">
                {/* Facebook */}
                <a
                  href={siteSettings.facebook_url || "https://facebook.com/cismandi"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 flex items-center justify-center transition-all shadow-md hover:scale-110 group"
                  title="Follow CIS Mandi on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href={siteSettings.youtube_url || "https://youtube.com/@cismandi"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 flex items-center justify-center transition-all shadow-md hover:scale-110 group"
                  title="Subscribe to CIS Mandi on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href={siteSettings.instagram_url || "https://instagram.com/cismandi_official"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/30 flex items-center justify-center transition-all shadow-md hover:scale-110 group"
                  title="Follow CIS Mandi on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${(siteSettings.whatsapp_number || "919816099999").replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 flex items-center justify-center transition-all shadow-md hover:scale-110 group"
                  title="Chat with CIS Mandi on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Subscribe to School Circulars & Newsletter
              </p>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Thank you! You have subscribed to official updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter parent's email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-900/90 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-school-secondary hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Dynamic Columns 2, 3, 4 */}
          {footerColumns.slice(0, 2).map((col, idx) => (
            <div key={col.id || idx} className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    idx === 0 ? "bg-amber-400" : "bg-school-secondary"
                  }`}
                />
                <span>{col.title}</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={`transition-colors flex items-center space-x-1.5 ${
                        link.highlight
                          ? "text-amber-400 font-semibold hover:underline"
                          : "hover:text-amber-400"
                      }`}
                    >
                      <ChevronRight
                        className={`w-3 h-3 ${
                          link.highlight ? "text-amber-400" : "text-slate-600"
                        }`}
                      />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Information Column */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Campus Contact</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  {siteSettings.school_address ||
                    "Near Victoria Bridge, Gutkar / Mandi Bypass, Mandi, Himachal Pradesh - 175001, India"}
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  {siteSettings.contact_phone || "+91 1905 223456 / +91 98160 99999"}
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{siteSettings.contact_email || "admissions@cismandi.org"}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{siteSettings.footer_hours || "Mon – Sat: 8:00 AM – 4:30 PM (Sun Closed)"}</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  <span>Interactive Map & Driving Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & CMS Shortcut */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {siteSettings.footer_copyright_text ||
              `© ${new Date().getFullYear()} Cambridge International School, Mandi. All Rights Reserved.`}
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy & Terms
            </Link>
            <span>•</span>
            <a
              href="https://econnectapp.jupsoft.com/sisStudentLoginNew.aspx?id=oclymPdodvY="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center space-x-1"
            >
              <span>Student ERP</span>
            </a>
            <span>•</span>
            <a
              href="https://econnectapp.jupsoft.com/sisLogin.aspx?id=3niF+20efVQ="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors inline-flex items-center space-x-1"
            >
              <span>Staff ERP</span>
            </a>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-amber-400 transition-colors inline-flex items-center space-x-1">
              <Lock className="w-3 h-3 text-amber-500" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
