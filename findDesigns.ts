import { prisma } from './lib/prisma';

async function main() {
  const designs = await prisma.design.findMany();
  console.log("Designs in DB:");
  designs.forEach(d => {
    console.log(`- ID: ${d.id} | Title: ${d.title} | Image: ${d.imageUrl}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
