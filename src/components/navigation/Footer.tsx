"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
