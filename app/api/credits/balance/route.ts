import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { creditService } from "@/server/services/credit.service";
import { userService } from "@/server/services/user.service";
import { prisma } from "@/lib/prisma";

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

    let summary = await creditService.getCreditSummary(resolvedUserId);
    
    // Auto-create wallet for legacy users if it doesn't exist
    if (!summary) {
      await prisma.creditWallet.create({
        data: { userId: resolvedUserId, balance: 40, dailyQuota: 40 }
      });
      await prisma.creditTransaction.create({
        data: {
          userId: resolvedUserId,
          amount: 40,
          type: "DAILY_RESET",
          description: "Welcome credits (Auto-initialized)",
        }
      });
      summary = await creditService.getCreditSummary(resolvedUserId);
      
      if (!summary) {
        return NextResponse.json(
          { success: false, error: "Credit wallet could not be created." },
          { status: 500 }
        );
      }
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
