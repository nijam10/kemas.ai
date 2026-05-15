# Mock Data Integration Guide

## ✅ Completed Pages

1. **Dashboard** - `app/(user)/dashboard/page.tsx` ✅
2. **History** - `app/(user)/history/page.tsx` ✅
3. **Gallery** - `app/(user)/gallery/page.tsx` ✅

---

## ⏳ Remaining Pages - Quick Reference

### 4. Admin Users Page
**File:** `app/(admin)/admin/users/page.tsx`

**Replace:**
```typescript
const mockUsers = [
  { id: 1, name: "Khairul Nizam", business: "Keripik Rumah Rasa", ... },
  // ... more users
];
```

**With:**
```typescript
import { adminUsers, adminUserCredits, getUserCredits } from "@/lib/mock-data";

// Use adminUsers directly
// Get credits with: getUserCredits(userId)
```

**Changes needed:**
- Import `adminUsers` from mock-data
- Replace `mockUsers` with `adminUsers`
- Update `id` type from `number` to `string`
- Update `status` values: "active" → "ACTIVE", "suspended" → "SUSPENDED"
- Get user credits from `adminUserCredits` array
- Format joined date from `createdAt` field

---

### 5. Admin Credits Page
**File:** `app/(admin)/admin/credits/page.tsx`

**Already uses centralized data!** ✅
- Uses `adminUsers`
- Uses `adminUserCredits`
- Uses `adminStats`

**No changes needed.**

---

### 6. Admin Moderation Page
**File:** `app/(admin)/admin/moderation/page.tsx`

**Replace:**
```typescript
const mockPrompts = [
  { id: 1, user: "Khairul Nizam", ... },
  // ... more prompts
];

const mockGenerations = [
  { id: 1, user: "Rina Wijaya", ... },
  // ... more generations
];
```

**With:**
```typescript
import { moderationPrompts, moderationImages } from "@/lib/mock-data";

// Use moderationPrompts for prompts tab
// Use moderationImages for images tab
```

**Changes needed:**
- Import `moderationPrompts`, `moderationImages`
- Replace `mockPrompts` with `moderationPrompts`
- Replace `mockGenerations` with `moderationImages`
- Update field mappings:
  - `user` → `userName`
  - `business` → `userBusiness`
  - `prompt` → `content`
  - `timestamp` → `timestamp`

---

### 7. Preview Page
**File:** `app/(user)/preview/[id]/page.tsx`

**Add:**
```typescript
import { getDesignById, userDesigns } from "@/lib/mock-data";

export default function PreviewPage({ params }: { params: { id: string } }) {
  // Get design by ID
  const design = getDesignById(params.id) || userDesigns[0];
  
  // Use design data
  const title = design?.title || "Design Preview";
  const packagingType = formatPackagingType(design?.packagingType);
  // ... etc
}
```

**Changes needed:**
- Import `getDesignById`, `userDesigns`, `formatPackagingType`
- Get design from params.id
- Fallback to first design if not found
- Display actual design data

---

### 8. Profile Page
**File:** `app/profile/page.tsx`

**Replace:**
```typescript
// Hardcoded values
Name: Khairul Nizam
Email: khairul@example.com
Business: Keripik Rumah Rasa
Credits: 40
```

**With:**
```typescript
import { currentUser, currentUserCredits } from "@/lib/mock-data";

// Use actual data
Name: {currentUser.name}
Email: {currentUser.email}
Business: {currentUser.businessName}
Credits: {currentUserCredits.balance}
Daily Quota: {currentUserCredits.dailyQuota}
```

**Changes needed:**
- Import `currentUser`, `currentUserCredits`
- Replace all hardcoded profile values
- Use `currentUser.name`, `currentUser.email`, etc.
- Use `currentUserCredits.balance`, `currentUserCredits.dailyQuota`

---

## 📝 Complete Integration Checklist

### High Priority
- [x] Dashboard page
- [x] History page
- [x] Gallery page
- [ ] Admin Users page
- [x] Admin Credits page (already done)
- [ ] Admin Moderation page

### Medium Priority
- [ ] Preview page
- [ ] Profile page

### Optional
- [ ] Generate page (can use templates)
- [ ] Settings page (if exists)

---

## 🔧 Common Patterns

### Pattern 1: Import Mock Data
```typescript
import {
  currentUser,
  currentUserCredits,
  userDesigns,
  galleryTemplates,
  adminUsers,
  formatPackagingType,
  getRelativeTime,
} from "@/lib/mock-data";
```

### Pattern 2: Replace Hardcoded Arrays
```typescript
// Before
const mockData = [{ id: 1, ... }, { id: 2, ... }];

// After
import { mockData } from "@/lib/mock-data";
```

### Pattern 3: Use Helper Functions
```typescript
// Format packaging type
formatPackagingType("STANDING_POUCH") // → "Standing Pouch"

// Get relative time
getRelativeTime("2024-03-18T14:30:00Z") // → "2 hours ago"

// Get design by ID
const design = getDesignById("design-1");

// Get user credits
const credits = getUserCredits("user-1");
```

### Pattern 4: Update Navbar
```typescript
// Before
<SiteNavbar variant="user" credits={40} user={{ initial: "K" }} />

// After
<SiteNavbar 
  variant="user" 
  credits={currentUserCredits.balance} 
  user={{ initial: currentUser.name.charAt(0) }} 
/>
```

---

## 🎯 Quick Wins

### Admin Users Page (5 minutes)
1. Add import: `import { adminUsers, adminUserCredits } from "@/lib/mock-data";`
2. Replace: `const [users, setUsers] = useState(mockUsers);` → `useState(adminUsers);`
3. Update types: `id: number` → `id: string`
4. Update status: `"active"` → `"ACTIVE"`, `"suspended"` → `"SUSPENDED"`

### Admin Moderation Page (5 minutes)
1. Add import: `import { moderationPrompts, moderationImages } from "@/lib/mock-data";`
2. Replace: `const [prompts, setPrompts] = useState(mockPrompts);` → `useState(moderationPrompts);`
3. Replace: `const [generations, setGenerations] = useState(mockGenerations);` → `useState(moderationImages);`
4. Update field names: `user` → `userName`, `business` → `userBusiness`, `prompt` → `content`

### Preview Page (3 minutes)
1. Add import: `import { getDesignById, userDesigns, formatPackagingType } from "@/lib/mock-data";`
2. Get design: `const design = getDesignById(params.id) || userDesigns[0];`
3. Use design data: `design.title`, `design.prompt`, etc.

### Profile Page (3 minutes)
1. Add import: `import { currentUser, currentUserCredits } from "@/lib/mock-data";`
2. Replace hardcoded values with `currentUser.name`, `currentUser.email`, etc.
3. Replace credit values with `currentUserCredits.balance`, `currentUserCredits.dailyQuota`

---

## ✅ Verification Steps

After updating each page:

1. **Check imports:**
   ```bash
   # Search for remaining hardcoded arrays
   grep -r "const mock" app/
   ```

2. **Run build:**
   ```bash
   npm run build
   ```

3. **Check TypeScript:**
   - No type errors
   - All imports resolve
   - No unused variables

4. **Test in browser:**
   - Page loads without errors
   - Data displays correctly
   - Actions work (UI-only)

---

## 🚀 Final Build Test

```bash
# Clean build
rm -rf .next
npm run build

# Expected output:
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

# No errors about:
- Missing imports
- Type mismatches
- Undefined variables
```

---

## 📊 Progress Tracker

**Completed:** 3/8 pages (37.5%)
**Remaining:** 5/8 pages (62.5%)

**Time estimate:**
- Admin Users: 5 min
- Admin Moderation: 5 min
- Preview: 3 min
- Profile: 3 min
- **Total:** ~16 minutes

---

## 🎓 Benefits After Completion

1. **Single Source of Truth**
   - All mock data in `lib/mock-data.ts`
   - Easy to update
   - Consistent across pages

2. **Type Safety**
   - TypeScript types defined
   - Autocomplete in IDE
   - Compile-time checks

3. **Easy Migration**
   ```typescript
   // Before (mock)
   import { userDesigns } from "@/lib/mock-data";
   
   // After (real API)
   import { getUserDesigns } from "@/lib/api";
   const userDesigns = await getUserDesigns(userId);
   ```

4. **Maintainability**
   - No scattered mock data
   - Helper functions for common operations
   - Consistent formatting

---

## 📌 Next Steps

1. Update Admin Users page (5 min)
2. Update Admin Moderation page (5 min)
3. Update Preview page (3 min)
4. Update Profile page (3 min)
5. Run `npm run build` to verify
6. Test all pages in browser
7. Done! 🎉
