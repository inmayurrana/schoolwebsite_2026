const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  for (const slug of ['fees-structure', 'admissions', 'scholarships']) {
    const p = await prisma.pageContent.findUnique({ where: { slug } });
    console.log(`=== ${slug.toUpperCase()} ===`);
    console.log("heroTitle:", p?.heroTitle);
    console.log("sections count:", p?.sectionsJson ? JSON.parse(p.sectionsJson).length : 0);
  }
}

main().finally(() => prisma.$disconnect());
