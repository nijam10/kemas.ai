# Database Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. Configure Database

Copy `.env.example` to `.env` and update `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kemasai"
```

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kemasai"
```

**Supabase:**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**Railway:**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/railway"
```

**Neon:**
```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

This creates TypeScript types in `node_modules/@prisma/client`.

### 4. Push Schema to Database

**Development (quick):**
```bash
npx prisma db push
```

**Production (with migrations):**
```bash
npx prisma migrate dev --name init
```

### 5. Verify Schema

```bash
npx prisma validate
```

Expected output:
```
✓ Prisma schema loaded from prisma/schema.prisma
✓ Environment variables loaded from .env
✓ Prisma schema is valid
```

### 6. Open Prisma Studio (Optional)

```bash
npx prisma studio
```

Opens GUI at `http://localhost:5555` to view/edit data.

---

## Database Providers

### Option 1: Local PostgreSQL

**Install PostgreSQL:**
- **Windows:** Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac:** `brew install postgresql`
- **Linux:** `sudo apt install postgresql`

**Create Database:**
```bash
psql -U postgres
CREATE DATABASE kemasai;
\q
```

**Connection String:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kemasai"
```

### Option 2: Supabase (Recommended for Development)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database
4. Update `.env`

**Pros:**
- Free tier (500 MB)
- Automatic backups
- Built-in auth (optional)
- Dashboard UI

### Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string
4. Update `.env`

**Pros:**
- Free $5/month credit
- Auto-deploy from GitHub
- Easy scaling

### Option 4: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `.env`

**Pros:**
- Serverless PostgreSQL
- Free tier
- Instant branching

---

## Prisma Commands Cheat Sheet

### Schema Management

```bash
# Validate schema
npx prisma validate

# Format schema
npx prisma format

# Generate client
npx prisma generate
```

### Database Sync

```bash
# Push schema (dev only)
npx prisma db push

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Data Management

```bash
# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

### Introspection

```bash
# Generate schema from existing database
npx prisma db pull
```

---

## Using Prisma Client in Code

### Initialize Client

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Example Queries

**Create User:**
```typescript
import { prisma } from '@/lib/prisma'

const user = await prisma.user.create({
  data: {
    name: 'Khairul Nizam',
    email: 'khairul@example.com',
    role: 'USER',
    businessName: 'Keripik Rumah Rasa',
    creditWallet: {
      create: {
        balance: 40,
        dailyQuota: 40,
      },
    },
  },
  include: {
    creditWallet: true,
  },
})
```

**Get User with Relations:**
```typescript
const user = await prisma.user.findUnique({
  where: { email: 'khairul@example.com' },
  include: {
    creditWallet: true,
    designs: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
})
```

**Create Design with Job:**
```typescript
const design = await prisma.design.create({
  data: {
    userId: user.id,
    title: 'Keripik Singkong Premium',
    prompt: 'Standing pouch untuk keripik singkong...',
    packagingType: 'STANDING_POUCH',
    status: 'PROCESSING',
    creditsUsed: 10,
    generationJob: {
      create: {
        userId: user.id,
        status: 'QUEUED',
      },
    },
  },
  include: {
    generationJob: true,
  },
})
```

**Deduct Credits:**
```typescript
await prisma.$transaction([
  // Deduct from wallet
  prisma.creditWallet.update({
    where: { userId: user.id },
    data: { balance: { decrement: 10 } },
  }),
  // Log transaction
  prisma.creditTransaction.create({
    data: {
      userId: user.id,
      amount: -10,
      type: 'GENERATION_USAGE',
      description: 'Generated design: Keripik Singkong',
      referenceId: design.id,
    },
  }),
])
```

**Get User History:**
```typescript
const designs = await prisma.design.findMany({
  where: {
    userId: user.id,
    status: 'COMPLETED',
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
  include: {
    generationJob: true,
  },
})
```

**Get Gallery Templates:**
```typescript
const templates = await prisma.galleryTemplate.findMany({
  where: {
    category: 'ARTISAN_SNACK',
    isFeatured: true,
  },
  orderBy: { createdAt: 'desc' },
})
```

**Admin: Get Pending Moderation:**
```typescript
const pending = await prisma.moderationLog.findMany({
  where: { status: 'PENDING' },
  include: {
    design: true,
    user: true,
  },
  orderBy: { createdAt: 'asc' },
})
```

---

## Seed Data (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@kemas.ai',
      role: 'ADMIN',
      status: 'ACTIVE',
      creditWallet: {
        create: {
          balance: 1000,
          dailyQuota: 1000,
        },
      },
    },
  })

  // Create sample UMKM users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Khairul Nizam',
        email: 'khairul@keripik.com',
        role: 'USER',
        status: 'ACTIVE',
        businessName: 'Keripik Rumah Rasa',
        businessCategory: 'Snack Food',
        creditWallet: {
          create: {
            balance: 40,
            dailyQuota: 40,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Siti Aminah',
        email: 'siti@dapoer.com',
        role: 'USER',
        status: 'ACTIVE',
        businessName: 'Dapoer Singkong',
        businessCategory: 'Traditional Snacks',
        creditWallet: {
          create: {
            balance: 35,
            dailyQuota: 40,
          },
        },
      },
    }),
  ])

  // Create gallery templates
  await prisma.galleryTemplate.createMany({
    data: [
      {
        title: 'Premium Chips',
        slug: 'premium-chips',
        description: 'Modern minimalist design for premium chips',
        category: 'ARTISAN_SNACK',
        packagingType: 'STANDING_POUCH',
        previewImageUrl: '/templates/premium-chips.jpg',
        promptPreset: 'Standing pouch for premium cassava chips, modern minimalist design with gold accents',
        colorMood: 'warm',
        styleTags: ['minimalist', 'premium', 'modern'],
        isFeatured: true,
      },
      {
        title: 'Traditional Batik',
        slug: 'traditional-batik',
        description: 'Traditional Indonesian batik pattern',
        category: 'TRADITIONAL',
        packagingType: 'BOX',
        previewImageUrl: '/templates/batik-box.jpg',
        promptPreset: 'Box packaging with traditional batik pattern, warm colors',
        colorMood: 'warm',
        styleTags: ['traditional', 'batik', 'cultural'],
        isFeatured: true,
      },
    ],
  })

  console.log('✓ Seed data created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Add to package.json:**
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

---

## Troubleshooting

### Error: "Can't reach database server"

**Check:**
1. Database is running
2. Connection string is correct
3. Firewall allows connection
4. SSL mode (add `?sslmode=require` for cloud databases)

### Error: "Environment variable not found: DATABASE_URL"

**Fix:**
```bash
# Create .env file
cp .env.example .env

# Edit DATABASE_URL
nano .env
```

### Error: "Migration failed"

**Reset database:**
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Error: "Type 'PrismaClient' is not assignable"

**Regenerate client:**
```bash
npx prisma generate
```

---

## Production Deployment

### 1. Set Environment Variables

Add `DATABASE_URL` to your hosting platform:
- **Vercel:** Project Settings → Environment Variables
- **Railway:** Variables tab
- **Netlify:** Site Settings → Environment Variables

### 2. Run Migrations

```bash
npx prisma migrate deploy
```

### 3. Generate Client

```bash
npx prisma generate
```

### 4. Build Application

```bash
npm run build
```

---

## Next Steps

1. ✅ Schema created
2. ✅ Documentation written
3. ⏳ Set up database (choose provider)
4. ⏳ Run `npx prisma db push`
5. ⏳ Create seed data (optional)
6. ⏳ Implement API routes
7. ⏳ Connect frontend to backend

**Ready to implement backend API!**
