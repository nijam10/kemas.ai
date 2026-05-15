# Kemas.ai Authentication Architecture

## Overview
Frontend-only authentication system with role-based access control (RBAC) for development. Will be replaced with real backend authentication (Google OAuth) in production.

---

## Actors

### 1. **USER**
- Regular UMKM business owners
- Can generate designs, view gallery, manage history
- Access to user dashboard and profile
- **Cannot** access admin panel

### 2. **ADMIN**
- System administrators
- Full access to user features
- Additional access to admin panel
- Can manage users, credits, and moderation

### 3. **Public Visitors** (Not a system actor)
- Unauthenticated visitors
- Can only view public pages (/, /about)
- Must login to access any features

---

## Route Protection

### Public Routes (No Authentication Required)
```
/ (Homepage)
/about
/login
```

### Protected User Routes (Requires USER or ADMIN)
```
/dashboard
/generate
/gallery
/history
/preview/*
/profile
/settings
```

**Behavior:**
- If unauthenticated → Redirect to `/login`
- If authenticated (USER or ADMIN) → Allow access

### Admin Routes (Requires ADMIN only)
```
/admin
/admin/users
/admin/credits
/admin/moderation
/admin/settings
```

**Behavior:**
- If unauthenticated → Redirect to `/login`
- If authenticated as USER → Redirect to `/dashboard`
- If authenticated as ADMIN → Allow access

---

## Authentication State

### Type Definition
```typescript
type Role = "USER" | "ADMIN";

interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  user: {
    id: string;
    name: string;
    email: string;
    businessName?: string;
  } | null;
}
```

### Storage
- **Location:** `localStorage` (key: `kemas_auth_state`)
- **Persistence:** Survives page refreshes
- **Cleared on:** Logout

---

## Implementation Files

### Core Auth Files

#### 1. `lib/auth.ts`
**Purpose:** Authentication utilities and state management

**Key Functions:**
- `getAuthState()` - Get current auth state from localStorage
- `setAuthState(state)` - Save auth state to localStorage
- `clearAuthState()` - Clear auth state (logout)
- `loginAsUser()` - Development login as USER
- `loginAsAdmin()` - Development login as ADMIN
- `logout()` - Clear auth and logout
- `isAuthenticated()` - Check if user is logged in
- `hasRole(role)` - Check if user has specific role
- `isAdmin()` - Check if user is admin
- `isUser()` - Check if user is regular user
- `getCurrentUser()` - Get current user object
- `getCurrentRole()` - Get current role

#### 2. `contexts/auth-context.tsx`
**Purpose:** React context provider for auth state

**Features:**
- Provides auth state to all components
- Handles route protection automatically
- Redirects based on authentication and role
- Exposes `useAuth()` hook for components

**Context API:**
```typescript
interface AuthContextType extends AuthState {
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  isLoading: boolean;
}
```

**Usage:**
```typescript
import { useAuth } from "@/contexts/auth-context";

function MyComponent() {
  const { isAuthenticated, role, user, logout } = useAuth();
  // ...
}
```

#### 3. `components/layout/auth-navbar.tsx`
**Purpose:** Authentication-aware navigation bar

**Features:**
- Shows different navigation based on auth state
- Public navbar: Home, About, Login
- Authenticated navbar: Generate, Gallery, History, About, Credits, Avatar
- Admin users see additional "Admin Panel" in dropdown
- Handles logout
- Responsive mobile menu

---

## Login Page

### Development Mode
**File:** `app/(auth)/login/page.tsx`

**Features:**
- Two development buttons:
  - **Continue as User** → Sets role to USER, redirects to `/dashboard`
  - **Continue as Admin** → Sets role to ADMIN, redirects to `/admin`
- No password required (development only)
- Notice indicating development mode

### Production (Future)
- Replace development buttons with Google OAuth
- First login automatically creates account
- No separate sign-up page needed

---

## Navbar Behavior

### Before Login (Public)
**Shows:**
- Home
- About
- Login (button)

**Hides:**
- Generate
- Gallery
- History
- Credits
- Avatar dropdown

### After Login as USER
**Shows:**
- Generate
- Gallery
- History
- About
- Credits badge
- Avatar dropdown with:
  - Dashboard
  - Profile
  - Logout

### After Login as ADMIN
**Shows:**
- Generate
- Gallery
- History
- About
- Credits badge
- Avatar dropdown with:
  - Dashboard
  - Profile
  - **Admin Panel** ← Additional item
  - Logout

---

## Route Protection Logic

### Implementation
Located in `contexts/auth-context.tsx` → `useEffect` hook

```typescript
// Pseudo-code
if (!isAuthenticated && !isPublicRoute) {
  redirect("/login");
}

if (isAuthenticated && role === "USER" && isAdminRoute) {
  redirect("/dashboard");
}

if (isAuthenticated && pathname === "/login") {
  redirect(role === "ADMIN" ? "/admin" : "/dashboard");
}
```

### Public Routes Check
```typescript
const PUBLIC_ROUTES = ["/", "/about", "/login"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}
```

### Admin Routes Check
```typescript
function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}
```

---

## Development Users

### User Account
```typescript
{
  id: "user-1",
  name: "Khairul Nizam",
  email: "khairul@keripik.com",
  businessName: "Keripik Rumah Rasa",
  role: "USER"
}
```

### Admin Account
```typescript
{
  id: "admin-1",
  name: "Admin Kemas",
  email: "admin@kemas.ai",
  role: "ADMIN"
}
```

---

## Testing Checklist

### ✅ Public Routes
- [ ] `/` accessible without login
- [ ] `/about` accessible without login
- [ ] `/login` accessible without login

### ✅ Protected Routes (Unauthenticated)
- [ ] `/generate` redirects to `/login`
- [ ] `/gallery` redirects to `/login`
- [ ] `/history` redirects to `/login`
- [ ] `/preview/mock` redirects to `/login`
- [ ] `/dashboard` redirects to `/login`
- [ ] `/profile` redirects to `/login`
- [ ] `/admin` redirects to `/login`

### ✅ Protected Routes (USER)
- [ ] USER can access `/dashboard`
- [ ] USER can access `/generate`
- [ ] USER can access `/gallery`
- [ ] USER can access `/history`
- [ ] USER can access `/preview/*`
- [ ] USER can access `/profile`
- [ ] USER **cannot** access `/admin` (redirects to `/dashboard`)

### ✅ Admin Routes (ADMIN)
- [ ] ADMIN can access `/admin`
- [ ] ADMIN can access `/admin/users`
- [ ] ADMIN can access `/admin/credits`
- [ ] ADMIN can access `/admin/moderation`
- [ ] ADMIN can access all USER routes

### ✅ Navbar Behavior
- [ ] Public navbar shows: Home, About, Login
- [ ] Public navbar hides: Generate, Gallery, History, Credits, Avatar
- [ ] USER navbar shows: Generate, Gallery, History, About, Credits, Avatar
- [ ] USER dropdown shows: Dashboard, Profile, Logout
- [ ] ADMIN dropdown shows: Dashboard, Profile, **Admin Panel**, Logout

### ✅ Login Flow
- [ ] "Continue as User" logs in as USER and redirects to `/dashboard`
- [ ] "Continue as Admin" logs in as ADMIN and redirects to `/admin`
- [ ] Logout clears auth state and redirects to `/login`
- [ ] Auth state persists across page refreshes

---

## Migration to Production

### Steps to Replace with Real Auth

1. **Replace `lib/auth.ts`:**
   - Remove `loginAsUser()` and `loginAsAdmin()`
   - Add Google OAuth integration
   - Add JWT token management
   - Add API calls for auth endpoints

2. **Update `contexts/auth-context.tsx`:**
   - Replace development login functions with OAuth flow
   - Add token refresh logic
   - Add session management

3. **Update Login Page:**
   - Remove development buttons
   - Add Google Sign-In button
   - Add OAuth callback handling

4. **Add Backend Integration:**
   - Create `/api/auth/google` endpoint
   - Create `/api/auth/callback` endpoint
   - Create `/api/auth/me` endpoint for user info
   - Create `/api/auth/logout` endpoint

5. **Add Middleware:**
   - Server-side route protection
   - JWT verification
   - Role-based access control

6. **Update Storage:**
   - Replace localStorage with secure httpOnly cookies
   - Add CSRF protection
   - Add XSS protection

---

## Security Considerations

### Current (Development)
- ⚠️ No password required
- ⚠️ Auth state in localStorage (not secure)
- ⚠️ No token expiration
- ⚠️ No session management
- ⚠️ Client-side only protection

### Production Requirements
- ✅ Google OAuth for authentication
- ✅ JWT tokens with expiration
- ✅ Secure httpOnly cookies
- ✅ Server-side route protection
- ✅ CSRF protection
- ✅ XSS protection
- ✅ Rate limiting
- ✅ Session management

---

## File Structure

```
lib/
  auth.ts                    # Auth utilities

contexts/
  auth-context.tsx           # Auth context provider

components/
  layout/
    auth-navbar.tsx          # Auth-aware navbar

app/
  layout.tsx                 # Root layout with AuthProvider
  (auth)/
    login/
      page.tsx               # Login page with dev buttons
  logout/
    page.tsx                 # Logout page
  (user)/                    # Protected user routes
    dashboard/
    generate/
    gallery/
    history/
    preview/
    settings/
  (admin)/                   # Protected admin routes
    admin/
      users/
      credits/
      moderation/
      settings/
```

---

## Common Issues & Solutions

### Issue: Infinite redirect loop
**Cause:** Route protection logic conflict
**Solution:** Check `isPublicRoute()` and `isAdminRoute()` logic in auth context

### Issue: Auth state not persisting
**Cause:** localStorage not being set
**Solution:** Verify `setAuthState()` is called after login

### Issue: User can access admin routes
**Cause:** Role check not working
**Solution:** Verify `role === "ADMIN"` check in route protection

### Issue: Navbar not updating after login
**Cause:** Auth context not re-rendering
**Solution:** Ensure `AuthProvider` wraps entire app in root layout

---

## Status

**Current:** ✅ Fully implemented with development auth  
**Build:** ✅ Successful compilation  
**Testing:** ⏳ Ready for manual testing  
**Production:** ⏳ Awaiting Google OAuth integration

---

**Last Updated:** May 14, 2026  
**Version:** 1.0.0 (Development)  
**Next Steps:** Manual testing of all routes and flows
