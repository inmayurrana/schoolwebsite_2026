const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Initializing clean Cambridge International School Mandi database...");

  // 1. Reset tables
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

  // 2. Admin User
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
  console.log("Created Super Admin user (admin@cismandi.edu.in / Admin@12345).");

  // 3. Official School Site Settings
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
  console.log("Initialized official school site settings.");

  console.log("✨ Clean database setup completed without dummy data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
