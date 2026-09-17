const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const forms = await prisma.formDefinition.findMany();
    console.log("FormDefinition table query success! Count:", forms.length);
  } catch (e) {
    console.log("Error querying FormDefinition:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
