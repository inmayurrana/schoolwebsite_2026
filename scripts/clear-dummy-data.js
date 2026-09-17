const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function clearDummyData() {
  console.log("🧹 Clearing all seed and dummy data from database...");

  // 1. Delete all dummy transactional & content records
  const delAudit = await prisma.auditLog.deleteMany({});
  console.log(`Deleted ${delAudit.count} audit logs.`);

  const delJobApps = await prisma.jobApplication.deleteMany({});
  console.log(`Deleted ${delJobApps.count} job applications.`);

  const delJobs = await prisma.jobOpening.deleteMany({});
  console.log(`Deleted ${delJobs.count} job openings.`);

  const delGalleryItems = await prisma.galleryItem.deleteMany({});
  console.log(`Deleted ${delGalleryItems.count} gallery items.`);

  const delGalleryAlbums = await prisma.galleryAlbum.deleteMany({});
  console.log(`Deleted ${delGalleryAlbums.count} gallery albums.`);

  const delDocuments = await prisma.document.deleteMany({});
  console.log(`Deleted ${delDocuments.count} documents.`);

  const delAchievements = await prisma.achievement.deleteMany({});
  console.log(`Deleted ${delAchievements.count} achievements.`);

  const delFaculty = await prisma.faculty.deleteMany({});
  console.log(`Deleted ${delFaculty.count} faculty members.`);

  const delEvents = await prisma.event.deleteMany({});
  console.log(`Deleted ${delEvents.count} events.`);

  const delNews = await prisma.news.deleteMany({});
  console.log(`Deleted ${delNews.count} news items.`);

  const delInquiries = await prisma.inquiry.deleteMany({});
  console.log(`Deleted ${delInquiries.count} inquiries.`);

  const delAdmissions = await prisma.admissionApplication.deleteMany({});
  console.log(`Deleted ${delAdmissions.count} admission applications.`);

  // 2. Clean dummy users and ensure single clean Super Admin user
  await prisma.user.deleteMany({});
  const passwordHash = await bcrypt.hash("Admin@12345", 10);
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "admin@cismandi.edu.in",
      password: passwordHash,
      role: "SUPER_ADMIN",
      phone: "+91 98160 12345",
      isActive: true,
    },
  });
  console.log("Created clean Super Admin user (admin@cismandi.edu.in).");

  // 3. Reset and ensure authentic SiteSettings
  await prisma.siteSetting.deleteMany({});
  const officialSettings = [
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

  for (const s of officialSettings) {
    await prisma.siteSetting.create({ data: s });
  }
  console.log("Initialized authentic school site settings.");

  console.log("✨ All dummy data removed successfully!");
}

clearDummyData()
  .catch((err) => {
    console.error("Error clearing dummy data:", err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
