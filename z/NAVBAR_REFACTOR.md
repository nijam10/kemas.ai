# Navbar Refactor - Single Reusable Component

## Overview
Refactored all navbar implementations into one reusable `SiteNavbar` component that adapts based on user state (public vs logged-in).

## Problem Solved

### Before
- Multiple navbar implementations:
  - `site-navbar.tsx` (landing page)
  - `generate-navbar.tsx` (user pages)
- Duplicate code
- Inconsistent styling
- Hard to maintain

### After
- **ONE** navbar component: `components/layout/site-navbar.tsx`
- Used across all pages
- Consistent styling
- Easy to maintain

## Component API

### Props Interface
```typescript
interface User {
  name?: string;
  image?: string;
  initial?: string;
}

interface SiteNavbarProps {
  variant?: "public" | "user";
  credits?: number;
  user?: User;
}
```

### Defaults
- `variant = "public"`
- `credits = 40`
- `user = { initial: "U" }`

## Navbar States

### 1. Public / Guest State
**Used on:** Landing page, marketing pages

**Shows:**
- **Left:** Kemas.ai wordmark
- **Center:** Home, Generate, Gallery
- **Right:** Login button

**Does NOT show:**
- Credits
- User avatar
- History link

**Usage:**
```tsx
<SiteNavbar variant="public" />
```

### 2. Logged-in / User State
**Used on:** Generate, Gallery, History pages

**Shows:**
- **Left:** Kemas.ai wordmark
- **Center:** Generate, Gallery, History
- **Right:** Credit badge + User avatar

**Does NOT show:**
- Login button
- Home link

**Usage:**
```tsx
<SiteNavbar variant="user" credits={40} user={{ initial: "U" }} />
```

## Navigation Items

### Public Variant
1. **Home** → `/`
2. **Generate** → `/generate`
3. **Gallery** → `/gallery`

### User Variant
1. **Generate** → `/generate`
2. **Gallery** → `/gallery`
3. **History** → `/history`

## Active Route Highlighting

Uses `usePathname()` to detect current route and highlights active nav item with:
- Orange text color (#F97316)
- Orange background (10% opacity)
- Rounded pill shape

## Visual Design

### Wordmark
- "Kemas" in near black (#1A1A1A)
- ".ai" in orange (#F97316)
- Bold, tracking-tight
- Consistent across all pages

### Navigation
- Clean centered layout
- Rounded active pill
- Smooth hover transitions
- Professional spacing

### Right Side Elements

**Public:**
- Simple "Login" text link
- Hover effect

**User:**
- **Credit Badge:**
  - Gold background (#FACC15/10)
  - Gold border (#FACC15/20)
  - CreditCard icon
  - "40 credits" text
  - Rounded full pill

- **User Avatar:**
  - Circular (w-9 h-9)
  - Gradient background (orange to gold)
  - Shows user initial or image
  - Hover shadow effect

### Background
- Warm cream (#FCFBF7/80)
- Backdrop blur
- Subtle border bottom
- Sticky positioning

## Responsive Design

### Desktop
- Full horizontal layout
- Center navigation visible
- All elements displayed

### Mobile
- Hamburger menu button
- Animated slide-down menu
- Stacked navigation items
- Credits and avatar in mobile menu (user variant)
- Login button in mobile menu (public variant)

### Mobile Menu Features
- Smooth AnimatePresence transitions
- Click outside to close
- Active route highlighting
- Proper spacing and borders

## Implementation Details

### File Updates

**Modified:**
1. `components/layout/site-navbar.tsx`
   - Complete refactor
   - Added variant prop
   - Added credits and user props
   - Conditional navigation items
   - Conditional right-side elements

**Updated to use SiteNavbar:**
1. `app/page.tsx` → `<SiteNavbar variant="public" />`
2. `app/(user)/generate/page.tsx` → `<SiteNavbar variant="user" credits={credits} user={{ initial: "U" }} />`
3. `app/(user)/gallery/page.tsx` → `<SiteNavbar variant="user" credits={40} user={{ initial: "U" }} />`
4. `app/(user)/history/page.tsx` → `<SiteNavbar variant="user" credits={40} user={{ initial: "U" }} />`

**Deprecated (can be removed):**
1. `components/generation/generate-navbar.tsx` - No longer needed

### Dynamic Credits
In Generate page, credits are managed in state and passed to navbar:
```typescript
const [credits, setCredits] = useState(40);

// After generation
setCredits((prev) => prev - 10);

// Pass to navbar
<SiteNavbar variant="user" credits={credits} user={{ initial: "U" }} />
```

## Features

### Scroll Behavior
- Transparent on landing page (public variant)
- Adds backdrop blur on scroll
- Always has backdrop blur on user pages

### Active State
- Automatically detects current route
- Highlights active navigation item
- Works on both desktop and mobile

### User Avatar
- Supports image URL
- Falls back to initial
- Falls back to first letter of name
- Gradient background if no image

### Mobile Menu
- Smooth animations
- Proper z-index layering
- Closes on navigation
- Accessible button states

## Design System Compliance

### Colors
✅ Warm cream background: `#FCFBF7`
✅ Near black text: `#1A1A1A`
✅ Orange accent: `#F97316`
✅ Gold accent: `#FACC15`
✅ Border: `#E5E4E0`
✅ Gray text: `#737373`

### Typography
- Consistent font weights
- Proper hierarchy
- Readable sizes
- Professional spacing

### Icons
- CreditCard (credits badge)
- Menu, X (mobile menu)
- Lucide React icons

## Benefits

### For Development
- Single source of truth
- Easy to update
- Consistent behavior
- Type-safe props
- Reusable across all pages

### For Users
- Consistent navigation experience
- Clear visual hierarchy
- Smooth transitions
- Responsive on all devices
- Intuitive state changes

### For Maintenance
- One file to update
- No duplicate code
- Easy to add features
- Clear prop interface
- Well-documented

## Future Enhancements

### User Menu
- Dropdown on avatar click
- Profile settings
- Logout option
- Account management

### Credits
- Click to view credit history
- Purchase more credits
- Credit usage analytics

### Notifications
- Bell icon for notifications
- Unread count badge
- Notification dropdown

### Search
- Global search bar
- Quick navigation
- Template search

## Quality Checklist

✅ Only one navbar component exists
✅ Landing page uses public navbar
✅ Generate page uses user navbar state
✅ Gallery page uses user navbar state
✅ History page uses user navbar state
✅ Guest navbar has Login only
✅ User navbar has credits + avatar only
✅ No duplicate navbar code remains
✅ Navbar styling consistent across pages
✅ TypeScript has no errors
✅ Active route highlighting works
✅ Mobile menu works properly
✅ Responsive design works
✅ Smooth animations
✅ Professional appearance

## Migration Guide

### For New Pages

**Public Page:**
```tsx
import SiteNavbar from "@/components/layout/site-navbar";

export default function MyPublicPage() {
  return (
    <div>
      <SiteNavbar variant="public" />
      {/* page content */}
    </div>
  );
}
```

**User Page:**
```tsx
import SiteNavbar from "@/components/layout/site-navbar";

export default function MyUserPage() {
  const [credits, setCredits] = useState(40);
  
  return (
    <div>
      <SiteNavbar 
        variant="user" 
        credits={credits} 
        user={{ initial: "U" }} 
      />
      {/* page content */}
    </div>
  );
}
```

### With Real User Data
```tsx
<SiteNavbar 
  variant="user" 
  credits={user.credits} 
  user={{ 
    name: user.name,
    image: user.avatar,
    initial: user.name.charAt(0)
  }} 
/>
```

## Result

A single, reusable navbar component that:
- Adapts to user state automatically
- Maintains consistent design across all pages
- Reduces code duplication
- Simplifies maintenance
- Provides excellent user experience
- Ready for future enhancements
