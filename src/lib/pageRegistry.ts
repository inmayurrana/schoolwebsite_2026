export interface SectionItem {
  id?: string;
  title: string;
  description: string;
  image?: string;
  badge?: string;
  link?: string;
  icon?: string;
  imageSize?: "tiny" | "small" | "medium" | "large" | "xl" | "full";
  imageHeight?: number;
  imageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "21/9" | "auto";
  imageRounding?: "none" | "md" | "2xl" | "full";
  imagePosition?: "top" | "left" | "right" | "bottom" | "background";
  imageFit?: "cover" | "contain" | "fill";
  badgeColor?: "amber" | "emerald" | "blue" | "purple" | "rose";
  bgColor?: string;
  textColor?: string;
  titleColor?: string;
  descColor?: string;
  titleSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  fontSize?: "xs" | "sm" | "base" | "lg" | "xl";
  textAlign?: "left" | "center" | "right" | "justify";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full" | string;
  borderWidth?: number;
  borderColor?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "glow" | "neon" | "deep3d" | "purple" | "emerald" | string;
  hoverEffect?: "none" | "lift" | "scale" | "glow" | "border";
  buttonText?: string;
  buttonLink?: string;
  buttonStyle?: "solid" | "outline" | "ghost";
  buttonVariant?: "solid" | "outline" | "glass";
  layout?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: "normal" | "italic";
  letterSpacing?: string;
  lineHeight?: string;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  bgGradient?: string;
  backdropBlur?: "none" | "sm" | "md" | "lg" | "xl" | string;
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";
  videoUrl?: string;
  videoType?: "youtube" | "mp4";
  documentUrl?: string;
  documentTitle?: string;
  documentSize?: string;
  effect3D?: "none" | "tilt" | "float" | "card3d" | "glass" | "depth";
  animation?: "none" | "fade" | "slide-up" | "slide-left" | "slide-right" | "zoom" | "bounce" | "pulse" | "flip";
  interactive3D?: boolean;
}

export interface SectionBlock {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: "amber" | "emerald" | "blue" | "purple" | "rose";
  layout?: "grid_1" | "grid_2" | "grid_3" | "grid_4" | "split" | "list" | "banner" | "faq" | "stats" | "cta";
  bgColor?: string;
  bgGradient?: string;
  bgImage?: string;
  bgVideoUrl?: string;
  bgOverlayOpacity?: number;
  textColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  paddingY?: "compact" | "normal" | "spacious" | "none";
  borderRadius?: "none" | "md" | "2xl" | "3xl" | string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "glow" | string;
  backdropBlur?: "none" | "sm" | "md" | "lg" | "xl" | string;
  fontFamily?: string;
  animation?: "none" | "fade" | "slide-up" | "slide-left" | "slide-right" | "zoom" | "bounce" | "pulse" | "flip" | string;
  effect3D?: "none" | "tilt" | "float" | "card3d" | "glass" | "depth" | string;
  show3DCampus?: boolean;
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
  chairmanName?: string;
  chairmanTitle?: string;
  chairmanOrg?: string;
  chairmanImage?: string;
  chairmanQuote?: string;
  chairmanMessage?: string;
  chairmanBadge1?: string;
  chairmanBadge2?: string;
  principalName?: string;
  principalTitle?: string;
  principalOrg?: string;
  principalImage?: string;
  principalQuote?: string;
  principalMessage?: string;
  principalBadge1?: string;
  principalBadge2?: string;
  authorName?: string;
  authorTitle?: string;
  authorOrg?: string;
  authorImage?: string;
  authorImageSize?: "tiny" | "small" | "medium" | "large" | "xl" | "full";
  authorImageHeight?: number;
  authorImageRatio?: "16/9" | "4/3" | "1/1" | "3/4" | "auto";
  authorImageRounding?: "none" | "md" | "2xl" | "full";
  quote?: string;
  quoteAuthor?: string;
  visionText?: string;
  missionText?: string;
  documents?: DocumentAttachment[];
  stats?: StatMetric[];
  [key: string]: any;
}

export interface PageRecord {
  slug: string;
  pageName: string;
  heroBadge: string;
  heroBadgeColor?: "amber" | "emerald" | "blue" | "purple" | "rose";
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImageHeight?: number;
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
    heroBadge: "CBSE Affiliated No. 630198 • Admissions Open 2027–28",
    heroBadgeColor: "amber",
    heroTitle: "EDUCATING FOR A BETTER WORLD",
    heroSubtitle: "At Cambridge International School, Mandi, we blend Cambridge inquiry-based pedagogy, STEM innovation labs, and Olympic sports to nurture visionary thinkers and compassionate global leaders.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 480,
    heroMediaType: "VIDEO",
    heroVideoUrl: "https://youtu.be/slAltokCyL0",
    heroOverlayOpacity: 0.35,
    heroCtaText: "Apply for Admission 2027",
    heroCtaLink: "/admissions/apply",
    sections: [
      {
        id: "home_sec_1",
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
      },
      {
        id: "home_sec_2",
        type: "modular_cards",
        title: "Academic Continuum & Wings",
        subtitle: "Tailored developmental learning from early years kindergarten to Grade 12 board distinctions.",
        badge: "Curriculum Pathways",
        badgeColor: "emerald",
        layout: "grid_4",
        items: [
          {
            title: "Pre-Primary (Early Years)",
            description: "Montessori-inspired experiential play and sensory motor discovery.",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
            badge: "Ages 3-5",
            badgeColor: "amber",
            link: "/academics/pre-primary",
            imageSize: "medium",
            imageHeight: 160,
            imageRatio: "16/9",
            imageRounding: "2xl",
          },
          {
            title: "Primary Wing (Grades 1-5)",
            description: "Conceptual literacy, numeracy, and scientific inquiry foundations.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Grades 1-5",
            badgeColor: "blue",
            link: "/academics/primary",
            imageSize: "medium",
            imageHeight: 160,
            imageRatio: "16/9",
            imageRounding: "2xl",
          },
          {
            title: "Middle School (Grades 6-8)",
            description: "Analytical STEM inquiry, foreign languages, and digital coding fundamentals.",
            image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
            badge: "Grades 6-8",
            badgeColor: "emerald",
            link: "/academics/middle-school",
            imageSize: "medium",
            imageHeight: 160,
            imageRatio: "16/9",
            imageRounding: "2xl",
          },
          {
            title: "Senior Secondary (Grades 9-12)",
            description: "Medical, Non-Med, Commerce, and Humanities streams with JEE/NEET mentorship.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Grades 9-12",
            badgeColor: "purple",
            link: "/academics/senior-secondary",
            imageSize: "medium",
            imageHeight: 160,
            imageRatio: "16/9",
            imageRounding: "2xl",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Messages from Our Leadership",
      chairmanName: "Sh. Bhim Singh Jamwal",
      chairmanTitle: "Chairman & Managing Trustee",
      chairmanOrg: "Cambridge Education Foundation",
      chairmanImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      chairmanQuote: '"Education is the most powerful weapon which you can use to change the world."',
      chairmanMessage: "When we founded Cambridge International School Mandi, our guiding ambition was clear: to bring the highest international benchmarks of holistic education to Himachal Pradesh. We are dedicated to sculpting confident global leaders grounded in strong ethical values, innovative inquiry, and Himalayan resilience.",
      chairmanBadge1: "",
      chairmanBadge2: "",
      principalName: "Mrs. Priyanka Jamwal",
      principalTitle: "Principal & Academic Director",
      principalOrg: "Cambridge International School Mandi",
      principalImage: "/uploads/Mrs_-Priyanka-Jamwal_cb184dc05893.webp",
      principalQuote: '"The mind is not a vessel to be filled, but a fire to be kindled."',
      principalMessage: "At Cambridge International School Mandi, our mission transcends traditional textbook instruction. We kindle an enduring passion for discovery, critical inquiry, and creative expression to empower every child to turn challenges into launching pads for greatness and global benchmark achievement.",
      principalBadge1: "",
      principalBadge2: "",
      stats: [
        { number: "2,500+", label: "Happy Students" },
        { number: "150+", label: "Expert Faculty" },
        { number: "98.4%", label: "Distinction Rate" },
        { number: "45+", label: "State & National Awards" },
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

  // 2. ABOUT US
  about: {
    slug: "about",
    pageName: "About Cambridge Mandi",
    heroBadge: "About Cambridge Mandi • Himalayan Sanctuary",
    heroBadgeColor: "amber",
    heroTitle: "A Legacy of Academic Benchmark & Values",
    heroSubtitle: "Nestled in the majestic Himalayan valley of Mandi, Cambridge International School is an educational sanctuary fostering intellectual curiosity and global perspective.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
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
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "Himalayan Sanctuary",
            description: "Pollution-free 10-acre green campus fostering serenity, physical well-being, and mental clarity.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Location",
            badgeColor: "emerald",
            link: "/facilities",
            imageSize: "medium",
            imageHeight: 180,
          },
          {
            title: "Cambridge & CBSE Rigor",
            description: "Seamlessly combining CBSE national curriculum excellence with international inquiry-based learning.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Academics",
            badgeColor: "blue",
            link: "/academics",
            imageSize: "medium",
            imageHeight: 180,
          },
          {
            title: "Advanced STEM & Robotics",
            description: "Equipped with state-of-the-art innovation labs, AI robotics workstations, and 3D printing suites.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Technology",
            badgeColor: "purple",
            link: "/facilities/robotics-lab",
            imageSize: "medium",
            imageHeight: 180,
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "An Inspiring Himalayan Learning Sanctuary",
      mainStory: "Situated in the historic and scenic town of Mandi (known as the 'Varanasi of the Hills'), Cambridge International School Mandi spans a verdant 10-acre campus surrounded by pine-clad mountains and the tranquil Beas river valley.\n\nOur pedagogical philosophy is built on the premise that every student is endowed with unique potential. By synthesizing the rigor of the Central Board of Secondary Education (CBSE Affiliation No. 630198) with progressive Cambridge inquiry methodologies, we foster critical thinking, STEM innovation, artistic expression, and moral character.",
      authorImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
      stats: [
        { number: "2014", label: "Year Founded" },
        { number: "10 Acres", label: "Lush Campus" },
        { number: "100%", label: "CBSE Pass Rate" },
        { number: "15:1", label: "Student-Teacher Ratio" },
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

  // 3. MISSION & VISION
  "mission-vision": {
    slug: "mission-vision",
    pageName: "Mission & Vision",
    heroBadge: "Guiding Ideals • Core Philosophy",
    heroBadgeColor: "blue",
    heroTitle: "Sculpting Leaders of Character, Intellect & Vision",
    heroSubtitle: "Our compass for inspiring dynamic thinkers, ethical citizens, and lifelong learners.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Read Academic Curriculum",
    heroCtaLink: "/academics",
    sections: [
      {
        id: "mv_sec_1",
        type: "features_grid",
        title: "The Three Pillars of Our Vision",
        subtitle: "How our core values guide everyday learning and life at CIS Mandi.",
        badge: "Core Values",
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "Intellectual Rigor",
            description: "Cultivating analytical thinking, deep questioning, and mastery across science, humanities, and arts.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Mind",
            badgeColor: "blue",
            link: "/academics",
          },
          {
            title: "Moral & Ethical Courage",
            description: "Instilling integrity, compassion, humility, and environmental responsibility in every child.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Heart",
            badgeColor: "rose",
            link: "/student-life",
          },
          {
            title: "Global Leadership",
            description: "Empowering students to articulate ideas with conviction and make meaningful contributions worldwide.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Action",
            badgeColor: "emerald",
            link: "/about",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Our Enduring Mission & Vision 2030",
      mainStory: "Our Mission is to provide a nurturing, intellectually stimulating environment that equips learners with the tools to solve complex global challenges while remaining anchored in strong human values.\n\nOur Vision is to be recognized as Himachal Pradesh's premier institution for holistic education, graduating resilient individuals ready to lead with empathy and innovation.",
      authorImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
      stats: [
        { number: "100%", label: "Value-Driven Pedagogy" },
        { number: "Global", label: "Perspective" },
        { number: "Lifelong", label: "Learning Mindset" },
      ],
    },
    isPublished: true,
  },

  // 4. CHAIRMAN'S MESSAGE
  "chairman-message": {
    slug: "chairman-message",
    pageName: "Chairman's Message",
    heroBadge: "Chairman's Desk • Foundation Ethos",
    heroBadgeColor: "amber",
    heroTitle: "Visionary Leadership & Societal Commitment",
    heroSubtitle: "A personal message from Sh. Arvind Thakur on shaping future leaders with courage, character, and global competence.",
    heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Discover Our Heritage",
    heroCtaLink: "/about",
    sections: [],
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

  // 5. PRINCIPAL'S DESK
  "principal-message": {
    slug: "principal-message",
    pageName: "Principal's Desk",
    heroBadge: "Principal's Welcome • Academic Benchmark",
    heroBadgeColor: "blue",
    heroTitle: "Nurturing Curious Minds & Purposeful Leaders",
    heroSubtitle: "A warm address from Principal Mrs. Priyanka Jamwal on fostering holistic excellence, innovative inquiry, and compassionate character.",
    heroImage: "/uploads/Mrs_-Priyanka-Jamwal_0f45e295f9f7.webp",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Explore Academic Curriculum",
    heroCtaLink: "/academics",
    sections: [],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: "Welcome to Cambridge International School, Mandi",
      mainStory: "Dear Students, Parents, and Well-Wishers,\n\nAt Cambridge International School Mandi, we believe every child is born with boundless curiosity and unique brilliance. As educators, our sacred responsibility is to create an environment where questions are welcomed, creativity is nurtured, and students gain the resilience to turn challenges into stepping stones for excellence.\n\nWe provide a balanced educational journey where academic rigor walks hand-in-hand with artistic expression, athletic endurance, and ethical integrity. I invite you to explore our vibrant campus and join us in shaping future leaders.",
      authorName: "Mrs. Priyanka Jamwal",
      authorTitle: "Principal & Academic Director",
      authorOrg: "Cambridge International School Mandi",
      authorImage: "/uploads/Mrs_-Priyanka-Jamwal_0f45e295f9f7.webp",
      quote: '"The mind is not a vessel to be filled, but a fire to be kindled."',
      quoteAuthor: "Plutarch",
      stats: [
        { number: "15+ Yrs", label: "Academic Leadership" },
        { number: "100%", label: "CBSE Distinction Rate" },
        { number: "15:1", label: "Student-Teacher Ratio" },
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

  // 6. FACULTY DIRECTORY
  faculty: {
    slug: "faculty",
    pageName: "Faculty & Mentors Directory",
    heroBadge: "Distinguished Educators",
    heroBadgeColor: "amber",
    heroTitle: "Faculty & Academic Mentors",
    heroSubtitle: "Meet the passionate teachers, subject specialists, and academic leaders fostering curiosity, scientific rigor, and character development at Cambridge Mandi.",
    heroImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Join Our Faculty Team",
    heroCtaLink: "/careers",
    sections: [],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      stat1Value: "58+",
      stat1Label: "Faculty Members",
      stat2Value: "100%",
      stat2Label: "Post-Graduate Certified",
      stat3Value: "14+ Yrs",
      stat3Label: "Avg Lead Experience",
      stat4Value: "1 : 15",
      stat4Label: "Teacher-Student Ratio",
      storyHeadline: "The Heart of Cambridge Mandi: Our Educators",
      mainStory: "At CIS Mandi, we believe that great teachers inspire great learners. Our faculty members undergo regular professional development workshops led by Cambridge and CBSE master trainers to ensure cutting-edge instructional delivery.\n\nWith an outstanding student-teacher ratio of 15:1, every child receives personalized attention, continuous encouragement, and structured academic mentorship.",
      authorImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
      stats: [
        { number: "15:1", label: "Student-Teacher Ratio" },
        { number: "100%", label: "Certified & Trained" },
        { number: "8+ Yrs", label: "Average Experience" },
      ],
      documents: [
        {
          id: "doc_fac_1",
          title: "Faculty Qualifications & Mentorship Charter.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Faculty Directory",
          fileSize: "1.6 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 7. ACADEMICS HUB
  academics: {
    slug: "academics",
    pageName: "Academic Curriculum",
    heroBadge: "Academic Curriculum • Cambridge International School",
    heroBadgeColor: "amber",
    heroTitle: "Academic Curriculum",
    heroSubtitle: "Integrated CBSE & Cambridge framework",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Download Syllabus & Calendar",
    heroCtaLink: "/downloads",
    sections: [],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      affiliationLabel: "CBSE Affiliation No. 630198",
      storyHeadline: "Welcome to Academic Curriculum",
      mainStory: "Integrated CBSE & Cambridge framework. Cambridge International School Mandi fosters an engaging, safe, and academically rigorous environment where every learner thrives.",
      wing1Title: "Pre-Primary (Early Years)",
      wing1Badge: "NURSERY - UKG",
      wing1Desc: "Montessori-inspired play and sensory discovery for Nursery to UKG.",
      wing1Link: "/academics/pre-primary",
      wing2Title: "Primary Wing (Grades 1-5)",
      wing2Badge: "GRADES 1-5",
      wing2Desc: "Foundational conceptual mastery in numeracy, languages, and sciences.",
      wing2Link: "/academics/primary",
      wing3Title: "Middle School (Grades 6-8)",
      wing3Badge: "GRADES 6-8",
      wing3Desc: "STEM innovation, analytical reasoning, and interdisciplinary projects.",
      wing3Link: "/academics/middle-school",
      wing4Title: "Senior Secondary (Grades 9-12)",
      wing4Badge: "GRADES 9-12",
      wing4Desc: "Rigorous board preparation in Medical, Non-Med, Commerce, and Humanities.",
      wing4Link: "/academics/senior-secondary",
      pedagogyBadge: "Pedagogical Edge",
      pedagogyTitle: "Integrated Competitive Exam Coaching & Research Focus",
      pedagogySubtitle: "Tailored preparation seamlessly embedded within the regular school timetable.",
      authorImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
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

  // 8. PRE-PRIMARY WING
  "pre-primary": {
    slug: "pre-primary",
    pageName: "Pre-Primary (Early Years)",
    heroBadge: "Early Years Foundation",
    heroBadgeColor: "amber",
    heroTitle: "Pre-Primary Wing (Nursery, LKG, UKG)",
    heroSubtitle: "A vibrant, joyful wonderland where early curiosity is celebrated and foundational love for discovery is born.",
    heroImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Apply for Pre-Primary",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      wingAgeGroup: "Ages 3 to 5 Years",
      wingHeadline: "The Joyful Foundation for Lifelong Learning",
      wingParagraph1: "At Cambridge International School Mandi, our Pre-Primary wing provides a secure, loving, and intellectually rich sanctuary where young children transition happily from home to school.",
      wingParagraph2: "Our curriculum seamlessly integrates early cognitive milestones, phonics, spatial awareness, musical rhythm, and social emotional intelligence through activity-based learning.",
      wingCtaText: "Apply for Nursery / KG Admission",
      wingCtaLink: "/admissions/apply",
      highlights: [
        "Montessori & Experiential Play-Way Pedagogy",
        "Jolly Phonics Language & Early Literacy System",
        "Theme-based Sensory & Fine Motor Activity Corners",
        "Dedicated Child-Friendly Kindergarten Play Zone & Sandpit",
        "Air-Conditioned Colorful Smart Classrooms with Soft Flooring",
        "Nurturing Female Faculty with 1:12 Teacher-to-Child Ratio",
      ],
      wingHighlights: [
        "Montessori & Experiential Play-Way Pedagogy",
        "Jolly Phonics Language & Early Literacy System",
        "Theme-based Sensory & Fine Motor Activity Corners",
        "Dedicated Child-Friendly Kindergarten Play Zone & Sandpit",
        "Air-Conditioned Colorful Smart Classrooms with Soft Flooring",
        "Nurturing Female Faculty with 1:12 Teacher-to-Child Ratio",
      ],
    },
    isPublished: true,
  },

  // 9. PRIMARY WING
  primary: {
    slug: "primary",
    pageName: "Primary Wing (Grades 1-5)",
    heroBadge: "Foundational Stage",
    heroBadgeColor: "blue",
    heroTitle: "Primary Wing (Grades 1 to 5)",
    heroSubtitle: "Fostering academic confidence, conceptual clarity, and boundless creativity during the critical formative years.",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Primary Admissions",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      accentColor: "#3B82F6",
      fontFamily: "Inter",
      wingAgeGroup: "Ages 6 to 10 Years",
      wingHeadline: "Building Solid Intellectual & Moral Foundations",
      wingParagraph1: "In the Primary Wing of CIS Mandi, education transitions into structured inquiry. Students are encouraged to experiment, ask probing questions, and understand the real-world application of concepts.",
      wingParagraph2: "Our 4K interactive smart classrooms, well-stocked junior library, and dedicated outdoor activity periods ensure that every child develops both high cognitive aptitude and physical stamina.",
      wingCtaText: "Register for Grade 1-5 Admissions",
      wingCtaLink: "/admissions/apply",
      primarySubjects: [
        { name: "English Language Arts", desc: "Grammar, creative writing, public speaking, and reading comprehension" },
        { name: "Mathematics & Logic", desc: "Concept-first arithmetic, geometry, mental math, and Vedic tricks" },
        { name: "Environmental Studies (EVS)", desc: "Scientific curiosity, Himalayan flora & fauna, and conservation" },
        { name: "Second Language (Hindi)", desc: "Literature, poetry, grammar, and expressive articulation" },
        { name: "Digital Coding & ICT", desc: "Block coding with Scratch, digital safety, and typing fluency" },
        { name: "Visual & Performing Arts", desc: "Sketching, Indian classical music, theater drama, and folk dance" },
      ],
    },
    isPublished: true,
  },

  // 10. MIDDLE SCHOOL
  "middle-school": {
    slug: "middle-school",
    pageName: "Middle School (Grades 6-8)",
    heroBadge: "Preparatory & Middle Wing",
    heroBadgeColor: "emerald",
    heroTitle: "Middle School (Grades 6 to 8)",
    heroSubtitle: "Transitioning to advanced conceptual inquiry, laboratory experimentation, coding, and inter-school leadership.",
    heroImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Middle School Admissions",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      accentColor: "#10B981",
      fontFamily: "Inter",
      wingAgeGroup: "Ages 11 to 13 Years",
      wingHeadline: "Inquiry, Innovation & Scientific Discovery",
      wingParagraph1: "Middle School marks a vital developmental bridge where students transition into specialized disciplines. At CIS Mandi, science branches into dedicated Physics, Chemistry, and Biology laboratories, while mathematics expands into rigorous algebra and geometry.",
      wingParagraph2: "Students begin weekly sessions in the Himalayan Robotics & AI Innovation Lab, participating in Hackathons, Model United Nations (MUN), and Olympiad training camps.",
      wingCtaText: "Apply for Grade 6-8 Admissions",
      wingCtaLink: "/admissions/apply",
      middleFeatures: [
        { title: "Hands-on Science Labs", desc: "Individual lab stations for Physics, Chemistry, and Biology practicals every week." },
        { title: "Robotics & Arduino", desc: "Students build obstacle-avoiding rovers, sensor circuits, and Python automation scripts." },
        { title: "Third Language Options", desc: "Choice between Sanskrit and French to foster multilingual versatility." },
      ],
    },
    isPublished: true,
  },

  // 11. SENIOR SECONDARY WING
  "senior-secondary": {
    slug: "senior-secondary",
    pageName: "Senior Secondary (Grades 9-12)",
    heroBadge: "Senior Wing & CBSE Boards",
    heroBadgeColor: "purple",
    heroTitle: "Senior Secondary (Grades 9 to 12)",
    heroSubtitle: "Benchmark CBSE Board preparation across 4 specialized streams with integrated JEE/NEET coaching and university placement mentorship.",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Senior Secondary Admissions",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      accentColor: "#8B5CF6",
      fontFamily: "Inter",
      affiliationLabel: "CBSE Senior Secondary Affiliation No. 630198",
      wingHeadline: "4 Dedicated Streams Crafted for Global Careers",
      wingParagraph1: "Our Senior Secondary wing is led by specialized Master's & Doctorate faculty with proven track records in guiding students to top percentiles in Class 10 & 12 Board examinations and national entrance tests.",
      seniorStreams: [
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
      ],
    },
    isPublished: true,
  },

  // 12. ADMISSIONS HUB
  admissions: {
    slug: "admissions",
    pageName: "Admissions Hub & Policies",
    heroBadge: "Session 2027–2028 Open",
    heroBadgeColor: "amber",
    heroTitle: "Admissions Hub — Cambridge Mandi",
    heroSubtitle: "Join an inspiring community dedicated to academic rigor, character building, and international excellence in Himachal Pradesh.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Fill Online Application",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      bannerBadge: "Limited Seats per Grade",
      bannerTitle: "Admissions Open for Nursery to Grade XI",
      bannerDesc: "We maintain a low 1:15 mentor-student ratio to ensure every child receives personalized attention and accelerated learning support.",
      bannerBtn1Text: "Fill Online Application",
      bannerBtn1Link: "/admissions/apply",
      bannerBtn2Text: "Download Prospectus",
      bannerBtn2Link: "/sample-documents/CIS_Mandi_Prospectus_2025_2026.pdf",
      stepsTitle: "4-Step Simple Admission Process",
      stepsSubtitle: "Transparent, hassle-free, and parent-friendly registration workflow.",
      admissionSteps: [
        { num: "01", title: "Online Registration", desc: "Fill out the online application form with student details and academic records." },
        { num: "02", title: "Interaction / Entrance Test", desc: "Short friendly interaction for Early Years or conceptual aptitude assessment for Grades 6-11." },
        { num: "03", title: "Provisional Offer & Document Verification", desc: "Receive admission confirmation offer and submit required birth/transfer certificates." },
        { num: "04", title: "Fee Payment & Welcome Kit", desc: "Complete enrollment fee payment and collect school uniform, books, and orientation packet." },
      ],
      quickLinks: [
        { title: "Admission Procedure & Age Matrix →", desc: "Check minimum age requirements and document verification checklist.", link: "/admissions/procedure" },
        { title: "Fees Structure & Schedule →", desc: "View transparent breakdown of admission, tuition, transport & hostel fees.", link: "/admissions/fees-structure" },
        { title: "Scholarships & Fee Waivers →", desc: "Learn about merit concessions for board toppers, sports laureates & defence.", link: "/admissions/scholarships" },
      ],
    },
    isPublished: true,
  },

  // 13. ADMISSION PROCEDURE
  procedure: {
    slug: "procedure",
    pageName: "Admission Procedure",
    heroBadge: "Eligibility & Guidelines",
    heroBadgeColor: "blue",
    heroTitle: "Admission Procedure & Age Matrix",
    heroSubtitle: "Comprehensive guidelines on age eligibility criteria, admission test schedules, and document checklists.",
    heroImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Proceed to Online Application Form",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      ageMatrixBadge: "Eligibility Matrix",
      ageMatrixTitle: "Age Criteria for Session 2025–2026",
      ageMatrix: [
        { grade: "Nursery / Pre-KG", age: "3+ Years as on 31st March 2025" },
        { grade: "LKG / Lower Kindergarten", age: "4+ Years as on 31st March 2025" },
        { grade: "UKG / Upper Kindergarten", age: "5+ Years as on 31st March 2025" },
        { grade: "Grade I", age: "6+ Years as on 31st March 2025" },
        { grade: "Grade II to V", age: "Corresponding age progression + Previous School TC" },
        { grade: "Grade VI to VIII", age: "Previous class marksheet + TC + Aptitude test" },
        { grade: "Grade IX to X", age: "CBSE Registration Eligibility + Class 8/9 Marksheet" },
        { grade: "Grade XI (Science/Commerce/Arts)", age: "Class X Board Marksheet / Pre-board score" },
      ],
      docsBadge: "Verification Checklist",
      docsTitle: "Mandatory Documents for Final Admission",
      requiredDocs: [
        "Attested copy of Child's Birth Certificate (issued by Municipal Corp / Gram Panchayat)",
        "Original Transfer Certificate (TC) from previous school counter-signed by Education Officer",
        "Previous Class Marksheet / Progress Card",
        "Recent passport-sized photographs of student (4 copies)",
        "Recent passport-sized photographs of Father and Mother (2 copies each)",
        "Aadhaar Card copies of Student and Parents",
        "Medical Fitness Certificate & Blood Group proof",
        "Caste / Category certificate (if applicable for scholarship quotas)",
      ],
      ctaText: "Proceed to Online Application Form",
      ctaLink: "/admissions/apply",
    },
    isPublished: true,
  },

  // 14. FEES STRUCTURE
  "fees-structure": {
    slug: "fees-structure",
    pageName: "Fees Structure & Schedule",
    heroBadge: "Academic Year 2025–26",
    heroBadgeColor: "emerald",
    heroTitle: "Fee Structure & Payment Schedule",
    heroSubtitle: "Completely transparent, regulated fee structure with zero hidden charges. Installment options available for quarterly payments.",
    heroImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Proceed to Online Application",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      feesTableBadge: "Approved by Management & PTA",
      feesTableTitle: "Tuition & Composite Fee Breakdown",
      feeTiers: [
        {
          wing: "Pre-Primary (Nursery, LKG, UKG)",
          admissionFee: 15000,
          annualCompositeFee: 42000,
          quarterlyTuition: 10500,
          activityAndLabFee: 4000,
        },
        {
          wing: "Primary Wing (Grades 1 to 5)",
          admissionFee: 18000,
          annualCompositeFee: 48000,
          quarterlyTuition: 12000,
          activityAndLabFee: 5500,
        },
        {
          wing: "Middle School (Grades 6 to 8)",
          admissionFee: 20000,
          annualCompositeFee: 54000,
          quarterlyTuition: 13500,
          activityAndLabFee: 7000,
        },
        {
          wing: "Secondary Wing (Grades 9 & 10)",
          admissionFee: 22000,
          annualCompositeFee: 62000,
          quarterlyTuition: 15500,
          activityAndLabFee: 8500,
        },
        {
          wing: "Senior Secondary (Grades 11 & 12)",
          admissionFee: 25000,
          annualCompositeFee: 72000,
          quarterlyTuition: 18000,
          activityAndLabFee: 10000,
        },
      ],
      transportTitle: "Optional School Transport (GPS Monitored)",
      transportDesc: "Transport charges are slab-based depending on distance from campus (covering Mandi City, Gutkar, Sundernagar, Pandoh, and adjoining valleys):",
      transportSlabs: [
        { slab: "0 – 5 km (Mandi Town & Vicinity)", fee: "₹1,800 / month" },
        { slab: "5 – 12 km (Gutkar / Nerchowk sector)", fee: "₹2,400 / month" },
        { slab: "12 – 22 km (Sundernagar / Outskirts)", fee: "₹3,100 / month" },
      ],
      hostelTitle: "Residential Hostel & Boarding (Optional)",
      hostelDesc: "Includes air-conditioned/heated room accommodation, 4 nutritious hygienic meals daily, 24x7 resident warden care, laundry, evening tutoring, and medical cover:",
      hostelFees: [
        { item: "Annual Boarding & Hostel Fee", fee: "₹1,25,000 / year", isHighlight: true },
        { item: "Payable in 2 equal installments (April & October)", fee: "₹62,500 / term", isHighlight: false },
      ],
      ctaText: "Proceed to Online Application",
      ctaLink: "/admissions/apply",
    },
    isPublished: true,
  },

  // 15. SCHOLARSHIPS
  scholarships: {
    slug: "scholarships",
    pageName: "Scholarships & Awards",
    heroBadge: "Financial Aid & Laurels",
    heroBadgeColor: "purple",
    heroTitle: "Scholarships & Merit Fee Concessions",
    heroSubtitle: "Rewarding academic brilliance, sports prowess, and honoring our valiant armed forces personnel.",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Apply Online with Scholarship Request",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      schemes: [
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
      ],
      ctaText: "Apply Online with Scholarship Request",
      ctaLink: "/admissions/apply",
    },
    isPublished: true,
  },

  // 16. APPLY ONLINE REGISTRATION
  apply: {
    slug: "apply",
    pageName: "Apply Online Registration",
    heroBadge: "Session 2027–2028",
    heroBadgeColor: "amber",
    heroTitle: "Online Admission Application Form",
    heroSubtitle: "Fill out the multi-step form to register your child. Receive an instant Application ID and downloadable acknowledgment slip.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Fill Application Form",
    heroCtaLink: "/admissions/apply",
    sections: [],
    customStyles: {
      storyHeadline: "Online Registration Instructions & Admissions Helpline",
      mainStory: "Welcome to the online admissions portal of Cambridge International School, Mandi. Please ensure all details entered match the official birth certificate and previous school records.\n\nOur Admissions Counselor will contact you within 24 hours of submission to schedule the interactive baseline session and campus tour.\n\nFor immediate assistance, call our Admissions Helpline at +91 98160 00000 or email admissions@cismandi.edu.in.",
      stats: [
        { number: "4 Steps", label: "Simple Online Process" },
        { number: "24 Hrs", label: "Counselor Callback" },
        { number: "Nursery - XI", label: "Classes Open" },
      ],
      documents: [
        {
          id: "doc_apply_1",
          title: "Admission Registration Guidelines & Checklist 2025-26.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Guidelines",
          fileSize: "1.4 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 17. 10-ACRE CAMPUS & FACILITIES HUB
  facilities: {
    slug: "facilities",
    pageName: "Campus & Facilities",
    heroBadge: "World-Class Infrastructure",
    heroBadgeColor: "amber",
    heroTitle: "10-Acre Himalayan Campus & Facilities",
    heroSubtitle: "Crafted with architectural finesse, international safety benchmarks, and high-tech educational tools to foster learning without limits.",
    heroImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Take 360° Virtual Tour",
    heroCtaLink: "/virtual-tour",
    sections: [],
    customStyles: {
      storyHeadline: "A Green Himalayan Educational Sanctuary",
      mainStory: "Spread over 10 verdant acres in Mandi, CIS Mandi combines natural beauty with 21st-century educational architecture. Our campus is 100% CCTV monitored with 24/7 security personnel, fire safety systems, and solar energy generation.",
      authorImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
      stats: [
        { number: "10+ Acres", label: "Eco-Friendly Campus" },
        { number: "25+", label: "Advanced Labs" },
        { number: "100%", label: "CCTV & GPS Coverage" },
      ],
    },
    isPublished: true,
  },

  // 18. SMART CLASSROOMS
  "smart-classrooms": {
    slug: "smart-classrooms",
    pageName: "Smart Classrooms",
    heroBadge: "Digital EdTech • 4K Interactive Podiums",
    heroBadgeColor: "blue",
    heroTitle: "Technology-Enabled Immersive Digital Classrooms",
    heroSubtitle: "Interactive 4K smart screens, visual learning libraries, and ergonomic student seating in every classroom.",
    heroImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "View Campus Facilities",
    heroCtaLink: "/facilities",
    sections: [
      {
        id: "smart_sec_1",
        type: "features_grid",
        title: "Digital Classroom Features",
        subtitle: "How interactive visual technology enhances student conceptual retention.",
        badge: "Smart Tech",
        badgeColor: "blue",
        layout: "grid_3",
        items: [
          {
            title: "4K Interactive Touch Panels",
            description: "High-resolution digital podiums enabling dynamic 3D diagramming and interactive physics simulations.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "4K Panels",
            badgeColor: "blue",
            link: "/facilities",
          },
          {
            title: "Digital Content & Video Library",
            description: "Mapped to CBSE and Cambridge curricula with thousands of animated science & history modules.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Content",
            badgeColor: "purple",
            link: "/academics",
          },
          {
            title: "Ergonomic & Air-Cooled Ambience",
            description: "Spacious natural ventilation, orthopedic student desks, and eye-friendly LED lighting.",
            image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800",
            badge: "Comfort",
            badgeColor: "emerald",
            link: "/facilities",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "Interactive Pedagogy",
      facilityHeadline: "Visual, Engaging & Experiential Learning",
      facilityStory: "Every single classroom at Cambridge International School Mandi is equipped as a full-fledged multimedia smart room. Our teachers utilize 3D simulations, interactive geometry manipulatives, and virtual field trips to explain complex topics.",
      storyHeadline: "Transforming Lectures into Engaging Visual Journeys",
      mainStory: "Gone are the days of passive blackboard learning. Every classroom at CIS Mandi is an interactive innovation studio where teachers bring complex concepts to life with 3D animations, real-time quizzes, and global digital resources.",
      stats: [
        { number: "100%", label: "Smart Board Enabled" },
        { number: "4K UHD", label: "Display Panels" },
        { number: "1Gbps", label: "Campus Fiber Network" },
      ],
    },
    isPublished: true,
  },

  // 18.5 COMPUTER LABS
  "computer-labs": {
    slug: "computer-labs",
    pageName: "Computer & Coding Labs",
    heroBadge: "Digital & Coding Literacy • Computing Excellence",
    heroBadgeColor: "blue",
    heroTitle: "Computer & AI Computing Laboratories",
    heroSubtitle: "Empowering students with 21st-century programming, artificial intelligence, and digital ethics.",
    heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Enroll in AI & CS Courses",
    heroCtaLink: "/admissions/apply",
    sections: [
      {
        id: "comp_sec_1",
        type: "features_grid",
        title: "Computing & AI Laboratory Resources",
        subtitle: "Equipping every student with future-ready coding, AI, and cybersecurity skills.",
        badge: "Lab Resources",
        badgeColor: "blue",
        layout: "grid_3",
        items: [
          {
            title: "120+ Intel Core i7 Workstations",
            description: "Latest-generation high-performance computing workstations with GPU acceleration for AI and ML tasks.",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
            badge: "Hardware",
            badgeColor: "blue",
            link: "/facilities",
          },
          {
            title: "1 Gbps Fiber Broadband",
            description: "Symmetric optical fiber broadband with redundant failovers and cybersecurity content filters.",
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
            badge: "Network",
            badgeColor: "emerald",
            link: "/facilities",
          },
          {
            title: "Python, Java & Web Dev Curriculum",
            description: "Complete curriculum from Scratch for juniors to Python, Java, SQL, and Web Development for seniors.",
            image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80",
            badge: "Curriculum",
            badgeColor: "purple",
            link: "/academics",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "Computing Excellence",
      facilityHeadline: "Cultivating Algorithmic Thinking & AI Fluency",
      facilityStory: "In an era powered by software and intelligent algorithms, CIS Mandi equips students with robust computational problem-solving abilities from Grade 1 through Class 12.",
      storyHeadline: "Building Tomorrow's Programmers & AI Engineers",
      mainStory: "Our Computer & AI Labs are not just about learning to type — they are innovation engines. Students ship real mobile apps, build machine learning models, design data visualizations, and compete in national and international coding Olympiads.",
      stats: [
        { number: "120+", label: "AI Computing Workstations" },
        { number: "Grade 1+", label: "Coding Curriculum Starts" },
        { number: "1 Gbps", label: "Symmetric Fiber Broadband" },
      ],
    },
    isPublished: true,
  },

  "science-labs": {
    slug: "science-labs",
    pageName: "Science & AI Labs",
    heroBadge: "Empirical Discovery • Advanced Labs",
    heroBadgeColor: "purple",
    heroTitle: "State-of-the-Art Science & Biotechnology Laboratories",
    heroSubtitle: "Dedicated Physics, Chemistry, Biology, and Biotechnology labs equipped with precision instrumentation for senior secondary research.",
    heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Explore Academic Streams",
    heroCtaLink: "/academics",
    sections: [
      {
        id: "sci_sec_1",
        type: "features_grid",
        title: "Specialized Laboratory Suites",
        subtitle: "Safe, precision-engineered environments for hands-on empirical experimentation.",
        badge: "Laboratories",
        badgeColor: "purple",
        layout: "grid_3",
        items: [
          {
            title: "Physics Innovation Lab",
            description: "Optical benches, laser apparatus, digital oscilloscopes, and mechanics demonstration kits.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            badge: "Physics",
            badgeColor: "blue",
            link: "/academics/senior-secondary",
          },
          {
            title: "Advanced Chemistry Lab",
            description: "Modern fume hoods, digital titration stations, and analytical reagents for CBSE practicals.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Chemistry",
            badgeColor: "purple",
            link: "/academics/senior-secondary",
          },
          {
            title: "Biology & Biotech Lab",
            description: "Compound research microscopes, laminar airflow stations, and anatomical specimens.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Biology",
            badgeColor: "emerald",
            link: "/academics/senior-secondary",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "Empirical Learning",
      facilityHeadline: "Where Young Scientists Discover Truth Through Experimentation",
      facilityStory: "At CIS Mandi, science is taught not through passive memorization, but through active tactile experimentation. Each student performs individual practicals under the close guidance of specialized lab demonstrators and senior faculty.",
      storyHeadline: "Bridging Theory with Empirical Scientific Rigor",
      mainStory: "Science at CIS Mandi is learned by doing. Our laboratory curriculum encourages students to hypothesize, conduct controlled experiments, record empirical data, and analyze results under strict laboratory safety protocols.",
      stats: [
        { number: "4+", label: "Dedicated Science Labs" },
        { number: "100%", label: "CBSE Safety Compliance" },
        { number: "1:1", label: "Workstation Per Student" },
      ],
    },
    isPublished: true,
  },

  // 20. ROBOTICS LAB
  "robotics-lab": {
    slug: "robotics-lab",
    pageName: "Robotics & Innovation Lab",
    heroBadge: "STEM Gold Medalists • 3D Printing & IoT",
    heroBadgeColor: "emerald",
    heroTitle: "Robotics, Artificial Intelligence & 3D Prototyping",
    heroSubtitle: "Himachal Pradesh's leading school innovation laboratory for humanoid robotics, drone engineering, Python coding, and national STEM Olympiads.",
    heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "View Student Achievements",
    heroCtaLink: "/achievements",
    sections: [
      {
        id: "rob_sec_1",
        type: "features_grid",
        title: "Robotics & Innovation Workstations",
        subtitle: "Hands-on technology suites empowering young engineers.",
        badge: "Workstations",
        badgeColor: "emerald",
        layout: "grid_3",
        items: [
          {
            title: "3D Printing & Prototyping",
            description: "Industrial dual-extrusion 3D printers allowing students to model and print physical robotic components.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "3D Printing",
            badgeColor: "emerald",
            link: "/facilities",
          },
          {
            title: "AI & Microcontroller Coding",
            description: "Arduino, Raspberry Pi, and Python coding environments for autonomous robot design.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            badge: "AI & Coding",
            badgeColor: "purple",
            link: "/academics",
          },
          {
            title: "Drone & Aero-Design Suite",
            description: "Aerodynamic drone design, flight simulators, and autonomous obstacle navigation kits.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Drones",
            badgeColor: "blue",
            link: "/achievements",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "National Gold Medalist Lab 2025",
      facilityHeadline: "From Concept to Creation: Real Engineering for School Students",
      facilityStory: "The CIS Mandi STEM & Robotics Lab is celebrated as one of the most advanced innovation facilities in northern India. Students build AI rovers, alpine landslide sensor networks, autonomous line-followers, and IoT smart irrigation models.",
      storyHeadline: "Empowering Himachal's Next Generation of Innovators",
      mainStory: "Our Robotics and AI Lab is a thriving innovation incubator. CIS Mandi teams have won multiple national robotics competitions, coding hackathons, and science exhibitions.",
      stats: [
        { number: "15+", label: "National Robotics Awards" },
        { number: "3D", label: "Rapid Prototyping Suites" },
        { number: "Grade 3+", label: "Coding From Early Years" },
      ],
    },
    isPublished: true,
  },

  // 21. CENTRAL LIBRARY
  library: {
    slug: "library",
    pageName: "Central Digital Library",
    heroBadge: "25,000+ Books • Quiet Research Sanctuary",
    heroBadgeColor: "amber",
    heroTitle: "A Treasure Trove of Knowledge, Literature & Research",
    heroSubtitle: "25,000+ curated volumes, international journals, Kindle e-readers, and quiet mountain-view study cubicles.",
    heroImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "View Campus Facilities",
    heroCtaLink: "/facilities",
    sections: [
      {
        id: "lib_sec_1",
        type: "features_grid",
        title: "Library Resources & Study Zones",
        subtitle: "Inspiring lifelong reading habits and deep academic research.",
        badge: "Library Zones",
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "Global Literature & Fiction",
            description: "Classics, world fiction, poetry, and regional Himalayan cultural archives.",
            image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
            badge: "Literature",
            badgeColor: "amber",
            link: "/facilities",
          },
          {
            title: "Digital E-Library & Journals",
            description: "Access to JSTOR, National Digital Library, and Kindle digital e-readers.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "E-Resources",
            badgeColor: "blue",
            link: "/academics",
          },
          {
            title: "Quiet Mountain Study Pods",
            description: "Individual sound-insulated study pods with Himalayan valley panoramic views.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Study Pods",
            badgeColor: "emerald",
            link: "/facilities",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "25,000+ Books & Digital Journals",
      facilityHeadline: "Igniting the Imagination and Sustaining Deep Research",
      facilityStory: "The Central Library of CIS Mandi is the intellectual heartbeat of our campus. Bathed in natural Himalayan sunlight with panoramic mountain views, it provides an inspiring atmosphere for reading, creative writing, and competitive exam preparation.",
      storyHeadline: "Nurturing Curious Minds & Lifelong Readers",
      mainStory: "The CIS Mandi library is the quiet intellectual sanctuary of our campus. Guided by experienced librarians, students explore rich literary worlds, reference materials for CBSE projects, and competitive exam preparation.",
      stats: [
        { number: "25,000+", label: "Books & Volumes" },
        { number: "50+", label: "International Journals" },
        { number: "100%", label: "Digital Catalog Access" },
      ],
    },
    isPublished: true,
  },

  // 22. OLYMPIC SPORTS COMPLEX
  "sports-complex": {
    slug: "sports-complex",
    pageName: "Olympic Sports Complex",
    heroBadge: "Athletic Excellence • Olympic Standards",
    heroBadgeColor: "emerald",
    heroTitle: "World-Class Olympic Sports Infrastructure",
    heroSubtitle: "Heated indoor aquatic pool, FIFA-grade turf football arena, synthetic basketball & tennis courts, and NIS certified athletic mentorship.",
    heroImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "View Student Life",
    heroCtaLink: "/student-life",
    sections: [
      {
        id: "sport_sec_1",
        type: "features_grid",
        title: "Sports Facilities Directory",
        subtitle: "Professional sports amenities designed to cultivate discipline, grit, and athletic gold medalists.",
        badge: "Arenas",
        badgeColor: "emerald",
        layout: "grid_3",
        items: [
          {
            title: "Heated Indoor Swimming Pool",
            description: "Semi-Olympic all-weather temperature-regulated pool with certified lifeguards and stroke coaches.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Aquatics",
            badgeColor: "blue",
            link: "/facilities",
          },
          {
            title: "FIFA-Standard Football Turf",
            description: "All-weather artificial turf ground with professional floodlights for evening academy practice.",
            image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
            badge: "Football",
            badgeColor: "emerald",
            link: "/achievements",
          },
          {
            title: "Synthetic Basketball & Tennis",
            description: "Shock-absorbing synthetic courts for basketball, lawn tennis, and multi-court badminton arena.",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
            badge: "Courts",
            badgeColor: "amber",
            link: "/facilities",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "Champions in the Making",
      facilityHeadline: "World-Class Arenas Nurturing National Champions",
      facilityStory: "At CIS Mandi, physical education is an integral pillar of character building. Directed by Col. (Retd.) Harpreet Singh and NIS certified trainers, our athletic program has produced national medalists in swimming, sprint athletics, and shooting.",
      storyHeadline: "Championing Physical Fitness & Sportsmanship",
      mainStory: "Physical education is an indispensable cornerstone of our holistic curriculum. We believe that games and sports teach timeless life skills: resilience under pressure, strategic teamwork, emotional poise in victory, and grit in defeat.\n\nOur students compete at district, state, and CBSE national sports tournaments with exemplary achievements in swimming, basketball, athletics, and martial arts.",
      authorImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
      stats: [
        { number: "15+", label: "Sports Disciplines" },
        { number: "5+", label: "NIS Certified Coaches" },
        { number: "50+", label: "State & National Medals" },
      ],
    },
    isPublished: true,
  },

  // 23. RESIDENTIAL HOSTEL
  hostel: {
    slug: "hostel",
    pageName: "Residential Boarding Hostel",
    heroBadge: "Safe Sanctuary • A Home Away From Home",
    heroBadgeColor: "blue",
    heroTitle: "Premium Residential Boarding & Nutritious Living",
    heroSubtitle: "Safe, climate-controlled boarding houses for boys and girls with dedicated evening study tutors, organic dining, and resident medical care.",
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Hostel Admission Details",
    heroCtaLink: "/admissions/apply",
    sections: [
      {
        id: "host_sec_1",
        type: "features_grid",
        title: "Hostel Living Amenities",
        subtitle: "Designed to provide comfort, emotional warmth, and disciplined academic focus.",
        badge: "Amenities",
        badgeColor: "blue",
        layout: "grid_3",
        items: [
          {
            title: "Air-Cooled & Heated Rooms",
            description: "Comfortable twin and triple sharing rooms with personal wardrobes and study desks.",
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
            badge: "Rooms",
            badgeColor: "blue",
            link: "/facilities",
          },
          {
            title: "Hygienic Organic Dining Hall",
            description: "Nutritious multi-cuisine meals designed by clinical nutritionists using fresh farm produce.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Dining",
            badgeColor: "emerald",
            link: "/facilities",
          },
          {
            title: "Evening Supervised Study Halls",
            description: "Resident subject teachers providing daily homework guidance and doubt clearing sessions.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Tutoring",
            badgeColor: "purple",
            link: "/academics",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "Pastoral Care & Comfort",
      facilityHeadline: "Safe, Structured & Loving Residential Community",
      facilityStory: "For parents seeking premier boarding in Himachal Pradesh, the CIS Mandi Hostel offers an environment of camaraderie, discipline, and academic reinforcement. Resident students develop lifelong friendships, self-reliance, and outstanding time-management habits.",
      storyHeadline: "Safe, Caring & Disciplined Boarding Culture",
      mainStory: "Our residential hostel offers a nurturing sanctuary where boarders forge lifelong friendships. With 24/7 CCTV surveillance, resident housemasters, and on-call medical doctors, parents enjoy complete peace of mind.",
      stats: [
        { number: "24/7", label: "Security & Medical Care" },
        { number: "4 Meals", label: "Fresh Organic Dining" },
        { number: "100%", label: "Evening Tutoring Coverage" },
      ],
    },
    isPublished: true,
  },

  // 24. TRANSPORT FLEET
  transport: {
    slug: "transport",
    pageName: "Transport Fleet",
    heroBadge: "Safe Transit • GPS & CCTV Monitored",
    heroBadgeColor: "amber",
    heroTitle: "Safe, GPS-Tracked Luxury School Bus Fleet",
    heroSubtitle: "Covering all major routes across Mandi district with speed governors, female attendants, and real-time parent tracking app.",
    heroImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Check Transport Routes",
    heroCtaLink: "/contact",
    sections: [
      {
        id: "trans_sec_1",
        type: "features_grid",
        title: "Transport Safety & Fleet Highlights",
        subtitle: "Ensuring every student travels in utmost comfort and security.",
        badge: "Safety Benchmarks",
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "Live GPS Parent Tracking App",
            description: "Parents receive live location updates and arrival alerts on their smartphones.",
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
            badge: "GPS Tracking",
            badgeColor: "blue",
            link: "/contact",
          },
          {
            title: "CCTV & Female Attendants",
            description: "Dual cameras and trained female security attendants on every bus route.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "Safety",
            badgeColor: "emerald",
            link: "/facilities",
          },
          {
            title: "District-Wide Route Coverage",
            description: "Comfortable air-cushioned buses connecting Mandi city, Sundernagar, Ner Chowk, and Pandoh.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Routes",
            badgeColor: "amber",
            link: "/facilities",
          },
        ],
      },
    ],
    customStyles: {
      facilityBadge: "Safety & Real-Time Tracking",
      facilityHeadline: "Punctual, Supervised & Secure Daily Commute",
      facilityStory: "Every bus in the CIS Mandi transport fleet is equipped with real-time GPS telemetry, dual HD CCTV security cameras, speed limit governors (restricted to 40 km/h on mountain roads), and mandatory first-aid kits. Trained female attendants accompany every route to assist younger children, and parents receive live SMS/App arrival notifications.",
      storyHeadline: "Reliable, Punctual & Secure Daily Commute",
      mainStory: "Transport safety is non-negotiable. Our drivers undergo rigorous defensive driving background checks, breath analyzer testing, and regular vehicle fitness audits.",
      stats: [
        { number: "25+", label: "Buses in Fleet" },
        { number: "100%", label: "GPS & CCTV Monitored" },
        { number: "15+ Routes", label: "Mandi District Coverage" },
      ],
    },
    isPublished: true,
  },

  // 25. STUDENT LIFE
  "student-life": {
    slug: "student-life",
    pageName: "Student Life & Co-Curricular",
    heroBadge: "Vibrant Campus • Houses & Clubs",
    heroBadgeColor: "rose",
    heroTitle: "Vibrant Student Life Beyond Textbooks",
    heroSubtitle: "House system competitions, Model United Nations, robotics hackathons, Himalayan trekking, and performing arts festivals.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "View Photo Gallery",
    heroCtaLink: "/gallery",
    sections: [
      {
        id: "life_sec_1",
        type: "features_grid",
        title: "Student Life & Co-Curricular Pillars",
        subtitle: "Nurturing creative expression, teamwork, and leadership.",
        badge: "Co-Curricular",
        badgeColor: "rose",
        layout: "grid_3",
        items: [
          {
            title: "Four School House System",
            description: "Aryabhatta, Tagore, Ashoka, and Raman houses fostering spirited healthy competition in sports and arts.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "House System",
            badgeColor: "rose",
            link: "/student-life",
          },
          {
            title: "Clubs & Societies",
            description: "Robotics Club, Eco Warriors, Literary & MUN Society, Theater Guild, and Coding League.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Clubs",
            badgeColor: "purple",
            link: "/student-life",
          },
          {
            title: "Himalayan Outdoor Adventure",
            description: "Annual mountain trekking expeditions, wilderness survival skills, and environmental conservation drives.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Outdoors",
            badgeColor: "emerald",
            link: "/student-life",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Sculpting Well-Rounded, Confident Personalities",
      mainStory: "Education at CIS Mandi is an enriching tapestry of sports, arts, debates, and community service. Every student is encouraged to step out of their comfort zone, discover their passions, and lead with empathy.",
      stats: [
        { number: "4", label: "Distinguished Houses" },
        { number: "20+", label: "Student Clubs & Societies" },
        { number: "100%", label: "Co-Curricular Participation" },
      ],
    },
    isPublished: true,
  },

  // 26. ACHIEVEMENTS & HALL OF FAME
  achievements: {
    slug: "achievements",
    pageName: "Hall of Fame & Achievements",
    heroBadge: "Excellence Recognized • Gold Medalists",
    heroBadgeColor: "amber",
    heroTitle: "Celebrating Student Triumphs & Milestones",
    heroSubtitle: "National Olympiad gold medalists, CBSE state board rankers, robotics champions, and international university admissions.",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Explore CBSE Results",
    heroCtaLink: "/results",
    sections: [
      {
        id: "ach_sec_1",
        type: "features_grid",
        title: "Hall of Fame Distinctions",
        subtitle: "Exemplary accomplishments of our students on state, national, and international stages.",
        badge: "Hall of Fame",
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "National Science & Math Olympiads",
            description: "Gold medals in NSO, IMO, and International Informatics Olympiad.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            badge: "Olympiads",
            badgeColor: "amber",
            link: "/achievements",
          },
          {
            title: "National Robotics Championship",
            description: "1st Prize in National STEM Innovation Challenge for autonomous flood rescue rover design.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Robotics Gold",
            badgeColor: "purple",
            link: "/facilities/robotics-lab",
          },
          {
            title: "State Swimming & Athletics Golds",
            description: "Champions at Himachal State Aquatic Meet with 12 gold medals.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Sports Medals",
            badgeColor: "emerald",
            link: "/facilities/sports-complex",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "A Culture of Striving for the Summit",
      mainStory: "Our students' achievements reflect the tireless dedication of our mentors and the world-class training infrastructure at CIS Mandi.",
      stats: [
        { number: "50+", label: "National Medals" },
        { number: "100%", label: "Board Success" },
        { number: "#1", label: "Ranked School in District" },
      ],
    },
    isPublished: true,
  },

  // 27. CBSE BOARD RESULTS
  results: {
    slug: "results",
    pageName: "CBSE Board Results",
    heroBadge: "100% Pass Rate • State & District Toppers",
    heroBadgeColor: "emerald",
    heroTitle: "Outstanding CBSE Class 10 & 12 Board Results",
    heroSubtitle: "Consistent 100% pass rate with over 40% of students scoring in the 90%+ distinction bracket in Science, Commerce, and Humanities.",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "View Academic Curriculum",
    heroCtaLink: "/academics",
    sections: [
      {
        id: "res_sec_1",
        type: "features_grid",
        title: "Board Result Highlights & Stream Toppers",
        subtitle: "Exemplary academic benchmarks set by our graduating batches.",
        badge: "Board Toppers",
        badgeColor: "emerald",
        layout: "grid_3",
        items: [
          {
            title: "Class 12 Science Stream Toppers",
            description: "98.4% top score with centum (100/100) scores in Mathematics and Chemistry.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            badge: "98.4% Top Score",
            badgeColor: "blue",
            link: "/results",
          },
          {
            title: "Class 12 Commerce Stream Toppers",
            description: "97.8% top score with centum (100/100) scores in Economics and Accountancy.",
            image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
            badge: "97.8% Top Score",
            badgeColor: "amber",
            link: "/results",
          },
          {
            title: "Class 10 CBSE Board Benchmarks",
            description: "100% first division pass rate with 45 students scoring above 90%.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "100% Pass Rate",
            badgeColor: "emerald",
            link: "/results",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Setting New Academic Benchmarks Year After Year",
      mainStory: "Our structured academic revision timetable, weekly unit evaluations, and specialized doubt-clearing clinics ensure that every student reaches their maximum academic potential in CBSE Board Examinations.",
      stats: [
        { number: "100%", label: "Pass Rate (10 Years)" },
        { number: "98.4%", label: "Highest Score" },
        { number: "40%+", label: "Scored 90% & Above" },
      ],
      documents: [
        {
          id: "doc_res_1",
          title: "CBSE Board Examination Official Results Summary 2024.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Board Results",
          fileSize: "1.2 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 28. PHOTO & VIDEO GALLERY
  gallery: {
    slug: "gallery",
    pageName: "Photo & Video Gallery",
    heroBadge: "Visual Archives • Campus Moments",
    heroBadgeColor: "purple",
    heroTitle: "Campus Life, Celebrations & Event Archives",
    heroSubtitle: "Explore photo and video highlights from our annual day celebrations, sports meets, science fairs, and daily Himalayan campus life.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Take 360° Virtual Tour",
    heroCtaLink: "/virtual-tour",
    sections: [
      {
        id: "gal_sec_1",
        type: "features_grid",
        title: "Featured Event Albums",
        subtitle: "Glimpses into memorable celebrations and milestones at CIS Mandi.",
        badge: "Albums",
        badgeColor: "purple",
        layout: "grid_3",
        items: [
          {
            title: "Annual Sports Day & Athletic Meet",
            description: "High-octane track events, march past, gymnastics, and award ceremonies.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Sports Meet",
            badgeColor: "emerald",
            link: "/gallery",
          },
          {
            title: "Science & Robotics Exhibition",
            description: "Innovative working models, drone flights, and AI robotics demonstrations.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Science Fair",
            badgeColor: "purple",
            link: "/gallery",
          },
          {
            title: "Annual Cultural Fest & Theater",
            description: "Himalayan folk dances, orchestral musical performances, and English drama productions.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Cultural Fest",
            badgeColor: "rose",
            link: "/gallery",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Preserving Cherished Memories & Milestones",
      mainStory: "Every moment at Cambridge Mandi tells a story of discovery, friendship, and joy. Browse through our visual archives to experience the vibrant life of our student community.",
      stats: [
        { number: "1000+", label: "Curated Photos" },
        { number: "50+", label: "Video Highlights" },
        { number: "HD", label: "High Resolution" },
      ],
    },
    isPublished: true,
  },

  // 29. 360° VIRTUAL CAMPUS TOUR
  "virtual-tour": {
    slug: "virtual-tour",
    pageName: "360° Virtual Campus Tour",
    heroBadge: "Interactive Tour • Explore Online",
    heroBadgeColor: "blue",
    heroTitle: "Immersive 360° Panoramic Campus Walkthrough",
    heroSubtitle: "Experience our 10-acre Himalayan sanctuary from anywhere in the world. Walk through our smart classrooms, science labs, Olympic swimming pool, and boarding hostel.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Schedule Physical Campus Visit",
    heroCtaLink: "/contact",
    sections: [
      {
        id: "tour_sec_1",
        type: "features_grid",
        title: "360° Virtual Stop Locations",
        subtitle: "Click any location below to start the interactive panorama view.",
        badge: "Tour Stops",
        badgeColor: "blue",
        layout: "grid_3",
        items: [
          {
            title: "Main Academic Block & Atrium",
            description: "Grand sunlit entrance, administrative hub, and smart classroom corridors.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Academic Block",
            badgeColor: "blue",
            link: "/virtual-tour",
          },
          {
            title: "Olympic Aquatic & Sports Arena",
            description: "All-weather indoor heated swimming pool and FIFA-grade turf ground.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Sports Arena",
            badgeColor: "emerald",
            link: "/virtual-tour",
          },
          {
            title: "Robotics & Science Innovation Hub",
            description: "Advanced physics, chemistry, biology, and 3D printing laboratories.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "STEM Hub",
            badgeColor: "purple",
            link: "/virtual-tour",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Visit Our Himalayan Sanctuary Online or in Person",
      mainStory: "We invite families to explore our world-class learning spaces online. You can also schedule an individualized campus tour with our admissions team on any working day.",
      stats: [
        { number: "360°", label: "Full Panoramic View" },
        { number: "10+ Acres", label: "Campus Area" },
        { number: "24/7", label: "Online Access" },
      ],
    },
    isPublished: true,
  },

  // 30. NEWS & CIRCULARS
  news: {
    slug: "news",
    pageName: "News & Circulars",
    heroBadge: "Official Bulletins • Latest Updates",
    heroBadgeColor: "blue",
    heroTitle: "School News, Circulars & Official Announcements",
    heroSubtitle: "Stay updated with recent school circulars, academic notifications, examination datesheets, and event announcements.",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Download Documents",
    heroCtaLink: "/downloads",
    sections: [
      {
        id: "news_sec_1",
        type: "features_grid",
        title: "Recent Circulars & Bulletins",
        subtitle: "Official notifications published for parents and students.",
        badge: "Circulars",
        badgeColor: "blue",
        layout: "grid_3",
        items: [
          {
            title: "Admissions 2025-26 Registration Open",
            description: "Online registration commenced for Pre-Primary to Grade 11. Merit scholarship applications invited.",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Admissions",
            badgeColor: "amber",
            link: "/admissions/apply",
          },
          {
            title: "CBSE Pre-Board Examination Schedule",
            description: "Datesheet and syllabus guidelines for Classes 10 and 12 pre-board evaluations.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Exams",
            badgeColor: "blue",
            link: "/downloads",
          },
          {
            title: "Annual Sports Meet 2025 Announced",
            description: "Inter-house athletic meet and swimming championship dates finalized for November.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Events",
            badgeColor: "emerald",
            link: "/events",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Official Communication & Notice Board",
      mainStory: "All official communications and circulars are published here and broadcast via our parent mobile application for prompt updates.",
      stats: [
        { number: "Daily", label: "Notice Updates" },
        { number: "100%", label: "Digital Circulars" },
        { number: "Instant", label: "App Notifications" },
      ],
    },
    isPublished: true,
  },

  // 31. UPCOMING EVENTS CALENDAR
  events: {
    slug: "events",
    pageName: "Upcoming Events Calendar",
    heroBadge: "Academic & Co-Curricular Calendar 2025-26",
    heroBadgeColor: "emerald",
    heroTitle: "Upcoming School Events & Academic Calendar",
    heroSubtitle: "Track inter-school Olympiads, sports tournaments, cultural fests, parent-teacher meetings, and holiday schedules.",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Download Full Calendar PDF",
    heroCtaLink: "/downloads",
    sections: [
      {
        id: "ev_sec_1",
        type: "features_grid",
        title: "Key Calendar Highlights",
        subtitle: "Upcoming landmark events at CIS Mandi.",
        badge: "Calendar",
        badgeColor: "emerald",
        layout: "grid_3",
        items: [
          {
            title: "Annual Himalayan Cultural Fest",
            description: "Grand 2-day performing arts festival celebrating theater, music, and Himalayan heritage.",
            image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
            badge: "Nov 15-16",
            badgeColor: "rose",
            link: "/events",
          },
          {
            title: "Inter-House Science & Robotics Expo",
            description: "Exhibition of 100+ working models, AI prototypes, and 3D printing demonstrations.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "Dec 05",
            badgeColor: "purple",
            link: "/facilities/robotics-lab",
          },
          {
            title: "Parent-Teacher Interactive Forum",
            description: "One-on-one academic consultation and progress portfolio review across all grades.",
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
            badge: "Dec 20",
            badgeColor: "blue",
            link: "/events",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "A Well-Structured Year of Learning & Celebration",
      mainStory: "Our annual calendar balances rigorous academic evaluation with vibrant cultural festivals and athletic meets.",
      stats: [
        { number: "220+", label: "Working Days" },
        { number: "30+", label: "Major Campus Events" },
        { number: "100%", label: "Parent Engagement" },
      ],
      documents: [
        {
          id: "doc_ev_1",
          title: "Complete Academic & Activity Calendar 2025-26.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Calendar",
          fileSize: "1.8 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 32. DOWNLOADS & DOCUMENTS
  downloads: {
    slug: "downloads",
    pageName: "Downloads & Documents",
    heroBadge: "Resource Center • Syllabi & Forms",
    heroBadgeColor: "blue",
    heroTitle: "Official Downloads, Syllabi & Application Forms",
    heroSubtitle: "Download official school prospectus, grade-wise syllabi, book lists, medical forms, and leave application forms in PDF format.",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Apply Online Registration",
    heroCtaLink: "/admissions/apply",
    sections: [
      {
        id: "down_sec_1",
        type: "features_grid",
        title: "Essential Document Categories",
        subtitle: "Instant access to official school publications and student forms.",
        badge: "Documents",
        badgeColor: "blue",
        layout: "grid_3",
        items: [
          {
            title: "Information Prospectus 2025-26",
            description: "Complete overview of academic curriculum, facilities, boarding, and admissions.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Prospectus",
            badgeColor: "amber",
            link: "/uploads/prospectus.pdf",
          },
          {
            title: "Grade-Wise Syllabi & Book Lists",
            description: "Prescribed NCERT/Cambridge textbooks, notebook specifications, and term-wise syllabi.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Syllabus",
            badgeColor: "blue",
            link: "/downloads",
          },
          {
            title: "Medical & Transport Consent Forms",
            description: "Student medical fitness declaration, transport consent form, and hostel undertaking.",
            image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
            badge: "Forms",
            badgeColor: "purple",
            link: "/downloads",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Digital Document Repository",
      mainStory: "All forms and brochures are available for free download. For printed copies, please visit the administrative front desk.",
      documents: [
        {
          id: "doc_d1",
          title: "Cambridge Mandi Information Prospectus 2025-26.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Prospectus",
          fileSize: "2.8 MB",
        },
        {
          id: "doc_d2",
          title: "CBSE Mandatory Disclosure OASIS 2025.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "CBSE Compliance",
          fileSize: "1.2 MB",
        },
      ],
      stats: [
        { number: "PDF", label: "Format Available" },
        { number: "Free", label: "Instant Download" },
        { number: "100%", label: "Official Documents" },
      ],
    },
    isPublished: true,
  },

  // 33. CBSE MANDATORY DISCLOSURE (OASIS / SARAS)
  "mandatory-disclosure": {
    slug: "mandatory-disclosure",
    pageName: "CBSE Mandatory Disclosure",
    heroBadge: "CBSE Compliance • Affiliation No. 630198",
    heroBadgeColor: "emerald",
    heroTitle: "CBSE Mandatory Public Disclosure (SARAS / OASIS)",
    heroSubtitle: "Official compliance documents, society registration, NOC, building safety, fire safety, water sanitation, and academic committee certificates.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "CBSE Information",
    heroCtaLink: "/cbse-information",
    sections: [
      {
        id: "mand_sec_1",
        type: "features_grid",
        title: "Statutory Compliance Documents (Appendix IX)",
        subtitle: "In accordance with CBSE Circular No. 03/2021 regarding public disclosure.",
        badge: "Compliance",
        badgeColor: "emerald",
        layout: "grid_3",
        items: [
          {
            title: "CBSE Affiliation Grant Letter",
            description: "Official Central Board of Secondary Education affiliation extension approval certificate.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Affiliation #630198",
            badgeColor: "emerald",
            link: "/uploads/prospectus.pdf",
          },
          {
            title: "Society Registration & NOC",
            description: "Registered Trust deed, State Education Department NOC, and recognition certificate.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Society Deed",
            badgeColor: "blue",
            link: "/uploads/prospectus.pdf",
          },
          {
            title: "Building, Fire & Water Safety",
            description: "PWD structural fitness, Fire Safety Department NOC, and Jal Shakti water purity test.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "Safety NOCs",
            badgeColor: "amber",
            link: "/uploads/prospectus.pdf",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Complete Institutional Transparency & Statutory Compliance",
      mainStory: "Cambridge International School Mandi adheres fully to all CBSE regulatory guidelines, RTE norms, and Himachal Pradesh State Education directives.",
      stats: [
        { number: "630198", label: "CBSE Affiliation No." },
        { number: "43247", label: "School Code" },
        { number: "100%", label: "SARAS Compliant" },
      ],
      documents: [
        {
          id: "doc_m1",
          title: "CBSE Mandatory Disclosure Appendix-IX 2025.pdf",
          fileUrl: "/uploads/prospectus.pdf",
          category: "Compliance",
          fileSize: "1.5 MB",
        },
      ],
    },
    isPublished: true,
  },

  // 34. CBSE SCHOOL INFORMATION
  "cbse-information": {
    slug: "cbse-information",
    pageName: "CBSE School Information",
    heroBadge: "CBSE Code: 43247 • Affiliation: 630198",
    heroBadgeColor: "blue",
    heroTitle: "CBSE Affiliation, Committee & Staff Matrix",
    heroSubtitle: "Detailed school management committee (SMC), teacher qualifications, student strength matrix, and academic committees.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Mandatory Disclosure",
    heroCtaLink: "/mandatory-disclosure",
    sections: [
      {
        id: "cbse_sec_1",
        type: "features_grid",
        title: "School Committees & Statutory Bodies",
        subtitle: "Ensuring democratic governance, child safety, and pedagogical standards.",
        badge: "Committees",
        badgeColor: "blue",
        layout: "grid_3",
        items: [
          {
            title: "School Management Committee (SMC)",
            description: "Constituted as per CBSE bye-laws with parent, teacher, educationist, and trustee members.",
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
            badge: "SMC Committee",
            badgeColor: "blue",
            link: "/cbse-information",
          },
          {
            title: "POSH & Anti-Bullying Committee",
            description: "Strict child protection, POCSO compliance, and internal complaints committee (ICC).",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Child Safety",
            badgeColor: "rose",
            link: "/cbse-information",
          },
          {
            title: "Parent-Teacher Association (PTA)",
            description: "Active collaborative body bridging school administration and parent community.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "PTA Body",
            badgeColor: "emerald",
            link: "/cbse-information",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Transparent Governance & Academic Stewardship",
      mainStory: "CIS Mandi operates under the governance of the Cambridge Education Trust with full compliance to CBSE norms.",
      stats: [
        { number: "15:1", label: "Student Teacher Ratio" },
        { number: "100%", label: "Qualified PGT/TGT/PRT" },
        { number: "CBSE", label: "Affiliated up to Grade 12" },
      ],
    },
    isPublished: true,
  },

  // 35. CAREERS AT CIS MANDI
  careers: {
    slug: "careers",
    pageName: "Careers at CIS Mandi",
    heroBadge: "Join Our Team • Shape Future Leaders",
    heroBadgeColor: "amber",
    heroTitle: "Build a Rewarding Career in Education",
    heroSubtitle: "Explore teaching, administrative, and sports coaching vacancies at Himachal Pradesh's premier Cambridge & CBSE institution.",
    heroImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Apply for Vacancies",
    heroCtaLink: "/contact",
    sections: [
      {
        id: "car_sec_1",
        type: "features_grid",
        title: "Current Job Openings",
        subtitle: "Competitive compensation, residential accommodation, and professional growth.",
        badge: "Openings",
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "PGT Faculty (Physics, Math, Bio)",
            description: "Postgraduates with B.Ed and minimum 3 years experience teaching senior secondary CBSE classes.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            badge: "PGT Openings",
            badgeColor: "blue",
            link: "/careers",
          },
          {
            title: "Robotics & AI Lab Instructor",
            description: "B.Tech/MCA with hands-on expertise in Python, Arduino, 3D printing, and STEM competitions.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
            badge: "STEM Faculty",
            badgeColor: "purple",
            link: "/careers",
          },
          {
            title: "Swimming & NIS Sports Coaches",
            description: "NIS certified coaches for swimming pool, football turf, and basketball academy.",
            image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800",
            badge: "Sports Coaches",
            badgeColor: "emerald",
            link: "/careers",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "Why Build Your Career at Cambridge International School Mandi?",
      mainStory: "We offer an empowering intellectual environment with 7th Pay Commission aligned salaries, on-campus faculty housing, subsidized child education, and continuous training with Cambridge & CBSE master educators.\n\nSend your resume and cover letter to careers@cismandi.edu.in.",
      stats: [
        { number: "7th CPC", label: "Competitive Salaries" },
        { number: "Yes", label: "Campus Housing Available" },
        { number: "100%", label: "Child Education Benefit" },
      ],
    },
    isPublished: true,
  },

  // 36. CONTACT & LOCATION
  contact: {
    slug: "contact",
    pageName: "Contact & Campus Location",
    heroBadge: "Get in Touch • Campus Helpline",
    heroBadgeColor: "amber",
    heroTitle: "Contact Us & Campus Location Details",
    heroSubtitle: "Reach out to our admissions team, administrative office, or schedule a campus visit in Mandi, Himachal Pradesh.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
    heroMediaType: "IMAGE",
    heroOverlayOpacity: 0.45,
    heroCtaText: "Apply for Admission",
    heroCtaLink: "/admissions/apply",
    sections: [
      {
        id: "con_sec_1",
        type: "features_grid",
        title: "Campus Directory & Key Helplines",
        subtitle: "Direct contact channels for admissions, transport, accounts, and administration.",
        badge: "Contact Hub",
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "Admissions Helpline",
            description: "Phone: +91 98160 00000 | Email: admissions@cismandi.edu.in | Hours: Mon-Sat 9 AM - 4 PM",
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
            badge: "Admissions",
            badgeColor: "amber",
            link: "/admissions/apply",
          },
          {
            title: "Principal & Academic Office",
            description: "Phone: +91 1905 200000 | Email: principal@cismandi.edu.in | By prior appointment.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Principal Desk",
            badgeColor: "blue",
            link: "/about/principal-message",
          },
          {
            title: "Campus Location & Address",
            description: "Cambridge International School, Near Beas River Valley, Mandi, Himachal Pradesh - 175001.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
            badge: "Address",
            badgeColor: "emerald",
            link: "/contact",
          },
        ],
      },
    ],
    customStyles: {
      storyHeadline: "We Look Forward to Welcoming You",
      mainStory: "Our campus is conveniently situated just off the National Highway in Mandi, surrounded by pine hills. Visitors and prospective parents are welcome Monday through Saturday between 9:00 AM and 4:00 PM.",
      stats: [
        { number: "Mon - Sat", label: "Visiting Hours" },
        { number: "9AM - 4PM", label: "Office Timings" },
        { number: "175001", label: "Mandi Pincode" },
      ],
    },
    isPublished: true,
  },
};

/**
 * Returns default page record for any slug with sensible, tailored fallbacks
 */
export function getPageDefault(slug: string, metaName?: string, metaDesc?: string): PageRecord {
  if (DEFAULT_PAGE_REGISTRY[slug]) {
    return DEFAULT_PAGE_REGISTRY[slug];
  }

  const cleanName = metaName ? metaName.replace(/[^a-zA-Z0-9 &]/g, "").trim() : slug;
  return {
    slug,
    pageName: cleanName,
    heroBadge: `${cleanName} • Cambridge International School Mandi`,
    heroBadgeColor: "amber",
    heroTitle: cleanName,
    heroSubtitle: metaDesc || "Empowering students with benchmark curriculum, smart labs, and sports excellence in Mandi, HP.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    heroImageHeight: 280,
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
        badgeColor: "amber",
        layout: "grid_3",
        items: [
          {
            title: "Modern Infrastructure",
            description: "4K smart classrooms, experiential laboratories, and sports grounds.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
            badge: "Infrastructure",
            badgeColor: "blue",
            link: "/facilities",
          },
          {
            title: "Holistic Development",
            description: "Nurturing sports, performing arts, and character building.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
            badge: "Holistic",
            badgeColor: "emerald",
            link: "/student-life",
          },
        ],
      },
    ],
    customStyles: {
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      storyHeadline: `About ${cleanName}`,
      mainStory: `Cambridge International School, Mandi is dedicated to providing world-class education rooted in strong ethical values, global benchmarks, and experiential discovery.\n\nOur campus fosters critical inquiry, emotional intelligence, and leadership across academics, arts, and athletics.`,
      authorImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
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
