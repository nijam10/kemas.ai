/**
 * Extends Auth.js default types to include Kemas.ai custom fields.
 * These fields are populated in the jwt and session callbacks in auth.ts.
 */

import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      status: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** User's database ID — stored as token.id (mirrors JWT "sub") */
    id?: string;
    role?: UserRole;
    status?: string;
  }
}
