import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    // In a real production app, verify if session?.user?.role === "ADMIN"
    // For now, we allow access if they are logged in and role is ADMIN
    if (!session?.user?.id || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalDesigns,
      totalCredits,
      activeUsers,
      queueCount,
      suspendedUsers,
      recentGens,
      recentDesignsForTrend,
      recentMods
    ] = await Promise.all([
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

    // Format Usage Trend
    const trendData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      trendData.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        rawDate: d.toDateString(),
        count: 0
      });
    }

    for (const d of recentDesignsForTrend) {
      const dayStr = d.createdAt.toDateString();
      const bucket = trendData.find(t => t.rawDate === dayStr);
      if (bucket) {
        bucket.count += 1;
      }
    }

    // Determine max for percentage bars
    const maxTrendCount = Math.max(...trendData.map(t => t.count), 1);
    const formattedTrendData = trendData.map(t => ({
      date: t.date,
      count: t.count,
      percentage: Math.round((t.count / maxTrendCount) * 100)
    }));

    // Format alerts (combine moderation logs and suspended fallback if empty)
    let alerts = recentMods.map(m => ({
      id: m.id,
      title: `Content Flagged (${m.type})`,
      message: `${m.user.name}: ${m.reason ?? 'Needs review'}`,
      timeAgo: getTimeAgo(m.createdAt),
      type: 'warning'
    }));
    
    if (alerts.length === 0) {
       alerts = [{
          id: 'system',
          title: 'System check',
          message: 'All systems are operating normally.',
          timeAgo: 'Just now',
          type: 'success'
       }];
    }

    const data = {
      totalUsers,
      activeUsers,
      totalDesigns,
      suspendedUsers,
      serverStatus: "Online",
      queueCount,
      creditsDistributed: totalCredits._sum.balance ?? 0,
      usageTrend: formattedTrendData,
      recentGenerations: recentGens.map(g => ({
        id: g.id,
        title: g.title,
        status: g.status,
        userName: g.user.name,
        timeAgo: getTimeAgo(g.createdAt)
      })),
      recentAlerts: alerts
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
