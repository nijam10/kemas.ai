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
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10)));
    const skip = (page - 1) * pageSize;

    const [moderationLogs, total] = await Promise.all([
      prisma.moderationLog.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          admin: { select: { name: true, email: true } },
          design: { select: { title: true, imageUrl: true } }
        }
      }),
      prisma.moderationLog.count()
    ]);

    const formattedLogs = moderationLogs.map(log => ({
      id: log.id,
      designId: log.designId,
      designTitle: log.design.title,
      designImageUrl: log.design.imageUrl,
      userId: log.userId,
      userName: log.user.name,
      adminId: log.adminId,
      adminName: log.admin.name,
      type: log.type,
      status: log.status,
      reason: log.reason,
      createdAt: log.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        logs: formattedLogs,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      }
    });
  } catch (error) {
    console.error("[GET /api/admin/moderation]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch moderation logs" },
      { status: 500 }
    );
  }
}
