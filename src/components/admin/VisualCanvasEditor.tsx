"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Eye,
  EyeOff,
  CheckCircle2,
  Layers,
  ArrowRight,
  MoveUp,
  MoveDown,
  Loader2,
  ExternalLink,
  Video,
  Film,
  Sliders,
  Palette,
  Type,
  FileDown,
  GraduationCap,
  BarChart3,
  Download,
  Laptop,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Maximize2,
  Minimize2,
  Copy,
  FolderDown,
  MessageSquareQuote,
  Crop,
  Settings,
  X,
  Check,
  Zap,
  RefreshCw,
  Globe,
  Monitor,
  LayoutTemplate,
  Info,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  SlidersHorizontal,
  BookOpen,
  Quote,
  GripVertical,
  Columns,
  LayoutGrid,
  Square,
  HelpCircle,
  Award,
  Calendar,
  Clock,
  Compass,
  Users,
  Trophy,
  ShieldCheck,
  TreePine,
  Volume2,
  Play,
  Tv,
  Target,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { SectionBlock, SectionItem, CustomStyles, DocumentAttachment, StatMetric } from "@/lib/pageRegistry";

export interface PageData {
  id?: string;
  slug: string;
  pageName: string;
  heroBadge?: string;
  heroBadgeColor?: "amber" | "emerald" | "blue" | "purple" | "rose";
  heroTitle?: string;
  heroTitleSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  heroTextAlign?: "left" | "center" | "right";
  heroSubtitle?: string;
  heroImage?: string;
  heroImageSize?: "small" | "medium" | "large" | "full";
  heroImageHeight?: number;
  heroImageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "21/9" | "auto";
  heroImageRounding?: "none" | "md" | "2xl" | "full";
  heroMediaType?: string;
  heroVideoUrl?: string;
  heroOverlayOpacity?: number;
  heroCtaText?: string;
  heroCtaLink?: string;
  sections: SectionBlock[];
  customStyles?: CustomStyles;
  isPublished?: boolean;
}

interface VisualCanvasEditorProps {
  page: PageData;
  onChange: (updated: PageData) => void;
  onSave: () => void;
  saving: boolean;
  savedSuccess: boolean;
  onUploadImage: (file: File) => Promise<string | null>;
}

const PAGE_PATHS: Record<string, string> = {
  home: "/",
  about: "/about",
  "mission-vision": "/about/mission-vision",
  "chairman-message": "/about/chairman-message",
  "principal-message": "/about/principal-message",
  faculty: "/about/faculty",
  academics: "/academics",
  "pre-primary": "/academics/pre-primary",
  primary: "/academics/primary",
  "middle-school": "/academics/middle-school",
  "senior-secondary": "/academics/senior-secondary",
  admissions: "/admissions",
  procedure: "/admissions/procedure",
  "fees-structure": "/admissions/fees-structure",
  scholarships: "/admissions/scholarships",
  apply: "/admissions/apply",
  facilities: "/facilities",
  "smart-classrooms": "/facilities/smart-classrooms",
  "science-labs": "/facilities/science-labs",
  "robotics-lab": "/facilities/robotics-lab",
  library: "/facilities/library",
  "sports-complex": "/facilities/sports-complex",
  hostel: "/facilities/hostel",
  transport: "/facilities/transport",
  "student-life": "/student-life",
  achievements: "/achievements",
  results: "/results",
  gallery: "/gallery",
  "virtual-tour": "/virtual-tour",
  news: "/news",
  events: "/events",
  downloads: "/downloads",
  "mandatory-disclosure": "/mandatory-disclosure",
  "cbse-information": "/cbse-information",
  careers: "/careers",
  contact: "/contact",
};

export type ViewportMode = "desktop" | "tablet" | "mobile_iphone" | "mobile_android" | "mobile_compact";

export const VIEWPORTS: Record<
  ViewportMode,
  {
    name: string;
    width: number | string;
    widthClass: string;
    label: string;
    resolution: string;
    isMobile?: boolean;
  }
> = {
  desktop: {
    name: "Desktop Ultra HD",
    width: "100%",
    widthClass: "w-full max-w-7xl",
    label: "Desktop",
    resolution: "1920 × 1080",
  },
  tablet: {
    name: "iPad Air / Tablet",
    width: 768,
    widthClass: "w-[768px]",
    label: "Tablet (768px)",
    resolution: "768 × 1024",
  },
  mobile_iphone: {
    name: "iPhone 15 Pro",
    width: 393,
    widthClass: "w-[393px]",
    label: "iPhone (393px)",
    resolution: "393 × 852",
    isMobile: true,
  },
  mobile_android: {
    name: "Samsung Galaxy / Android",
    width: 412,
    widthClass: "w-[412px]",
    label: "Android (412px)",
    resolution: "412 × 915",
    isMobile: true,
  },
  mobile_compact: {
    name: "Compact Mobile",
    width: 360,
    widthClass: "w-[360px]",
    label: "Compact (360px)",
    resolution: "360 × 740",
    isMobile: true,
  },
};

const COLOR_SWATCHES = [
  "#0F172A",
  "#1E293B",
  "#0A2540",
  "#051329",
  "#071933",
  "#F59E0B",
  "#D97706",
  "#2563EB",
  "#1D4ED8",
  "#10B981",
  "#059669",
  "#8B5CF6",
  "#7C3AED",
  "#EC4899",
  "#FFFFFF",
  "#F8FAFC",
];

const GRADIENT_PRESETS = [
  { name: "Navy Glass Glow", value: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(10,37,64,0.95))" },
  { name: "Amber Royal", value: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.25))" },
  { name: "Deep Cobalt", value: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(29,78,216,0.25))" },
  { name: "Emerald Serenity", value: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.25))" },
  { name: "Purple Luxury", value: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(124,58,237,0.25))" },
  { name: "Clean Pearl White", value: "linear-gradient(135deg, #ffffff, #f8fafc)" },
];

const DEFAULT_WINGS = [
  {
    id: "pre-primary",
    title: "Pre-Primary / Early Years",
    grades: "Nursery, LKG, UKG",
    age: "3 to 5 Years",
    desc: "A playful, discovery-driven environment nurturing foundational phonics, sensory exploration, motor coordination, and curiosity.",
    subjects: ["Phonics & Storytelling", "Sensory Discovery", "Early Number Sense", "Creative Arts & Clay", "Music & Movement"],
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80",
    link: "/academics/pre-primary",
  },
  {
    id: "primary",
    title: "Primary Wing",
    grades: "Grades 1 to 5",
    age: "6 to 10 Years",
    desc: "Activity-oriented experiential pedagogy cultivating strong fundamentals in literacy, numeracy, environmental awareness, and digital fluency.",
    subjects: ["English Language & Lit", "Mathematics Mastery", "Environmental Science", "Hindi & Regional Lang", "Coding Basics", "Physical Education"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    link: "/academics/primary",
  },
  {
    id: "middle",
    title: "Middle School Wing",
    grades: "Grades 6 to 8",
    age: "11 to 13 Years",
    desc: "Transition from concrete learning to conceptual inquiry, hands-on STEM laboratory experimentation, and active debate.",
    subjects: ["Integrated Sciences (PCB)", "Algebra & Geometry", "Social Sciences & Civics", "Sanskrit / French", "Robotics & AI Lab", "Performing Arts"],
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    link: "/academics/middle-school",
  },
  {
    id: "senior-sec",
    title: "Senior Secondary Wing",
    grades: "Grades 9 to 12",
    age: "14 to 18 Years",
    desc: "Comprehensive CBSE Board mastery with specialized 4-stream choices, JEE/NEET/CUET foundation, and global university placement.",
    subjects: ["Science: Medical (PCB+BioTech)", "Science: Non-Med (PCM+Comp)", "Commerce (Acc, BST, Eco)", "Humanities (Pol Sci, Psych)", "AI & Data Science"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
    link: "/academics/senior-secondary",
  },
];

const DEFAULT_WHY_REASONS = [
  {
    title: "Cambridge & CBSE Blended Pedagogy",
    desc: "Inquiry-based international pedagogical methods blended seamlessly with CBSE curriculum standards and assessment framework.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Himalayan STEM, AI & Robotics Lab",
    desc: "Equipped with 3D printers, IoT hardware, Arduino & Raspberry Pi kits, and drone test bays for hands-on engineering.",
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Olympic Sports & Heated Aquatic Center",
    desc: "Semi-Olympic heated pool, FIFA-standard synthetic football field, tennis courts, and indoor multi-sport auditorium.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Safe Residential Boarding & Hostel",
    desc: "Modern temperature-controlled dormitories, 24x7 resident wardens, hygienic multi-cuisine dining, and evening academic tutoring.",
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "GPS & CCTV Monitored Bus Fleet",
    desc: "Comfortable air-conditioned transport fleet with live parent tracking apps covering Mandi, Sundernagar, Gutkar, and surrounding valleys.",
    color: "from-sky-500 to-blue-600",
  },
  {
    title: "1:15 Teacher-Student Mentorship",
    desc: "Individualized attention with dedicated mentor-teachers who monitor both academic trajectory and emotional well-being.",
    color: "from-rose-500 to-red-600",
  },
  {
    title: "100% Safety & CCTV Campus",
    desc: "Gated 10-acre Himalayan perimeter with 200+ HD night-vision cameras, biometric turnstiles, and female security personnel.",
    color: "from-teal-500 to-emerald-600",
  },
  {
    title: "Himalayan Eco-Leadership & Clean Air",
    desc: "Pristine mountain environment promoting mental clarity, alpine treks, nature conservation projects, and organic farming.",
    color: "from-green-500 to-emerald-700",
  },
];

export default function VisualCanvasEditor({
  page,
  onChange,
  onSave,
  saving,
  savedSuccess,
  onUploadImage,
}: VisualCanvasEditorProps) {
  const [editorMode, setEditorMode] = useState<"canvas_edit" | "live_page">("canvas_edit");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const isMobileViewport = Boolean(VIEWPORTS[viewport]?.isMobile);
  const isTabletViewport = viewport === "tablet";
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  const [iframeLoading, setIframeLoading] = useState(true);

  // Inspector tab selection
  const [activeInspectorTab, setActiveInspectorTab] = useState<string>("hero");

  // Selected element for Elementor Pro style customization
  const [selectedBlock, setSelectedBlock] = useState<{
    type: "section" | "item" | "hero" | "header" | "desk" | "philosophy" | "heritage" | "stats" | "leadership" | "wings" | "why_us";
    secIdx?: number;
    itemIdx?: number;
    statIdx?: number;
  } | null>(null);

  const [activeHomeWingIdx, setActiveHomeWingIdx] = useState<number>(0);

  // Drag and Drop state
  const [draggedSectionIdx, setDraggedSectionIdx] = useState<number | null>(null);
  const [dragOverSectionIdx, setDragOverSectionIdx] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ secIdx: number; itemIdx: number } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ secIdx: number; itemIdx: number } | null>(null);

  // Quick section template modal
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Image upload & URL modal targets
  const [activeImageTarget, setActiveImageTarget] = useState<{
    type: "hero" | "author" | "chairman" | "principal" | "item" | "doc" | "wing";
    secIdx?: number;
    itemIdx?: number;
    docIdx?: number;
  } | null>(null);

  const [showUrlModal, setShowUrlModal] = useState<{
    type: "hero" | "author" | "chairman" | "principal" | "item" | "wing";
    secIdx?: number;
    itemIdx?: number;
    currentUrl: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const livePagePath = PAGE_PATHS[page.slug] || `/${page.slug}`;

  const isHomePage = page.slug === "home";
  const isChairmanPage = page.slug === "chairman-message";
  const isPrincipalPage = page.slug === "principal-message";
  const isMissionVisionPage = page.slug === "mission-vision";
  const isAboutPage = page.slug === "about";
  const isMessagePage = isChairmanPage || isPrincipalPage;

  // Auto-switch inspector tab on page change
  useEffect(() => {
    if (isHomePage) {
      setActiveInspectorTab("hero");
    } else if (isMessagePage) {
      setActiveInspectorTab("desk");
    } else if (isMissionVisionPage) {
      setActiveInspectorTab("philosophy");
    } else if (isAboutPage) {
      setActiveInspectorTab("heritage");
    } else {
      setActiveInspectorTab("header");
    }
    setSelectedBlock(null);
  }, [page.slug]);

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave]);

  // Image Upload Trigger
  const triggerImageUpload = (
    type: "hero" | "author" | "chairman" | "principal" | "item" | "doc" | "wing",
    secIdx?: number,
    itemIdx?: number,
    docIdx?: number
  ) => {
    setActiveImageTarget({ type, secIdx, itemIdx, docIdx });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImageTarget) return;

    setIsUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) {
        if (activeImageTarget.type === "hero") {
          onChange({ ...page, heroImage: url });
        } else if (activeImageTarget.type === "author") {
          onChange({
            ...page,
            heroImage: url,
            customStyles: {
              ...page.customStyles,
              authorImage: url,
              chairmanImage: isChairmanPage ? url : page.customStyles?.chairmanImage,
              principalImage: isPrincipalPage ? url : page.customStyles?.principalImage,
            },
          });
        } else if (activeImageTarget.type === "chairman") {
          onChange({
            ...page,
            customStyles: { ...page.customStyles, chairmanImage: url, authorImage: url },
          });
        } else if (activeImageTarget.type === "principal") {
          onChange({
            ...page,
            customStyles: { ...page.customStyles, principalImage: url, authorImage: url },
          });
        } else if (activeImageTarget.type === "wing") {
          updateActiveWing({ image: url });
        } else if (
          activeImageTarget.type === "item" &&
          activeImageTarget.secIdx !== undefined &&
          activeImageTarget.itemIdx !== undefined
        ) {
          updateItem(activeImageTarget.secIdx, activeImageTarget.itemIdx, { image: url });
        }
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setIsUploading(false);
      setActiveImageTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = (url: string) => {
    if (!showUrlModal) return;
    const cleanUrl = url.trim();
    if (showUrlModal.type === "hero") {
      onChange({ ...page, heroImage: cleanUrl });
    } else if (showUrlModal.type === "author") {
      onChange({
        ...page,
        heroImage: cleanUrl,
        customStyles: {
          ...page.customStyles,
          authorImage: cleanUrl,
          chairmanImage: isChairmanPage ? cleanUrl : page.customStyles?.chairmanImage,
          principalImage: isPrincipalPage ? cleanUrl : page.customStyles?.principalImage,
        },
      });
    } else if (showUrlModal.type === "chairman") {
      onChange({
        ...page,
        customStyles: { ...page.customStyles, chairmanImage: cleanUrl, authorImage: cleanUrl },
      });
    } else if (showUrlModal.type === "principal") {
      onChange({
        ...page,
        customStyles: { ...page.customStyles, principalImage: cleanUrl, authorImage: cleanUrl },
      });
    } else if (showUrlModal.type === "wing") {
      updateActiveWing({ image: cleanUrl });
    } else if (
      showUrlModal.type === "item" &&
      showUrlModal.secIdx !== undefined &&
      showUrlModal.itemIdx !== undefined
    ) {
      updateItem(showUrlModal.secIdx, showUrlModal.itemIdx, { image: cleanUrl });
    }
    setShowUrlModal(null);
  };

  // Section Template Adder
  const handleAddTemplateSection = (layoutType: string) => {
    let newSec: SectionBlock;
    if (layoutType === "split_banner") {
      newSec = {
        id: `sec_${Date.now()}`,
        type: "split_story",
        title: "Inspiring Himalayan Campus & Heritage",
        subtitle: "A 10-acre peaceful sanctuary blending global academic rigor with natural serenity.",
        badge: "Campus Tour",
        badgeColor: "emerald",
        layout: "split",
        items: [
          {
            title: "Holistic 10-Acre Campus Infrastructure",
            description: "Surrounded by pine-clad mountains in Mandi, CIS Mandi provides an optimal synthesis of physical fitness, mental agility, and spiritual peace.",
            image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
            badge: "Sanctuary",
            badgeColor: "emerald",
            buttonText: "Explore Facilities",
            buttonLink: "/facilities",
            imagePosition: "right",
          },
        ],
      };
    } else if (layoutType === "grid_4_academics") {
      newSec = {
        id: `sec_${Date.now()}`,
        type: "academics_wings",
        title: "Integrated Wings of Learning",
        subtitle: "From Montessori early childhood discovery to senior secondary IIT/NEET pathways.",
        badge: "Wings of Excellence",
        badgeColor: "blue",
        layout: "grid_4",
        items: [
          {
            title: "Pre-Primary (Early Years)",
            description: "Montessori-inspired experiential play and sensory motor discovery.",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
            badge: "Ages 3-5",
            badgeColor: "amber",
            link: "/academics/pre-primary",
            imagePosition: "top",
          },
          {
            title: "Primary Wing (Grades 1-5)",
            description: "Conceptual literacy, numeracy, and scientific inquiry foundations.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Grades 1-5",
            badgeColor: "blue",
            link: "/academics/primary",
            imagePosition: "top",
          },
          {
            title: "Middle School (Grades 6-8)",
            description: "Analytical STEM inquiry, foreign languages, and digital coding fundamentals.",
            image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
            badge: "Grades 6-8",
            badgeColor: "emerald",
            link: "/academics/middle-school",
            imagePosition: "top",
          },
          {
            title: "Senior Secondary (Grades 9-12)",
            description: "Medical, Non-Med, Commerce, and Humanities streams with JEE/NEET mentorship.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Grades 9-12",
            badgeColor: "purple",
            link: "/academics/senior-secondary",
            imagePosition: "top",
          },
        ],
      };
    } else {
      // Default 3-Col
      newSec = {
        id: `sec_${Date.now()}`,
        type: "features_grid",
        title: "Pillars of Academic Distinction",
        subtitle: "A fusion of Cambridge analytical rigor and CBSE excellence.",
        badge: "Why Cambridge Mandi",
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "Smart Digital Classrooms",
            description: "4K interactive digital podiums, visual-audio curriculum delivery, and AI-enabled collaborative workstations.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "EdTech Benchmark",
            badgeColor: "blue",
            link: "/facilities/smart-classrooms",
            imageSize: "medium",
            imageHeight: 180,
            imageRatio: "16/9",
            imageRounding: "2xl",
          },
          {
            title: "Robotics & AI Innovation Lab",
            description: "Hands-on 3D printing, IoT sensors, drone prototyping, and national championship winning STEM team.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "STEM Gold Medalists",
            badgeColor: "purple",
            link: "/facilities/robotics-lab",
            imageSize: "medium",
            imageHeight: 180,
            imageRatio: "16/9",
            imageRounding: "2xl",
          },
          {
            title: "Olympic Sports Complex",
            description: "All-weather heated indoor swimming pool, FIFA-standard turf, and synthetic badminton courts.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Sports Academy",
            badgeColor: "emerald",
            link: "/facilities/sports-complex",
            imageSize: "medium",
            imageHeight: 180,
            imageRatio: "16/9",
            imageRounding: "2xl",
          },
        ],
      };
    }

    onChange({ ...page, sections: [...(page.sections || []), newSec] });
    setShowTemplateModal(false);
    setActiveInspectorTab("sections");
  };

  const removeSection = (secIdx: number) => {
    const updated = (page.sections || []).filter((_, idx) => idx !== secIdx);
    onChange({ ...page, sections: updated });
    if (selectedBlock?.secIdx === secIdx) setSelectedBlock(null);
  };

  const duplicateSection = (secIdx: number) => {
    const sections = [...(page.sections || [])];
    if (!sections[secIdx]) return;
    const copied: SectionBlock = {
      ...sections[secIdx],
      id: `sec_${Date.now()}`,
      title: `${sections[secIdx].title} (Copy)`,
      items: sections[secIdx].items.map((it) => ({ ...it })),
    };
    sections.splice(secIdx + 1, 0, copied);
    onChange({ ...page, sections });
  };

  const updateSection = (secIdx: number, updates: Partial<SectionBlock>) => {
    const sections = [...(page.sections || [])];
    if (!sections[secIdx]) return;
    sections[secIdx] = { ...sections[secIdx], ...updates };
    onChange({ ...page, sections });
  };

  const moveSection = (secIdx: number, direction: "up" | "down") => {
    const sections = [...(page.sections || [])];
    const targetIdx = direction === "up" ? secIdx - 1 : secIdx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const [moved] = sections.splice(secIdx, 1);
    sections.splice(targetIdx, 0, moved);
    onChange({ ...page, sections });
  };

  // Card Item Management
  const addItem = (secIdx: number) => {
    const sections = [...(page.sections || [])];
    if (!sections[secIdx]) return;
    const newItem: SectionItem = {
      title: "New Distinction Program",
      description: "Enter comprehensive details and highlights for this feature.",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
      badge: "Feature",
      badgeColor: "amber",
      link: "/academics",
      imageSize: "medium",
      imageHeight: 180,
      imageRatio: "16/9",
      imageRounding: "2xl",
      imagePosition: "top",
    };
    sections[secIdx].items = [...(sections[secIdx].items || []), newItem];
    onChange({ ...page, sections });
  };

  const removeItem = (secIdx: number, itemIdx: number) => {
    const sections = [...(page.sections || [])];
    if (!sections[secIdx]) return;
    sections[secIdx].items = sections[secIdx].items.filter((_, idx) => idx !== itemIdx);
    onChange({ ...page, sections });
    if (selectedBlock?.secIdx === secIdx && selectedBlock?.itemIdx === itemIdx) {
      setSelectedBlock(null);
    }
  };

  const duplicateItem = (secIdx: number, itemIdx: number) => {
    const sections = [...(page.sections || [])];
    if (!sections[secIdx] || !sections[secIdx].items[itemIdx]) return;
    const itemToCopy = sections[secIdx].items[itemIdx];
    const copied: SectionItem = {
      ...itemToCopy,
      title: `${itemToCopy.title} (Copy)`,
    };
    sections[secIdx].items.splice(itemIdx + 1, 0, copied);
    onChange({ ...page, sections });
  };

  const updateItem = (secIdx: number, itemIdx: number, updates: Partial<SectionItem>) => {
    const sections = [...(page.sections || [])];
    if (!sections[secIdx] || !sections[secIdx].items[itemIdx]) return;
    sections[secIdx].items[itemIdx] = {
      ...sections[secIdx].items[itemIdx],
      ...updates,
    };
    onChange({ ...page, sections });
  };

  // HTML5 Drag & Drop
  const handleSectionDragStart = (e: React.DragEvent, secIdx: number) => {
    e.dataTransfer.setData("text/plain", `sec_${secIdx}`);
    setDraggedSectionIdx(secIdx);
  };

  const handleSectionDragOver = (e: React.DragEvent, secIdx: number) => {
    e.preventDefault();
    if (draggedSectionIdx !== null && draggedSectionIdx !== secIdx) {
      setDragOverSectionIdx(secIdx);
    }
  };

  const handleSectionDrop = (e: React.DragEvent, targetSecIdx: number) => {
    e.preventDefault();
    if (draggedSectionIdx !== null && draggedSectionIdx !== targetSecIdx) {
      const newSections = [...(page.sections || [])];
      const [moved] = newSections.splice(draggedSectionIdx, 1);
      newSections.splice(targetSecIdx, 0, moved);
      onChange({ ...page, sections: newSections });
    }
    setDraggedSectionIdx(null);
    setDragOverSectionIdx(null);
  };

  const activeSelectedItem =
    selectedBlock?.type === "item" &&
    selectedBlock.secIdx !== undefined &&
    selectedBlock.itemIdx !== undefined &&
    page.sections?.[selectedBlock.secIdx]?.items?.[selectedBlock.itemIdx]
      ? page.sections[selectedBlock.secIdx].items[selectedBlock.itemIdx]
      : null;

  const activeSelectedSection =
    selectedBlock?.type === "section" &&
    selectedBlock.secIdx !== undefined &&
    page.sections?.[selectedBlock.secIdx]
      ? page.sections[selectedBlock.secIdx]
      : null;

  // Exact Default Stats for Home Page
  const displayStats: StatMetric[] =
    page.customStyles?.stats && page.customStyles.stats.length > 0
      ? page.customStyles.stats
      : [
          { number: "2,500+", label: "Happy Students" },
          { number: "150+", label: "Expert Faculty" },
          { number: "98.4%", label: "Distinction Rate" },
          { number: "45+", label: "State & National Awards" },
        ];

  const updateStatItem = (index: number, updates: Partial<StatMetric>) => {
    const currentItem = displayStats[index] || { number: "", label: "" };
    const newStats: StatMetric[] = [...displayStats];
    newStats[index] = { ...currentItem, ...updates };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        stats: newStats,
      },
    });
  };

  // Helper defaults for Chairman / Principal / About
  const chairmanName = page.customStyles?.chairmanName || page.customStyles?.authorName || "Sh. Bhim Singh Jamwal";
  const chairmanTitle = page.customStyles?.chairmanTitle || page.customStyles?.authorTitle || "Chairman & Managing Trustee";
  const chairmanOrg = page.customStyles?.chairmanOrg || page.customStyles?.authorOrg || "Cambridge Education Foundation";
  const chairmanImage = page.customStyles?.chairmanImage || page.customStyles?.authorImage || page.heroImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600";
  const chairmanQuote = page.customStyles?.chairmanQuote || page.customStyles?.quote || '"Education is the most powerful weapon which you can use to change the world."';
  const chairmanQuoteAuthor = page.customStyles?.quoteAuthor || "Nelson Mandela";
  const chairmanHeadline = page.customStyles?.storyHeadline || "Dear Parents, Educators, and Esteemed Students,";
  const chairmanMessageText =
    page.customStyles?.chairmanMessage ||
    page.customStyles?.mainStory ||
    "It brings me immense joy and pride to welcome you to Cambridge International School, Mandi. When we laid the foundation stone of this institution, our guiding ambition was clear: to bring the highest international standards of learning to the children of Himachal Pradesh without compelling families to seek boarding thousands of miles away.\n\nToday, CIS Mandi stands tall as a beacon of academic distinction, technological innovation, and ethical uprightness. We understand that the 21st-century world demands far more than rote memorization. It requires problem-solvers, resilient innovators, ethical decision-makers, and compassionate citizens.\n\nOur 10-acre Himalayan campus provides the optimal synthesis of physical fitness, mental agility, and spiritual peace. I invite you to partner with us in this noble mission of sculpting young minds.";

  const principalName = page.customStyles?.principalName || page.customStyles?.authorName || "Mrs. Priyanka Jamwal";
  const principalTitle = page.customStyles?.principalTitle || page.customStyles?.authorTitle || "Principal & Academic Director";
  const principalOrg = page.customStyles?.principalOrg || page.customStyles?.authorOrg || "Cambridge International School Mandi";
  const principalImage = page.customStyles?.principalImage || page.customStyles?.authorImage || page.heroImage || "/uploads/Mrs_-Priyanka-Jamwal_cb184dc05893.webp";
  const principalQuote = page.customStyles?.principalQuote || page.customStyles?.quote || '"The mind is not a vessel to be filled, but a fire to be kindled."';
  const principalQuoteAuthor = page.customStyles?.quoteAuthor || "Plutarch";
  const principalHeadline = page.customStyles?.storyHeadline || "Welcome to Cambridge International School Mandi";
  const principalMessageText =
    page.customStyles?.principalMessage ||
    page.customStyles?.mainStory ||
    "At Cambridge International School Mandi, our mission transcends traditional textbook instruction. We aim to kindle an enduring passion for discovery, critical inquiry, and creative expression in every student entrusted to our care.\n\nOur pedagogy marries international academic benchmarks with compassionate values. Through experiential learning in smart classrooms, high-tech robotics innovation labs, and holistic sports development, our students blossom into well-rounded, courageous innovators ready to lead with empathy.\n\nI invite all parents and guardians to walk alongside us in this exhilarating educational odyssey.";

  const visionText =
    page.customStyles?.visionText ||
    "To be universally acclaimed as Himachal Pradesh's benchmark center for progressive education, inspiring generations of resilient global thinkers, ethical problem solvers, and visionary change-makers.";
  const missionText =
    page.customStyles?.missionText ||
    "To create a stimulating, safe, and holistic learning sanctuary where every student discovers their innate brilliance, achieves benchmark academic excellence, and cultivates compassionate leadership rooted in Indian cultural ethos.";

  const aboutHeadline = page.customStyles?.storyHeadline || "An Inspiring Himalayan Learning Sanctuary";
  const aboutStory =
    page.customStyles?.mainStory ||
    "Situated in the historic and scenic town of Mandi (known as the 'Varanasi of the Hills'), Cambridge International School Mandi spans a verdant 10-acre campus surrounded by pine-clad mountains and the tranquil Beas river valley.\n\nOur pedagogical philosophy is built on the premise that every student is endowed with unique potential. By synthesizing the rigor of the Central Board of Secondary Education (CBSE Affiliation No. 630198) with progressive Cambridge inquiry methodologies, we foster critical thinking, STEM innovation, artistic expression, and moral character.";
  const aboutCampusPhoto = page.customStyles?.authorImage || page.heroImage || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800";
  const aboutStat1Num = page.customStyles?.aboutStat1Number || page.customStyles?.stats?.[0]?.number || "2014";
  const aboutStat1Lbl = page.customStyles?.aboutStat1Label || page.customStyles?.stats?.[0]?.label || "Year of Inception";
  const aboutStat2Num = page.customStyles?.aboutStat2Number || page.customStyles?.stats?.[1]?.number || "10 Acres";
  const aboutStat2Lbl = page.customStyles?.aboutStat2Label || page.customStyles?.stats?.[1]?.label || "Lush Campus";

  const homeWings = Array.isArray(page.customStyles?.academic_wings_data) && page.customStyles.academic_wings_data.length > 0
    ? page.customStyles.academic_wings_data
    : DEFAULT_WINGS;

  const activeWing = homeWings[activeHomeWingIdx] || homeWings[0] || DEFAULT_WINGS[0];

  const updateActiveWing = (updates: Partial<typeof DEFAULT_WINGS[0]>) => {
    const updatedWings = homeWings.map((w: any, idx: number) => {
      if (idx === activeHomeWingIdx) {
        return { ...w, ...updates };
      }
      return w;
    });
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        academic_wings_data: updatedWings,
      },
    });
  };

  const updateWingSubject = (subIdx: number, newText: string) => {
    const newSubjects = [...(activeWing.subjects || [])];
    newSubjects[subIdx] = newText;
    updateActiveWing({ subjects: newSubjects });
  };

  const addWingSubject = () => {
    const newSubjects = [...(activeWing.subjects || []), "New Curricular Highlight"];
    updateActiveWing({ subjects: newSubjects });
  };

  const removeWingSubject = (subIdx: number) => {
    const newSubjects = (activeWing.subjects || []).filter((_: any, i: number) => i !== subIdx);
    updateActiveWing({ subjects: newSubjects });
  };

  const homeWhyReasons = Array.isArray(page.customStyles?.why_choose_us_cards) && page.customStyles.why_choose_us_cards.length > 0
    ? page.customStyles.why_choose_us_cards
    : DEFAULT_WHY_REASONS;

  const updateWhyReason = (rIdx: number, updates: Partial<typeof DEFAULT_WHY_REASONS[0]>) => {
    const updatedReasons = homeWhyReasons.map((r: any, idx: number) => {
      if (idx === rIdx) {
        return { ...r, ...updates };
      }
      return r;
    });
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        why_choose_us_cards: updatedReasons,
      },
    });
  };

  return (
    <div
      className={`flex flex-col bg-slate-950 text-slate-100 ${
        isFullscreen ? "fixed inset-0 z-50 overflow-hidden" : "w-full rounded-2xl border border-slate-800 shadow-2xl"
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
      />

      {/* TOP STUDIO TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900 border-b border-slate-800 text-xs select-none">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold uppercase tracking-wider text-amber-400">
            Visual Canvas Studio
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-bold text-white max-w-[180px] truncate">{page.pageName}</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
            {livePagePath}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setEditorMode("canvas_edit")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                editorMode === "canvas_edit"
                  ? "bg-amber-400 text-slate-950 shadow-md scale-[1.02]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit on Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("live_page")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                editorMode === "live_page"
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Exact Website View</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            {(Object.keys(VIEWPORTS) as ViewportMode[]).map((vKey) => {
              const vp = VIEWPORTS[vKey];
              const isActive = viewport === vKey;
              return (
                <button
                  key={vKey}
                  type="button"
                  onClick={() => setViewport(vKey)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    isActive ? "bg-slate-800 text-amber-400 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                  title={`${vp.name} (${vp.resolution})`}
                >
                  {vKey === "desktop" && <Monitor className="w-3.5 h-3.5" />}
                  {vKey === "tablet" && <Tablet className="w-3.5 h-3.5" />}
                  {vKey.startsWith("mobile") && <Smartphone className="w-3.5 h-3.5" />}
                  <span className="text-[11px]">{vp.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Section</span>
          </button>

          <Link
            href={livePagePath}
            target="_blank"
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Live</span>
          </Link>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl font-extrabold shadow-lg transition-all cursor-pointer ${
              savedSuccess
                ? "bg-emerald-500 text-slate-950 scale-105"
                : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex flex-1 min-h-[750px] relative overflow-hidden bg-[#0a0f1d]">
        <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div
            className={`transition-all duration-300 ${
              VIEWPORTS[viewport].widthClass
            } bg-slate-950 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col relative`}
          >
            {(isMobileViewport || isTabletViewport) && (
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-bold text-amber-400">
                  📱 {VIEWPORTS[viewport].name} ({VIEWPORTS[viewport].resolution})
                </span>
                <span className="text-slate-500">Exact Pixel Live Canvas Editing</span>
              </div>
            )}

            {editorMode === "live_page" ? (
              <div className="w-full h-[850px] bg-slate-900 relative">
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={livePagePath}
                  className="w-full h-full border-0"
                  title="Live Preview"
                  onLoad={() => setIframeLoading(false)}
                />
              </div>
            ) : (
              /* ON-CANVAS PIXEL-EXACT WYSIWYG EDITOR */
              <div className="w-full bg-white dark:bg-[#071326] text-slate-900 dark:text-slate-100 flex flex-col">
                
                {/* ========================================================================= */}
                {/* 1. HOME PAGE HERO BANNER & STATS */}
                {/* ========================================================================= */}
                {isHomePage && (
                  <>
                    <div
                      onClick={() => {
                        setSelectedBlock({ type: "hero" });
                        setActiveInspectorTab("hero");
                      }}
                      className={`relative cursor-pointer transition-all overflow-hidden ${
                        selectedBlock?.type === "hero" ? "ring-2 ring-amber-500 ring-offset-2" : ""
                      }`}
                      style={{ minHeight: `${page.heroImageHeight || 480}px` }}
                    >
                      {/* Background Video / Image Layer */}
                      {page.heroMediaType === "VIDEO" && (page.heroVideoUrl || "https://youtu.be/slAltokCyL0") ? (
                        <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden">
                          <img
                            src={
                              page.heroImage ||
                              "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600"
                            }
                            alt="Hero Poster"
                            className="w-full h-full object-cover opacity-60"
                          />
                        </div>
                      ) : (
                        <img
                          src={
                            page.heroImage ||
                            "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600"
                          }
                          alt="Hero Banner"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}

                      <div
                        className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30"
                        style={{ opacity: page.heroOverlayOpacity ?? 0.55 }}
                      />

                      {/* Quick Upload Pill on Top-Right */}
                      <div className="absolute top-4 right-4 z-30 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs shadow-lg">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerImageUpload("hero");
                          }}
                          className="hover:text-amber-400 flex items-center space-x-1 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Media</span>
                        </button>
                        <span className="text-slate-600">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowUrlModal({
                              type: "hero",
                              currentUrl: page.heroImage || "",
                            });
                          }}
                          className="hover:text-amber-400 cursor-pointer"
                        >
                          URL
                        </button>
                      </div>

                      {/* HERO CONTENT */}
                      <div className="relative z-10 p-6 sm:p-12 space-y-8 flex flex-col justify-between h-full min-h-[480px]">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl pt-4">
                          <div className="glass-panel bg-slate-900/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex items-center space-x-3 text-white shadow-lg">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-black">CBSE Affiliated 630198</p>
                              <p className="text-[10px] text-slate-400">Senior Secondary</p>
                            </div>
                          </div>

                          <div className="glass-panel bg-slate-900/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex items-center space-x-3 text-white shadow-lg">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                              <TreePine className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-black">10-Acre Campus</p>
                              <p className="text-[10px] text-slate-400">Alpine Serenity</p>
                            </div>
                          </div>

                          <div className="glass-panel bg-slate-900/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl flex items-center space-x-3 text-white shadow-lg">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                              <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-black">100% Board Results</p>
                              <p className="text-[10px] text-slate-400">District Distinctions</p>
                            </div>
                          </div>
                        </div>

                        {/* Main Headline & Subtitle */}
                        <div className="max-w-4xl space-y-4 pt-4">
                          <input
                            type="text"
                            value={page.heroTitle || "EDUCATING FOR A BETTER WORLD"}
                            onChange={(e) => onChange({ ...page, heroTitle: e.target.value })}
                            placeholder="Hero Title Headline..."
                            className="w-full bg-transparent font-black text-3xl sm:text-5xl text-white tracking-tight focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 font-heading"
                          />

                          <textarea
                            rows={2}
                            value={
                              page.heroSubtitle ||
                              "At Cambridge International School, Mandi, we blend Cambridge inquiry-based pedagogy, STEM innovation labs, and Olympic sports to nurture visionary thinkers and compassionate global leaders."
                            }
                            onChange={(e) => onChange({ ...page, heroSubtitle: e.target.value })}
                            placeholder="Hero Subtitle / Description..."
                            className="w-full bg-transparent text-sm sm:text-base text-slate-200 leading-relaxed focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 resize-none font-sans"
                          />

                          {/* CTA & Video Status Pill */}
                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <input
                              type="text"
                              value={page.heroCtaText || "Apply for Admission 2027"}
                              onChange={(e) => onChange({ ...page, heroCtaText: e.target.value })}
                              placeholder="Button Label..."
                              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl focus:outline-none cursor-text max-w-[220px]"
                            />
                            <input
                              type="text"
                              value={page.heroCtaLink || "/admissions/apply"}
                              onChange={(e) => onChange({ ...page, heroCtaLink: e.target.value })}
                              placeholder="/admissions/apply"
                              className="px-3.5 py-2 bg-slate-900/80 text-white text-xs rounded-xl border border-slate-700 focus:outline-none max-w-[180px]"
                            />

                            <div className="hidden sm:flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-slate-300">
                              <span className="text-emerald-400 font-bold">● 1080p HD</span>
                              <span>|</span>
                              <span className="flex items-center space-x-1">
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Sound: ON</span>
                              </span>
                              <span>|</span>
                              <span className="text-rose-400 font-bold flex items-center space-x-1">
                                <Play className="w-3 h-3 fill-current" />
                                <span>YouTube</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Counter Bar */}
                    <div
                      onClick={() => {
                        setSelectedBlock({ type: "stats" });
                        setActiveInspectorTab("stats");
                      }}
                      className="relative z-20 -mt-8 sm:-mt-12 px-6 sm:px-10 pb-8"
                    >
                      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-card-interactive flex items-center space-x-4 p-4 rounded-2xl group border border-slate-100 dark:border-slate-800">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Users className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={displayStats[0]?.number || "2,500+"}
                              onChange={(e) => updateStatItem(0, { number: e.target.value })}
                              className="font-heading font-extrabold text-2xl sm:text-3xl text-school-primary dark:text-white block tracking-tight bg-transparent focus:outline-none w-full"
                            />
                            <input
                              type="text"
                              value={displayStats[0]?.label || "Happy Students"}
                              onChange={(e) => updateStatItem(0, { label: e.target.value })}
                              className="text-xs font-bold text-slate-800 dark:text-slate-200 block bg-transparent focus:outline-none w-full"
                            />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              From Pre-Primary to Class XII
                            </p>
                          </div>
                        </div>

                        <div className="glass-card-interactive flex items-center space-x-4 p-4 rounded-2xl group border border-slate-100 dark:border-slate-800">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={displayStats[1]?.number || "150+"}
                              onChange={(e) => updateStatItem(1, { number: e.target.value })}
                              className="font-heading font-extrabold text-2xl sm:text-3xl text-school-primary dark:text-white block tracking-tight bg-transparent focus:outline-none w-full"
                            />
                            <input
                              type="text"
                              value={displayStats[1]?.label || "Expert Faculty"}
                              onChange={(e) => updateStatItem(1, { label: e.target.value })}
                              className="text-xs font-bold text-slate-800 dark:text-slate-200 block bg-transparent focus:outline-none w-full"
                            />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              Trained & Cambridge Certified
                            </p>
                          </div>
                        </div>

                        <div className="glass-card-interactive flex items-center space-x-4 p-4 rounded-2xl group border border-slate-100 dark:border-slate-800">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Award className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={displayStats[2]?.number || "98.4%"}
                              onChange={(e) => updateStatItem(2, { number: e.target.value })}
                              className="font-heading font-extrabold text-2xl sm:text-3xl text-school-primary dark:text-white block tracking-tight bg-transparent focus:outline-none w-full"
                            />
                            <input
                              type="text"
                              value={displayStats[2]?.label || "Distinction Rate"}
                              onChange={(e) => updateStatItem(2, { label: e.target.value })}
                              className="text-xs font-bold text-slate-800 dark:text-slate-200 block bg-transparent focus:outline-none w-full"
                            />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              CBSE Board Exam Avg Percentile
                            </p>
                          </div>
                        </div>

                        <div className="glass-card-interactive flex items-center space-x-4 p-4 rounded-2xl group border border-slate-100 dark:border-slate-800">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Trophy className="w-7 h-7" />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={displayStats[3]?.number || "45+"}
                              onChange={(e) => updateStatItem(3, { number: e.target.value })}
                              className="font-heading font-extrabold text-2xl sm:text-3xl text-school-primary dark:text-white block tracking-tight bg-transparent focus:outline-none w-full"
                            />
                            <input
                              type="text"
                              value={displayStats[3]?.label || "State & National Awards"}
                              onChange={(e) => updateStatItem(3, { label: e.target.value })}
                              className="text-xs font-bold text-slate-800 dark:text-slate-200 block bg-transparent focus:outline-none w-full"
                            />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                              National & State Laurels
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leadership Messages on Home Page */}
                    <div
                      onClick={() => {
                        setSelectedBlock({ type: "leadership" });
                        setActiveInspectorTab("leadership");
                      }}
                      className="py-16 sm:py-20 px-6 sm:px-10 bg-[#f0f7ff]/50 dark:bg-[#071933] space-y-12"
                    >
                      <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center space-x-2 text-school-secondary font-bold text-xs uppercase tracking-wider glass-badge px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>GUIDING VISION & LEADERSHIP</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-school-primary dark:text-white font-heading">
                          Messages from Our Leadership
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Fostering an ecosystem of intellectual curiosity, character building, and Himalayan resilience.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                        {/* Chairman Card */}
                        <div className="glass-panel bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl flex flex-col justify-between border border-slate-200 dark:border-slate-800 space-y-6 relative group/leader">
                          <div className="space-y-5">
                            <div className="flex items-center space-x-4">
                              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md flex-shrink-0 bg-slate-800 relative group/img">
                                <img
                                  src={chairmanImage}
                                  alt="Chairman"
                                  className="w-full h-full object-cover object-top"
                                />
                                <button
                                  type="button"
                                  onClick={() => triggerImageUpload("chairman")}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-amber-400 text-[10px] font-bold cursor-pointer"
                                >
                                  Upload
                                </button>
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                                  VISION 2030
                                </span>
                                <input
                                  type="text"
                                  value={chairmanName}
                                  onChange={(e) =>
                                    onChange({
                                      ...page,
                                      customStyles: {
                                        ...page.customStyles,
                                        chairmanName: e.target.value,
                                        authorName: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Chairman Full Name..."
                                  className="w-full bg-transparent font-bold text-xl text-school-primary dark:text-white focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={chairmanTitle}
                                  onChange={(e) =>
                                    onChange({
                                      ...page,
                                      customStyles: {
                                        ...page.customStyles,
                                        chairmanTitle: e.target.value,
                                        authorTitle: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Designation..."
                                  className="w-full bg-transparent text-xs text-slate-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border-l-4 border-amber-400 text-xs text-slate-700 dark:text-slate-300 italic">
                              <textarea
                                rows={2}
                                value={chairmanQuote}
                                onChange={(e) =>
                                  onChange({
                                    ...page,
                                    customStyles: {
                                      ...page.customStyles,
                                      chairmanQuote: e.target.value,
                                      quote: e.target.value,
                                    },
                                  })
                                }
                                className="w-full bg-transparent focus:outline-none resize-none font-bold"
                              />
                            </div>

                            <textarea
                              rows={4}
                              value={chairmanMessageText}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    chairmanMessage: e.target.value,
                                    mainStory: e.target.value,
                                  },
                                })
                              }
                              className="w-full bg-transparent text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed resize-y focus:outline-none"
                            />
                          </div>

                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-500">
                            <span>Read Chairman's Full Message →</span>
                          </div>
                        </div>

                        {/* Principal Card */}
                        <div className="glass-panel bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl flex flex-col justify-between border border-slate-200 dark:border-slate-800 space-y-6 relative group/leader">
                          <div className="space-y-5">
                            <div className="flex items-center space-x-4">
                              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-400 shadow-md flex-shrink-0 bg-slate-800 relative group/img">
                                <img
                                  src={principalImage}
                                  alt="Principal"
                                  className="w-full h-full object-cover object-top"
                                />
                                <button
                                  type="button"
                                  onClick={() => triggerImageUpload("principal")}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-blue-400 text-[10px] font-bold cursor-pointer"
                                >
                                  Upload
                                </button>
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
                                  ACADEMIC ETHOS
                                </span>
                                <input
                                  type="text"
                                  value={principalName}
                                  onChange={(e) =>
                                    onChange({
                                      ...page,
                                      customStyles: {
                                        ...page.customStyles,
                                        principalName: e.target.value,
                                        authorName: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Principal Full Name..."
                                  className="w-full bg-transparent font-bold text-xl text-school-primary dark:text-white focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={principalTitle}
                                  onChange={(e) =>
                                    onChange({
                                      ...page,
                                      customStyles: {
                                        ...page.customStyles,
                                        principalTitle: e.target.value,
                                        authorTitle: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Designation..."
                                  className="w-full bg-transparent text-xs text-slate-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border-l-4 border-blue-400 text-xs text-slate-700 dark:text-slate-300 italic">
                              <textarea
                                rows={2}
                                value={principalQuote}
                                onChange={(e) =>
                                  onChange({
                                    ...page,
                                    customStyles: {
                                      ...page.customStyles,
                                      principalQuote: e.target.value,
                                      quote: e.target.value,
                                    },
                                  })
                                }
                                className="w-full bg-transparent focus:outline-none resize-none font-bold"
                              />
                            </div>

                            <textarea
                              rows={4}
                              value={principalMessageText}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    principalMessage: e.target.value,
                                    mainStory: e.target.value,
                                  },
                                })
                              }
                              className="w-full bg-transparent text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed resize-y focus:outline-none"
                            />
                          </div>

                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-500">
                            <span>Read Principal's Full Message →</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Academic Continuum & Wings */}
                    <div
                      onClick={() => {
                        setSelectedBlock({ type: "wings" });
                        setActiveInspectorTab("wings");
                      }}
                      className="py-16 sm:py-24 px-6 sm:px-10 bg-[#f0f7ff]/40 dark:bg-[#051329] space-y-10 border-t border-slate-200/50 dark:border-slate-800/80 relative"
                    >
                      {/* Section Header */}
                      <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center space-x-2 text-school-secondary font-bold text-xs uppercase tracking-wider glass-badge px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                          <BookOpen className="w-3.5 h-3.5" />
                          <input
                            type="text"
                            value={page.customStyles?.academic_wings_badge || "Curriculum & Learning Continuum"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  academic_wings_badge: e.target.value,
                                },
                              })
                            }
                            placeholder="Section Badge..."
                            className="bg-transparent text-center focus:outline-none font-bold"
                          />
                        </div>
                        <input
                          type="text"
                          value={page.customStyles?.academic_wings_title || "Academic Excellence from Foundation to Senior Secondary"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                academic_wings_title: e.target.value,
                              },
                            })
                          }
                          placeholder="Section Title..."
                          className="w-full bg-transparent text-center text-3xl sm:text-4xl font-extrabold text-school-primary dark:text-white font-heading focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={page.customStyles?.academic_wings_subtitle || "A seamless educational pathway blending national curriculum benchmarks with international 21st-century inquiry skills."}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                academic_wings_subtitle: e.target.value,
                              },
                            })
                          }
                          placeholder="Section Subtitle..."
                          className="w-full bg-transparent text-center text-sm text-slate-600 dark:text-slate-400 focus:outline-none resize-none"
                        />
                      </div>

                      {/* Glass Tab Selector */}
                      <div className="flex flex-wrap justify-center gap-2.5">
                        {homeWings.map((w: any, idx: number) => (
                          <button
                            key={w.id || idx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHomeWingIdx(idx);
                            }}
                            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center space-x-2 cursor-pointer ${
                              activeHomeWingIdx === idx
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105 border border-blue-400/40 ring-2 ring-amber-400"
                                : "bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:border-amber-400 border border-slate-200 dark:border-slate-800"
                            }`}
                          >
                            <span>{w.title}</span>
                            <span className="text-[10px] opacity-80 font-normal">({w.grades})</span>
                          </button>
                        ))}
                      </div>

                      {/* Active Wing Showcase */}
                      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
                        <div className="lg:col-span-6 space-y-5">
                          <div className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold px-3.5 py-1 rounded-full">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Age Group:</span>
                            <input
                              type="text"
                              value={activeWing.age || "6 to 10 Years"}
                              onChange={(e) => updateActiveWing({ age: e.target.value })}
                              placeholder="e.g. 6 to 10 Years"
                              className="bg-transparent font-bold focus:outline-none max-w-[140px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <input
                              type="text"
                              value={activeWing.title || ""}
                              onChange={(e) => updateActiveWing({ title: e.target.value })}
                              placeholder="Wing Title (e.g. Primary Wing)"
                              className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white font-heading focus:outline-none"
                            />
                            <input
                              type="text"
                              value={activeWing.grades || ""}
                              onChange={(e) => updateActiveWing({ grades: e.target.value })}
                              placeholder="Grades Covered (e.g. Grades 1 to 5)"
                              className="w-full bg-transparent text-sm font-semibold text-blue-600 dark:text-blue-400 focus:outline-none"
                            />
                          </div>

                          <textarea
                            rows={3}
                            value={activeWing.desc || ""}
                            onChange={(e) => updateActiveWing({ desc: e.target.value })}
                            placeholder="Wing educational description..."
                            className="w-full bg-transparent text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed focus:outline-none resize-none"
                          />

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Key Curricular Highlights
                              </p>
                              <button
                                type="button"
                                onClick={addWingSubject}
                                className="text-[11px] font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Highlight</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {(activeWing.subjects || []).map((sub: string, sIdx: number) => (
                                <div
                                  key={sIdx}
                                  className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  <input
                                    type="text"
                                    value={sub}
                                    onChange={(e) => updateWingSubject(sIdx, e.target.value)}
                                    className="w-full bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none text-xs font-medium"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeWingSubject(sIdx)}
                                    className="text-slate-400 hover:text-rose-500 p-0.5"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 flex items-center space-x-3">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg border border-blue-400/30">
                              <span>Explore Full {activeWing.title} Details</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={activeWing.link || "/academics"}
                              onChange={(e) => updateActiveWing({ link: e.target.value })}
                              placeholder="/academics/primary"
                              className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none max-w-[200px]"
                            />
                          </div>
                        </div>

                        {/* Wing Photo with Hover Upload Actions */}
                        <div className="lg:col-span-6 relative group/wingimg overflow-hidden rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 h-80 sm:h-96 bg-slate-900">
                          <img
                            src={activeWing.image || "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800"}
                            alt={activeWing.title}
                            className="w-full h-full object-cover group-hover/wingimg:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/wingimg:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3 p-4">
                            <span className="text-white text-xs font-bold">Update {activeWing.title} Photo</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerImageUpload("wing");
                                }}
                                className="px-3.5 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer hover:bg-amber-300"
                              >
                                Upload Image
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowUrlModal({
                                    type: "wing",
                                    currentUrl: activeWing.image || "",
                                  });
                                }}
                                className="px-3.5 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-700"
                              >
                                Image URL
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Why Cambridge Mandi? - Benchmark Quality Standards (8 Cards) */}
                    <div
                      onClick={() => {
                        setSelectedBlock({ type: "why_us" });
                        setActiveInspectorTab("why_us");
                      }}
                      className="py-16 sm:py-24 px-6 sm:px-10 bg-white dark:bg-[#071933] space-y-12 border-t border-slate-200/50 dark:border-slate-800/80"
                    >
                      {/* Section Header */}
                      <div className="text-center max-w-3xl mx-auto space-y-3">
                        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full uppercase tracking-wider text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <input
                            type="text"
                            value={page.customStyles?.why_choose_us_badge || "Benchmark Quality Standards"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  why_choose_us_badge: e.target.value,
                                },
                              })
                            }
                            placeholder="Section Badge..."
                            className="bg-transparent text-center focus:outline-none font-bold"
                          />
                        </div>

                        <input
                          type="text"
                          value={page.customStyles?.why_choose_us_title || "Why Cambridge Mandi?"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                why_choose_us_title: e.target.value,
                              },
                            })
                          }
                          placeholder="Section Title..."
                          className="w-full bg-transparent text-center text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-school-primary dark:text-white tracking-tight focus:outline-none"
                        />

                        <textarea
                          rows={2}
                          value={page.customStyles?.why_choose_us_subtitle || "Discover what sets Cambridge International School Mandi apart as the finest CBSE day & residential institution in Himachal Pradesh."}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                why_choose_us_subtitle: e.target.value,
                              },
                            })
                          }
                          placeholder="Section Subtitle..."
                          className="w-full bg-transparent text-center text-sm text-slate-600 dark:text-slate-300 leading-relaxed focus:outline-none resize-none"
                        />
                      </div>

                      {/* 8-Card Responsive Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {homeWhyReasons.map((reason: any, rIdx: number) => {
                          const colorClass = reason.color || DEFAULT_WHY_REASONS[rIdx % DEFAULT_WHY_REASONS.length]?.color || "from-blue-500 to-indigo-600";
                          return (
                            <div
                              key={rIdx}
                              className="glass-card-interactive bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-amber-400/80 transition-all shadow group"
                            >
                              <div className="space-y-3">
                                <div
                                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${colorClass} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/20`}
                                >
                                  <Sparkles className="w-6 h-6" />
                                </div>

                                <input
                                  type="text"
                                  value={reason.title || ""}
                                  onChange={(e) => updateWhyReason(rIdx, { title: e.target.value })}
                                  placeholder="Feature / Distinction Title..."
                                  className="w-full bg-transparent font-bold text-base text-school-primary dark:text-white leading-snug focus:outline-none"
                                />

                                <textarea
                                  rows={3}
                                  value={reason.desc || ""}
                                  onChange={(e) => updateWhyReason(rIdx, { desc: e.target.value })}
                                  placeholder="Feature description text..."
                                  className="w-full bg-transparent text-xs text-slate-600 dark:text-slate-400 leading-relaxed focus:outline-none resize-none"
                                />
                              </div>

                              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-amber-400">
                                <span>Explore Standard</span>
                                <span>→</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Interactive Campus Map & Location Highlights Card Editor */}
                    <div className="p-6 sm:p-10 bg-slate-50 dark:bg-slate-900/90 border-t border-b border-slate-200 dark:border-slate-800 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-school-primary dark:text-white">
                              Campus Map & Location Highlights Card
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Directly edit the text shown on the &quot;Verified Campus Location&quot; card beside the Google Map.
                            </p>
                          </div>
                        </div>

                        <Link
                          href="/admin/settings"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Global Settings & Pin Studio</span>
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Campus Proximity / Drive Time Highlight
                          </label>
                          <input
                            type="text"
                            value={page.customStyles?.campus_drive_time || "5 Minutes drive from Mandi Town / Victoria Bridge"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  campus_drive_time: e.target.value,
                                },
                              })
                            }
                            placeholder="5 Minutes drive from Mandi Town / Victoria Bridge"
                            className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Admissions Helpline Phone Number
                          </label>
                          <input
                            type="text"
                            value={page.customStyles?.contact_phone || "+91 1905 243366 / +91 8580579409"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  contact_phone: e.target.value,
                                },
                              })
                            }
                            placeholder="+91 1905 243366 / +91 8580579409"
                            className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            School Bus & Transport Fleet Coverage Highlight
                          </label>
                          <input
                            type="text"
                            value={page.customStyles?.campus_transport_info || "GPS Monitored School Bus Transport Across Mandi & Ner Chowk"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  campus_transport_info: e.target.value,
                                },
                              })
                            }
                            placeholder="GPS Monitored School Bus Transport Across Mandi & Ner Chowk"
                            className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ========================================================================= */}
                {/* 2. SUBPAGES: EXACT PAGE HEADER (MATCHING LIVE WEBSITE) */}
                {/* ========================================================================= */}
                {!isHomePage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "header" });
                      setActiveInspectorTab("header");
                    }}
                    className={`relative w-full bg-gradient-to-r from-[#030816] via-[#0A2540] to-[#001f3f] text-white py-12 sm:py-16 px-6 sm:px-12 border-b border-white/10 space-y-4 cursor-pointer group transition-all ${
                      selectedBlock?.type === "header" ? "ring-2 ring-amber-400" : ""
                    }`}
                  >
                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span>Home</span>
                      <span>›</span>
                      <span>{page.slug.includes("message") || page.slug === "mission-vision" || page.slug === "about" ? "About Us" : "Pages"}</span>
                      <span>›</span>
                      <span className="text-amber-400 font-bold">{page.pageName}</span>
                    </div>

                    {/* Badge */}
                    <div>
                      <div className="inline-flex items-center space-x-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <input
                          type="text"
                          value={page.heroBadge || `${page.pageName} • CIS Mandi`}
                          onChange={(e) => onChange({ ...page, heroBadge: e.target.value })}
                          placeholder="Header Badge..."
                          className="bg-transparent focus:outline-none font-bold text-amber-300 w-auto"
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <input
                      type="text"
                      value={page.heroTitle || page.pageName}
                      onChange={(e) => onChange({ ...page, heroTitle: e.target.value })}
                      placeholder="Page Heading Title..."
                      className="w-full bg-transparent text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60"
                    />

                    {/* Subtitle / Description */}
                    <textarea
                      rows={2}
                      value={page.heroSubtitle || ""}
                      onChange={(e) => onChange({ ...page, heroSubtitle: e.target.value })}
                      placeholder="Page subtitle or introduction description..."
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-300 leading-relaxed focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 resize-none font-sans"
                    />
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 3. CHAIRMAN'S DESK: EXACT 2-COLUMN PORTRAIT & LETTER VIEW */}
                {/* ========================================================================= */}
                {isChairmanPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "desk" });
                      setActiveInspectorTab("desk");
                    }}
                    className="p-6 sm:p-12 space-y-12 bg-slate-50 dark:bg-[#071326]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-7xl mx-auto">
                      {/* Left: Chairman Portrait Column (4 cols) */}
                      <div className="lg:col-span-4 space-y-5">
                        <div className="glass-card bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group/portrait">
                          <div className="relative rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-400/40">
                            <img
                              src={chairmanImage}
                              alt="Chairman"
                              className="w-full h-80 object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/portrait:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => triggerImageUpload("chairman")}
                                className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                              >
                                Upload Photo
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowUrlModal({
                                    type: "chairman",
                                    currentUrl: chairmanImage,
                                  })
                                }
                                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                              >
                                URL
                              </button>
                            </div>
                          </div>

                          <div className="text-center space-y-1">
                            <input
                              type="text"
                              value={chairmanName}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    chairmanName: e.target.value,
                                    authorName: e.target.value,
                                  },
                                })
                              }
                              placeholder="Chairman Full Name"
                              className="w-full text-center font-bold text-xl text-school-primary dark:text-white bg-transparent focus:outline-none"
                            />
                            <input
                              type="text"
                              value={chairmanTitle}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    chairmanTitle: e.target.value,
                                    authorTitle: e.target.value,
                                  },
                                })
                              }
                              placeholder="Chairman Designation"
                              className="w-full text-center text-xs font-semibold text-school-secondary uppercase tracking-wider bg-transparent focus:outline-none"
                            />
                            <input
                              type="text"
                              value={chairmanOrg}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    chairmanOrg: e.target.value,
                                    authorOrg: e.target.value,
                                  },
                                })
                              }
                              placeholder="Organization"
                              className="w-full text-center text-[11px] text-slate-500 bg-transparent focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Quote Box */}
                        <div className="bg-amber-50 dark:bg-amber-950/50 p-5 rounded-2xl border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                            Featured Vision Quote
                          </label>
                          <textarea
                            rows={2}
                            value={chairmanQuote}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  chairmanQuote: e.target.value,
                                  quote: e.target.value,
                                },
                              })
                            }
                            placeholder="Featured Quote..."
                            className="w-full bg-transparent font-bold focus:outline-none resize-none"
                          />
                          <input
                            type="text"
                            value={chairmanQuoteAuthor}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  quoteAuthor: e.target.value,
                                },
                              })
                            }
                            placeholder="— Quote Author"
                            className="w-full bg-transparent text-[11px] opacity-80 focus:outline-none text-right"
                          />
                        </div>
                      </div>

                      {/* Right: Letter Column (8 cols) */}
                      <div className="lg:col-span-8 glass-card bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative">
                        <Quote className="w-12 h-12 text-amber-400/20 absolute top-8 right-8 pointer-events-none" />

                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-school-secondary block">
                            Opening Salutation / Headline
                          </label>
                          <input
                            type="text"
                            value={chairmanHeadline}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  storyHeadline: e.target.value,
                                },
                              })
                            }
                            placeholder="Opening Salutation..."
                            className="w-full bg-transparent text-2xl font-bold text-school-primary dark:text-white focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60"
                          />

                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-2">
                            Message Story (Separate paragraphs with double Enter)
                          </label>
                          <textarea
                            rows={10}
                            value={chairmanMessageText}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  chairmanMessage: e.target.value,
                                  mainStory: e.target.value,
                                },
                              })
                            }
                            placeholder="Write Chairman's full message here..."
                            className="w-full bg-transparent text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 resize-y"
                          />
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-base text-school-primary dark:text-white font-heading">
                              {chairmanName}
                            </p>
                            <p className="text-xs text-slate-500">{chairmanTitle}, CIS Mandi</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 4. PRINCIPAL'S DESK: EXACT 2-COLUMN PORTRAIT & LETTER VIEW */}
                {/* ========================================================================= */}
                {isPrincipalPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "desk" });
                      setActiveInspectorTab("desk");
                    }}
                    className="p-6 sm:p-12 space-y-12 bg-slate-50 dark:bg-[#071326]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-7xl mx-auto">
                      {/* Left: Principal Portrait Column (4 cols) */}
                      <div className="lg:col-span-4 space-y-5">
                        <div className="glass-card bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group/portrait">
                          <div className="relative rounded-2xl overflow-hidden bg-slate-800 border-2 border-blue-400/40">
                            <img
                              src={principalImage}
                              alt="Principal"
                              className="w-full h-80 object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/portrait:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => triggerImageUpload("principal")}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                              >
                                Upload Photo
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowUrlModal({
                                    type: "principal",
                                    currentUrl: principalImage,
                                  })
                                }
                                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                              >
                                URL
                              </button>
                            </div>
                          </div>

                          <div className="text-center space-y-1">
                            <input
                              type="text"
                              value={principalName}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    principalName: e.target.value,
                                    authorName: e.target.value,
                                  },
                                })
                              }
                              placeholder="Principal Full Name"
                              className="w-full text-center font-bold text-xl text-school-primary dark:text-white bg-transparent focus:outline-none"
                            />
                            <input
                              type="text"
                              value={principalTitle}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    principalTitle: e.target.value,
                                    authorTitle: e.target.value,
                                  },
                                })
                              }
                              placeholder="Principal Designation"
                              className="w-full text-center text-xs font-semibold text-school-secondary uppercase tracking-wider bg-transparent focus:outline-none"
                            />
                            <input
                              type="text"
                              value={principalOrg}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    principalOrg: e.target.value,
                                    authorOrg: e.target.value,
                                  },
                                })
                              }
                              placeholder="Organization"
                              className="w-full text-center text-[11px] text-slate-500 bg-transparent focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Quote Box */}
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-5 rounded-2xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            Academic Ethos Quote
                          </label>
                          <textarea
                            rows={2}
                            value={principalQuote}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  principalQuote: e.target.value,
                                  quote: e.target.value,
                                },
                              })
                            }
                            placeholder="Featured Quote..."
                            className="w-full bg-transparent font-bold focus:outline-none resize-none"
                          />
                          <input
                            type="text"
                            value={principalQuoteAuthor}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  quoteAuthor: e.target.value,
                                },
                              })
                            }
                            placeholder="— Quote Author"
                            className="w-full bg-transparent text-[11px] opacity-80 focus:outline-none text-right"
                          />
                        </div>
                      </div>

                      {/* Right: Letter Column (8 cols) */}
                      <div className="lg:col-span-8 glass-card bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative">
                        <Quote className="w-12 h-12 text-blue-400/20 absolute top-8 right-8 pointer-events-none" />

                        <div className="space-y-4">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-school-secondary block">
                            Opening Salutation / Headline
                          </label>
                          <input
                            type="text"
                            value={principalHeadline}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  storyHeadline: e.target.value,
                                },
                              })
                            }
                            placeholder="Opening Salutation..."
                            className="w-full bg-transparent text-2xl font-bold text-school-primary dark:text-white focus:outline-none border-b border-dashed border-transparent hover:border-blue-400/60"
                          />

                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-2">
                            Message Story (Separate paragraphs with double Enter)
                          </label>
                          <textarea
                            rows={10}
                            value={principalMessageText}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  principalMessage: e.target.value,
                                  mainStory: e.target.value,
                                },
                              })
                            }
                            placeholder="Write Principal's full welcome message here..."
                            className="w-full bg-transparent text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed focus:outline-none border-b border-dashed border-transparent hover:border-blue-400/60 resize-y"
                          />
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-base text-school-primary dark:text-white font-heading">
                              {principalName}
                            </p>
                            <p className="text-xs text-slate-500">{principalTitle}, CIS Mandi</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 5. MISSION & VISION: EXACT 2-COLUMN CARDS VIEW */}
                {/* ========================================================================= */}
                {isMissionVisionPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "philosophy" });
                      setActiveInspectorTab("philosophy");
                    }}
                    className="p-6 sm:p-12 space-y-12 bg-slate-50 dark:bg-[#071326]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                      {/* Vision Card */}
                      <div className="glass-card bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-school-secondary to-blue-600 text-white flex items-center justify-center shadow-lg">
                          <Eye className="w-7 h-7 text-amber-300" />
                        </div>
                        <span className="text-xs font-bold text-school-secondary dark:text-sky-400 uppercase tracking-widest block">
                          Our Vision
                        </span>
                        <h2 className="text-2xl font-bold text-school-primary dark:text-white">
                          Shaping Future-Ready Global Citizens
                        </h2>
                        <textarea
                          rows={4}
                          value={visionText}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                visionText: e.target.value,
                              },
                            })
                          }
                          placeholder="Vision statement..."
                          className="w-full bg-transparent text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed focus:outline-none border-b border-dashed border-transparent hover:border-blue-400/60 resize-none"
                        />
                      </div>

                      {/* Mission Card */}
                      <div className="glass-card bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-school-primary to-blue-950 text-white flex items-center justify-center shadow-lg">
                          <Target className="w-7 h-7 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
                          Our Mission
                        </span>
                        <h2 className="text-2xl font-bold text-school-primary dark:text-white">
                          Holistic Excellence & Character Building
                        </h2>
                        <textarea
                          rows={4}
                          value={missionText}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                missionText: e.target.value,
                              },
                            })
                          }
                          placeholder="Mission statement..."
                          className="w-full bg-transparent text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 6. ABOUT US: EXACT HERITAGE & CAMPUS STORY VIEW */}
                {/* ========================================================================= */}
                {isAboutPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "heritage" });
                      setActiveInspectorTab("heritage");
                    }}
                    className="p-6 sm:p-12 space-y-12 bg-slate-50 dark:bg-[#071326]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
                      <div className="lg:col-span-6 space-y-6">
                        <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">
                          Our Heritage & Philosophy
                        </span>
                        <input
                          type="text"
                          value={aboutHeadline}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                storyHeadline: e.target.value,
                              },
                            })
                          }
                          placeholder="Heritage Headline..."
                          className="w-full bg-transparent text-3xl font-extrabold text-school-primary dark:text-white focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60"
                        />
                        <textarea
                          rows={6}
                          value={aboutStory}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                mainStory: e.target.value,
                              },
                            })
                          }
                          placeholder="Write about heritage and campus..."
                          className="w-full bg-transparent text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 resize-y"
                        />

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <input
                              type="text"
                              value={aboutStat1Num}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    aboutStat1Number: e.target.value,
                                  },
                                })
                              }
                              placeholder="2014"
                              className="text-2xl font-black text-school-secondary dark:text-blue-400 bg-transparent focus:outline-none w-full border-b border-dashed border-transparent hover:border-blue-400/60"
                            />
                            <input
                              type="text"
                              value={aboutStat1Lbl}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    aboutStat1Label: e.target.value,
                                  },
                                })
                              }
                              placeholder="Year of Inception"
                              className="text-xs text-slate-500 dark:text-slate-400 bg-transparent focus:outline-none w-full border-b border-dashed border-transparent hover:border-slate-400/60"
                            />
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                            <input
                              type="text"
                              value={aboutStat2Num}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    aboutStat2Number: e.target.value,
                                  },
                                })
                              }
                              placeholder="10 Acres"
                              className="text-2xl font-black text-amber-500 bg-transparent focus:outline-none w-full border-b border-dashed border-transparent hover:border-amber-400/60"
                            />
                            <input
                              type="text"
                              value={aboutStat2Lbl}
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: {
                                    ...page.customStyles,
                                    aboutStat2Label: e.target.value,
                                  },
                                })
                              }
                              placeholder="Lush Campus"
                              className="text-xs text-slate-500 dark:text-slate-400 bg-transparent focus:outline-none w-full border-b border-dashed border-transparent hover:border-slate-400/60"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-6">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group/photo bg-slate-800">
                          <img
                            src={aboutCampusPhoto}
                            alt="CIS Mandi Campus"
                            className="w-full h-[380px] object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => triggerImageUpload("author")}
                              className="px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Upload Photo
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setShowUrlModal({
                                  type: "author",
                                  currentUrl: aboutCampusPhoto,
                                })
                              }
                              className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              URL
                            </button>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 p-4">
                            <p className="text-white text-xs font-semibold">
                              Main Academic Block & Shivalik Mountain Backdrop
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 7. MODULAR DYNAMIC SECTIONS (ELEMENTOR PRO CANVAS FOR ALL PAGES) */}
                {/* ========================================================================= */}
                <div className="p-6 sm:p-10 space-y-12 bg-white dark:bg-[#071326]">
                  {(page.sections || []).map((sec, sIdx) => {
                    const isDragOver = dragOverSectionIdx === sIdx;
                    const isSelected = selectedBlock?.type === "section" && selectedBlock.secIdx === sIdx;

                    let gridCols = "grid-cols-1 md:grid-cols-3";
                    if (sec.layout === "grid_2" || sec.layout === "split") gridCols = "grid-cols-1 md:grid-cols-2";
                    else if (sec.layout === "grid_4") gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
                    else if (sec.layout === "grid_1" || sec.layout === "banner") gridCols = "grid-cols-1";

                    return (
                      <div
                        key={sec.id || `sec_${sIdx}`}
                        draggable
                        onDragStart={(e) => handleSectionDragStart(e, sIdx)}
                        onDragOver={(e) => handleSectionDragOver(e, sIdx)}
                        onDrop={(e) => handleSectionDrop(e, sIdx)}
                        onClick={() => {
                          setSelectedBlock({ type: "section", secIdx: sIdx });
                          setActiveInspectorTab("style_studio");
                        }}
                        className={`space-y-6 border-2 transition-all p-6 sm:p-8 rounded-3xl relative group/sec ${
                          isDragOver
                            ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
                            : isSelected
                            ? "border-amber-500 ring-2 ring-amber-400/40 bg-white dark:bg-slate-900/90 shadow-2xl"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg hover:border-amber-400/60"
                        }`}
                        style={{
                          backgroundColor: sec.bgColor || undefined,
                          backgroundImage: sec.bgGradient || undefined,
                        }}
                      >
                        {/* Section Action Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex items-center space-x-3 flex-1">
                            <div
                              className="cursor-grab active:cursor-grabbing p-1.5 bg-slate-800 text-slate-300 hover:text-amber-400 rounded-lg flex items-center space-x-1"
                              title="Drag to move section"
                            >
                              <GripVertical className="w-4 h-4" />
                              <span className="text-[10px] font-extrabold uppercase">Section #{sIdx + 1}</span>
                            </div>

                            <input
                              type="text"
                              value={sec.badge || ""}
                              onChange={(e) => updateSection(sIdx, { badge: e.target.value })}
                              placeholder="Badge Tag..."
                              className="px-2.5 py-1 bg-amber-400/20 text-amber-500 text-[11px] font-bold rounded-full uppercase tracking-wider focus:outline-none max-w-[150px]"
                            />

                            <input
                              type="text"
                              value={sec.title}
                              onChange={(e) => updateSection(sIdx, { title: e.target.value })}
                              placeholder="Section Title..."
                              className="font-heading font-extrabold text-lg sm:text-xl text-school-primary dark:text-white bg-transparent focus:outline-none flex-1"
                            />
                          </div>

                          <div className="flex items-center space-x-1.5 opacity-90 group-hover/sec:opacity-100">
                            <button
                              type="button"
                              onClick={() => moveSection(sIdx, "up")}
                              disabled={sIdx === 0}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                              title="Move Section Up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSection(sIdx, "down")}
                              disabled={sIdx === (page.sections?.length || 0) - 1}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 cursor-pointer"
                              title="Move Section Down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateSection(sIdx)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              title="Duplicate Section"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSection(sIdx)}
                              className="p-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Section Subtitle */}
                        <textarea
                          rows={2}
                          value={sec.subtitle}
                          onChange={(e) => updateSection(sIdx, { subtitle: e.target.value })}
                          placeholder="Section Subtitle / Description..."
                          className="w-full bg-transparent text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed focus:outline-none resize-none"
                        />

                        {/* Card Items Grid */}
                        <div className={`grid ${gridCols} gap-6`}>
                          {(sec.items || []).map((it, iIdx) => {
                            const isCardSelected =
                              selectedBlock?.type === "item" &&
                              selectedBlock.secIdx === sIdx &&
                              selectedBlock.itemIdx === iIdx;

                            return (
                              <div
                                key={it.id || `item_${sIdx}_${iIdx}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBlock({ type: "item", secIdx: sIdx, itemIdx: iIdx });
                                  setActiveInspectorTab("style_studio");
                                }}
                                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 relative group/item ${
                                  isCardSelected
                                    ? "border-amber-500 ring-2 ring-amber-400 bg-white dark:bg-slate-900 shadow-xl"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 hover:border-amber-400/60 shadow"
                                }`}
                                style={{
                                  backgroundColor: it.bgColor || undefined,
                                }}
                              >
                                {/* Card Image / Visual */}
                                {it.image && (
                                  <div className="relative rounded-xl overflow-hidden bg-slate-900 group/cardimg">
                                    <img
                                      src={it.image}
                                      alt={it.title}
                                      className="w-full object-cover rounded-xl"
                                      style={{ height: `${it.imageHeight || 160}px` }}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/cardimg:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          triggerImageUpload("item", sIdx, iIdx);
                                        }}
                                        className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-[10px] font-bold cursor-pointer"
                                      >
                                        Upload
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowUrlModal({
                                            type: "item",
                                            secIdx: sIdx,
                                            itemIdx: iIdx,
                                            currentUrl: it.image || "",
                                          });
                                        }}
                                        className="px-2.5 py-1 bg-slate-800 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                      >
                                        URL
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Card Text Fields */}
                                <div className="space-y-2">
                                  {it.badge && (
                                    <input
                                      type="text"
                                      value={it.badge}
                                      onChange={(e) =>
                                        updateItem(sIdx, iIdx, { badge: e.target.value })
                                      }
                                      placeholder="Card Badge"
                                      className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-transparent focus:outline-none block"
                                    />
                                  )}

                                  <input
                                    type="text"
                                    value={it.title}
                                    onChange={(e) =>
                                      updateItem(sIdx, iIdx, { title: e.target.value })
                                    }
                                    placeholder="Card Title"
                                    className="w-full font-bold text-base text-school-primary dark:text-white bg-transparent focus:outline-none"
                                    style={{ color: it.titleColor || undefined }}
                                  />

                                  <textarea
                                    rows={3}
                                    value={it.description}
                                    onChange={(e) =>
                                      updateItem(sIdx, iIdx, { description: e.target.value })
                                    }
                                    placeholder="Card description text..."
                                    className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-transparent focus:outline-none resize-none"
                                    style={{ color: it.descColor || undefined }}
                                  />
                                </div>

                                {/* Card Actions Bar */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                  <input
                                    type="text"
                                    value={it.link || ""}
                                    onChange={(e) =>
                                      updateItem(sIdx, iIdx, { link: e.target.value })
                                    }
                                    placeholder="/link-url"
                                    className="bg-transparent text-slate-500 font-mono text-[10px] focus:outline-none max-w-[120px]"
                                  />

                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        duplicateItem(sIdx, iIdx);
                                      }}
                                      className="p-1 text-slate-400 hover:text-white"
                                      title="Duplicate Card"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(sIdx, iIdx);
                                      }}
                                      className="p-1 text-rose-400 hover:text-rose-300"
                                      title="Delete Card"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* + Add Card Button */}
                          <button
                            type="button"
                            onClick={() => addItem(sIdx)}
                            className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-amber-400 text-slate-400 hover:text-amber-400 flex flex-col items-center justify-center space-y-2 transition-all min-h-[200px] cursor-pointer"
                          >
                            <Plus className="w-6 h-6" />
                            <span className="text-xs font-bold">+ Add Card Item</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Sections Prompt */}
                  {(!page.sections || page.sections.length === 0) && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-school-primary dark:text-white">
                          No Modular Sections Yet
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Click below to add Elementor Pro style feature grids, split stories, or academic wings.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTemplateModal(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg inline-flex items-center space-x-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add Section (Elementor Pro Templates)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT INSPECTOR SIDEBAR */}
        {/* ========================================================================= */}
        <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 select-none overflow-y-auto custom-scrollbar p-4 space-y-6">
          
          {/* Dynamic Inspector Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {isHomePage && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab("hero")}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                    activeInspectorTab === "hero" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Hero
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab("wings")}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                    activeInspectorTab === "wings" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Wings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab("why_us")}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                    activeInspectorTab === "why_us" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Why Us
                </button>
              </>
            )}

            {isMessagePage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("desk")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "desk" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                👔 Leader Desk
              </button>
            )}

            {isMissionVisionPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("philosophy")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "philosophy" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🎯 Philosophy
              </button>
            )}

            {isAboutPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("heritage")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "heritage" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📖 Heritage
              </button>
            )}

            {!isHomePage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("header")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "header" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                Header
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveInspectorTab("style_studio")}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                activeInspectorTab === "style_studio" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              🎨 Studio
            </button>

            <button
              type="button"
              onClick={() => setActiveInspectorTab("sections")}
              className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                activeInspectorTab === "sections" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
              }`}
            >
              Sections
            </button>
          </div>

          {/* TAB 1: DESK PROFILE (FOR CHAIRMAN & PRINCIPAL) */}
          {activeInspectorTab === "desk" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  {isChairmanPage ? "👔 Chairman's Profile & Letter" : "🎓 Principal's Profile & Address"}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Edit leader portrait photo, designations, quote, and message story.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Leader Full Name</label>
                  <input
                    type="text"
                    value={isChairmanPage ? chairmanName : principalName}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          [isChairmanPage ? "chairmanName" : "principalName"]: e.target.value,
                          authorName: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Designation / Title</label>
                  <input
                    type="text"
                    value={isChairmanPage ? chairmanTitle : principalTitle}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          [isChairmanPage ? "chairmanTitle" : "principalTitle"]: e.target.value,
                          authorTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Leader Portrait Image URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={isChairmanPage ? chairmanImage : principalImage}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: {
                            ...page.customStyles,
                            [isChairmanPage ? "chairmanImage" : "principalImage"]: e.target.value,
                            authorImage: e.target.value,
                          },
                        })
                      }
                      className="flex-1 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none font-mono text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={() => triggerImageUpload(isChairmanPage ? "chairman" : "principal")}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl font-bold cursor-pointer"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Featured Quote</label>
                  <textarea
                    rows={2}
                    value={isChairmanPage ? chairmanQuote : principalQuote}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          [isChairmanPage ? "chairmanQuote" : "principalQuote"]: e.target.value,
                          quote: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Opening Salutation / Headline</label>
                  <input
                    type="text"
                    value={isChairmanPage ? chairmanHeadline : principalHeadline}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          storyHeadline: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAGE HEADER (FOR SUBPAGES) */}
          {activeInspectorTab === "header" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <span className="font-extrabold text-blue-400 uppercase tracking-wider block">
                  Top Page Banner Header
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure title heading, badge, and intro description displayed in the hero area.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Badge Label</label>
                  <input
                    type="text"
                    value={page.heroBadge || ""}
                    onChange={(e) => onChange({ ...page, heroBadge: e.target.value })}
                    placeholder="e.g. Chairman's Desk"
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Page Heading Title</label>
                  <input
                    type="text"
                    value={page.heroTitle || ""}
                    onChange={(e) => onChange({ ...page, heroTitle: e.target.value })}
                    placeholder="e.g. Visionary Leadership"
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Subtitle Description</label>
                  <textarea
                    rows={3}
                    value={page.heroSubtitle || ""}
                    onChange={(e) => onChange({ ...page, heroSubtitle: e.target.value })}
                    placeholder="Introduction description..."
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHILOSOPHY (FOR MISSION & VISION) */}
          {activeInspectorTab === "philosophy" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider block">
                  🎯 Mission & Vision Statements
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Vision Statement</label>
                  <textarea
                    rows={4}
                    value={visionText}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          visionText: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Mission Statement</label>
                  <textarea
                    rows={4}
                    value={missionText}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          missionText: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HERITAGE (FOR ABOUT PAGE) */}
          {activeInspectorTab === "heritage" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  📖 School Heritage & Campus
                </span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Headline</label>
                  <input
                    type="text"
                    value={aboutHeadline}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          storyHeadline: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Main Story</label>
                  <textarea
                    rows={6}
                    value={aboutStory}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          mainStory: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Campus Photo URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={aboutCampusPhoto}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: {
                            ...page.customStyles,
                            authorImage: e.target.value,
                          },
                        })
                      }
                      className="flex-1 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none font-mono text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={() => triggerImageUpload("author")}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl font-bold cursor-pointer"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                  <span className="font-bold text-amber-400 block text-[11px]">Heritage Stat Badges</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Stat 1 Value</label>
                      <input
                        type="text"
                        value={aboutStat1Num}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: {
                              ...page.customStyles,
                              aboutStat1Number: e.target.value,
                            },
                          })
                        }
                        placeholder="2014"
                        className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Stat 1 Label</label>
                      <input
                        type="text"
                        value={aboutStat1Lbl}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: {
                              ...page.customStyles,
                              aboutStat1Label: e.target.value,
                            },
                          })
                        }
                        placeholder="Year of Inception"
                        className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Stat 2 Value</label>
                      <input
                        type="text"
                        value={aboutStat2Num}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: {
                              ...page.customStyles,
                              aboutStat2Number: e.target.value,
                            },
                          })
                        }
                        placeholder="10 Acres"
                        className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400">Stat 2 Label</label>
                      <input
                        type="text"
                        value={aboutStat2Lbl}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: {
                              ...page.customStyles,
                              aboutStat2Label: e.target.value,
                            },
                          })
                        }
                        placeholder="Lush Campus"
                        className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HERO BANNER (FOR HOME PAGE) */}
          {activeInspectorTab === "hero" && isHomePage && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Hero Media Type</label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => onChange({ ...page, heroMediaType: "IMAGE" })}
                    className={`flex-1 py-1.5 rounded-lg font-bold ${
                      (page.heroMediaType || "IMAGE") === "IMAGE"
                        ? "bg-amber-400 text-slate-950"
                        : "text-slate-400"
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ ...page, heroMediaType: "VIDEO" })}
                    className={`flex-1 py-1.5 rounded-lg font-bold ${
                      page.heroMediaType === "VIDEO"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400"
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>

              {page.heroMediaType === "VIDEO" && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Video MP4 or YouTube URL</label>
                  <input
                    type="text"
                    value={page.heroVideoUrl || ""}
                    onChange={(e) => onChange({ ...page, heroVideoUrl: e.target.value })}
                    placeholder="https://youtu.be/..."
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>Overlay Darkness</span>
                  <span>{Math.round((page.heroOverlayOpacity ?? 0.55) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={page.heroOverlayOpacity ?? 0.55}
                  onChange={(e) =>
                    onChange({
                      ...page,
                      heroOverlayOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* TAB: ACADEMIC CONTINUUM & WINGS (FOR HOME PAGE) */}
          {activeInspectorTab === "wings" && isHomePage && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <span className="font-extrabold text-blue-400 uppercase tracking-wider block">
                  📚 Academic Wings Continuum
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Customize the 4 educational tiers, age groups, curriculum highlights, and wing photos.
                </p>
              </div>

              {/* Section Header Controls */}
              <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block text-[11px]">Section Headers</span>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Badge</label>
                  <input
                    type="text"
                    value={page.customStyles?.academic_wings_badge || "Curriculum & Learning Continuum"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          academic_wings_badge: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Title</label>
                  <input
                    type="text"
                    value={page.customStyles?.academic_wings_title || "Academic Excellence from Foundation to Senior Secondary"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          academic_wings_title: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Subtitle</label>
                  <textarea
                    rows={2}
                    value={page.customStyles?.academic_wings_subtitle || "A seamless educational pathway blending national curriculum benchmarks with international 21st-century inquiry skills."}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          academic_wings_subtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs resize-none"
                  />
                </div>
              </div>

              {/* Wing Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Select Wing to Edit</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {homeWings.map((w: any, idx: number) => (
                    <button
                      key={w.id || idx}
                      type="button"
                      onClick={() => setActiveHomeWingIdx(idx)}
                      className={`p-2 rounded-xl text-left font-bold transition-all text-[11px] ${
                        activeHomeWingIdx === idx
                          ? "bg-amber-400 text-slate-950 shadow"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      <div className="truncate">{w.title}</div>
                      <div className="text-[9px] opacity-70 font-normal">{w.grades}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Wing Form Fields */}
              <div className="space-y-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Wing Name</label>
                  <input
                    type="text"
                    value={activeWing.title || ""}
                    onChange={(e) => updateActiveWing({ title: e.target.value })}
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Grades</label>
                    <input
                      type="text"
                      value={activeWing.grades || ""}
                      onChange={(e) => updateActiveWing({ grades: e.target.value })}
                      placeholder="e.g. Grades 1 to 5"
                      className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Age Group</label>
                    <input
                      type="text"
                      value={activeWing.age || ""}
                      onChange={(e) => updateActiveWing({ age: e.target.value })}
                      placeholder="e.g. 6 to 10 Years"
                      className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    value={activeWing.desc || ""}
                    onChange={(e) => updateActiveWing({ desc: e.target.value })}
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Photo URL</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={activeWing.image || ""}
                      onChange={(e) => updateActiveWing({ image: e.target.value })}
                      className="flex-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                    />
                    <button
                      type="button"
                      onClick={() => triggerImageUpload("wing")}
                      className="px-2.5 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px]"
                    >
                      Upload
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Page Link URL</label>
                  <input
                    type="text"
                    value={activeWing.link || ""}
                    onChange={(e) => updateActiveWing({ link: e.target.value })}
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">Key Curricular Highlights</label>
                    <button
                      type="button"
                      onClick={addWingSubject}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add
                    </button>
                  </div>
                  {(activeWing.subjects || []).map((sub: string, sIdx: number) => (
                    <div key={sIdx} className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={sub}
                        onChange={(e) => updateWingSubject(sIdx, e.target.value)}
                        className="flex-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeWingSubject(sIdx)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: WHY CHOOSE US - 8 CARDS (FOR HOME PAGE) */}
          {activeInspectorTab === "why_us" && isHomePage && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  ⭐ Why Cambridge Mandi (8 Standards)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Customize the benchmark quality cards displayed on the home page.
                </p>
              </div>

              {/* Header Controls */}
              <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block text-[11px]">Section Headers</span>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Badge</label>
                  <input
                    type="text"
                    value={page.customStyles?.why_choose_us_badge || "Benchmark Quality Standards"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          why_choose_us_badge: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Title</label>
                  <input
                    type="text"
                    value={page.customStyles?.why_choose_us_title || "Why Cambridge Mandi?"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          why_choose_us_title: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Subtitle</label>
                  <textarea
                    rows={2}
                    value={page.customStyles?.why_choose_us_subtitle || "Discover what sets Cambridge International School Mandi apart as the finest CBSE day & residential institution in Himachal Pradesh."}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: {
                          ...page.customStyles,
                          why_choose_us_subtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs resize-none"
                  />
                </div>
              </div>

              {/* 8 Card Items */}
              <div className="space-y-3">
                <span className="font-bold text-slate-300 block">All 8 Quality Standard Cards</span>
                {homeWhyReasons.map((reason: any, rIdx: number) => (
                  <div key={rIdx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">
                        {rIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={reason.title || ""}
                        onChange={(e) => updateWhyReason(rIdx, { title: e.target.value })}
                        placeholder={`Standard #${rIdx + 1} Title`}
                        className="flex-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-bold text-xs"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={reason.desc || ""}
                      onChange={(e) => updateWhyReason(rIdx, { desc: e.target.value })}
                      placeholder="Description..."
                      className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-xs resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ELEMENTOR PRO STYLE STUDIO */}
          {activeInspectorTab === "style_studio" && (
            <div className="space-y-6 text-xs">
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-2xl">
                <span className="font-extrabold text-indigo-400 uppercase tracking-wider block">
                  ✨ Elementor Pro Style Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeSelectedItem
                    ? `Styling Card: "${activeSelectedItem.title || "Untitled Card"}"`
                    : activeSelectedSection
                    ? `Styling Section: "${activeSelectedSection.title || "Untitled Section"}"`
                    : "Select any card or section on the canvas to customize its colors, fonts & effects."}
                </p>
              </div>

              {activeSelectedItem && selectedBlock?.secIdx !== undefined && selectedBlock?.itemIdx !== undefined && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-bold text-slate-300">Background Color</label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_SWATCHES.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() =>
                            updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                              bgColor: hex,
                            })
                          }
                          className="w-6 h-6 rounded-full border border-slate-700 shadow-sm transition-transform hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-300">Title Color</label>
                      <input
                        type="color"
                        value={activeSelectedItem.titleColor || "#0F172A"}
                        onChange={(e) =>
                          updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                            titleColor: e.target.value,
                          })
                        }
                        className="w-full h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-300">Text Color</label>
                      <input
                        type="color"
                        value={activeSelectedItem.descColor || "#475569"}
                        onChange={(e) =>
                          updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                            descColor: e.target.value,
                          })
                        }
                        className="w-full h-8 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-bold text-slate-300">
                      <span>Image Height</span>
                      <span>{activeSelectedItem.imageHeight || 160}px</span>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={400}
                      step={10}
                      value={activeSelectedItem.imageHeight || 160}
                      onChange={(e) =>
                        updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                          imageHeight: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-amber-400"
                    />
                  </div>
                </div>
              )}

              {activeSelectedSection && selectedBlock?.secIdx !== undefined && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-bold text-slate-300">Section Gradient Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                      {GRADIENT_PRESETS.map((g) => (
                        <button
                          key={g.name}
                          type="button"
                          onClick={() =>
                            updateSection(selectedBlock.secIdx!, {
                              bgGradient: g.value,
                              bgColor: undefined,
                            })
                          }
                          className="h-10 rounded-xl border border-slate-700 text-[10px] font-bold text-white shadow-sm flex items-center justify-center text-center p-1 cursor-pointer"
                          style={{ backgroundImage: g.value }}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateSection(selectedBlock.secIdx!, {
                        bgGradient: undefined,
                        bgColor: undefined,
                      })
                    }
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 cursor-pointer"
                  >
                    Reset to Default Transparent
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SECTIONS MANAGER */}
          {activeInspectorTab === "sections" && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Page Sections ({page.sections?.length || 0})</span>
                <button
                  type="button"
                  onClick={() => setShowTemplateModal(true)}
                  className="px-2 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] cursor-pointer"
                >
                  + Add
                </button>
              </div>

              <div className="space-y-2">
                {(page.sections || []).map((sec, idx) => (
                  <div
                    key={sec.id || idx}
                    onClick={() => {
                      setSelectedBlock({ type: "section", secIdx: idx });
                      setActiveInspectorTab("style_studio");
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      selectedBlock?.type === "section" && selectedBlock.secIdx === idx
                        ? "bg-slate-800 border-amber-400 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium truncate">{sec.title || `Section #${idx + 1}`}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, "up")}
                        }
                        disabled={idx === 0}
                        className="p-1 hover:text-amber-400 disabled:opacity-20"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, "down")}
                        }
                        disabled={idx === (page.sections?.length || 0) - 1}
                        className="p-1 hover:text-amber-400 disabled:opacity-20"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(idx);
                        }}
                        className="p-1 hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUICK TEMPLATE MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Elementor Pro Template Blocks</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => handleAddTemplateSection("grid_3")}
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 text-left space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Columns className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">3-Column Features Grid</h4>
                <p className="text-[10px] text-slate-400">Classrooms, Labs & Sports highlights with cards and badges.</p>
              </button>

              <button
                type="button"
                onClick={() => handleAddTemplateSection("split_banner")}
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-400 text-left space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">Split Story & Media Banner</h4>
                <p className="text-[10px] text-slate-400">Rich narrative story text on left and 4K photo showcase on right.</p>
              </button>

              <button
                type="button"
                onClick={() => handleAddTemplateSection("grid_4_academics")}
                className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-400 text-left space-y-2 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">4-Wing Academic Matrix</h4>
                <p className="text-[10px] text-slate-400">Pre-Primary, Primary, Middle, and Senior Secondary pathways.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL INSERT MODAL */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Paste Image URL</h3>
              <button
                type="button"
                onClick={() => setShowUrlModal(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUrlSubmit(formData.get("url") as string);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="url"
                defaultValue={showUrlModal.currentUrl}
                placeholder="https://images.unsplash.com/... or /uploads/..."
                autoFocus
                className="w-full bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-extrabold hover:bg-amber-300 shadow"
                >
                  Apply URL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
