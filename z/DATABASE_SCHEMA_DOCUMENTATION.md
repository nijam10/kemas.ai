# Kemas.ai Database Schema Documentation

## Overview

This document explains the complete database architecture for Kemas.ai, an AI-powered packaging design platform for Indonesian UMKM businesses.

**Technology Stack:**
- **ORM:** Prisma
- **Database:** PostgreSQL
- **ID Strategy:** UUID
- **Timestamps:** Automatic createdAt/updatedAt

---

## 📊 Database Structure

### Core Entity Groups

1. **User & Authentication** - User accounts and profiles
2. **Credit System** - Credit wallets and transaction history
3. **Design & Generation** - AI-generated designs and job tracking
4. **Gallery Templates** - Reusable design presets (NOT user history)
5. **Moderation & Admin** - Content moderation and admin actions
6. **Asset Management** - File uploads and storage

---

## 🔐 1. User & Authentication

### User Model

**Purpose:** Stores user account information, authentication data, and business profile.

**Key Fields:**
- `id` - UUID primary key
- `email` - Unique email (indexed for fast lookup)
- `name` - Display name
- `image` - Profile picture URL (from Google OAuth)
- `role` - USER or ADMIN
- `status` - ACTIVE, SUSPENDED, or PENDING
- `businessName` - UMKM business name
- `businessCategory` - Business category (e.g., "Snack Food", "Coffee")

**Relations:**
- One-to-one with `CreditWallet`
- One-to-many with `CreditTransaction`, `Design`, `GenerationJob`, `UploadedAsset`
- Self-referential for admin actions (admin → target user)

**Indexes:**
- `email` - Fast authentication lookup
- `role` - Filter by user type
- `status` - Filter active/suspended users

---

## 💳 2. Credit System

### CreditWallet Model

**Purpose:** Stores current credit balance for each user.

**Key Fields:**
- `userId` - Unique foreign key to User
- `balance` - Current available credits (default: 40)
- `dailyQuota` - Daily reset amount (default: 40)
- `lastResetAt` - Timestamp of last daily reset

**Business Logic:**
- Each user gets ONE credit wallet (1:1 relationship)
- Daily quota resets automatically (handled by cron job)
- Balance decreases on generation, increases on top-up/reset

**Example:**
```
User creates account → CreditWallet created with 40 credits
User generates design → Balance: 40 - 10 = 30 credits
Next day at midnight → Balance reset to 40 (dailyQuota)
Admin tops up 20 → Balance: 40 + 20 = 60 credits
```

### CreditTransaction Model

**Purpose:** Immutable audit log of all credit movements.

**Transaction Types:**
- `DAILY_RESET` - Automatic daily quota reset
- `GENERATION_USAGE` - Credits deducted for AI generation
- `ADMIN_TOPUP` - Admin manually adds credits
- `ADMIN_RESET` - Admin resets to daily quota
- `REFUND` - Credits returned for failed generation

**Key Fields:**
- `amount` - Positive for add, negative for deduct
- `type` - Transaction type enum
- `description` - Human-readable explanation
- `referenceId` - Links to Design/Job ID if applicable

**Example Transactions:**
```sql
-- Daily reset
{ amount: 40, type: DAILY_RESET, description: "Daily quota reset" }

-- User generates design
{ amount: -10, type: GENERATION_USAGE, referenceId: "design-uuid" }

-- Admin tops up
{ amount: 50, type: ADMIN_TOPUP, description: "Admin top-up by John" }

-- Failed generation refund
{ amount: 10, type: REFUND, referenceId: "design-uuid" }
```

**Indexes:**
- `userId` - Fast user transaction history
- `type` - Filter by transaction type
- `createdAt` - Chronological sorting

---

## 🎨 3. Design & Generation

### Design Model

**Purpose:** Stores user's generated packaging designs.

**Key Fields:**
- `title` - Design name (user-provided or auto-generated)
- `prompt` - User's generation prompt (TEXT field)
- `negativePrompt` - Quality control prompt
- `seed` - Random seed for reproducibility
- `packagingType` - STANDING_POUCH, BOX, JAR, etc.
- `imageUrl` - Final generated image URL
- `logoUrl` - User's uploaded logo URL
- `thumbnailUrl` - Preview thumbnail
- `status` - PROCESSING, COMPLETED, FAILED, FLAGGED
- `creditsUsed` - Credits consumed (default: 10)
- `isSaved` - User favorited this design

**Status Flow:**
```
PROCESSING → COMPLETED (success)
PROCESSING → FAILED (error)
COMPLETED → FLAGGED (moderation)
```

**Indexes:**
- `userId` - User's design history
- `status` - Filter by status
- `packagingType` - Filter by type
- `createdAt` - Chronological sorting

### GenerationJob Model

**Purpose:** Tracks AI generation pipeline status in real-time.

**Key Fields:**
- `designId` - Unique 1:1 link to Design
- `runpodJobId` - RunPod API job identifier
- `comfyWorkflowId` - ComfyUI workflow identifier
- `status` - QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
- `currentStep` - Current pipeline step (enum)
- `errorMessage` - Error details if failed
- `startedAt` - Job start timestamp
- `completedAt` - Job completion timestamp

**Pipeline Steps:**
1. `CREDIT_CHECK` - Verify user has enough credits
2. `API_GATEWAY` - Send request to RunPod
3. `COMFYUI_PIPELINE` - ComfyUI workflow execution
4. `LORA_STYLE` - Apply LoRA style model
5. `LOGO_COMPOSITING` - Composite user logo
6. `OUTPUT_READY` - Final image generated
7. `PREVIEW_READY` - Thumbnail ready

**Example Flow:**
```
User clicks "Generate" 
→ Design created (status: PROCESSING)
→ GenerationJob created (status: QUEUED)
→ Job starts (status: RUNNING, currentStep: CREDIT_CHECK)
→ Credits deducted
→ currentStep: API_GATEWAY
→ currentStep: COMFYUI_PIPELINE
→ currentStep: LORA_STYLE
→ currentStep: LOGO_COMPOSITING
→ currentStep: OUTPUT_READY
→ Job completes (status: COMPLETED)
→ Design updated (status: COMPLETED, imageUrl set)
```

**Indexes:**
- `userId` - User's job history
- `status` - Filter active/completed jobs
- `runpodJobId` - Webhook lookup
- `createdAt` - Queue ordering

---

## 🖼️ 4. Gallery Templates

### GalleryTemplate Model

**Purpose:** Reusable design templates/presets for inspiration.

**IMPORTANT:** Gallery templates are NOT user design history!

**Difference from Design:**
- `Design` = User's personal generated designs (history)
- `GalleryTemplate` = Curated preset library (inspiration)

**Key Fields:**
- `title` - Template name
- `slug` - URL-friendly identifier (unique)
- `description` - Template description
- `category` - FOOD_BEVERAGES, ARTISAN_SNACK, etc.
- `packagingType` - Package type
- `previewImageUrl` - Template preview image
- `promptPreset` - Pre-filled prompt template
- `negativePrompt` - Quality control
- `seed` - Reproducible seed
- `colorMood` - "warm", "cool", "vibrant"
- `styleTags` - ["minimalist", "modern", "elegant"]
- `isFeatured` - Show on homepage

**Use Case:**
```
User visits Gallery page
→ Sees curated GalleryTemplates
→ Clicks "Use This Template"
→ Generate page pre-fills with template's promptPreset
→ User customizes and generates
→ New Design created (NOT a GalleryTemplate)
```

**Indexes:**
- `category` - Filter by category
- `slug` - URL routing
- `isFeatured` - Homepage featured templates
- `packagingType` - Filter by type

---

## 🛡️ 5. Moderation & Admin

### ModerationLog Model

**Purpose:** Track admin review of user-generated content.

**Moderation Types:**
- `PROMPT` - Review user prompt text
- `IMAGE` - Review generated image
- `USER_REPORT` - User-reported content

**Moderation Status:**
- `PENDING` - Awaiting review
- `APPROVED` - Approved by admin
- `FLAGGED` - Flagged for issues
- `REMOVED` - Removed from platform

**Key Fields:**
- `designId` - Design being moderated
- `userId` - User who created content
- `adminId` - Admin who reviewed
- `type` - Moderation type
- `status` - Moderation status
- `reason` - Reason for flagging/removal

**Workflow:**
```
User generates design with prompt
→ ModerationLog created (status: PENDING, type: PROMPT)
→ Admin reviews in /admin/moderation
→ Admin approves → status: APPROVED
OR
→ Admin flags → status: FLAGGED, reason: "Inappropriate content"
→ Design.status updated to FLAGGED
```

**Indexes:**
- `designId` - Design moderation history
- `userId` - User's moderation history
- `adminId` - Admin's review history
- `status` - Filter pending items
- `type` - Filter by type

### AdminActionLog Model

**Purpose:** Audit log of all admin actions for accountability.

**Admin Actions:**
- `SUSPEND_USER` - Suspend user account
- `ACTIVATE_USER` - Activate suspended account
- `TOPUP_CREDIT` - Add credits to user
- `RESET_CREDIT` - Reset to daily quota
- `APPROVE_CONTENT` - Approve moderated content
- `FLAG_CONTENT` - Flag content
- `REMOVE_CONTENT` - Remove content

**Key Fields:**
- `adminId` - Admin who performed action
- `targetUserId` - User affected (if applicable)
- `action` - Action type enum
- `description` - Human-readable description
- `metadata` - JSON with additional data

**Example:**
```json
{
  "adminId": "admin-uuid",
  "targetUserId": "user-uuid",
  "action": "TOPUP_CREDIT",
  "description": "Added 50 credits to Khairul Nizam",
  "metadata": {
    "amount": 50,
    "reason": "Compensation for system downtime"
  }
}
```

**Indexes:**
- `adminId` - Admin's action history
- `targetUserId` - Actions affecting user
- `action` - Filter by action type
- `createdAt` - Chronological audit trail

---

## 📁 6. Asset Management

### UploadedAsset Model

**Purpose:** Track all user-uploaded and system-generated files.

**Asset Types:**
- `LOGO` - User uploaded logo
- `GENERATED_IMAGE` - AI generated design
- `THUMBNAIL` - Preview thumbnail

**Key Fields:**
- `userId` - Asset owner
- `type` - Asset type enum
- `fileUrl` - Cloud storage URL (S3, Cloudinary, etc.)
- `fileName` - Original filename
- `mimeType` - "image/png", "image/jpeg"
- `size` - File size in bytes

**Use Cases:**
- Track storage usage per user
- Clean up orphaned files
- Generate usage reports
- Implement storage quotas

**Indexes:**
- `userId` - User's assets
- `type` - Filter by type
- `createdAt` - Chronological sorting

---

## 🔗 Relationship Summary

### User → Credit System
```
User (1) ←→ (1) CreditWallet
User (1) ←→ (N) CreditTransaction
```

### User → Design & Generation
```
User (1) ←→ (N) Design
User (1) ←→ (N) GenerationJob
Design (1) ←→ (1) GenerationJob
```

### User → Moderation
```
User (1) ←→ (N) ModerationLog (as content creator)
User (1) ←→ (N) ModerationLog (as admin reviewer)
Design (1) ←→ (N) ModerationLog
```

### User → Admin Actions
```
User (1) ←→ (N) AdminActionLog (as admin)
User (1) ←→ (N) AdminActionLog (as target)
```

### User → Assets
```
User (1) ←→ (N) UploadedAsset
```

### Independent Entities
```
GalleryTemplate (no user relation - curated library)
```

---

## 🔍 Key Indexes

**Performance-critical indexes:**

1. **Authentication & User Lookup:**
   - `User.email` - Login/registration
   - `User.role` - Admin filtering
   - `User.status` - Active user filtering

2. **Credit Operations:**
   - `CreditWallet.userId` - Balance lookup
   - `CreditTransaction.userId` - Transaction history
   - `CreditTransaction.type` - Transaction filtering

3. **Design & Generation:**
   - `Design.userId` - User history
   - `Design.status` - Status filtering
   - `Design.createdAt` - Chronological sorting
   - `GenerationJob.status` - Active job monitoring
   - `GenerationJob.runpodJobId` - Webhook lookup

4. **Gallery:**
   - `GalleryTemplate.category` - Category filtering
   - `GalleryTemplate.slug` - URL routing
   - `GalleryTemplate.isFeatured` - Homepage display

5. **Moderation:**
   - `ModerationLog.status` - Pending queue
   - `ModerationLog.type` - Type filtering
   - `AdminActionLog.createdAt` - Audit trail

---

## 🚀 Next Steps

### 1. Environment Setup
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma (already done)
npx prisma init

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/kemasai"
```

### 2. Generate Prisma Client
```bash
# Generate TypeScript types
npx prisma generate

# Push schema to database (development)
npx prisma db push

# OR create migration (production)
npx prisma migrate dev --name init
```

### 3. Seed Data (Optional)
Create `prisma/seed.ts` with:
- Sample admin user
- Sample UMKM users
- Gallery templates
- Test designs

### 4. API Implementation
Implement API routes in order:
1. **Auth:** `/api/auth/login`, `/api/auth/register`
2. **Credits:** `/api/credits/balance`, `/api/credits/history`
3. **Generation:** `/api/generation/generate`, `/api/generation/status`
4. **Designs:** `/api/designs` (list, get, delete)
5. **Gallery:** `/api/gallery` (list templates)
6. **Admin:** `/api/admin/users`, `/api/admin/credits`, `/api/admin/moderation`

### 5. Background Jobs
Implement cron jobs for:
- Daily credit reset (midnight)
- Failed job cleanup
- Asset cleanup (orphaned files)
- Moderation queue notifications

### 6. Webhooks
Implement webhook handlers for:
- RunPod job status updates
- ComfyUI pipeline events
- Payment processing (future)

---

## 📝 Schema Validation

Run Prisma validation:
```bash
npx prisma validate
```

Expected output:
```
✓ Prisma schema loaded from prisma/schema.prisma
✓ Environment variables loaded from .env
✓ Prisma schema is valid
```

---

## 🔒 Security Considerations

1. **Cascade Deletes:**
   - User deletion cascades to all related records
   - Prevents orphaned data

2. **Indexes:**
   - All foreign keys indexed for performance
   - Sensitive queries optimized

3. **Data Types:**
   - TEXT for long content (prompts, descriptions)
   - JSON for flexible metadata
   - UUID for non-sequential IDs

4. **Audit Trail:**
   - All admin actions logged
   - Credit transactions immutable
   - Timestamps on all models

---

## 📊 Database Size Estimates

**Assumptions:**
- 1,000 active users
- 10 designs per user per month
- 1 year of data

**Estimated Storage:**
```
Users:              1,000 rows × 1 KB    = 1 MB
CreditWallets:      1,000 rows × 0.5 KB  = 0.5 MB
CreditTransactions: 120,000 rows × 0.5 KB = 60 MB
Designs:            120,000 rows × 2 KB   = 240 MB
GenerationJobs:     120,000 rows × 1 KB   = 120 MB
GalleryTemplates:   100 rows × 2 KB       = 0.2 MB
ModerationLogs:     10,000 rows × 1 KB    = 10 MB
AdminActionLogs:    5,000 rows × 1 KB     = 5 MB
UploadedAssets:     130,000 rows × 0.5 KB = 65 MB

Total Database:     ~500 MB
```

**Note:** Actual images stored in cloud storage (S3/Cloudinary), not database.

---

## ✅ Schema Checklist

- [x] All models defined
- [x] All enums defined
- [x] All relations configured
- [x] Cascade behavior set
- [x] Indexes added
- [x] Comments added
- [x] UUID IDs
- [x] Timestamps
- [x] Validation ready

**Status:** ✅ Schema complete and ready for implementation
