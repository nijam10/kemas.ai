# Prisma Installation Guide

## Install Prisma (Recommended Version)

We'll use Prisma 5.x (LTS) instead of Prisma 7 (which has breaking changes).

### 1. Install Prisma Dependencies

```bash
npm install prisma@5 @prisma/client@5 --save-dev
```

Or with specific version:

```bash
npm install prisma@5.22.0 @prisma/client@5.22.0 --save-dev
```

### 2. Verify Installation

```bash
npx prisma --version
```

Expected output:
```
prisma                  : 5.22.0
@prisma/client          : 5.22.0
```

### 3. Validate Schema

```bash
npx prisma validate
```

Expected output:
```
✓ Prisma schema loaded from prisma/schema.prisma
✓ Environment variables loaded from .env
✓ Prisma schema is valid
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

This creates TypeScript types in `node_modules/@prisma/client`.

### 5. Set Up Database

**Option A: Push schema (development):**
```bash
npx prisma db push
```

**Option B: Create migration (production):**
```bash
npx prisma migrate dev --name init
```

---

## Why Prisma 5 Instead of Prisma 7?

**Prisma 7 Changes:**
- Removed `url` from datasource (breaking change)
- Requires `prisma.config.ts` file
- New adapter-based configuration
- Still in early adoption phase

**Prisma 5 Benefits:**
- Stable LTS version
- Standard `DATABASE_URL` configuration
- Well-documented
- Production-ready
- Compatible with all hosting platforms

---

## Update package.json

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

---

## Environment Setup

Create `.env` file (copy from `.env.example`):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kemasai"

# For connection pooling (optional)
# DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/kemasai"
```

---

## Quick Start Commands

```bash
# 1. Install Prisma
npm install prisma@5 @prisma/client@5 --save-dev

# 2. Validate schema
npx prisma validate

# 3. Generate client
npx prisma generate

# 4. Push to database
npx prisma db push

# 5. Open Prisma Studio (optional)
npx prisma studio
```

---

## Troubleshooting

### Error: "Prisma schema validation failed"

Make sure you're using Prisma 5:
```bash
npm uninstall prisma @prisma/client
npm install prisma@5 @prisma/client@5 --save-dev
```

### Error: "Environment variable not found: DATABASE_URL"

Create `.env` file:
```bash
cp .env.example .env
# Edit DATABASE_URL
```

### Error: "Can't reach database server"

Check:
1. PostgreSQL is running
2. Connection string is correct
3. Database exists
4. Firewall allows connection

---

## Next Steps

After installation:

1. ✅ Prisma installed
2. ✅ Schema validated
3. ⏳ Generate Prisma Client
4. ⏳ Push schema to database
5. ⏳ Create seed data (optional)
6. ⏳ Implement API routes

**Ready to proceed with database setup!**
