import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { creditService } from "@/server/services/credit.service";
import { userService } from "@/server/services/user.service";

/**
 * GET /api/credits/balance
 *
 * Returns the current user's credit balance and recent transactions.
 * Uses real Auth.js session when available; falls back to first DB user.
 */
export async function GET(_request: NextRequest) {
  try {
    // Try real session first
    const session = await auth();
    const userId = session?.user?.id;

    let resolvedUserId: string;

    if (userId) {
      resolvedUserId = userId;
    } else {
      // Fallback: first active USER in DB (for dev / unauthenticated API calls)
      const mockUser = await userService.getMockCurrentUser();
      if (!mockUser) {
        return NextResponse.json(
          { success: false, error: "No users found in database. Run the seed first." },
          { status: 404 }
        );
      }
      resolvedUserId = mockUser.id;
    }

    const summary = await creditService.getCreditSummary(resolvedUserId);
    if (!summary) {
      return NextResponse.json(
        { success: false, error: "Credit wallet not found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: resolvedUserId,
        balance: summary.wallet.balance,
        dailyQuota: summary.wallet.dailyQuota,
        lastResetAt: summary.wallet.lastResetAt,
        recentTransactions: summary.recentTransactions,
      },
    });
  } catch (error) {
    console.error("[GET /api/credits/balance]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit balance" },
      { status: 500 }
    );
  }
}
