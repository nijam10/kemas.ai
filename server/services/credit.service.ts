/**
 * Credit Service
 * Read-only queries for credit balance and transaction history.
 * Phase 1: read-only. Mutations (deduct, topup, reset) come in Phase 2.
 */

import { prisma } from "@/lib/prisma";
import type { CreditWallet, CreditTransaction } from "@prisma/client";

export interface CreditSummary {
  wallet: CreditWallet;
  recentTransactions: CreditTransaction[];
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
   * Get wallet + recent transactions together.
   */
  async getCreditSummary(userId: string): Promise<CreditSummary | null> {
    const wallet = await this.getWallet(userId);
    if (!wallet) return null;

    const recentTransactions = await this.getTransactions(userId, 10);
    return { wallet, recentTransactions };
  }

  /**
   * Check whether a user has at least `required` credits.
   */
  async hasEnoughCredits(userId: string, required: number): Promise<boolean> {
    const wallet = await this.getWallet(userId);
    return wallet !== null && wallet.balance >= required;
  }
}

export const creditService = new CreditService();
