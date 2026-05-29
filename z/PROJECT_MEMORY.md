# Kemas.ai — Project Memory

Complete development history and current state of the Kemas.ai project.
Last updated: May 2026

---

## 1. Project Overview

**Kemas.ai** is an AI-powered packaging design platform for Indonesian UMKM (small/medium businesses). Users describe their product, optionally upload a logo, choose a packaging type, and the platform generates a market-ready packaging mockup using ComfyUI.

### Tech Stack
- **Framework:** Next.js 16.1.6 (App Router) + Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Auth:** Auth.js v5 (next-auth@beta 5.0.0-beta.31) + Google OAuth
- **Database:** Prisma 7.8.0 + Neon PostgreSQL (pg driver adapter)
- **AI Generation:** ComfyUI hosted on Kaggle (Flux1-dev-fp8 + KemasAI_Final LoRA)
- **Runtime:** Node.js (Windows dev environment, cmd shell)

### Design System
- Background: `#FCFBF7` (warm cream)
- Primary: `#F97316` (orange)
- Accent: `#FACC15` (gold)
- Text: `#1A1A1A` (near black)
- Border: `#E5E4E0`
- Style: Premium editorial SaaS, Apple/Linear inspired, clean, minimal

### Strict Rules (enforced throughout)
- NO "4K" claims — use "High Resolution" or "Export Ready"
- NO AI-themed icons (robot, brain, wand, sparkle, chip) — use Package, Box, User, etc.
- NO dark cyberpunk UI, neon, glowing effects
- NO dummy/mock data in production code
- NO RunPod (uses ComfyUI instead)
- NO heavy UI redesigns
- All Prisma API routes run in Node runtime, NOT Edge
- `npm run build` must always pass
- Realistic Indonesian UMKM examples only

---

## 2. Development Timeline (What We Built)

### Phase 1 — Centralized Mock Data (later removed)
- Created `lib/mock-data.ts` with 15 TypeScript interfaces and realistic Indonesian UMKM data
- Integrated into dashboard, history, gallery, profile, admin pages
- **NOTE: This file was DELETED in the cleanup phase once real APIs were ready**

### Phase 2 — Frontend Auth Architecture (mock, later replaced)
- Built localStorage-based mock auth (`lib/auth.ts`, `contexts/auth-context.tsx`)
- Two actors: USER and ADMIN (no GUEST)
- **NOTE: Both files were DELETED when real Auth.js was implemented**

### Phase 3 — QA Audit
- Fixed logout redirect (was `/login`, corrected to `/`)
- Verified route protection rules

### Phase 4 — Prisma + PostgreSQL Foundation
- Set up Prisma 7 with `prisma.config.ts` (Prisma 7 moved datasource URL out of schema)
- Created full schema: User, CreditWallet, CreditTransaction, Design, GenerationJob, GalleryTemplate, UploadedAsset, ModerationLog, AdminActionLog
- `lib/prisma.ts` singleton uses `PrismaPg` adapter
- `prisma/seed.ts` for seeding (uses adapter-backed client + dotenv)

### Phase 5 — Read-only API Routes (Phase 1 APIs)
- Service layer: `user.service.ts`, `gallery.service.ts`, `design.service.ts`, `credit.service.ts`
- Routes: `GET /api/gallery`, `GET /api/designs`, `GET /api/profile`, `GET /api/credits/balance`
- All follow `{ success: true, data }` / `{ success: false, error }` envelope

### Phase 6 — Frontend connected to read-only APIs
- `lib/api-client.ts` typed fetch wrappers
- Hooks: `use-gallery.ts`, `use-designs.ts`, `use-profile.ts`, `use-credits.ts`
- Each returns `{ data, loading, error, refetch }`

### Phase 7 — Real Google OAuth (Auth.js v5)
- Installed `next-auth@beta` + `@auth/prisma-adapter`
- `auth.ts` — JWT strategy, Google provider, signIn/jwt/session callbacks
- Added `Account`, `Session`, `VerificationToken`, `emailVerified` to schema
- `proxy.ts` (Next.js 16 renamed middleware→proxy) for route protection using `getToken()` — Edge-safe, does NOT import Prisma adapter
- On first login: creates User (role USER, status ACTIVE) + CreditWallet (40 balance, 40 quota)
- `types/next-auth.d.ts` extends session with `id`, `role`, `status`

### Phase 8 — Auth Bug Fixes
- Fixed proxy importing Prisma adapter (crashed on Edge) → switched to `getToken()`
- Fixed proxy export name `middleware` → `proxy` (Next.js 16)
- Fixed JWT token field `userId` → `id` consistency
- Added Google profile image domains to `next.config.ts`

### Phase 9 — Legacy Cleanup
- DELETED `lib/auth.ts`, `contexts/auth-context.tsx`, `lib/mock-data.ts`
- Rewrote dashboard, preview, profile, gallery, history to use real APIs
- Rewrote admin pages (users, credits, moderation, dashboard) with empty states (no admin API yet)
- Removed all dummy data: Khairul Nizam, Keripik Rumah Rasa, etc.

### Phase 10 — Landing Page Gallery Cleanup
- Removed `galleryItems` dummy array (Cassava Chips, Dark Chocolate, etc.)
- Replaced with clean empty state: "Design examples will appear here soon"

### Phase 11 — Real Profile Settings (Persisted)
- Added `UserProfile` model (businessName, brandCategory, defaultPackagingType, defaultExportQuality, autoSaveGeneratedDesigns)
- `GET /api/profile` includes userProfile settings
- `PATCH /api/profile` upserts settings
- Profile page reads/saves real data

### Phase 12 — Prisma Singleton Stale Bug Fix
- Bug: after `prisma generate`, dev server kept stale `globalThis.prisma` without new model
- Fix: added `SCHEMA_VERSION` guard in `lib/prisma.ts` — bump it after each schema change to force fresh client

### Phase 13 — Real ComfyUI Generation (CURRENT)
- `lib/comfyui.ts` — ComfyUI client (submitPrompt, getHistory, getImageUrl, uploadLogo, getQueueStatus)
- `lib/workflow.ts` — loads workflow JSON, injects prompt/seed/logo
- `workflows/kemas-packaging-api.json` — real Flux workflow with KemasSmartLogoPlacement
- `POST /api/generate` — auth, validate, credit check, upload logo, create Design+Job, submit to ComfyUI
- `GET /api/generate/[designId]/status` — poll ComfyUI, deduct credits on completion (idempotent)
- Updated generate page (FormData + logo), preview page (polling), history, recent history panel

---

## 3. Current File Structure (key files)

```
kemas.ai/
├── auth.ts                              # Auth.js v5 config (Google + JWT)
├── proxy.ts                             # Route protection (Edge, getToken)
├── prisma.config.ts                     # Prisma 7 config (datasource URL)
├── next.config.ts                       # Image domains (googleusercontent)
├── .env / .env.example
├── prisma/
│   ├── schema.prisma                    # Full DB schema
│   └── seed.ts                          # DB seeder
├── workflows/
│   └── kemas-packaging-api.json         # ComfyUI API workflow
├── lib/
│   ├── prisma.ts                        # Prisma singleton (PrismaPg adapter + SCHEMA_VERSION guard)
│   ├── db.ts                            # Re-exports prisma as db
│   ├── comfyui.ts                       # ComfyUI HTTP client
│   ├── workflow.ts                      # Workflow injection helper
│   ├── api-client.ts                    # Typed fetch wrappers
│   └── utils.ts
├── contexts/                            # (auth-context.tsx DELETED)
├── hooks/
│   ├── use-gallery.ts
│   ├── use-designs.ts
│   ├── use-profile.ts
│   └── use-credits.ts
├── types/
│   └── next-auth.d.ts                   # Session type extensions
├── server/services/
│   ├── user.service.ts
│   ├── gallery.service.ts
│   ├── design.service.ts
│   └── credit.service.ts
├── components/
│   ├── layout/auth-navbar.tsx           # useSession() based navbar
│   └── generation/
│       ├── recent-history-panel.tsx     # Latest 3 real designs
│       ├── generation-pipeline.tsx
│       ├── prompt-panel.tsx
│       ├── logo-upload.tsx
│       └── packaging-type-selector.tsx
└── app/
    ├── layout.tsx                       # SessionProvider wrapper
    ├── page.tsx                         # Landing (empty gallery state)
    ├── (auth)/login/page.tsx            # Google sign-in + dev buttons
    ├── logout/page.tsx                  # signOut()
    ├── profile/page.tsx                 # Real profile settings
    ├── (user)/
    │   ├── dashboard/page.tsx
    │   ├── generate/page.tsx            # FormData + logo submit
    │   ├── gallery/page.tsx
    │   ├── history/page.tsx
    │   └── preview/[id]/page.tsx        # Status polling
    ├── (admin)/admin/
    │   ├── page.tsx                     # Empty states
    │   ├── users/page.tsx
    │   ├── credits/page.tsx
    │   └── moderation/page.tsx
    └── api/
        ├── auth/[...nextauth]/route.ts
        ├── profile/route.ts             # GET + PATCH
        ├── gallery/route.ts
        ├── designs/route.ts
        ├── credits/balance/route.ts
        ├── generate/route.ts            # POST — submit generation
        └── generate/[designId]/status/route.ts  # GET — poll status
```

---

## 4. Database Schema (Prisma)

### Models
| Model | Purpose |
|-------|---------|
| `User` | Account (USER/ADMIN, status, business info) + Auth.js fields |
| `Account` | Auth.js OAuth accounts |
| `Session` | Auth.js sessions |
| `VerificationToken` | Auth.js email tokens |
| `UserProfile` | Workspace preferences (businessName, brandCategory, defaultPackagingType, defaultExportQuality, autoSaveGeneratedDesigns) |
| `CreditWallet` | balance (default 40), dailyQuota (default 40), lastResetAt |
| `CreditTransaction` | Audit trail (amount, type, description, referenceId) |
| `Design` | Generated designs (title, prompt, packagingType, imageUrl, thumbnailUrl, status, creditsUsed, isSaved, logoUrl) |
| `GenerationJob` | Job tracking (status, currentStep, runpodJobId=ComfyUI prompt_id, errorMessage) |
| `GalleryTemplate` | Reusable presets |
| `UploadedAsset` | User logos / generated images |
| `ModerationLog` | Content moderation |
| `AdminActionLog` | Admin audit |

### Key Enums
- `UserRole`: USER, ADMIN
- `UserStatus`: ACTIVE, SUSPENDED, PENDING
- `PackagingType`: STANDING_POUCH, PILLOW_POUCH, BOX, JAR, BOTTLE, SACHET
- `DesignStatus`: PROCESSING, COMPLETED, FAILED, FLAGGED
- `GenerationJobStatus`: QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
- `GenerationStep`: CREDIT_CHECK, API_GATEWAY, COMFYUI_PIPELINE, LORA_STYLE, LOGO_COMPOSITING, OUTPUT_READY, PREVIEW_READY
- `CreditTransactionType`: DAILY_RESET, GENERATION_USAGE, ADMIN_TOPUP, ADMIN_RESET, REFUND

### IMPORTANT Prisma Notes
- **Prisma 7** moved datasource URL out of `schema.prisma` → into `prisma.config.ts`
- Uses `@prisma/adapter-pg` (PrismaPg) — required by Prisma 7, cannot run on Edge
- `lib/prisma.ts` has `SCHEMA_VERSION` constant — **BUMP IT after every `prisma generate`** to force the dev singleton to refresh (current: `v2-userprofile`)
- After schema changes: `npx prisma db push` + `npx prisma generate` + restart dev server (or bump SCHEMA_VERSION)

---

## 5. Authentication (Auth.js v5)

- **Strategy:** JWT (not database sessions) so proxy can verify without DB hit
- **Provider:** Google OAuth only (no email/password)
- **First login:** auto-creates User + CreditWallet (40 credits) + welcome CreditTransaction
- **Session shape:** `session.user.{ id, name, email, image, role, status }`
- **Route protection** (`proxy.ts`):
  - Public: `/`, `/about`, `/login`, `/forgot-password`, `/api/auth/*`
  - Protected: everything else → redirect to `/login`
  - Admin: `/admin/*` → USER redirected to `/dashboard`
  - Logged-in on `/login` → redirect to dashboard/admin
- **Logout:** `signOut({ callbackUrl: "/" })` + clears legacy `kemas_auth_state` localStorage key

### Required env
```env
AUTH_SECRET=""          # npx auth secret
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
# AUTH_URL=""           # production only
```
Google redirect URI: `http://localhost:3000/api/auth/callback/google`

---

## 6. ComfyUI Generation Pipeline

### Workflow Node Map (workflows/kemas-packaging-api.json)
| Node ID | Class | Role |
|---------|-------|------|
| `"29"` | CLIPTextEncode | Positive prompt (injected) |
| `"30"` | CLIPTextEncode | Negative prompt (fixed) |
| `"28"` | KSampler | Seed (randomised per generation) |
| `"57"` | LoadImage | Logo (injected uploaded filename) |
| `"54"` | KemasSmartLogoPlacement | Custom logo placement node |
| `"62"` | SaveImage | **Final output** (prefix `kemas_output`) — added because PreviewImage doesn't appear in /history |

Model: Flux1-dev-fp8 + KemasAI_Final.safetensors LoRA. Output: 768×1024.

### ComfyUI Endpoints
- `POST /upload/image` — upload logo to input folder
- `POST /prompt` — submit workflow, returns prompt_id
- `GET /history/{promptId}` — poll status + output filenames
- `GET /view?filename=&subfolder=&type=` — image URL
- `GET /queue` — optional queue check

### Generation Flow
```
/generate → POST /api/generate (FormData: prompt, packagingType, logo)
  → auth + validate + credit check (>= 10)
  → upload logo to ComfyUI (fallback to default if fails)
  → create Design (PROCESSING) + GenerationJob (QUEUED)
  → buildWorkflow() injects prompt/seed/logo
  → submitPrompt() → store prompt_id in GenerationJob.runpodJobId
  → job → RUNNING
  → return { designId, jobId, promptId }
  → redirect to /preview/[designId]

/preview/[designId] polls GET /api/generate/[designId]/status every 4s
  → COMPLETED/FAILED in DB → return immediately
  → else getHistory(promptId):
      QUEUED/RUNNING → PROCESSING
      FAILED → mark failed, NO credit deduction
      COMPLETED → save imageUrl, deduct 10 credits (idempotent), mark COMPLETED
```

### Credit Deduction Rules
- Deducted ONLY on successful COMPLETED status
- Idempotent: checks for existing `CreditTransaction` with `referenceId=designId` + `type=GENERATION_USAGE` before deducting
- Never deducted on submit, failure, or server unavailable

### Required env
```env
COMFYUI_BASE_URL=""              # https tunnel URL, no trailing slash
COMFYUI_CLIENT_ID="kemas-ai-server"
COMFYUI_API_KEY=""               # optional Bearer token
# COMFYUI_WORKFLOW_PATH=""       # optional override
```

### Known Kaggle Limitations
- Tunnel URL changes each session → update COMFYUI_BASE_URL
- Generated images are ephemeral (on Kaggle VM) → for production, download to S3/Cloudinary
- Single GPU = queued requests (handled by polling)
- ~12h session timeout, cold start 30-60s

---

## 7. API Routes Reference

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/auth/[...nextauth]` | GET/POST | — | Auth.js handler |
| `/api/profile` | GET | ✅ | User + wallet + userProfile + stats |
| `/api/profile` | PATCH | ✅ | Upsert UserProfile settings |
| `/api/gallery` | GET | — | Gallery templates |
| `/api/designs` | GET | session/fallback | User's designs (paginated) |
| `/api/credits/balance` | GET | session/fallback | Balance + recent transactions |
| `/api/generate` | POST | ✅ | Submit generation to ComfyUI |
| `/api/generate/[designId]/status` | GET | ✅ owner | Poll status, deduct credits on completion |

All Prisma routes have `export const runtime = "nodejs"`.

---

## 8. Conventions & Gotchas

1. **Summary/docs `.md` files** go in `z/` folder (NOT project root). README.md stays at root.
2. **Next.js 16 dynamic route params** are `Promise<{...}>` — must `await params`.
3. **Next.js 16 middleware** renamed to `proxy.ts`, export must be named `proxy`.
4. **Prisma singleton** — bump `SCHEMA_VERSION` in `lib/prisma.ts` after schema changes.
5. **proxy.ts must NOT import Prisma/auth.ts** — uses `getToken()` only (Edge-safe).
6. **Service layer** uses mock-user fallback (`getMockCurrentUser`) for dev when no session — first ACTIVE USER in DB.
7. **PowerShell/cmd** environment — use `;` not `&&`, no heredocs, single-line inline commands.
8. **`GenerationJob.runpodJobId`** field reused to store ComfyUI `prompt_id` (no RunPod despite the name).
9. External images (`next/image`) use `unimized` prop for ComfyUI URLs; Google avatars whitelisted in `next.config.ts`.

---

## 9. Build & Run Commands

```bash
npm run dev              # dev server (localhost:3000)
npm run build            # production build (must pass)
npm run prisma:generate  # regenerate client (then bump SCHEMA_VERSION)
npm run prisma:push      # push schema to Neon
npm run prisma:studio    # visual DB browser
npm run prisma:seed      # seed database
```

---

## 10. Current Status

- ✅ Auth.js + Google OAuth working
- ✅ Navbar uses real session
- ✅ Credits real from CreditWallet
- ✅ Profile settings persisted to DB
- ✅ Database clean (no dummy data)
- ✅ Real ComfyUI generation pipeline (prompt + logo + packaging type)
- ✅ Credit deduction on completion (idempotent)
- ✅ History/preview/recent-history show real designs
- ✅ `npm run build` passes (30 routes)

### Not Yet Implemented
- Admin API routes (admin pages show empty states)
- Persistent image storage (S3/Cloudinary) — images currently ephemeral on Kaggle
- Daily credit reset cron job
- Download tracking
- Gallery template seeding (intentionally empty)

---

*This memory file consolidates all work from mock data layer → real Auth.js → real ComfyUI generation.*
