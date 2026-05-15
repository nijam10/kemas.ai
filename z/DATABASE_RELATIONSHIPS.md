# Database Relationships Diagram

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         KEMAS.AI DATABASE SCHEMA                        │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        USER & AUTHENTICATION                             │
└──────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │    USER     │
                              ├─────────────┤
                              │ id (PK)     │
                              │ email       │◄─── Unique, Indexed
                              │ name        │
                              │ image       │
                              │ role        │◄─── USER | ADMIN
                              │ status      │◄─── ACTIVE | SUSPENDED
                              │ businessName│
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
         ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
         │CreditWallet  │  │   Design     │  │UploadedAsset │
         │   (1:1)      │  │   (1:N)      │  │   (1:N)      │
         └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                           CREDIT SYSTEM                                  │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │  CreditWallet   │
    ├─────────────────┤
    │ id (PK)         │
    │ userId (FK)     │◄──── One-to-One with User
    │ balance         │◄──── Current credits
    │ dailyQuota      │◄──── Reset amount (40)
    │ lastResetAt     │◄──── Last reset timestamp
    └─────────────────┘

    ┌─────────────────────┐
    │ CreditTransaction   │
    ├─────────────────────┤
    │ id (PK)             │
    │ userId (FK)         │◄──── Many-to-One with User
    │ amount              │◄──── +/- credits
    │ type                │◄──── DAILY_RESET | GENERATION_USAGE
    │ description         │      ADMIN_TOPUP | ADMIN_RESET | REFUND
    │ referenceId         │◄──── Links to Design/Job
    │ createdAt           │◄──── Immutable audit log
    └─────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                      DESIGN & GENERATION PIPELINE                        │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐              ┌──────────────────┐
    │     Design      │              │  GenerationJob   │
    ├─────────────────┤              ├──────────────────┤
    │ id (PK)         │◄────(1:1)────│ id (PK)          │
    │ userId (FK)     │              │ userId (FK)      │
    │ title           │              │ designId (FK)    │◄─ Unique
    │ prompt          │              │ runpodJobId      │
    │ packagingType   │              │ comfyWorkflowId  │
    │ imageUrl        │              │ status           │◄─ QUEUED | RUNNING
    │ logoUrl         │              │ currentStep      │   COMPLETED | FAILED
    │ status          │◄─ PROCESSING │ errorMessage     │
    │ creditsUsed     │   COMPLETED  │ startedAt        │
    │ isSaved         │   FAILED     │ completedAt      │
    │ createdAt       │   FLAGGED    └──────────────────┘
    └─────────────────┘

    Flow:
    1. User clicks "Generate"
    2. Design created (status: PROCESSING)
    3. GenerationJob created (status: QUEUED)
    4. Job processes through pipeline steps
    5. Job completes → Design updated (status: COMPLETED)

┌──────────────────────────────────────────────────────────────────────────┐
│                         GALLERY TEMPLATES                                │
│                    (Independent - NOT User History)                      │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐
    │  GalleryTemplate    │  ◄─── NO relation to User
    ├─────────────────────┤       Curated preset library
    │ id (PK)             │
    │ title               │
    │ slug                │◄──── Unique, URL-friendly
    │ category            │◄──── FOOD_BEVERAGES | ARTISAN_SNACK
    │ packagingType       │      MODERN_MINIMAL | TRADITIONAL
    │ previewImageUrl     │
    │ promptPreset        │◄──── Pre-filled prompt template
    │ colorMood           │
    │ styleTags           │◄──── Array of tags
    │ isFeatured          │◄──── Show on homepage
    └─────────────────────┘

    Use Case:
    Gallery Page → User clicks template → Generate page pre-fills
    → User customizes → New Design created

┌──────────────────────────────────────────────────────────────────────────┐
│                      MODERATION & ADMIN SYSTEM                           │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │ ModerationLog   │
    ├─────────────────┤
    │ id (PK)         │
    │ designId (FK)   │◄──── Design being moderated
    │ userId (FK)     │◄──── Content creator
    │ adminId (FK)    │◄──── Admin reviewer
    │ type            │◄──── PROMPT | IMAGE | USER_REPORT
    │ status          │◄──── PENDING | APPROVED | FLAGGED
    │ reason          │
    └─────────────────┘
           │
           │ Many-to-One
           ▼
    ┌─────────────────┐
    │     Design      │
    └─────────────────┘

    ┌──────────────────┐
    │ AdminActionLog   │
    ├──────────────────┤
    │ id (PK)          │
    │ adminId (FK)     │◄──── Admin who acted
    │ targetUserId(FK) │◄──── User affected
    │ action           │◄──── SUSPEND_USER | TOPUP_CREDIT
    │ description      │      APPROVE_CONTENT | etc.
    │ metadata         │◄──── JSON with details
    │ createdAt        │◄──── Audit trail
    └──────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         ASSET MANAGEMENT                                 │
└──────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────┐
    │ UploadedAsset   │
    ├─────────────────┤
    │ id (PK)         │
    │ userId (FK)     │◄──── Asset owner
    │ type            │◄──── LOGO | GENERATED_IMAGE | THUMBNAIL
    │ fileUrl         │◄──── Cloud storage URL
    │ fileName        │
    │ mimeType        │
    │ size            │◄──── Bytes
    │ createdAt       │
    └─────────────────┘
```

---

## Relationship Types

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
Design ←→ ModerationLog
User (admin) ←→ ModerationLog
User (admin) ←→ AdminActionLog
```

### Independent
```
GalleryTemplate (no user relation)
```

---

## Data Flow Examples

### 1. User Registration Flow

```
1. User signs in with Google
   ↓
2. User record created
   ├─ name: "Khairul Nizam"
   ├─ email: "khairul@example.com"
   ├─ role: USER
   └─ status: ACTIVE
   ↓
3. CreditWallet automatically created
   ├─ balance: 40
   ├─ dailyQuota: 40
   └─ lastResetAt: now()
   ↓
4. CreditTransaction logged
   ├─ amount: +40
   ├─ type: DAILY_RESET
   └─ description: "Initial credit allocation"
```

### 2. Design Generation Flow

```
1. User submits generation request
   ├─ prompt: "Standing pouch for keripik singkong..."
   ├─ packagingType: STANDING_POUCH
   └─ logoUrl: "https://..."
   ↓
2. Check credit balance
   ├─ CreditWallet.balance >= 10? ✓
   ↓
3. Create Design record
   ├─ status: PROCESSING
   ├─ creditsUsed: 10
   └─ prompt: "..."
   ↓
4. Create GenerationJob
   ├─ status: QUEUED
   ├─ designId: design.id
   └─ currentStep: CREDIT_CHECK
   ↓
5. Deduct credits (transaction)
   ├─ CreditWallet.balance -= 10
   └─ CreditTransaction created
       ├─ amount: -10
       ├─ type: GENERATION_USAGE
       └─ referenceId: design.id
   ↓
6. Send to RunPod API
   ├─ GenerationJob.status = RUNNING
   ├─ GenerationJob.runpodJobId = "..."
   └─ GenerationJob.currentStep = API_GATEWAY
   ↓
7. Pipeline processing
   ├─ currentStep: COMFYUI_PIPELINE
   ├─ currentStep: LORA_STYLE
   ├─ currentStep: LOGO_COMPOSITING
   └─ currentStep: OUTPUT_READY
   ↓
8. Job completes
   ├─ GenerationJob.status = COMPLETED
   ├─ GenerationJob.completedAt = now()
   └─ Design.status = COMPLETED
       ├─ Design.imageUrl = "https://..."
       └─ Design.thumbnailUrl = "https://..."
   ↓
9. User sees result in History
```

### 3. Daily Credit Reset Flow

```
Cron job runs at midnight:

1. Get all active users
   ↓
2. For each user:
   ├─ CreditWallet.balance = dailyQuota
   ├─ CreditWallet.lastResetAt = now()
   └─ CreditTransaction created
       ├─ amount: +40
       ├─ type: DAILY_RESET
       └─ description: "Daily quota reset"
```

### 4. Admin Moderation Flow

```
1. Design generated
   ↓
2. ModerationLog created
   ├─ designId: design.id
   ├─ userId: design.userId
   ├─ type: PROMPT
   └─ status: PENDING
   ↓
3. Admin reviews in /admin/moderation
   ↓
4. Admin approves
   ├─ ModerationLog.status = APPROVED
   ├─ ModerationLog.adminId = admin.id
   └─ AdminActionLog created
       ├─ action: APPROVE_CONTENT
       └─ description: "Approved design #123"
   ↓
OR
   ↓
4. Admin flags
   ├─ ModerationLog.status = FLAGGED
   ├─ ModerationLog.reason = "Inappropriate content"
   ├─ Design.status = FLAGGED
   └─ AdminActionLog created
       ├─ action: FLAG_CONTENT
       └─ description: "Flagged design #123"
```

### 5. Admin Credit Top-Up Flow

```
1. Admin opens /admin/credits
   ↓
2. Admin clicks "Top Up" for user
   ↓
3. Admin enters amount: 50
   ↓
4. Transaction executed
   ├─ CreditWallet.balance += 50
   └─ CreditTransaction created
       ├─ amount: +50
       ├─ type: ADMIN_TOPUP
       └─ description: "Admin top-up by John"
   ↓
5. AdminActionLog created
   ├─ adminId: admin.id
   ├─ targetUserId: user.id
   ├─ action: TOPUP_CREDIT
   └─ metadata: { amount: 50, reason: "..." }
```

### 6. Gallery Template Usage Flow

```
1. User visits /gallery
   ↓
2. Fetch GalleryTemplates
   ├─ category: ARTISAN_SNACK
   └─ isFeatured: true
   ↓
3. User clicks "Use This Template"
   ↓
4. Redirect to /generate with query params
   ├─ ?template=premium-chips
   └─ Pre-fill form with template.promptPreset
   ↓
5. User customizes and generates
   ↓
6. New Design created (NOT a GalleryTemplate)
```

---

## Key Differences

### Design vs GalleryTemplate

| Feature | Design | GalleryTemplate |
|---------|--------|-----------------|
| **Purpose** | User's generated designs | Curated preset library |
| **Owner** | Belongs to User | No user relation |
| **Created by** | AI generation | Admin/curator |
| **Location** | History page | Gallery page |
| **Editable** | No (immutable result) | Yes (admin can update) |
| **Credits** | Costs credits | Free to browse |
| **Status** | PROCESSING/COMPLETED/FAILED | Always ready |

### CreditWallet vs CreditTransaction

| Feature | CreditWallet | CreditTransaction |
|---------|--------------|-------------------|
| **Purpose** | Current balance | Historical log |
| **Records** | 1 per user | Many per user |
| **Mutable** | Yes (balance changes) | No (immutable audit) |
| **Query** | Get current balance | Get transaction history |

---

## Cascade Behavior

### User Deletion
```
User deleted
  ↓ CASCADE
  ├─ CreditWallet deleted
  ├─ CreditTransactions deleted
  ├─ Designs deleted
  │   ↓ CASCADE
  │   ├─ GenerationJobs deleted
  │   └─ ModerationLogs deleted
  ├─ UploadedAssets deleted
  └─ AdminActionLogs deleted
```

### Design Deletion
```
Design deleted
  ↓ CASCADE
  ├─ GenerationJob deleted
  └─ ModerationLogs deleted
```

---

## Index Strategy

### High-Traffic Queries

1. **Authentication:**
   - `User.email` (unique, indexed)

2. **Credit Operations:**
   - `CreditWallet.userId` (unique, indexed)
   - `CreditTransaction.userId` (indexed)

3. **Design Listing:**
   - `Design.userId` + `Design.createdAt` (composite)
   - `Design.status` (indexed)

4. **Job Monitoring:**
   - `GenerationJob.status` (indexed)
   - `GenerationJob.runpodJobId` (indexed for webhooks)

5. **Gallery:**
   - `GalleryTemplate.category` (indexed)
   - `GalleryTemplate.slug` (unique, indexed)

6. **Moderation:**
   - `ModerationLog.status` (indexed)
   - `ModerationLog.type` (indexed)

---

## Summary

**Total Models:** 9
- User (1)
- CreditWallet (1)
- CreditTransaction (1)
- Design (1)
- GenerationJob (1)
- GalleryTemplate (1)
- ModerationLog (1)
- AdminActionLog (1)
- UploadedAsset (1)

**Total Enums:** 10
- UserRole, UserStatus
- CreditTransactionType
- PackagingType
- DesignStatus, GenerationJobStatus, GenerationStep
- GalleryCategory
- ModerationType, ModerationStatus
- AdminAction
- AssetType

**Relationships:**
- 1:1 → 2 (User-CreditWallet, Design-GenerationJob)
- 1:N → 8 (User to various models)
- Independent → 1 (GalleryTemplate)

**Indexes:** 25+ for optimal query performance

**Status:** ✅ Schema complete and production-ready
