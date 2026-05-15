/**
 * Prisma Client Singleton (Prisma 7 + pg adapter)
 *
 * Prevents multiple instances during Next.js hot reload in development.
 * Uses the @prisma/adapter-pg driver adapter required by Prisma 7.
 *
 * IMPORTANT: After running `prisma generate` (schema changes), restart
 * the dev server so the new client replaces the cached singleton.
 *
 * Usage:
 *   import { prisma } from "@/lib/prisma";
 *   const users = await prisma.user.findMany();
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Bump this string whenever you run `prisma generate` after a schema change.
// It forces the singleton to be recreated in the same process (hot-reload safe).
const SCHEMA_VERSION = "v2-userprofile";

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn(
      "[Prisma] DATABASE_URL is not set. " +
        "Copy .env.example to .env and provide a PostgreSQL connection string."
    );
    // Instantiate without adapter — queries will fail at runtime with a clear
    // message, but the build succeeds and the app can still start.
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

// ── Singleton cache ───────────────────────────────────────────────────────────

type PrismaGlobal = {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

const g = globalThis as unknown as PrismaGlobal;

// Recreate the client if the schema version changed (e.g. after prisma generate)
if (g.prismaSchemaVersion !== SCHEMA_VERSION) {
  g.prisma = undefined;
  g.prismaSchemaVersion = SCHEMA_VERSION;
}

export const prisma: PrismaClient = g.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  g.prisma = prisma;
}

export default prisma;
