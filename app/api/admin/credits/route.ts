import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session?.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "50", 10)));
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          creditWallet: true,
          profile: true,
          creditTransactions: {
            where: { amount: { lt: 0 } }
          }
        }
      }),
      prisma.user.count()
    ]);

    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      businessName: u.profile?.businessName || null,
      credits: u.creditWallet?.balance ?? 0,
      dailyQuota: u.creditWallet?.dailyQuota ?? 0,
      totalUsed: Math.abs(u.creditTransactions.reduce((sum, t) => sum + t.amount, 0)),
      lastTopUp: u.creditWallet?.lastResetAt || u.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    });
  } catch (error) {
    console.error("[GET /api/admin/credits]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit summaries" },
      { status: 500 }
    );
  }
}
