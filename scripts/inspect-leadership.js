const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const pm = await prisma.pageContent.findUnique({ where: { slug: 'principal-message' } });
  const cm = await prisma.pageContent.findUnique({ where: { slug: 'chairman-message' } });
  const home = await prisma.pageContent.findUnique({ where: { slug: 'home' } });

  console.log('--- PRINCIPAL MESSAGE ---');
  console.log(pm ? { heroImage: pm.heroImage, custom: JSON.parse(pm.customStylesJson || '{}') } : 'Not found');

  console.log('--- CHAIRMAN MESSAGE ---');
  console.log(cm ? { heroImage: cm.heroImage, custom: JSON.parse(cm.customStylesJson || '{}') } : 'Not found');

  console.log('--- HOME ---');
  console.log(home ? { heroImage: home.heroImage, custom: JSON.parse(home.customStylesJson || '{}') } : 'Not found');
}

run().finally(() => prisma.$disconnect());
