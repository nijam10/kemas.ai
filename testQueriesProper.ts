import { prisma } from './lib/prisma'

async function main() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  console.log("Running queries...");
  
  const results = await Promise.all([
    prisma.user.count(),
    prisma.design.count(),
    prisma.creditWallet.aggregate({ _sum: { balance: true } }),
    prisma.user.count({
      where: { updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    }),
    prisma.generationJob.count({ where: { status: "QUEUED" } }),
    prisma.user.count({ where: { status: "SUSPENDED" } }),
    prisma.design.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    }),
    prisma.design.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    }),
    prisma.moderationLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    })
  ]);
  
  console.log("Success:", results.map(r => typeof r === 'number' ? r : (Array.isArray(r) ? `Array(${r.length})` : 'Object')));
}

main().catch(e => {
  console.error("FAILED:", e);
}).finally(() => {
  prisma.$disconnect();
});
