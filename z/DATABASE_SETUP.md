# Kemas.ai — Database Setup Guide

Prisma 7 + PostgreSQL foundation for the Kemas.ai platform.

---

## Prerequisites

- Node.js 18+
- A PostgreSQL database (local, Supabase, Neon, Railway, etc.)
- This project cloned and `npm install` already run

---

## Step 1 — Create a PostgreSQL Database

### Option A: Local PostgreSQL

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16
psql postgres -c "CREATE DATABASE kemas_ai;"

# Ubuntu / Debian
sudo apt install postgresql
sudo -u postgres psql -c "CREATE DATABASE kemas_ai;"

# Windows (psql in PATH)
psql -U postgres -c "CREATE DATABASE kemas_ai;"
```

Your local connection string will be:
```
postgresql://postgres:YOUR_PASSWORD@localhost:5432/kemas_ai
```

---

### Option B: Supabase (Recommended for cloud)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy the **Connection string** from **Settings → Database → Connection string → URI**
3. Replace `[YOUR-PASSWORD]` with your project password

```
postgresql://postgres:[YOUR-PASSWORD]@db.[REF].supabase.co:5432/postgres
```

---

### Option C: Neon (Serverless PostgreSQL)

1. Go to [neon.tech](https://neon.tech) → New Project
2. Copy the connection string from the dashboard

```
postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
```

---

### Option D: Railway

1. Go to [railway.app](https://railway.app) → New Project → PostgreSQL
2. Copy the `DATABASE_URL` from the Variables tab

---

## Step 2 — Set DATABASE_URL

Copy the example env file and fill in your connection string:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

**Example (local):**
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/kemas_ai"
```

**Example (Supabase):**
```env
DATABASE_URL="postgresql://postgres:mypassword@db.abcdefgh.supabase.co:5432/postgres"
```

---

## Step 3 — Push Schema to Database

This creates all tables, enums, and indexes in your database:

```bash
npm run prisma:push
```

This runs `prisma db push` which:
- Reads `prisma/schema.prisma`
- Creates all tables and enums
- Does **not** create migration files (use `prisma migrate dev` for that)

Expected output:
```
✔ Generated Prisma Client
The database is now in sync with your Prisma schema.
```

---

## Step 4 — Seed the Database

Populate the database with realistic Indonesian UMKM test data:

```bash
npm run prisma:seed
```

This runs `prisma/seed.ts` and creates:

| Data | Count |
|------|-------|
| Admin user | 1 |
| UMKM users | 6 |
| Credit wallets | 7 |
| Credit transactions | 19 |
| Gallery templates | 6 |
| Sample designs | 7 |
| Generation jobs | 7 |
| Moderation logs | 6 |
| Admin action logs | 6 |

**Seeded users:**

| Name | Email | Role | Business |
|------|-------|------|----------|
| Admin Kemas | admin@kemas.ai | ADMIN | — |
| Khairul Nizam | khairul@keripik.com | USER | Keripik Rumah Rasa |
| Siti Aminah | siti@dapoer.com | USER | Dapoer Singkong |
| Budi Santoso | budi@kopinusantara.com | USER | Kopi Aren Nusantara |
| Rina Wijaya | rina@sambalburina.com | USER | Sambal Bu Rina |
| Ahmad Fauzi | ahmad@tehlestari.com | USER | Teh Organik Lestari |
| Dewi Lestari | dewi@snackbatam.com | USER | Snack Lokal Batam |

---

## Step 5 — Open Prisma Studio

Prisma Studio is a visual database browser:

```bash
npm run prisma:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

You can browse all tables, view records, and edit data directly.

---

## All Commands Reference

| Command | Description |
|---------|-------------|
| `npm run prisma:generate` | Regenerate Prisma Client after schema changes |
| `npm run prisma:push` | Push schema to database (no migration files) |
| `npm run prisma:studio` | Open visual database browser |
| `npm run prisma:seed` | Seed database with test data |
| `npx prisma migrate dev` | Create and apply a migration (for production workflow) |
| `npx prisma migrate reset` | Reset database and re-apply all migrations |
| `npx prisma db pull` | Introspect existing database into schema |
| `npx prisma format` | Format schema.prisma file |

---

## Database Schema Overview

### Models

| Model | Table | Description |
|-------|-------|-------------|
| `User` | `users` | User accounts (USER + ADMIN roles) |
| `CreditWallet` | `credit_wallets` | Per-user credit balance |
| `CreditTransaction` | `credit_transactions` | Full credit audit trail |
| `Design` | `designs` | Generated packaging designs |
| `GenerationJob` | `generation_jobs` | AI pipeline job tracking |
| `GalleryTemplate` | `gallery_templates` | Reusable design presets |
| `UploadedAsset` | `uploaded_assets` | User logos and generated images |
| `ModerationLog` | `moderation_logs` | Content moderation records |
| `AdminActionLog` | `admin_action_logs` | Admin action audit trail |

### Enums

| Enum | Values |
|------|--------|
| `UserRole` | `USER`, `ADMIN` |
| `UserStatus` | `ACTIVE`, `SUSPENDED`, `PENDING` |
| `PackagingType` | `STANDING_POUCH`, `PILLOW_POUCH`, `BOX`, `JAR`, `BOTTLE`, `SACHET` |
| `DesignStatus` | `PROCESSING`, `COMPLETED`, `FAILED`, `FLAGGED` |
| `GenerationJobStatus` | `QUEUED`, `RUNNING`, `COMPLETED`, `FAILED`, `CANCELLED` |
| `GenerationStep` | `CREDIT_CHECK`, `API_GATEWAY`, `COMFYUI_PIPELINE`, `LORA_STYLE`, `LOGO_COMPOSITING`, `OUTPUT_READY`, `PREVIEW_READY` |
| `GalleryCategory` | `FOOD_BEVERAGES`, `ARTISAN_SNACK`, `MODERN_MINIMAL`, `TRADITIONAL`, `ORGANIC`, `PREMIUM_COFFEE`, `HEALTHY_PRODUCTS` |
| `CreditTransactionType` | `DAILY_RESET`, `GENERATION_USAGE`, `ADMIN_TOPUP`, `ADMIN_RESET`, `REFUND` |
| `ModerationType` | `PROMPT`, `IMAGE`, `USER_REPORT` |
| `ModerationStatus` | `PENDING`, `APPROVED`, `FLAGGED`, `REMOVED` |
| `AdminAction` | `SUSPEND_USER`, `ACTIVATE_USER`, `TOPUP_CREDIT`, `RESET_CREDIT`, `APPROVE_CONTENT`, `FLAG_CONTENT`, `REMOVE_CONTENT` |
| `AssetType` | `LOGO`, `GENERATED_IMAGE`, `THUMBNAIL` |

---

## Using Prisma in API Routes

```typescript
// Import the singleton client
import { db } from "@/lib/db";
// or
import { prisma } from "@/lib/prisma";

// Example: Get all users
const users = await db.user.findMany({
  where: { status: "ACTIVE" },
  include: { creditWallet: true },
});

// Example: Get a user's designs
const designs = await db.design.findMany({
  where: { userId: "user-id", status: "COMPLETED" },
  orderBy: { createdAt: "desc" },
});

// Example: Deduct credits
await db.$transaction([
  db.creditWallet.update({
    where: { userId },
    data: { balance: { decrement: 10 } },
  }),
  db.creditTransaction.create({
    data: {
      userId,
      amount: -10,
      type: "GENERATION_USAGE",
      description: "Generated: My Design",
    },
  }),
]);
```

---

## Troubleshooting

### `DATABASE_URL is not set`
Copy `.env.example` to `.env` and fill in your connection string.

### `Can't reach database server`
- Check your PostgreSQL server is running
- Verify the host, port, username, and password in `DATABASE_URL`
- For cloud databases, check firewall/IP allowlist settings

### `prisma generate` fails
Run `npm run prisma:generate` to regenerate the client after schema changes.

### Schema out of sync
Run `npm run prisma:push` to sync the database with the current schema.

### Re-seed from scratch
```bash
npm run prisma:seed
```
The seed script cleans existing data before inserting, so it's safe to re-run.

---

## Next Steps

Once the database is set up:

1. **Implement API routes** — Replace mock data with real Prisma queries
2. **Add Google OAuth** — Connect authentication to the `User` model
3. **Add file storage** — Wire `UploadedAsset` to S3 or Cloudinary
4. **Add RunPod integration** — Connect `GenerationJob` to the AI pipeline
5. **Add credit system** — Implement daily reset cron job

---

*Kemas.ai — AI Packaging Design for Indonesian UMKM*
