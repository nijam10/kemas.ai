/**
 * Credit Service
 * Manages credit balance, daily resets, and transaction history.
 *
 * Daily reset strategy: "lazy reset on read".
 * Every time the balance is queried, we compare `lastResetAt` against today's
 * date in WIB (UTC+7). If the last reset was on a previous calendar day, we
 * atomically reset balance → dailyQuota and log a DAILY_RESET transaction.
 * This avoids the need for external cron jobs.
 */

import { prisma } from "@/lib/prisma";
import type { CreditWallet, CreditTransaction } from "@prisma/client";

export interface CreditSummary {
  wallet: CreditWallet;
  recentTransactions: CreditTransaction[];
}

/**
 * Get the start-of-day boundary in WIB (UTC+7).
 * Returns a UTC Date representing 00:00 WIB today.
 */
function startOfDayWIB(date: Date = new Date()): Date {
  // Shift to WIB: add 7 hours, extract date parts, shift back.
  const wibOffset = 7 * 60 * 60 * 1000;
  const wibTime = new Date(date.getTime() + wibOffset);
  const y = wibTime.getUTCFullYear();
  const m = wibTime.getUTCMonth();
  const d = wibTime.getUTCDate();
  // 00:00 WIB in UTC = previous day 17:00 UTC
  return new Date(Date.UTC(y, m, d) - wibOffset);
}

export class CreditService {
  /**
   * Get the credit wallet for a user.
   */
  async getWallet(userId: string): Promise<CreditWallet | null> {
    return prisma.creditWallet.findUnique({ where: { userId } });
  }

  /**
   * Get recent credit transactions for a user, newest first.
   */
  async getTransactions(
    userId: string,
    limit = 20
  ): Promise<CreditTransaction[]> {
    return prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Perform a daily credit reset if the last reset was on a previous day (WIB).
   * Returns the (possibly refreshed) wallet.
   */
  async dailyResetIfNeeded(userId: string): Promise<CreditWallet | null> {
    const wallet = await this.getWallet(userId);
    if (!wallet) return null;

    const todayStart = startOfDayWIB();

    // Already reset today — nothing to do
    if (wallet.lastResetAt >= todayStart) {
      return wallet;
    }

    // Perform atomic reset: update wallet + create transaction
    const [updatedWallet] = await prisma.$transaction([
      prisma.creditWallet.update({
        where: { userId },
        data: {
          balance: wallet.dailyQuota,
          lastResetAt: new Date(),
        },
      }),
      prisma.creditTransaction.create({
        data: {
          userId,
          amount: wallet.dailyQuota,
          type: "DAILY_RESET",
          description: `Daily quota reset — ${wallet.dailyQuota} credits restored`,
        },
      }),
    ]);

    console.log(
      `[CreditService] Daily reset for user ${userId}: ${wallet.balance} → ${updatedWallet.balance} credits`
    );

    return updatedWallet;
  }

  /**
   * Get wallet + recent transactions together.
   * Automatically triggers a daily reset if needed before returning data.
   */
  async getCreditSummary(userId: string): Promise<CreditSummary | null> {
    // Trigger lazy daily reset first
    const wallet = await this.dailyResetIfNeeded(userId);
    if (!wallet) return null;

    const recentTransactions = await this.getTransactions(userId, 10);
    return { wallet, recentTransactions };
  }

  /**
   * Check whether a user has at least `required` credits.
   * Also triggers daily reset if needed, so the check uses today's balance.
   */
  async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    const wallet = await this.dailyResetIfNeeded(userId);
    return wallet !== null && wallet.balance >= required;
  }
}

export const creditService = new CreditService();
