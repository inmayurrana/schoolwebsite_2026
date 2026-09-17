const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slugs = ['smart-classrooms', 'science-labs', 'robotics-lab', 'computer-labs', 'library', 'sports-complex', 'hostel', 'transport'];
  for (const slug of slugs) {
    const p = await prisma.pageContent.findUnique({ where: { slug } });
    console.log(`=== ${slug} ===`);
    console.log('heroBadge:', p?.heroBadge);
    console.log('heroTitle:', p?.heroTitle);
    console.log('heroSubtitle:', p?.heroSubtitle);
    console.log('heroImage:', p?.heroImage);
    console.log('customStyles:', p?.customStylesJson);
  }
}

main().finally(() => prisma.$disconnect());
