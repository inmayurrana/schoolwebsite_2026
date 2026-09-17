const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pages = await prisma.pageContent.findMany({
    orderBy: { slug: 'asc' }
  });
  console.log('Total pages in DB:', pages.length);
  for (const p of pages) {
    console.log(p.slug, '=>', {
      heroBadge: p.heroBadge,
      heroTitle: p.heroTitle,
      heroImage: p.heroImage?.slice(0, 60),
      hasCustomStyles: !!p.customStylesJson && p.customStylesJson !== '{}'
    });
  }
}

main().finally(() => prisma.$disconnect());
