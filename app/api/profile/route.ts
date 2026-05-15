import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userService } from "@/server/services/user.service";
import { designService } from "@/server/services/design.service";

// ── Shared helper: resolve userId from session ────────────────────────────────

async function resolveUserId(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  // Dev fallback: first active USER in DB
  const mockUser = await userService.getMockCurrentUser();
  return mockUser?.id ?? null;
}

// ── GET /api/profile ──────────────────────────────────────────────────────────

/**
 * Returns the current user's profile, wallet, userProfile settings, and stats.
 */
export async function GET(_request: NextRequest) {
  try {
    const userId = await resolveUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    const [user, userProfile, designStats] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { creditWallet: true },
      }),
      prisma.userProfile.findUnique({ where: { userId } }),
      Promise.all([
        designService.getDesignsByUserId(userId, {}, 1, 1),
        designService.getDesignsByUserId(userId, { status: "COMPLETED" }, 1, 1),
        designService.getDesignsByUserId(userId, { savedOnly: true }, 1, 1),
      ]),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    const [allDesigns, completedDesigns, savedDesigns] = designStats;

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        wallet: user.creditWallet
          ? {
              balance: user.creditWallet.balance,
              dailyQuota: user.creditWallet.dailyQuota,
              lastResetAt: user.creditWallet.lastResetAt,
            }
          : null,
        userProfile: userProfile
          ? {
              businessName: userProfile.businessName,
              brandCategory: userProfile.brandCategory,
              defaultPackagingType: userProfile.defaultPackagingType,
              defaultExportQuality: userProfile.defaultExportQuality,
              autoSaveGeneratedDesigns: userProfile.autoSaveGeneratedDesigns,
            }
          : null,
        stats: {
          totalDesigns: allDesigns.total,
          completedDesigns: completedDesigns.total,
          savedDesigns: savedDesigns.total,
        },
      },
    });
  } catch (error) {
    console.error("[GET /api/profile]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// ── PATCH /api/profile ────────────────────────────────────────────────────────

/**
 * Upserts the UserProfile settings for the current user.
 *
 * Body (all fields optional):
 *   businessName, brandCategory, defaultPackagingType,
 *   defaultExportQuality, autoSaveGeneratedDesigns
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = await resolveUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }

    // Parse and validate body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    // Whitelist allowed fields — never let the client set userId or timestamps
    const allowed = [
      "businessName",
      "brandCategory",
      "defaultPackagingType",
      "defaultExportQuality",
      "autoSaveGeneratedDesigns",
    ] as const;

    const updateData: Partial<Record<(typeof allowed)[number], unknown>> = {};
    for (const key of allowed) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields provided." },
        { status: 400 }
      );
    }

    // Upsert UserProfile
    const userProfile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        businessName: (updateData.businessName as string) ?? null,
        brandCategory: (updateData.brandCategory as string) ?? null,
        defaultPackagingType:
          (updateData.defaultPackagingType as string) ?? "Standing Pouch",
        defaultExportQuality:
          (updateData.defaultExportQuality as string) ?? "High Resolution",
        autoSaveGeneratedDesigns:
          typeof updateData.autoSaveGeneratedDesigns === "boolean"
            ? updateData.autoSaveGeneratedDesigns
            : true,
      },
      update: {
        ...(updateData.businessName !== undefined && {
          businessName: updateData.businessName as string | null,
        }),
        ...(updateData.brandCategory !== undefined && {
          brandCategory: updateData.brandCategory as string | null,
        }),
        ...(updateData.defaultPackagingType !== undefined && {
          defaultPackagingType: updateData.defaultPackagingType as string,
        }),
        ...(updateData.defaultExportQuality !== undefined && {
          defaultExportQuality: updateData.defaultExportQuality as string,
        }),
        ...(updateData.autoSaveGeneratedDesigns !== undefined && {
          autoSaveGeneratedDesigns:
            updateData.autoSaveGeneratedDesigns as boolean,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userProfile: {
          businessName: userProfile.businessName,
          brandCategory: userProfile.brandCategory,
          defaultPackagingType: userProfile.defaultPackagingType,
          defaultExportQuality: userProfile.defaultExportQuality,
          autoSaveGeneratedDesigns: userProfile.autoSaveGeneratedDesigns,
        },
      },
    });
  } catch (error) {
    console.error("[PATCH /api/profile]", error);
    return NextResponse.json(
      { success: false, error: "Failed to save profile settings" },
      { status: 500 }
    );
  }
}
