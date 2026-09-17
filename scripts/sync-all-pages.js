const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ALL_PAGES = [
  // Core
  { slug: "home", path: "/", name: "Home Page", category: "Core", description: "Main landing page with hero video, statistics & highlights" },
  // About Us
  { slug: "about", path: "/about", name: "About Cambridge Mandi", category: "About Us", description: "Our heritage, Cambridge legacy & Himalayan sanctuary" },
  { slug: "mission-vision", path: "/about/mission-vision", name: "Mission & Vision", category: "About Us", description: "Core values, philosophy & global perspective" },
  { slug: "chairman-message", path: "/about/chairman-message", name: "Chairman's Message", category: "About Us", description: "Guiding vision & academic leadership ethos" },
  { slug: "principal-message", path: "/about/principal-message", name: "Principal's Desk", category: "About Us", description: "Welcome address & academic benchmarks" },
  { slug: "faculty", path: "/about/faculty", name: "Faculty & Mentors Directory", category: "About Us", description: "Faculty qualifications, profiles & departments" },
  // Academics
  { slug: "academics", path: "/academics", name: "Academic Curriculum", category: "Academics", description: "Integrated CBSE & Cambridge framework" },
  { slug: "pre-primary", path: "/academics/pre-primary", name: "Pre-Primary (Early Years)", category: "Academics", description: "Montessori & experiential kindergarten" },
  { slug: "primary", path: "/academics/primary", name: "Primary Wing (Grades 1-5)", category: "Academics", description: "Foundational conceptual curriculum" },
  { slug: "middle-school", path: "/academics/middle-school", name: "Middle School (Grades 6-8)", category: "Academics", description: "STEM, critical thinking & discovery" },
  { slug: "senior-secondary", path: "/academics/senior-secondary", name: "Senior Secondary (Grades 9-12)", category: "Academics", description: "Medical, Non-Med, Commerce & Humanities" },
  // Admissions
  { slug: "admissions", path: "/admissions", name: "Admissions Hub & Policies", category: "Admissions", description: "Eligibility criteria, guidelines & age matrix" },
  { slug: "procedure", path: "/admissions/procedure", name: "Admission Procedure", category: "Admissions", description: "Step-by-step registration & enrollment" },
  { slug: "fees-structure", path: "/admissions/fees-structure", name: "Fees Structure & Schedule", category: "Admissions", description: "Tuition, transport & schedule breakdown" },
  { slug: "scholarships", path: "/admissions/scholarships", name: "Scholarships & Awards", category: "Admissions", description: "Merit, sports & defence fee waivers" },
  { slug: "apply", path: "/admissions/apply", name: "Apply Online Registration", category: "Admissions", description: "Interactive dynamic student registration form" },
  // Facilities
  { slug: "facilities", path: "/facilities", name: "10-Acre Campus & Facilities", category: "Facilities", description: "World-class campus infrastructure overview" },
  { slug: "smart-classrooms", path: "/facilities/smart-classrooms", name: "Smart Classrooms", category: "Facilities", description: "4K interactive digital podiums & panels" },
  { slug: "science-labs", path: "/facilities/science-labs", name: "Science & AI Labs", category: "Facilities", description: "Physics, Chemistry, Biology & Biotech labs" },
  { slug: "robotics-lab", path: "/facilities/robotics-lab", name: "Robotics & Innovation Lab", category: "Facilities", description: "3D printing, IoT, drones & humanoid robots" },
  { slug: "library", path: "/facilities/library", name: "Central Library", category: "Facilities", description: "25,000+ books & digital e-learning pods" },
  { slug: "sports-complex", path: "/facilities/sports-complex", name: "Olympic Sports Complex", category: "Facilities", description: "Olympic heated pool, FIFA turf & synthetic courts" },
  { slug: "hostel", path: "/facilities/hostel", name: "Residential Boarding Hostel", category: "Facilities", description: "Safe boarding with nutritious dining & study halls" },
  { slug: "transport", path: "/facilities/transport", name: "Transport Fleet", category: "Facilities", description: "GPS & CCTV enabled luxury bus fleet in Mandi" },
  // Student Life
  { slug: "student-life", path: "/student-life", name: "Student Life & Co-Curricular", category: "Student Life", description: "House system, MUN, arts, dance & music" },
  { slug: "achievements", path: "/achievements", name: "Hall of Fame & Achievements", category: "Student Life", description: "National Olympiads & sports gold medalists" },
  { slug: "results", path: "/results", name: "CBSE Board Results", category: "Student Life", description: "Class 10 & 12 state toppers & distinctions" },
  { slug: "gallery", path: "/gallery", name: "Photo & Video Gallery", category: "Student Life", description: "Campus albums, celebrations & event archives" },
  { slug: "virtual-tour", path: "/virtual-tour", name: "360° Virtual Campus Tour", category: "Student Life", description: "Immersive panoramic walk through CIS Mandi" },
  // Connect & Compliance
  { slug: "news", path: "/news", name: "News & Circulars", category: "Connect", description: "Official school bulletins & circulars" },
  { slug: "events", path: "/events", name: "Upcoming Events Calendar", category: "Connect", description: "Competitions, sports meet & annual fest" },
  { slug: "downloads", path: "/downloads", name: "Downloads & Documents", category: "Connect", description: "Syllabus, book lists, datesheets & forms" },
  { slug: "mandatory-disclosure", path: "/mandatory-disclosure", name: "CBSE Mandatory Disclosure", category: "Compliance", description: "OASIS / SARAS compliance documents" },
  { slug: "cbse-information", path: "/cbse-information", name: "CBSE School Information", category: "Compliance", description: "Affiliation status, committee & faculty list" },
  { slug: "careers", path: "/careers", name: "Careers at CIS Mandi", category: "Connect", description: "Teaching vacancies & online application" },
  { slug: "contact", path: "/contact", name: "Contact & Campus Location", category: "Connect", description: "Inquiries, helpline numbers & Google Maps" },
];

async function syncAll() {
  console.log("Starting universal page sync...");

  // 1. Clean 'about' page in DB specifically to eliminate Sunita Sharma
  const aboutStyles = {
    accentColor: "#F59E0B",
    fontFamily: "Inter",
    storyHeadline: "An Inspiring Himalayan Learning Sanctuary",
    mainStory: "Situated in the historic and scenic town of Mandi (known as the 'Varanasi of the Hills'), Cambridge International School Mandi spans a verdant 10-acre campus surrounded by pine-clad mountains and the tranquil Beas river valley.\n\nOur pedagogical philosophy is built on the premise that every student is endowed with unique potential. By synthesizing the rigor of the Central Board of Secondary Education (CBSE Affiliation No. 630198) with progressive Cambridge inquiry methodologies, we foster critical thinking, STEM innovation, artistic expression, and moral character.",
    authorImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
    stats: [
      { number: "2014", label: "Year Founded" },
      { number: "10 Acres", label: "Lush Campus" },
      { number: "100%", label: "CBSE Pass Rate" },
      { number: "15:1", label: "Student-Teacher Ratio" }
    ],
    documents: [
      {
        id: "doc_about_1",
        title: "School Information Brochure & Heritage Profile.pdf",
        fileUrl: "/uploads/prospectus.pdf",
        category: "Brochure",
        fileSize: "2.5 MB"
      }
    ]
  };

  const aboutSections = [
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
          link: "/facilities"
        },
        {
          title: "Cambridge & CBSE Rigor",
          description: "Seamlessly combining CBSE national curriculum excellence with international inquiry-based learning.",
          image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
          badge: "Academics",
          link: "/academics"
        },
        {
          title: "Advanced STEM & Robotics",
          description: "Equipped with state-of-the-art innovation labs, AI robotics workstations, and 3D printing suites.",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
          badge: "Technology",
          link: "/facilities/robotics-lab"
        }
      ]
    }
  ];

  await prisma.pageContent.upsert({
    where: { slug: "about" },
    update: {
      pageName: "About Cambridge Mandi",
      heroBadge: "About Cambridge Mandi • Himalayan Sanctuary",
      heroTitle: "A Legacy of Academic Benchmark & Values",
      heroSubtitle: "Nestled in the majestic Himalayan valley of Mandi, Cambridge International School is an educational sanctuary fostering intellectual curiosity and global perspective.",
      heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
      heroMediaType: "IMAGE",
      heroOverlayOpacity: 0.45,
      heroCtaText: "Explore Campus Facilities",
      heroCtaLink: "/facilities",
      sectionsJson: JSON.stringify(aboutSections),
      customStylesJson: JSON.stringify(aboutStyles),
      isPublished: true,
      updatedBy: "Admin"
    },
    create: {
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
      sectionsJson: JSON.stringify(aboutSections),
      customStylesJson: JSON.stringify(aboutStyles),
      isPublished: true,
      updatedBy: "Admin"
    }
  });
  console.log("Cleaned 'about' page successfully.");

  // 2. Ensure all other pages have valid, rich, non-null data in DB
  for (const p of ALL_PAGES) {
    if (p.slug === "home" || p.slug === "about" || p.slug === "principal-message" || p.slug === "chairman-message") {
      continue;
    }

    const existing = await prisma.pageContent.findUnique({ where: { slug: p.slug } });
    if (!existing || !existing.heroTitle || !existing.sectionsJson || existing.sectionsJson === "[]" || existing.sectionsJson === "null") {
      const defaultSections = [
        {
          id: `sec_${p.slug}_1`,
          type: "features_grid",
          title: `${p.name} - Key Highlights`,
          subtitle: "Engineered to deliver world-class benchmarks and holistic excellence.",
          badge: "Highlights",
          layout: "grid_2",
          items: [
            {
              title: "Modern Infrastructure",
              description: "Equipped with high-tech learning resources, smart technology, and expert supervision.",
              image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
              badge: "Infrastructure",
              link: "/facilities"
            },
            {
              title: "Holistic Mentorship",
              description: "Dedicated faculty guidance, student well-being programs, and career counseling.",
              image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
              badge: "Mentorship",
              link: "/student-life"
            }
          ]
        }
      ];

      const defaultStyles = {
        accentColor: "#F59E0B",
        fontFamily: "Inter",
        storyHeadline: `Welcome to ${p.name}`,
        mainStory: `${p.description}.\n\nCambridge International School Mandi fosters an engaging, safe, and academically rigorous environment where every learner thrives.`,
        authorImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800",
        stats: [
          { number: "100%", label: "CBSE Distinction Rate" },
          { number: "15:1", label: "Student-Teacher Ratio" }
        ],
        documents: [
          {
            id: `doc_${p.slug}_1`,
            title: `${p.name} - Official Guide.pdf`,
            fileUrl: "/uploads/prospectus.pdf",
            category: "Guide",
            fileSize: "1.5 MB"
          }
        ]
      };

      await prisma.pageContent.upsert({
        where: { slug: p.slug },
        update: {
          pageName: p.name,
          heroBadge: `${p.name} • Cambridge International School`,
          heroTitle: p.name,
          heroSubtitle: p.description,
          heroImage: existing?.heroImage || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
          heroMediaType: "IMAGE",
          heroOverlayOpacity: 0.45,
          heroCtaText: "Explore More",
          heroCtaLink: "/about",
          sectionsJson: JSON.stringify(defaultSections),
          customStylesJson: JSON.stringify(defaultStyles),
          isPublished: true,
          updatedBy: "Admin"
        },
        create: {
          slug: p.slug,
          pageName: p.name,
          heroBadge: `${p.name} • Cambridge International School`,
          heroTitle: p.name,
          heroSubtitle: p.description,
          heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
          heroMediaType: "IMAGE",
          heroOverlayOpacity: 0.45,
          heroCtaText: "Explore More",
          heroCtaLink: "/about",
          sectionsJson: JSON.stringify(defaultSections),
          customStylesJson: JSON.stringify(defaultStyles),
          isPublished: true,
          updatedBy: "Admin"
        }
      });
      console.log(`Synced default rich data for '${p.slug}'`);
    }
  }

  console.log("All 38 pages synchronized successfully!");
}

syncAll().catch(err => {
  console.error("Sync error:", err);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
