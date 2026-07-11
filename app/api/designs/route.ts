export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { designService } from "@/server/services/design.service";
import { userService } from "@/server/services/user.service";
import type { DesignStatus, PackagingType } from "@prisma/client";

/**
 * GET /api/designs
 *
 * Returns generated designs for the current user.
 * Uses real Auth.js session when available; falls back to first DB user.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let resolvedUserId: string;

    if (userId) {
      resolvedUserId = userId;
    } else {
      const mockUser = await userService.getMockCurrentUser();
      if (!mockUser) {
        return NextResponse.json(
          { success: false, error: "No users found in database. Run the seed first." },
          { status: 404 }
        );
      }
      resolvedUserId = mockUser.id;
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") as DesignStatus | null;
    const packagingType = searchParams.get("packagingType") as PackagingType | null;
    const savedOnly = searchParams.get("saved") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20", 10)));

    const result = await designService.getDesignsByUserId(
      resolvedUserId,
      {
        ...(status && { status }),
        ...(packagingType && { packagingType }),
        ...(savedOnly && { savedOnly }),
      },
      page,
      pageSize
    );

    return NextResponse.json({
      success: true,
      data: { ...result, userId: resolvedUserId },
    });
  } catch (error) {
    console.error("[GET /api/designs]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch designs" },
      { status: 500 }
    );
  }
}
