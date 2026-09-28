"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutTemplate,
  Save,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  Layers,
  ArrowRight,
  Lock,
  GraduationCap,
  Image as ImageIcon,
  Upload,
  Link2,
  Sliders,
  MoveUp,
  MoveDown,
  Palette,
  Square,
  Check,
  Share2,
  Play,
  Tv,
  Sun,
  Moon,
  Zap,
} from "lucide-react";

interface NavChildItem {
  title: string;
  href: string;
  desc?: string;
  external?: boolean;
}

interface NavItem {
  key: string;
  label: string;
  href: string;
  highlight?: boolean;
  children?: NavChildItem[];
}

interface HeaderButton {
  id: string;
  label: string;
  url: string;
  variant: "primary" | "secondary" | "accent" | "outline" | "login";
  openNewTab?: boolean;
  isVisible: boolean;
}

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

const DEFAULT_NAV_LINKS: NavItem[] = [
  { label: "Home", key: "home", href: "/" },
  {
    label: "About Us",
    key: "about",
    href: "/about",
    children: [
      { title: "About School & Heritage", href: "/about", desc: "Our history, Cambridge legacy & Himalayan campus" },
      { title: "Mission & Vision", href: "/about/mission-vision", desc: "Core values, philosophy & global perspective" },
      { title: "Chairman's Message", href: "/about/chairman-message", desc: "Guiding vision & leadership ethos" },
      { title: "Principal's Desk", href: "/about/principal-message", desc: "Welcome address & academic excellence" },
      { title: "Faculty & Mentors", href: "/about/faculty", desc: "Our experienced teachers, department heads & academic guides" },
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

const DEFAULT_HEADER_BUTTONS: HeaderButton[] = [
  { id: "btn-apply", label: "Apply for Admission", url: "/admissions/apply", variant: "primary", isVisible: true },
  { id: "btn-fees", label: "Pay Fee Online", url: "/admissions/fees-structure", variant: "accent", isVisible: true },
];

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

export default function AdminHeaderFooterStudio() {
  const [activeTab, setActiveTab] = useState<"header" | "footer" | "social" | "preview">("header");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHeaderLogo, setUploadingHeaderLogo] = useState(false);
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Header Settings State
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [affiliationText, setAffiliationText] = useState("CBSE Affiliated No. 630198 | Senior Secondary");
  const [phoneText, setPhoneText] = useState("Admissions: +91 1905 223456 / +91 98160 99999");
  const [showThemeToggle, setShowThemeToggle] = useState(true);
  const [brandTitle, setBrandTitle] = useState("CAMBRIDGE");
  const [brandSubtitle, setBrandSubtitle] = useState("International School, Mandi");
  const [brandTagline, setBrandTagline] = useState("Himachal Pradesh • CBSE Affiliated");

  const [headerLogoUrl, setHeaderLogoUrl] = useState("/uploads/2__2721_x_847__866bc89cf18d.jpg");
  const [headerLogoMode, setHeaderLogoMode] = useState<"IMAGE_ONLY" | "TEXT_AND_ICON" | "IMAGE_AND_TEXT">("IMAGE_ONLY");
  const [headerLogoHeight, setHeaderLogoHeight] = useState(50);

  // Browser Tab Icon (Favicon) & Border Light Effect State
  const [siteFaviconUrl, setSiteFaviconUrl] = useState("/uploads/LOGO_c_72ead6e76f87.webp");
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [faviconLightEffect, setFaviconLightEffect] = useState(true);
  const [faviconBorderColor, setFaviconBorderColor] = useState("#F59E0B"); // default imperial amber/gold
  const [faviconBorderWidth, setFaviconBorderWidth] = useState(2.5);
  const [faviconLightStyle, setFaviconLightStyle] = useState<"glow" | "neon" | "dual" | "subtle">("glow");
  const [faviconGlowIntensity, setFaviconGlowIntensity] = useState<"soft" | "medium" | "vibrant">("vibrant");
  const [faviconBgColor, setFaviconBgColor] = useState("#0A2540"); // Cambridge Navy
  const [faviconShape, setFaviconShape] = useState<"rounded" | "circle" | "square">("rounded");
  const [savingFaviconInstant, setSavingFaviconInstant] = useState(false);
  const [faviconSavedSuccess, setFaviconSavedSuccess] = useState(false);

  const [navLinks, setNavLinks] = useState<NavItem[]>(DEFAULT_NAV_LINKS);
  const [headerButtons, setHeaderButtons] = useState<HeaderButton[]>(DEFAULT_HEADER_BUTTONS);

  // Footer Settings State
  const [footerLogoMode, setFooterLogoMode] = useState<"CUSTOM_IMAGE" | "INHERIT" | "TEXT_AND_ICON" | "IMAGE_AND_TEXT" | "IMAGE_ONLY">("CUSTOM_IMAGE");
  const [footerLogoUrl, setFooterLogoUrl] = useState("");
  const [footerLogoHeight, setFooterLogoHeight] = useState(52);
  const [footerLogoContainer, setFooterLogoContainer] = useState<"TRANSPARENT" | "WHITE_CONTAINER" | "GLASS_CONTAINER">("WHITE_CONTAINER");

  const [footerAbout, setFooterAbout] = useState(
    "Cambridge International School Mandi is a premier CBSE day-cum-residential co-educational institution in Himachal Pradesh. We blend global Cambridge pedagogical standards with Indian cultural ethos to nurture compassionate, future-ready global leaders."
  );
  const [footerAffiliationBadge, setFooterAffiliationBadge] = useState("CBSE Affiliated Senior Secondary School");
  const [footerAffiliationSub, setFooterAffiliationSub] = useState("Affiliation No. 630198 | School Code: 43190");
  const [footerAddress, setFooterAddress] = useState("Near Victoria Bridge, Gutkar / Mandi Bypass, Mandi, Himachal Pradesh - 175001, India");
  const [footerPhone, setFooterPhone] = useState("+91 1905 223456 / +91 98160 99999");
  const [footerEmail, setFooterEmail] = useState("admissions@cismandi.org");
  const [footerHours, setFooterHours] = useState("Mon – Sat: 8:00 AM – 4:30 PM (Sunday Closed)");
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>(DEFAULT_FOOTER_COLUMNS);
  const [copyrightText, setCopyrightText] = useState(`© ${new Date().getFullYear()} Cambridge International School, Mandi. All Rights Reserved.`);
  
  // Social Media Links & Embeds
  const [facebookUrl, setFacebookUrl] = useState("https://facebook.com/cismandi");
  const [facebookEmbedUrl, setFacebookEmbedUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("https://instagram.com/cismandi_official");
  const [youtubeUrl, setYoutubeUrl] = useState("https://youtube.com/@cismandi");
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("https://www.youtube-nocookie.com/embed/48fO2u80pBs");
  const [whatsappNumber, setWhatsappNumber] = useState("+919816099999");
  const [twitterUrl, setTwitterUrl] = useState("https://twitter.com/cismandi");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/school/cismandi");
  const [showSocialEmbedsHome, setShowSocialEmbedsHome] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings && Array.isArray(data.settings)) {
            const map: Record<string, string> = {};
            data.settings.forEach((s: any) => {
              map[s.key] = s.value;
            });

            if (map.header_topbar_visible !== undefined) setTopBarVisible(map.header_topbar_visible === "true");
            if (map.header_affiliation_text) setAffiliationText(map.header_affiliation_text);
            if (map.header_phone_text) setPhoneText(map.header_phone_text);
            if (map.header_show_theme_toggle !== undefined) setShowThemeToggle(map.header_show_theme_toggle === "true");
            if (map.header_brand_title) setBrandTitle(map.header_brand_title);
            if (map.header_brand_subtitle) setBrandSubtitle(map.header_brand_subtitle);
            if (map.header_brand_tagline) setBrandTagline(map.header_brand_tagline);

            if (map.header_logo_url) setHeaderLogoUrl(map.header_logo_url);
            if (map.header_logo_mode) setHeaderLogoMode(map.header_logo_mode as any);
            if (map.header_logo_height) setHeaderLogoHeight(parseInt(map.header_logo_height) || 50);
            if (map.site_favicon_url) setSiteFaviconUrl(map.site_favicon_url);
            if (map.favicon_light_effect_enabled !== undefined) setFaviconLightEffect(map.favicon_light_effect_enabled === "true");
            if (map.favicon_border_color) setFaviconBorderColor(map.favicon_border_color);
            if (map.favicon_border_width) setFaviconBorderWidth(parseFloat(map.favicon_border_width) || 2.5);
            if (map.favicon_light_style) setFaviconLightStyle(map.favicon_light_style as any);
            if (map.favicon_glow_intensity) setFaviconGlowIntensity(map.favicon_glow_intensity as any);
            if (map.favicon_bg_color) setFaviconBgColor(map.favicon_bg_color);
            if (map.favicon_shape) setFaviconShape(map.favicon_shape as any);

            // Separate Footer Logo settings
            if (map.footer_logo_url) setFooterLogoUrl(map.footer_logo_url);
            if (map.footer_logo_mode) setFooterLogoMode(map.footer_logo_mode as any);
            if (map.footer_logo_height) setFooterLogoHeight(parseInt(map.footer_logo_height) || 52);
            if (map.footer_logo_container) setFooterLogoContainer(map.footer_logo_container as any);

            if (map.header_nav_links) {
              try {
                const parsed = JSON.parse(map.header_nav_links);
                if (Array.isArray(parsed) && parsed.length > 0) setNavLinks(parsed);
              } catch (e) {}
            }

            if (map.header_buttons_json) {
              try {
                const parsed = JSON.parse(map.header_buttons_json);
                if (Array.isArray(parsed) && parsed.length > 0) setHeaderButtons(parsed);
              } catch (e) {}
            }

            if (map.footer_about_text) setFooterAbout(map.footer_about_text);
            if (map.footer_affiliation_badge) setFooterAffiliationBadge(map.footer_affiliation_badge);
            if (map.footer_affiliation_sub) setFooterAffiliationSub(map.footer_affiliation_sub);
            if (map.school_address) setFooterAddress(map.school_address);
            if (map.contact_phone) setFooterPhone(map.contact_phone);
            if (map.contact_email) setFooterEmail(map.contact_email);
            if (map.footer_hours) setFooterHours(map.footer_hours);
            if (map.facebook_url) setFacebookUrl(map.facebook_url);
            if (map.facebook_embed_url !== undefined) setFacebookEmbedUrl(map.facebook_embed_url);
            if (map.instagram_url) setInstagramUrl(map.instagram_url);
            if (map.youtube_url) setYoutubeUrl(map.youtube_url);
            if (map.youtube_embed_url !== undefined) setYoutubeEmbedUrl(map.youtube_embed_url);
            if (map.whatsapp_number) setWhatsappNumber(map.whatsapp_number);
            if (map.twitter_url) setTwitterUrl(map.twitter_url);
            if (map.linkedin_url) setLinkedinUrl(map.linkedin_url);
            if (map.show_social_embeds_home !== undefined) setShowSocialEmbedsHome(map.show_social_embeds_home !== "false");
            if (map.footer_copyright_text) setCopyrightText(map.footer_copyright_text);

            if (map.footer_columns_json) {
              try {
                const parsed = JSON.parse(map.footer_columns_json);
                if (Array.isArray(parsed) && parsed.length > 0) setFooterColumns(parsed);
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.error("Failed to load header/footer settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleHeaderLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeaderLogo(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setHeaderLogoUrl(data.url);
      }
    } catch (err) {
      console.error("Header logo upload failed:", err);
    } finally {
      setUploadingHeaderLogo(false);
    }
  };

  const handleFooterLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFooterLogo(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setFooterLogoUrl(data.url);
        setFooterLogoMode("CUSTOM_IMAGE");
      }
    } catch (err) {
      console.error("Footer logo upload failed:", err);
    } finally {
      setUploadingFooterLogo(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) {
        setSiteFaviconUrl(data.url);
      }
    } catch (err) {
      console.error("Favicon upload failed:", err);
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleSaveFaviconSettings = async () => {
    setSavingFaviconInstant(true);
    setFaviconSavedSuccess(false);
    try {
      const payload = [
        { key: "site_favicon_url", value: siteFaviconUrl, category: "HEADER" },
        { key: "favicon_light_effect_enabled", value: faviconLightEffect ? "true" : "false", category: "HEADER" },
        { key: "favicon_border_color", value: faviconBorderColor, category: "HEADER" },
        { key: "favicon_border_width", value: faviconBorderWidth.toString(), category: "HEADER" },
        { key: "favicon_light_style", value: faviconLightStyle, category: "HEADER" },
        { key: "favicon_glow_intensity", value: faviconGlowIntensity, category: "HEADER" },
        { key: "favicon_bg_color", value: faviconBgColor, category: "HEADER" },
        { key: "favicon_shape", value: faviconShape, category: "HEADER" },
        { key: "favicon_version", value: Date.now().toString(), category: "HEADER" },
      ];
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      if (res.ok) {
        setFaviconSavedSuccess(true);
        setTimeout(() => setFaviconSavedSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingFaviconInstant(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");

    const payload = [
      { key: "header_topbar_visible", value: topBarVisible ? "true" : "false", category: "HEADER" },
      { key: "header_affiliation_text", value: affiliationText, category: "HEADER" },
      { key: "header_phone_text", value: phoneText, category: "HEADER" },
      { key: "header_show_theme_toggle", value: showThemeToggle ? "true" : "false", category: "HEADER" },
      { key: "header_brand_title", value: brandTitle, category: "HEADER" },
      { key: "header_brand_subtitle", value: brandSubtitle, category: "HEADER" },
      { key: "header_brand_tagline", value: brandTagline, category: "HEADER" },
      { key: "header_logo_url", value: headerLogoUrl, category: "HEADER" },
      { key: "header_logo_mode", value: headerLogoMode, category: "HEADER" },
      { key: "header_logo_height", value: headerLogoHeight.toString(), category: "HEADER" },
      { key: "site_favicon_url", value: siteFaviconUrl, category: "HEADER" },
      { key: "favicon_light_effect_enabled", value: faviconLightEffect ? "true" : "false", category: "HEADER" },
      { key: "favicon_border_color", value: faviconBorderColor, category: "HEADER" },
      { key: "favicon_border_width", value: faviconBorderWidth.toString(), category: "HEADER" },
      { key: "favicon_light_style", value: faviconLightStyle, category: "HEADER" },
      { key: "favicon_glow_intensity", value: faviconGlowIntensity, category: "HEADER" },
      { key: "favicon_bg_color", value: faviconBgColor, category: "HEADER" },
      { key: "favicon_shape", value: faviconShape, category: "HEADER" },
      { key: "favicon_version", value: Date.now().toString(), category: "HEADER" },
      { key: "header_nav_links", value: JSON.stringify(navLinks), category: "HEADER" },
      { key: "header_buttons_json", value: JSON.stringify(headerButtons), category: "HEADER" },

      // Separate Footer Logo Settings
      { key: "footer_logo_url", value: footerLogoUrl, category: "FOOTER" },
      { key: "footer_logo_mode", value: footerLogoMode, category: "FOOTER" },
      { key: "footer_logo_height", value: footerLogoHeight.toString(), category: "FOOTER" },
      { key: "footer_logo_container", value: footerLogoContainer, category: "FOOTER" },

      { key: "footer_about_text", value: footerAbout, category: "FOOTER" },
      { key: "footer_affiliation_badge", value: footerAffiliationBadge, category: "FOOTER" },
      { key: "footer_affiliation_sub", value: footerAffiliationSub, category: "FOOTER" },
      { key: "school_address", value: footerAddress, category: "CONTACT" },
      { key: "contact_phone", value: footerPhone, category: "CONTACT" },
      { key: "contact_email", value: footerEmail, category: "CONTACT" },
      { key: "footer_hours", value: footerHours, category: "FOOTER" },
      { key: "facebook_url", value: facebookUrl, category: "SOCIAL" },
      { key: "facebook_embed_url", value: facebookEmbedUrl, category: "SOCIAL" },
      { key: "instagram_url", value: instagramUrl, category: "SOCIAL" },
      { key: "youtube_url", value: youtubeUrl, category: "SOCIAL" },
      { key: "youtube_embed_url", value: youtubeEmbedUrl, category: "SOCIAL" },
      { key: "whatsapp_number", value: whatsappNumber, category: "CONTACT" },
      { key: "twitter_url", value: twitterUrl, category: "SOCIAL" },
      { key: "linkedin_url", value: linkedinUrl, category: "SOCIAL" },
      { key: "show_social_embeds_home", value: showSocialEmbedsHome ? "true" : "false", category: "HOMEPAGE" },
      { key: "footer_copyright_text", value: copyrightText, category: "FOOTER" },
      { key: "footer_columns_json", value: JSON.stringify(footerColumns), category: "FOOTER" },
    ];

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const d = await res.json();
        setError(d.error || "Failed to save header and footer configurations.");
      }
    } catch (err: any) {
      setError(err.message || "Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Nav Item Management
  const addParentNavItem = () => {
    const key = `nav-${Date.now()}`;
    setNavLinks((prev) => [
      ...prev,
      { label: "New Menu Item", key, href: "#", children: [] },
    ]);
  };

  const removeParentNavItem = (idx: number) => {
    if (confirm("Are you sure you want to delete this menu section and all its dropdown items?")) {
      setNavLinks((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const moveParentNavItem = (idx: number, dir: "up" | "down") => {
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === navLinks.length - 1)) return;
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    const clone = [...navLinks];
    const temp = clone[idx];
    clone[idx] = clone[targetIdx];
    clone[targetIdx] = temp;
    setNavLinks(clone);
  };

  const addChildItem = (parentIdx: number) => {
    const clone = [...navLinks];
    const target = clone[parentIdx];
    const children = target.children ? [...target.children] : [];
    children.push({
      title: "New Sub-Link",
      href: "/new-page",
      desc: "Short page description",
      external: false,
    });
    target.children = children;
    setNavLinks(clone);
  };

  const removeChildItem = (parentIdx: number, childIdx: number) => {
    const clone = [...navLinks];
    const target = clone[parentIdx];
    if (target.children) {
      target.children = target.children.filter((_, i) => i !== childIdx);
      setNavLinks(clone);
    }
  };

  // Header Button Management
  const addHeaderButton = () => {
    setHeaderButtons((prev) => [
      ...prev,
      {
        id: `btn-${Date.now()}`,
        label: "New Button",
        url: "/admissions/apply",
        variant: "primary",
        openNewTab: false,
        isVisible: true,
      },
    ]);
  };

  const removeHeaderButton = (idx: number) => {
    setHeaderButtons((prev) => prev.filter((_, i) => i !== idx));
  };

  // Footer Column Management
  const addFooterColumnLink = (colIdx: number) => {
    const clone = [...footerColumns];
    clone[colIdx].links.push({
      label: "New Link",
      href: "#",
      external: false,
    });
    setFooterColumns(clone);
  };

  const removeFooterColumnLink = (colIdx: number, linkIdx: number) => {
    const clone = [...footerColumns];
    clone[colIdx].links = clone[colIdx].links.filter((_, i) => i !== linkIdx);
    setFooterColumns(clone);
  };

  const activeFooterLogo = footerLogoUrl || headerLogoUrl;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-school-secondary border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-semibold">Loading Header & Footer Configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutTemplate className="w-4 h-4" />
            <span>Navigation & Layout Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Header & Footer Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Visually configure the top announcement bar, logos, separate footer image, main navigation dropdowns, header CTA buttons, 4-column footer, and social links in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-glow-blue transition-all disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving Changes..." : "Publish Header & Footer"}</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {success && (
        <div className="flex items-center space-x-3 bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-xl text-emerald-300 text-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="font-bold">Header & Footer changes published successfully!</p>
            <p className="text-emerald-400/80">The public website header, separate footer logo, and navigation have been synchronized in real-time.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-3 bg-rose-950/60 border border-rose-500/50 p-4 rounded-xl text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("header")}
          className={`px-5 py-3 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-t border-x ${
            activeTab === "header"
              ? "bg-slate-900 border-slate-700 text-amber-400 shadow-md"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Top Header & Navigation Bar</span>
        </button>

        <button
          onClick={() => setActiveTab("footer")}
          className={`px-5 py-3 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-t border-x ${
            activeTab === "footer"
              ? "bg-slate-900 border-slate-700 text-amber-400 shadow-md"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>Footer, Separate Logo & Columns</span>
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`px-5 py-3 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-t border-x ${
            activeTab === "social"
              ? "bg-slate-900 border-slate-700 text-rose-400 shadow-md"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Share2 className="w-4 h-4 text-rose-400" />
          <span>Social Media & Video Channels</span>
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`px-5 py-3 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-2 border-t border-x ${
            activeTab === "preview"
              ? "bg-slate-900 border-slate-700 text-amber-400 shadow-md"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Interactive Live Preview</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HEADER & NAVIGATION BUILDER */}
      {/* ========================================================================= */}
      {activeTab === "header" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Top Announcement Bar Configuration */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>1. Top Announcement & Fast Access Bar</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure the thin dark navy strip at the very top of every page.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={topBarVisible}
                  onChange={(e) => setTopBarVisible(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-2.5 text-xs font-bold text-slate-300">
                  {topBarVisible ? "Enabled" : "Hidden"}
                </span>
              </label>
            </div>

            {topBarVisible && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    CBSE Affiliation Badge Text
                  </label>
                  <input
                    type="text"
                    value={affiliationText}
                    onChange={(e) => setAffiliationText(e.target.value)}
                    placeholder="CBSE Affiliated No. 630198 | Senior Secondary"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Helpline / Admissions Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneText}
                    onChange={(e) => setPhoneText(e.target.value)}
                    placeholder="Admissions: +91 1905 223456 / +91 98160 99999"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-300 font-medium">Show Theme (Dark / Light Mode) Toggler in Top Bar</span>
                  <input
                    type="checkbox"
                    checked={showThemeToggle}
                    onChange={(e) => setShowThemeToggle(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* School Brand Text & Header Logo */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>2. School Header Brand & Main Logo</span>
            </h2>

            {/* Header Logo Upload */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800 text-center">
                {headerLogoUrl ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <img
                      src={headerLogoUrl}
                      alt="Header Logo Preview"
                      style={{ height: `${headerLogoHeight}px` }}
                      className="max-w-full object-contain rounded"
                    />
                    <span className="text-[10px] text-slate-400">Current Header Logo ({headerLogoHeight}px height)</span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs flex flex-col items-center space-y-1">
                    <ImageIcon className="w-8 h-8 text-slate-600" />
                    <span>No Header Logo</span>
                  </div>
                )}
              </div>

              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-200">
                    Upload Custom School Header Logo
                  </label>
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingHeaderLogo ? "Uploading..." : "Choose Logo File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeaderLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Or Paste Image URL directly:</label>
                  <input
                    type="text"
                    value={headerLogoUrl}
                    onChange={(e) => setHeaderLogoUrl(e.target.value)}
                    placeholder="/uploads/my_logo.png or https://..."
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-1">
                  <div className="flex-1">
                    <label className="text-[10px] text-slate-400 block mb-1">
                      Header Logo Display Height ({headerLogoHeight}px)
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={headerLogoHeight}
                      onChange={(e) => setHeaderLogoHeight(parseInt(e.target.value) || 50)}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Logo Mode</label>
                    <select
                      value={headerLogoMode}
                      onChange={(e: any) => setHeaderLogoMode(e.target.value)}
                      className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700"
                    >
                      <option value="IMAGE_ONLY">Image Only</option>
                      <option value="IMAGE_AND_TEXT">Image + School Text</option>
                      <option value="TEXT_AND_ICON">Graduation Icon + Text</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Main Brand Title
                </label>
                <input
                  type="text"
                  value={brandTitle}
                  onChange={(e) => setBrandTitle(e.target.value)}
                  placeholder="CAMBRIDGE"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 font-bold tracking-tight"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Brand Subtitle / Campus
                </label>
                <input
                  type="text"
                  value={brandSubtitle}
                  onChange={(e) => setBrandSubtitle(e.target.value)}
                  placeholder="International School, Mandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Tagline / Affiliation Subtext
                </label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  placeholder="Himachal Pradesh • CBSE Affiliated"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* 3. Browser Tab Icon (Favicon & Border Light Effects) */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <span>3. Browser Tab Icon (Favicon & Border Light Effects)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure glowing border light effects and contrast plates so your tab icon is sharply visible across all light and dark browser windows.
                </p>
              </div>
              <span className="text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full font-bold self-start sm:self-auto">
                Appears on Browser Tabs, Window Title & Bookmarks
              </span>
            </div>

            {/* DUAL REAL-TIME BROWSER TAB SIMULATION (LIGHT & DARK CHROME) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Live Browser Tab Simulations (Real Chrome Preview)</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Verify high contrast against both light and dark browser themes
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Chrome Light Theme Tab Preview */}
                <div className="p-4 bg-[#DFE1E5] rounded-2xl border border-slate-300 shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center space-x-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      <span>Google Chrome — Light Mode Tab</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ✓ High Contrast Guaranteed
                    </span>
                  </div>

                  {/* Browser Chrome Bar */}
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="flex items-center space-x-1 pl-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>

                    {/* Active Tab on White */}
                    <div className="bg-white rounded-t-xl px-3.5 py-2 border-t border-x border-slate-200/90 shadow-sm flex items-center space-x-2.5 flex-1 max-w-sm">
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: faviconLightEffect ? faviconBgColor : "transparent",
                          border: faviconLightEffect ? `${Math.min(faviconBorderWidth, 2)}px solid ${faviconBorderColor}` : "none",
                          borderRadius: faviconShape === "circle" ? "9999px" : faviconShape === "square" ? "2px" : "5px",
                          boxShadow: faviconLightEffect
                            ? `0 0 6px ${faviconBorderColor}, inset 0 0 2px ${faviconBorderColor}`
                            : "none",
                        }}
                        className="flex items-center justify-center overflow-hidden flex-shrink-0 transition-all"
                      >
                        {siteFaviconUrl ? (
                          <img
                            src={siteFaviconUrl}
                            alt="Tab Favicon"
                            className="w-3.5 h-3.5 object-contain"
                          />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>

                      <span className="text-xs font-semibold text-slate-800 truncate">
                        Cambridge International School, Mandi
                      </span>
                      <span className="text-slate-400 text-xs ml-auto">🔊</span>
                      <span className="text-slate-400 text-xs ml-1 cursor-default">✕</span>
                    </div>

                    <div className="text-slate-500 text-xs font-bold px-1">+</div>
                  </div>
                </div>

                {/* 2. Chrome Dark Theme Tab Preview */}
                <div className="p-4 bg-[#1E293B] rounded-2xl border border-slate-700 shadow-inner space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Moon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Google Chrome — Dark Mode Tab</span>
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                      ✨ Radiant Bloom Active
                    </span>
                  </div>

                  {/* Browser Chrome Bar */}
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="flex items-center space-x-1 pl-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    </div>

                    {/* Active Tab on Dark */}
                    <div className="bg-[#0F172A] rounded-t-xl px-3.5 py-2 border-t border-x border-slate-700/90 shadow-sm flex items-center space-x-2.5 flex-1 max-w-sm">
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: faviconLightEffect ? faviconBgColor : "transparent",
                          border: faviconLightEffect ? `${Math.min(faviconBorderWidth, 2)}px solid ${faviconBorderColor}` : "none",
                          borderRadius: faviconShape === "circle" ? "9999px" : faviconShape === "square" ? "2px" : "5px",
                          boxShadow: faviconLightEffect
                            ? `0 0 8px ${faviconBorderColor}, inset 0 0 3px ${faviconBorderColor}`
                            : "none",
                        }}
                        className="flex items-center justify-center overflow-hidden flex-shrink-0 transition-all"
                      >
                        {siteFaviconUrl ? (
                          <img
                            src={siteFaviconUrl}
                            alt="Tab Favicon"
                            className="w-3.5 h-3.5 object-contain"
                          />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>

                      <span className="text-xs font-semibold text-slate-200 truncate">
                        Cambridge International School, Mandi
                      </span>
                      <span className="text-emerald-400 text-xs ml-auto">🔊</span>
                      <span className="text-slate-500 text-xs ml-1 cursor-default">✕</span>
                    </div>

                    <div className="text-slate-500 text-xs font-bold px-1">+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIGHT EFFECT & BORDER COLOR CUSTOMIZER */}
            <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Icon Border Light Effect & Color Controls</h3>
                    <p className="text-[11px] text-slate-400">
                      Give your tab icon a radiant neon or golden border glow so it never gets washed out.
                    </p>
                  </div>
                </div>

                <label className="cursor-pointer inline-flex items-center space-x-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={faviconLightEffect}
                    onChange={(e) => setFaviconLightEffect(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                  />
                  <span className={faviconLightEffect ? "text-amber-400" : "text-slate-400"}>
                    {faviconLightEffect ? "Light Effect: Enabled" : "Light Effect: Disabled"}
                  </span>
                </label>
              </div>

              {faviconLightEffect && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Row 1: Spotlight Preview + Border Color Presets */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Spotlight Zoomed Card */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 text-center relative overflow-hidden group">
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none blur-xl transition-all duration-500"
                        style={{ backgroundColor: faviconBorderColor }}
                      />

                      <div className="relative z-10 flex flex-col items-center space-y-3">
                        <div
                          style={{
                            width: 68,
                            height: 68,
                            backgroundColor: faviconBgColor,
                            border: `${faviconBorderWidth}px solid ${faviconBorderColor}`,
                            borderRadius: faviconShape === "circle" ? "9999px" : faviconShape === "square" ? "4px" : "18px",
                            boxShadow:
                              faviconLightStyle === "neon"
                                ? `0 0 12px ${faviconBorderColor}, 0 0 24px ${faviconBorderColor}, inset 0 0 6px ${faviconBorderColor}`
                                : faviconLightStyle === "dual"
                                ? `0 0 0 2px #ffffff, 0 0 16px ${faviconBorderColor}, inset 0 0 5px ${faviconBorderColor}`
                                : faviconLightStyle === "subtle"
                                ? `0 0 8px ${faviconBorderColor}`
                                : `0 0 14px ${faviconBorderColor}, 0 0 28px ${faviconBorderColor}88, inset 0 0 6px ${faviconBorderColor}77`,
                          }}
                          className="flex items-center justify-center overflow-hidden transition-all duration-300"
                        >
                          {siteFaviconUrl ? (
                            <img
                              src={siteFaviconUrl}
                              alt="Active Tab Favicon"
                              className="w-11 h-11 object-contain"
                            />
                          ) : (
                            <Globe className="w-10 h-10 text-slate-400" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[11px] font-mono font-bold text-amber-300 block">
                            {faviconBorderColor.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block">
                            Active Icon & Glowing Border
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Border Light Color Palette */}
                    <div className="md:col-span-8 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                          <Palette className="w-3.5 h-3.5 text-amber-400" />
                          <span>Select Border Light Color:</span>
                        </label>
                        <span className="text-[10px] text-slate-400">Click to switch light glow</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { name: "Amber Gold", hex: "#F59E0B", desc: "Warm Royal Glow" },
                          { name: "Electric Cyan", hex: "#00F2FE", desc: "High Contrast Neon" },
                          { name: "Sapphire Blue", hex: "#3B82F6", desc: "School Primary" },
                          { name: "Emerald Neon", hex: "#10B981", desc: "Vibrant Eco Green" },
                          { name: "Cyber Violet", hex: "#A855F7", desc: "Ultra Radiant Purple" },
                          { name: "Crimson Rose", hex: "#F43F5E", desc: "Warm Ruby Light" },
                          { name: "Diamond White", hex: "#FFFFFF", desc: "Crisp Clean Halo" },
                          { name: "Solar Orange", hex: "#FF8C00", desc: "Radiant Sunset" },
                        ].map((c) => {
                          const isSelected = faviconBorderColor.toLowerCase() === c.hex.toLowerCase();
                          return (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => setFaviconBorderColor(c.hex)}
                              className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-slate-800 border-amber-400 shadow-md scale-[1.02]"
                                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
                              }`}
                            >
                              <div
                                style={{
                                  backgroundColor: c.hex,
                                  boxShadow: `0 0 8px ${c.hex}`,
                                }}
                                className="w-5 h-5 rounded-full flex-shrink-0 border border-white/40"
                              />
                              <div className="truncate">
                                <span className={`text-[11px] font-bold block truncate ${isSelected ? "text-white" : "text-slate-300"}`}>
                                  {c.name}
                                </span>
                                <span className="text-[9px] text-slate-400 block font-mono">{c.hex}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Hex Color Picker */}
                      <div className="flex items-center space-x-3 pt-2">
                        <label className="text-[11px] font-bold text-slate-300 flex items-center space-x-1.5 flex-shrink-0">
                          <span>Or Pick Custom Light Color:</span>
                        </label>
                        <div className="flex items-center space-x-2 flex-1 max-w-xs">
                          <input
                            type="color"
                            value={faviconBorderColor}
                            onChange={(e) => setFaviconBorderColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={faviconBorderColor}
                            onChange={(e) => setFaviconBorderColor(e.target.value)}
                            placeholder="#F59E0B"
                            className="w-full bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-mono focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Contrast Plate, Light Style, Glow Intensity & Border Width */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-800/80">
                    {/* Plate Background (Crucial for white icons!) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        Icon Background Plate
                      </label>
                      <select
                        value={faviconBgColor}
                        onChange={(e) => setFaviconBgColor(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="#0A2540">🏛️ Cambridge Navy (#0A2540)</option>
                        <option value="#0F172A">🌌 Midnight Slate (#0F172A)</option>
                        <option value="#000000">⬛ Pitch Black (#000000)</option>
                        <option value="#1E3A8A">👑 Royal Blue (#1E3A8A)</option>
                        <option value="#FFFFFF">⚪ Crisp White (#FFFFFF)</option>
                        <option value="transparent">🔲 Transparent</option>
                      </select>
                      <span className="text-[10px] text-slate-400 block">
                        Keeps white logos visible on light tabs
                      </span>
                    </div>

                    {/* Light Style */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        Light Effect Style
                      </label>
                      <select
                        value={faviconLightStyle}
                        onChange={(e) => setFaviconLightStyle(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="glow">🌟 Radiant Bloom</option>
                        <option value="neon">⚡ Laser Neon Edge</option>
                        <option value="dual">💫 Dual Ring Aura</option>
                        <option value="subtle">💡 Clean Accent</option>
                      </select>
                      <span className="text-[10px] text-slate-400 block">
                        Lighting aesthetic around edges
                      </span>
                    </div>

                    {/* Glow Intensity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        Glow Intensity
                      </label>
                      <select
                        value={faviconGlowIntensity}
                        onChange={(e) => setFaviconGlowIntensity(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="soft">Subtle / Soft (0.5)</option>
                        <option value="medium">Balanced (0.75)</option>
                        <option value="vibrant">Ultra Radiant (1.0)</option>
                      </select>
                      <span className="text-[10px] text-slate-400 block">
                        Bloom luminance in browser
                      </span>
                    </div>

                    {/* Shape & Border Thickness */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">
                        Icon Plate Shape
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: "rounded", label: "Squircle" },
                          { id: "circle", label: "Circle" },
                          { id: "square", label: "Square" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setFaviconShape(s.id as any)}
                            className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                              faviconShape === s.id
                                ? "bg-amber-400 text-slate-950 border-amber-400"
                                : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Border width: {faviconBorderWidth}px
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Favicon Upload & Source Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 bg-slate-950/70 rounded-xl border border-slate-800">
              <div className="md:col-span-12 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-md transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingFavicon ? "Uploading..." : "Upload Tab Icon / Favicon"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      className="hidden"
                    />
                  </label>

                  {headerLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSiteFaviconUrl(headerLogoUrl)}
                      className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use Header Logo as Tab Icon</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSiteFaviconUrl("/uploads/LOGO_c_72ead6e76f87.webp")}
                    className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset to Cambridge Crest (White & Navy)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveFaviconSettings}
                    disabled={savingFaviconInstant}
                    className={`ml-auto inline-flex items-center space-x-2 text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer ${
                      faviconSavedSuccess
                        ? "bg-emerald-500 text-slate-950 scale-105"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
                    }`}
                  >
                    {savingFaviconInstant ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Tab Favicon...</span>
                      </>
                    ) : faviconSavedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Favicon Live & Updated!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                        <span>⚡ Save & Update Browser Favicon Now</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Or paste direct image URL (.png, .ico, .webp, .svg):
                  </label>
                  <input
                    type="text"
                    value={siteFaviconUrl}
                    onChange={(e) => setSiteFaviconUrl(e.target.value)}
                    placeholder="/uploads/... or https://..."
                    className="w-full bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg border border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation Menu Builder */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>4. Main Navigation Menu Tree Builder</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add, edit, reorder navigation items and their dropdown children.
                </p>
              </div>

              <button
                type="button"
                onClick={addParentNavItem}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Navigation Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {navLinks.map((item, pIdx) => (
                <div
                  key={item.key || pIdx}
                  className="bg-slate-950/80 rounded-xl border border-slate-800/90 p-4 space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {pIdx + 1}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <div>
                          <label className="text-[10px] text-slate-400 block">Menu Label</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const clone = [...navLinks];
                              clone[pIdx].label = e.target.value;
                              setNavLinks(clone);
                            }}
                            className="w-full bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block">Primary URL / Route</label>
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => {
                              const clone = [...navLinks];
                              clone[pIdx].href = e.target.value;
                              setNavLinks(clone);
                            }}
                            className="w-full bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end md:self-center">
                      <label className="flex items-center space-x-1.5 text-xs text-slate-300 mr-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.highlight || false}
                          onChange={(e) => {
                            const clone = [...navLinks];
                            clone[pIdx].highlight = e.target.checked;
                            setNavLinks(clone);
                          }}
                          className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700"
                        />
                        <span className="text-[11px]">Highlight</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => moveParentNavItem(pIdx, "up")}
                        disabled={pIdx === 0}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveParentNavItem(pIdx, "down")}
                        disabled={pIdx === navLinks.length - 1}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeParentNavItem(pIdx)}
                        className="p-1.5 rounded bg-rose-950/60 text-rose-400 hover:bg-rose-900/80 border border-rose-800/50"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown Children */}
                  <div className="pl-6 border-l-2 border-amber-500/30 space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-slate-300">
                        Dropdown Sub-Items ({item.children?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => addChildItem(pIdx)}
                        className="text-amber-400 hover:underline inline-flex items-center space-x-1 text-[11px]"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Dropdown Link</span>
                      </button>
                    </div>

                    {item.children && item.children.length > 0 ? (
                      <div className="space-y-2">
                        {item.children.map((child, cIdx) => (
                          <div
                            key={cIdx}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60 items-center text-xs"
                          >
                            <div className="sm:col-span-4">
                              <input
                                type="text"
                                value={child.title}
                                placeholder="Link Title"
                                onChange={(e) => {
                                  const clone = [...navLinks];
                                  if (clone[pIdx].children) {
                                    clone[pIdx].children![cIdx].title = e.target.value;
                                    setNavLinks(clone);
                                  }
                                }}
                                className="w-full bg-slate-950 text-white text-xs px-2 py-1.5 rounded border border-slate-700"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <input
                                type="text"
                                value={child.href}
                                placeholder="/route or URL"
                                onChange={(e) => {
                                  const clone = [...navLinks];
                                  if (clone[pIdx].children) {
                                    clone[pIdx].children![cIdx].href = e.target.value;
                                    setNavLinks(clone);
                                  }
                                }}
                                className="w-full bg-slate-950 text-white text-xs px-2 py-1.5 rounded border border-slate-700 font-mono text-[11px]"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <input
                                type="text"
                                value={child.desc || ""}
                                placeholder="Short description"
                                onChange={(e) => {
                                  const clone = [...navLinks];
                                  if (clone[pIdx].children) {
                                    clone[pIdx].children![cIdx].desc = e.target.value;
                                    setNavLinks(clone);
                                  }
                                }}
                                className="w-full bg-slate-950 text-slate-300 text-xs px-2 py-1.5 rounded border border-slate-700 text-[11px]"
                              />
                            </div>
                            <div className="sm:col-span-1 flex items-center justify-end space-x-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const clone = [...navLinks];
                                  if (clone[pIdx].children) {
                                    clone[pIdx].children![cIdx].external = !clone[pIdx].children![cIdx].external;
                                    setNavLinks(clone);
                                  }
                                }}
                                className={`p-1.5 rounded ${
                                  child.external ? "text-amber-400 bg-amber-950/40" : "text-slate-500"
                                }`}
                                title={child.external ? "Opens in New Window" : "Internal Link"}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeChildItem(pIdx, cIdx)}
                                className="p-1.5 rounded text-rose-400 hover:bg-rose-950/50"
                                title="Delete Sub-Link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic py-1">
                        No dropdown children. Clicking this menu link will navigate directly to its URL.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Header Action / CTA Buttons */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>4. Header Action / CTA Buttons</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure the primary buttons appearing on the right of the desktop navigation bar.
                </p>
              </div>

              <button
                type="button"
                onClick={addHeaderButton}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Header Button</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {headerButtons.map((btn, bIdx) => (
                <div
                  key={btn.id || bIdx}
                  className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Button #{bIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeHeaderButton(bIdx)}
                      className="p-1 rounded text-rose-400 hover:bg-rose-950"
                      title="Remove Button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Button Label</label>
                      <input
                        type="text"
                        value={btn.label}
                        onChange={(e) => {
                          const clone = [...headerButtons];
                          clone[bIdx].label = e.target.value;
                          setHeaderButtons(clone);
                        }}
                        className="w-full bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={btn.url}
                        onChange={(e) => {
                          const clone = [...headerButtons];
                          clone[bIdx].url = e.target.value;
                          setHeaderButtons(clone);
                        }}
                        className="w-full bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Style Variant</label>
                      <select
                        value={btn.variant}
                        onChange={(e: any) => {
                          const clone = [...headerButtons];
                          clone[bIdx].variant = e.target.value;
                          setHeaderButtons(clone);
                        }}
                        className="bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      >
                        <option value="primary">Primary Gradient</option>
                        <option value="accent">Gold Accent</option>
                        <option value="outline">Glass Outline</option>
                        <option value="login">Lock Login Button</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-300">
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={btn.openNewTab || false}
                          onChange={(e) => {
                            const clone = [...headerButtons];
                            clone[bIdx].openNewTab = e.target.checked;
                            setHeaderButtons(clone);
                          }}
                          className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700"
                        />
                        <span className="text-[11px]">New Tab</span>
                      </label>

                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={btn.isVisible}
                          onChange={(e) => {
                            const clone = [...headerButtons];
                            clone[bIdx].isVisible = e.target.checked;
                            setHeaderButtons(clone);
                          }}
                          className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700"
                        />
                        <span className="text-[11px]">Visible</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FOOTER BUILDER, SEPARATE IMAGE & SOCIAL LINKS */}
      {/* ========================================================================= */}
      {activeTab === "footer" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Dedicated Separate Footer Logo Image Upload & Settings */}
          <div className="bg-slate-900/60 rounded-2xl border border-amber-500/40 p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>1. Dedicated Separate Footer Logo Image</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload a separate, optimized logo image specifically for the dark footer (e.g., white-text crest, framed transparent PNG, or clean boxed emblem).
                </p>
              </div>

              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                Footer Specific Image
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              {/* Footer Logo Preview */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-[#051322] rounded-xl border border-slate-800 text-center space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Live Footer Dark Preview
                </span>

                <div className="p-2 flex items-center justify-center min-h-[70px]">
                  {activeFooterLogo ? (
                    <div
                      className={
                        footerLogoContainer === "WHITE_CONTAINER"
                          ? "bg-white px-3.5 py-2 rounded-xl shadow-lg inline-flex items-center"
                          : footerLogoContainer === "GLASS_CONTAINER"
                          ? "bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 inline-flex items-center"
                          : "inline-flex items-center"
                      }
                    >
                      <img
                        src={activeFooterLogo}
                        alt="Footer Logo Preview"
                        style={{ height: `${footerLogoHeight}px` }}
                        className="max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-school-secondary flex items-center justify-center text-amber-400 shadow-xl border border-amber-400/30">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-slate-400">
                  {footerLogoUrl ? "Using Dedicated Footer Image" : "Inheriting Header Logo"} ({footerLogoHeight}px)
                </p>
              </div>

              {/* Upload Controls */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block">
                      Upload Separate Footer Image / Crest
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Recommended: PNG with transparent background or high-res JPG emblem
                    </span>
                  </div>

                  <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingFooterLogo ? "Uploading..." : "Choose Footer Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFooterLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Or Direct Image URL for Footer:
                  </label>
                  <input
                    type="text"
                    value={footerLogoUrl}
                    onChange={(e) => setFooterLogoUrl(e.target.value)}
                    placeholder="e.g. /uploads/footer_logo_white.png"
                    className="w-full bg-slate-900 text-white text-xs px-3 py-2 rounded-lg border border-slate-700 font-mono"
                  />
                  {footerLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setFooterLogoUrl("")}
                      className="text-[10px] text-rose-400 hover:underline mt-1 inline-flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Reset / Use Header Image</span>
                    </button>
                  )}
                </div>

                {/* Footer Logo Mode & Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      Footer Logo Background Container Framing
                    </label>
                    <select
                      value={footerLogoContainer}
                      onChange={(e: any) => setFooterLogoContainer(e.target.value)}
                      className="w-full bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 font-semibold"
                    >
                      <option value="WHITE_CONTAINER">Clean White Rounded Card (Recommended for JPGs)</option>
                      <option value="TRANSPARENT">Transparent / No Container (For PNGs)</option>
                      <option value="GLASS_CONTAINER">Frosted Glass Container</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">
                      Footer Logo Height ({footerLogoHeight}px)
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="110"
                      value={footerLogoHeight}
                      onChange={(e) => setFooterLogoHeight(parseInt(e.target.value) || 52)}
                      className="w-full accent-amber-400 mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* School About & Accreditations in Footer */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>2. Footer School Summary & Accreditation Badge</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  About School Summary (Footer Left Column)
                </label>
                <textarea
                  rows={3}
                  value={footerAbout}
                  onChange={(e) => setFooterAbout(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    CBSE Badge Title
                  </label>
                  <input
                    type="text"
                    value={footerAffiliationBadge}
                    onChange={(e) => setFooterAffiliationBadge(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Affiliation & School Code Line
                  </label>
                  <input
                    type="text"
                    value={footerAffiliationSub}
                    onChange={(e) => setFooterAffiliationSub(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details in Footer */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>3. Campus Contact Details & Timings</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Campus Physical Address
                </label>
                <input
                  type="text"
                  value={footerAddress}
                  onChange={(e) => setFooterAddress(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Admissions Helpline Phone Numbers
                </label>
                <input
                  type="text"
                  value={footerPhone}
                  onChange={(e) => setFooterPhone(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Campus Operating Hours
                </label>
                <input
                  type="text"
                  value={footerHours}
                  onChange={(e) => setFooterHours(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  WhatsApp Helpline Number
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>4. Social Media URLs & Channels</span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("social")}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center space-x-1"
              >
                <span>Full Social & Video Hub →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Facebook Page URL
                  </label>
                  {facebookUrl && (
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">
                      Test
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    YouTube Channel URL
                  </label>
                  {youtubeUrl && (
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-red-400 hover:underline">
                      Test
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Instagram Handle URL
                  </label>
                  {instagramUrl && (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:underline">
                      Test
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/cismandi_official"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Twitter / X URL
                </label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  LinkedIn Page URL
                </label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/school/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  YouTube Video / Live Embed URL
                </label>
                <input
                  type="text"
                  value={youtubeEmbedUrl}
                  onChange={(e) => setYoutubeEmbedUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Footer Navigation Columns Builder */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <LayoutTemplate className="w-4 h-4 text-amber-400" />
                <span>5. Footer Navigation Columns Manager</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage column headings and specific quick links rendered in the footer grid.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {footerColumns.map((col, colIdx) => (
                <div
                  key={col.id || colIdx}
                  className="bg-slate-950/90 rounded-xl border border-slate-800 p-4 space-y-3"
                >
                  <div className="space-y-1 pb-2 border-b border-slate-800">
                    <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                      Column #{colIdx + 1} Heading
                    </label>
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const clone = [...footerColumns];
                        clone[colIdx].title = e.target.value;
                        setFooterColumns(clone);
                      }}
                      className="w-full bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded border border-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Links ({col.links.length})</span>
                      <button
                        type="button"
                        onClick={() => addFooterColumnLink(colIdx)}
                        className="text-amber-400 hover:underline text-[11px] inline-flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Link</span>
                      </button>
                    </div>

                    {col.links.map((link, lIdx) => (
                      <div
                        key={lIdx}
                        className="grid grid-cols-12 gap-1 bg-slate-900/50 p-2 rounded border border-slate-800 text-xs items-center"
                      >
                        <div className="col-span-6">
                          <input
                            type="text"
                            value={link.label}
                            placeholder="Link Label"
                            onChange={(e) => {
                              const clone = [...footerColumns];
                              clone[colIdx].links[lIdx].label = e.target.value;
                              setFooterColumns(clone);
                            }}
                            className="w-full bg-slate-950 text-white text-xs px-2 py-1 rounded border border-slate-700 text-[11px]"
                          />
                        </div>
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={link.href}
                            placeholder="/route"
                            onChange={(e) => {
                              const clone = [...footerColumns];
                              clone[colIdx].links[lIdx].href = e.target.value;
                              setFooterColumns(clone);
                            }}
                            className="w-full bg-slate-950 text-white text-xs px-2 py-1 rounded border border-slate-700 font-mono text-[10px]"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeFooterColumnLink(colIdx, lIdx)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar & Copyright */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>6. Bottom Bar Copyright & Legal Line</span>
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SOCIAL MEDIA & VIDEO CHANNELS */}
      {/* ========================================================================= */}
      {activeTab === "social" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Quick Notice Card */}
          <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-blue-950/40 border border-rose-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">Social Media Links & Live Video Channels</h2>
              </div>
              <p className="text-xs text-slate-300">
                Configure your official Facebook Page, YouTube Channel, and video broadcasts for the header, footer, and homepage.
              </p>
            </div>
            <Link
              href="/admin/social-media"
              className="inline-flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition-colors flex-shrink-0"
            >
              <span>Dedicated Social Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Facebook & YouTube 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook Card */}
            <div className="bg-slate-900/60 rounded-2xl border border-blue-500/30 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    f
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Facebook Page & Stream</h3>
                    <p className="text-[10px] text-slate-400">Official Page URL & Feed</p>
                  </div>
                </div>
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Facebook Page URL
                  </label>
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/cismandi"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500">Links footer icon and powers Facebook timeline stream.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Facebook Embed / Plugin URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={facebookEmbedUrl}
                    onChange={(e) => setFacebookEmbedUrl(e.target.value)}
                    placeholder="https://www.facebook.com/plugins/page.php?href=..."
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500">Leave blank to auto-embed from Facebook Page URL.</p>
                </div>
              </div>
            </div>

            {/* YouTube Card */}
            <div className="bg-slate-900/60 rounded-2xl border border-red-500/30 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">YouTube Channel & Video Embed</h3>
                    <p className="text-[10px] text-slate-400">Subscribe Link & 16:9 Video Player</p>
                  </div>
                </div>
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Test Channel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Official YouTube Channel URL
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/@cismandi"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500">Links footer button and YouTube subscribe action.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    YouTube Featured Video / Stream Embed URL
                  </label>
                  <input
                    type="text"
                    value={youtubeEmbedUrl}
                    onChange={(e) => setYoutubeEmbedUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=48fO2u80pBs"
                    className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500">Accepts standard watch URLs, short URLs, or embed URLs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Social Profiles */}
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Other Connected Social Profiles</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Instagram URL</label>
                <input
                  type="text"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/cismandi_official"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+919816099999"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Twitter / X URL</label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">LinkedIn URL</label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/school/cismandi"
                  className="w-full bg-slate-950 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: INTERACTIVE LIVE PREVIEW */}
      {/* ========================================================================= */}
      {activeTab === "preview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <span className="font-bold">Live Layout Preview</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Showing real-time mockup based on your current inputs above.
            </p>
          </div>

          {/* Header Preview Box */}
          <div className="rounded-2xl border border-slate-700 overflow-hidden shadow-2xl bg-[#030816]">
            {/* Top bar preview */}
            {topBarVisible && (
              <div className="bg-school-primary text-white text-xs py-2 px-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center space-x-2 text-amber-400 font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{affiliationText}</span>
                </div>
                <div className="text-slate-300 text-[11px] flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>{phoneText}</span>
                </div>
              </div>
            )}

            {/* Nav bar preview */}
            <div className="bg-[#030816] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                {headerLogoUrl && headerLogoMode === "IMAGE_ONLY" ? (
                  <img
                    src={headerLogoUrl}
                    alt="Header Logo"
                    style={{ height: `${headerLogoHeight}px` }}
                    className="max-w-full object-contain"
                  />
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-school-primary to-school-secondary flex items-center justify-center text-amber-400 border border-amber-400/40">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-heading font-extrabold text-lg text-white leading-tight">
                        {brandTitle}
                      </div>
                      <div className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                        {brandSubtitle}
                      </div>
                      <div className="text-[9px] text-slate-400">{brandTagline}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation Links Mockup */}
              <div className="hidden lg:flex items-center space-x-4 text-xs font-semibold text-slate-200">
                {navLinks.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1 hover:text-amber-400 cursor-pointer">
                    <span>{item.label}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons Mockup */}
              <div className="flex items-center space-x-2">
                {headerButtons
                  .filter((b) => b.isVisible)
                  .map((btn, idx) => (
                    <span
                      key={idx}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border ${
                        btn.variant === "accent"
                          ? "bg-amber-400 text-slate-950 border-amber-300"
                          : btn.variant === "login"
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-school-secondary text-white border-blue-400/40"
                      }`}
                    >
                      {btn.label}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer Preview Box */}
          <div className="rounded-2xl border border-slate-700 overflow-hidden shadow-2xl bg-gradient-to-b from-[#051322] to-slate-950 p-8 text-white space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                {/* Footer Separate Logo Preview */}
                <div className="flex items-center">
                  {activeFooterLogo ? (
                    <div
                      className={
                        footerLogoContainer === "WHITE_CONTAINER"
                          ? "bg-white px-3.5 py-2 rounded-xl shadow-lg inline-flex items-center"
                          : footerLogoContainer === "GLASS_CONTAINER"
                          ? "bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 inline-flex items-center"
                          : "inline-flex items-center"
                      }
                    >
                      <img
                        src={activeFooterLogo}
                        alt="Footer Logo"
                        style={{ height: `${footerLogoHeight}px` }}
                        className="max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-school-secondary flex items-center justify-center text-amber-400 shadow-xl border border-amber-400/30">
                      <GraduationCap className="w-7 h-7" />
                    </div>
                  )}
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">{footerAbout}</p>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-xs">
                  <p className="font-bold text-amber-400">{footerAffiliationBadge}</p>
                  <p className="text-slate-400 text-[11px]">{footerAffiliationSub}</p>
                </div>
              </div>

              {footerColumns.map((col, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                    {col.title}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {col.links.map((link, lIdx) => (
                      <li key={lIdx} className="hover:text-white flex items-center space-x-1">
                        <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                        <span>{link.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
              <div>{copyrightText}</div>
              <div className="flex items-center space-x-4 text-slate-400">
                <span>Admissions: {footerPhone}</span>
                <span>•</span>
                <span>{footerEmail}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
