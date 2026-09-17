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
  Search,
  Mail,
  Phone,
  MapPin,
  FlaskConical,
  Cpu,
  Globe2,
  Microscope,
  Landmark,
  Building,
  Send,
  Home as HomeIcon,
  Bus,
  FileText,
  Link2,
} from "lucide-react";
import Link from "next/link";
import Campus3DViewer from "@/components/3d/Campus3DViewer";
import DynamicFormRenderer from "@/components/common/DynamicFormRenderer";
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
  "#0A2540", // Cambridge Deep Navy
  "#0066FF", // Cambridge Sapphire Blue
  "#F59E0B", // Amber Gold
  "#10B981", // Emerald Green
  "#8B5CF6", // Royal Purple
  "#EC4899", // Rose
  "#06B6D4", // Cyan
  "#0F172A", // Slate Dark
  "#1E293B", // Slate Card
  "#051329", // Deep Obsidian
  "#FFFFFF", // Pure White
  "#F1F5F9", // Soft Light Slate
  "#FEF3C7", // Warm Amber Cream
  "#E0F2FE", // Sky Ice
  "#DC2626", // Crimson Red
  "transparent", // Transparent
];

const FONT_PRESETS = [
  { name: "Inter (Clean & Modern)", value: "font-sans", cssFont: "'Inter', sans-serif" },
  { name: "Poppins (Geometric & Friendly)", value: "font-poppins", cssFont: "'Poppins', sans-serif" },
  { name: "Outfit (Tech & Premium)", value: "font-outfit", cssFont: "'Outfit', sans-serif" },
  { name: "Playfair Display (Editorial Heritage)", value: "font-serif", cssFont: "'Playfair Display', serif" },
  { name: "Cinzel (Prestigious Royal)", value: "font-cinzel", cssFont: "'Cinzel', serif" },
  { name: "Montserrat (Punchy Modern)", value: "font-montserrat", cssFont: "'Montserrat', sans-serif" },
  { name: "Plus Jakarta Sans (Sleek Clean)", value: "font-jakarta", cssFont: "'Plus Jakarta Sans', sans-serif" },
  { name: "Caveat (Handwritten Signature)", value: "font-caveat", cssFont: "'Caveat', cursive" },
  { name: "Fira Code (Monospace & Tech)", value: "font-mono", cssFont: "'Fira Code', monospace" },
];

const GRADIENT_PRESETS = [
  { name: "Sapphire Elite", value: "linear-gradient(135deg, #0A2540 0%, #0066FF 100%)" },
  { name: "Navy Glass Glow", value: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(10,37,64,0.95))" },
  { name: "Royal Gold", value: "linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #d97706 100%)" },
  { name: "Emerald Alpine", value: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)" },
  { name: "Purple Cyberpunk", value: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #ec4899 100%)" },
  { name: "Himalayan Sunset", value: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #f43f5e 100%)" },
  { name: "Deep Cobalt", value: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(29,78,216,0.35))" },
  { name: "Dark Obsidian", value: "linear-gradient(135deg, #050b14 0%, #0d1a2d 100%)" },
  { name: "Clean Pearl White", value: "linear-gradient(135deg, #ffffff, #f8fafc)" },
  { name: "Frosted Glass", value: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))" },
];

const SHADOW_PRESETS = [
  { name: "None", value: "none" },
  { name: "Soft Card", value: "sm" },
  { name: "Elevated Floating", value: "md" },
  { name: "High Depth", value: "xl" },
  { name: "Deep 3D Stage", value: "deep3d" },
  { name: "Amber Glow", value: "glow" },
  { name: "Neon Cyan", value: "neon" },
  { name: "Purple Neon", value: "purple" },
  { name: "Emerald Rim", value: "emerald" },
];

const ANIMATION_PRESETS = [
  { name: "None", value: "none" },
  { name: "Fade In", value: "fade" },
  { name: "Slide Up", value: "slide-up" },
  { name: "Slide In Left", value: "slide-left" },
  { name: "Slide In Right", value: "slide-right" },
  { name: "Zoom Pop In", value: "zoom" },
  { name: "Gentle Bounce", value: "bounce" },
  { name: "Breathing Pulse", value: "pulse" },
  { name: "3D Flip", value: "flip" },
];

const EFFECT3D_PRESETS = [
  { name: "None (Flat 2D)", value: "none", desc: "Clean standard flat layout" },
  { name: "3D Perspective Tilt", value: "tilt", desc: "Realistic 3D tilt responding to hover angle" },
  { name: "3D Continuous Float", value: "float", desc: "Smooth floating levitation in 3D space" },
  { name: "3D Pop-Out Elevation", value: "card3d", desc: "Z-axis elevation with preserve-3d" },
  { name: "3D Frosted Glass Prism", value: "glass", desc: "Holographic blur & specular refraction shine" },
  { name: "3D Isometric Depth", value: "depth", desc: "Physical isometric block shadow with tactile depth" },
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

const DEFAULT_PROCEDURE_AGE_MATRIX = [
  { grade: "Nursery / Pre-KG", age: "3+ Years as on 31st March 2025" },
  { grade: "LKG / Lower Kindergarten", age: "4+ Years as on 31st March 2025" },
  { grade: "UKG / Upper Kindergarten", age: "5+ Years as on 31st March 2025" },
  { grade: "Grade I", age: "6+ Years as on 31st March 2025" },
  { grade: "Grade II to V", age: "Corresponding age progression + Previous School TC" },
  { grade: "Grade VI to VIII", age: "Previous class marksheet + TC + Aptitude test" },
  { grade: "Grade IX to X", age: "CBSE Registration Eligibility + Class 8/9 Marksheet" },
  { grade: "Grade XI (Science/Commerce/Arts)", age: "Class X Board Marksheet / Pre-board score" },
];

const DEFAULT_PROCEDURE_DOCS = [
  "Attested copy of Child's Birth Certificate (issued by Municipal Corp / Gram Panchayat)",
  "Original Transfer Certificate (TC) from previous school counter-signed by Education Officer",
  "Previous Class Marksheet / Progress Card",
  "Recent passport-sized photographs of student (4 copies)",
  "Recent passport-sized photographs of Father and Mother (2 copies each)",
  "Aadhaar Card copies of Student and Parents",
  "Medical Fitness Certificate & Blood Group proof",
  "Caste / Category certificate (if applicable for scholarship quotas)",
];

const DEFAULT_FEE_TIERS = [
  { wing: "Pre-Primary (Nursery, LKG, UKG)", admissionFee: 15000, annualCompositeFee: 42000, quarterlyTuition: 10500, activityAndLabFee: 4000 },
  { wing: "Primary Wing (Grades 1 to 5)", admissionFee: 18000, annualCompositeFee: 48000, quarterlyTuition: 12000, activityAndLabFee: 5500 },
  { wing: "Middle School (Grades 6 to 8)", admissionFee: 20000, annualCompositeFee: 54000, quarterlyTuition: 13500, activityAndLabFee: 7000 },
  { wing: "Secondary Wing (Grades 9 & 10)", admissionFee: 22000, annualCompositeFee: 62000, quarterlyTuition: 15500, activityAndLabFee: 8500 },
  { wing: "Senior Secondary (Grades 11 & 12)", admissionFee: 25000, annualCompositeFee: 72000, quarterlyTuition: 18000, activityAndLabFee: 10000 },
];

const DEFAULT_TRANSPORT_SLABS = [
  { slab: "0 – 5 km (Mandi Town & Vicinity)", fee: "₹1,800 / month" },
  { slab: "5 – 12 km (Gutkar / Nerchowk sector)", fee: "₹2,400 / month" },
  { slab: "12 – 22 km (Sundernagar / Outskirts)", fee: "₹3,100 / month" },
];

const DEFAULT_HOSTEL_FEES = [
  { item: "Annual Boarding & Hostel Fee", fee: "₹1,25,000 / year", isHighlight: true },
  { item: "Payable in 2 equal installments (April & October)", fee: "₹62,500 / term", isHighlight: false },
];

const DEFAULT_ADMISSION_STEPS = [
  { num: "01", title: "Online Registration", desc: "Fill out the online application form with student details and academic records." },
  { num: "02", title: "Interaction / Entrance Test", desc: "Short friendly interaction for Early Years or conceptual aptitude assessment for Grades 6-11." },
  { num: "03", title: "Provisional Offer & Document Verification", desc: "Receive admission confirmation offer and submit required birth/transfer certificates." },
  { num: "04", title: "Fee Payment & Welcome Kit", desc: "Complete enrollment fee payment and collect school uniform, books, and orientation packet." },
];

const DEFAULT_SCHEMES = [
  {
    title: "Academic Super-Achiever Scholarship (Class XI)",
    discount: "Up to 50% Tuition Fee Waiver",
    eligibility: "Students securing 95%+ aggregate in CBSE / ICSE Class X Board examinations.",
    iconName: "award",
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Himalayan National Sports Laureate Scholarship",
    discount: "25% to 100% Tuition Fee Waiver",
    eligibility: "Medalists and official state representatives in National Games / CBSE National Athletics / Swimming / Shooting / Badminton.",
    iconName: "trophy",
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Armed Forces & Martyr's Ward Concession",
    discount: "20% Tuition Fee Waiver",
    eligibility: "Children of serving / retired Indian Armed Forces (Army, Navy, Air Force) and Paramilitary personnel.",
    iconName: "shield",
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Sibling Advantage Waiver",
    discount: "15% Tuition Waiver on Second Child",
    eligibility: "Applicable to families with two or more biological siblings enrolled simultaneously at CIS Mandi.",
    iconName: "heart",
    color: "from-purple-500 to-pink-600",
  },
];

const DEFAULT_FACILITY_SPECS: Record<string, string[]> = {
  "smart-classrooms": [
    "86-inch 4K UHD Anti-Glare Interactive Touch Flat Panels in every classroom",
    "High-definition digital podiums with wireless stylus annotations",
    "Acoustically insulated walls and ceiling sound dampening for crystal clear audio",
    "Ergonomic dual-desk seating engineered to maintain spinal health & posture",
    "High-speed gigabit Wi-Fi 6 connectivity with strict content safety firewalls",
    "Real-time recording system for lecture archiving and revision review",
  ],
  "science-labs": [
    "Separate dedicated laboratories for Physics, Chemistry, Biology & Biotech",
    "Precision digital compound microscopes with HD projection monitors",
    "Automated gas manifold system, chemical safety fume hoods & eye-wash showers",
    "Individual student experiment workbenches with quartz acid-resistant tops",
    "Interactive virtual dissection and molecular modeling 3D software",
    "Full adherence to CBSE & NABL scientific safety protocols",
  ],
  "robotics-lab": [
    "Industrial-grade 3D printers and CNC prototyping cutting systems",
    "LEGO Mindstorms, Arduino, and Raspberry Pi embedded micro-controller kits",
    "Humanoid AI robotics platform for vision recognition and voice synthesis",
    "Drone assembly, aeromodelling, and autonomous flight simulation bench",
    "Python, C++, and block coding training environment for all grades",
    "National and International robotics Olympiad mentor-training wing",
  ],
  library: [
    "Curated collection of 25,000+ fiction, non-fiction, encyclopedias, and references",
    "Digital Kindle e-reader zone with subscriptions to JSTOR & British Council Library",
    "Quiet sound-buffered reading pods and collaborative research conference rooms",
    "Automated RFID book check-out and cloud catalog search kiosks",
    "Dedicated Junior Reader story corner with soft seating and picture books",
    "Daily national and international periodicals, journals, and magazines",
  ],
  "sports-complex": [
    "All-weather heated semi-Olympic 25-meter indoor swimming pool",
    "FIFA-standard artificial synthetic football turf with floodlights",
    "Two multi-layered synthetic lawn tennis & basketball courts with FIBA specifications",
    "4-lane Olympic indoor shooting range with electronic target systems",
    "Dedicated international standard wooden badminton and squash courts",
    "NIS certified coaches for swimming, football, cricket, archery & martial arts",
  ],
  hostel: [
    "Air-conditioned & heated separate boarding houses for boys and girls",
    "Nutritious 4-meal daily dining planned by pediatric nutritionists",
    "24x7 resident wardens, medical infirmary, and visiting pediatrician",
    "Evening mandatory prep study sessions with subject faculty mentors",
    "Biometric security access, CCTV perimeter, and female security personnel",
    "Recreation lounge with indoor games, library, and weekend cinema screenings",
  ],
  transport: [
    "Fleet of 25+ luxury buses compliant with Supreme Court safety guidelines",
    "Real-time GPS tracking with live parent mobile application updates",
    "Dual HD CCTV surveillance cameras with audio recording inside all vehicles",
    "Female bus attendants on every route for pre-primary & primary safety",
    "Speed governors locked at 40 km/h and mandatory breathalyzer driver checks",
    "Extensive route coverage spanning Mandi, Sundernagar, Gutkar, and Nerchowk",
  ],
};

const DEFAULT_WING_HIGHLIGHTS: Record<string, string[]> = {
  "pre-primary": [
    "Montessori & Experiential Play-Way Pedagogy",
    "Jolly Phonics Language & Early Literacy System",
    "Theme-based Sensory & Fine Motor Activity Corners",
    "Dedicated Child-Friendly Kindergarten Play Zone & Sandpit",
    "Air-Conditioned Colorful Smart Classrooms with Soft Flooring",
    "Nurturing Female Faculty with 1:12 Teacher-to-Child Ratio",
  ],
  primary: [
    "English Language Arts: Grammar, creative writing, and public speaking",
    "Mathematics & Logic: Concept-first arithmetic, geometry, and mental math",
    "Environmental Studies (EVS): Scientific curiosity and Himalayan conservation",
    "Second Language (Hindi): Literature, poetry, and expressive articulation",
    "Digital Coding & ICT: Scratch block coding and digital safety",
    "Visual & Performing Arts: Sketching, Indian classical music, and theater",
  ],
  "middle-school": [
    "Integrated STEM curriculum with hands-on robotics and laboratory work",
    "Third Language option: Sanskrit / French / German foundational tracks",
    "Scientific inquiry modules with independent research projects",
    "Structured debate, Model United Nations (MUN), and oratory programs",
    "Advanced mental aptitude, logic puzzles, and Olympiad problem-solving",
    "Comprehensive physical education with compulsory athletic specialization",
  ],
  "senior-secondary": [
    "Specialized streams: Medical (PCB), Non-Medical (PCM), Commerce, and Humanities",
    "Integrated CBSE Board + NEET / JEE Advanced coaching syllabus",
    "State-of-the-art research laboratories and AI computer infrastructure",
    "Career counseling, university application mentorship, and SAT/CUET prep",
    "Guest masterclasses by IIT/AIIMS alumni and industry specialists",
    "Leadership roles through School Cabinet, Prefectorial Board, and Editorial club",
  ],
};

function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

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
    type: string;
    secIdx?: number;
    itemIdx?: number;
    statIdx?: number;
  } | null>(null);

  const [activeStyleSubTab, setActiveStyleSubTab] = useState<"typography" | "colors" | "media" | "borders" | "animations" | "3d">("typography");

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
    type: "hero" | "author" | "chairman" | "principal" | "item" | "doc" | "wing" | "topper" | "achievement" | "album" | "tour";
    secIdx?: number;
    itemIdx?: number;
    docIdx?: number;
    topperIdx?: number;
    achievementIdx?: number;
    albumIdx?: number;
    tourIdx?: number;
  } | null>(null);

  const [showUrlModal, setShowUrlModal] = useState<{
    type: "hero" | "author" | "chairman" | "principal" | "item" | "wing" | "topper" | "achievement" | "album" | "tour";
    secIdx?: number;
    itemIdx?: number;
    topperIdx?: number;
    achievementIdx?: number;
    albumIdx?: number;
    tourIdx?: number;
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
  const isProcedurePage = page.slug === "procedure";
  const isFeesPage = page.slug === "fees-structure";
  const isAdmissionsPage = page.slug === "admissions";
  const isScholarshipsPage = page.slug === "scholarships";
  const isFacultyPage = page.slug === "faculty";
  const isAcademicsHubPage = page.slug === "academics";
  const isFacilitiesHubPage = page.slug === "facilities";
  const isStudentLifePage = page.slug === "student-life";
  const isAchievementsPage = page.slug === "achievements";
  const isResultsPage = page.slug === "results";
  const isGalleryPage = page.slug === "gallery";
  const isVirtualTourPage = page.slug === "virtual-tour";
  const isContactPage = page.slug === "contact";
  const isFacilityPage = ["smart-classrooms", "science-labs", "robotics-lab", "library", "sports-complex", "hostel", "transport", "computer-labs"].includes(page.slug);
  const isAcademicWingPage = ["pre-primary", "primary", "middle-school", "senior-secondary"].includes(page.slug);
  const isApplyPage = page.slug === "apply";
  const isNewsPage = page.slug === "news";
  const isEventsPage = page.slug === "events";
  const isDownloadsPage = page.slug === "downloads";
  const isCareersPage = page.slug === "careers";
  const isMandatoryDisclosurePage = page.slug === "mandatory-disclosure";
  const isCbseInfoPage = page.slug === "cbse-information";
  const hasDedicatedCanvas =
    isHomePage ||
    isChairmanPage ||
    isPrincipalPage ||
    isMissionVisionPage ||
    isAboutPage ||
    isProcedurePage ||
    isFeesPage ||
    isAdmissionsPage ||
    isScholarshipsPage ||
    isFacilityPage ||
    isAcademicWingPage ||
    isFacultyPage ||
    isAcademicsHubPage ||
    isFacilitiesHubPage ||
    isStudentLifePage ||
    isAchievementsPage ||
    isResultsPage ||
    isGalleryPage ||
    isVirtualTourPage ||
    isContactPage ||
    isApplyPage ||
    isNewsPage ||
    isEventsPage ||
    isDownloadsPage ||
    isCareersPage ||
    isMandatoryDisclosurePage ||
    isCbseInfoPage;

  useEffect(() => {
    if (isProcedurePage) setActiveInspectorTab("procedure_studio");
    else if (isFeesPage) setActiveInspectorTab("fees_studio");
    else if (isAdmissionsPage) setActiveInspectorTab("admissions_studio");
    else if (isScholarshipsPage) setActiveInspectorTab("scholarships_studio");
    else if (isFacultyPage) setActiveInspectorTab("faculty_studio");
    else if (isAcademicsHubPage) setActiveInspectorTab("academics_studio");
    else if (isAcademicWingPage) setActiveInspectorTab("wing_studio");
    else if (isFacilitiesHubPage) setActiveInspectorTab("facilities_studio");
    else if (isFacilityPage) setActiveInspectorTab("facility_studio");
    else if (isStudentLifePage) setActiveInspectorTab("student_life_studio");
    else if (isAchievementsPage) setActiveInspectorTab("achievements_studio");
    else if (isResultsPage) setActiveInspectorTab("results_studio");
    else if (isGalleryPage) setActiveInspectorTab("gallery_studio");
    else if (isVirtualTourPage) setActiveInspectorTab("virtual_tour_studio");
    else if (isContactPage) setActiveInspectorTab("contact_studio");
    else if (isApplyPage) setActiveInspectorTab("apply_studio");
    else if (isNewsPage) setActiveInspectorTab("news_studio");
    else if (isEventsPage) setActiveInspectorTab("events_studio");
    else if (isDownloadsPage) setActiveInspectorTab("downloads_studio");
    else if (isCareersPage) setActiveInspectorTab("careers_studio");
    else if (isMandatoryDisclosurePage || isCbseInfoPage) setActiveInspectorTab("compliance_studio");
    else if (isMessagePage) setActiveInspectorTab("desk");
    else if (isMissionVisionPage) setActiveInspectorTab("philosophy");
    else if (isAboutPage) setActiveInspectorTab("heritage");
    else if (isHomePage) setActiveInspectorTab("hero");
    else setActiveInspectorTab("header");
    setSelectedBlock(null);
  }, [page.slug]);

  // Admission Procedure state & helpers
  const procedureAgeMatrix: Array<{ grade: string; age: string }> =
    Array.isArray(page.customStyles?.ageMatrix) && page.customStyles.ageMatrix.length > 0
      ? page.customStyles.ageMatrix
      : DEFAULT_PROCEDURE_AGE_MATRIX;

  const procedureDocs: string[] =
    Array.isArray(page.customStyles?.requiredDocs) && page.customStyles.requiredDocs.length > 0
      ? page.customStyles.requiredDocs
      : DEFAULT_PROCEDURE_DOCS;

  const updateAgeMatrixRow = (rowIdx: number, updated: { grade?: string; age?: string }) => {
    const list = [...procedureAgeMatrix];
    list[rowIdx] = { ...list[rowIdx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        ageMatrix: list,
      },
    });
  };

  const addAgeMatrixRow = () => {
    const list = [...procedureAgeMatrix, { grade: "New Grade / Class", age: "Minimum age requirement" }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        ageMatrix: list,
      },
    });
  };

  const deleteAgeMatrixRow = (rowIdx: number) => {
    const list = procedureAgeMatrix.filter((_, i) => i !== rowIdx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        ageMatrix: list,
      },
    });
  };

  const updateProcedureDoc = (docIdx: number, val: string) => {
    const list = [...procedureDocs];
    list[docIdx] = val;
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        requiredDocs: list,
      },
    });
  };

  const addProcedureDoc = () => {
    const list = [...procedureDocs, "New mandatory document for admission"];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        requiredDocs: list,
      },
    });
  };

  const deleteProcedureDoc = (docIdx: number) => {
    const list = procedureDocs.filter((_, i) => i !== docIdx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        requiredDocs: list,
      },
    });
  };

  // Fees Structure state & helpers
  const feeTiers = Array.isArray(page.customStyles?.feeTiers) && page.customStyles.feeTiers.length > 0
    ? page.customStyles.feeTiers
    : DEFAULT_FEE_TIERS;

  const updateFeeTier = (idx: number, updated: any) => {
    const list = [...feeTiers];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        feeTiers: list,
      },
    });
  };

  const addFeeTier = () => {
    const list = [...feeTiers, { wing: "New Academic Wing", admissionFee: 20000, annualCompositeFee: 50000, quarterlyTuition: 12500, activityAndLabFee: 6000 }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        feeTiers: list,
      },
    });
  };

  const deleteFeeTier = (idx: number) => {
    const list = feeTiers.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        feeTiers: list,
      },
    });
  };

  const transportSlabs = Array.isArray(page.customStyles?.transportSlabs) && page.customStyles.transportSlabs.length > 0
    ? page.customStyles.transportSlabs
    : DEFAULT_TRANSPORT_SLABS;

  const updateTransportSlab = (idx: number, updated: any) => {
    const list = [...transportSlabs];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        transportSlabs: list,
      },
    });
  };

  const addTransportSlab = () => {
    const list = [...transportSlabs, { slab: "New Route Distance", fee: "₹2,500 / month" }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        transportSlabs: list,
      },
    });
  };

  const deleteTransportSlab = (idx: number) => {
    const list = transportSlabs.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        transportSlabs: list,
      },
    });
  };

  const hostelFees = Array.isArray(page.customStyles?.hostelFees) && page.customStyles.hostelFees.length > 0
    ? page.customStyles.hostelFees
    : DEFAULT_HOSTEL_FEES;

  const updateHostelFee = (idx: number, updated: any) => {
    const list = [...hostelFees];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        hostelFees: list,
      },
    });
  };

  const addHostelFee = () => {
    const list = [...hostelFees, { item: "New Boarding / Facility Amenity", amount: 15000, cycle: "Per Term" }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        hostelFees: list,
      },
    });
  };

  const deleteHostelFee = (idx: number) => {
    const list = hostelFees.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        hostelFees: list,
      },
    });
  };

  // Admissions Hub state & helpers
  const admissionSteps = Array.isArray(page.customStyles?.admissionSteps) && page.customStyles.admissionSteps.length > 0
    ? page.customStyles.admissionSteps
    : DEFAULT_ADMISSION_STEPS;

  const updateAdmissionStep = (idx: number, updated: any) => {
    const list = [...admissionSteps];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        admissionSteps: list,
      },
    });
  };

  const addAdmissionStep = () => {
    const list = [...admissionSteps, { num: `0${admissionSteps.length + 1}`, title: "New Enrollment Step", desc: "Step description text." }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        admissionSteps: list,
      },
    });
  };

  const deleteAdmissionStep = (idx: number) => {
    const list = admissionSteps.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        admissionSteps: list,
      },
    });
  };

  // Scholarships state & helpers
  const scholarshipSchemes = Array.isArray(page.customStyles?.schemes) && page.customStyles.schemes.length > 0
    ? page.customStyles.schemes
    : DEFAULT_SCHEMES;

  const updateScholarshipScheme = (idx: number, updated: any) => {
    const list = [...scholarshipSchemes];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        schemes: list,
      },
    });
  };

  const addScholarshipScheme = () => {
    const list = [...scholarshipSchemes, {
      title: "New Talent Award Scheme",
      discount: "20% Tuition Fee Concession",
      eligibility: "Eligibility criteria description.",
      color: "from-blue-500 to-indigo-600",
    }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        schemes: list,
      },
    });
  };

  const deleteScholarshipScheme = (idx: number) => {
    const list = scholarshipSchemes.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        schemes: list,
      },
    });
  };

  // Facilities subpages state & helpers
  const facilitySpecs: string[] = Array.isArray(page.customStyles?.facilitySpecs) && page.customStyles.facilitySpecs.length > 0
    ? page.customStyles.facilitySpecs
    : DEFAULT_FACILITY_SPECS[page.slug] || [
        "State-of-the-art infrastructure designed to international educational benchmarks",
        "Ergonomic student-friendly safety layout and premium equipment",
        "24x7 power backup, high-speed Wi-Fi, and certified safety compliance",
        "Expert faculty guidance and personalized practical mentor supervision",
      ];

  const updateFacilitySpec = (idx: number, val: string) => {
    const list = [...facilitySpecs];
    list[idx] = val;
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        facilitySpecs: list,
      },
    });
  };

  const addFacilitySpec = () => {
    const list = [...facilitySpecs, "New facility specification highlight"];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        facilitySpecs: list,
      },
    });
  };

  const deleteFacilitySpec = (idx: number) => {
    const list = facilitySpecs.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        facilitySpecs: list,
      },
    });
  };

  // Academic Wing subpages state & helpers
  const wingHighlights: string[] = Array.isArray(page.customStyles?.wingHighlights) && page.customStyles.wingHighlights.length > 0
    ? page.customStyles.wingHighlights
    : DEFAULT_WING_HIGHLIGHTS[page.slug] || [
        "Holistic inquiry-driven pedagogy aligned with CBSE & international standards",
        "Personalized mentor guidance with optimal student-teacher ratio",
        "Interactive multimedia smart classrooms and experiential lab work",
        "Continuous comprehensive assessment and regular parent feedback loops",
      ];

  const updateWingHighlightItem = (idx: number, val: string) => {
    const list = [...wingHighlights];
    list[idx] = val;
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        wingHighlights: list,
      },
    });
  };

  const addWingHighlightItem = () => {
    const list = [...wingHighlights, "New curricular milestone highlight"];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        wingHighlights: list,
      },
    });
  };

  const deleteWingHighlightItem = (idx: number) => {
    const list = wingHighlights.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        wingHighlights: list,
      },
    });
  };

  // Primary subjects helpers
  const primarySubjects: Array<{ name: string; desc: string }> =
    Array.isArray(page.customStyles?.primarySubjects) && page.customStyles.primarySubjects.length > 0
      ? page.customStyles.primarySubjects
      : [
          { name: "English Language Arts", desc: "Grammar, creative writing, public speaking, and reading comprehension" },
          { name: "Mathematics & Logic", desc: "Concept-first arithmetic, geometry, mental math, and Vedic tricks" },
          { name: "Environmental Studies (EVS)", desc: "Scientific curiosity, Himalayan flora & fauna, and conservation" },
          { name: "Second Language (Hindi)", desc: "Literature, poetry, grammar, and expressive articulation" },
          { name: "Digital Coding & ICT", desc: "Block coding with Scratch, digital safety, and typing fluency" },
          { name: "Visual & Performing Arts", desc: "Sketching, Indian classical music, theater drama, and folk dance" },
        ];

  const updatePrimarySubject = (idx: number, updated: { name?: string; desc?: string }) => {
    const list = [...primarySubjects];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        primarySubjects: list,
      },
    });
  };

  const addPrimarySubject = () => {
    const list = [...primarySubjects, { name: "New Curricular Area", desc: "Description of subjects and learning outcomes" }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        primarySubjects: list,
      },
    });
  };

  const deletePrimarySubject = (idx: number) => {
    const list = primarySubjects.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        primarySubjects: list,
      },
    });
  };

  // Middle features helpers
  const middleFeatures: Array<{ title: string; desc: string }> =
    Array.isArray(page.customStyles?.middleFeatures) && page.customStyles.middleFeatures.length > 0
      ? page.customStyles.middleFeatures
      : [
          { title: "Hands-on Science Labs", desc: "Individual lab stations for Physics, Chemistry, and Biology practicals every week." },
          { title: "Robotics & Arduino", desc: "Students build obstacle-avoiding rovers, sensor circuits, and Python automation scripts." },
          { title: "Third Language Options", desc: "Choice between Sanskrit and French to foster multilingual versatility." },
        ];

  const updateMiddleFeature = (idx: number, updated: { title?: string; desc?: string }) => {
    const list = [...middleFeatures];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        middleFeatures: list,
      },
    });
  };

  const addMiddleFeature = () => {
    const list = [...middleFeatures, { title: "New STEM Feature", desc: "Description of laboratory or innovation feature" }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        middleFeatures: list,
      },
    });
  };

  const deleteMiddleFeature = (idx: number) => {
    const list = middleFeatures.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        middleFeatures: list,
      },
    });
  };

  // Senior streams helpers
  const seniorStreams: Array<{ name: string; subjects: string[]; careers: string }> =
    Array.isArray(page.customStyles?.seniorStreams) && page.customStyles.seniorStreams.length > 0
      ? page.customStyles.seniorStreams
      : [
          {
            name: "Science: Non-Medical (PCM)",
            subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science / Python", "English Core", "Physical Education"],
            careers: "IIT-JEE, Engineering, Architecture, Data Science, Aerospace, Defense (NDA)",
          },
          {
            name: "Science: Medical (PCB)",
            subjects: ["Physics", "Chemistry", "Biology", "Biotechnology / Psychology", "English Core", "Physical Education"],
            careers: "NEET, MBBS, AIIMS, BDS, Veterinary, Biomedical Engineering, Pharmacy",
          },
          {
            name: "Commerce Stream",
            subjects: ["Accountancy", "Business Studies", "Economics", "Applied Mathematics / IP", "English Core", "Physical Education"],
            careers: "Chartered Accountancy (CA), CS, B.Com (Hons), Finance, Corporate Law, Business Management",
          },
          {
            name: "Humanities & Liberal Arts",
            subjects: ["Political Science", "History", "Psychology / Sociology", "Economics", "English Core", "Fine Arts"],
            careers: "Civil Services (UPSC), Law (CLAT), International Relations, Journalism, Public Policy",
          },
        ];

  const updateSeniorStream = (idx: number, updated: { name?: string; subjects?: string[]; careers?: string }) => {
    const list = [...seniorStreams];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        seniorStreams: list,
      },
    });
  };

  const addSeniorStream = () => {
    const list = [
      ...seniorStreams,
      {
        name: "New Stream",
        subjects: ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "English Core"],
        careers: "Target careers and university trajectories",
      },
    ];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        seniorStreams: list,
      },
    });
  };

  const deleteSeniorStream = (idx: number) => {
    const list = seniorStreams.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        seniorStreams: list,
      },
    });
  };

  // Science Labs helpers
  const scienceLabList: Array<{ name: string; desc: string }> =
    Array.isArray(page.customStyles?.labs) && page.customStyles.labs.length > 0
      ? page.customStyles.labs
      : [
          {
            name: "Advanced Physics Laboratory",
            desc: "Equipped with optical benches, laser optics, digital oscilloscopes, mechanics apparatus, and astronomical telescopes.",
          },
          {
            name: "Chemistry Laboratory & Fume Hoods",
            desc: "Individual chemical reagent stations, electronic analytical balances, fire-retardant counters, and automated eye-wash stations.",
          },
          {
            name: "Biology & Life Sciences Lab",
            desc: "High-resolution binocular compound microscopes, human anatomical models, preserved specimen archives, and botany cultivation beds.",
          },
          {
            name: "Biotechnology & Micro-Research Suite",
            desc: "Electrophoresis kits, centrifuges, PCR thermocyclers, and sterile laminar flow benches for Class XI-XII research projects.",
          },
        ];

  const updateScienceLab = (idx: number, updated: { name?: string; desc?: string }) => {
    const list = [...scienceLabList];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        labs: list,
      },
    });
  };

  const addScienceLab = () => {
    const list = [...scienceLabList, { name: "New Scientific Suite", desc: "Description of laboratory apparatus and student experiments." }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        labs: list,
      },
    });
  };

  const deleteScienceLab = (idx: number) => {
    const list = scienceLabList.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        labs: list,
      },
    });
  };

  // Sports Complex helpers
  const sportsComplexList: Array<{ title: string; desc: string }> =
    Array.isArray(page.customStyles?.sports) && page.customStyles.sports.length > 0
      ? page.customStyles.sports
      : [
          { title: "Heated Semi-Olympic Swimming Pool", desc: "6-lane 25m all-weather temperature-controlled pool with NIS certified coaches & lifeguards." },
          { title: "FIFA-Standard Football Turf", desc: "Lush green natural grass pitch surrounded by Himalayan mountains with international dimension markings." },
          { title: "FIBA Basketball & Tennis Arena", desc: "Multi-court cushioned synthetic surfaces with floodlights for evening training camps." },
          { title: "Indoor Badminton & Table Tennis Hall", desc: "Wooden spring-floored 4-court badminton arena and automated TT ball-serving machines." },
          { title: "10m Air Rifle Shooting Range", desc: "Olympic electronic target scoring systems coached by former national marksmen." },
          { title: "Martial Arts, Taekwondo & Yoga", desc: "Dedicated dojo and open-air yoga pavilion promoting mind-body equilibrium and self-defense." },
        ];

  const updateSportsComplexItem = (idx: number, updated: { title?: string; desc?: string }) => {
    const list = [...sportsComplexList];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        sports: list,
      },
    });
  };

  const addSportsComplexItem = () => {
    const list = [...sportsComplexList, { title: "New Sporting Arena", desc: "Description of sport, infrastructure, and training programs." }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        sports: list,
      },
    });
  };

  const deleteSportsComplexItem = (idx: number) => {
    const list = sportsComplexList.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        sports: list,
      },
    });
  };

  // Transport Routes helpers
  const transportRoutesList: Array<{ route: string; stops: string }> =
    Array.isArray(page.customStyles?.routes) && page.customStyles.routes.length > 0
      ? page.customStyles.routes
      : [
          { route: "Route 1 (Mandi Central)", stops: "Victoria Bridge, Samkhetar, Palace Colony, Paddal, Bhiuli, School Campus" },
          { route: "Route 2 (Gutkar & Nerchowk)", stops: "Nerchowk Bus Stand, Medical College Chowk, Gutkar Bypass, Dudar, School Campus" },
          { route: "Route 3 (Sundernagar Express)", stops: "Sundernagar BBMB Colony, Naulakha, Kanaid, Bagla, School Campus" },
          { route: "Route 4 (Pandoh & Valley)", stops: "Pandoh Dam, Aut Link, Sauli Khad, Jail Road, School Campus" },
          { route: "Route 5 (Rewalsar Sector)", stops: "Rewalsar Lake Town, Ratti, Balh Valley, Nerchowk Link, School Campus" },
        ];

  const updateTransportRouteItem = (idx: number, updated: { route?: string; stops?: string }) => {
    const list = [...transportRoutesList];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        routes: list,
      },
    });
  };

  const addTransportRouteItem = () => {
    const list = [...transportRoutesList, { route: `Route ${transportRoutesList.length + 1}`, stops: "Stops and pickup points" }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        routes: list,
      },
    });
  };

  const deleteTransportRouteItem = (idx: number) => {
    const list = transportRoutesList.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        routes: list,
      },
    });
  };

  // Student Clubs helpers
  const studentClubsList: Array<{ title: string; desc: string }> =
    Array.isArray(page.customStyles?.clubs) && page.customStyles.clubs.length > 0
      ? page.customStyles.clubs
      : [
          { title: "Model United Nations & Debating", desc: "Developing diplomatic discourse, global problem-solving, and parliamentary oratorical skills." },
          { title: "Robotics & AI Innovation Circle", desc: "Building hardware prototypes, drone telemetry, and competitive hackathon projects." },
          { title: "Eco-Warriors & Nature Conservation", desc: "Tree plantation drives, plastic-free campaigns, and Himalayan river preservation." },
          { title: "Performing Arts, Music & Theater", desc: "Indian classical instrumental music, western choir, theater productions, and classical dance." },
          { title: "Visual Arts & Pottery Studio", desc: "Canvas oil painting, clay sculpting, digital graphic design, and calligraphy." },
          { title: "Himalayan Adventure & Trekking", desc: "Organized mountain treks, rock climbing, camping, and outdoor leadership camps." },
        ];

  const updateStudentClub = (idx: number, updated: { title?: string; desc?: string }) => {
    const list = [...studentClubsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        clubs: list,
      },
    });
  };

  const addStudentClub = () => {
    const list = [...studentClubsList, { title: "New Student Society", desc: "Description of co-curricular club activities and projects." }];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        clubs: list,
      },
    });
  };

  const deleteStudentClub = (idx: number) => {
    const list = studentClubsList.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        clubs: list,
      },
    });
  };

  // Results Toppers helpers
  const resultsToppersList: Array<{ name: string; stream: string; score: string; rank: string; photo: string }> =
    Array.isArray(page.customStyles?.toppers) && page.customStyles.toppers.length > 0
      ? page.customStyles.toppers
      : [
          { name: "Aarav Thakur", stream: "Class XII (Science - PCM)", score: "99.2%", rank: "District Rank 1 (JEE AIR 412)", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300" },
          { name: "Sneha Kapoor", stream: "Class XII (Humanities)", score: "98.8%", rank: "State Rank 1 (100 in Pol Sci & Hist)", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300" },
          { name: "Kartik Sen", stream: "Class XII (Commerce)", score: "97.6%", rank: "District Rank 2 (100 in Accounts)", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300" },
          { name: "Priyanshi Verma", stream: "Class X CBSE Boards", score: "99.0%", rank: "District Topper (100 in Math & Science)", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300" },
        ];

  const updateResultTopper = (idx: number, updated: { name?: string; stream?: string; score?: string; rank?: string; photo?: string }) => {
    const list = [...resultsToppersList];
    list[idx] = { ...list[idx], ...updated };
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        toppers: list,
      },
    });
  };

  const addResultTopper = () => {
    const list = [
      ...resultsToppersList,
      {
        name: "Student Name",
        stream: "CBSE Board / Class",
        score: "98.0%",
        rank: "District Distinction",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
      },
    ];
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        toppers: list,
      },
    });
  };

  const deleteResultTopper = (idx: number) => {
    const list = resultsToppersList.filter((_, i) => i !== idx);
    onChange({
      ...page,
      customStyles: {
        ...page.customStyles,
        toppers: list,
      },
    });
  };

  // ─── News & Circulars helpers ───────────────────────────────────────────────
  const newsItemsList: Array<{ id: string; date: string; badge: string; title: string; summary: string; link: string }> =
    Array.isArray(page.customStyles?.newsItems) && page.customStyles.newsItems.length > 0
      ? page.customStyles.newsItems
      : [
          { id: "n1", date: "15 Sep 2026", badge: "Circular", title: "Annual Sports Meet 2026 – Schedule Released", summary: "The Annual Sports Meet 2026 will be held from October 10-12. All students must collect their house t-shirts from the Sports Office by October 5.", link: "#" },
          { id: "n2", date: "10 Sep 2026", badge: "Notice", title: "Pre-Board Examinations Timetable – Classes X & XII", summary: "Pre-Board examinations for Classes X and XII are scheduled from November 3–15, 2026. Detailed timetable attached below.", link: "#" },
          { id: "n3", date: "05 Sep 2026", badge: "Circular", title: "Parent-Teacher Meeting – Quarter 2 Results", summary: "PTM for Quarter 2 results will be held on September 20, 2026 (Saturday) from 9:00 AM to 1:00 PM in the school auditorium.", link: "#" },
        ];

  const updateNewsItem = (idx: number, updated: Partial<typeof newsItemsList[0]>) => {
    const list = [...newsItemsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...page, customStyles: { ...page.customStyles, newsItems: list } });
  };

  const addNewsItem = () => {
    const id = `n${Date.now()}`;
    onChange({ ...page, customStyles: { ...page.customStyles, newsItems: [...newsItemsList, { id, date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), badge: "Notice", title: "New Notice / Circular Title", summary: "Enter the notice or circular description here.", link: "#" }] } });
  };

  const deleteNewsItem = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, newsItems: newsItemsList.filter((_, i) => i !== idx) } });
  };

  // ─── Events helpers ─────────────────────────────────────────────────────────
  const eventsList: Array<{ id: string; date: string; month: string; badge: string; title: string; description: string; venue: string }> =
    Array.isArray(page.customStyles?.events) && page.customStyles.events.length > 0
      ? page.customStyles.events
      : [
          { id: "e1", date: "10", month: "Oct", badge: "Sports", title: "Annual Sports Meet 2026", description: "Inter-house athletic competitions, swimming gala, and kabaddi championships. All parents are cordially invited.", venue: "CIS Mandi Sports Complex" },
          { id: "e2", date: "22", month: "Nov", badge: "Academic", title: "CBSE Science Exhibition 2026", description: "Students display innovative science models, AI projects, and robotics prototypes for CBSE regional evaluation.", venue: "Main Hall & Robotics Lab" },
          { id: "e3", date: "15", month: "Dec", badge: "Cultural", title: "Annual Day & Prize Distribution", description: "Celebrating outstanding achievements with cultural performances, award ceremonies, and gala dinner for families.", venue: "Open Air Amphitheater" },
          { id: "e4", date: "26", month: "Jan", badge: "National", title: "Republic Day & March Past", description: "Patriotic parade, hoisting of tricolor, and cultural programs in honor of India's Republic Day.", venue: "School Ground" },
        ];

  const updateEvent = (idx: number, updated: Partial<typeof eventsList[0]>) => {
    const list = [...eventsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...page, customStyles: { ...page.customStyles, events: list } });
  };

  const addEvent = () => {
    const id = `e${Date.now()}`;
    onChange({ ...page, customStyles: { ...page.customStyles, events: [...eventsList, { id, date: "01", month: "Jan", badge: "Event", title: "New School Event", description: "Enter event description, schedule, and key highlights here.", venue: "School Campus" }] } });
  };

  const deleteEvent = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, events: eventsList.filter((_, i) => i !== idx) } });
  };

  // ─── Downloads helpers ───────────────────────────────────────────────────────
  const downloadDocsList: Array<{ id: string; category: string; title: string; description: string; fileUrl: string; fileSize: string }> =
    Array.isArray(page.customStyles?.downloadDocs) && page.customStyles.downloadDocs.length > 0
      ? page.customStyles.downloadDocs
      : [
          { id: "d1", category: "Academic", title: "CBSE Class X & XII Syllabus 2026-27", description: "Complete official CBSE board syllabus for all streams.", fileUrl: "/uploads/syllabus-2026-27.pdf", fileSize: "2.4 MB" },
          { id: "d2", category: "Admissions", title: "School Prospectus 2026-27", description: "Comprehensive school brochure with fee structure, facilities, and admission criteria.", fileUrl: "/uploads/prospectus.pdf", fileSize: "5.8 MB" },
          { id: "d3", category: "Exam", title: "Class X Pre-Board Datesheet November 2026", description: "Detailed pre-board exam timetable for Class X students.", fileUrl: "/uploads/preboard-x-2026.pdf", fileSize: "0.8 MB" },
          { id: "d4", category: "Finance", title: "Fee Schedule & Payment Modes 2026-27", description: "Term-wise fee breakdown, bank details, and online payment instructions.", fileUrl: "/uploads/fee-schedule.pdf", fileSize: "1.2 MB" },
          { id: "d5", category: "Compliance", title: "Mandatory Disclosure – CBSE Affiliation", description: "Official CBSE-mandated disclosure document with school details, staff, and infrastructure.", fileUrl: "/uploads/mandatory-disclosure.pdf", fileSize: "3.1 MB" },
        ];

  const updateDownloadDoc = (idx: number, updated: Partial<typeof downloadDocsList[0]>) => {
    const list = [...downloadDocsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...page, customStyles: { ...page.customStyles, downloadDocs: list } });
  };

  const addDownloadDoc = () => {
    const id = `d${Date.now()}`;
    onChange({ ...page, customStyles: { ...page.customStyles, downloadDocs: [...downloadDocsList, { id, category: "General", title: "New Document Title", description: "Enter document description here.", fileUrl: "/uploads/document.pdf", fileSize: "1.0 MB" }] } });
  };

  const deleteDownloadDoc = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, downloadDocs: downloadDocsList.filter((_, i) => i !== idx) } });
  };

  // ─── Careers / Job Openings helpers ─────────────────────────────────────────
  const jobOpeningsList: Array<{ id: string; badge: string; title: string; description: string; requirements: string; deadline: string }> =
    Array.isArray(page.customStyles?.jobOpenings) && page.customStyles.jobOpenings.length > 0
      ? page.customStyles.jobOpenings
      : [
          { id: "j1", badge: "PGT Faculty", title: "Post Graduate Teacher – Mathematics & Physics", description: "Teaching CBSE Classes XI-XII Mathematics and Physics. Responsible for board examination preparation and result coaching.", requirements: "M.Sc. + B.Ed (minimum 3 years CBSE experience). Knowledge of CBSE curriculum essential.", deadline: "31 Oct 2026" },
          { id: "j2", badge: "STEM Faculty", title: "Robotics & AI Lab Instructor", description: "Conducting practical robotics, Python coding, and STEM Olympiad training sessions for Grades 5-12.", requirements: "B.Tech/MCA + hands-on Arduino, Raspberry Pi, 3D printing. NIS/STEM certification preferred.", deadline: "15 Oct 2026" },
          { id: "j3", badge: "Sports Coach", title: "Swimming Coach & Fitness Trainer", description: "Coaching the school swimming team, aquatic sessions, and physical fitness programs for all grades.", requirements: "NIS certification in swimming coaching. Minimum 2 years coaching experience at school/district level.", deadline: "20 Oct 2026" },
        ];

  const updateJobOpening = (idx: number, updated: Partial<typeof jobOpeningsList[0]>) => {
    const list = [...jobOpeningsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...page, customStyles: { ...page.customStyles, jobOpenings: list } });
  };

  const addJobOpening = () => {
    const id = `j${Date.now()}`;
    onChange({ ...page, customStyles: { ...page.customStyles, jobOpenings: [...jobOpeningsList, { id, badge: "Faculty", title: "New Job Vacancy Title", description: "Enter job role description, responsibilities, and expectations here.", requirements: "Enter minimum qualification and experience requirements.", deadline: "30 Nov 2026" }] } });
  };

  const deleteJobOpening = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, jobOpenings: jobOpeningsList.filter((_, i) => i !== idx) } });
  };


  // ─── Hall of Fame & Achievements helpers ────────────────────────────────────
  const achievementsList: Array<{
    id: string;
    studentName: string;
    category: string;
    year: string;
    grade: string;
    rank: string;
    title: string;
    description: string;
    photoUrl: string;
  }> =
    Array.isArray(page.customStyles?.achievements) && page.customStyles.achievements.length > 0
      ? page.customStyles.achievements
      : [
          {
            id: "ach_1",
            studentName: "Aditya Sharma",
            category: "Olympiads",
            year: "2025-26",
            grade: "Grade 11 (Science)",
            rank: "National Gold (Rank 1)",
            title: "National Science Olympiad (NSO) Gold Medalist",
            description: "Scored 100 percentile in NSO Stage 2 and qualified for International Junior Science Olympiad selection camp.",
            photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600",
          },
          {
            id: "ach_2",
            studentName: "Ananya Sen",
            category: "Robotics",
            year: "2025",
            grade: "Grade 9",
            rank: "1st Prize National",
            title: "National STEM & AI Innovation Rover Championship",
            description: "Engineered an autonomous alpine landslide rescue rover prototype equipped with IoT seismic telemetry sensors.",
            photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600",
          },
          {
            id: "ach_3",
            studentName: "Devansh Thakur",
            category: "Sports",
            year: "2025-26",
            grade: "Grade 10",
            rank: "State Champion",
            title: "Himachal State Aquatic Championship 100m Freestyle",
            description: "Smashed state record in 100m freestyle swimming and won 3 gold medals representing CIS Mandi at State Games.",
            photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
          },
        ];

  const updateAchievement = (idx: number, updated: Partial<typeof achievementsList[0]>) => {
    const list = [...achievementsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...page, customStyles: { ...page.customStyles, achievements: list } });
  };

  const addAchievement = () => {
    const list = [
      ...achievementsList,
      {
        id: `ach_${Date.now()}`,
        studentName: "Student Full Name",
        category: "Academics",
        year: "2026",
        grade: "Grade 10",
        rank: "Gold Medal / Rank 1",
        title: "Achievement or Competition Title",
        description: "Details regarding the laurel, tournament or distinction achieved by the student.",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
      },
    ];
    onChange({ ...page, customStyles: { ...page.customStyles, achievements: list } });
  };

  const deleteAchievement = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, achievements: achievementsList.filter((_, i) => i !== idx) } });
  };

  // ─── Photo & Video Gallery Albums helpers ────────────────────────────────────
  const galleryAlbumsList: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    coverImage: string;
    photoCount?: string;
  }> =
    Array.isArray(page.customStyles?.galleryAlbums) && page.customStyles.galleryAlbums.length > 0
      ? page.customStyles.galleryAlbums
      : [
          {
            id: "alb_1",
            title: "Annual Sports Meet & Athletic Celebrations",
            category: "Sports",
            description: "Track and field events, house march-past, gymnastic displays, and prize distribution.",
            coverImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            photoCount: "48 Photos",
          },
          {
            id: "alb_2",
            title: "Science, AI & Robotics Exhibition Day",
            category: "Science & Robotics",
            description: "Student projects, working drone prototypes, IoT smart city models, and interactive science games.",
            coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            photoCount: "36 Photos",
          },
          {
            id: "alb_3",
            title: "Annual Cultural Fest & Himalayan Theater",
            category: "Celebrations",
            description: "Traditional folk dances, musical orchestra ensembles, and student dramatic productions.",
            coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            photoCount: "62 Photos",
          },
        ];

  const updateGalleryAlbum = (idx: number, updated: Partial<typeof galleryAlbumsList[0]>) => {
    const list = [...galleryAlbumsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...page, customStyles: { ...page.customStyles, galleryAlbums: list } });
  };

  const addGalleryAlbum = () => {
    const list = [
      ...galleryAlbumsList,
      {
        id: `alb_${Date.now()}`,
        title: "New Photo Album Title",
        category: "Campus",
        description: "Album description and celebration highlights.",
        coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        photoCount: "25 Photos",
      },
    ];
    onChange({ ...page, customStyles: { ...page.customStyles, galleryAlbums: list } });
  };

  const deleteGalleryAlbum = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, galleryAlbums: galleryAlbumsList.filter((_, i) => i !== idx) } });
  };

  // ─── 360° Virtual Tour Points helpers ───────────────────────────────────────
  const tourPointsList: Array<{
    id: string;
    name: string;
    category: string;
    image: string;
    description: string;
  }> =
    Array.isArray(page.customStyles?.tourPoints) && page.customStyles.tourPoints.length > 0
      ? page.customStyles.tourPoints
      : [
          {
            id: "quadrangle",
            name: "Himalayan Central Quadrangle & Academic Block",
            category: "Campus Core",
            image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400",
            description: "The magnificent heart of Cambridge Mandi overlooking the snow-dusted Shivalik ridges.",
          },
          {
            id: "smart-lab",
            name: "4K Digital Smart Classroom & Innovation Pods",
            category: "Academic",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400",
            description: "Equipped with 86-inch interactive panels, acoustic paneling, and ergonomic seating.",
          },
          {
            id: "robotics-suite",
            name: "STEM, AI & Robotics Innovation Lab",
            category: "Innovation",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400",
            description: "Maker space equipped with 3D printers, IoT hardware, Arduino & Raspberry Pi rigs, and drone test bays.",
          },
          {
            id: "aquatics",
            name: "Semi-Olympic Heated Swimming Pool",
            category: "Sports",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400",
            description: "6-lane temperature-controlled indoor pool with certified national life coaches.",
          },
        ];

  const updateTourPoint = (idx: number, updated: Partial<typeof tourPointsList[0]>) => {
    const list = [...tourPointsList];
    list[idx] = { ...list[idx], ...updated };
    onChange({ ...page, customStyles: { ...page.customStyles, tourPoints: list } });
  };

  const addTourPoint = () => {
    const list = [
      ...tourPointsList,
      {
        id: `tp_${Date.now()}`,
        name: "Campus Location Name",
        category: "Infrastructure",
        image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1400",
        description: "Panoramic view description and facility features.",
      },
    ];
    onChange({ ...page, customStyles: { ...page.customStyles, tourPoints: list } });
  };

  const deleteTourPoint = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, tourPoints: tourPointsList.filter((_, i) => i !== idx) } });
  };

  // ─── Apply Online Documents checklist helpers ───────────────────────────────
  const applyDocsList: string[] =
    Array.isArray(page.customStyles?.applyDocs) && page.customStyles.applyDocs.length > 0
      ? page.customStyles.applyDocs
      : [
          "Birth Certificate of Child (Municipality / Gram Panchayat issued)",
          "Previous Class Report Card / Marksheet (for Grade 1 and above)",
          "Transfer Certificate (TC) counter-signed by Education Authority",
          "4 Passport Size Color Photographs of Student",
          "Aadhaar Card copies of Student and Both Parents",
          "Medical Fitness / Vaccination Certificate from Registered Doctor",
        ];

  const updateApplyDoc = (idx: number, val: string) => {
    const list = [...applyDocsList];
    list[idx] = val;
    onChange({ ...page, customStyles: { ...page.customStyles, applyDocs: list } });
  };

  const addApplyDoc = () => {
    onChange({ ...page, customStyles: { ...page.customStyles, applyDocs: [...applyDocsList, "New Required Document"] } });
  };

  const deleteApplyDoc = (idx: number) => {
    onChange({ ...page, customStyles: { ...page.customStyles, applyDocs: applyDocsList.filter((_, i) => i !== idx) } });
  };

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
    type: "hero" | "author" | "chairman" | "principal" | "item" | "doc" | "wing" | "topper" | "achievement" | "album" | "tour",
    secIdx?: number,
    itemIdx?: number,
    docIdx?: number,
    topperIdx?: number,
    achievementIdx?: number,
    albumIdx?: number,
    tourIdx?: number
  ) => {
    setActiveImageTarget({ type, secIdx, itemIdx, docIdx, topperIdx, achievementIdx, albumIdx, tourIdx });
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
        } else if (
          activeImageTarget.type === "topper" &&
          activeImageTarget.topperIdx !== undefined
        ) {
          updateResultTopper(activeImageTarget.topperIdx, { photo: url });
        } else if (
          activeImageTarget.type === "achievement" &&
          activeImageTarget.achievementIdx !== undefined
        ) {
          updateAchievement(activeImageTarget.achievementIdx, { photoUrl: url });
        } else if (
          activeImageTarget.type === "album" &&
          activeImageTarget.albumIdx !== undefined
        ) {
          updateGalleryAlbum(activeImageTarget.albumIdx, { coverImage: url });
        } else if (
          activeImageTarget.type === "tour" &&
          activeImageTarget.tourIdx !== undefined
        ) {
          updateTourPoint(activeImageTarget.tourIdx, { image: url });
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
    } else if (
      showUrlModal.type === "topper" &&
      showUrlModal.topperIdx !== undefined
    ) {
      updateResultTopper(showUrlModal.topperIdx, { photo: cleanUrl });
    } else if (
      showUrlModal.type === "achievement" &&
      showUrlModal.achievementIdx !== undefined
    ) {
      updateAchievement(showUrlModal.achievementIdx, { photoUrl: cleanUrl });
    } else if (
      showUrlModal.type === "album" &&
      showUrlModal.albumIdx !== undefined
    ) {
      updateGalleryAlbum(showUrlModal.albumIdx, { coverImage: cleanUrl });
    } else if (
      showUrlModal.type === "tour" &&
      showUrlModal.tourIdx !== undefined
    ) {
      updateTourPoint(showUrlModal.tourIdx, { image: cleanUrl });
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
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
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
  const aboutCampusPhoto = page.customStyles?.authorImage || page.heroImage || "https://images.unsplash.com/photo-1562774053-701939374585?w=800";
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
                              "https://images.unsplash.com/photo-1562774053-701939374585?w=1600"
                            }
                            alt="Hero Poster"
                            className="w-full h-full object-cover opacity-60"
                          />
                        </div>
                      ) : (
                        <img
                          src={
                            page.heroImage ||
                            "https://images.unsplash.com/photo-1562774053-701939374585?w=1600"
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
                    {isFacilitiesHubPage ? (
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>Home</span>
                        <span>›</span>
                        <span className="text-amber-400 font-bold">Campus Facilities</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>Home</span>
                        <span>›</span>
                        <span>
                          {page.slug.includes("message") || page.slug === "mission-vision" || page.slug === "about" || isFacultyPage
                            ? "About Us"
                            : isAcademicsHubPage || isAcademicWingPage
                            ? "Academics"
                            : isFacilityPage
                            ? "Facilities"
                            : isAdmissionsPage || isProcedurePage || isFeesPage || isScholarshipsPage || page.slug === "apply"
                            ? "Admissions"
                            : isStudentLifePage
                            ? "Student Life"
                            : isResultsPage
                            ? "Academic Excellence"
                            : isContactPage
                            ? "Contact"
                            : "Pages"}
                        </span>
                        <span>›</span>
                        <span className="text-amber-400 font-bold">
                          {isFacultyPage
                            ? "Faculty Directory"
                            : page.slug === "apply"
                            ? "Apply Online"
                            : page.slug === "pre-primary"
                            ? "Pre-Primary"
                            : page.slug === "primary"
                            ? "Primary Wing"
                            : page.slug === "middle-school"
                            ? "Middle School"
                            : page.slug === "senior-secondary"
                            ? "Senior Secondary"
                            : page.slug === "smart-classrooms"
                            ? "Smart Classrooms"
                            : page.slug === "science-labs"
                            ? "Science Labs"
                            : page.slug === "robotics-lab"
                            ? "Robotics Lab"
                            : page.slug === "library"
                            ? "Central Library"
                            : page.slug === "sports-complex"
                            ? "Sports Complex"
                            : page.slug === "hostel"
                            ? "Hostel"
                            : page.slug === "transport"
                            ? "Transport"
                            : page.slug === "student-life"
                            ? "Student Life & Clubs"
                            : page.slug === "results"
                            ? "CBSE Board Results"
                            : page.slug === "contact"
                            ? "Contact Us"
                            : page.slug === "procedure"
                            ? "Admission Procedure"
                            : page.slug === "fees-structure"
                            ? "Fee Structure"
                            : page.slug === "scholarships"
                            ? "Scholarship Schemes"
                            : page.pageName}
                        </span>
                      </div>
                    )}

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
                {/* 7. ADMISSION PROCEDURE: EXACT AGE MATRIX TABLE & MANDATORY DOCS VIEW */}
                {/* ========================================================================= */}
                {isProcedurePage && (
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-14 bg-white dark:bg-slate-950">
                    {/* 1. Age Criteria Table */}
                    <div className="space-y-6">
                      <div className="max-w-2xl space-y-1">
                        <div className="inline-block">
                          <input
                            type="text"
                            value={page.customStyles?.ageMatrixBadge || "Eligibility Matrix"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  ageMatrixBadge: e.target.value,
                                },
                              })
                            }
                            placeholder="Eligibility Matrix"
                            className="text-xs font-bold text-school-secondary uppercase tracking-wider bg-transparent focus:outline-none border-b border-dashed border-transparent hover:border-school-secondary"
                          />
                        </div>
                        <input
                          type="text"
                          value={page.customStyles?.ageMatrixTitle || "Age Criteria for Session 2025–2026"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                ageMatrixTitle: e.target.value,
                              },
                            })
                          }
                          placeholder="Age Criteria for Session..."
                          className="w-full text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 font-heading"
                        />
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead className="bg-school-primary text-white">
                            <tr>
                              <th className="p-4 font-bold w-1/3">Grade / Class Applying</th>
                              <th className="p-4 font-bold">Minimum Age Eligibility (as of 31st March 2025)</th>
                              <th className="p-4 font-bold w-16 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {procedureAgeMatrix.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group/row">
                                <td className="p-3 font-semibold text-school-primary dark:text-amber-400">
                                  <input
                                    type="text"
                                    value={item.grade || ""}
                                    onChange={(e) => updateAgeMatrixRow(idx, { grade: e.target.value })}
                                    placeholder="e.g. Grade I"
                                    className="w-full bg-transparent font-semibold text-school-primary dark:text-amber-400 focus:outline-none focus:bg-amber-400/10 px-2 py-1 rounded"
                                  />
                                </td>
                                <td className="p-3 text-slate-600 dark:text-slate-300">
                                  <input
                                    type="text"
                                    value={item.age || ""}
                                    onChange={(e) => updateAgeMatrixRow(idx, { age: e.target.value })}
                                    placeholder="e.g. 6+ Years as on 31st March"
                                    className="w-full bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-amber-400/10 px-2 py-1 rounded"
                                  />
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => deleteAgeMatrixRow(idx)}
                                    title="Delete this grade row"
                                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={addAgeMatrixRow}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-all border border-blue-200 dark:border-blue-900 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Grade Criteria Row</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. Mandatory Documents Checklist */}
                    <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="max-w-2xl space-y-1">
                        <div className="inline-block">
                          <input
                            type="text"
                            value={page.customStyles?.docsBadge || "Verification Checklist"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: {
                                  ...page.customStyles,
                                  docsBadge: e.target.value,
                                },
                              })
                            }
                            placeholder="Verification Checklist"
                            className="text-xs font-bold text-amber-500 uppercase tracking-wider bg-transparent focus:outline-none border-b border-dashed border-transparent hover:border-amber-500"
                          />
                        </div>
                        <input
                          type="text"
                          value={page.customStyles?.docsTitle || "Mandatory Documents for Final Admission"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: {
                                ...page.customStyles,
                                docsTitle: e.target.value,
                              },
                            })
                          }
                          placeholder="Mandatory Documents..."
                          className="w-full text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none border-b border-dashed border-transparent hover:border-amber-400/60 font-heading"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {procedureDocs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-start space-x-3 text-xs sm:text-sm shadow-sm group/doc"
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <textarea
                              rows={2}
                              value={doc || ""}
                              onChange={(e) => updateProcedureDoc(idx, e.target.value)}
                              placeholder="Document requirement description..."
                              className="w-full bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-amber-400/10 p-1 rounded resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => deleteProcedureDoc(idx)}
                              title="Delete document requirement"
                              className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-500/10 opacity-0 group-hover/doc:opacity-100 transition-opacity cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={addProcedureDoc}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold transition-all border border-emerald-200 dark:border-emerald-900 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Mandatory Document</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. Action Button */}
                    <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-school-secondary to-blue-600 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl">
                        <input
                          type="text"
                          value={page.customStyles?.ctaText || page.heroCtaText || "Proceed to Online Application Form"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              heroCtaText: e.target.value,
                              customStyles: {
                                ...page.customStyles,
                                ctaText: e.target.value,
                              },
                            })
                          }
                          placeholder="Button Label..."
                          className="bg-transparent text-white font-bold text-sm focus:outline-none text-center min-w-[220px]"
                        />
                        <ArrowRight className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                        <span>Button Link URL:</span>
                        <input
                          type="text"
                          value={page.customStyles?.ctaLink || page.heroCtaLink || "/admissions/apply"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              heroCtaLink: e.target.value,
                              customStyles: {
                                ...page.customStyles,
                                ctaLink: e.target.value,
                              },
                            })
                          }
                          placeholder="/admissions/apply"
                          className="bg-transparent text-blue-500 font-medium focus:outline-none underline text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 8. FEES STRUCTURE: EXACT COMPOSITE BREAKDOWN TABLE & ADD-ONS VIEW */}
                {/* ========================================================================= */}
                {isFeesPage && (
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-14 bg-white dark:bg-slate-950">
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={page.customStyles?.feesTableBadge || "Approved by Management & PTA"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, feesTableBadge: e.target.value },
                              })
                            }
                            placeholder="Badge label..."
                            className="text-xs font-bold text-school-secondary uppercase tracking-wider bg-transparent focus:outline-none"
                          />
                          <input
                            type="text"
                            value={page.customStyles?.feesTableTitle || "Tuition & Composite Fee Breakdown"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, feesTableTitle: e.target.value },
                              })
                            }
                            placeholder="Tuition & Composite Fee Breakdown"
                            className="w-full text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none font-heading"
                          />
                        </div>

                        <div className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                          <Download className="w-4 h-4 text-amber-500" />
                          <span>Download Official Fee Schedule (PDF)</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead className="bg-school-primary text-white">
                            <tr>
                              <th className="p-4 font-bold">Academic Wing / Grades</th>
                              <th className="p-4 font-bold">Admission Fee (₹)</th>
                              <th className="p-4 font-bold">Annual Fee (₹)</th>
                              <th className="p-4 font-bold">Quarterly Tuition (₹)</th>
                              <th className="p-4 font-bold">Lab & STEM Fee (₹)</th>
                              <th className="p-4 font-bold text-center w-14">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {feeTiers.map((tier: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3">
                                  <input
                                    type="text"
                                    value={tier.wing || ""}
                                    onChange={(e) => updateFeeTier(idx, { wing: e.target.value })}
                                    className="w-full font-bold text-school-primary dark:text-amber-300 bg-transparent focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-3">
                                  <input
                                    type="number"
                                    value={tier.admissionFee || 0}
                                    onChange={(e) => updateFeeTier(idx, { admissionFee: Number(e.target.value) })}
                                    className="w-full text-slate-600 dark:text-slate-300 bg-transparent focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-3">
                                  <input
                                    type="number"
                                    value={tier.annualCompositeFee || 0}
                                    onChange={(e) => updateFeeTier(idx, { annualCompositeFee: Number(e.target.value) })}
                                    className="w-full font-semibold text-slate-900 dark:text-white bg-transparent focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-3">
                                  <input
                                    type="number"
                                    value={tier.quarterlyTuition || 0}
                                    onChange={(e) => updateFeeTier(idx, { quarterlyTuition: Number(e.target.value) })}
                                    className="w-full font-bold text-emerald-600 dark:text-emerald-400 bg-transparent focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-3">
                                  <input
                                    type="number"
                                    value={tier.activityAndLabFee || 0}
                                    onChange={(e) => updateFeeTier(idx, { activityAndLabFee: Number(e.target.value) })}
                                    className="w-full text-slate-600 dark:text-slate-300 bg-transparent focus:outline-none px-2 py-1"
                                  />
                                </td>
                                <td className="p-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => deleteFeeTier(idx)}
                                    className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-500/10 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={addFeeTier}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Academic Wing Fee Tier</span>
                        </button>
                      </div>
                    </div>

                    {/* Add-ons 2-column grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <input
                          type="text"
                          value={page.customStyles?.transportTitle || "Optional School Transport (GPS Monitored)"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, transportTitle: e.target.value },
                            })
                          }
                          className="w-full font-bold text-lg text-school-primary dark:text-white bg-transparent focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={page.customStyles?.transportDesc || "Transport charges are slab-based depending on distance from campus:"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, transportDesc: e.target.value },
                            })
                          }
                          className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none"
                        />
                        <div className="space-y-2 pt-2 text-xs">
                          {transportSlabs.map((s: any, sIdx: number) => (
                            <div key={sIdx} className="flex items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800">
                              <input
                                type="text"
                                value={s.slab || s.range || ""}
                                onChange={(e) => updateTransportSlab(sIdx, { slab: e.target.value, range: e.target.value })}
                                className="w-2/3 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={s.fee || ""}
                                onChange={(e) => updateTransportSlab(sIdx, { fee: e.target.value })}
                                className="w-1/3 text-right font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => deleteTransportSlab(sIdx)}
                                className="text-slate-400 hover:text-red-500 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addTransportSlab}
                          className="text-[11px] font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Transport Slab</span>
                        </button>
                      </div>

                      <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                        <input
                          type="text"
                          value={page.customStyles?.hostelTitle || "Residential Hostel & Boarding (Optional)"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, hostelTitle: e.target.value },
                            })
                          }
                          className="w-full font-bold text-lg text-school-primary dark:text-white bg-transparent focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={page.customStyles?.hostelDesc || "Includes room accommodation, 4 meals daily, 24x7 resident warden care:"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, hostelDesc: e.target.value },
                            })
                          }
                          className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none"
                        />
                        <div className="space-y-2 pt-2 text-xs">
                          {hostelFees.map((h: any, hIdx: number) => (
                            <div key={hIdx} className="flex items-center justify-between gap-2 py-1 border-b border-slate-100 dark:border-slate-800">
                              <input
                                type="text"
                                value={h.item || h.label || ""}
                                onChange={(e) => updateHostelFee(hIdx, { item: e.target.value, label: e.target.value })}
                                className="w-2/3 bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={h.fee || ""}
                                onChange={(e) => updateHostelFee(hIdx, { fee: e.target.value })}
                                className="w-1/3 text-right font-bold text-emerald-600 dark:text-emerald-400 bg-transparent focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 9. ADMISSIONS HUB: EXACT BANNER, 4 STEPS GRID & SUBPAGE LINKS */}
                {/* ========================================================================= */}
                {isAdmissionsPage && (
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-14 bg-white dark:bg-slate-950">
                    {/* Banner Card */}
                    <div className="bg-gradient-to-r from-school-primary via-blue-900 to-school-primary text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                      <div className="space-y-3 max-w-2xl">
                        <input
                          type="text"
                          value={page.customStyles?.bannerBadge || "Limited Seats per Grade"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, bannerBadge: e.target.value },
                            })
                          }
                          className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider focus:outline-none"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.bannerTitle || "Admissions Open for Nursery to Grade XI"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, bannerTitle: e.target.value },
                            })
                          }
                          className="w-full text-2xl sm:text-4xl font-extrabold font-heading text-white bg-transparent focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={page.customStyles?.bannerDesc || "We maintain a low 1:15 mentor-student ratio to ensure personalized attention."}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, bannerDesc: e.target.value },
                            })
                          }
                          className="w-full text-slate-200 text-sm bg-transparent focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        <div className="bg-amber-400 text-slate-950 font-extrabold text-sm px-6 py-3 rounded-2xl shadow-xl">
                          <input
                            type="text"
                            value={page.customStyles?.bannerBtn1Text || "Fill Online Application"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, bannerBtn1Text: e.target.value },
                              })
                            }
                            className="bg-transparent text-slate-950 font-extrabold text-sm focus:outline-none text-center"
                          />
                        </div>
                        <div className="bg-white/10 text-white font-semibold text-sm px-6 py-3 rounded-2xl border border-white/20">
                          <input
                            type="text"
                            value={page.customStyles?.bannerBtn2Text || "Download Prospectus"}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, bannerBtn2Text: e.target.value },
                              })
                            }
                            className="bg-transparent text-white font-semibold text-sm focus:outline-none text-center"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4 Steps Section */}
                    <div className="space-y-6">
                      <div className="text-center max-w-2xl mx-auto space-y-1">
                        <input
                          type="text"
                          value={page.customStyles?.stepsTitle || "4-Step Simple Admission Process"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stepsTitle: e.target.value },
                            })
                          }
                          className="w-full text-center text-2xl sm:text-3xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none font-heading"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.stepsSubtitle || "Transparent, hassle-free, and parent-friendly registration workflow."}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stepsSubtitle: e.target.value },
                            })
                          }
                          className="w-full text-center text-xs text-slate-500 bg-transparent focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {admissionSteps.map((step: any, idx: number) => (
                          <div
                            key={idx}
                            className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 relative overflow-hidden group"
                          >
                            <span className="w-8 h-8 rounded-full bg-school-secondary text-white font-bold text-xs flex items-center justify-center shadow">
                              {step.num}
                            </span>
                            <input
                              type="text"
                              value={step.title || ""}
                              onChange={(e) => updateAdmissionStep(idx, { title: e.target.value })}
                              className="w-full font-bold text-base text-school-primary dark:text-white bg-transparent focus:outline-none"
                            />
                            <textarea
                              rows={3}
                              value={step.desc || ""}
                              onChange={(e) => updateAdmissionStep(idx, { desc: e.target.value })}
                              className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => deleteAdmissionStep(idx)}
                              className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={addAdmissionStep}
                          className="inline-flex items-center space-x-1 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-900 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Admission Step</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 10. SCHOLARSHIPS: EXACT SCHOLARSHIP SCHEMES CARDS VIEW */}
                {/* ========================================================================= */}
                {isScholarshipsPage && (
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10 bg-white dark:bg-slate-950">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {scholarshipSchemes.map((scheme: any, idx: number) => {
                        const colorClass = scheme.color || "from-amber-500 to-orange-600";
                        return (
                          <div
                            key={idx}
                            className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative overflow-hidden group"
                          >
                            <div className="flex items-center justify-between">
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${colorClass} text-white flex items-center justify-center shadow-md`}>
                                <Award className="w-6 h-6" />
                              </div>
                              <input
                                type="text"
                                value={scheme.discount || ""}
                                onChange={(e) => updateScholarshipScheme(idx, { discount: e.target.value })}
                                className="text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full focus:outline-none text-right"
                              />
                            </div>

                            <input
                              type="text"
                              value={scheme.title || ""}
                              onChange={(e) => updateScholarshipScheme(idx, { title: e.target.value })}
                              className="w-full text-xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                            />

                            <textarea
                              rows={3}
                              value={scheme.eligibility || ""}
                              onChange={(e) => updateScholarshipScheme(idx, { eligibility: e.target.value })}
                              className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed"
                            />

                            <button
                              type="button"
                              onClick={() => deleteScholarshipScheme(idx)}
                              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <button
                        type="button"
                        onClick={addScholarshipScheme}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold border border-purple-200 dark:border-purple-800 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Scholarship Scheme</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 11. FACILITIES SUBPAGE: EXACT 2-COLUMN STORY & SPECIFICATIONS VIEW */}
                {/* ========================================================================= */}
                {isFacilityPage && (
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-6 space-y-6">
                        <input
                          type="text"
                          value={page.customStyles?.facilityBadge || (
                            page.slug === "smart-classrooms" ? "Interactive Pedagogy" :
                            page.slug === "science-labs" ? "Empirical Learning" :
                            page.slug === "robotics-lab" ? "National Gold Medalist Lab 2025" :
                            page.slug === "computer-labs" ? "Computing Excellence" :
                            page.slug === "library" ? "25,000+ Books & Digital Journals" :
                            page.slug === "sports-complex" ? "Champions in the Making" :
                            page.slug === "hostel" ? "Pastoral Care & Comfort" :
                            page.slug === "transport" ? "Safety & Real-Time Tracking" :
                            "World-Class Infrastructure"
                          )}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, facilityBadge: e.target.value },
                            })
                          }
                          className="text-xs font-bold text-school-secondary uppercase tracking-wider bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.facilityHeadline || (
                            page.slug === "smart-classrooms" ? "Visual, Engaging & Experiential Learning" :
                            page.slug === "science-labs" ? "Where Young Scientists Discover Truth Through Experimentation" :
                            page.slug === "robotics-lab" ? "From Concept to Creation: Real Engineering for School Students" :
                            page.slug === "computer-labs" ? "Cultivating Algorithmic Thinking & AI Fluency" :
                            page.slug === "library" ? "Igniting the Imagination and Sustaining Deep Research" :
                            page.slug === "sports-complex" ? "World-Class Arenas Nurturing National Champions" :
                            page.slug === "hostel" ? "Safe, Structured & Loving Residential Community" :
                            page.slug === "transport" ? "Punctual, Supervised & Secure Daily Commute" :
                            page.heroTitle || page.pageName
                          )}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, facilityHeadline: e.target.value },
                            })
                          }
                          className="w-full text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none font-heading"
                        />
                        <textarea
                          rows={4}
                          value={page.customStyles?.facilityStory || (
                            page.slug === "smart-classrooms" ? "Every single classroom at Cambridge International School Mandi is equipped as a full-fledged multimedia smart room. Our teachers utilize 3D simulations, interactive geometry manipulatives, and virtual field trips to explain complex topics." :
                            page.slug === "science-labs" ? "At CIS Mandi, science is taught not through passive memorization, but through active tactile experimentation. Each student performs individual practicals under the close guidance of specialized lab demonstrators and senior faculty." :
                            page.slug === "robotics-lab" ? "The CIS Mandi STEM & Robotics Lab is celebrated as one of the most advanced innovation facilities in northern India. Students build AI rovers, alpine landslide sensor networks, autonomous line-followers, and IoT smart irrigation models." :
                            page.slug === "computer-labs" ? "In an era powered by software and intelligent algorithms, CIS Mandi equips students with robust computational problem-solving abilities from Grade 1 through Class 12." :
                            page.slug === "library" ? "The Central Library of CIS Mandi is the intellectual heartbeat of our campus. Bathed in natural Himalayan sunlight with panoramic mountain views, it provides an inspiring atmosphere for reading, creative writing, and competitive exam preparation." :
                            page.slug === "sports-complex" ? "At CIS Mandi, physical education is an integral pillar of character building. Directed by Col. (Retd.) Harpreet Singh and NIS certified trainers, our athletic program has produced national medalists in swimming, sprint athletics, and shooting." :
                            page.slug === "hostel" ? "For parents seeking premier boarding in Himachal Pradesh, the CIS Mandi Hostel offers an environment of camaraderie, discipline, and academic reinforcement. Resident students develop lifelong friendships, self-reliance, and outstanding time-management habits." :
                            page.slug === "transport" ? "Every bus in the CIS Mandi transport fleet is equipped with real-time GPS telemetry, dual HD CCTV security cameras, speed limit governors (restricted to 40 km/h on mountain roads), and mandatory first-aid kits. Trained female attendants accompany every route to assist younger children, and parents receive live SMS/App arrival notifications." :
                            page.heroSubtitle || "Designed to international safety and educational benchmarks."
                          )}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, facilityStory: e.target.value },
                            })
                          }
                          className="w-full text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-transparent focus:outline-none resize-none"
                        />

                        <div className="space-y-3 pt-2">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Key Facility Features & Specifications
                          </p>
                          {facilitySpecs.map((spec, sIdx) => (
                            <div key={sIdx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300 group/spec">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <input
                                type="text"
                                value={spec || ""}
                                onChange={(e) => updateFacilitySpec(sIdx, e.target.value)}
                                className="w-full bg-transparent focus:outline-none focus:bg-amber-400/10 px-1.5 py-0.5 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => deleteFacilitySpec(sIdx)}
                                className="opacity-0 group-hover/spec:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addFacilitySpec}
                            className="text-[11px] font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 pt-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Specification Item</span>
                          </button>
                        </div>

                        {/* Facility CTA Button */}
                        <div className="pt-3 flex flex-wrap items-center gap-3">
                          <input
                            type="text"
                            value={
                              page.customStyles?.facilityCtaText ||
                              (page.slug === "science-labs"
                                ? "Apply for Senior Science Batch"
                                : page.slug === "sports-complex"
                                ? "Apply for Sports Excellence Batches"
                                : page.slug === "transport"
                                ? "Inquire About Bus Stop Near You"
                                : page.slug === "hostel"
                                ? "Apply for Boarding Admission"
                                : page.slug === "robotics-lab"
                                ? "Join the Robotics Innovation Wing"
                                : "Apply for Admission")
                            }
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, facilityCtaText: e.target.value },
                              })
                            }
                            className="inline-flex items-center space-x-2 bg-school-secondary hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition-all focus:outline-none"
                          />
                          <input
                            type="text"
                            value={page.customStyles?.facilityCtaLink || (page.slug === "transport" ? "/contact" : "/admissions/apply")}
                            onChange={(e) =>
                              onChange({
                                ...page,
                                customStyles: { ...page.customStyles, facilityCtaLink: e.target.value },
                              })
                            }
                            className="text-xs text-slate-400 bg-transparent border-b border-dashed border-slate-600 focus:outline-none px-1"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-6">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group/photo bg-slate-800">
                          <img
                            src={page.heroImage || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"}
                            alt={page.pageName}
                            className="w-full h-[400px] object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => triggerImageUpload("hero")}
                              className="px-3.5 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Upload Photo
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setShowUrlModal({
                                  type: "hero",
                                  currentUrl: page.heroImage || "",
                                })
                              }
                              className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              URL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Specialized Sub-Grids */}
                    {/* 1. Science Laboratories 4-Grid */}
                    {page.slug === "science-labs" && (
                      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-school-primary dark:text-white">
                          Specialized Science & Research Laboratories
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {scienceLabList.map((lab, lIdx) => (
                            <div key={lIdx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 group/lab relative">
                              <button
                                type="button"
                                onClick={() => deleteScienceLab(lIdx)}
                                className="absolute top-4 right-4 opacity-0 group-hover/lab:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                                title="Delete lab"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex items-center space-x-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={lab.name}
                                  onChange={(e) => updateScienceLab(lIdx, { name: e.target.value })}
                                  className="font-bold text-base text-school-primary dark:text-white bg-transparent focus:outline-none w-full"
                                />
                              </div>
                              <textarea
                                rows={2}
                                value={lab.desc}
                                onChange={(e) => updateScienceLab(lIdx, { desc: e.target.value })}
                                className="w-full text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-transparent focus:outline-none resize-none pl-7"
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addScienceLab}
                          className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Science Laboratory</span>
                        </button>
                      </div>
                    )}

                    {/* 2. Sports Complex 6-Grid */}
                    {page.slug === "sports-complex" && (
                      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-school-primary dark:text-white">
                          World-Class Sports Arenas & Disciplines
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {sportsComplexList.map((sport, sIdx) => (
                            <div key={sIdx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 group/sport relative">
                              <button
                                type="button"
                                onClick={() => deleteSportsComplexItem(sIdx)}
                                className="absolute top-4 right-4 opacity-0 group-hover/sport:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                                title="Delete sport"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex items-center space-x-2">
                                <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={sport.title}
                                  onChange={(e) => updateSportsComplexItem(sIdx, { title: e.target.value })}
                                  className="font-bold text-sm text-school-primary dark:text-white bg-transparent focus:outline-none w-full"
                                />
                              </div>
                              <textarea
                                rows={2}
                                value={sport.desc}
                                onChange={(e) => updateSportsComplexItem(sIdx, { desc: e.target.value })}
                                className="w-full text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-transparent focus:outline-none resize-none pl-6"
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addSportsComplexItem}
                          className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Sports Discipline</span>
                        </button>
                      </div>
                    )}

                    {/* 3. Transport Routes Table */}
                    {page.slug === "transport" && (
                      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-school-primary dark:text-white">
                          Major Transport Routes & Key Stops Coverage
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {transportRoutesList.map((r, rIdx) => (
                            <div key={rIdx} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 group/route relative">
                              <button
                                type="button"
                                onClick={() => deleteTransportRouteItem(rIdx)}
                                className="absolute top-4 right-4 opacity-0 group-hover/route:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                                title="Delete route"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex items-center space-x-2 text-school-secondary font-bold text-sm">
                                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={r.route}
                                  onChange={(e) => updateTransportRouteItem(rIdx, { route: e.target.value })}
                                  className="w-full bg-transparent focus:outline-none font-bold text-sm text-school-secondary"
                                />
                              </div>
                              <div className="pl-6 flex items-start space-x-1 text-xs text-slate-600 dark:text-slate-400">
                                <strong className="flex-shrink-0">Key Stops:</strong>
                                <input
                                  type="text"
                                  value={r.stops}
                                  onChange={(e) => updateTransportRouteItem(rIdx, { stops: e.target.value })}
                                  className="w-full bg-transparent focus:outline-none text-xs text-slate-600 dark:text-slate-400"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addTransportRouteItem}
                          className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Transport Route</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 12. ACADEMIC WING SUBPAGE: EXACT 2-COLUMN PEDAGOGY & CURRICULAR VIEW */}
                {/* ========================================================================= */}
                {isAcademicWingPage && page.slug === "senior-secondary" && (
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                      <input
                        type="text"
                        value={page.customStyles?.affiliationLabel || "CBSE Senior Secondary Affiliation No. 630198"}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, affiliationLabel: e.target.value },
                          })
                        }
                        className="text-xs font-bold text-school-secondary uppercase tracking-wider bg-transparent text-center focus:outline-none w-full"
                      />
                      <input
                        type="text"
                        value={page.customStyles?.wingHeadline || "4 Dedicated Streams Crafted for Global Careers"}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, wingHeadline: e.target.value },
                          })
                        }
                        className="text-3xl font-extrabold text-school-primary dark:text-white bg-transparent text-center focus:outline-none w-full font-heading"
                      />
                      <textarea
                        rows={3}
                        value={
                          page.customStyles?.wingParagraph1 ||
                          "Our Senior Secondary wing is led by specialized Master's & Doctorate faculty with proven track records in guiding students to top percentiles in Class 10 & 12 Board examinations and national entrance tests."
                        }
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, wingParagraph1: e.target.value },
                          })
                        }
                        className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-transparent text-center focus:outline-none w-full resize-none"
                      />
                    </div>

                    {/* 4 Stream Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {seniorStreams.map((stream, idx) => {
                        const icons = [Microscope, Sparkles, Landmark, Building];
                        const StreamIcon = icons[idx % icons.length];
                        return (
                          <div
                            key={idx}
                            className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 flex flex-col justify-between group/stream relative"
                          >
                            <button
                              type="button"
                              onClick={() => deleteSeniorStream(idx)}
                              className="absolute top-4 right-4 opacity-0 group-hover/stream:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                              title="Delete stream"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-xl bg-school-primary text-amber-400 flex items-center justify-center flex-shrink-0">
                                  <StreamIcon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    value={stream.name}
                                    onChange={(e) => updateSeniorStream(idx, { name: e.target.value })}
                                    className="text-xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none w-full"
                                  />
                                  <span className="text-xs font-semibold text-school-secondary">CBSE Curriculum</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                  Offered Subject Combinations:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {stream.subjects.map((sub, sIdx) => (
                                    <input
                                      key={sIdx}
                                      type="text"
                                      value={sub}
                                      onChange={(e) => {
                                        const newSubs = [...stream.subjects];
                                        newSubs[sIdx] = e.target.value;
                                        updateSeniorStream(idx, { subjects: newSubs });
                                      }}
                                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium focus:outline-none w-auto"
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                                <strong className="text-school-primary dark:text-amber-400">Career Trajectories: </strong>
                                <input
                                  type="text"
                                  value={stream.careers}
                                  onChange={(e) => updateSeniorStream(idx, { careers: e.target.value })}
                                  className="w-full bg-transparent focus:outline-none text-xs text-slate-600 dark:text-slate-300 mt-1"
                                />
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                              <div className="w-full inline-flex items-center justify-center space-x-2 bg-school-primary text-white font-bold text-xs py-2.5 rounded-xl shadow">
                                <span>Apply for {stream.name}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={addSeniorStream}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Academic Stream</span>
                      </button>
                    </div>
                  </div>
                )}

                {isAcademicWingPage && page.slug !== "senior-secondary" && (
                  <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16 bg-white dark:bg-slate-950">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-6 space-y-6">
                        <input
                          type="text"
                          value={
                            page.customStyles?.wingAgeGroup ||
                            (page.slug === "pre-primary"
                              ? "Ages 3 to 5 Years"
                              : page.slug === "primary"
                              ? "Ages 6 to 10 Years"
                              : "Ages 11 to 13 Years")
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wingAgeGroup: e.target.value },
                            })
                          }
                          className={`text-xs font-bold uppercase tracking-wider bg-transparent focus:outline-none w-full ${
                            page.slug === "pre-primary"
                              ? "text-amber-500"
                              : page.slug === "primary"
                              ? "text-school-secondary"
                              : "text-emerald-600"
                          }`}
                        />
                        <input
                          type="text"
                          value={
                            page.customStyles?.wingHeadline ||
                            (page.slug === "pre-primary"
                              ? "The Joyful Foundation for Lifelong Learning"
                              : page.slug === "primary"
                              ? "Building Solid Intellectual & Moral Foundations"
                              : "Inquiry, Innovation & Scientific Discovery")
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wingHeadline: e.target.value },
                            })
                          }
                          className="w-full text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none font-heading"
                        />
                        <textarea
                          rows={3}
                          value={
                            page.customStyles?.wingParagraph1 ||
                            (page.slug === "pre-primary"
                              ? "At Cambridge International School Mandi, our Pre-Primary wing provides a secure, loving, and intellectually rich sanctuary where young children transition happily from home to school."
                              : page.slug === "primary"
                              ? "In the Primary Wing of CIS Mandi, education transitions into structured inquiry. Students are encouraged to experiment, ask probing questions, and understand the real-world application of concepts."
                              : "Middle School marks a vital developmental bridge where students transition into specialized disciplines. At CIS Mandi, science branches into dedicated Physics, Chemistry, and Biology laboratories, while mathematics expands into rigorous algebra and geometry.")
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wingParagraph1: e.target.value },
                            })
                          }
                          className="w-full text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-transparent focus:outline-none resize-none"
                        />
                        <textarea
                          rows={3}
                          value={
                            page.customStyles?.wingParagraph2 ||
                            (page.slug === "pre-primary"
                              ? "Our curriculum seamlessly integrates early cognitive milestones, phonics, spatial awareness, musical rhythm, and social emotional intelligence through activity-based learning."
                              : page.slug === "primary"
                              ? "Our 4K interactive smart classrooms, well-stocked junior library, and dedicated outdoor activity periods ensure that every child develops both high cognitive aptitude and physical stamina."
                              : "Students begin weekly sessions in the Himalayan Robotics & AI Innovation Lab, participating in Hackathons, Model United Nations (MUN), and Olympiad training camps.")
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wingParagraph2: e.target.value },
                            })
                          }
                          className="w-full text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-transparent focus:outline-none resize-none"
                        />

                        {/* Pre-Primary 6 Highlights with Checkmarks */}
                        {page.slug === "pre-primary" && (
                          <div className="space-y-2.5 pt-2">
                            {wingHighlights.map((hl, hIdx) => (
                              <div key={hIdx} className="flex items-center space-x-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 group/hl">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <input
                                  type="text"
                                  value={hl || ""}
                                  onChange={(e) => updateWingHighlightItem(hIdx, e.target.value)}
                                  className="w-full bg-transparent focus:outline-none focus:bg-amber-400/10 px-1.5 py-0.5 rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => deleteWingHighlightItem(hIdx)}
                                  className="opacity-0 group-hover/hl:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addWingHighlightItem}
                              className="text-[11px] font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 pt-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Curricular Highlight</span>
                            </button>
                          </div>
                        )}

                        {/* CTA Admission Button */}
                        <div className="pt-2">
                          <div
                            className={`inline-flex items-center space-x-2 font-bold text-xs px-6 py-3 rounded-xl shadow-md ${
                              page.slug === "pre-primary"
                                ? "bg-amber-400 text-slate-950"
                                : page.slug === "primary"
                                ? "bg-school-secondary text-white"
                                : "bg-emerald-600 text-white"
                            }`}
                          >
                            <input
                              type="text"
                              value={
                                page.customStyles?.wingCtaText ||
                                (page.slug === "pre-primary"
                                  ? "Apply for Nursery / KG Admission"
                                  : page.slug === "primary"
                                  ? "Register for Grade 1-5 Admissions"
                                  : "Apply for Grade 6-8 Admissions")
                              }
                              onChange={(e) =>
                                onChange({
                                  ...page,
                                  customStyles: { ...page.customStyles, wingCtaText: e.target.value },
                                })
                              }
                              className="bg-transparent focus:outline-none font-bold"
                            />
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </div>
                        </div>
                      </div>

                      {/* Right Hero Photo */}
                      <div className="lg:col-span-6">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group/photo bg-slate-800">
                          <img
                            src={
                              page.heroImage ||
                              (page.slug === "pre-primary"
                                ? "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80"
                                : page.slug === "primary"
                                ? "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
                                : "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80")
                            }
                            alt={page.pageName}
                            className="w-full h-[400px] object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => triggerImageUpload("hero")}
                              className="px-3.5 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Upload Photo
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setShowUrlModal({
                                  type: "hero",
                                  currentUrl: page.heroImage || "",
                                })
                              }
                              className="px-3.5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              URL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Primary Wing: 6 Primary Curricular Areas Grid */}
                    {page.slug === "primary" && (
                      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-2xl font-bold text-school-primary dark:text-white text-center font-heading">
                          Primary Curricular Areas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {primarySubjects.map((s, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 group/subj relative"
                            >
                              <button
                                type="button"
                                onClick={() => deletePrimarySubject(idx)}
                                className="absolute top-3 right-3 opacity-0 group-hover/subj:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                                title="Delete subject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex items-center space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-school-secondary flex-shrink-0" />
                                <input
                                  type="text"
                                  value={s.name}
                                  onChange={(e) => updatePrimarySubject(idx, { name: e.target.value })}
                                  className="font-bold text-sm text-school-primary dark:text-white bg-transparent focus:outline-none w-full"
                                />
                              </div>
                              <textarea
                                rows={2}
                                value={s.desc}
                                onChange={(e) => updatePrimarySubject(idx, { desc: e.target.value })}
                                className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={addPrimarySubject}
                            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/30 hover:bg-blue-500/20 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Curricular Area</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Middle School: 3 Feature Cards */}
                    {page.slug === "middle-school" && (
                      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {middleFeatures.map((feat, idx) => {
                            const icons = [FlaskConical, Cpu, Globe2];
                            const colors = ["text-school-secondary", "text-amber-500", "text-emerald-500"];
                            const FeatIcon = icons[idx % icons.length];
                            return (
                              <div
                                key={idx}
                                className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 group/feat relative"
                              >
                                <button
                                  type="button"
                                  onClick={() => deleteMiddleFeature(idx)}
                                  className="absolute top-3 right-3 opacity-0 group-hover/feat:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                                  title="Delete feature"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                                <FeatIcon className={`w-8 h-8 ${colors[idx % colors.length]}`} />
                                <input
                                  type="text"
                                  value={feat.title}
                                  onChange={(e) => updateMiddleFeature(idx, { title: e.target.value })}
                                  className="font-bold text-base text-school-primary dark:text-white bg-transparent focus:outline-none w-full"
                                />
                                <textarea
                                  rows={3}
                                  value={feat.desc}
                                  onChange={(e) => updateMiddleFeature(idx, { desc: e.target.value })}
                                  className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none"
                                />
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={addMiddleFeature}
                            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add STEM Feature</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 10. FACULTY DIRECTORY HUB: EXACT STATS HIGHLIGHTS & LIVE DIRECTORY */}
                {/* ========================================================================= */}
                {isFacultyPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "faculty_studio" });
                      setActiveInspectorTab("faculty_studio");
                    }}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950"
                  >
                    {/* 4 Stats Highlights Strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-2 relative group/stat hover:border-amber-400/60 transition-all">
                        <Users className="w-6 h-6 text-amber-500 mx-auto" />
                        <input
                          type="text"
                          value={page.customStyles?.stat1Value || "58+"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat1Value: e.target.value },
                            })
                          }
                          className="w-full text-center text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none"
                          placeholder="58+"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.stat1Label || "Faculty Members"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat1Label: e.target.value },
                            })
                          }
                          className="w-full text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-transparent focus:outline-none"
                          placeholder="Faculty Members"
                        />
                      </div>

                      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-2 relative group/stat hover:border-blue-400/60 transition-all">
                        <GraduationCap className="w-6 h-6 text-blue-500 mx-auto" />
                        <input
                          type="text"
                          value={page.customStyles?.stat2Value || "100%"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat2Value: e.target.value },
                            })
                          }
                          className="w-full text-center text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none"
                          placeholder="100%"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.stat2Label || "Post-Graduate Certified"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat2Label: e.target.value },
                            })
                          }
                          className="w-full text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-transparent focus:outline-none"
                          placeholder="Post-Graduate Certified"
                        />
                      </div>

                      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-2 relative group/stat hover:border-emerald-400/60 transition-all">
                        <Award className="w-6 h-6 text-emerald-500 mx-auto" />
                        <input
                          type="text"
                          value={page.customStyles?.stat3Value || "14+ Yrs"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat3Value: e.target.value },
                            })
                          }
                          className="w-full text-center text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none"
                          placeholder="14+ Yrs"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.stat3Label || "Avg Lead Experience"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat3Label: e.target.value },
                            })
                          }
                          className="w-full text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-transparent focus:outline-none"
                          placeholder="Avg Lead Experience"
                        />
                      </div>

                      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-lg text-center space-y-2 relative group/stat hover:border-amber-400/60 transition-all">
                        <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
                        <input
                          type="text"
                          value={page.customStyles?.stat4Value || "1 : 15"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat4Value: e.target.value },
                            })
                          }
                          className="w-full text-center text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none"
                          placeholder="1 : 15"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.stat4Label || "Teacher-Student Ratio"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, stat4Label: e.target.value },
                            })
                          }
                          className="w-full text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-transparent focus:outline-none"
                          placeholder="Teacher-Student Ratio"
                        />
                      </div>
                    </div>

                    {/* Interactive Faculty Directory Live Preview */}
                    <div className="space-y-6">
                      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 w-full sm:max-w-md bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-xs text-slate-400 truncate">Search faculty by name, department, or subject...</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="font-semibold text-slate-400">👨‍🏫 Live Directory Preview</span>
                          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 shadow-xs">List View</span>
                            <span className="px-2 py-0.5">Grid View</span>
                          </div>
                        </div>
                      </div>

                      {/* Department Filter Pills */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm">All</span>
                        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Administration</span>
                        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Science & STEM</span>
                        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Humanities</span>
                        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Sports & Performing Arts</span>
                      </div>

                      {/* Sample Live Educator Card */}
                      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-amber-400/40 flex-shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300"
                              alt="Principal"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[9px] text-slate-950 font-bold">
                              ★
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-base text-school-primary dark:text-white">Priyanka Jamwal</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                                Administration
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-500 border border-amber-400/30 uppercase">
                                Leadership Pillar
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Principal</p>
                            <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                              <span className="flex items-center space-x-1">
                                <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                                <span>MSc, BSc, BEd</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Award className="w-3.5 h-3.5 text-emerald-500" />
                                <span>12+ Yrs Experience</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Database Sync Banner Button */}
                        <Link
                          href="/admin/faculty"
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Manage Full Faculty Roster →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 11. ACADEMICS HUB: EXACT CENTER INTRO & 2x2 ACADEMIC WINGS GRID */}
                {/* ========================================================================= */}
                {isAcademicsHubPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "academics_studio" });
                      setActiveInspectorTab("academics_studio");
                    }}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-14 bg-white dark:bg-slate-950"
                  >
                    {/* Center Intro Block matching Live Site */}
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                      <input
                        type="text"
                        value={page.customStyles?.affiliationLabel || "CBSE AFFILIATION NO. 630198"}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, affiliationLabel: e.target.value },
                          })
                        }
                        className="w-full text-center text-xs font-bold text-school-secondary dark:text-blue-400 uppercase tracking-wider bg-transparent focus:outline-none"
                        placeholder="CBSE AFFILIATION NO. 630198"
                      />
                      <input
                        type="text"
                        value={page.customStyles?.storyHeadline || "Welcome to Academic Curriculum"}
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                          })
                        }
                        className="w-full text-center text-2xl sm:text-4xl font-extrabold text-school-primary dark:text-white bg-transparent focus:outline-none font-heading"
                        placeholder="Welcome to Academic Curriculum"
                      />
                      <textarea
                        rows={3}
                        value={
                          page.customStyles?.mainStory ||
                          "Integrated CBSE & Cambridge framework. Cambridge International School Mandi fosters an engaging, safe, and academically rigorous environment where every learner thrives."
                        }
                        onChange={(e) =>
                          onChange({
                            ...page,
                            customStyles: { ...page.customStyles, mainStory: e.target.value },
                          })
                        }
                        className="w-full text-center text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-transparent focus:outline-none resize-none"
                        placeholder="Academic curriculum introduction narrative..."
                      />
                    </div>

                    {/* 4 Wings Cards (2x2 Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Wing 1: Pre-Primary */}
                      <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group/wing hover:border-amber-400/60 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <input
                          type="text"
                          value={page.customStyles?.wing1Badge || "NURSERY - UKG"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing1Badge: e.target.value },
                            })
                          }
                          className="w-full text-xs font-semibold text-school-secondary dark:text-amber-400 uppercase tracking-wider bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.wing1Title || "Pre-Primary (Early Years)"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing1Title: e.target.value },
                            })
                          }
                          className="w-full text-xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={
                            page.customStyles?.wing1Desc ||
                            "Montessori-inspired play and sensory discovery for Nursery to UKG."
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing1Desc: e.target.value },
                            })
                          }
                          className="w-full text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-transparent focus:outline-none resize-none"
                        />
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-school-secondary dark:text-amber-400">
                          <span>Explore Pre-Primary (Early Years) Wing →</span>
                          <span className="text-[10px] text-slate-400 font-normal">(/academics/pre-primary)</span>
                        </div>
                      </div>

                      {/* Wing 2: Primary */}
                      <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group/wing hover:border-blue-400/60 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <input
                          type="text"
                          value={page.customStyles?.wing2Badge || "GRADES 1-5"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing2Badge: e.target.value },
                            })
                          }
                          className="w-full text-xs font-semibold text-school-secondary dark:text-blue-400 uppercase tracking-wider bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.wing2Title || "Primary Wing (Grades 1-5)"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing2Title: e.target.value },
                            })
                          }
                          className="w-full text-xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={
                            page.customStyles?.wing2Desc ||
                            "Foundational conceptual mastery in numeracy, languages, and sciences."
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing2Desc: e.target.value },
                            })
                          }
                          className="w-full text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-transparent focus:outline-none resize-none"
                        />
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-school-secondary dark:text-blue-400">
                          <span>Explore Primary Wing (Grades 1-5) Wing →</span>
                          <span className="text-[10px] text-slate-400 font-normal">(/academics/primary)</span>
                        </div>
                      </div>

                      {/* Wing 3: Middle School */}
                      <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group/wing hover:border-emerald-400/60 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <input
                          type="text"
                          value={page.customStyles?.wing3Badge || "GRADES 6-8"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing3Badge: e.target.value },
                            })
                          }
                          className="w-full text-xs font-semibold text-school-secondary dark:text-emerald-400 uppercase tracking-wider bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.wing3Title || "Middle School (Grades 6-8)"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing3Title: e.target.value },
                            })
                          }
                          className="w-full text-xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={
                            page.customStyles?.wing3Desc ||
                            "STEM innovation, analytical reasoning, and interdisciplinary projects."
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing3Desc: e.target.value },
                            })
                          }
                          className="w-full text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-transparent focus:outline-none resize-none"
                        />
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-school-secondary dark:text-emerald-400">
                          <span>Explore Middle School (Grades 6-8) Wing →</span>
                          <span className="text-[10px] text-slate-400 font-normal">(/academics/middle-school)</span>
                        </div>
                      </div>

                      {/* Wing 4: Senior Secondary */}
                      <div className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 relative group/wing hover:border-purple-400/60 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <input
                          type="text"
                          value={page.customStyles?.wing4Badge || "GRADES 9-12"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing4Badge: e.target.value },
                            })
                          }
                          className="w-full text-xs font-semibold text-school-secondary dark:text-purple-400 uppercase tracking-wider bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.wing4Title || "Senior Secondary (Grades 9-12)"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing4Title: e.target.value },
                            })
                          }
                          className="w-full text-xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={
                            page.customStyles?.wing4Desc ||
                            "Rigorous board preparation in Medical, Non-Med, Commerce, and Humanities."
                          }
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, wing4Desc: e.target.value },
                            })
                          }
                          className="w-full text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-transparent focus:outline-none resize-none"
                        />
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-school-secondary dark:text-purple-400">
                          <span>Explore Senior Secondary (Grades 9-12) Wing →</span>
                          <span className="text-[10px] text-slate-400 font-normal">(/academics/senior-secondary)</span>
                        </div>
                      </div>
                    </div>

                    {/* Pedagogical Edge / Stream Differentiators */}
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 space-y-8">
                      <div className="max-w-2xl space-y-1">
                        <input
                          type="text"
                          value={page.customStyles?.pedagogyBadge || "Pedagogical Edge"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, pedagogyBadge: e.target.value },
                            })
                          }
                          className="text-xs font-bold text-amber-500 uppercase tracking-wider bg-transparent focus:outline-none"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.pedagogyTitle || "Integrated Competitive Exam Coaching & Research Focus"}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, pedagogyTitle: e.target.value },
                            })
                          }
                          className="w-full text-2xl font-bold text-school-primary dark:text-white bg-transparent focus:outline-none font-heading"
                        />
                        <input
                          type="text"
                          value={page.customStyles?.pedagogySubtitle || "Tailored preparation seamlessly embedded within the regular school timetable."}
                          onChange={(e) =>
                            onChange({
                              ...page,
                              customStyles: { ...page.customStyles, pedagogySubtitle: e.target.value },
                            })
                          }
                          className="w-full text-xs text-slate-500 bg-transparent focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                          <FlaskConical className="w-6 h-6 text-school-secondary" />
                          <h4 className="font-bold text-sm text-school-primary dark:text-white">JEE & NEET Prep</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Dedicated coaching module for Classes 11 & 12 led by IIT & AIIMS alumni mentors.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                          <Cpu className="w-6 h-6 text-amber-500" />
                          <h4 className="font-bold text-sm text-school-primary dark:text-white">Olympiads & STEM</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Rigorous training for NTSE, KVPY, and International Science Olympiad medals.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                          <Award className="w-6 h-6 text-emerald-500" />
                          <h4 className="font-bold text-sm text-school-primary dark:text-white">Cambridge Inquiry</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Research paper presentations, critical debate, and project-based evaluation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 12. FACILITIES HUB: 10-ACRE CAMPUS 3D MAP & INFRASTRUCTURE */}
                {/* ========================================================================= */}
                {isFacilitiesHubPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "facilities_studio" });
                      setActiveInspectorTab("facilities_studio");
                    }}
                    className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-16 space-y-16 bg-white dark:bg-slate-950"
                  >
                    {/* Interactive 3D Map Component matching live /facilities */}
                    <Campus3DViewer customStyles={page.customStyles} />

                    {/* Facilities 8-Card Grid matching live /facilities */}
                    <div className="space-y-8">
                      <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-school-primary dark:text-white font-heading">
                          Explore Our Campus Wings
                        </h3>
                        <p className="text-xs text-slate-500">
                          Click any facility below to inspect detailed specifications, photos, and safety protocols.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          {
                            title: "Smart Classrooms",
                            desc: "4K interactive touch panels, digital podiums, and air-conditioned acoustically treated learning spaces.",
                            link: "/facilities/smart-classrooms",
                            icon: Monitor,
                            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600",
                          },
                          {
                            title: "Science & AI Laboratories",
                            desc: "Ultra-modern Physics, Chemistry, Biology, and Biotechnology experimentation suites.",
                            link: "/facilities/science-labs",
                            icon: FlaskConical,
                            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600",
                          },
                          {
                            title: "STEM & Robotics Innovation Lab",
                            desc: "Equipped with 3D printers, IoT hardware, Arduino & Raspberry Pi rigs, and drone bays.",
                            link: "/facilities/robotics-lab",
                            icon: Cpu,
                            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600",
                          },
                          {
                            title: "Computer & Coding Labs",
                            desc: "High-speed optical fiber AI computing workstations, Python coding terminals, and cyber safety.",
                            link: "/facilities/computer-labs",
                            icon: Monitor,
                            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
                          },
                          {
                            title: "Central Digital Library",
                            desc: "Over 25,000 physical titles, kindle e-reading stations, and international research periodicals.",
                            link: "/facilities/library",
                            icon: BookOpen,
                            image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=600",
                          },
                          {
                            title: "Olympic Sports Complex",
                            desc: "Semi-Olympic heated pool, FIFA standard turf, synthetic tennis & basketball courts, and badminton hall.",
                            link: "/facilities/sports-complex",
                            icon: Trophy,
                            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
                          },
                          {
                            title: "Himalayan Residential Hostel",
                            desc: "Comfortable temperature-controlled dorms, 24x7 resident wardens, and hygienic dining.",
                            link: "/facilities/hostel",
                            icon: HomeIcon,
                            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600",
                          },
                          {
                            title: "GPS-Monitored Bus Transport",
                            desc: "Modern bus fleet with CCTV surveillance, speed governors, and live parent mobile tracking app.",
                            link: "/facilities/transport",
                            icon: Bus,
                            image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600",
                          },
                        ].map((fac, idx) => {
                          const Icon = fac.icon;
                          return (
                            <div
                              key={idx}
                              className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
                            >
                              <div className="relative h-44 overflow-hidden">
                                <img
                                  src={fac.image}
                                  alt={fac.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-school-primary/80 via-transparent to-transparent flex items-end p-3.5">
                                  <div className="flex items-center space-x-2 text-white">
                                    <Icon className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-bold">{fac.title}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {fac.desc}
                                </p>
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-school-secondary flex items-center justify-between">
                                  <span>View Specifications</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 13. STUDENT LIFE HUB: 4 HOUSES & 6 STUDENT CLUBS */}
                {/* ========================================================================= */}
                {isStudentLifePage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "student_life_studio" });
                      setActiveInspectorTab("student_life_studio");
                    }}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950"
                  >
                    {/* 4 School Houses */}
                    <div className="space-y-6">
                      <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Camaraderie & Healthy Competition</span>
                        <h3 className="text-2xl font-bold text-school-primary dark:text-white">The Four School Houses</h3>
                        <p className="text-xs text-slate-500">
                          Every student belongs to one of four houses, competing annually for the prestigious Cock House Championship Trophy.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          { name: "Himalaya House (Blue)", color: "from-blue-600 to-indigo-700", motto: "Fortitude & Grandeur" },
                          { name: "Shivalik House (Green)", color: "from-emerald-600 to-teal-700", motto: "Growth & Harmony" },
                          { name: "Beas House (Red)", color: "from-rose-600 to-red-700", motto: "Passion & Energy" },
                          { name: "Pir Panjal House (Yellow)", color: "from-amber-500 to-orange-600", motto: "Wisdom & Radiance" },
                        ].map((h, hIdx) => (
                          <div key={hIdx} className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-lg">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${h.color} text-white flex items-center justify-center mx-auto shadow-md`}>
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-base text-school-primary dark:text-white">{h.name}</h4>
                            <p className="text-xs text-slate-500 italic">"{h.motto}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 6 Co-Curricular Student Clubs */}
                    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">Enrichment Beyond Academics</span>
                        <h3 className="text-2xl font-bold text-school-primary dark:text-white">Active Student Clubs & Societies</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studentClubsList.map((club, cIdx) => (
                          <div key={cIdx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 group/club relative">
                            <button
                              type="button"
                              onClick={() => deleteStudentClub(cIdx)}
                              className="absolute top-4 right-4 opacity-0 group-hover/club:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                              title="Delete club"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              <input
                                type="text"
                                value={club.title}
                                onChange={(e) => updateStudentClub(cIdx, { title: e.target.value })}
                                className="font-bold text-sm text-school-primary dark:text-white bg-transparent focus:outline-none w-full"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={club.desc}
                              onChange={(e) => updateStudentClub(cIdx, { desc: e.target.value })}
                              className="w-full text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-transparent focus:outline-none resize-none pl-6"
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addStudentClub}
                        className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Student Club</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 14. RESULTS PAGE: 4 METRICS STRIP & CBSE TOPPERS */}
                {/* ========================================================================= */}
                {isResultsPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "results_studio" });
                      setActiveInspectorTab("results_studio");
                    }}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950"
                  >
                    {/* 4 Metric Strips */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { num: "100%", label: "CBSE Board Pass Rate", desc: "Consecutive 100% pass in Class X & XII" },
                        { num: "86.4%", label: "Aggregate School Average", desc: "Batch aggregate across all streams" },
                        { num: "42", label: "Students > 95% Distinctions", desc: "Scoring exceptional distinctions" },
                        { num: "0", label: "Compartments & Failures", desc: "Exemplary remedial & mentor support" },
                      ].map((m, mIdx) => (
                        <div key={mIdx} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                          <span className="text-3xl font-black text-amber-500 font-heading block">{m.num}</span>
                          <span className="text-xs text-slate-400 font-semibold block">{m.label}</span>
                          <span className="text-[10px] text-slate-500 block">{m.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* 4 Stellar Board Toppers */}
                    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-center max-w-2xl mx-auto">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                          CBSE Class X & XII Stars
                        </span>
                        <h2 className="text-3xl font-extrabold text-school-primary dark:text-white mt-1">
                          Our Stellar Board Toppers
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resultsToppersList.map((t, idx) => (
                          <div
                            key={idx}
                            className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-3 group/topper relative"
                          >
                            <button
                              type="button"
                              onClick={() => deleteResultTopper(idx)}
                              className="absolute top-3 right-3 opacity-0 group-hover/topper:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                              title="Delete topper"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-amber-400 shadow-md group/photo">
                              <img
                                src={t.photo}
                                alt={t.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveImageTarget({ type: "topper", topperIdx: idx });
                                    fileInputRef.current?.click();
                                  }}
                                  className="p-1 bg-amber-400 text-slate-950 rounded text-[10px] font-bold"
                                  title="Upload"
                                >
                                  <Upload className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowUrlModal({
                                      type: "topper",
                                      topperIdx: idx,
                                      currentUrl: t.photo || "",
                                    })
                                  }
                                  className="p-1 bg-slate-800 text-white rounded text-[10px] font-bold"
                                  title="URL"
                                >
                                  URL
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={t.score}
                                onChange={(e) => updateResultTopper(idx, { score: e.target.value })}
                                className="text-2xl font-black text-school-secondary dark:text-amber-400 text-center bg-transparent focus:outline-none w-full font-heading"
                              />
                              <input
                                type="text"
                                value={t.name}
                                onChange={(e) => updateResultTopper(idx, { name: e.target.value })}
                                className="font-bold text-base text-school-primary dark:text-white text-center bg-transparent focus:outline-none w-full"
                              />
                              <input
                                type="text"
                                value={t.stream}
                                onChange={(e) => updateResultTopper(idx, { stream: e.target.value })}
                                className="text-xs text-slate-500 text-center bg-transparent focus:outline-none w-full"
                              />
                              <input
                                type="text"
                                value={t.rank}
                                onChange={(e) => updateResultTopper(idx, { rank: e.target.value })}
                                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 text-center bg-transparent focus:outline-none w-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={addResultTopper}
                        className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Board Topper Card</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 15. CONTACT PAGE: FULL SETTINGS-LINKED EDITOR */}
                {/* ========================================================================= */}
                {isContactPage && (
                  <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8 bg-white dark:bg-slate-950">

                    {/* Info Banner → Settings */}
                    <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-2xl">
                      <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Contact info is managed in Admin → Settings</p>
                        <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-0.5">Address, phone, email, WhatsApp, map coordinates and office hours are all editable in the Site Settings panel. Changes save instantly to the live Contact page.</p>
                        <a href="/admin/settings" target="_blank" className="inline-flex items-center space-x-1 mt-2 text-[11px] font-bold text-amber-700 dark:text-amber-400 underline underline-offset-2 cursor-pointer">
                          <Settings className="w-3 h-3" />
                          <span>Open Admin Settings →</span>
                        </a>
                      </div>
                    </div>

                    {/* 4 Live Info Cards */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contact Directory Cards (live from Settings)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card p-4 rounded-2xl border border-amber-300 dark:border-amber-800 space-y-2">
                          <MapPin className="w-5 h-5 text-amber-500" />
                          <h4 className="font-bold text-xs text-school-primary dark:text-white">Campus Address</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">Edit in Settings → <span className="font-bold">school_address</span></p>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-blue-300 dark:border-blue-800 space-y-2">
                          <Phone className="w-5 h-5 text-blue-500" />
                          <h4 className="font-bold text-xs text-school-primary dark:text-white">Phone Numbers</h4>
                          <p className="text-[11px] text-slate-400">Edit in Settings → <span className="font-bold">contact_phone</span></p>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-2">
                          <Mail className="w-5 h-5 text-emerald-500" />
                          <h4 className="font-bold text-xs text-school-primary dark:text-white">Official Email</h4>
                          <p className="text-[11px] text-slate-400">Edit in Settings → <span className="font-bold">contact_email</span></p>
                        </div>
                        <div className="glass-card p-4 rounded-2xl border border-purple-300 dark:border-purple-800 space-y-2">
                          <Clock className="w-5 h-5 text-purple-500" />
                          <h4 className="font-bold text-xs text-school-primary dark:text-white">Office Hours</h4>
                          <p className="text-[11px] text-slate-400">Edit in Settings → <span className="font-bold">footer_hours</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Page Header Editing */}
                    <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Header (editable here)</p>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Badge</label>
                          <input type="text" value={page.heroBadge || "Connect With Us"} onChange={(e) => onChange({ ...page, heroBadge: e.target.value })} className="w-full text-sm font-bold text-school-primary dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400" placeholder="Hero badge text..." />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Title</label>
                          <input type="text" value={page.heroTitle || "Contact Cambridge Mandi & Visit Us"} onChange={(e) => onChange({ ...page, heroTitle: e.target.value })} className="w-full text-sm font-bold text-school-primary dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400" placeholder="Page title..." />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Hero Subtitle</label>
                          <textarea rows={2} value={page.heroSubtitle || "We welcome prospective parents, students, and visitors."} onChange={(e) => onChange({ ...page, heroSubtitle: e.target.value })} className="w-full text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400 resize-none" placeholder="Page subtitle..." />
                        </div>
                      </div>
                    </div>

                    {/* Map & Form Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2 border-t border-slate-200 dark:border-slate-800">
                      {/* Form Preview */}
                      <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 opacity-60 pointer-events-none">
                        <h3 className="text-lg font-bold text-school-primary dark:text-white">Send an Online Inquiry</h3>
                        <p className="text-[11px] text-slate-400 italic">Live inquiry form — accepts real submissions from visitors. Fields managed by form logic.</p>
                        <div className="grid grid-cols-2 gap-3">
                          {["Your Name", "Phone Number", "Email Address", "Subject"].map((label) => (
                            <div key={label} className="space-y-1">
                              <label className="text-[10px] font-semibold text-slate-500">{label}</label>
                              <div className="h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
                            </div>
                          ))}
                          <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-semibold text-slate-500">Message</label>
                            <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
                          </div>
                        </div>
                        <div className="h-9 w-40 rounded-xl bg-school-secondary/30" />
                      </div>
                      {/* Map Preview */}
                      <div className="lg:col-span-5 space-y-3">
                        <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                          <div>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Campus Map</span>
                            <h4 className="text-sm font-bold text-school-primary dark:text-white mt-0.5">Interactive Google Map</h4>
                            <p className="text-[11px] text-slate-400 mt-1">Map coordinates, embed URL, and place URL are set in <span className="font-bold">Admin → Settings → Map Configuration</span>.</p>
                          </div>
                          <div className="w-full h-36 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                            <div className="text-center space-y-1">
                              <MapPin className="w-6 h-6 text-amber-400 mx-auto" />
                              <p className="text-[10px] text-slate-400">Live map loaded from Settings</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* ========================================================================= */}
                {/* 16. APPLY ONLINE REGISTRATION: EXACT MULTI-STEP ADMISSION FORM */}
                {/* ========================================================================= */}
                {/* ========================================================================= */}
                {/* 16A. ACHIEVEMENTS & HALL OF FAME CANVAS */}
                {/* ========================================================================= */}
                {isAchievementsPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "achievements_studio" });
                      setActiveInspectorTab("achievements_studio");
                    }}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950"
                  >
                    {/* Top 3 Stats Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { num: page.customStyles?.stats?.[0]?.number || "50+", label: page.customStyles?.stats?.[0]?.label || "National Medals" },
                        { num: page.customStyles?.stats?.[1]?.number || "100%", label: page.customStyles?.stats?.[1]?.label || "Board Success" },
                        { num: page.customStyles?.stats?.[2]?.number || "#1", label: page.customStyles?.stats?.[2]?.label || "District School Rank" },
                      ].map((s, sIdx) => (
                        <div key={sIdx} className="glass-card p-6 rounded-2xl border border-amber-300 dark:border-amber-900/50 text-center space-y-1">
                          <span className="text-3xl font-black text-amber-500 font-heading block">{s.num}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">{s.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Section Header & Add Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Hall of Fame</span>
                        <h2 className="text-2xl font-extrabold text-school-primary dark:text-white mt-0.5">Student Laurels & Triumphs</h2>
                        <p className="text-xs text-slate-500 mt-1">Click any text or photo to edit in-line. Changes publish directly to the live Achievements page.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addAchievement}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800 cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Achievement Card</span>
                      </button>
                    </div>

                    {/* Achievements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {achievementsList.map((ach, idx) => (
                        <div
                          key={ach.id || idx}
                          className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl group relative flex flex-col justify-between hover:border-amber-400/60 transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => deleteAchievement(idx)}
                            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-slate-900/80 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                            title="Delete card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Image with upload buttons */}
                          <div className="relative h-52 overflow-hidden bg-slate-800 group/img">
                            <img
                              src={ach.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"}
                              alt={ach.studentName}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => triggerImageUpload("achievement", undefined, undefined, undefined, undefined, idx)}
                                className="px-2.5 py-1.5 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowUrlModal({
                                    type: "achievement",
                                    achievementIdx: idx,
                                    currentUrl: ach.photoUrl || "",
                                  })
                                }
                                className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                URL
                              </button>
                            </div>
                            <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                              <input
                                type="text"
                                value={ach.category}
                                onChange={(e) => updateAchievement(idx, { category: e.target.value })}
                                placeholder="Category..."
                                className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider focus:outline-none w-24 text-center"
                              />
                              <input
                                type="text"
                                value={ach.year}
                                onChange={(e) => updateAchievement(idx, { year: e.target.value })}
                                placeholder="Year..."
                                className="bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full focus:outline-none w-20 text-center"
                              />
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <input
                                  type="text"
                                  value={ach.grade}
                                  onChange={(e) => updateAchievement(idx, { grade: e.target.value })}
                                  placeholder="Grade / Class..."
                                  className="text-xs font-semibold text-school-secondary dark:text-amber-400 bg-transparent focus:outline-none flex-1"
                                />
                                <input
                                  type="text"
                                  value={ach.rank}
                                  onChange={(e) => updateAchievement(idx, { rank: e.target.value })}
                                  placeholder="Rank / Laurel..."
                                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full focus:outline-none text-right"
                                />
                              </div>
                              <input
                                type="text"
                                value={ach.studentName}
                                onChange={(e) => updateAchievement(idx, { studentName: e.target.value })}
                                placeholder="Student Full Name..."
                                className="w-full text-base font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                              />
                              <input
                                type="text"
                                value={ach.title}
                                onChange={(e) => updateAchievement(idx, { title: e.target.value })}
                                placeholder="Laurel / Competition Title..."
                                className="w-full text-xs font-semibold text-slate-500 dark:text-slate-400 bg-transparent focus:outline-none"
                              />
                              <textarea
                                rows={3}
                                value={ach.description}
                                onChange={(e) => updateAchievement(idx, { description: e.target.value })}
                                placeholder="Achievement description and details..."
                                className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-transparent focus:outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Story Narrative Footer */}
                    <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
                      <input
                        type="text"
                        value={page.customStyles?.storyHeadline || "A Culture of Striving for the Summit"}
                        onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, storyHeadline: e.target.value } })}
                        placeholder="Story Headline..."
                        className="w-full font-bold text-lg text-school-primary dark:text-white bg-transparent focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={page.customStyles?.mainStory || "Our students' achievements reflect the tireless dedication of our mentors and the world-class training infrastructure at CIS Mandi."}
                        onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, mainStory: e.target.value } })}
                        placeholder="Main achievements narrative story..."
                        className="w-full text-sm text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 16B. PHOTO & VIDEO GALLERY CANVAS */}
                {/* ========================================================================= */}
                {isGalleryPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "gallery_studio" });
                      setActiveInspectorTab("gallery_studio");
                    }}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950"
                  >
                    {/* Media Gallery Info Banner */}
                    <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-800 rounded-2xl">
                      <ImageIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-purple-800 dark:text-purple-300">High-Resolution Album Manager & Video Archives</p>
                        <p className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">Featured albums below are displayed on the public Gallery page. For bulk HD image uploads, multi-photo albums, and YouTube event videos, use the Dedicated Media Gallery.</p>
                        <a href="/admin/gallery" target="_blank" className="inline-flex items-center space-x-1 mt-2 text-[11px] font-bold text-purple-700 dark:text-purple-300 underline underline-offset-2 cursor-pointer">
                          <ExternalLink className="w-3 h-3" />
                          <span>Open Dedicated Media Gallery Panel →</span>
                        </a>
                      </div>
                    </div>

                    {/* Gallery Stats Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { num: page.customStyles?.stats?.[0]?.number || "1000+", label: page.customStyles?.stats?.[0]?.label || "Curated Photos" },
                        { num: page.customStyles?.stats?.[1]?.number || "50+", label: page.customStyles?.stats?.[1]?.label || "Video Highlights" },
                        { num: page.customStyles?.stats?.[2]?.number || "Ultra HD", label: page.customStyles?.stats?.[2]?.label || "4K Media Quality" },
                      ].map((s, sIdx) => (
                        <div key={sIdx} className="glass-card p-6 rounded-2xl border border-purple-200 dark:border-purple-900/50 text-center space-y-1">
                          <span className="text-3xl font-black text-purple-500 font-heading block">{s.num}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">{s.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Section Header & Add Album Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Visual Archives</span>
                        <h2 className="text-2xl font-extrabold text-school-primary dark:text-white mt-0.5">Featured Campus Albums</h2>
                        <p className="text-xs text-slate-500 mt-1">Edit album titles, cover photos, categories, and descriptions.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addGalleryAlbum}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Featured Album</span>
                      </button>
                    </div>

                    {/* Albums Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {galleryAlbumsList.map((alb, idx) => (
                        <div
                          key={alb.id || idx}
                          className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl group relative flex flex-col justify-between hover:border-purple-400/60 transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => deleteGalleryAlbum(idx)}
                            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-slate-900/80 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                            title="Delete album"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Cover Photo */}
                          <div className="relative h-52 overflow-hidden bg-slate-800 group/img">
                            <img
                              src={alb.coverImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"}
                              alt={alb.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => triggerImageUpload("album", undefined, undefined, undefined, undefined, undefined, idx)}
                                className="px-2.5 py-1.5 bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowUrlModal({
                                    type: "album",
                                    albumIdx: idx,
                                    currentUrl: alb.coverImage || "",
                                  })
                                }
                                className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                URL
                              </button>
                            </div>
                            <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                              <input
                                type="text"
                                value={alb.category}
                                onChange={(e) => updateGalleryAlbum(idx, { category: e.target.value })}
                                placeholder="Category..."
                                className="bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider focus:outline-none w-28 text-center"
                              />
                              <input
                                type="text"
                                value={alb.photoCount || "25 Photos"}
                                onChange={(e) => updateGalleryAlbum(idx, { photoCount: e.target.value })}
                                placeholder="Count..."
                                className="bg-slate-900/80 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-full focus:outline-none w-20 text-center"
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                            <input
                              type="text"
                              value={alb.title}
                              onChange={(e) => updateGalleryAlbum(idx, { title: e.target.value })}
                              placeholder="Album Title..."
                              className="w-full text-base font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                            />
                            <textarea
                              rows={3}
                              value={alb.description}
                              onChange={(e) => updateGalleryAlbum(idx, { description: e.target.value })}
                              placeholder="Album description and highlights..."
                              className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-transparent focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Story Narrative Footer */}
                    <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
                      <input
                        type="text"
                        value={page.customStyles?.storyHeadline || "Preserving Cherished Memories & Milestones"}
                        onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, storyHeadline: e.target.value } })}
                        placeholder="Story Headline..."
                        className="w-full font-bold text-lg text-school-primary dark:text-white bg-transparent focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={page.customStyles?.mainStory || "Every moment at Cambridge Mandi tells a story of discovery, friendship, and joy. Browse through our visual archives to experience the vibrant life of our student community."}
                        onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, mainStory: e.target.value } })}
                        placeholder="Main gallery narrative story..."
                        className="w-full text-sm text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 16C. 360° VIRTUAL CAMPUS TOUR CANVAS */}
                {/* ========================================================================= */}
                {isVirtualTourPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "virtual_tour_studio" });
                      setActiveInspectorTab("virtual_tour_studio");
                    }}
                    className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white dark:bg-slate-950"
                  >
                    {/* Header & Add Tour Point Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">360° Interactive Experience</span>
                        <h2 className="text-2xl font-extrabold text-school-primary dark:text-white mt-0.5">Virtual Campus Tour Stops</h2>
                        <p className="text-xs text-slate-500 mt-1">Configure panoramic photo stops, 360° vantage points, and descriptive highlights.</p>
                      </div>
                      <button
                        type="button"
                        onClick={addTourPoint}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Tour Stop Location</span>
                      </button>
                    </div>

                    {/* Stops Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {tourPointsList.map((tp, idx) => (
                        <div
                          key={tp.id || idx}
                          className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl group relative flex flex-col justify-between hover:border-blue-400/60 transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => deleteTourPoint(idx)}
                            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-slate-900/80 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                            title="Delete tour stop"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Panorama View Photo */}
                          <div className="relative h-60 overflow-hidden bg-slate-800 group/img">
                            <img
                              src={tp.image || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400"}
                              alt={tp.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => triggerImageUpload("tour", undefined, undefined, undefined, undefined, undefined, undefined, idx)}
                                className="px-2.5 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Panorama</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowUrlModal({
                                    type: "tour",
                                    tourIdx: idx,
                                    currentUrl: tp.image || "",
                                  })
                                }
                                className="px-2.5 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                URL
                              </button>
                            </div>
                            <div className="absolute top-3 left-3">
                              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] font-bold">
                                <Compass className="w-3 h-3" />
                                <span>Stop #{idx + 1}</span>
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <input
                                type="text"
                                value={tp.category}
                                onChange={(e) => updateTourPoint(idx, { category: e.target.value })}
                                placeholder="Category..."
                                className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider focus:outline-none w-32 text-center"
                              />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6 space-y-3">
                            <input
                              type="text"
                              value={tp.name}
                              onChange={(e) => updateTourPoint(idx, { name: e.target.value })}
                              placeholder="Tour Stop Location Name..."
                              className="w-full text-base font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                            />
                            <textarea
                              rows={3}
                              value={tp.description}
                              onChange={(e) => updateTourPoint(idx, { description: e.target.value })}
                              placeholder="Describe this campus location and what parents/students experience..."
                              className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-transparent focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Story Narrative Footer */}
                    <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
                      <input
                        type="text"
                        value={page.customStyles?.storyHeadline || "Visit Our Himalayan Sanctuary Online or in Person"}
                        onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, storyHeadline: e.target.value } })}
                        placeholder="Story Headline..."
                        className="w-full font-bold text-lg text-school-primary dark:text-white bg-transparent focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={page.customStyles?.mainStory || "We invite families to explore our world-class learning spaces online. You can also schedule an individualized campus tour with our admissions team on any working day."}
                        onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, mainStory: e.target.value } })}
                        placeholder="Main virtual tour narrative story..."
                        className="w-full text-sm text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 16D. APPLY ONLINE REGISTRATION: FULL RICH EDITOR & DYNAMIC FORM */}
                {/* ========================================================================= */}
                {isApplyPage && (
                  <div
                    onClick={() => {
                      setSelectedBlock({ type: "apply_studio" });
                      setActiveInspectorTab("apply_studio");
                    }}
                    className="w-full max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 bg-white dark:bg-[#071326]"
                  >
                    {/* Top Session Banner */}
                    <div className="glass-card p-6 rounded-3xl border border-amber-300 dark:border-amber-800 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Registration Portal</span>
                          <h3 className="text-xl font-bold text-school-primary dark:text-white">
                            <input
                              type="text"
                              value={page.customStyles?.sessionYear || "Admissions Open for Academic Session 2027–2028"}
                              onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, sessionYear: e.target.value } })}
                              className="w-full bg-transparent focus:outline-none text-school-primary dark:text-white font-bold"
                              placeholder="Academic Session..."
                            />
                          </h3>
                        </div>
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black self-start">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Direct Online Application</span>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={page.customStyles?.applyGuidelines || "Welcome to the official online admission registration portal of Cambridge International School, Mandi. Please review eligibility criteria and keep scanned documents ready before proceeding."}
                        onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, applyGuidelines: e.target.value } })}
                        placeholder="Registration guidelines description..."
                        className="w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-transparent focus:outline-none resize-none"
                      />
                      <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          <span>Helpline:</span>
                          <input
                            type="text"
                            value={page.customStyles?.applyHelpline || "+91 1905 243366 / +91 8580579409"}
                            onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, applyHelpline: e.target.value } })}
                            className="font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                            placeholder="Phone number..."
                          />
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Email:</span>
                          <input
                            type="text"
                            value={page.customStyles?.applyEmail || "admissions@cismandi.org"}
                            onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, applyEmail: e.target.value } })}
                            className="font-bold text-school-primary dark:text-white bg-transparent focus:outline-none"
                            placeholder="Email address..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4 Multi-Step Process Preview */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Multi-Step Registration Workflow</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { step: "01", title: "Student Particulars", desc: "Name, DOB, gender & Grade applying for" },
                          { step: "02", title: "Parent / Guardian", desc: "Occupations, contact details & address" },
                          { step: "03", title: "Academic History", desc: "Previous school, marksheet & TC status" },
                          { step: "04", title: "Document Upload", desc: "Birth certificate, photos & fee payment" },
                        ].map((st, sIdx) => (
                          <div key={sIdx} className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                            <span className="text-xs font-black text-amber-500">{st.step}</span>
                            <h4 className="text-xs font-bold text-school-primary dark:text-white">{st.title}</h4>
                            <p className="text-[11px] text-slate-500">{st.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Documents Checklist Editor */}
                    <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-school-primary dark:text-white">Documents to Keep Ready (Editable)</h4>
                          <p className="text-[11px] text-slate-400">Parents should have these scanned copies ready before submitting the form.</p>
                        </div>
                        <button
                          type="button"
                          onClick={addApplyDoc}
                          className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Document</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {applyDocsList.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group/doc">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <input
                              type="text"
                              value={doc}
                              onChange={(e) => updateApplyDoc(dIdx, e.target.value)}
                              className="w-full text-xs text-slate-700 dark:text-slate-300 bg-transparent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => deleteApplyDoc(dIdx)}
                              className="opacity-0 group-hover/doc:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Form Preview with Link */}
                    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Live Dynamic Form Preview</span>
                          <h4 className="text-base font-bold text-school-primary dark:text-white">Interactive Student Application Form</h4>
                        </div>
                        <a
                          href="/admin/forms"
                          target="_blank"
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-xl border border-slate-700"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>Customize Form Schema in Form Builder →</span>
                        </a>
                      </div>
                      <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                        <DynamicFormRenderer formSlug="admissions-apply" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 17. NEWS & CIRCULARS CANVAS */}
                {/* ========================================================================= */}
                {isNewsPage && (
                  <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8 bg-white dark:bg-slate-950">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-school-secondary uppercase tracking-wider">Official Bulletins</span>
                        <h2 className="text-2xl font-extrabold text-school-primary dark:text-white">News, Notices & Circulars</h2>
                      </div>
                      <button type="button" onClick={addNewsItem} className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800 cursor-pointer hover:bg-amber-100 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Circular / Notice</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {newsItemsList.map((item, idx) => (
                        <div key={item.id} className="group relative glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-amber-400/60 transition-all">
                          <button type="button" onClick={() => deleteNewsItem(idx)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer transition-opacity" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center space-x-3 flex-wrap gap-2">
                            <input type="text" value={item.badge} onChange={(e) => updateNewsItem(idx, { badge: e.target.value })} className="px-2.5 py-1 bg-amber-400/20 text-amber-600 dark:text-amber-400 text-[11px] font-bold rounded-full focus:outline-none w-28" placeholder="Badge..." />
                            <input type="text" value={item.date} onChange={(e) => updateNewsItem(idx, { date: e.target.value })} className="text-xs text-slate-400 bg-transparent focus:outline-none border-b border-dashed border-slate-400 w-28" placeholder="Date..." />
                          </div>
                          <input type="text" value={item.title} onChange={(e) => updateNewsItem(idx, { title: e.target.value })} className="w-full font-bold text-base text-school-primary dark:text-white bg-transparent focus:outline-none" placeholder="Notice / Circular Title..." />
                          <textarea rows={2} value={item.summary} onChange={(e) => updateNewsItem(idx, { summary: e.target.value })} className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed" placeholder="Enter summary or description..." />
                          <input type="text" value={item.link} onChange={(e) => updateNewsItem(idx, { link: e.target.value })} className="text-xs text-blue-500 bg-transparent focus:outline-none border-b border-dashed border-blue-400 w-full" placeholder="Link URL (or # for no link)..." />
                        </div>
                      ))}
                    </div>
                    {newsItemsList.length === 0 && (
                      <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-slate-400 text-sm mb-3">No circulars added yet</p>
                        <button type="button" onClick={addNewsItem} className="text-xs font-bold text-amber-500 cursor-pointer">+ Add First Circular</button>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 18. EVENTS CALENDAR CANVAS */}
                {/* ========================================================================= */}
                {isEventsPage && (
                  <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8 bg-white dark:bg-slate-950">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Academic Calendar</span>
                        <h2 className="text-2xl font-extrabold text-school-primary dark:text-white">Upcoming School Events</h2>
                      </div>
                      <button type="button" onClick={addEvent} className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold border border-purple-200 dark:border-purple-800 cursor-pointer hover:bg-purple-100 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Event</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {eventsList.map((ev, idx) => (
                        <div key={ev.id} className="group relative glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex space-x-5 hover:border-purple-400/60 transition-all">
                          <button type="button" onClick={() => deleteEvent(idx)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer transition-opacity" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-600 text-white flex flex-col items-center justify-center shadow-lg">
                            <input type="text" value={ev.date} onChange={(e) => updateEvent(idx, { date: e.target.value })} className="text-xl font-black bg-transparent focus:outline-none text-center w-full" placeholder="DD" />
                            <input type="text" value={ev.month} onChange={(e) => updateEvent(idx, { month: e.target.value })} className="text-[10px] font-semibold uppercase bg-transparent focus:outline-none text-center w-full opacity-80" placeholder="Mon" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <input type="text" value={ev.badge} onChange={(e) => updateEvent(idx, { badge: e.target.value })} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-full focus:outline-none w-24" placeholder="Category..." />
                            <input type="text" value={ev.title} onChange={(e) => updateEvent(idx, { title: e.target.value })} className="w-full font-bold text-sm text-school-primary dark:text-white bg-transparent focus:outline-none block" placeholder="Event Title..." />
                            <textarea rows={2} value={ev.description} onChange={(e) => updateEvent(idx, { description: e.target.value })} className="w-full text-xs text-slate-500 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed" placeholder="Event description..." />
                            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <input type="text" value={ev.venue} onChange={(e) => updateEvent(idx, { venue: e.target.value })} className="bg-transparent focus:outline-none flex-1" placeholder="Venue..." />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {eventsList.length === 0 && (
                      <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-slate-400 text-sm mb-3">No events added yet</p>
                        <button type="button" onClick={addEvent} className="text-xs font-bold text-purple-500 cursor-pointer">+ Add First Event</button>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 19. DOWNLOADS & DOCUMENTS CANVAS */}
                {/* ========================================================================= */}
                {isDownloadsPage && (
                  <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8 bg-white dark:bg-slate-950">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Document Repository</span>
                        <h2 className="text-2xl font-extrabold text-school-primary dark:text-white">Downloads & Documents</h2>
                      </div>
                      <button type="button" onClick={addDownloadDoc} className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 cursor-pointer hover:bg-emerald-100 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Document</span>
                      </button>
                    </div>
                    <div className="space-y-3">
                      {downloadDocsList.map((doc, idx) => (
                        <div key={doc.id} className="group relative glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-start space-x-4 hover:border-emerald-400/60 transition-all">
                          <button type="button" onClick={() => deleteDownloadDoc(idx)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer transition-opacity" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-500" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2 pr-8">
                            <div className="flex items-center space-x-2 flex-wrap gap-1">
                              <input type="text" value={doc.category} onChange={(e) => updateDownloadDoc(idx, { category: e.target.value })} className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full focus:outline-none w-24" placeholder="Category..." />
                              <input type="text" value={doc.fileSize} onChange={(e) => updateDownloadDoc(idx, { fileSize: e.target.value })} className="text-[10px] text-slate-400 bg-transparent focus:outline-none border-b border-dashed border-slate-400 w-16" placeholder="1.0 MB" />
                            </div>
                            <input type="text" value={doc.title} onChange={(e) => updateDownloadDoc(idx, { title: e.target.value })} className="w-full font-bold text-sm text-school-primary dark:text-white bg-transparent focus:outline-none" placeholder="Document title..." />
                            <input type="text" value={doc.description} onChange={(e) => updateDownloadDoc(idx, { description: e.target.value })} className="w-full text-xs text-slate-500 bg-transparent focus:outline-none" placeholder="Short description..." />
                            <div className="flex items-center space-x-1 text-[11px] text-blue-500">
                              <Link2 className="w-3 h-3 flex-shrink-0" />
                              <input type="text" value={doc.fileUrl} onChange={(e) => updateDownloadDoc(idx, { fileUrl: e.target.value })} className="bg-transparent focus:outline-none flex-1" placeholder="File URL or /uploads/file.pdf..." />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {downloadDocsList.length === 0 && (
                      <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-slate-400 text-sm mb-3">No documents added yet</p>
                        <button type="button" onClick={addDownloadDoc} className="text-xs font-bold text-emerald-500 cursor-pointer">+ Add First Document</button>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 20. CAREERS / JOB OPENINGS CANVAS */}
                {/* ========================================================================= */}
                {isCareersPage && (
                  <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8 bg-white dark:bg-slate-950">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Join Our Team</span>
                        <h2 className="text-2xl font-extrabold text-school-primary dark:text-white">Current Job Openings</h2>
                      </div>
                      <button type="button" onClick={addJobOpening} className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Opening</span>
                      </button>
                    </div>
                    <div className="space-y-5">
                      {jobOpeningsList.map((job, idx) => (
                        <div key={job.id} className="group relative glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-blue-400/60 transition-all">
                          <button type="button" onClick={() => deleteJobOpening(idx)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer transition-opacity" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center space-x-3 flex-wrap gap-2">
                            <input type="text" value={job.badge} onChange={(e) => updateJobOpening(idx, { badge: e.target.value })} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-full focus:outline-none w-28" placeholder="Category..." />
                            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>Deadline:</span>
                              <input type="text" value={job.deadline} onChange={(e) => updateJobOpening(idx, { deadline: e.target.value })} className="bg-transparent focus:outline-none border-b border-dashed border-slate-400 w-24" placeholder="31 Dec 2026" />
                            </div>
                          </div>
                          <input type="text" value={job.title} onChange={(e) => updateJobOpening(idx, { title: e.target.value })} className="w-full font-bold text-base text-school-primary dark:text-white bg-transparent focus:outline-none pr-8" placeholder="Job title..." />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role Description</p>
                              <textarea rows={3} value={job.description} onChange={(e) => updateJobOpening(idx, { description: e.target.value })} className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed" placeholder="Job description and responsibilities..." />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requirements</p>
                              <textarea rows={3} value={job.requirements} onChange={(e) => updateJobOpening(idx, { requirements: e.target.value })} className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed" placeholder="Qualification and experience requirements..." />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {jobOpeningsList.length === 0 && (
                      <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                        <p className="text-slate-400 text-sm mb-3">No openings added yet</p>
                        <button type="button" onClick={addJobOpening} className="text-xs font-bold text-blue-500 cursor-pointer">+ Add First Opening</button>
                      </div>
                    )}
                    {/* Career Culture story */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <h3 className="font-bold text-school-primary dark:text-white text-lg">
                        <input type="text" value={page.customStyles?.storyHeadline || "Why Build Your Career at CIS Mandi?"} onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, storyHeadline: e.target.value } })} className="w-full bg-transparent focus:outline-none" placeholder="Why work here headline..." />
                      </h3>
                      <textarea rows={4} value={page.customStyles?.mainStory || "We offer an empowering intellectual environment with 7th Pay Commission aligned salaries, on-campus faculty housing, subsidized child education, and continuous training with Cambridge & CBSE master educators.\n\nSend your resume and cover letter to careers@cismandi.edu.in."} onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, mainStory: e.target.value } })} className="w-full text-sm text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed" />
                    </div>
                  </div>
                )}

                {/* ========================================================================= */}
                {/* 21. MANDATORY DISCLOSURE & CBSE INFO CANVAS */}
                {/* ========================================================================= */}
                {(isMandatoryDisclosurePage || isCbseInfoPage) && (
                  <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8 bg-white dark:bg-slate-950">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">CBSE Compliance</span>
                      <h2 className="text-2xl font-extrabold text-school-primary dark:text-white">
                        {isMandatoryDisclosurePage ? "CBSE Mandatory Disclosure" : "CBSE School Information"}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isMandatoryDisclosurePage
                          ? "As per CBSE guidelines, the following mandatory disclosure information is published for public access and OASIS/SARAS compliance."
                          : "School affiliation details, committee information, staff list, and infrastructure details as required by CBSE."}
                      </p>
                    </div>

                    {/* Headline and story edit */}
                    <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                      <input type="text" value={page.customStyles?.storyHeadline || (isMandatoryDisclosurePage ? "CBSE Mandatory Disclosure – Salient Information" : "CIS Mandi – CBSE Affiliation & School Information")} onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, storyHeadline: e.target.value } })} className="w-full font-bold text-lg text-school-primary dark:text-white bg-transparent focus:outline-none" placeholder="Section heading..." />
                      <textarea rows={5} value={page.customStyles?.mainStory || (isMandatoryDisclosurePage
                        ? "School Name: Cambridge International School Mandi\nAffiliation No: 630198 (CBSE North)\nSchool Code: 08220\nCategory: Senior Secondary (Classes I–XII)\nAddress: Gutkar, Near Beas River, Mandi, Himachal Pradesh – 175001\nEmail: info@cismandi.edu.in | Phone: +91 1905 243366"
                        : "Affiliation No: 630198 | School Code: 08220 | UDISE Code: 02040202302\nPrincipal: Dr. (Mrs.) Sunita Rana | Management: Trust (Non-Minority)\nTotal Staff: 87 (Teaching: 62 | Non-Teaching: 25)\nEnrollment: 1,200 students | Classes I–XII")} onChange={(e) => onChange({ ...page, customStyles: { ...page.customStyles, mainStory: e.target.value } })} className="w-full text-sm text-slate-600 dark:text-slate-400 font-mono bg-transparent focus:outline-none resize-none leading-relaxed" placeholder="Enter compliance information..." />
                    </div>

                    {/* Download Documents for compliance */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Downloadable Compliance Documents</p>
                        <button type="button" onClick={addDownloadDoc} className="text-xs font-bold text-emerald-500 cursor-pointer flex items-center space-x-1">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Document</span>
                        </button>
                      </div>
                      {downloadDocsList.map((doc, idx) => (
                        <div key={doc.id} className="group relative flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                          <button type="button" onClick={() => deleteDownloadDoc(idx)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 cursor-pointer" title="Delete">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <FileText className="w-5 h-5 text-rose-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-2 pr-6">
                            <input type="text" value={doc.title} onChange={(e) => updateDownloadDoc(idx, { title: e.target.value })} className="font-semibold text-xs text-school-primary dark:text-white bg-transparent focus:outline-none" placeholder="Document title..." />
                            <input type="text" value={doc.fileUrl} onChange={(e) => updateDownloadDoc(idx, { fileUrl: e.target.value })} className="text-[11px] text-blue-500 bg-transparent focus:outline-none" placeholder="/uploads/file.pdf..." />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {/* ========================================================================= */}
                {/* 22. MODULAR DYNAMIC SECTIONS (AVAILABLE ON ANY PAGE) */}
                {/* ========================================================================= */}
                {page.sections && page.sections.length > 0 && (
                  <div className="p-6 sm:p-10 space-y-12 bg-white dark:bg-[#071326] border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Modular Section Builder</span>
                        <h3 className="text-base font-bold text-school-primary dark:text-white">Custom Page Sections ({page.sections.length})</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTemplateModal(true)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Section</span>
                      </button>
                    </div>

                  {(page.sections || []).map((sec, sIdx) => {
                    const isDragOver = dragOverSectionIdx === sIdx;
                    const isSelected = selectedBlock?.type === "section" && selectedBlock.secIdx === sIdx;

                    let gridCols = "grid-cols-1 md:grid-cols-3";
                    if (sec.layout === "grid_2" || sec.layout === "split") gridCols = "grid-cols-1 md:grid-cols-2";
                    else if (sec.layout === "grid_4") gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
                    else if (sec.layout === "grid_1" || sec.layout === "banner") gridCols = "grid-cols-1";

                    let sec3DClass = "";
                    if (sec.effect3D === "tilt") sec3DClass = "effect-3d-tilt";
                    else if (sec.effect3D === "float") sec3DClass = "effect-3d-float";
                    else if (sec.effect3D === "card3d") sec3DClass = "effect-3d-card";
                    else if (sec.effect3D === "glass") sec3DClass = "effect-glass-prism";
                    else if (sec.effect3D === "depth") sec3DClass = "effect-3d-depth";

                    let secAnimClass = "";
                    if (sec.animation === "fade") secAnimClass = "anim-fade-in";
                    else if (sec.animation === "slide-up") secAnimClass = "anim-slide-up";
                    else if (sec.animation === "slide-left") secAnimClass = "anim-slide-left";
                    else if (sec.animation === "slide-right") secAnimClass = "anim-slide-right";
                    else if (sec.animation === "zoom") secAnimClass = "anim-zoom-in";
                    else if (sec.animation === "bounce") secAnimClass = "anim-bounce-soft";
                    else if (sec.animation === "pulse") secAnimClass = "anim-pulse-subtle";
                    else if (sec.animation === "flip") secAnimClass = "anim-flip-3d";

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
                        className={`space-y-6 border-2 transition-all p-6 sm:p-8 rounded-3xl relative group/sec overflow-hidden ${sec3DClass} ${secAnimClass} ${
                          isDragOver
                            ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
                            : isSelected
                            ? "border-amber-500 ring-2 ring-amber-400/40 bg-white dark:bg-slate-900/90 shadow-2xl"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-lg hover:border-amber-400/60"
                        }`}
                        style={{
                          backgroundColor: sec.bgColor || undefined,
                          backgroundImage: sec.bgGradient || undefined,
                          borderColor: sec.borderColor || undefined,
                          borderWidth: sec.borderWidth ? `${sec.borderWidth}px` : undefined,
                          borderStyle: (sec.borderStyle as any) || undefined,
                          borderRadius: sec.borderRadius ? `${sec.borderRadius}px` : undefined,
                        }}
                      >
                        {/* Section Background Image Overlay */}
                        {sec.bgImage && (
                          <div
                            className="absolute inset-0 bg-cover bg-center pointer-events-none -z-10 rounded-3xl"
                            style={{
                              backgroundImage: `url(${sec.bgImage})`,
                              opacity: (sec.bgOverlayOpacity ?? 60) / 100,
                            }}
                          />
                        )}

                        {/* Section Action Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 relative z-10">
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBlock({ type: "section", secIdx: sIdx });
                                setActiveInspectorTab("style_studio");
                              }}
                              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 cursor-pointer flex items-center space-x-1 text-[11px] font-bold"
                              title="Customize Section Styles & 3D Effects"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Styles & 3D</span>
                            </button>
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
                          value={sec.subtitle || ""}
                          onChange={(e) => updateSection(sIdx, { subtitle: e.target.value })}
                          placeholder="Section introductory narrative or subtitle..."
                          className="w-full text-xs text-slate-600 dark:text-slate-400 bg-transparent focus:outline-none resize-none leading-relaxed relative z-10"
                        />

                        {/* Interactive 3D Campus Experience if enabled */}
                        {sec.show3DCampus && (
                          <div className="my-4 rounded-2xl overflow-hidden border border-indigo-500/40 bg-slate-950 p-2 shadow-2xl relative z-10">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-indigo-950/60 border-b border-indigo-800/50 rounded-t-xl mb-2 text-xs">
                              <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Interactive 3D Virtual Campus Experience (Live Three.js)</span>
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSection(sIdx, { show3DCampus: false });
                                }}
                                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
                              >
                                Hide 3D Canvas
                              </button>
                            </div>
                            <div className="h-[360px] rounded-xl overflow-hidden">
                              <Campus3DViewer />
                            </div>
                          </div>
                        )}

                        {/* Items Grid */}
                        <div className={`grid ${gridCols} gap-6 relative z-10`}>
                          {(sec.items || []).map((it, iIdx) => {
                            let item3DClass = "";
                            if (it.effect3D === "tilt") item3DClass = "effect-3d-tilt";
                            else if (it.effect3D === "float") item3DClass = "effect-3d-float";
                            else if (it.effect3D === "card3d") item3DClass = "effect-3d-card";
                            else if (it.effect3D === "glass") item3DClass = "effect-glass-prism";
                            else if (it.effect3D === "depth") item3DClass = "effect-3d-depth";

                            let itemAnimClass = "";
                            if (it.animation === "fade") itemAnimClass = "anim-fade-in";
                            else if (it.animation === "slide-up") itemAnimClass = "anim-slide-up";
                            else if (it.animation === "slide-left") itemAnimClass = "anim-slide-left";
                            else if (it.animation === "slide-right") itemAnimClass = "anim-slide-right";
                            else if (it.animation === "zoom") itemAnimClass = "anim-zoom-in";
                            else if (it.animation === "bounce") itemAnimClass = "anim-bounce-soft";
                            else if (it.animation === "pulse") itemAnimClass = "anim-pulse-subtle";
                            else if (it.animation === "flip") itemAnimClass = "anim-flip-3d";

                            let itemShadowClass = "";
                            if (it.shadow === "sm") itemShadowClass = "shadow-sm";
                            else if (it.shadow === "md") itemShadowClass = "shadow-md";
                            else if (it.shadow === "xl") itemShadowClass = "shadow-2xl";
                            else if (it.shadow === "deep3d") itemShadowClass = "shadow-deep-3d";
                            else if (it.shadow === "glow") itemShadowClass = "shadow-glow-amber";
                            else if (it.shadow === "neon") itemShadowClass = "shadow-neon-cyan";
                            else if (it.shadow === "purple") itemShadowClass = "shadow-neon-purple";
                            else if (it.shadow === "emerald") itemShadowClass = "shadow-glow-emerald";

                            let itemHoverClass = "hover:border-amber-400/50";
                            if (it.hoverEffect === "lift") itemHoverClass = "hover:-translate-y-2 hover:shadow-xl transition-all duration-300";
                            else if (it.hoverEffect === "scale") itemHoverClass = "hover:scale-[1.03] transition-all duration-300";
                            else if (it.hoverEffect === "glow") itemHoverClass = "hover:shadow-glow-amber transition-all duration-300";
                            else if (it.hoverEffect === "border") itemHoverClass = "hover:border-amber-400 hover:ring-2 hover:ring-amber-400/30 transition-all duration-300";

                            const itemFontCss = it.fontFamily
                              ? FONT_PRESETS.find((f) => f.value === it.fontFamily)?.cssFont
                              : undefined;

                            let titleSizeClass = "text-base";
                            if (it.titleSize === "sm") titleSizeClass = "text-sm";
                            else if (it.titleSize === "md") titleSizeClass = "text-base";
                            else if (it.titleSize === "lg") titleSizeClass = "text-lg";
                            else if (it.titleSize === "xl") titleSizeClass = "text-xl";
                            else if (it.titleSize === "2xl") titleSizeClass = "text-2xl";

                            let weightClass = "font-bold";
                            if (it.fontWeight === "normal") weightClass = "font-normal";
                            else if (it.fontWeight === "medium") weightClass = "font-medium";
                            else if (it.fontWeight === "semibold") weightClass = "font-semibold";
                            else if (it.fontWeight === "bold") weightClass = "font-bold";
                            else if (it.fontWeight === "extrabold") weightClass = "font-extrabold";
                            else if (it.fontWeight === "black") weightClass = "font-black";

                            let alignClass = "text-left";
                            if (it.textAlign === "center") alignClass = "text-center";
                            else if (it.textAlign === "right") alignClass = "text-right";
                            else if (it.textAlign === "justify") alignClass = "text-justify";

                            let transformClass = "";
                            if (it.textTransform === "uppercase") transformClass = "uppercase";
                            else if (it.textTransform === "capitalize") transformClass = "capitalize";
                            else if (it.textTransform === "lowercase") transformClass = "lowercase";

                            let letterSpacingClass = "";
                            if (it.letterSpacing === "tight") letterSpacingClass = "tracking-tight";
                            else if (it.letterSpacing === "wide") letterSpacingClass = "tracking-wide";
                            else if (it.letterSpacing === "wider") letterSpacingClass = "tracking-wider";

                            const isSelectedCard =
                              selectedBlock?.type === "item" &&
                              selectedBlock.secIdx === sIdx &&
                              selectedBlock.itemIdx === iIdx;

                            return (
                              <div
                                key={it.id || `item_${iIdx}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBlock({ type: "item", secIdx: sIdx, itemIdx: iIdx });
                                  setActiveInspectorTab("style_studio");
                                }}
                                className={`p-5 rounded-2xl border transition-all space-y-4 relative group/it ${item3DClass} ${itemAnimClass} ${itemShadowClass} ${itemHoverClass} ${
                                  isSelectedCard
                                    ? "border-amber-400 ring-2 ring-amber-400/40 bg-amber-500/5 shadow-xl"
                                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/80"
                                }`}
                                style={{
                                  backgroundColor: it.bgColor || undefined,
                                  backgroundImage: it.bgGradient || undefined,
                                  borderColor: it.borderColor || undefined,
                                  borderWidth: it.borderWidth ? `${it.borderWidth}px` : undefined,
                                  borderStyle: (it.borderStyle as any) || undefined,
                                  borderRadius: it.borderRadius ? `${it.borderRadius}px` : undefined,
                                  fontFamily: itemFontCss,
                                  backdropFilter: it.backdropBlur ? `blur(${it.backdropBlur}px)` : undefined,
                                }}
                              >
                                {/* 3D Interactive Badge */}
                                {it.interactive3D && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 rounded-full text-[9px] font-bold flex items-center space-x-1 shadow-sm backdrop-blur-sm pointer-events-none z-10">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                    <span>3D Element</span>
                                  </div>
                                )}

                                {/* Card Photo */}
                                {it.image && (
                                  <div
                                    className="relative rounded-xl overflow-hidden bg-slate-800 group/img w-full"
                                    style={{ height: it.imageHeight ? `${it.imageHeight}px` : "176px" }}
                                  >
                                    <img
                                      src={it.image}
                                      alt={it.title || "Card image"}
                                      className={`w-full h-full group-hover/img:scale-105 transition-transform duration-300 ${
                                        it.imageFit === "contain" ? "object-contain" : "object-cover"
                                      }`}
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          triggerImageUpload("item", sIdx, iIdx);
                                        }}
                                        className="px-2.5 py-1 bg-amber-400 text-slate-950 rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                                      >
                                        <Upload className="w-3 h-3" />
                                        <span>Change</span>
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
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateItem(sIdx, iIdx, { image: undefined });
                                        }}
                                        className="px-2 py-1 bg-rose-900 text-rose-200 rounded-lg text-[10px] font-bold cursor-pointer"
                                        title="Remove image"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Card Video Player */}
                                {it.videoUrl && (
                                  <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group/vid">
                                    {(() => {
                                      const ytId = getYouTubeId(it.videoUrl);
                                      if (ytId) {
                                        return (
                                          <div className="relative aspect-video w-full">
                                            <iframe
                                              src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                                              title={it.title || "Video player"}
                                              className="w-full h-full border-0"
                                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                              allowFullScreen
                                            />
                                          </div>
                                        );
                                      }
                                      return (
                                        <video
                                          src={it.videoUrl}
                                          controls
                                          className="w-full aspect-video object-cover"
                                        />
                                      );
                                    })()}
                                    <div className="px-2.5 py-1 bg-slate-900 text-[10px] text-amber-400 font-bold flex items-center justify-between border-t border-slate-800">
                                      <span className="flex items-center space-x-1">
                                        <Video className="w-3 h-3" />
                                        <span>Video Player</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateItem(sIdx, iIdx, { videoUrl: undefined });
                                        }}
                                        className="text-rose-400 hover:text-rose-300 cursor-pointer"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Card Document Attachment */}
                                {it.documentUrl && (
                                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between group/doc hover:border-amber-400/50 transition-colors">
                                    <div className="flex items-center space-x-2.5 min-w-0">
                                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate">
                                          {it.documentTitle || "Attached Document"}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                          {it.documentSize || "PDF File"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-1 shrink-0">
                                      <a
                                        href={it.documentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                        title="Open Document"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </a>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateItem(sIdx, iIdx, {
                                            documentUrl: undefined,
                                            documentTitle: undefined,
                                            documentSize: undefined,
                                          });
                                        }}
                                        className="p-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                                        title="Remove Document"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Card Text Fields */}
                                <div className={`space-y-2 ${alignClass}`}>
                                  {it.badge && (
                                    <input
                                      type="text"
                                      value={it.badge}
                                      onChange={(e) => updateItem(sIdx, iIdx, { badge: e.target.value })}
                                      placeholder="Card Badge"
                                      className={`text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-transparent focus:outline-none block w-full ${alignClass}`}
                                    />
                                  )}

                                  <input
                                    type="text"
                                    value={it.title}
                                    onChange={(e) => updateItem(sIdx, iIdx, { title: e.target.value })}
                                    placeholder="Card Title"
                                    className={`w-full ${titleSizeClass} ${weightClass} ${transformClass} ${letterSpacingClass} ${alignClass} text-school-primary dark:text-white bg-transparent focus:outline-none`}
                                    style={{
                                      color: it.titleColor || undefined,
                                      lineHeight: it.lineHeight ? `${it.lineHeight}` : undefined,
                                    }}
                                  />

                                  <textarea
                                    rows={3}
                                    value={it.description}
                                    onChange={(e) => updateItem(sIdx, iIdx, { description: e.target.value })}
                                    placeholder="Card description text..."
                                    className={`w-full text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-transparent focus:outline-none resize-none ${alignClass}`}
                                    style={{
                                      color: it.descColor || undefined,
                                    }}
                                  />
                                </div>

                                {/* Optional Action Button */}
                                {it.buttonText && (
                                  <div className={`pt-1 flex ${it.textAlign === "center" ? "justify-center" : it.textAlign === "right" ? "justify-end" : "justify-start"}`}>
                                    <a
                                      href={it.link || "#"}
                                      onClick={(e) => e.preventDefault()}
                                      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                        it.buttonVariant === "outline"
                                          ? "border-2 border-amber-400 text-amber-400 hover:bg-amber-400/10"
                                          : it.buttonVariant === "glass"
                                          ? "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                                          : "bg-amber-400 text-slate-950 hover:bg-amber-300"
                                      }`}
                                    >
                                      <span>{it.buttonText}</span>
                                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                    </a>
                                  </div>
                                )}

                                {/* Card Actions Bar */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                  <input
                                    type="text"
                                    value={it.link || ""}
                                    onChange={(e) => updateItem(sIdx, iIdx, { link: e.target.value })}
                                    placeholder="/link-url"
                                    className="bg-transparent text-slate-500 font-mono text-[10px] focus:outline-none max-w-[120px]"
                                  />

                                  <div className="flex items-center space-x-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedBlock({ type: "item", secIdx: sIdx, itemIdx: iIdx });
                                        setActiveInspectorTab("style_studio");
                                      }}
                                      className="p-1 text-slate-400 hover:text-amber-400"
                                      title="Open Full Style Studio for this Card"
                                    >
                                      <Palette className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        duplicateItem(sIdx, iIdx);
                                      }}
                                      className="p-1 text-slate-400 hover:text-white"
                                      title="Duplicate Card"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
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
                                      <Trash2 className="w-3.5 h-3.5" />
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
                </div>
              )}

              {/* Empty Sections Prompt for Custom / Generic Pages */}
              {!hasDedicatedCanvas && (!page.sections || page.sections.length === 0) && (
                <div className="p-6 sm:p-10 bg-white dark:bg-[#071326]">
                  <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-school-primary dark:text-white">
                        No Modular Sections Yet
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Click below to add Elementor Pro style feature grids, split stories, or academic wings to this page.
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
                </div>
              )}
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

            {isProcedurePage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("procedure_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "procedure_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📋 Matrix & Docs
              </button>
            )}

            {isFeesPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("fees_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "fees_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                💳 Fee Slabs
              </button>
            )}

            {isAdmissionsPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("admissions_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "admissions_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🚀 Roadmap
              </button>
            )}

            {isScholarshipsPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("scholarships_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "scholarships_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🏆 Schemes
              </button>
            )}

            {isFacultyPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("faculty_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "faculty_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                👥 Faculty
              </button>
            )}

            {isAcademicsHubPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("academics_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "academics_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📚 Wings
              </button>
            )}

            {isAcademicWingPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("wing_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "wing_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🎓 Wing Info
              </button>
            )}

            {isFacilitiesHubPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("facilities_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "facilities_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🏛️ Facilities
              </button>
            )}

            {isFacilityPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("facility_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "facility_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🖥️ Facility Specs
              </button>
            )}

            {isStudentLifePage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("student_life_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "student_life_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🎨 Clubs & Houses
              </button>
            )}

            {isAchievementsPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("achievements_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "achievements_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🎖️ Achievements
              </button>
            )}

            {isResultsPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("results_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "results_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📊 Board Toppers
              </button>
            )}

            {isGalleryPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("gallery_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "gallery_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📸 Photo Albums
              </button>
            )}

            {isVirtualTourPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("virtual_tour_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "virtual_tour_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                🌐 Tour Stops
              </button>
            )}

            {isApplyPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("apply_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "apply_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                ⚡ Registration
              </button>
            )}

            {isNewsPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("news_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "news_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📰 Circulars
              </button>
            )}

            {isEventsPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("events_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "events_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📅 Events
              </button>
            )}

            {isDownloadsPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("downloads_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "downloads_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📥 Downloads
              </button>
            )}

            {isCareersPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("careers_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "careers_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                💼 Careers
              </button>
            )}

            {(isMandatoryDisclosurePage || isCbseInfoPage) && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("compliance_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "compliance_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                ⚖️ Compliance
              </button>
            )}

            {isContactPage && (
              <button
                type="button"
                onClick={() => setActiveInspectorTab("contact_studio")}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all ${
                  activeInspectorTab === "contact_studio" ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                📍 Contact Studio
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
            <div className="space-y-5 text-xs">
              {/* Header Banner */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-950/80 to-purple-950/60 border border-indigo-700/50 rounded-2xl shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-white text-xs uppercase tracking-wider block">
                        Elementor Pro Style Studio
                      </span>
                      <p className="text-[10px] text-indigo-200">
                        {activeSelectedItem
                          ? `Card #${(selectedBlock?.itemIdx ?? 0) + 1}: "${activeSelectedItem.title || "Untitled Card"}"`
                          : activeSelectedSection
                          ? `Section #${(selectedBlock?.secIdx ?? 0) + 1}: "${activeSelectedSection.title || "Untitled Section"}"`
                          : "Global Page & Canvas Styling Suite"}
                      </p>
                    </div>
                  </div>
                  {(activeSelectedItem || activeSelectedSection) && (
                    <button
                      type="button"
                      onClick={() => setSelectedBlock(null)}
                      className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                    >
                      Deselect
                    </button>
                  )}
                </div>
              </div>

              {/* ============================================================ */}
              {/* SCENARIO 1: A CARD ITEM IS CURRENTLY SELECTED                 */}
              {/* ============================================================ */}
              {activeSelectedItem && selectedBlock?.secIdx !== undefined && selectedBlock?.itemIdx !== undefined && (
                <div className="space-y-4">
                  {/* Breadcrumb & Target Switcher */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                    <span className="text-slate-400 truncate">
                      Sec #{selectedBlock.secIdx + 1} &gt; <strong className="text-amber-400">{activeSelectedItem.title || "Card"}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedBlock({ type: "section", secIdx: selectedBlock.secIdx })}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline"
                    >
                      Select Parent Section
                    </button>
                  </div>

                  {/* 6 Sub-Tabs Navigation Bar */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    {[
                      { id: "typography", label: "Font", icon: "🔤" },
                      { id: "colors", label: "Color", icon: "🎨" },
                      { id: "media", label: "Media", icon: "🖼️" },
                      { id: "borders", label: "Border", icon: "✨" },
                      { id: "animations", label: "Anim", icon: "⚡" },
                      { id: "3d", label: "3D FX", icon: "🧊" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveStyleSubTab(tab.id as any)}
                        className={`py-1.5 px-1 rounded-lg text-center font-bold text-[10px] transition-all flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
                          activeStyleSubTab === tab.id
                            ? "bg-amber-400 text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                        }`}
                      >
                        <span className="text-xs">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* SUB-TAB 1: TYPOGRAPHY & FONTS */}
                  {activeStyleSubTab === "typography" && (
                    <div className="space-y-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      {/* Font Family Selector */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>Font Family</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {FONT_PRESETS.find((f) => f.value === activeSelectedItem.fontFamily)?.name.split(" ")[0] || "Default Sans"}
                          </span>
                        </label>
                        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                          {FONT_PRESETS.map((font) => (
                            <button
                              key={font.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  fontFamily: font.value,
                                })
                              }
                              className={`w-full p-2 rounded-xl text-left border text-xs transition-all flex items-center justify-between cursor-pointer ${
                                (activeSelectedItem.fontFamily || "font-sans") === font.value
                                  ? "bg-amber-400/15 border-amber-400 text-amber-300 font-bold"
                                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                              style={{ fontFamily: font.cssFont }}
                            >
                              <span>{font.name}</span>
                              {(activeSelectedItem.fontFamily || "font-sans") === font.value && (
                                <Check className="w-3.5 h-3.5 text-amber-400" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Title Font Size Presets */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Title Size</label>
                        <div className="grid grid-cols-5 gap-1">
                          {[
                            { label: "SM", value: "sm" },
                            { label: "MD", value: "md" },
                            { label: "LG", value: "lg" },
                            { label: "XL", value: "xl" },
                            { label: "2XL", value: "2xl" },
                          ].map((sz) => (
                            <button
                              key={sz.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  titleSize: sz.value as any,
                                })
                              }
                              className={`py-1 rounded-lg text-[10px] font-bold border text-center cursor-pointer ${
                                (activeSelectedItem.titleSize || "md") === sz.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {sz.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Font Weight */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Font Weight</label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { label: "Normal (400)", value: "normal" },
                            { label: "Medium (500)", value: "medium" },
                            { label: "SemiBold (600)", value: "semibold" },
                            { label: "Bold (700)", value: "bold" },
                            { label: "ExtraBold (800)", value: "extrabold" },
                            { label: "Black (900)", value: "black" },
                          ].map((w) => (
                            <button
                              key={w.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  fontWeight: w.value,
                                })
                              }
                              className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border text-center truncate cursor-pointer ${
                                (activeSelectedItem.fontWeight || "bold") === w.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {w.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Alignment */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Text Alignment</label>
                        <div className="grid grid-cols-4 gap-1">
                          {[
                            { label: "Left", value: "left", icon: <AlignLeft className="w-3.5 h-3.5" /> },
                            { label: "Center", value: "center", icon: <AlignCenter className="w-3.5 h-3.5" /> },
                            { label: "Right", value: "right", icon: <AlignRight className="w-3.5 h-3.5" /> },
                            { label: "Justify", value: "justify", icon: <AlignJustify className="w-3.5 h-3.5" /> },
                          ].map((al) => (
                            <button
                              key={al.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  textAlign: al.value as any,
                                })
                              }
                              className={`py-1.5 rounded-lg text-[10px] font-bold border flex items-center justify-center cursor-pointer ${
                                (activeSelectedItem.textAlign || "left") === al.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                              title={al.label}
                            >
                              {al.icon}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Text Transform & Letter Spacing */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Transform</label>
                          <select
                            value={activeSelectedItem.textTransform || "none"}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                textTransform: e.target.value as any,
                              })
                            }
                            className="w-full bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800 text-white text-xs cursor-pointer"
                          >
                            <option value="none">Normal</option>
                            <option value="uppercase">UPPERCASE</option>
                            <option value="capitalize">Capitalize</option>
                            <option value="lowercase">lowercase</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Letter Spacing</label>
                          <select
                            value={activeSelectedItem.letterSpacing || "normal"}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                letterSpacing: e.target.value,
                              })
                            }
                            className="w-full bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800 text-white text-xs cursor-pointer"
                          >
                            <option value="normal">Normal</option>
                            <option value="tight">Tight</option>
                            <option value="wide">Wide</option>
                            <option value="wider">Wider</option>
                          </select>
                        </div>
                      </div>

                      {/* Title & Description Colors */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Title Color</label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={activeSelectedItem.titleColor || "#0F172A"}
                              onChange={(e) =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  titleColor: e.target.value,
                                })
                              }
                              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={activeSelectedItem.titleColor || ""}
                              onChange={(e) =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  titleColor: e.target.value,
                                })
                              }
                              placeholder="#0F172A"
                              className="flex-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Text Color</label>
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="color"
                              value={activeSelectedItem.descColor || "#475569"}
                              onChange={(e) =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  descColor: e.target.value,
                                })
                              }
                              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={activeSelectedItem.descColor || ""}
                              onChange={(e) =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  descColor: e.target.value,
                                })
                              }
                              placeholder="#475569"
                              className="flex-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: COLORS & BACKGROUNDS */}
                  {activeStyleSubTab === "colors" && (
                    <div className="space-y-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      {/* Solid Color Swatches */}
                      <div className="space-y-2">
                        <label className="font-bold text-slate-300">Card Background Color</label>
                        <div className="flex flex-wrap gap-1.5">
                          {COLOR_SWATCHES.map((hex) => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  bgColor: hex === "transparent" ? undefined : hex,
                                  bgGradient: undefined,
                                })
                              }
                              className={`w-6 h-6 rounded-full border shadow-sm transition-transform hover:scale-125 cursor-pointer ${
                                activeSelectedItem.bgColor === hex
                                  ? "ring-2 ring-amber-400 border-white scale-110"
                                  : "border-slate-700"
                              }`}
                              style={{ backgroundColor: hex === "transparent" ? "#0F172A" : hex }}
                              title={hex}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 pt-1">
                          <input
                            type="color"
                            value={activeSelectedItem.bgColor || "#1E293B"}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                bgColor: e.target.value,
                                bgGradient: undefined,
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={activeSelectedItem.bgColor || ""}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                bgColor: e.target.value,
                                bgGradient: undefined,
                              })
                            }
                            placeholder="Custom Hex (e.g. #0A2540)"
                            className="flex-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                          />
                        </div>
                      </div>

                      {/* Curated Gradients */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="font-bold text-slate-300">Gradient Background Presets</label>
                        <div className="grid grid-cols-2 gap-2">
                          {GRADIENT_PRESETS.map((g) => (
                            <button
                              key={g.name}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  bgGradient: g.value,
                                  bgColor: undefined,
                                })
                              }
                              className={`h-11 rounded-xl border text-[10px] font-bold text-white shadow-sm flex items-center justify-center text-center p-1 cursor-pointer transition-all ${
                                activeSelectedItem.bgGradient === g.value
                                  ? "ring-2 ring-amber-400 border-white scale-[1.02]"
                                  : "border-slate-700 hover:scale-[1.02]"
                              }`}
                              style={{ backgroundImage: g.value }}
                            >
                              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{g.name}</span>
                            </button>
                          ))}
                        </div>
                        {activeSelectedItem.bgGradient && (
                          <button
                            type="button"
                            onClick={() =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                bgGradient: undefined,
                              })
                            }
                            className="w-full py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-400"
                          >
                            Remove Gradient
                          </button>
                        )}
                      </div>

                      {/* Glassmorphism & Backdrop Blur */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <div className="flex justify-between font-bold text-slate-300">
                          <span>Glassmorphism Backdrop Blur</span>
                          <span className="text-amber-400 font-mono">{activeSelectedItem.backdropBlur || "none"}</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                          {[
                            { label: "None", value: "none" },
                            { label: "Soft", value: "sm" },
                            { label: "Medium", value: "md" },
                            { label: "Heavy", value: "lg" },
                            { label: "Prism", value: "xl" },
                          ].map((b) => (
                            <button
                              key={b.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  backdropBlur: b.value === "none" ? undefined : b.value,
                                })
                              }
                              className={`py-1 rounded-lg text-[10px] font-bold border text-center cursor-pointer ${
                                (activeSelectedItem.backdropBlur || "none") === b.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: MEDIA, VIDEO & DOCUMENTS */}
                  {activeStyleSubTab === "media" && (
                    <div className="space-y-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      {/* Photo Image Controls */}
                      <div className="space-y-2">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>Card Image Photo</span>
                          {activeSelectedItem.image && (
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, { image: undefined })
                              }
                              className="text-[10px] text-rose-400 hover:text-rose-300"
                            >
                              Remove Image
                            </button>
                          )}
                        </label>
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="text"
                            value={activeSelectedItem.image || ""}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, { image: e.target.value })
                            }
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                          />
                          <button
                            type="button"
                            onClick={() => triggerImageUpload("item", selectedBlock.secIdx!, selectedBlock.itemIdx!)}
                            className="px-2.5 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] flex items-center space-x-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload</span>
                          </button>
                        </div>

                        {/* Image Height Slider */}
                        {activeSelectedItem.image && (
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between font-bold text-slate-400 text-[11px]">
                              <span>Image Height</span>
                              <span>{activeSelectedItem.imageHeight || 176}px</span>
                            </div>
                            <input
                              type="range"
                              min={80}
                              max={380}
                              step={10}
                              value={activeSelectedItem.imageHeight || 176}
                              onChange={(e) =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  imageHeight: parseInt(e.target.value),
                                })
                              }
                              className="w-full accent-amber-400"
                            />
                            <div className="flex items-center space-x-2 pt-1">
                              <span className="text-[10px] text-slate-400">Object Fit:</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, { imageFit: "cover" })
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  (activeSelectedItem.imageFit || "cover") === "cover"
                                    ? "bg-amber-400 text-slate-950"
                                    : "bg-slate-900 text-slate-400"
                                }`}
                              >
                                Cover
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, { imageFit: "contain" })
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  activeSelectedItem.imageFit === "contain"
                                    ? "bg-amber-400 text-slate-950"
                                    : "bg-slate-900 text-slate-400"
                                }`}
                              >
                                Contain
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video Embed Section */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <Video className="w-3.5 h-3.5 text-amber-400" />
                            <span>Embed Video (YouTube / MP4)</span>
                          </span>
                          {activeSelectedItem.videoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, { videoUrl: undefined })
                              }
                              className="text-[10px] text-rose-400 hover:text-rose-300"
                            >
                              Remove
                            </button>
                          )}
                        </label>
                        <input
                          type="text"
                          value={activeSelectedItem.videoUrl || ""}
                          onChange={(e) =>
                            updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, { videoUrl: e.target.value })
                          }
                          placeholder="e.g. https://youtu.be/slAltokCyL0 or .mp4 link"
                          className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                        />
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                videoUrl: "https://youtu.be/slAltokCyL0",
                              })
                            }
                            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 text-[9px]"
                          >
                            + Demo Aerial Drone
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                videoUrl: "https://youtu.be/48fO2u80pBs",
                              })
                            }
                            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 text-[9px]"
                          >
                            + Demo Campus Tour
                          </button>
                        </div>
                      </div>

                      {/* Document Attachment Section */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-rose-400" />
                            <span>Document Attachment (PDF / Docs)</span>
                          </span>
                          {activeSelectedItem.documentUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  documentUrl: undefined,
                                  documentTitle: undefined,
                                  documentSize: undefined,
                                })
                              }
                              className="text-[10px] text-rose-400 hover:text-rose-300"
                            >
                              Remove
                            </button>
                          )}
                        </label>
                        <input
                          type="text"
                          value={activeSelectedItem.documentTitle || ""}
                          onChange={(e) =>
                            updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                              documentTitle: e.target.value,
                            })
                          }
                          placeholder="Document Title (e.g. CBSE Syllabus 2026.pdf)"
                          className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={activeSelectedItem.documentUrl || ""}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                documentUrl: e.target.value,
                              })
                            }
                            placeholder="/downloads/document.pdf"
                            className="col-span-2 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                          />
                          <input
                            type="text"
                            value={activeSelectedItem.documentSize || ""}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                documentSize: e.target.value,
                              })
                            }
                            placeholder="e.g. 2.4 MB"
                            className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white text-[10px]"
                          />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                documentTitle: "CBSE Mandatory Disclosure 2026.pdf",
                                documentUrl: "/downloads/cbse-disclosure-2026.pdf",
                                documentSize: "1.8 MB",
                              })
                            }
                            className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[9px]"
                          >
                            + CBSE Disclosure
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                documentTitle: "School Prospectus & Curriculum.pdf",
                                documentUrl: "/downloads/prospectus.pdf",
                                documentSize: "4.2 MB",
                              })
                            }
                            className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[9px]"
                          >
                            + Prospectus
                          </button>
                        </div>
                      </div>

                      {/* CTA Action Button */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="font-bold text-slate-300">Card Button CTA</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={activeSelectedItem.buttonText || ""}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                buttonText: e.target.value,
                              })
                            }
                            placeholder="Button Label (e.g. Apply Now)"
                            className="bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white text-xs"
                          />
                          <select
                            value={activeSelectedItem.buttonVariant || "solid"}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                buttonVariant: e.target.value as any,
                              })
                            }
                            className="bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800 text-white text-xs cursor-pointer"
                          >
                            <option value="solid">Solid Amber</option>
                            <option value="outline">Outline Border</option>
                            <option value="glass">Frosted Glass</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: BORDERS, RADIUS & SHADOW GLOW */}
                  {activeStyleSubTab === "borders" && (
                    <div className="space-y-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      {/* Border Width & Style */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Border Width</label>
                          <div className="grid grid-cols-4 gap-1">
                            {[0, 1, 2, 4].map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() =>
                                  updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                    borderWidth: w === 0 ? undefined : w,
                                  })
                                }
                                className={`py-1 rounded-lg text-[10px] font-bold border text-center cursor-pointer ${
                                  (activeSelectedItem.borderWidth || 0) === w
                                    ? "bg-amber-400 text-slate-950 border-amber-400"
                                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                                }`}
                              >
                                {w}px
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-300">Border Style</label>
                          <select
                            value={activeSelectedItem.borderStyle || "solid"}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                borderStyle: e.target.value as any,
                              })
                            }
                            className="w-full bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800 text-white text-xs cursor-pointer"
                          >
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>

                      {/* Border Color */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-300">Border Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={activeSelectedItem.borderColor || "#334155"}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                borderColor: e.target.value,
                              })
                            }
                            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                          />
                          <input
                            type="text"
                            value={activeSelectedItem.borderColor || ""}
                            onChange={(e) =>
                              updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                borderColor: e.target.value,
                              })
                            }
                            placeholder="#334155 or amber"
                            className="flex-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                          />
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-300">Border Radius (Rounding)</label>
                        <div className="grid grid-cols-5 gap-1">
                          {[
                            { label: "0px", value: "none" },
                            { label: "8px", value: "sm" },
                            { label: "16px", value: "md" },
                            { label: "24px", value: "2xl" },
                            { label: "Pill", value: "full" },
                          ].map((rad) => (
                            <button
                              key={rad.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  borderRadius: rad.value as any,
                                })
                              }
                              className={`py-1 rounded-lg text-[10px] font-bold border text-center cursor-pointer ${
                                (activeSelectedItem.borderRadius || "md") === rad.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {rad.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Shadows & Neon Glows */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <label className="font-bold text-slate-300">Shadows & Neon Glow Presets</label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {SHADOW_PRESETS.map((sh) => (
                            <button
                              key={sh.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  shadow: sh.value as any,
                                })
                              }
                              className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border text-center truncate cursor-pointer transition-all ${
                                (activeSelectedItem.shadow || "none") === sh.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {sh.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hover Micro-Interactions */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <label className="font-bold text-slate-300">Hover Micro-Interaction</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { label: "None", value: "none" },
                            { label: "3D Lift Up", value: "lift" },
                            { label: "Scale Zoom", value: "scale" },
                            { label: "Amber Glow Aura", value: "glow" },
                            { label: "Border Ring", value: "border" },
                          ].map((hov) => (
                            <button
                              key={hov.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  hoverEffect: hov.value as any,
                                })
                              }
                              className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border text-center truncate cursor-pointer ${
                                (activeSelectedItem.hoverEffect || "none") === hov.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {hov.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 5: ENTRANCE ANIMATIONS */}
                  {activeStyleSubTab === "animations" && (
                    <div className="space-y-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="space-y-2">
                        <label className="font-bold text-slate-300 flex items-center justify-between">
                          <span>Entrance & Motion Animation</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {activeSelectedItem.animation || "none"}
                          </span>
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {ANIMATION_PRESETS.map((anim) => (
                            <button
                              key={anim.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  animation: anim.value as any,
                                })
                              }
                              className={`py-2 px-1 rounded-xl text-[10px] font-bold border text-center cursor-pointer transition-all ${
                                (activeSelectedItem.animation || "none") === anim.value
                                  ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                                  : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                              }`}
                            >
                              {anim.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/40 text-[11px] text-indigo-200">
                        ⚡ Selected animation plays smoothly when this card appears on screen and during visual edits.
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 6: 3D EFFECTS IN CANVAS */}
                  {activeStyleSubTab === "3d" && (
                    <div className="space-y-4 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                      <div className="space-y-2">
                        <label className="font-bold text-slate-300 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>3D Canvas Spatial Effects</span>
                        </label>
                        <div className="space-y-2">
                          {EFFECT3D_PRESETS.map((eff) => (
                            <button
                              key={eff.value}
                              type="button"
                              onClick={() =>
                                updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                                  effect3D: eff.value as any,
                                })
                              }
                              className={`w-full p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                (activeSelectedItem.effect3D || "none") === eff.value
                                  ? "bg-gradient-to-r from-amber-400/20 to-indigo-500/20 border-amber-400 shadow-lg"
                                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs">{eff.name}</span>
                                {(activeSelectedItem.effect3D || "none") === eff.value && (
                                  <Check className="w-4 h-4 text-amber-400" />
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">{eff.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3D Live Element Badge Toggle */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block text-xs">3D Element Badge</span>
                          <span className="text-[10px] text-slate-400">Display glowing 3D tag on card</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateItem(selectedBlock.secIdx!, selectedBlock.itemIdx!, {
                              interactive3D: !activeSelectedItem.interactive3D,
                            })
                          }
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            activeSelectedItem.interactive3D ? "bg-amber-400" : "bg-slate-800"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                              activeSelectedItem.interactive3D ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* SCENARIO 2: A SECTION IS CURRENTLY SELECTED                   */}
              {/* ============================================================ */}
              {activeSelectedSection && selectedBlock?.secIdx !== undefined && !activeSelectedItem && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-amber-400 text-xs">Section #{selectedBlock.secIdx + 1} Settings</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeSelectedSection.items?.length || 0} Cards
                      </span>
                    </div>

                    {/* Section Grid Layout */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Column Layout</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: "1 Col", value: "grid_1" },
                          { label: "2 Cols", value: "grid_2" },
                          { label: "3 Cols", value: "grid_3" },
                          { label: "4 Cols", value: "grid_4" },
                        ].map((ly) => (
                          <button
                            key={ly.value}
                            type="button"
                            onClick={() =>
                              updateSection(selectedBlock.secIdx!, {
                                layout: ly.value as any,
                              })
                            }
                            className={`py-1.5 rounded-xl text-[10px] font-bold border text-center cursor-pointer ${
                              (activeSelectedSection.layout || "grid_3") === ly.value
                                ? "bg-amber-400 text-slate-950 border-amber-400"
                                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                            }`}
                          >
                            {ly.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section 3D Virtual Campus Experience Toggle */}
                    <div className="p-3 bg-gradient-to-br from-indigo-950 to-slate-950 rounded-xl border border-indigo-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-amber-400 block text-xs">
                            ✨ 3D Campus Experience
                          </span>
                          <span className="text-[10px] text-indigo-200">
                            Live WebGL 3D school tour canvas
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(selectedBlock.secIdx!, {
                              show3DCampus: !activeSelectedSection.show3DCampus,
                            })
                          }
                          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                            activeSelectedSection.show3DCampus ? "bg-amber-400" : "bg-slate-800"
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                              activeSelectedSection.show3DCampus ? "left-6" : "left-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Section 3D Effects */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300">Section 3D Effect</label>
                      <div className="grid grid-cols-3 gap-1">
                        {EFFECT3D_PRESETS.map((eff) => (
                          <button
                            key={eff.value}
                            type="button"
                            onClick={() =>
                              updateSection(selectedBlock.secIdx!, {
                                effect3D: eff.value as any,
                              })
                            }
                            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border text-center truncate cursor-pointer ${
                              (activeSelectedSection.effect3D || "none") === eff.value
                                ? "bg-amber-400 text-slate-950 border-amber-400"
                                : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                            }`}
                          >
                            {eff.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section Gradients */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="font-bold text-slate-300">Section Background Gradient</label>
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
                            className={`h-10 rounded-xl border text-[10px] font-bold text-white shadow-sm flex items-center justify-center text-center p-1 cursor-pointer ${
                              activeSelectedSection.bgGradient === g.value
                                ? "ring-2 ring-amber-400 border-white"
                                : "border-slate-700 hover:scale-[1.02]"
                            }`}
                            style={{ backgroundImage: g.value }}
                          >
                            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{g.name}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateSection(selectedBlock.secIdx!, {
                            bgGradient: undefined,
                            bgColor: undefined,
                          })
                        }
                        className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 border border-slate-800 cursor-pointer"
                      >
                        Reset Background to Default
                      </button>
                    </div>

                    {/* Section Background Photo */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="font-bold text-slate-300">Section Background Image</label>
                      <input
                        type="text"
                        value={activeSelectedSection.bgImage || ""}
                        onChange={(e) =>
                          updateSection(selectedBlock.secIdx!, { bgImage: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-mono text-[10px]"
                      />
                      {activeSelectedSection.bgImage && (
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold text-slate-400 text-[10px]">
                            <span>Image Overlay Opacity</span>
                            <span>{activeSelectedSection.bgOverlayOpacity ?? 60}%</span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={100}
                            value={activeSelectedSection.bgOverlayOpacity ?? 60}
                            onChange={(e) =>
                              updateSection(selectedBlock.secIdx!, {
                                bgOverlayOpacity: parseInt(e.target.value),
                              })
                            }
                            className="w-full accent-amber-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCENARIO 3: NOTHING IS SELECTED - GLOBAL CANVAS STUDIO        */}
              {/* ============================================================ */}
              {!activeSelectedItem && !activeSelectedSection && (
                <div className="space-y-4">
                  {/* Quick 3D Campus Experience Adder */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-white text-xs block">
                          3D Interactive Campus Canvas
                        </span>
                        <p className="text-[10px] text-indigo-200">
                          Add live WebGL Three.js interactive 3D model into this page
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const new3DSec: SectionBlock = {
                          id: `sec_3d_${Date.now()}`,
                          type: "interactive_3d",
                          title: "Explore Our 3D Virtual Campus",
                          subtitle: "Immerse yourself in our premier 3D campus infrastructure and interactive architectural tour.",
                          badge: "3D Virtual Tour",
                          show3DCampus: true,
                          items: [
                            {
                              id: `item_1`,
                              title: "Interactive Navigation",
                              description: "Orbit, pan, and zoom around the campus buildings with intuitive touch & mouse controls.",
                              interactive3D: true,
                              effect3D: "tilt",
                              animation: "fade",
                            },
                            {
                              id: `item_2`,
                              title: "High-Tech Facilities",
                              description: "Explore STEM labs, academic wings, athletics arenas, and library wings.",
                              interactive3D: true,
                              effect3D: "card3d",
                              animation: "slide-up",
                            },
                            {
                              id: `item_3`,
                              title: "Book Guided Tour",
                              description: "Schedule an on-campus physical visit and admissions consultation today.",
                              buttonText: "Schedule Visit",
                              buttonLink: "/contact",
                              effect3D: "glass",
                              animation: "zoom",
                            },
                          ],
                        };
                        onChange({ ...page, sections: [...(page.sections || []), new3DSec] });
                        setSelectedBlock({ type: "section", secIdx: (page.sections?.length || 0) });
                      }}
                      className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add 3D Campus Experience Section</span>
                    </button>
                  </div>

                  {/* Selection Instruction Guide */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 block text-xs">
                      🎨 Visual Canvas Elementor Controls
                    </span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      Click directly on <strong>any Card</strong> or <strong>any Section</strong> in the canvas to unlock all 6 design sub-tabs:
                    </p>
                    <ul className="space-y-1.5 text-slate-300 text-[11px]">
                      <li className="flex items-center space-x-2">
                        <span>🔤</span>
                        <span><strong>Typography:</strong> 9 font families, size, weight, alignment, transform</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span>🎨</span>
                        <span><strong>Colors & BG:</strong> 16 swatches, 10 gradients, backdrop glassmorphism</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span>🖼️</span>
                        <span><strong>Media & Docs:</strong> Image sizing, YouTube/MP4 embeds, PDF attachments, CTA buttons</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span>✨</span>
                        <span><strong>Borders & Glows:</strong> Width, style, rounding, 9 neon aura presets, hover lifts</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span>⚡</span>
                        <span><strong>Animations:</strong> Fade, slide, bounce, zoom, flip 3D entrance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span>🧊</span>
                        <span><strong>3D Effects:</strong> Perspective tilt, float levitation, preserve-3d elevation, glass prism</span>
                      </li>
                    </ul>
                  </div>
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

          {/* TAB: PROCEDURE STUDIO */}
          {activeInspectorTab === "procedure_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  📋 Admission Procedure Matrix & Docs
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage age criteria rows, document checklists, and application CTA button.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Age Criteria Rows</span>
                    <span className="text-amber-400 font-bold">{procedureAgeMatrix.length} Grades</span>
                  </div>
                  <button
                    type="button"
                    onClick={addAgeMatrixRow}
                    className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Grade Criteria Row</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Mandatory Documents</span>
                    <span className="text-emerald-400 font-bold">{procedureDocs.length} Documents</span>
                  </div>
                  <button
                    type="button"
                    onClick={addProcedureDoc}
                    className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Mandatory Document</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Call to Action Button Label</label>
                  <input
                    type="text"
                    value={page.customStyles?.ctaText || page.heroCtaText || "Proceed to Online Application Form"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroCtaText: e.target.value,
                        customStyles: { ...page.customStyles, ctaText: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Call to Action Link</label>
                  <input
                    type="text"
                    value={page.customStyles?.ctaLink || page.heroCtaLink || "/admissions/apply"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroCtaLink: e.target.value,
                        customStyles: { ...page.customStyles, ctaLink: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: FEES STUDIO */}
          {activeInspectorTab === "fees_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  💳 Fees & Schedule Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure tuition tiers, transport slabs, and hostel boarding charges.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={addFeeTier}
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Academic Fee Tier</span>
                </button>
                <button
                  type="button"
                  onClick={addTransportSlab}
                  className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Transport Slab</span>
                </button>
                <button
                  type="button"
                  onClick={addHostelFee}
                  className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Hostel Fee Item</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: ADMISSIONS STUDIO */}
          {activeInspectorTab === "admissions_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  🚀 Admissions Roadmap Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure admission notice banner and step-by-step roadmap cards.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Banner Badge</label>
                  <input
                    type="text"
                    value={page.customStyles?.bannerBadge || "Session 2025–2026 Admissions Open"}
                    onChange={(e) =>
                      onChange({ ...page, customStyles: { ...page.customStyles, bannerBadge: e.target.value } })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Banner Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.bannerTitle || "Begin Your Child's Journey of Excellence"}
                    onChange={(e) =>
                      onChange({ ...page, customStyles: { ...page.customStyles, bannerTitle: e.target.value } })
                    }
                    className="w-full bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={addAdmissionStep}
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Admission Step</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: SCHOLARSHIPS STUDIO */}
          {activeInspectorTab === "scholarships_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <span className="font-extrabold text-purple-400 uppercase tracking-wider block">
                  🏆 Scholarships & Awards Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage merit, sports, and defence fee concessions.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={addScholarshipScheme}
                  className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Scholarship Scheme</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: FACULTY STUDIO */}
          {activeInspectorTab === "faculty_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  👥 Faculty Highlights & Metric Strip
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure the 4 key faculty credentials displayed in the hero highlights bar.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 block">Metric #1</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={page.customStyles?.stat1Value || "58+"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat1Value: e.target.value },
                        })
                      }
                      placeholder="58+"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                    />
                    <input
                      type="text"
                      value={page.customStyles?.stat1Label || "Faculty Members"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat1Label: e.target.value },
                        })
                      }
                      placeholder="Label"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 block">Metric #2</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={page.customStyles?.stat2Value || "100%"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat2Value: e.target.value },
                        })
                      }
                      placeholder="100%"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                    />
                    <input
                      type="text"
                      value={page.customStyles?.stat2Label || "Post-Graduate Certified"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat2Label: e.target.value },
                        })
                      }
                      placeholder="Label"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 block">Metric #3</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={page.customStyles?.stat3Value || "14+ Yrs"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat3Value: e.target.value },
                        })
                      }
                      placeholder="14+ Yrs"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                    />
                    <input
                      type="text"
                      value={page.customStyles?.stat3Label || "Avg Lead Experience"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat3Label: e.target.value },
                        })
                      }
                      placeholder="Label"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 block">Metric #4</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={page.customStyles?.stat4Value || "1 : 15"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat4Value: e.target.value },
                        })
                      }
                      placeholder="1 : 15"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                    />
                    <input
                      type="text"
                      value={page.customStyles?.stat4Label || "Teacher-Student Ratio"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, stat4Label: e.target.value },
                        })
                      }
                      placeholder="Label"
                      className="bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white text-[11px]"
                    />
                  </div>
                </div>

                <Link
                  href="/admin/faculty"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold flex items-center justify-center space-x-1.5 shadow"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Open Faculty Directory Console →</span>
                </Link>
              </div>
            </div>
          )}

          {/* TAB: ACADEMICS STUDIO */}
          {activeInspectorTab === "academics_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <span className="font-extrabold text-blue-400 uppercase tracking-wider block">
                  📚 Academic Curriculum Intro & Wings
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage introductory text, 4 wings, and pedagogical differentiators.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Affiliation Subtitle</label>
                  <input
                    type="text"
                    value={page.customStyles?.affiliationLabel || "CBSE AFFILIATION NO. 630198"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: { ...page.customStyles, affiliationLabel: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Welcome Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || "Welcome to Academic Curriculum"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Introduction Story</label>
                  <textarea
                    rows={3}
                    value={
                      page.customStyles?.mainStory ||
                      "Integrated CBSE & Cambridge framework. Cambridge International School Mandi fosters an engaging, safe, and academically rigorous environment where every learner thrives."
                    }
                    onChange={(e) =>
                      onChange({
                        ...page,
                        customStyles: { ...page.customStyles, mainStory: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACADEMIC WING STUDIO */}
          {activeInspectorTab === "wing_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <span className="font-extrabold text-blue-400 uppercase tracking-wider block">
                  🎓 Academic Wing Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure age group, class range, narrative story, and curricular milestones.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Wing Badge</label>
                  <input
                    type="text"
                    value={page.customStyles?.wingBadge || page.heroBadge || "Academic Tier"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroBadge: e.target.value,
                        customStyles: { ...page.customStyles, wingBadge: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Age Group</label>
                    <input
                      type="text"
                      value={page.customStyles?.ageGroup || "Ages 3 to 18"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, ageGroup: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Class Range</label>
                    <input
                      type="text"
                      value={page.customStyles?.classRange || "Grades Pre-Nursery to 12"}
                      onChange={(e) =>
                        onChange({
                          ...page,
                          customStyles: { ...page.customStyles, classRange: e.target.value },
                        })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Story Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "Curriculum & Learning Continuum"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Narrative Story</label>
                  <textarea
                    rows={3}
                    value={page.customStyles?.mainStory || page.heroSubtitle || ""}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroSubtitle: e.target.value,
                        customStyles: { ...page.customStyles, mainStory: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white resize-none"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Wing Highlights ({wingHighlights.length})</span>
                    <button
                      type="button"
                      onClick={addWingHighlightItem}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Item
                    </button>
                  </div>
                  {wingHighlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => updateWingHighlightItem(idx, e.target.value)}
                        className="flex-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => deleteWingHighlightItem(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {page.slug === "primary" && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Primary Core Subjects ({primarySubjects.length})</span>
                      <button
                        type="button"
                        onClick={addPrimarySubject}
                        className="text-[10px] text-amber-400 font-bold hover:underline"
                      >
                        + Add Subject
                      </button>
                    </div>
                    {primarySubjects.map((sub, idx) => (
                      <div key={idx} className="space-y-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => updatePrimarySubject(idx, { name: e.target.value })}
                            className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => deletePrimarySubject(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={sub.desc}
                          onChange={(e) => updatePrimarySubject(idx, { desc: e.target.value })}
                          className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-slate-300 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {page.slug === "middle-school" && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">STEM Features ({middleFeatures.length})</span>
                      <button
                        type="button"
                        onClick={addMiddleFeature}
                        className="text-[10px] text-amber-400 font-bold hover:underline"
                      >
                        + Add Feature
                      </button>
                    </div>
                    {middleFeatures.map((feat, idx) => (
                      <div key={idx} className="space-y-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={feat.title}
                            onChange={(e) => updateMiddleFeature(idx, { title: e.target.value })}
                            className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteMiddleFeature(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={feat.desc}
                          onChange={(e) => updateMiddleFeature(idx, { desc: e.target.value })}
                          className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-slate-300 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {page.slug === "senior-secondary" && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Senior Academic Streams ({seniorStreams.length})</span>
                      <button
                        type="button"
                        onClick={addSeniorStream}
                        className="text-[10px] text-amber-400 font-bold hover:underline"
                      >
                        + Add Stream
                      </button>
                    </div>
                    {seniorStreams.map((st, idx) => (
                      <div key={idx} className="space-y-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={st.name}
                            onChange={(e) => updateSeniorStream(idx, { name: e.target.value })}
                            className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteSeniorStream(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={st.careers}
                          onChange={(e) => updateSeniorStream(idx, { careers: e.target.value })}
                          placeholder="Career trajectories..."
                          className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-slate-300 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: FACILITIES HUB STUDIO */}
          {activeInspectorTab === "facilities_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider block">
                  🏛️ Campus Facilities Overview
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage facility campus metrics, intro headline, and direct access links.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 block">Campus Capacity Highlights</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Campus Size</label>
                      <input
                        type="text"
                        value={page.customStyles?.campusSize || "15+ Acres"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, campusSize: e.target.value } })
                        }
                        className="w-full bg-slate-950 px-2 py-1.5 rounded border border-slate-700 text-white font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Labs Count</label>
                      <input
                        type="text"
                        value={page.customStyles?.labCount || "6+ Labs"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, labCount: e.target.value } })
                        }
                        className="w-full bg-slate-950 px-2 py-1.5 rounded border border-slate-700 text-white font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Sports Arenas</label>
                      <input
                        type="text"
                        value={page.customStyles?.sportsCount || "12+ Sports"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, sportsCount: e.target.value } })
                        }
                        className="w-full bg-slate-950 px-2 py-1.5 rounded border border-slate-700 text-white font-bold text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Story Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "World-Class Infrastructure at Mandi"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Introduction Story</label>
                  <textarea
                    rows={3}
                    value={page.customStyles?.mainStory || page.heroSubtitle || "Sprawling across picturesque Himalayan landscapes, Cambridge International School Mandi blends tranquil nature with ultra-modern educational architecture."}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroSubtitle: e.target.value,
                        customStyles: { ...page.customStyles, mainStory: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white resize-none"
                  />
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-300 block text-[11px]">Direct Sub-Facility Pages</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {[
                      { slug: "smart-classrooms", name: "Smart Classrooms" },
                      { slug: "science-labs", name: "Science Labs" },
                      { slug: "robotics-lab", name: "Robotics Lab" },
                      { slug: "library", name: "Central Library" },
                      { slug: "sports-complex", name: "Sports Complex" },
                      { slug: "hostel", name: "Boarding Hostel" },
                      { slug: "transport", name: "GPS Transport" },
                      { slug: "computer-labs", name: "Computer Labs" },
                    ].map((fac) => (
                      <Link
                        key={fac.slug}
                        href={`/admin/pages?slug=${fac.slug}`}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 truncate block text-center"
                      >
                        {fac.name} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SPECIFIC FACILITY STUDIO */}
          {activeInspectorTab === "facility_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                <span className="font-extrabold text-cyan-400 uppercase tracking-wider block">
                  🖥️ Facility Specifications Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Edit facility highlights, equipment specifications, and custom sub-features.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Facility Badge</label>
                  <input
                    type="text"
                    value={page.customStyles?.facilityBadge || page.heroBadge || "Campus Infrastructure"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroBadge: e.target.value,
                        customStyles: { ...page.customStyles, facilityBadge: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Facility Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "Facility Overview"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Facility Narrative</label>
                  <textarea
                    rows={3}
                    value={page.customStyles?.mainStory || page.heroSubtitle || ""}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroSubtitle: e.target.value,
                        customStyles: { ...page.customStyles, mainStory: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white resize-none"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Key Features & Specs ({facilitySpecs.length})</span>
                    <button
                      type="button"
                      onClick={addFacilitySpec}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Spec
                    </button>
                  </div>
                  {facilitySpecs.map((spec, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => updateFacilitySpec(idx, e.target.value)}
                        className="flex-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => deleteFacilitySpec(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {page.slug === "sports-complex" && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Sports Arenas ({sportsComplexList.length})</span>
                      <button
                        type="button"
                        onClick={addSportsComplexItem}
                        className="text-[10px] text-amber-400 font-bold hover:underline"
                      >
                        + Add Arena
                      </button>
                    </div>
                    {sportsComplexList.map((sp, idx) => (
                      <div key={idx} className="space-y-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={sp.title}
                            onChange={(e) => updateSportsComplexItem(idx, { title: e.target.value })}
                            className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteSportsComplexItem(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={sp.desc}
                          onChange={(e) => updateSportsComplexItem(idx, { desc: e.target.value })}
                          className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-slate-300 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {page.slug === "transport" && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Bus Routes ({transportRoutesList.length})</span>
                      <button
                        type="button"
                        onClick={addTransportRouteItem}
                        className="text-[10px] text-amber-400 font-bold hover:underline"
                      >
                        + Add Route
                      </button>
                    </div>
                    {transportRoutesList.map((rt, idx) => (
                      <div key={idx} className="space-y-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={rt.route}
                            onChange={(e) => updateTransportRouteItem(idx, { route: e.target.value })}
                            className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteTransportRouteItem(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={rt.stops}
                          onChange={(e) => updateTransportRouteItem(idx, { stops: e.target.value })}
                          className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-slate-300 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {page.slug === "science-labs" && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">Science Labs ({scienceLabList.length})</span>
                      <button
                        type="button"
                        onClick={addScienceLab}
                        className="text-[10px] text-amber-400 font-bold hover:underline"
                      >
                        + Add Lab
                      </button>
                    </div>
                    {scienceLabList.map((lb, idx) => (
                      <div key={idx} className="space-y-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={lb.name}
                            onChange={(e) => updateScienceLab(idx, { name: e.target.value })}
                            className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-[11px]"
                          />
                          <button
                            type="button"
                            onClick={() => deleteScienceLab(idx)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={lb.desc}
                          onChange={(e) => updateScienceLab(idx, { desc: e.target.value })}
                          className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-slate-300 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">CTA Button Label</label>
                    <input
                      type="text"
                      value={page.customStyles?.ctaText || "Book Campus Tour"}
                      onChange={(e) =>
                        onChange({ ...page, customStyles: { ...page.customStyles, ctaText: e.target.value } })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">CTA Button Link</label>
                    <input
                      type="text"
                      value={page.customStyles?.ctaLink || "/contact"}
                      onChange={(e) =>
                        onChange({ ...page, customStyles: { ...page.customStyles, ctaLink: e.target.value } })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STUDENT LIFE STUDIO */}
          {activeInspectorTab === "student_life_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  🎨 Student Life & House System
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure the 4 student houses (Agni, Prithvi, Vayu, Jal) and co-curricular clubs.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Section Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "Vibrant Co-Curricular & Student Life"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Introduction Narrative</label>
                  <textarea
                    rows={3}
                    value={page.customStyles?.mainStory || page.heroSubtitle || "Beyond academic rigor, Cambridge Mandi cultivates leadership, teamwork, artistic brilliance, and holistic well-being."}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroSubtitle: e.target.value,
                        customStyles: { ...page.customStyles, mainStory: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white resize-none"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Co-Curricular Clubs ({studentClubsList.length})</span>
                    <button
                      type="button"
                      onClick={addStudentClub}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Club
                    </button>
                  </div>
                  {studentClubsList.map((cl, idx) => (
                    <div key={idx} className="space-y-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={cl.title}
                          onChange={(e) => updateStudentClub(idx, { title: e.target.value })}
                          className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => deleteStudentClub(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={cl.desc}
                        onChange={(e) => updateStudentClub(idx, { desc: e.target.value })}
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-slate-300 text-[10px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACHIEVEMENTS STUDIO */}
          {activeInspectorTab === "achievements_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  🎖️ Hall of Fame & Achievements
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage metric counters, student laurels, olympiad medals, and national honors.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <span className="font-bold text-slate-300 block">Metric Counters</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        value={page.customStyles?.stat1Value || "150+"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, stat1Value: e.target.value } })
                        }
                        placeholder="150+"
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-center text-xs"
                      />
                      <input
                        type="text"
                        value={page.customStyles?.stat1Label || "National Laurels"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, stat1Label: e.target.value } })
                        }
                        placeholder="Label"
                        className="w-full bg-slate-950 px-2 py-0.5 mt-1 rounded border border-slate-700 text-slate-400 text-[10px] text-center"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={page.customStyles?.stat2Value || "100%"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, stat2Value: e.target.value } })
                        }
                        placeholder="100%"
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-center text-xs"
                      />
                      <input
                        type="text"
                        value={page.customStyles?.stat2Label || "Board Pass Rate"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, stat2Label: e.target.value } })
                        }
                        placeholder="Label"
                        className="w-full bg-slate-950 px-2 py-0.5 mt-1 rounded border border-slate-700 text-slate-400 text-[10px] text-center"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={page.customStyles?.stat3Value || "25+"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, stat3Value: e.target.value } })
                        }
                        placeholder="25+"
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-700 text-white font-bold text-center text-xs"
                      />
                      <input
                        type="text"
                        value={page.customStyles?.stat3Label || "State Trophies"}
                        onChange={(e) =>
                          onChange({ ...page, customStyles: { ...page.customStyles, stat3Label: e.target.value } })
                        }
                        placeholder="Label"
                        className="w-full bg-slate-950 px-2 py-0.5 mt-1 rounded border border-slate-700 text-slate-400 text-[10px] text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "Celebrating Student Laurels"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Laurels & Achievements ({achievementsList.length})</span>
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Laurel
                    </button>
                  </div>

                  {achievementsList.map((ach, idx) => (
                    <div key={ach.id || idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-[11px]">#{idx + 1} {ach.studentName}</span>
                        <button
                          type="button"
                          onClick={() => deleteAchievement(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={ach.studentName}
                          onChange={(e) => updateAchievement(idx, { studentName: e.target.value })}
                          placeholder="Student Name"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={ach.category}
                          onChange={(e) => updateAchievement(idx, { category: e.target.value })}
                          placeholder="Category (e.g. Olympiads)"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={ach.rank}
                          onChange={(e) => updateAchievement(idx, { rank: e.target.value })}
                          placeholder="Rank / Medal"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={ach.year}
                          onChange={(e) => updateAchievement(idx, { year: e.target.value })}
                          placeholder="Year / Session"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                      </div>
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => updateAchievement(idx, { title: e.target.value })}
                        placeholder="Title / Competition Name"
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                      />
                      <textarea
                        rows={2}
                        value={ach.description}
                        onChange={(e) => updateAchievement(idx, { description: e.target.value })}
                        placeholder="Description..."
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[10px] resize-none"
                      />
                      <div className="flex space-x-1.5">
                        <input
                          type="text"
                          value={ach.photoUrl}
                          onChange={(e) => updateAchievement(idx, { photoUrl: e.target.value })}
                          placeholder="Photo URL"
                          className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-400 font-mono text-[9px]"
                        />
                        <button
                          type="button"
                          onClick={() => triggerImageUpload("achievement", undefined, undefined, undefined, undefined, idx)}
                          className="px-2 py-1 bg-slate-800 text-amber-400 rounded text-[10px] font-bold"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: RESULTS STUDIO */}
          {activeInspectorTab === "results_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider block">
                  📊 Board Examination Toppers
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage Class X & XII board toppers, score percentages, and state distinctions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Results Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "CBSE Board Examination Results"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Board Toppers List ({resultsToppersList.length})</span>
                    <button
                      type="button"
                      onClick={addResultTopper}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Topper
                    </button>
                  </div>

                  {resultsToppersList.map((top, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-bold text-[11px]">#{idx + 1} {top.name}</span>
                        <button
                          type="button"
                          onClick={() => deleteResultTopper(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={top.name}
                          onChange={(e) => updateResultTopper(idx, { name: e.target.value })}
                          placeholder="Student Name"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={top.score}
                          onChange={(e) => updateResultTopper(idx, { score: e.target.value })}
                          placeholder="Score (e.g. 99.2%)"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={top.stream}
                          onChange={(e) => updateResultTopper(idx, { stream: e.target.value })}
                          placeholder="Class / Stream"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                        <input
                          type="text"
                          value={top.rank}
                          onChange={(e) => updateResultTopper(idx, { rank: e.target.value })}
                          placeholder="Rank / Distinction"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                      </div>
                      <div className="flex space-x-1.5">
                        <input
                          type="text"
                          value={top.photo}
                          onChange={(e) => updateResultTopper(idx, { photo: e.target.value })}
                          placeholder="Photo URL"
                          className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-400 font-mono text-[9px]"
                        />
                        <button
                          type="button"
                          onClick={() => triggerImageUpload("topper", undefined, undefined, undefined, idx)}
                          className="px-2 py-1 bg-slate-800 text-amber-400 rounded text-[10px] font-bold"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GALLERY STUDIO */}
          {activeInspectorTab === "gallery_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <span className="font-extrabold text-purple-400 uppercase tracking-wider block">
                  📸 Photo & Video Albums
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage featured albums, campus event categories, and cover images.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/admin/gallery"
                  className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl font-bold flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Gallery Media Console →</span>
                </Link>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "Life at Cambridge Mandi"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Featured Albums ({galleryAlbumsList.length})</span>
                    <button
                      type="button"
                      onClick={addGalleryAlbum}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Album
                    </button>
                  </div>

                  {galleryAlbumsList.map((alb, idx) => (
                    <div key={alb.id || idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 font-bold text-[11px]">#{idx + 1} {alb.title}</span>
                        <button
                          type="button"
                          onClick={() => deleteGalleryAlbum(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={alb.title}
                          onChange={(e) => updateGalleryAlbum(idx, { title: e.target.value })}
                          placeholder="Album Title"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                        />
                        <input
                          type="text"
                          value={alb.category}
                          onChange={(e) => updateGalleryAlbum(idx, { category: e.target.value })}
                          placeholder="Category (e.g. Sports)"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                      </div>
                      <input
                        type="text"
                        value={alb.photoCount || "25 Photos"}
                        onChange={(e) => updateGalleryAlbum(idx, { photoCount: e.target.value })}
                        placeholder="Photo Count (e.g. 48 Photos)"
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[11px]"
                      />
                      <textarea
                        rows={2}
                        value={alb.description}
                        onChange={(e) => updateGalleryAlbum(idx, { description: e.target.value })}
                        placeholder="Album Description..."
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[10px] resize-none"
                      />
                      <div className="flex space-x-1.5">
                        <input
                          type="text"
                          value={alb.coverImage}
                          onChange={(e) => updateGalleryAlbum(idx, { coverImage: e.target.value })}
                          placeholder="Cover Image URL"
                          className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-400 font-mono text-[9px]"
                        />
                        <button
                          type="button"
                          onClick={() => triggerImageUpload("album", undefined, undefined, undefined, undefined, undefined, idx)}
                          className="px-2 py-1 bg-slate-800 text-amber-400 rounded text-[10px] font-bold"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: VIRTUAL TOUR STUDIO */}
          {activeInspectorTab === "virtual_tour_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                <span className="font-extrabold text-cyan-400 uppercase tracking-wider block">
                  🌐 360° Virtual Campus Tour
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage panoramic stops, campus locations, descriptions, and 360 views.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Tour Headline</label>
                  <input
                    type="text"
                    value={page.customStyles?.storyHeadline || page.heroTitle || "Interactive 360° Campus Tour"}
                    onChange={(e) =>
                      onChange({
                        ...page,
                        heroTitle: e.target.value,
                        customStyles: { ...page.customStyles, storyHeadline: e.target.value },
                      })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Tour Stops ({tourPointsList.length})</span>
                    <button
                      type="button"
                      onClick={addTourPoint}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Stop
                    </button>
                  </div>

                  {tourPointsList.map((tp, idx) => (
                    <div key={tp.id || idx} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold text-[11px]">#{idx + 1} {tp.name}</span>
                        <button
                          type="button"
                          onClick={() => deleteTourPoint(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={tp.name}
                          onChange={(e) => updateTourPoint(idx, { name: e.target.value })}
                          placeholder="Stop Name"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                        />
                        <input
                          type="text"
                          value={tp.category}
                          onChange={(e) => updateTourPoint(idx, { category: e.target.value })}
                          placeholder="Category (e.g. Academic)"
                          className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-white text-[11px]"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={tp.description}
                        onChange={(e) => updateTourPoint(idx, { description: e.target.value })}
                        placeholder="Panorama Description..."
                        className="w-full bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[10px] resize-none"
                      />
                      <div className="flex space-x-1.5">
                        <input
                          type="text"
                          value={tp.image}
                          onChange={(e) => updateTourPoint(idx, { image: e.target.value })}
                          placeholder="Panorama Image URL"
                          className="flex-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-slate-400 font-mono text-[9px]"
                        />
                        <button
                          type="button"
                          onClick={() => triggerImageUpload("tour", undefined, undefined, undefined, undefined, undefined, undefined, idx)}
                          className="px-2 py-1 bg-slate-800 text-amber-400 rounded text-[10px] font-bold"
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPLY ONLINE STUDIO */}
          {activeInspectorTab === "apply_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  ⚡ Online Admission Registration
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure admission session, helpline contacts, and mandatory checklist.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/admin/forms"
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-bold flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Customize Form Fields in Form Builder →</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Academic Session</label>
                    <input
                      type="text"
                      value={page.customStyles?.sessionYear || "2026-2027"}
                      onChange={(e) =>
                        onChange({ ...page, customStyles: { ...page.customStyles, sessionYear: e.target.value } })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Helpline Phone</label>
                    <input
                      type="text"
                      value={page.customStyles?.helplinePhone || "+91 1905 222 555"}
                      onChange={(e) =>
                        onChange({ ...page, customStyles: { ...page.customStyles, helplinePhone: e.target.value } })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Helpline Email</label>
                  <input
                    type="text"
                    value={page.customStyles?.helplineEmail || "admissions@cismandi.edu.in"}
                    onChange={(e) =>
                      onChange({ ...page, customStyles: { ...page.customStyles, helplineEmail: e.target.value } })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-mono text-[10px]"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Mandatory Documents ({applyDocsList.length})</span>
                    <button
                      type="button"
                      onClick={addApplyDoc}
                      className="text-[10px] text-amber-400 font-bold hover:underline"
                    >
                      + Add Doc
                    </button>
                  </div>
                  {applyDocsList.map((doc, idx) => (
                    <div key={idx} className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={doc}
                        onChange={(e) => updateApplyDoc(idx, e.target.value)}
                        className="flex-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => deleteApplyDoc(idx)}
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

          {/* TAB: NEWS STUDIO */}
          {activeInspectorTab === "news_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <span className="font-extrabold text-blue-400 uppercase tracking-wider block">
                  📰 School News & Circulars
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Publish notices, official circulars, exam notifications, and school alerts.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={addNewsItem}
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Circular / Notice</span>
                </button>

                <div className="space-y-2">
                  {newsItemsList.map((item, idx) => (
                    <div key={item.id || idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={item.badge}
                          onChange={(e) => updateNewsItem(idx, { badge: e.target.value })}
                          className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold text-[10px] w-24 border border-blue-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => deleteNewsItem(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => updateNewsItem(idx, { date: e.target.value })}
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400 text-[10px]"
                      />
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateNewsItem(idx, { title: e.target.value })}
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                      />
                      <textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => updateNewsItem(idx, { summary: e.target.value })}
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[10px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: EVENTS STUDIO */}
          {activeInspectorTab === "events_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  📅 School Events & Calendar
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Schedule upcoming celebrations, sports galas, and parent gatherings.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={addEvent}
                  className="w-full py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Event</span>
                </button>

                <div className="space-y-2">
                  {eventsList.map((ev, idx) => (
                    <div key={ev.id || idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={ev.date}
                            onChange={(e) => updateEvent(idx, { date: e.target.value })}
                            className="w-10 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-amber-400 font-bold text-center text-[10px]"
                          />
                          <input
                            type="text"
                            value={ev.month}
                            onChange={(e) => updateEvent(idx, { month: e.target.value })}
                            className="w-12 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-white font-bold text-center text-[10px]"
                          />
                          <input
                            type="text"
                            value={ev.badge}
                            onChange={(e) => updateEvent(idx, { badge: e.target.value })}
                            className="w-20 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 text-[10px]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteEvent(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => updateEvent(idx, { title: e.target.value })}
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                      />
                      <input
                        type="text"
                        value={ev.venue}
                        onChange={(e) => updateEvent(idx, { venue: e.target.value })}
                        placeholder="Venue..."
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400 text-[10px]"
                      />
                      <textarea
                        rows={2}
                        value={ev.description}
                        onChange={(e) => updateEvent(idx, { description: e.target.value })}
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[10px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: DOWNLOADS STUDIO */}
          {activeInspectorTab === "downloads_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider block">
                  📥 Official Documents & Downloads
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage downloadable PDF circulars, forms, syllabus, and parent handbooks.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={addDownloadDoc}
                  className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Download Document</span>
                </button>

                <div className="space-y-2">
                  {downloadDocsList.map((doc, idx) => (
                    <div key={doc.id || idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={doc.category}
                          onChange={(e) => updateDownloadDoc(idx, { category: e.target.value })}
                          className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold text-[10px] w-28 border border-emerald-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => deleteDownloadDoc(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={doc.title}
                        onChange={(e) => updateDownloadDoc(idx, { title: e.target.value })}
                        placeholder="Document Title"
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={doc.fileUrl}
                          onChange={(e) => updateDownloadDoc(idx, { fileUrl: e.target.value })}
                          placeholder="File URL (/uploads/...)"
                          className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400 font-mono text-[9px]"
                        />
                        <input
                          type="text"
                          value={doc.fileSize}
                          onChange={(e) => updateDownloadDoc(idx, { fileSize: e.target.value })}
                          placeholder="Size (e.g. 2.4 MB)"
                          className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400 text-[10px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CAREERS STUDIO */}
          {activeInspectorTab === "careers_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                <span className="font-extrabold text-purple-400 uppercase tracking-wider block">
                  💼 Careers & Job Openings
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Publish teaching vacancies, administrative roles, and HR application instructions.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">HR Recruiter Email</label>
                  <input
                    type="text"
                    value={page.customStyles?.hrEmail || "careers@cismandi.edu.in"}
                    onChange={(e) =>
                      onChange({ ...page, customStyles: { ...page.customStyles, hrEmail: e.target.value } })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-mono text-[10px]"
                  />
                </div>

                <button
                  type="button"
                  onClick={addJobOpening}
                  className="w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-xl font-bold flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Job Vacancy</span>
                </button>

                <div className="space-y-2">
                  {jobOpeningsList.map((job, idx) => (
                    <div key={job.id || idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={job.badge}
                          onChange={(e) => updateJobOpening(idx, { badge: e.target.value })}
                          className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold text-[10px] w-28 border border-purple-500/30"
                        />
                        <button
                          type="button"
                          onClick={() => deleteJobOpening(idx)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={job.title}
                        onChange={(e) => updateJobOpening(idx, { title: e.target.value })}
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-white font-bold text-[11px]"
                      />
                      <textarea
                        rows={2}
                        value={job.description}
                        onChange={(e) => updateJobOpening(idx, { description: e.target.value })}
                        placeholder="Job Description..."
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-300 text-[10px] resize-none"
                      />
                      <input
                        type="text"
                        value={job.requirements}
                        onChange={(e) => updateJobOpening(idx, { requirements: e.target.value })}
                        placeholder="Qualifications & Experience..."
                        className="w-full bg-slate-900 px-2 py-1 rounded border border-slate-800 text-slate-400 text-[10px]"
                      />
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 text-[10px]">Deadline:</span>
                        <input
                          type="text"
                          value={job.deadline}
                          onChange={(e) => updateJobOpening(idx, { deadline: e.target.value })}
                          className="flex-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-white text-[10px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: COMPLIANCE STUDIO */}
          {activeInspectorTab === "compliance_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <span className="font-extrabold text-amber-400 uppercase tracking-wider block">
                  ⚖️ CBSE Regulatory & Compliance Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure mandatory disclosure affiliation metrics and official declarations.
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Affiliation No.</label>
                    <input
                      type="text"
                      value={page.customStyles?.affiliationNo || "630198"}
                      onChange={(e) =>
                        onChange({ ...page, customStyles: { ...page.customStyles, affiliationNo: e.target.value } })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">School Code</label>
                    <input
                      type="text"
                      value={page.customStyles?.schoolCode || "43187"}
                      onChange={(e) =>
                        onChange({ ...page, customStyles: { ...page.customStyles, schoolCode: e.target.value } })
                      }
                      className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Principal Name</label>
                  <input
                    type="text"
                    value={page.customStyles?.principalName || "Dr. Rajesh Sharma"}
                    onChange={(e) =>
                      onChange({ ...page, customStyles: { ...page.customStyles, principalName: e.target.value } })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Official School Address</label>
                  <textarea
                    rows={2}
                    value={page.customStyles?.schoolAddress || "Near Victoria Bridge, Mandi, Himachal Pradesh 175001"}
                    onChange={(e) =>
                      onChange({ ...page, customStyles: { ...page.customStyles, schoolAddress: e.target.value } })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white resize-none"
                  />
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                  <span className="font-bold text-amber-400 block text-[11px]">CBSE Mandatory Disclosure PDF</span>
                  <p className="text-[10px] text-slate-400">
                    The complete CBSE compliance document can be downloaded or updated directly in the Downloads studio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACT STUDIO */}
          {activeInspectorTab === "contact_studio" && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <span className="font-extrabold text-blue-400 uppercase tracking-wider block">
                  📍 School Contact Information Studio
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Manage contact header, office hours, and direct links to global settings.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/admin/settings"
                  className="w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-bold flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Configure Official Phone & Emails in Settings →</span>
                </Link>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Contact Page Title</label>
                  <input
                    type="text"
                    value={page.heroTitle || "Connect with Cambridge Mandi"}
                    onChange={(e) => onChange({ ...page, heroTitle: e.target.value })}
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Subtitle Description</label>
                  <textarea
                    rows={2}
                    value={page.heroSubtitle || "We welcome your inquiries regarding admissions, campus tours, academic curriculum, and career opportunities."}
                    onChange={(e) => onChange({ ...page, heroSubtitle: e.target.value })}
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Office Timings</label>
                  <input
                    type="text"
                    value={page.customStyles?.officeHours || "Monday – Saturday: 8:00 AM – 4:00 PM"}
                    onChange={(e) =>
                      onChange({ ...page, customStyles: { ...page.customStyles, officeHours: e.target.value } })
                    }
                    className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 text-white"
                  />
                </div>
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
