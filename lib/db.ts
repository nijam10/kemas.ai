/**
 * Kemas.ai Database Client
 * Re-exports the Prisma singleton for use across the app
 *
 * Usage:
 *   import { db } from "@/lib/db";
 *   const users = await db.user.findMany();
 */

export { prisma as db } from "@/lib/prisma";
export { default } from "@/lib/prisma";
