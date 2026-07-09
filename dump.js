require('ts-node/register');
const { prisma } = require('./lib/prisma.ts');

async function main() {
  const templates = await prisma.galleryTemplate.findMany();
  console.log(JSON.stringify(templates, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
