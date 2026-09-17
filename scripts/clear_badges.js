const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const pages = await prisma.pageContent.findMany();
  for (const page of pages) {
    if (page.customStylesJson) {
      try {
        const custom = JSON.parse(page.customStylesJson);
        let modified = false;
        if (custom.chairmanBadge1) { custom.chairmanBadge1 = ''; modified = true; }
        if (custom.chairmanBadge2) { custom.chairmanBadge2 = ''; modified = true; }
        if (custom.principalBadge1) { custom.principalBadge1 = ''; modified = true; }
        if (custom.principalBadge2) { custom.principalBadge2 = ''; modified = true; }
        if (modified) {
          await prisma.pageContent.update({
            where: { id: page.id },
            data: { customStylesJson: JSON.stringify(custom) },
          });
          console.log(`Cleared badges for page: ${page.slug}`);
        }
      } catch (e) {}
    }
  }
  console.log('Badge cleanup complete');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
