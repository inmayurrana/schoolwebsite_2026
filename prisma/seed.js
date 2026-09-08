const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Cambridge International School, Mandi database...");

  // 1. Clean existing records (optional for fresh seed)
  await prisma.auditLog.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobOpening.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.galleryAlbum.deleteMany();
  await prisma.document.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.event.deleteMany();
  await prisma.news.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Admin Users
  const passwordHash = await bcrypt.hash("Admin@12345", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Director / Super Admin",
        email: "admin@cismandi.edu.in",
        password: passwordHash,
        role: "SUPER_ADMIN",
        phone: "+91 98160 12345",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isActive: true,
      },
      {
        name: "Dr. Sunita Sharma (Principal)",
        email: "principal@cismandi.edu.in",
        password: passwordHash,
        role: "PRINCIPAL",
        phone: "+91 98160 23456",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        isActive: true,
      },
      {
        name: "Rohit Verma (Editor & PRO)",
        email: "editor@cismandi.edu.in",
        password: passwordHash,
        role: "STAFF_EDITOR",
        phone: "+91 98160 34567",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        isActive: true,
      },
    ],
  });

  // 3. Site Settings
  const settings = [
    { key: "school_name", value: "Cambridge International School, Mandi", category: "GENERAL", description: "Official School Name" },
    { key: "school_tagline", value: "Empowering Global Minds Amidst Himalayan Serenity", category: "GENERAL", description: "Motto & Tagline" },
    { key: "cbse_affiliation_no", value: "630198", category: "GENERAL", description: "CBSE Affiliation Number" },
    { key: "school_code", value: "43190", category: "GENERAL", description: "CBSE School Code" },
    { key: "contact_phone", value: "+91 1905 223456 / +91 98160 99999", category: "CONTACT", description: "Primary Phone Numbers" },
    { key: "contact_email", value: "info@cismandi.edu.in, admissions@cismandi.edu.in", category: "CONTACT", description: "Official Email Addresses" },
    { key: "school_address", value: "Near Victoria Bridge, Gutkar / Mandi Bypass, Mandi, Himachal Pradesh - 175001, India", category: "CONTACT", description: "Campus Address" },
    { key: "whatsapp_number", value: "+919816099999", category: "CONTACT", description: "WhatsApp Helpline for Parents" },
    { key: "admission_status", value: "OPEN", category: "ADMISSION", description: "Current Admission Status (OPEN / CLOSED)" },
    { key: "academic_year", value: "2025-2026", category: "ADMISSION", description: "Current Academic Session" },
    { key: "facebook_url", value: "https://facebook.com/cismandi", category: "SOCIAL", description: "Facebook Page" },
    { key: "instagram_url", value: "https://instagram.com/cismandi_official", category: "SOCIAL", description: "Instagram Handle" },
    { key: "youtube_url", value: "https://youtube.com/@cismandi", category: "SOCIAL", description: "YouTube Channel" },
    { key: "meta_title", value: "Cambridge International School Mandi | Best CBSE Day & Boarding School in Himachal", category: "SEO", description: "Default Meta Title" },
    { key: "meta_description", value: "Cambridge International School Mandi is Himachal Pradesh's premier CBSE co-educational institution offering smart classrooms, STEM labs, robotics, sports complex, and world-class boarding.", category: "SEO", description: "Default Meta Description" },
  ];

  for (const item of settings) {
    await prisma.siteSetting.create({ data: item });
  }

  // 4. News & Announcements
  await prisma.news.createMany({
    data: [
      {
        title: "Cambridge Mandi Students Clinch 1st Prize at National STEM & Robotics Olympiad 2025",
        slug: "national-stem-robotics-olympiad-champions-2025",
        excerpt: "Our middle and senior school robotics team represented Himachal Pradesh at the National Level held in New Delhi, bagging Gold.",
        content: "We are immensely proud to announce that the robotics innovation team of Cambridge International School, Mandi has secured the First Position with a Gold Medal at the All-India Inter-School STEM & AI Championship 2025. The project featured an AI-powered landslide detection and alpine avalanche alert system engineered entirely in our CIS Innovation Lab.",
        coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        category: "Achievements",
        isFeatured: true,
        isPublished: true,
        views: 1420,
      },
      {
        title: "Admissions Open for Session 2025-2026 from Nursery to Grade XI (Science, Commerce, Humanities)",
        slug: "admissions-open-session-2025-2026",
        excerpt: "Online registrations and campus walkthrough bookings are now live for the upcoming academic session.",
        content: "Cambridge International School, Mandi invites prospective parents and students for admissions across Pre-Primary, Primary, Middle, and Senior Secondary wings. Benefit from our state-of-the-art infrastructure, Olympic sports facilities, and experiential Cambridge-CBSE blended curriculum.",
        coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        category: "Announcements",
        isFeatured: true,
        isPublished: true,
        views: 2950,
      },
      {
        title: "CIS Mandi Hosts Inter-School Alpine Sports & Athletics Championship 2025",
        slug: "inter-school-alpine-sports-championship-2025",
        excerpt: "Over 24 top schools from Himachal Pradesh and Punjab participated in our 3-day sports carnival.",
        content: "The synthetic athletic track, FIFA-standard football ground, and all-weather indoor badminton arena of CIS Mandi witnessed thrilling competitions during the Annual Inter-School Sports Meet. Cambridge Mandi emerged as the overall trophy winner with 18 Gold, 12 Silver, and 9 Bronze medals.",
        coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
        category: "Sports",
        isFeatured: false,
        isPublished: true,
        views: 870,
      },
      {
        title: "CBSE Class X & XII Board Results: 100% Pass Rate with 42 Students Scoring Above 95%",
        slug: "cbse-board-results-stellar-performance",
        excerpt: "Exemplary academic results declared by CBSE for Class X and XII batch with district-topping percentiles.",
        content: "Continuing our tradition of academic brilliance, Cambridge International School Mandi students have once again scripted history. Aarav Thakur scored 99.2% in Class XII Science stream, while Sneha Kapoor secured 98.8% in Humanities.",
        coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
        category: "Academics",
        isFeatured: true,
        isPublished: true,
        views: 3100,
      },
    ],
  });

  // 5. Events
  await prisma.event.createMany({
    data: [
      {
        title: "Annual Cultural Extravaganza — 'Udaan 2025'",
        slug: "annual-cultural-day-udaan-2025",
        description: "A grand evening celebrating Himalayan folklore, classical arts, theatrical dramas, and international musical orchestra by CIS students.",
        venue: "Main Grand Auditorium, CIS Mandi",
        startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        category: "Cultural",
        coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
        isPublished: true,
        rsvpCount: 245,
      },
      {
        title: "Himalayan Science & AI Innovation Expo 2025",
        slug: "science-ai-innovation-expo-2025",
        description: "Witness over 150 live working models in Artificial Intelligence, Solar Energy, Hydro-power, and Robotics built by CIS young innovators.",
        venue: "STEM & Robotics Innovation Wing",
        startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        category: "Academic",
        coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
        isPublished: true,
        rsvpCount: 180,
      },
      {
        title: "Inter-House Aquatic & Swimming Championship",
        slug: "inter-house-aquatic-championship-2025",
        description: "All four school houses compete in 50m freestyle, backstroke, butterfly, and medley relays in our heated Olympic-spec pool.",
        venue: "CIS Indoor Aquatic Complex",
        startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        category: "Sports",
        coverImage: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
        isPublished: true,
        rsvpCount: 95,
      },
      {
        title: "Parent-Teacher Conclave & Career Guidance Summit",
        slug: "parent-teacher-conclave-career-summit-2025",
        description: "Interactive one-on-one sessions for Classes IX-XII with leading career counselors and university delegates from India & abroad.",
        venue: "Conference Hall & Smart Classrooms",
        startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        category: "Academic",
        coverImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
        isPublished: true,
        rsvpCount: 310,
      },
    ],
  });

  // 6. Gallery Albums & Items
  const campusAlbum = await prisma.galleryAlbum.create({
    data: {
      title: "Himalayan Campus & World-Class Infrastructure",
      slug: "campus-infrastructure",
      category: "Campus",
      description: "State-of-the-art academic blocks, lush green courtyards, smart panels, and serene Shivalik mountain vistas.",
      coverImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
  });

  await prisma.galleryItem.createMany({
    data: [
      {
        albumId: campusAlbum.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
        title: "Main Administrative & Academic Wing",
        caption: "Architecturally crafted with natural light and earthquake-resistant Himalayan structural engineering.",
        sortOrder: 1,
      },
      {
        albumId: campusAlbum.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
        title: "Interactive Smart Classroom",
        caption: "Equipped with 86-inch 4K touchscreen interactive panels, acoustic panels, and ergonomic seating.",
        sortOrder: 2,
      },
      {
        albumId: campusAlbum.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80",
        title: "Central Digital Library & Knowledge Hub",
        caption: "Over 25,000 titles, international journals, kindle stations, and silent study pods.",
        sortOrder: 3,
      },
      {
        albumId: campusAlbum.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
        title: "AI & Robotics Innovation Lab",
        caption: "Equipped with 3D printers, Arduino kits, Raspberry Pi rigs, and humanoid robotic modules.",
        sortOrder: 4,
      },
    ],
  });

  const sportsAlbum = await prisma.galleryAlbum.create({
    data: {
      title: "Sports Complex & Athletic Arenas",
      slug: "sports-complex-arenas",
      category: "Sports",
      description: "Olympic size sports infrastructure fostering champions in cricket, football, basketball, swimming, and shooting.",
      coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
      isFeatured: true,
    },
  });

  await prisma.galleryItem.createMany({
    data: [
      {
        albumId: sportsAlbum.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
        title: "FIFA Standard Football Turf",
        caption: "Lush green natural turf surrounded by Himalayan ridges.",
        sortOrder: 1,
      },
      {
        albumId: sportsAlbum.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop&q=80",
        title: "Temperature Controlled Indoor Swimming Pool",
        caption: "6-lane 25m semi-Olympic pool with certified national life guards.",
        sortOrder: 2,
      },
      {
        albumId: sportsAlbum.id,
        type: "IMAGE",
        url: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=800&auto=format&fit=crop&q=80",
        title: "Multi-court Basketball Arena",
        caption: "Synthetic FIBA-approved cushioning and floodlight illumination.",
        sortOrder: 3,
      },
    ],
  });

  // 7. Documents & Circulars
  await prisma.document.createMany({
    data: [
      {
        title: "CBSE Mandatory Public Disclosure (SARAS / OASIS Compliant)",
        category: "MANDATORY_DISCLOSURE",
        docNumber: "CIS-MPD-2025-01",
        fileUrl: "/sample-documents/CBSE_Mandatory_Disclosure_CIS_Mandi.pdf",
        fileType: "application/pdf",
        fileSize: "1.8 MB",
        targetAudience: "ALL",
        isPublic: true,
        downloadsCount: 840,
      },
      {
        title: "Official School Prospectus & Admission Guide 2025-26",
        category: "PROSPECTUS",
        docNumber: "CIS-PROSP-2025",
        fileUrl: "/sample-documents/CIS_Mandi_Prospectus_2025_2026.pdf",
        fileType: "application/pdf",
        fileSize: "4.2 MB",
        targetAudience: "PARENTS",
        isPublic: true,
        downloadsCount: 2310,
      },
      {
        title: "Annual Academic Calendar & Holiday List 2025-2026",
        category: "CIRCULAR",
        docNumber: "CIS-ACAD-CAL-2025",
        fileUrl: "/sample-documents/Academic_Calendar_2025_2026.pdf",
        fileType: "application/pdf",
        fileSize: "1.2 MB",
        targetAudience: "ALL",
        isPublic: true,
        downloadsCount: 1420,
      },
      {
        title: "Fee Structure, Transport Matrix & Payment Schedule 2025-26",
        category: "FORM",
        docNumber: "CIS-FEE-2025",
        fileUrl: "/sample-documents/Fee_Structure_CIS_Mandi_2025_2026.pdf",
        fileType: "application/pdf",
        fileSize: "950 KB",
        targetAudience: "PARENTS",
        isPublic: true,
        downloadsCount: 1980,
      },
      {
        title: "Prescribed NCERT & Cambridge Reference Book List (Grade 1 to 12)",
        category: "BOOK_LIST",
        docNumber: "CIS-BOOKS-2025",
        fileUrl: "/sample-documents/Prescribed_Book_List_2025_2026.pdf",
        fileType: "application/pdf",
        fileSize: "1.5 MB",
        targetAudience: "STUDENTS",
        isPublic: true,
        downloadsCount: 1120,
      },
      {
        title: "Transfer Certificate (TC) Application & Verification Policy",
        category: "CBSE_DOC",
        docNumber: "CIS-TC-POLICY",
        fileUrl: "/sample-documents/TC_Policy_and_Verification.pdf",
        fileType: "application/pdf",
        fileSize: "680 KB",
        targetAudience: "PARENTS",
        isPublic: true,
        downloadsCount: 460,
      },
    ],
  });

  // 8. Achievements
  await prisma.achievement.createMany({
    data: [
      {
        studentName: "Aarav Thakur",
        grade: "Class XII (Science)",
        title: "District Topper & JEE Advanced AIR 412",
        category: "ACADEMIC",
        year: "2024-2025",
        rank: "AIR 412 (IIT Bombay Selected)",
        description: "Scored 99.2% in CBSE Class XII Boards with 100/100 in Physics and Mathematics, qualifying for IIT Bombay Computer Science.",
        photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
        isFeatured: true,
      },
      {
        studentName: "Ananya Sharma & Team",
        grade: "Class IX & X",
        title: "National STEM Robotics Innovation Gold Medal",
        category: "ROBOTICS",
        year: "2024-2025",
        rank: "1st Position (Gold Medal)",
        description: "Engineered an IoT-enabled landslide early warning and seismic monitoring rover tailored for Himalayan roads.",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
        isFeatured: true,
      },
      {
        studentName: "Devansh Sen",
        grade: "Class XI",
        title: "CBSE National Athletic Championship - 400m Gold",
        category: "SPORTS",
        year: "2024-2025",
        rank: "National Champion (Gold Medal)",
        description: "Set a new state record timing of 48.6 seconds in the 400m sprint at the CBSE National Athletics Meet.",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        isFeatured: true,
      },
      {
        studentName: "Sneha Kapoor",
        grade: "Class XII (Humanities)",
        title: "CBSE Class XII State Topper (98.8%)",
        category: "ACADEMIC",
        year: "2023-2024",
        rank: "State Rank 1",
        description: "Secured 100/100 in Political Science and History, now pursuing BA Hons at Lady Shri Ram College, Delhi.",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        isFeatured: true,
      },
    ],
  });

  // 9. Faculty & Leadership Directory
  await prisma.faculty.createMany({
    data: [
      {
        name: "Dr. Sunita Sharma",
        designation: "Principal & Academic Director",
        department: "Administration",
        qualification: "Ph.D. in Education (Gold Medalist), M.Sc. Physics, B.Ed.",
        experience: "24+ Years in CBSE & Cambridge International Schools",
        email: "principal@cismandi.edu.in",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        bio: "Recipient of the National Best Educator Award, Dr. Sharma champions progressive pedagogy, STEM integration, and emotional quotient development.",
        sortOrder: 1,
        isLeadership: true,
      },
      {
        name: "Prof. Rajeshwar Sen",
        designation: "Vice Principal & Dean of Academics",
        department: "Administration",
        qualification: "M.A. English Literature, M.Phil, B.Ed.",
        experience: "19+ Years of Academic Leadership",
        email: "dean@cismandi.edu.in",
        photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
        bio: "Specializes in curriculum benchmarking, teacher enrichment workshops, and CBSE board examination coordination.",
        sortOrder: 2,
        isLeadership: true,
      },
      {
        name: "Vikramaditya Jamwal",
        designation: "Head of Sciences & Physics Lead",
        department: "Sciences",
        qualification: "M.Sc. Physics (IIT Roorkee), B.Ed.",
        experience: "14+ Years in Senior Secondary Coaching",
        email: "physics@cismandi.edu.in",
        photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
        bio: "Mentored over 50+ students into IITs, NITs, and AIIMS with experimental physics labs and concept-first methodology.",
        sortOrder: 3,
        isLeadership: false,
      },
      {
        name: "Meenakshi Chauhan",
        designation: "Head of Mathematics & Olympiad Coach",
        department: "Mathematics",
        qualification: "M.Sc. Mathematics, B.Ed., CSIR-NET",
        experience: "12+ Years Teaching Experience",
        email: "maths@cismandi.edu.in",
        photoUrl: "https://images.unsplash.com/photo-1580894732470-349f76a59dc3?w=400&auto=format&fit=crop&q=80",
        bio: "Inspires deep love for calculus and geometry through visual math simulators and Vedic mathematics shortcuts.",
        sortOrder: 4,
        isLeadership: false,
      },
      {
        name: "Ankush Pathania",
        designation: "Head of AI, Computer Science & Robotics",
        department: "Sciences",
        qualification: "M.Tech in Artificial Intelligence, B.Tech CSE",
        experience: "9+ Years in EdTech & STEM Labs",
        email: "ai.lab@cismandi.edu.in",
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
        bio: "Directs the Cambridge Mandi Robotics & Drone Innovation Hub, leading students to national hackathons and robotics cups.",
        sortOrder: 5,
        isLeadership: false,
      },
      {
        name: "Col. (Retd.) Harpreet Singh",
        designation: "Director of Sports & Physical Education",
        department: "Sports",
        qualification: "M.P.Ed., NIS Certified Coach, Ex-Army Physical Trainer",
        experience: "22+ Years in Youth Physical Fitness",
        email: "sports@cismandi.edu.in",
        photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
        bio: "Instills military discipline, teamwork, swimming proficiency, and multi-sport excellence across all student age groups.",
        sortOrder: 6,
        isLeadership: true,
      },
    ],
  });

  // 10. Sample Admissions Applications
  await prisma.admissionApplication.createMany({
    data: [
      {
        applicationNo: "CIS-2025-0841",
        studentName: "Reyansh Gupta",
        dob: "2010-04-12",
        gender: "Male",
        bloodGroup: "B+",
        gradeApplying: "Grade IX",
        academicYear: "2025-2026",
        fatherName: "Rajesh Gupta",
        fatherPhone: "+91 98160 55511",
        fatherOccupation: "Civil Engineer, HP PWD",
        motherName: "Pooja Gupta",
        motherPhone: "+91 98160 55512",
        motherOccupation: "Doctor (Pediatrician)",
        email: "rajesh.gupta@example.com",
        phone: "+91 98160 55511",
        address: "House No 42, Samkhetar Ward, Mandi, HP",
        city: "Mandi",
        state: "Himachal Pradesh",
        pincode: "175001",
        previousSchool: "St. Xavier's Convent, Mandi",
        previousGrade: "Grade VIII",
        previousMarks: "94.5%",
        status: "INTERVIEW_SCHEDULED",
        transportRequired: true,
        hostelRequired: false,
        remarks: "Candidate has strong aptitude in Mathematics and Science. Scheduled for interaction on 15th March.",
      },
      {
        applicationNo: "CIS-2025-0842",
        studentName: "Aditi Thakur",
        dob: "2008-09-24",
        gender: "Female",
        bloodGroup: "O+",
        gradeApplying: "Grade XI",
        academicYear: "2025-2026",
        stream: "Science (Medical - PCB + Biotechnology)",
        fatherName: "Kewal Singh Thakur",
        fatherPhone: "+91 98161 44422",
        fatherOccupation: "Advocate, Mandi District Court",
        motherName: "Sunita Thakur",
        motherPhone: "+91 98161 44423",
        motherOccupation: "Government College Professor",
        email: "kewal.thakur@example.com",
        phone: "+91 98161 44422",
        address: "Thakur Niwas, Gutkar Bypass Road, Mandi",
        city: "Mandi",
        state: "Himachal Pradesh",
        pincode: "175021",
        previousSchool: "Government Model Sr. Sec. School, Mandi",
        previousGrade: "Grade X",
        previousMarks: "96.2%",
        status: "PROVISIONALLY_ADMITTED",
        transportRequired: true,
        hostelRequired: false,
        remarks: "Merit scholarship 25% waiver granted on tuition fee based on Class X Board percentile.",
      },
      {
        applicationNo: "CIS-2025-0843",
        studentName: "Kabir Mehra",
        dob: "2019-11-05",
        gender: "Male",
        bloodGroup: "A+",
        gradeApplying: "Nursery / Foundation Stage",
        academicYear: "2025-2026",
        fatherName: "Amit Mehra",
        fatherPhone: "+91 98162 33344",
        fatherOccupation: "Hotelier & Business Owner",
        motherName: "Kavita Mehra",
        motherPhone: "+91 98162 33345",
        motherOccupation: "Graphic Designer",
        email: "amit.mehra@example.com",
        phone: "+91 98162 33344",
        address: "Riverside Enclave, Near Beas Bank, Pandoh Road, Mandi",
        city: "Mandi",
        state: "Himachal Pradesh",
        pincode: "175001",
        status: "SUBMITTED",
        transportRequired: true,
        hostelRequired: false,
        remarks: "Early Years registration. Campus tour requested by parents on Saturday.",
      },
    ],
  });

  // 11. Sample Inquiries
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Sunil Dogra",
        email: "sunil.dogra@example.com",
        phone: "+91 98164 12340",
        studentGrade: "Grade VI",
        inquiryType: "ADMISSION",
        subject: "Boarding and Hostel Facility Inquiry for Grade 6 boy",
        message: "We reside in Kullu valley and would like details about the CIS residential boarding, food menu, warden supervision, and weekend coaching schedules.",
        status: "IN_PROGRESS",
        responseNotes: "Called parent on 02/09. Sent hostel prospectus PDF via WhatsApp. Follow-up scheduled for campus visit on weekend.",
      },
      {
        name: "Rashmi Kapoor",
        email: "rashmi.k@example.com",
        phone: "+91 98165 98765",
        studentGrade: "Grade XI",
        inquiryType: "FEE",
        subject: "Scholarship criteria for Science Stream students with 95%+ marks",
        message: "Hello, my daughter has scored 97.4% in CBSE Class X pre-boards. Is there a merit-based fee waiver available for Class XI PCB batch?",
        status: "RESOLVED",
        responseNotes: "Explained the 25% and 50% merit scholarship bands. Application link forwarded.",
      },
    ],
  });

  // 12. Careers / Job Openings
  const job1 = await prisma.jobOpening.create({
    data: {
      title: "PGT Mathematics (Senior Secondary Grade 11-12)",
      department: "Mathematics",
      qualification: "M.Sc. Mathematics with B.Ed. (CBSE teaching experience required)",
      experience: "3-7 Years in Reputed CBSE / Cambridge School",
      type: "FULL_TIME",
      vacancies: 2,
      status: "OPEN",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: "We are seeking an enthusiastic, dynamic Mathematics educator capable of delivering high-impact senior secondary instruction and JEE Foundation coaching.",
      requirements: "• Master's Degree in Mathematics\n• Excellent English communication skills\n• Familiarity with smart boards & digital pedagogy\n• Proven track record in CBSE Board results",
    },
  });

  const job2 = await prisma.jobOpening.create({
    data: {
      title: "TGT Robotics & Artificial Intelligence Educator",
      department: "Sciences / Computer Tech",
      qualification: "B.Tech / MCA in Computer Science / Robotics / Mechatronics",
      experience: "2-5 Years hands-on experience in STEM Labs",
      type: "FULL_TIME",
      vacancies: 1,
      status: "OPEN",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      description: "Lead the CIS Robotics & Maker Lab, guiding students in Arduino, Raspberry Pi, Python programming, 3D printing, and national robotics competitions.",
      requirements: "• Practical proficiency in Python, C++, Microcontrollers\n• Passion for mentoring young innovators\n• Experience in preparing school teams for Olympiads",
    },
  });

  // 14. Theme Configuration
  await prisma.themeConfig.deleteMany();
  await prisma.themeConfig.create({
    data: {
      name: "Cambridge Royal Gold & Deep Navy",
      primaryColor: "#0A2540",
      secondaryColor: "#0066FF",
      accentColor: "#F4B400",
      darkBgColor: "#030816",
      cardBgColor: "#0f172a",
      textColor: "#FFFFFF",
      glassOpacity: 0.85,
      glowIntensity: 1.0,
      fontFamily: "Inter",
      borderRadius: "1.5rem",
      isActive: true,
    },
  });

  // 15. Page Content Blocks (Full CMS Control for all pages)
  await prisma.pageContent.deleteMany();

  await prisma.pageContent.create({
    data: {
      slug: "home",
      pageName: "Home Page",
      heroBadge: "CBSE Affiliated No. 630198 • Admissions Open 2025-26",
      heroTitle: "EDUCATING FOR A BETTER WORLD",
      heroSubtitle: "At Cambridge International School, Mandi, we blend Cambridge inquiry-based pedagogy, STEM innovation labs, and Olympic sports to nurture visionary thinkers and compassionate global leaders.",
      heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600&auto=format&fit=crop&q=80",
      heroMediaType: "VIDEO",
      heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-school-campus-41551-large.mp4",
      heroOverlayOpacity: 0.45,
      heroCtaText: "Apply for Admission 2025",
      heroCtaLink: "/admissions/apply",
      sectionsJson: JSON.stringify([
        {
          id: "why_choose_us",
          type: "features_grid",
          title: "Why Choose Cambridge Mandi",
          subtitle: "World-Class Benchmark Standards in Himachal Pradesh",
          items: [
            {
              title: "10-Acre Himalayan Campus",
              description: "Eco-friendly, serene mountain campus equipped with 24/7 CCTV surveillance, clean alpine air, and modern infrastructure.",
              icon: "Shield",
              image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800"
            },
            {
              title: "STEM, AI & Robotics Lab",
              description: "Hands-on maker space with 3D printers, drones, Arduino microcontrollers, and IoT sensor benches.",
              icon: "Cpu",
              image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"
            },
            {
              title: "Semi-Olympic Heated Pool",
              description: "6-lane indoor temperature-controlled aquatic centre with certified national coaches and safety lifeguards.",
              icon: "Trophy",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
            },
            {
              title: "100% CBSE Board Pass Rate",
              description: "Consistent district toppers in Class X and XII Board examinations with 40+ distinctions every academic year.",
              icon: "GraduationCap",
              image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
            }
          ]
        },
        {
          id: "academic_streams",
          type: "cards_slider",
          title: "Comprehensive Academic Pathways",
          subtitle: "Tailored educational streams from Pre-Primary foundation to Senior Secondary leadership",
          items: [
            {
              title: "Pre-Primary Wing (Nursery - UKG)",
              description: "Play-based inquiry learning, sensory activity corners, phonics development, and nurturing child care.",
              badge: "Ages 3 - 5",
              link: "/academics/pre-primary"
            },
            {
              title: "Primary Wing (Grades 1 - 5)",
              description: "Concept clarity, bilingual reading fluency, mental mathematics, science discovery, and environmental ethics.",
              badge: "Grades 1 - 5",
              link: "/academics/primary"
            },
            {
              title: "Middle School (Grades 6 - 8)",
              description: "Experiential science laboratories, coding & computational thinking, foreign languages, and sports training.",
              badge: "Grades 6 - 8",
              link: "/academics/middle-school"
            },
            {
              title: "Senior Secondary (Grades 9 - 12)",
              description: "Science (Medical / Non-Medical with JEE/NEET Foundation), Commerce (with CA Foundation), and Humanities.",
              badge: "Grades 9 - 12",
              link: "/academics/senior-secondary"
            }
          ]
        }
      ]),
    },
  });

  await prisma.pageContent.create({
    data: {
      slug: "facilities",
      pageName: "Campus & Facilities",
      heroBadge: "World-Class Infrastructure",
      heroTitle: "10-Acre Himalayan Campus & Smart Facilities",
      heroSubtitle: "Crafted with architectural finesse, international safety benchmarks, and high-tech educational tools to foster learning without limits.",
      heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80",
      heroCtaText: "Explore 360° Virtual Tour",
      heroCtaLink: "/virtual-tour",
      sectionsJson: JSON.stringify([
        {
          id: "facilities_overview",
          type: "facility_grid",
          title: "Specialized Infrastructure Wings",
          subtitle: "Explore our technologically advanced labs, indoor sports arenas, and boarding pavilions",
          items: [
            {
              title: "Smart 4K Classrooms",
              description: "86-inch interactive panels, acoustic wall treatments, ergonomic desks, and hybrid lecture capture.",
              link: "/facilities/smart-classrooms",
              image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"
            },
            {
              title: "Physics, Chemistry & Biology Labs",
              description: "Fully compliant NABL laboratory standards with optical microscopes, fume hoods, and anatomical models.",
              link: "/facilities/science-labs",
              image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800"
            },
            {
              title: "STEM & Robotics Innovation Suite",
              description: "3D printers, AI vision kits, autonomous rovers, and Raspberry Pi workstations.",
              link: "/facilities/robotics-lab",
              image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800"
            },
            {
              title: "Semi-Olympic Heated Swimming Pool",
              description: "Temperature-controlled 6-lane pool for year-round aquatic training and competitive swimming.",
              link: "/facilities/sports-complex",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
            },
            {
              title: "Central Digital Library & Research Hub",
              description: "15,000+ curated volumes, international journals, Kindles, and e-book research workstations.",
              link: "/facilities/library",
              image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800"
            },
            {
              title: "Himalayan Boarding & Residential Hostel",
              description: "Air-conditioned dormitories with nutritious dining, 24/7 warden supervision, and evening prep tutors.",
              link: "/facilities/hostel",
              image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800"
            }
          ]
        }
      ]),
    },
  });

  await prisma.pageContent.create({
    data: {
      slug: "about",
      pageName: "About Us",
      heroBadge: "Nurturing Global Leaders",
      heroTitle: "About Cambridge International School, Mandi",
      heroSubtitle: "A premier institution fostering academic brilliance, Himalayan resilience, ethical leadership, and global readiness since inception.",
      heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1600",
      heroCtaText: "Meet Our Leadership",
      heroCtaLink: "/about/principal-message",
      sectionsJson: JSON.stringify([]),
    },
  });

  await prisma.pageContent.create({
    data: {
      slug: "admissions",
      pageName: "Admissions Hub",
      heroBadge: "Session 2025-2026",
      heroTitle: "Admissions Open: Begin Your Journey to Excellence",
      heroSubtitle: "Join a vibrant community of thinkers, creators, and leaders in the lap of the Himalayas. Transparent merit-based admission procedure.",
      heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
      heroCtaText: "Start Online Application",
      heroCtaLink: "/admissions/apply",
      sectionsJson: JSON.stringify([]),
    },
  });

  await prisma.pageContent.create({
    data: {
      slug: "student-life",
      pageName: "Student Life & Co-Curricular",
      heroBadge: "Holistic Development",
      heroTitle: "Vibrant Campus Life Beyond Textbooks",
      heroSubtitle: "Fostering athletic prowess, theatrical expression, robotics innovation, and alpine leadership adventures.",
      heroImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600",
      heroCtaText: "View Photo Gallery",
      heroCtaLink: "/gallery",
      sectionsJson: JSON.stringify([]),
    },
  });

  await prisma.pageContent.create({
    data: {
      slug: "contact",
      pageName: "Contact & Campus Visit",
      heroBadge: "We Are Here to Help",
      heroTitle: "Connect with Cambridge Mandi",
      heroSubtitle: "Book a personalized campus tour, reach our admissions counselor, or contact our administrative office.",
      heroImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1600",
      heroCtaText: "Get Directions",
      heroCtaLink: "#directions",
      sectionsJson: JSON.stringify([]),
    },
  });

  console.log("✅ Seeding completed successfully with dynamic CMS PageContent and ThemeConfig!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
