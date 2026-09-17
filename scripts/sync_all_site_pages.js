const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ALL_PAGES_DATA = {
  // 1. Core / About Us
  "about": {
    heroBadge: "About Cambridge Mandi",
    heroTitle: "Nurturing Global Innovators with Himalayan Roots",
    heroSubtitle: "Founded with the vision to provide benchmark international schooling in Himachal Pradesh, Cambridge International School Mandi has grown into the region's most sought-after center for academic and co-curricular excellence.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "An Inspiring Himalayan Learning Sanctuary",
      mainStory: "Situated in the historic and scenic town of Mandi (known as the 'Varanasi of the Hills'), Cambridge International School Mandi spans a verdant 10-acre campus surrounded by pine-clad mountains and the tranquil Beas river valley.\n\nOur pedagogical philosophy is built on the premise that every student is endowed with unique potential. By synthesizing the rigor of the Central Board of Secondary Education (CBSE Affiliation No. 630198) with progressive Cambridge inquiry methodologies, we foster critical thinking, STEM innovation, artistic expression, and moral character.",
      authorImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
    }
  },
  "mission-vision": {
    heroBadge: "Philosophy & Core Values",
    heroTitle: "Mission, Vision & Guiding Philosophy",
    heroSubtitle: "Our mission is to foster compassionate, intellectually versatile, and future-ready global leaders empowered with character and wisdom.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      missionText: "To create a stimulating, safe, and holistic learning sanctuary where every student discovers their innate brilliance, achieves benchmark academic excellence, and cultivates compassionate leadership rooted in Indian cultural ethos.",
      visionText: "To be universally acclaimed as Himachal Pradesh's benchmark center for progressive education, inspiring generations of resilient global thinkers, ethical problem solvers, and visionary change-makers."
    }
  },
  "chairman-message": {
    heroBadge: "Chairman's Desk • Foundation Ethos",
    heroTitle: "Visionary Leadership & Societal Commitment",
    heroSubtitle: "Empowering young minds with moral compass, visionary thinking, and international competitiveness.",
    heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      chairmanName: "Sh. Vikramaditya Sen",
      chairmanTitle: "Chairman, Cambridge Educational Trust",
      chairmanOrg: "Cambridge International School Mandi",
      chairmanImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      chairmanQuote: "True education transcends the boundaries of textbooks and examinations. It awakens the soul, disciplines the intellect, and empowers young individuals to navigate global complexities with compassion and unyielding integrity.",
      chairmanMessage: "When we conceived Cambridge International School Mandi in the Himalayan heartland, our dream was crystal clear: to bridge pristine nature with cutting-edge 21st-century educational benchmarks.\n\nToday, CIS Mandi is recognized not merely for stellar CBSE board results, but for shaping empathetic, courageous, and creative thinkers who contribute meaningfully to societal progress."
    }
  },
  "principal-message": {
    heroBadge: "Principal's Welcome Desk • Academic Leadership",
    heroTitle: "Fostering Curiosity, Character & Excellence",
    heroSubtitle: "Welcome to Cambridge International School Mandi — a vibrant sanctuary where curiosity is ignited and character is forged.",
    heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      principalName: "Dr. Suniti Sharma",
      principalTitle: "Principal & Senior Academic Director",
      principalOrg: "Ph.D., M.Ed., Cambridge Certified Educator",
      principalImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
      principalQuote: "Education is not the filling of a pail, but the lighting of a fire. At CIS Mandi, we ignite curiosity and instill self-belief in every single student.",
      principalMessage: "Dear Parents and Visitors, welcome to our vibrant campus! In a rapidly evolving world, we prepare students to be agile lifelong learners.\n\nOur blended framework of CBSE rigor and Cambridge inquiry cultivates deep conceptual understanding, empirical scientific discovery, and profound ethical grounding."
    }
  },
  "faculty": {
    heroBadge: "Distinguished Educators",
    heroTitle: "Faculty & Academic Mentors",
    heroSubtitle: "Our faculty comprises seasoned scholars, Olympiad trainers, and passionate mentors dedicated to unlocking each student's peak potential.",
    heroImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      stats: [
        { number: "58+", label: "Faculty Members" },
        { number: "100%", label: "Post-Graduate Certified" },
        { number: "14+ Yrs", label: "Avg Lead Experience" },
        { number: "1 : 15", label: "Teacher-Student Ratio" }
      ]
    }
  },

  // 2. Academics
  "academics": {
    heroBadge: "Academic Curriculum • Cambridge International School",
    heroTitle: "Academic Curriculum",
    heroSubtitle: "Our integrated framework combines CBSE curricular rigor with international Cambridge inquiry pedagogies across four developmental stages.",
    heroImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      affiliationLabel: "CBSE Affiliation No. 630198 • Session 2025-26",
      storyHeadline: "Welcome to Academic Curriculum",
      mainStory: "At Cambridge International School Mandi, academic distinction is a habit. Our curriculum seamlessly guides learners from joyful play-way discovery in Kindergarten through to competitive examination mastery in Senior Secondary."
    }
  },
  "pre-primary": {
    heroBadge: "Early Years Foundation",
    heroTitle: "Pre-Primary Wing (Nursery, LKG, UKG)",
    heroSubtitle: "A vibrant, joyful wonderland where early curiosity is celebrated and foundational love for discovery is born.",
    heroImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      wingAgeGroup: "Ages 3 to 5 Years",
      wingHeadline: "The Joyful Foundation for Lifelong Learning",
      wingParagraph1: "At Cambridge International School Mandi, our Pre-Primary wing provides a secure, loving, and intellectually rich sanctuary where young children transition happily from home to school.",
      wingParagraph2: "Our curriculum seamlessly integrates early cognitive milestones, phonics, spatial awareness, musical rhythm, and social emotional intelligence through activity-based learning.",
      wingCtaText: "Apply for Nursery / KG Admission",
      wingCtaLink: "/admissions/apply",
      wingHighlights: [
        "Montessori & Experiential Play-Way Pedagogy",
        "Jolly Phonics Language & Early Literacy System",
        "Theme-based Sensory & Fine Motor Activity Corners",
        "Dedicated Child-Friendly Kindergarten Play Zone & Sandpit",
        "Air-Conditioned Colorful Smart Classrooms with Soft Flooring",
        "Nurturing Female Faculty with 1:12 Teacher-to-Child Ratio"
      ]
    }
  },
  "primary": {
    heroBadge: "Foundational Stage",
    heroTitle: "Primary Wing (Grades 1 to 5)",
    heroSubtitle: "Fostering academic confidence, conceptual clarity, and boundless creativity during the critical formative years.",
    heroImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    customStyles: {
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
        { name: "Visual & Performing Arts", desc: "Sketching, Indian classical music, theater drama, and folk dance" }
      ]
    }
  },
  "middle-school": {
    heroBadge: "Preparatory & Middle Wing",
    heroTitle: "Middle School (Grades 6 to 8)",
    heroSubtitle: "Transitioning to advanced conceptual inquiry, laboratory experimentation, coding, and inter-school leadership.",
    heroImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      wingAgeGroup: "Ages 11 to 13 Years",
      wingHeadline: "Inquiry, Innovation & Scientific Discovery",
      wingParagraph1: "Middle School marks a vital developmental bridge where students transition into specialized disciplines. At CIS Mandi, science branches into dedicated Physics, Chemistry, and Biology laboratories, while mathematics expands into rigorous algebra and geometry.",
      wingParagraph2: "Students begin weekly sessions in the Himalayan Robotics & AI Innovation Lab, participating in Hackathons, Model United Nations (MUN), and Olympiad training camps.",
      wingCtaText: "Apply for Grade 6-8 Admissions",
      wingCtaLink: "/admissions/apply",
      middleFeatures: [
        { title: "Hands-on Science Labs", desc: "Individual lab stations for Physics, Chemistry, and Biology practicals every week." },
        { title: "Robotics & Arduino", desc: "Students build obstacle-avoiding rovers, sensor circuits, and Python automation scripts." },
        { title: "Third Language Options", desc: "Choice between Sanskrit and French to foster multilingual versatility." }
      ]
    }
  },
  "senior-secondary": {
    heroBadge: "Senior Wing & CBSE Boards",
    heroTitle: "Senior Secondary (Grades 9 to 12)",
    heroSubtitle: "Benchmark CBSE Board preparation across 4 specialized streams with integrated JEE/NEET coaching and university placement mentorship.",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      affiliationLabel: "CBSE Senior Secondary Affiliation No. 630198",
      wingHeadline: "4 Dedicated Streams Crafted for Global Careers",
      wingParagraph1: "Our Senior Secondary wing is led by specialized Master's & Doctorate faculty with proven track records in guiding students to top percentiles in Class 10 & 12 Board examinations and national entrance tests.",
      seniorStreams: [
        {
          name: "Science: Non-Medical (PCM)",
          subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science / Python", "English Core", "Physical Education"],
          careers: "IIT-JEE, Engineering, Architecture, Data Science, Aerospace, Defense (NDA)"
        },
        {
          name: "Science: Medical (PCB)",
          subjects: ["Physics", "Chemistry", "Biology", "Biotechnology / Psychology", "English Core", "Physical Education"],
          careers: "NEET, MBBS, AIIMS, BDS, Veterinary, Biomedical Engineering, Pharmacy"
        },
        {
          name: "Commerce Stream",
          subjects: ["Accountancy", "Business Studies", "Economics", "Applied Mathematics / IP", "English Core", "Physical Education"],
          careers: "Chartered Accountancy (CA), CS, B.Com (Hons), Finance, Corporate Law, Business Management"
        },
        {
          name: "Humanities & Liberal Arts",
          subjects: ["Political Science", "History", "Psychology / Sociology", "Economics", "English Core", "Fine Arts"],
          careers: "Civil Services (UPSC), Law (CLAT), International Relations, Journalism, Public Policy"
        }
      ]
    }
  },

  // 3. Facilities
  "facilities": {
    heroBadge: "World-Class Infrastructure",
    heroTitle: "10-Acre Himalayan Campus & Smart Facilities",
    heroSubtitle: "Designed to international safety and educational benchmarks, our campus blends modern architecture with serene pine forests overlooking Mandi valley.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      campusArea: "10+ Acres Verdant Campus",
      smartClassroomsCount: "42+ Smart 4K Classrooms"
    }
  },
  "smart-classrooms": {
    heroBadge: "Digital Learning Infrastructure",
    heroTitle: "4K Interactive Smart Classrooms",
    heroSubtitle: "Transforming abstract concepts into immersive visual experiences through 21st-century digital classrooms.",
    heroImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      facilityBadge: "Interactive Pedagogy",
      facilityHeadline: "Visual, Engaging & Experiential Learning",
      facilityStory: "Every single classroom at Cambridge International School Mandi is equipped as a full-fledged multimedia smart room. Our teachers utilize 3D simulations, interactive geometry manipulatives, and virtual field trips to explain complex topics.",
      facilitySpecs: [
        "86-inch 4K UHD Anti-Glare Interactive Touch Flat Panels in every classroom",
        "High-definition digital podiums with wireless stylus annotations",
        "Acoustically insulated walls and ceiling sound dampening for crystal clear audio",
        "Ergonomic dual-desk seating engineered to maintain spinal health & posture",
        "High-speed gigabit Wi-Fi 6 connectivity with strict content safety firewalls",
        "Real-time recording system for lecture archiving and revision review"
      ]
    }
  },
  "science-labs": {
    heroBadge: "Hands-on Scientific Inquiry",
    heroTitle: "Science & Biotechnology Laboratories",
    heroSubtitle: "Encouraging empirical experimentation, hypothesis testing, and laboratory safety in purpose-built science suites.",
    heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      facilityBadge: "Empirical Learning",
      facilityHeadline: "Where Young Scientists Discover Truth Through Experimentation",
      facilityStory: "At CIS Mandi, science is taught not through passive memorization, but through active tactile experimentation. Each student performs individual practicals under the close guidance of specialized lab demonstrators and senior faculty.",
      facilitySpecs: [
        "Separate dedicated laboratories for Physics, Chemistry, Biology & Biotech",
        "Precision digital compound microscopes with HD projection monitors",
        "Automated gas manifold system, chemical safety fume hoods & eye-wash showers",
        "Individual student experiment workbenches with quartz acid-resistant tops",
        "Interactive virtual dissection and molecular modeling 3D software",
        "Full adherence to CBSE & NABL scientific safety protocols"
      ]
    }
  },
  "robotics-lab": {
    heroBadge: "Innovation & Maker Space",
    heroTitle: "STEM, Robotics & Drone Innovation Lab",
    heroSubtitle: "National Olympiad Gold Medal winning maker space where young minds design, program, and engineer real-world hardware solutions.",
    heroImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      facilityBadge: "National Gold Medalist Lab 2025",
      facilityHeadline: "From Concept to Creation: Real Engineering for School Students",
      facilityStory: "The CIS Mandi STEM & Robotics Lab is celebrated as one of the most advanced innovation facilities in northern India. Here, students build AI rovers, alpine landslide sensor networks, autonomous line-followers, and IoT smart irrigation models.",
      facilitySpecs: [
        "Dual-extruder Precision 3D Printers for rapid hardware prototyping",
        "Comprehensive Arduino Uno, Mega, ESP32, and Raspberry Pi 5 Maker Kits",
        "Indoor Drone Testing Cage and automated obstacle telemetry courses",
        "Humanoid robotic programming kits with visual block & Python SDKs",
        "IoT environmental weather monitoring station built and maintained by students",
        "Specialized coaching for National & International Robotics Olympiads (WRO / FLL)"
      ]
    }
  },
  "library": {
    heroBadge: "Knowledge & Research Hub",
    heroTitle: "Central Digital Library & Reading Lounge",
    heroSubtitle: "A serene haven of literature, scientific journals, and digital research archives fostering a deep passion for reading.",
    heroImage: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      facilityBadge: "25,000+ Books & Digital Journals",
      facilityHeadline: "Igniting the Imagination and Sustaining Deep Research",
      facilityStory: "The Central Library of CIS Mandi is the intellectual heartbeat of our campus. Bathed in natural Himalayan sunlight with panoramic mountain views, it provides an inspiring atmosphere for reading, creative writing, and competitive exam preparation.",
      facilitySpecs: [
        "Curated collection of 25,000+ fiction, non-fiction, encyclopedias, and references",
        "Digital Kindle e-reader zone with subscriptions to JSTOR & British Council Library",
        "Quiet sound-buffered reading pods and collaborative research conference rooms",
        "Automated RFID book check-out and cloud catalog search kiosks",
        "Dedicated Junior Reader story corner with soft seating and picture books",
        "Daily national and international periodicals, journals, and magazines"
      ]
    }
  },
  "sports-complex": {
    heroBadge: "Athletic Excellence",
    heroTitle: "Olympic Sports Complex & Aquatic Center",
    heroSubtitle: "Fostering physical stamina, teamwork, resilience, and championship pedigree across 12+ competitive sporting disciplines.",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      facilityBadge: "Champions in the Making",
      facilityHeadline: "World-Class Arenas Nurturing National Champions",
      facilityStory: "At CIS Mandi, physical education is an integral pillar of character building. Directed by Col. (Retd.) Harpreet Singh and NIS certified trainers, our athletic program has produced national medalists in swimming, sprint athletics, and shooting.",
      facilitySpecs: [
        "All-weather heated semi-Olympic 25-meter indoor swimming pool",
        "FIFA-standard artificial synthetic football turf with floodlights",
        "Two multi-layered synthetic lawn tennis & basketball courts with FIBA specifications",
        "4-lane Olympic indoor shooting range with electronic target systems",
        "Dedicated international standard wooden badminton and squash courts",
        "NIS certified coaches for swimming, football, cricket, archery & martial arts"
      ]
    }
  },
  "hostel": {
    heroBadge: "Residential Life & Boarding",
    heroTitle: "Himalayan Residential Boarding & Hostel",
    heroSubtitle: "A warm, secure home away from home providing exemplary pastoral care, academic mentoring, and wholesome Himalayan living.",
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      facilityBadge: "Pastoral Care & Comfort",
      facilityHeadline: "Safe, Structured & Loving Residential Community",
      facilityStory: "For parents seeking premier boarding in Himachal Pradesh, the CIS Mandi Hostel offers an environment of camaraderie, discipline, and academic reinforcement. Resident students develop lifelong friendships, self-reliance, and outstanding time-management habits.",
      facilitySpecs: [
        "Air-conditioned & heated separate boarding houses for boys and girls",
        "Nutritious 4-meal daily dining planned by pediatric nutritionists",
        "24x7 resident wardens, medical infirmary, and visiting pediatrician",
        "Evening mandatory prep study sessions with subject faculty mentors",
        "Biometric security access, CCTV perimeter, and female security personnel",
        "Recreation lounge with indoor games, library, and weekend cinema screenings"
      ]
    }
  },
  "transport": {
    heroBadge: "Safety First",
    heroTitle: "GPS & CCTV Monitored Bus Fleet",
    heroSubtitle: "Ensuring secure, punctual, and comfortable daily transit for students across Mandi, Nerchowk, Sundernagar, and adjoining valleys.",
    heroImage: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80",
    customStyles: {
      facilityBadge: "Safety & Real-Time Tracking",
      facilityHeadline: "Punctual, Supervised & Secure Daily Commute",
      facilityStory: "Every bus in the CIS Mandi transport fleet is equipped with real-time GPS telemetry, dual HD CCTV security cameras, speed limit governors (restricted to 40 km/h on mountain roads), and mandatory first-aid kits.",
      facilitySpecs: [
        "Fleet of 25+ luxury buses compliant with Supreme Court safety guidelines",
        "Real-time GPS tracking with live parent mobile application updates",
        "Dual HD CCTV surveillance cameras with audio recording inside all vehicles",
        "Female bus attendants on every route for pre-primary & primary safety",
        "Speed governors locked at 40 km/h and mandatory breathalyzer driver checks",
        "Extensive route coverage spanning Mandi, Sundernagar, Gutkar, and Nerchowk"
      ]
    }
  },

  // 4. Admissions
  "admissions": {
    heroBadge: "Session 2027–2028 Open",
    heroTitle: "Admissions Hub — Cambridge Mandi",
    heroSubtitle: "Join an inspiring community dedicated to academic rigor, character building, and international excellence in Himachal Pradesh.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      bannerBadge: "Limited Seats per Grade",
      bannerTitle: "Admissions Open for Nursery to Grade XI",
      bannerDesc: "We maintain a low 1:15 mentor-student ratio to ensure every child receives personalized attention and accelerated learning support.",
      bannerBtn1Text: "Fill Online Application",
      bannerBtn1Link: "/admissions/apply"
    }
  },
  "procedure": {
    heroBadge: "Eligibility & Guidelines",
    heroTitle: "Admission Procedure & Age Matrix",
    heroSubtitle: "Comprehensive guidelines on age eligibility criteria, admission test schedules, and document checklists.",
    heroImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      ageMatrixTitle: "Age Criteria for Session 2025–2026",
      ageMatrixBadge: "Eligibility Matrix",
      docsTitle: "Mandatory Documents for Final Admission",
      docsBadge: "Verification Checklist"
    }
  },
  "fees-structure": {
    heroBadge: "Transparent & Structured • Academic Year 2025–26",
    heroTitle: "Fees Structure & Schedule",
    heroSubtitle: "Comprehensive tuition schedule, transport slabs, and residential boarding fee breakdown.",
    heroImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      tuitionScheduleTitle: "Comprehensive Tuition Schedule 2025–2026",
      tuitionScheduleBadge: "Fee Schedule"
    }
  },
  "scholarships": {
    heroBadge: "Financial Aid & Laurels",
    heroTitle: "Scholarships & Merit Fee Concessions",
    heroSubtitle: "Rewarding academic brilliance, sports prowess, and honoring our valiant armed forces personnel.",
    heroImage: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      schemesTitle: "Merit & Privilege Fee Waiver Programs",
      schemesBadge: "Fee Concession Categories"
    }
  },

  // 5. Student Life & Results
  "student-life": {
    heroBadge: "Holistic Development",
    heroTitle: "Student Life, House System & Co-Curriculars",
    heroSubtitle: "Fostering teamwork, creative expression, leadership, and camaraderie through 15+ student clubs and house competitions.",
    heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      housesTitle: "The Four School Houses",
      housesSubtitle: "Every student belongs to one of four houses, competing annually for the prestigious Cock House Championship Trophy."
    }
  },
  "results": {
    heroBadge: "Academic Benchmark",
    heroTitle: "CBSE Board Results & Distinction Analytics",
    heroSubtitle: "A legacy of academic brilliance reflected in stellar CBSE Class X & XII Board percentiles and premier university placements.",
    heroImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      toppersTitle: "Our Stellar Board Toppers",
      toppersBadge: "CBSE Class X & XII Stars"
    }
  },
  "contact": {
    heroBadge: "Contact & Campus Location",
    heroTitle: "Get in Touch with Cambridge Mandi",
    heroSubtitle: "Have questions about admissions, campus visits, or career opportunities? Our dedicated team is here to assist you.",
    heroImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      officeHours: "Mon - Sat: 8:30 AM - 4:00 PM"
    }
  },

  // 6. Additional Pages
  "apply": {
    heroBadge: "Admissions 2027–2028",
    heroTitle: "Online Student Admission Application",
    heroSubtitle: "Begin your child's journey towards academic excellence and global leadership at Cambridge International School Mandi.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Admissions Process for 2027–28 Session",
      mainStory: "We welcome prospective parents and candidates to complete our transparent digital enrollment application."
    }
  },
  "achievements": {
    heroBadge: "Student Laurels & Honors",
    heroTitle: "School Laurels & Olympiad Distinctions",
    heroSubtitle: "Celebrating remarkable national awards, state sports championships, and international Olympiad medals earned by Cambridge Mandi scholars.",
    heroImage: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "A Legacy of Championship & Distinction",
      mainStory: "Our students regularly achieve top honors in National Science Olympiads, regional athletic meets, and state cultural competitions."
    }
  },
  "gallery": {
    heroBadge: "Campus Life Moments",
    heroTitle: "Campus Photo & Event Gallery",
    heroSubtitle: "A visual glimpse into daily life, cultural festivals, sports tournaments, and experiential learning across our 10-acre campus.",
    heroImage: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Life at Cambridge Mandi",
      mainStory: "Capturing moments of discovery, camaraderie, artistic triumphs, and sporting victories."
    }
  },
  "virtual-tour": {
    heroBadge: "Interactive 3D Walkthrough",
    heroTitle: "Virtual Campus Tour",
    heroSubtitle: "Experience the state-of-the-art facilities, laboratories, and grounds of Cambridge Mandi from anywhere in the world.",
    heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Explore Our 10-Acre Alpine Grounds",
      mainStory: "Take a self-guided visual journey through classrooms, laboratories, sports grounds, and hostel dorms."
    }
  },
  "news": {
    heroBadge: "Announcements & Updates",
    heroTitle: "Campus News & Bulletins",
    heroSubtitle: "Stay updated with academic circulars, celebration highlights, and school community notifications.",
    heroImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Latest School News & Announcements",
      mainStory: "Read all latest news and notices concerning curriculum events, parent-teacher meets, and vacation schedules."
    }
  },
  "events": {
    heroBadge: "Calendar & Celebrations",
    heroTitle: "Annual Events & Cultural Calendar",
    heroSubtitle: "Annual sports day, Model UN conferences, science exhibitions, and music festival dates at CIS Mandi.",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Upcoming Celebrations & Important Dates",
      mainStory: "Our annual calendar is rich with academic seminars, inter-house sports tournaments, and performing arts festivals."
    }
  },
  "downloads": {
    heroBadge: "Forms & Curriculum Documents",
    heroTitle: "Parent & Student Download Center",
    heroSubtitle: "Access CBSE book lists, academic calendar, transport routes, and medical fitness certificates.",
    heroImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Download Essential School Documents",
      mainStory: "Official circulars, book lists, syllabi, and application forms available for instant download in PDF format."
    }
  },
  "mandatory-disclosure": {
    heroBadge: "CBSE Statutory Compliance",
    heroTitle: "Mandatory Public Disclosure (SARAS 5.0)",
    heroSubtitle: "Official documentation, society registration, affiliation certificates, fire safety, and water testing reports in compliance with CBSE directives.",
    heroImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Transparency & Governance Compliance",
      mainStory: "Cambridge International School Mandi adheres fully to all CBSE affiliation bylaws and statutory public disclosure requirements."
    }
  },
  "cbse-information": {
    heroBadge: "Affiliation No. 630198",
    heroTitle: "CBSE Compliance & Governance",
    heroSubtitle: "Academic bylaws, School Managing Committee (SMC), teacher training certifications, and student safety committees.",
    heroImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "School Management & Governance",
      mainStory: "Detailed information about the School Managing Committee (SMC), POCSO safety cell, and CBSE curriculum execution."
    }
  },
  "careers": {
    heroBadge: "Join Our Faculty",
    heroTitle: "Careers at Cambridge Mandi",
    heroSubtitle: "Join an empowered community of passionate educators and academic leaders in the Himalayan foothills.",
    heroImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
    customStyles: {
      storyHeadline: "Empowering Educators, Inspiring Futures",
      mainStory: "We offer competitive remuneration, on-campus accommodation, comprehensive medical benefits, and continuous professional development."
    }
  }
};

async function syncAllPages() {
  console.log('Starting full sync of all site pages in SQLite DB...');
  let count = 0;
  for (const [slug, data] of Object.entries(ALL_PAGES_DATA)) {
    try {
      await prisma.pageContent.upsert({
        where: { slug },
        create: {
          slug,
          pageName: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          heroBadge: data.heroBadge,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImage: data.heroImage,
          sectionsJson: '[]',
          customStylesJson: JSON.stringify(data.customStyles || {}),
          isPublished: true,
        },
        update: {
          heroBadge: data.heroBadge,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroImage: data.heroImage,
          sectionsJson: '[]',
          customStylesJson: JSON.stringify(data.customStyles || {}),
        }
      });
      count++;
      console.log(`✓ Synced ${slug}`);
    } catch (err) {
      console.error(`✗ Error syncing ${slug}:`, err.message);
    }
  }
  console.log(`Done! Successfully synced ${count} pages with authentic photos, badges, titles & custom content.`);
}

syncAllPages().finally(() => prisma.$disconnect());
