import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    // In a real production app, verify if session?.user?.role === "ADMIN"
    // For now, we allow access if they are logged in and role is ADMIN
    if (!session?.user?.id || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const [totalUsers, totalDesigns, totalCredits] = await Promise.all([
      prisma.user.count(),
      prisma.design.count(),
      prisma.creditWallet.aggregate({
        _sum: {
          balance: true,
        },
      }),
    ]);

    // Approximate Active Users (users who logged in recently or created a design recently)
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Active in last 7 days
        }
      }
    });

    const data = {
      totalUsers,
      activeUsers,
      totalDesigns,
      serverStatus: "Online",
      queueCount: await prisma.generationJob.count({ where: { status: "QUEUED" } }),
      creditsDistributed: totalCredits._sum.balance ?? 0,
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
