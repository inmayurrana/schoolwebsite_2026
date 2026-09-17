const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const pm = await prisma.pageContent.findUnique({ where: { slug: 'principal-message' } });
  const pmStyles = pm?.customStylesJson ? JSON.parse(pm.customStylesJson) : {};

  const home = await prisma.pageContent.findUnique({ where: { slug: 'home' } });
  const existingStyles = home?.customStylesJson ? JSON.parse(home.customStylesJson) : {};

  const updatedStyles = {
    accentColor: "#F59E0B",
    fontFamily: "Inter",
    storyHeadline: "Messages from Our Leadership",
    chairmanName: existingStyles.chairmanName || "Sh. Arvind Thakur",
    chairmanTitle: existingStyles.chairmanTitle || "Chairman & Managing Trustee",
    chairmanOrg: existingStyles.chairmanOrg || "Cambridge Education Foundation",
    chairmanImage: existingStyles.chairmanImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    chairmanQuote: existingStyles.chairmanQuote || '"Education is not merely the accumulation of textbooks; it is the ignition of an inner flame of inquiry, moral courage, and compassionate leadership. At Cambridge Mandi, we are dedicated to providing our students with a world-class launchpad right here in the heart of Himachal Pradesh."',
    principalName: pmStyles.authorName || existingStyles.principalName || "Mrs. Priyanka Jamwal",
    principalTitle: pmStyles.authorTitle || existingStyles.principalTitle || "Principal & Academic Director",
    principalOrg: pmStyles.authorOrg || existingStyles.principalOrg || "Cambridge International School Mandi",
    principalImage: pmStyles.authorImage || existingStyles.principalImage || "/uploads/Mrs_-Priyanka-Jamwal_0f45e295f9f7.webp",
    principalQuote: pmStyles.quote || existingStyles.principalQuote || '"Every child arrives with unique creative genius. Our role as educators is to provide a caring, academically rigorous space where curiosity is celebrated, questions are encouraged, and students learn to turn obstacles into launching pads for achievement."',
    authorName: pmStyles.authorName || "Mrs. Priyanka Jamwal",
    authorTitle: pmStyles.authorTitle || "Principal & Academic Director",
    authorImage: pmStyles.authorImage || "/uploads/Mrs_-Priyanka-Jamwal_0f45e295f9f7.webp",
    stats: existingStyles.stats && existingStyles.stats.length > 0 ? existingStyles.stats : [
      { number: "100%", label: "CBSE Board Pass Rate" },
      { number: "15:1", label: "Student-Teacher Ratio" },
      { number: "10+ Acres", label: "Himalayan Campus" },
      { number: "25+", label: "Advanced Labs & Studios" }
    ],
    documents: existingStyles.documents && existingStyles.documents.length > 0 ? existingStyles.documents : [
      {
        id: "doc_home_1",
        title: "Cambridge Mandi Information Prospectus 2025-26.pdf",
        fileUrl: "/uploads/prospectus.pdf",
        category: "Prospectus",
        fileSize: "2.8 MB"
      }
    ]
  };

  const sections = [
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
    {
      id: "home_sec_2",
      type: "modular_cards",
      title: "Academic Continuum & Streams",
      subtitle: "From early years inquiry to senior secondary board distinctions.",
      badge: "Curriculum Pathways",
      layout: "grid_4",
      items: [
        {
          title: "Pre-Primary (Early Years)",
          description: "Montessori-inspired experiential play and foundational discovery.",
          image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
          badge: "Ages 3-5",
          link: "/academics/pre-primary",
        },
        {
          title: "Primary Wing (Grades 1-5)",
          description: "Conceptual literacy, numeracy, and environmental awareness.",
          image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
          badge: "Grades 1-5",
          link: "/academics/primary",
        },
        {
          title: "Middle School (Grades 6-8)",
          description: "Analytical STEM inquiry, language arts, and coding fundamentals.",
          image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
          badge: "Grades 6-8",
          link: "/academics/middle-school",
        },
        {
          title: "Senior Secondary (Grades 9-12)",
          description: "Medical, Non-Medical, Commerce, and Humanities career streams.",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
          badge: "Grades 9-12",
          link: "/academics/senior-secondary",
        },
      ],
    },
    {
      id: "home_sec_3",
      type: "modular_cards",
      title: "Campus Living & World-Class Facilities",
      subtitle: "A modern 10-acre Himalayan sanctuary designed for well-rounded growth.",
      badge: "Infrastructure",
      layout: "grid_3",
      items: [
        {
          title: "Central Digital Library",
          description: "25,000+ volumes, international journals, and quiet research pods.",
          image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
          badge: "Knowledge Hub",
          link: "/facilities/library",
        },
        {
          title: "Residential Boarding Hostel",
          description: "Secure, home-like air-conditioned boarding with organic dining.",
          image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
          badge: "Safe Boarding",
          link: "/facilities/hostel",
        },
        {
          title: "GPS-Enabled Transport Fleet",
          description: "Comfortable CCTV and GPS tracked buses connecting Mandi district.",
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
          badge: "Safe Transit",
          link: "/facilities/transport",
        },
      ],
    }
  ];

  await prisma.pageContent.upsert({
    where: { slug: 'home' },
    update: {
      customStylesJson: JSON.stringify(updatedStyles),
      sectionsJson: JSON.stringify(sections),
      heroBadge: home?.heroBadge || "CBSE Affiliated #630198 • Admissions 2027-28 Open",
      heroTitle: home?.heroTitle || "Inspiring Excellence Amidst Himalayan Serenity",
      heroSubtitle: home?.heroSubtitle || "Himachal Pradesh's premier Cambridge & CBSE day-cum-boarding institution empowering tomorrow's innovators with smart tech, Olympic sports, and cultural ethos.",
      heroCtaText: home?.heroCtaText || "Apply for Admission 2027-28",
      heroCtaLink: home?.heroCtaLink || "/admissions/apply",
      heroMediaType: home?.heroMediaType || "VIDEO",
      heroVideoUrl: home?.heroVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-school-campus-41551-large.mp4",
      heroOverlayOpacity: home?.heroOverlayOpacity ?? 0.45,
    },
    create: {
      slug: 'home',
      pageName: 'Home Page',
      heroBadge: "CBSE Affiliated #630198 • Admissions 2027-28 Open",
      heroTitle: "Inspiring Excellence Amidst Himalayan Serenity",
      heroSubtitle: "Himachal Pradesh's premier Cambridge & CBSE day-cum-boarding institution empowering tomorrow's innovators with smart tech, Olympic sports, and cultural ethos.",
      heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
      heroMediaType: "VIDEO",
      heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-school-campus-41551-large.mp4",
      heroOverlayOpacity: 0.45,
      heroCtaText: "Apply for Admission 2027-28",
      heroCtaLink: "/admissions/apply",
      sectionsJson: JSON.stringify(sections),
      customStylesJson: JSON.stringify(updatedStyles),
      isPublished: true,
      updatedBy: "Admin"
    }
  });

  console.log("Successfully synchronized home page content and leadership data!");
}

run().finally(() => prisma.$disconnect());
