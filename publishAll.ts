import { prisma } from './lib/prisma';

async function main() {
  const updated = await prisma.design.updateMany({
    where: {
      status: "COMPLETED",
      imageUrl: { not: null }
    },
    data: {
      isPublished: true
    }
  });
  console.log(`Published ${updated.count} designs.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
