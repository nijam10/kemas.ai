const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const t = await prisma.galleryTemplate.findMany();
  console.log(JSON.stringify(t.map(x => ({ id: x.id, title: x.title, img: x.previewImageUrl })), null, 2));
}
main().finally(() => prisma.$disconnect());
