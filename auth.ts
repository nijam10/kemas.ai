/**
 * Kemas.ai — Auth.js v5 Configuration
 *
 * Strategy: JWT sessions so the proxy (middleware) can verify auth
 * without a database round-trip on every request.
 *
 * On first Google login:
 *   1. Auth.js creates the User row via the Prisma adapter
 *   2. signIn callback creates a CreditWallet (balance 40, quota 40)
 *   3. jwt callback embeds id + role + status into the JWT
 *   4. session callback exposes those fields to the client
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    /**
     * Called after a successful sign-in.
     * Creates a CreditWallet for brand-new users (idempotent).
     */
    async signIn({ user }) {
      if (!user.id) return true;

      try {
        const existing = await prisma.creditWallet.findUnique({
          where: { userId: user.id },
        });

        if (!existing) {
          await prisma.$transaction([
            prisma.creditWallet.create({
              data: { userId: user.id, balance: 40, dailyQuota: 40 },
            }),
            prisma.creditTransaction.create({
              data: {
                userId: user.id,
                amount: 40,
                type: "DAILY_RESET",
                description: "Welcome credits — initial daily quota",
              },
            }),
          ]);
        }
      } catch (err) {
        console.error("[Auth] Failed to create credit wallet:", err);
        // Don't block sign-in
      }

      return true;
    },

    /**
     * Embeds id, role, and status into the JWT.
     * `user` is only present on the very first sign-in call.
     * On subsequent calls only `token` is available — we must preserve
     * the values we already stored.
     */
    async jwt({ token, user }) {
      if (user?.id) {
        // First sign-in: fetch role from DB and store in token
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, status: true },
        });

        token.id = user.id;                              // standard JWT "sub" alias
        token.role = (dbUser?.role ?? "USER") as UserRole;
        token.status = dbUser?.status ?? "ACTIVE";
      }
      // On subsequent calls token.id / token.role are already set — just return
      return token;
    },

    /**
     * Exposes id, role, and status to the client via useSession().
     */
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
});
