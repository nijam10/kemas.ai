import { prisma } from './lib/prisma';

async function main() {
  const templates = await prisma.galleryTemplate.count();
  const designs = await prisma.design.count();
  const publishedDesigns = await prisma.design.count({ where: { isPublished: true } });
  const completedDesigns = await prisma.design.count({ where: { status: "COMPLETED", imageUrl: { not: null } } });
  
  console.log({ templates, designs, publishedDesigns, completedDesigns });
}

main().catch(console.error).finally(() => prisma.$disconnect());
