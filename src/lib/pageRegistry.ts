export interface SectionItem {
  title: string;
  description: string;
  image?: string;
  badge?: string;
  link?: string;
  icon?: string;
  imageSize?: "small" | "medium" | "large" | "full";
  imageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "auto";
  imageRounding?: "none" | "md" | "2xl" | "full";
}

export interface SectionBlock {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  badge?: string;
  layout?: "grid_3" | "grid_2" | "grid_4" | "split" | "list";
  items: SectionItem[];
}

export interface DocumentAttachment {
  id?: string;
  title: string;
  fileUrl: string;
  category?: string;
  fileSize?: string;
}

export interface StatMetric {
  number: string;
  label: string;
  icon?: string;
}

export interface CustomStyles {
  accentColor?: string;
  bgColor?: string;
  fontFamily?: string;
  textColor?: string;
  storyHeadline?: string;
  mainStory?: string;
  authorName?: string;
  authorTitle?: string;
  authorOrg?: string;
  authorImage?: string;
  authorImageSize?: "small" | "medium" | "large" | "full";
  authorImageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "auto";
  authorImageRounding?: "none" | "md" | "2xl" | "full";
  quote?: string;
  quoteAuthor?: string;
  documents?: DocumentAttachment[];
  stats?: StatMetric[];
}

export interface PageRecord {
  slug: string;
  pageName: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroMediaType: string;
  heroVideoUrl?: string;
  heroOverlayOpacity: number;
  heroCtaText: string;
  heroCtaLink: string;
  sections: SectionBlock[];
  customStyles: CustomStyles;
  isPublished: boolean;
}

export const DEFAULT_PAGE_REGISTRY: Record<string, PageRecord> = {
  // 1. HOME
  home: {
    slug: "home",
    pageName: "Home Page",
    heroBadge: "CBSE Affiliated #630198 • Admissions 2025-26 Open",
    heroTitle: "Inspiring Excellence Amidst Himalayan Serenity",
    heroSubtitle: "Himachal Pradesh's premier Cambridge & CBSE day-cum-boarding institution empowering tomorrow's innovators with smart tech, Olympic sports, and cultural ethos.",
    heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
    heroMediaType: "VIDEO",
    heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-school-campus-41551-large.mp4",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Apply for Admission 2025-26",
    heroCtaLink: "/admissions/apply",
    sections: [
      {
        id: "home_sec_1",
        type: "features_grid",
        title: "Pillars of Academic Distinction",
        subtitle: "A fusion of Cambridge analytical rigor and CBSE excellence.",
        badge: "Why Cambridge Mandi",
        layout: "grid_3",
        items: [
          {
            title: "Smart Digital Classrooms",
            description: "4K interactive digital podiums, immersive visual audio learning, and AI-enabled curriculum delivery.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "EdTech Benchmark",
            link: "/facilities/smart-classrooms",
          },
          {
            title: "Robotics & Innovation Lab",
            description: "Hands-on 3D printing, IoT sensors, drone prototyping, and national championship winning team.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "STEM Gold Medalists",
            link: "/facilities/robotics-lab",
          },
          {
            title: "Olympic Sports Complex",
            description: "All-weather heated indoor swimming pool, FIFA-standard turf, and synthetic badminton courts.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Sports Academy",
            link: "/facilities/sports-complex",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Welcome to Cambridge International School, Mandi",
      mainStory: "Established with the vision of imparting global standard education in the serene valley of Mandi, Himachal Pradesh, CIS Mandi combines intellectual rigor with holistic character development.\n\nOur lush 10-acre campus nestled in the Himalayas offers a nurturing sanctuary where students discover their passions, hone critical thinking, and build lifelong leadership skills.",
      authorName: "Dr. Sunita Sharma",
      authorTitle: "Principal & Academic Director",
      authorOrg: "Cambridge International School Mandi",
      authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
      quote: '"Education is not the learning of facts, but the training of the mind to think."',
      quoteAuthor: "Albert Einstein",
      stats: [
        { number: "100%", label: "CBSE Board Pass Rate" },
        { number: "15:1", label: "Student-Teacher Ratio" },
        { number: "10+ Acres", label: "Himalayan Campus" },
        { number: "25+", label: "Advanced Labs & Studios" },
      ],
      documents: [
        {
          id: "doc_home_1",
          title: "Cambridge Mandi Information Prospectus 2025-26.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Prospectus",
          fileSize: "2.8 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 2. PRINCIPAL'S DESK
  "principal-message": {
    slug: "principal-message",
    pageName: "Principal's Desk",
    heroBadge: "Principal's Welcome Desk • Academic Leadership",
    heroTitle: "Fostering Curiosity, Character & Excellence",
    heroSubtitle: "Welcome to an educational sanctuary where every child's innate potential is recognized, nurtured, and elevated to global benchmarks.",
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600",
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Read Academic Roadmap",
    heroCtaLink: "/academics",
    sections: [
      {
        id: "pm_sec_1",
        type: "features_grid",
        title: "Our Academic Imperatives",
        subtitle: "Key foundational pillars steering CIS Mandi towards global distinction.",
        badge: "Pedagogical Ethos",
        layout: "grid_3",
        items: [
          {
            title: "Inquiry-Based Learning",
            description: "Empowering children to ask profound questions, analyze evidence, and articulate creative solutions.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Inquiry",
            link: "/academics",
          },
          {
            title: "Emotional & Ethical Well-Being",
            description: "Mentorship-driven house system emphasizing empathy, mental resilience, and mutual respect.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Holistic Care",
            link: "/student-life",
          },
          {
            title: "Future-Ready Skills",
            description: "Early immersion into AI literacy, computational robotics, public speaking, and sustainable design.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Innovation",
            link: "/facilities/robotics-lab",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Welcome to Cambridge International School Mandi",
      mainStory: "At Cambridge International School Mandi, our mission transcends traditional textbook instruction. We aim to kindle an enduring passion for discovery, critical inquiry, and creative expression in every student entrusted to our care.\n\nOur pedagogy marries international academic benchmarks with compassionate values. Through experiential learning in smart classrooms, high-tech robotics innovation labs, and holistic sports development, our students blossom into well-rounded, courageous innovators ready to lead with empathy.\n\nI invite all parents and guardians to walk alongside us in this exhilarating educational odyssey.",
      authorName: "Dr. Sunita Sharma",
      authorTitle: "Principal & Academic Director",
      authorOrg: "Cambridge International School Mandi",
      authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
      quote: '"The mind is not a vessel to be filled, but a fire to be kindled."',
      quoteAuthor: "Plutarch",
      stats: [
        { number: "25+ Yrs", label: "Academic Leadership" },
        { number: "100%", label: "CBSE Distinction Rate" },
        { number: "1:1", label: "Student Mentorship" },
      ],
      documents: [
        {
          id: "doc_pm_1",
          title: "Principal Welcome Note & Academic Vision 2025-26.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Welcome Note",
          fileSize: "1.4 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 3. CHAIRMAN'S MESSAGE
  "chairman-message": {
    slug: "chairman-message",
    pageName: "Chairman's Message",
    heroBadge: "Chairman's Desk • Foundation Ethos",
    heroTitle: "Visionary Leadership & Societal Commitment",
    heroSubtitle: "A personal message from Sh. Arvind Thakur on shaping future leaders with courage, character, and global competence.",
    heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600",
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Discover Our Heritage",
    heroCtaLink: "/about",
    sections: [
      {
        id: "cm_sec_1",
        type: "features_grid",
        title: "Guiding Principles of Our Trust",
        subtitle: "Foundational commitments shaping CIS Mandi since inception.",
        badge: "Core Values",
        layout: "grid_3",
        items: [
          {
            title: "Accessible Global Standards",
            description: "Bringing top-tier international standard schooling to the children of Himachal Pradesh.",
            image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
            badge: "Vision",
            link: "/about",
          },
          {
            title: "World-Class Infrastructure",
            description: "Investing continually in modern laboratories, digital smart boards, and sports complexes.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "Campus",
            link: "/facilities",
          },
          {
            title: "Character & Ethical Foundation",
            description: "Instilling deep societal values, environmental stewardship, and cultural pride.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Ethics",
            link: "/about/mission-vision",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Dear Parents, Educators, and Esteemed Students,",
      mainStory: "It brings me immense joy and pride to welcome you to Cambridge International School, Mandi. When we laid the foundation stone of this institution, our guiding ambition was clear: to bring the highest international standards of learning to the children of Himachal Pradesh without compelling families to seek boarding thousands of miles away.\n\nToday, CIS Mandi stands tall as a beacon of academic distinction, technological innovation, and ethical uprightness. We understand that the 21st-century world demands far more than rote memorization. It requires problem-solvers, resilient innovators, ethical decision-makers, and compassionate citizens.\n\nOur 10-acre Himalayan campus provides the optimal synthesis of physical fitness, mental agility, and spiritual peace. I invite you to partner with us in this noble mission of sculpting young minds.",
      authorName: "Sh. Arvind Thakur",
      authorTitle: "Chairman & Managing Trustee",
      authorOrg: "Cambridge Education Foundation",
      authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
      quote: '"Education is the most powerful weapon which you can use to change the world."',
      quoteAuthor: "Nelson Mandela",
      stats: [
        { number: "2010", label: "Year Founded" },
        { number: "10+ Acres", label: "Campus Area" },
        { number: "2500+", label: "Alumni Worldwide" },
      ],
      documents: [
        {
          id: "doc_cm_1",
          title: "Chairman Vision & Foundation Statement.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Vision Document",
          fileSize: "1.2 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 4. ABOUT US
  about: {
    slug: "about",
    pageName: "About Cambridge Mandi",
    heroBadge: "About Cambridge Mandi • Himalayan Sanctuary",
    heroTitle: "A Legacy of Academic Benchmark & Values",
    heroSubtitle: "Nestled in the majestic Himalayan valley of Mandi, Cambridge International School is an educational sanctuary fostering intellectual curiosity and global perspective.",
    heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Explore Campus Facilities",
    heroCtaLink: "/facilities",
    sections: [
      {
        id: "about_sec_1",
        type: "features_grid",
        title: "Distinctive Hallmarks of CIS Mandi",
        subtitle: "What makes our Himalayan learning sanctuary unique.",
        badge: "Our Hallmarks",
        layout: "grid_3",
        items: [
          {
            title: "Himalayan Sanctuary",
            description: "Pollution-free 10-acre green campus fostering serenity, physical well-being, and mental clarity.",
            image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
            badge: "Location",
            link: "/facilities",
          },
          {
            title: "Cambridge & CBSE Rigor",
            description: "Seamlessly combining CBSE national curriculum excellence with international inquiry-based learning.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Academics",
            link: "/academics",
          },
          {
            title: "Advanced STEM & Robotics",
            description: "Equipped with state-of-the-art innovation labs, AI robotics workstations, and 3D printing suites.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Technology",
            link: "/facilities/robotics-lab",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Nurturing Global Thinkers & Ethical Leaders",
      mainStory: "Cambridge International School, Mandi was established with the vision of offering world-class education rooted in traditional values.\n\nFrom modern smart classrooms and high-tech science laboratories to Olympic-grade sports infrastructure, every aspect of our campus is designed to unlock each student's highest potential.",
      authorName: "Dr. Sunita Sharma",
      authorTitle: "Principal & Academic Director",
      authorOrg: "Cambridge International School Mandi",
      authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
      quote: '"The greatest glory in living lies not in never falling, but in rising every time we fall."',
      quoteAuthor: "Nelson Mandela",
      stats: [
        { number: "100%", label: "CBSE Pass Rate" },
        { number: "15:1", label: "Student-Teacher Ratio" },
        { number: "10+ Acres", label: "Campus Greenery" },
      ],
      documents: [
        {
          id: "doc_about_1",
          title: "School Information Brochure & Heritage Profile.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Brochure",
          fileSize: "2.5 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 5. CAMPUS & FACILITIES
  facilities: {
    slug: "facilities",
    pageName: "Campus & Facilities",
    heroBadge: "World-Class Infrastructure • 10-Acre Campus",
    heroTitle: "State-of-the-Art Infrastructure & Learning Spaces",
    heroSubtitle: "Explore our sprawling 10-acre Himalayan campus equipped with 4K smart classrooms, AI robotics laboratories, Olympic swimming pool, and residential boarding.",
    heroImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600",
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Take 360° Virtual Tour",
    heroCtaLink: "/virtual-tour",
    sections: [
      {
        id: "fac_sec_1",
        type: "features_grid",
        title: "Campus Facilities Directory",
        subtitle: "Benchmark infrastructure engineered for academic, scientific, and athletic distinction.",
        badge: "Infrastructure",
        layout: "grid_3",
        items: [
          {
            title: "Smart Classrooms",
            description: "Interactive 4K smart digital podiums and audio-visual multimedia teaching panels.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "Classrooms",
            link: "/facilities/smart-classrooms",
          },
          {
            title: "Science & AI Labs",
            description: "Specialized Physics, Chemistry, Biology, and Biotechnology research laboratories.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            badge: "Laboratories",
            link: "/facilities/science-labs",
          },
          {
            title: "Olympic Sports Complex",
            description: "Heated indoor aquatic pool, synthetic athletic track, and FIFA standard football arena.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Sports Complex",
            link: "/facilities/sports-complex",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Built for Excellence, Safety & Inspiration",
      mainStory: "Our campus infrastructure is meticulously crafted to support holistic student growth. We ensure 24x7 CCTV surveillance, GPS-enabled transport fleet, modern dining halls, and clean air in a scenic Himalayan setting.",
      stats: [
        { number: "10 Acres", label: "Campus Footprint" },
        { number: "40+", label: "Smart Classrooms" },
        { number: "6", label: "Specialized Science & Tech Labs" },
        { number: "100%", label: "Power & CCTV Backed" },
      ],
      documents: [
        {
          id: "doc_fac_1",
          title: "Campus Infrastructure & Lab Specifications.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Specifications",
          fileSize: "3.1 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 6. ACADEMICS
  academics: {
    slug: "academics",
    pageName: "Academic Curriculum",
    heroBadge: "Integrated CBSE & Cambridge Framework",
    heroTitle: "Academic Excellence & Experiential Discovery",
    heroSubtitle: "Comprehensive academic roadmap from Pre-Primary kindergarten to Senior Secondary Grade 12 in Science, Commerce, and Humanities.",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600",
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Download Syllabus & Calendar",
    heroCtaLink: "/downloads",
    sections: [
      {
        id: "acad_sec_1",
        type: "features_grid",
        title: "Academic Wings & Stages",
        subtitle: "Tailored pedagogical approaches for every developmental milestone.",
        badge: "Academic Wings",
        layout: "grid_4",
        items: [
          {
            title: "Pre-Primary (Early Years)",
            description: "Montessori-inspired play and sensory discovery for Nursery to UKG.",
            image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800",
            badge: "Early Years",
            link: "/academics/pre-primary",
          },
          {
            title: "Primary Wing (Grades 1-5)",
            description: "Foundational conceptual mastery in numeracy, languages, and sciences.",
            image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800",
            badge: "Primary",
            link: "/academics/primary",
          },
          {
            title: "Middle School (Grades 6-8)",
            description: "STEM innovation, analytical reasoning, and interdisciplinary projects.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Middle School",
            link: "/academics/middle-school",
          },
          {
            title: "Senior Secondary (Grades 9-12)",
            description: "Rigorous board preparation in Medical, Non-Med, Commerce, and Humanities.",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
            badge: "Senior Secondary",
            link: "/academics/senior-secondary",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Empowering Inquisitive Minds & Global Scholars",
      mainStory: "Our academic curriculum integrates national CBSE rigor with experiential learning frameworks. We nurture deep conceptual comprehension, scientific inquiry, and ethical leadership.",
      stats: [
        { number: "100%", label: "Board Results Pass Rate" },
        { number: "95%+", label: "Top Scorers Bracket" },
        { number: "15:1", label: "Individual Focus Ratio" },
      ],
      documents: [
        {
          id: "doc_acad_1",
          title: "CBSE Curriculum & Assessment Framework 2025-26.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Curriculum Guide",
          fileSize: "2.1 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 7. ADMISSIONS
  admissions: {
    slug: "admissions",
    pageName: "Admissions Hub",
    heroBadge: "Session 2025-26 Admissions Open • Nursery to Grade XI",
    heroTitle: "Begin Your Educational Journey at Cambridge Mandi",
    heroSubtitle: "Explore our admission procedure, fee schedule, eligibility criteria, and register online for the upcoming academic session.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Fill Online Registration Form",
    heroCtaLink: "/admissions/apply",
    sections: [
      {
        id: "adm_sec_1",
        type: "features_grid",
        title: "Admission Information & Quick Links",
        subtitle: "Everything you need to know about enrollment, scholarships, and fees.",
        badge: "Admissions",
        layout: "grid_3",
        items: [
          {
            title: "Admission Procedure",
            description: "Step-by-step guide to application submission, interactive session, and seat confirmation.",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            badge: "Step-by-Step",
            link: "/admissions/procedure",
          },
          {
            title: "Fees Structure & Schedule",
            description: "Transparent breakdown of tuition, transport, boarding, and payment milestones.",
            image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
            badge: "Fee Schedule",
            link: "/admissions/fees-structure",
          },
          {
            title: "Scholarships & Fee Concessions",
            description: "Merit scholarships, sports excellence awards, and sibling concessions.",
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
            badge: "Scholarships",
            link: "/admissions/scholarships",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Welcome Prospective Students & Families",
      mainStory: "We look forward to welcoming you into the Cambridge International School family. Our transparent admissions process is designed to understand your child's aspirations and unique gifts.",
      stats: [
        { number: "OPEN", label: "Admissions Status" },
        { number: "2025-26", label: "Academic Session" },
        { number: "Nursery - XI", label: "Grades Offered" },
      ],
      documents: [
        {
          id: "doc_adm_1",
          title: "Admissions Policy & Guidelines Handbook 2025-26.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Admission Handbook",
          fileSize: "1.9 MB",
        },
      ],
    },
    isPublished: true,
  },
};

/**
 * Returns default page record for any slug with sensible fallbacks
 */
export function getPageDefault(slug: string, metaName?: string, metaDesc?: string): PageRecord {
  if (DEFAULT_PAGE_REGISTRY[slug]) {
    return DEFAULT_PAGE_REGISTRY[slug];
  }

  const cleanName = metaName ? metaName.replace(/[^a-zA-Z0-9 &]/g, "").trim() : slug;
  return {
    slug,
    pageName: cleanName,
    heroBadge: `${cleanName} • Cambridge International School`,
    heroTitle: cleanName,
    heroSubtitle: metaDesc || "Empowering students with benchmark curriculum, smart labs, and sports excellence in Mandi, HP.",
    heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Explore More",
    heroCtaLink: "/about",
    sections: [
      {
        id: `sec_${Date.now()}`,
        type: "features_grid",
        title: "Highlights & Distinctions",
        subtitle: "World-class curriculum, technology-enabled learning, and holistic growth.",
        badge: "Overview",
        layout: "grid_2",
        items: [
          {
            title: "Modern Infrastructure",
            description: "4K smart classrooms, experiential laboratories, and sports grounds.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "Infrastructure",
            link: "/facilities",
          },
          {
            title: "Holistic Development",
            description: "Nurturing sports, performing arts, and character building.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Holistic",
            link: "/student-life",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: `Welcome to ${cleanName}`,
      mainStory: `Cambridge International School, Mandi is dedicated to providing world-class education rooted in strong ethical values, global benchmarks, and experiential discovery.\n\nOur campus fosters critical inquiry, emotional intelligence, and leadership across academics, arts, and athletics.`,
      authorName: "Dr. Sunita Sharma",
      authorTitle: "Principal & Academic Director",
      authorOrg: "Cambridge International School Mandi",
      authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
      quote: '"The mind is not a vessel to be filled, but a fire to be kindled."',
      quoteAuthor: "Plutarch",
      stats: [
        { number: "100%", label: "CBSE Distinction Rate" },
        { number: "15:1", label: "Student-Teacher Ratio" },
      ],
      documents: [
        {
          id: `doc_${slug}_1`,
          title: `${cleanName} - Official Guide & Circular.pdf`,
          fileUrl: "/uploads/prospectus.pdf",
          category: "Official Document",
          fileSize: "1.8 MB",
        },
      ],
    },
    isPublished: true,
  };
}
