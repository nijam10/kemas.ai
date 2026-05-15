/**
 * User Service
 * Read-only queries for user profile and lookup.
 * Phase 1: No auth — uses first USER from DB as mock current user.
 */

import { prisma } from "@/lib/prisma";
import type { User, CreditWallet } from "@prisma/client";

export type UserWithWallet = User & {
  creditWallet: CreditWallet | null;
};

export class UserService {
  /**
   * Get the first active USER in the database.
   * Used as the mock "current user" until real auth is wired up.
   */
  async getMockCurrentUser(): Promise<UserWithWallet | null> {
    return prisma.user.findFirst({
      where: { role: "USER", status: "ACTIVE" },
      include: { creditWallet: true },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Get a user by ID, including their credit wallet.
   */
  async getUserById(id: string): Promise<UserWithWallet | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { creditWallet: true },
    });
  }

  /**
   * Get a user by email.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
}

export const userService = new UserService();
