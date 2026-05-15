# Next Implementation Steps

This guide outlines the immediate next steps after the project restructuring.

## 🎯 Priority 1: Database Setup

### 1. Install Prisma
```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Initialize Prisma
```bash
npx prisma init
```

### 3. Define Schema (`prisma/schema.prisma`)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  credits   Int      @default(40)
  isBanned  Boolean  @default(false)
  isSuspended Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  designs      Design[]
  transactions CreditTransaction[]
}

enum Role {
  USER
  ADMIN
}

model Design {
  id            String       @id @default(cuid())
  userId        String
  user          User         @relation(fields: [userId], references: [id])
  prompt        String
  packagingType PackagingType
  logoUrl       String?
  resultUrl     String?
  status        DesignStatus @default(PENDING)
  creditsUsed   Int          @default(1)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

enum PackagingType {
  Pouch
  Box
  Bottle
  Can
  Sachet
  Jar
  Bag
  Wrapper
}

enum DesignStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model CreditTransaction {
  id          String            @id @default(cuid())
  userId      String
  user        User              @relation(fields: [userId], references: [id])
  amount      Int
  type        TransactionType
  description String
  createdAt   DateTime          @default(now())
}

enum TransactionType {
  PURCHASE
  USAGE
  REFUND
  ADMIN_ADJUSTMENT
}
```

### 4. Run Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Update `lib/db.ts`
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

## 🔐 Priority 2: Authentication

### 1. Install Dependencies
```bash
npm install next-auth bcryptjs
npm install -D @types/bcryptjs
```

### 2. Create Auth Config (`app/api/auth/[...nextauth]/route.ts`)
```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  }
})

export { handler as GET, handler as POST }
```

### 3. Implement Registration
Update `app/api/auth/register/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with free credits
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        credits: 40,
        role: "USER"
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

## 🎨 Priority 3: Build Login/Register UI

### 1. Install Form Library
```bash
npm install react-hook-form @hookform/resolvers zod
```

### 2. Create Login Form Component
Location: `features/auth/components/LoginForm.tsx`

### 3. Create Register Form Component
Location: `features/auth/components/RegisterForm.tsx`

### 4. Update Login Page
Update `app/(auth)/login/page.tsx` to use the LoginForm component

### 5. Update Register Page
Update `app/(auth)/register/page.tsx` to use the RegisterForm component

## 💳 Priority 4: Credit System

### 1. Implement Credit Service
Update `server/services/credit.service.ts` with Prisma operations

### 2. Create Credit Balance API
Update `app/api/credits/balance/route.ts`

### 3. Implement Credit Deduction
Add logic to deduct credits when generating designs

## 🤖 Priority 5: AI Generation

### 1. Set Up RunPod Account
- Sign up at runpod.io
- Get API key
- Deploy FLUX.1 endpoint

### 2. Implement RunPod Client
Update `lib/runpod.ts` with actual API calls

### 3. Create Generation Service
Update `server/services/generation.service.ts`

### 4. Build Generation UI
Create components in `features/generation/components/`

## 📊 Priority 6: User Dashboard

### 1. Create Dashboard Components
- Credit balance widget
- Recent designs
- Quick actions

### 2. Implement Data Fetching
Use React Query for data fetching

### 3. Add Navigation
Create sidebar with navigation links

## 🛡️ Priority 7: Admin Panel

### 1. Implement Admin Middleware
Update `server/middleware/require-admin.ts`

### 2. Build Admin Dashboard
Create stats widgets and charts

### 3. User Management
Build user table with actions

### 4. Content Moderation
Create moderation queue interface

## 🎭 Priority 8: 3D Preview

### 1. Install Three.js
```bash
npm install three @react-three/fiber @react-three/drei
```

### 2. Create 3D Scene Component
Location: `features/preview-3d/components/Scene.tsx`

### 3. Add Mockup Models
Create or import 3D models for packaging types

## 📝 Environment Variables

Create `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/kemasai"

# Auth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# RunPod
RUNPOD_API_KEY="your-runpod-api-key"
RUNPOD_ENDPOINT="https://api.runpod.ai/v2/your-endpoint"

# Storage (optional)
STORAGE_BUCKET="your-bucket-name"
STORAGE_REGION="us-east-1"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🧪 Testing

### 1. Install Testing Libraries
```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

### 2. Create Test Files
- Unit tests for services
- Integration tests for API routes
- E2E tests for critical flows

## 🚀 Deployment

### 1. Vercel Deployment
```bash
npm install -g vercel
vercel
```

### 2. Environment Variables
Set all environment variables in Vercel dashboard

### 3. Database
Use Vercel Postgres or external PostgreSQL

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Three.js Documentation](https://threejs.org/docs)

---

**Start with Priority 1 (Database Setup) and work your way down!**
