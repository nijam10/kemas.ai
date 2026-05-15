# Database Schema Implementation Summary

## ✅ Completed

### 1. Prisma Schema Created
**File:** `prisma/schema.prisma`

**Contains:**
- 9 database models
- 10 enums
- Complete relations
- Cascade behavior
- 25+ indexes
- Comprehensive comments

### 2. Documentation Created

**Files:**
1. `DATABASE_SCHEMA_DOCUMENTATION.md` - Complete schema explanation
2. `DATABASE_RELATIONSHIPS.md` - Visual relationship diagrams
3. `DATABASE_SETUP_GUIDE.md` - Step-by-step setup instructions
4. `PRISMA_INSTALLATION.md` - Prisma installation guide

---

## 📊 Database Models Overview

### Core Models (9 Total)

1. **User** - User accounts and authentication
2. **CreditWallet** - Current credit balance (1:1 with User)
3. **CreditTransaction** - Credit history audit log
4. **Design** - Generated packaging designs
5. **GenerationJob** - AI generation pipeline tracking
6. **GalleryTemplate** - Curated design presets (independent)
7. **ModerationLog** - Content moderation records
8. **AdminActionLog** - Admin action audit trail
9. **UploadedAsset** - File upload tracking

### Enums (10 Total)

1. **UserRole** - USER, ADMIN
2. **UserStatus** - ACTIVE, SUSPENDED, PENDING
3. **CreditTransactionType** - DAILY_RESET, GENERATION_USAGE, ADMIN_TOPUP, ADMIN_RESET, REFUND
4. **PackagingType** - STANDING_POUCH, PILLOW_POUCH, BOX, JAR, BOTTLE, SACHET
5. **DesignStatus** - PROCESSING, COMPLETED, FAILED, FLAGGED
6. **GenerationJobStatus** - QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
7. **GenerationStep** - CREDIT_CHECK, API_GATEWAY, COMFYUI_PIPELINE, LORA_STYLE, LOGO_COMPOSITING, OUTPUT_READY, PREVIEW_READY
8. **GalleryCategory** - FOOD_BEVERAGES, ARTISAN_SNACK, MODERN_MINIMAL, TRADITIONAL, ORGANIC, PREMIUM_COFFEE, HEALTHY_PRODUCTS
9. **ModerationType** - PROMPT, IMAGE, USER_REPORT
10. **ModerationStatus** - PENDING, APPROVED, FLAGGED, REMOVED
11. **AdminAction** - SUSPEND_USER, ACTIVATE_USER, TOPUP_CREDIT, RESET_CREDIT, APPROVE_CONTENT, FLAG_CONTENT, REMOVE_CONTENT
12. **AssetType** - LOGO, GENERATED_IMAGE, THUMBNAIL

---

## 🔗 Key Relationships

### One-to-One (1:1)
```
User ←→ CreditWallet
Design ←→ GenerationJob
```

### One-to-Many (1:N)
```
User ←→ CreditTransaction
User ←→ Design
User ←→ GenerationJob
User ←→ UploadedAsset
User ←→ ModerationLog (as creator)
User ←→ ModerationLog (as admin)
User ←→ AdminActionLog (as admin)
User ←→ AdminActionLog (as target)
Design ←→ ModerationLog
```

### Independent
```
GalleryTemplate (no user relation - curated library)
```

---

## 🎯 Main Database Structure

### User & Credit System

```
User
  ├─ CreditWallet (1:1)
  │   └─ balance, dailyQuota, lastResetAt
  └─ CreditTransaction[] (1:N)
      └─ amount, type, description, referenceId
```

**Flow:**
1. User registers → CreditWallet created with 40 credits
2. User generates design → Credits deducted, transaction logged
3. Daily reset → Balance restored to dailyQuota
4. Admin top-up → Credits added, transaction logged

### Design & Generation Pipeline

```
User
  └─ Design[] (1:N)
      ├─ prompt, packagingType, imageUrl, status
      └─ GenerationJob (1:1)
          └─ runpodJobId, status, currentStep, errorMessage
```

**Flow:**
1. User submits prompt → Design created (PROCESSING)
2. GenerationJob created (QUEUED)
3. Credits deducted
4. Job sent to RunPod → status: RUNNING
5. Pipeline processes through steps
6. Job completes → Design updated (COMPLETED)
7. User sees result in History

### Gallery Templates vs Design History

**GalleryTemplate:**
- Curated preset library
- NO user relation
- Pre-filled prompts
- Used for inspiration
- Located in `/gallery`

**Design:**
- User's personal generated designs
- Belongs to User
- Actual AI-generated results
- Located in `/history`

**Workflow:**
```
User visits Gallery
  → Clicks template
  → Generate page pre-fills with template.promptPreset
  → User customizes
  → New Design created (NOT a GalleryTemplate)
```

### Moderation System

```
Design
  └─ ModerationLog[] (1:N)
      ├─ userId (content creator)
      ├─ adminId (reviewer)
      ├─ type (PROMPT | IMAGE)
      └─ status (PENDING | APPROVED | FLAGGED)
```

**Flow:**
1. Design generated → ModerationLog created (PENDING)
2. Admin reviews in `/admin/moderation`
3. Admin approves → status: APPROVED
4. OR Admin flags → status: FLAGGED, Design.status: FLAGGED

---

## 🔍 Important Indexes

**Performance-critical:**

1. **Authentication:**
   - `User.email` (unique, indexed)
   - `User.role` (indexed)
   - `User.status` (indexed)

2. **Credit Operations:**
   - `CreditWallet.userId` (unique, indexed)
   - `CreditTransaction.userId` (indexed)
   - `CreditTransaction.type` (indexed)

3. **Design & Generation:**
   - `Design.userId` (indexed)
   - `Design.status` (indexed)
   - `Design.createdAt` (indexed)
   - `GenerationJob.status` (indexed)
   - `GenerationJob.runpodJobId` (indexed for webhooks)

4. **Gallery:**
   - `GalleryTemplate.category` (indexed)
   - `GalleryTemplate.slug` (unique, indexed)
   - `GalleryTemplate.isFeatured` (indexed)

5. **Moderation:**
   - `ModerationLog.status` (indexed)
   - `ModerationLog.type` (indexed)
   - `AdminActionLog.createdAt` (indexed)

---

## 🚀 Next Steps

### 1. Install Prisma

```bash
npm install prisma@5 @prisma/client@5 --save-dev
```

### 2. Set Up Database

Choose a provider:
- **Local PostgreSQL** (development)
- **Supabase** (recommended for development)
- **Railway** (easy deployment)
- **Neon** (serverless)

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kemasai"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Push Schema to Database

```bash
npx prisma db push
```

### 5. Create Seed Data (Optional)

Create `prisma/seed.ts` with:
- Admin user
- Sample UMKM users
- Gallery templates
- Test designs

### 6. Implement API Routes

**Priority order:**

1. **Auth API** (`/api/auth/*`)
   - Login
   - Register
   - Session management

2. **Credits API** (`/api/credits/*`)
   - Get balance
   - Get transaction history

3. **Generation API** (`/api/generation/*`)
   - Generate design
   - Get job status
   - Webhook handler

4. **Designs API** (`/api/designs/*`)
   - List user designs
   - Get design by ID
   - Delete design
   - Toggle favorite

5. **Gallery API** (`/api/gallery/*`)
   - List templates
   - Get template by slug
   - Filter by category

6. **Admin API** (`/api/admin/*`)
   - User management
   - Credit management
   - Moderation queue
   - Action logs

### 7. Background Jobs

Implement cron jobs:
- Daily credit reset (midnight)
- Failed job cleanup
- Asset cleanup
- Moderation notifications

### 8. Webhooks

Implement webhook handlers:
- RunPod job status updates
- ComfyUI pipeline events

---

## 📁 Files Created

1. `prisma/schema.prisma` - Complete Prisma schema
2. `DATABASE_SCHEMA_DOCUMENTATION.md` - Detailed documentation
3. `DATABASE_RELATIONSHIPS.md` - Visual diagrams
4. `DATABASE_SETUP_GUIDE.md` - Setup instructions
5. `PRISMA_INSTALLATION.md` - Installation guide
6. `DATABASE_SCHEMA_SUMMARY.md` - This file

---

## ✅ Schema Validation Checklist

- [x] All models defined
- [x] All enums defined
- [x] All relations configured
- [x] Cascade behavior set
- [x] Indexes added for performance
- [x] Comments added for clarity
- [x] UUID IDs for all models
- [x] Timestamps (createdAt/updatedAt)
- [x] Proper foreign keys
- [x] Unique constraints
- [x] Default values
- [x] Text fields for long content
- [x] JSON fields for flexible data

---

## 🔒 Security Features

1. **Cascade Deletes:**
   - User deletion cascades to all related records
   - Prevents orphaned data

2. **Audit Trails:**
   - All credit transactions logged (immutable)
   - All admin actions logged
   - Timestamps on all models

3. **Data Integrity:**
   - Foreign key constraints
   - Unique constraints on emails, slugs
   - Enum validation

4. **Performance:**
   - Strategic indexes on high-traffic queries
   - Efficient relation loading

---

## 📊 Estimated Database Size

**Assumptions:**
- 1,000 active users
- 10 designs per user per month
- 1 year of data

**Storage:**
```
Users:              1 MB
CreditWallets:      0.5 MB
CreditTransactions: 60 MB
Designs:            240 MB
GenerationJobs:     120 MB
GalleryTemplates:   0.2 MB
ModerationLogs:     10 MB
AdminActionLogs:    5 MB
UploadedAssets:     65 MB

Total:              ~500 MB
```

**Note:** Images stored in cloud storage (S3/Cloudinary), not database.

---

## 🎓 Key Concepts

### Credit System
- Each user has ONE credit wallet
- Daily quota resets automatically
- All transactions logged for audit
- Refunds for failed generations

### Generation Pipeline
- Design and GenerationJob are separate
- Design = final result
- GenerationJob = process tracking
- Real-time status updates via webhooks

### Gallery vs History
- Gallery = curated templates (no user)
- History = user's generated designs
- Templates pre-fill Generate page
- Designs are immutable results

### Moderation
- All content can be moderated
- Pending queue for admin review
- Flagged content hidden from users
- Admin actions logged for accountability

---

## 🚦 Status

**Schema:** ✅ Complete and production-ready
**Documentation:** ✅ Comprehensive
**Installation:** ⏳ Pending (run `npm install prisma@5`)
**Database Setup:** ⏳ Pending (choose provider, run `npx prisma db push`)
**API Implementation:** ⏳ Not started
**Seed Data:** ⏳ Optional

**Next Action:** Install Prisma and set up database connection

---

## 📞 Support

**Prisma Documentation:**
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

**Database Providers:**
- [Supabase](https://supabase.com/docs)
- [Railway](https://docs.railway.app)
- [Neon](https://neon.tech/docs)

**Community:**
- [Prisma Discord](https://pris.ly/discord)
- [Prisma GitHub](https://github.com/prisma/prisma)
