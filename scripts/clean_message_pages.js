const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const cm = await prisma.pageContent.findUnique({ where: { slug: 'chairman-message' } });
  console.log('chairman-message sections:', cm?.sectionsJson);
  const pm = await prisma.pageContent.findUnique({ where: { slug: 'principal-message' } });
  console.log('principal-message sections:', pm?.sectionsJson);

  // Clean empty sections for message pages so canvas does not show fake dummy cards
  if (cm) {
    await prisma.pageContent.update({
      where: { slug: 'chairman-message' },
      data: { sectionsJson: JSON.stringify([]) }
    });
    console.log('Cleared dummy sections for chairman-message in DB');
  }
  if (pm) {
    await prisma.pageContent.update({
      where: { slug: 'principal-message' },
      data: { sectionsJson: JSON.stringify([]) }
    });
    console.log('Cleared dummy sections for principal-message in DB');
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
