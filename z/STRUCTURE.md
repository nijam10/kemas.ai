# Kemas.ai Project Structure

This document explains the clean architecture implemented for Kemas.ai.

## 📁 Directory Structure

```
kemas.ai/
├── app/                          # Next.js 14 App Router
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Landing page
│   │   └── layout.tsx            # Marketing layout
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── layout.tsx            # Auth layout (centered)
│   ├── (user)/                   # User dashboard pages
│   │   ├── dashboard/            # User dashboard
│   │   ├── generate/             # AI generation interface
│   │   ├── preview/              # 3D preview page
│   │   ├── history/              # Design history gallery
│   │   ├── settings/             # User settings & billing
│   │   └── layout.tsx            # User dashboard layout
│   ├── (admin)/                  # Admin panel pages
│   │   ├── admin/
│   │   │   ├── page.tsx          # Admin dashboard
│   │   │   ├── users/            # User management
│   │   │   ├── credits/          # Credit management
│   │   │   ├── moderation/       # Content moderation
│   │   │   └── settings/         # System settings
│   │   └── layout.tsx            # Admin layout
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── credits/              # Credit management endpoints
│   │   ├── generation/           # AI generation endpoints
│   │   ├── designs/              # Design CRUD endpoints
│   │   └── admin/                # Admin endpoints
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Root redirect
│
├── features/                     # Feature-based modules
│   ├── auth/
│   │   ├── components/           # Auth-specific components
│   │   ├── hooks/                # Auth hooks (useAuth, useLogin)
│   │   ├── services/             # Auth client services
│   │   └── types.ts              # Auth types
│   ├── billing/
│   │   ├── components/           # Billing components
│   │   ├── hooks/                # Billing hooks
│   │   ├── services/             # Billing client services
│   │   └── types.ts              # Billing types
│   ├── generation/
│   │   ├── components/           # Generation UI components
│   │   ├── hooks/                # Generation hooks
│   │   ├── services/             # Generation client services
│   │   └── types.ts              # Generation types
│   ├── preview-3d/
│   │   ├── components/           # 3D preview components
│   │   ├── hooks/                # Preview hooks
│   │   ├── services/             # Preview services
│   │   └── types.ts              # Preview types
│   ├── history/
│   │   ├── components/           # History components
│   │   ├── hooks/                # History hooks
│   │   ├── services/             # History services
│   │   └── types.ts              # History types
│   └── admin/
│       ├── components/           # Admin components
│       ├── hooks/                # Admin hooks
│       ├── services/             # Admin client services
│       └── types.ts              # Admin types
│
├── components/                   # Shared UI components
│   └── ui/
│       ├── layout/               # Layout components
│       │   ├── marketing/        # Marketing navbar, footer
│       │   ├── dashboard/        # Dashboard sidebar, header
│       │   ├── generation/       # Generation layout
│       │   ├── preview/          # Preview layout
│       │   ├── history/          # History layout
│       │   └── admin/            # Admin layout
│       └── shared/               # Shared UI primitives
│
├── server/                       # Server-side code
│   ├── services/                 # Business logic services
│   │   ├── auth.service.ts       # Authentication logic
│   │   ├── credit.service.ts     # Credit management
│   │   ├── generation.service.ts # AI generation logic
│   │   ├── runpod.service.ts     # RunPod API client
│   │   ├── upload.service.ts     # File upload handling
│   │   └── admin.service.ts      # Admin operations
│   ├── repositories/             # Database access layer
│   │   ├── user.repository.ts    # User CRUD
│   │   ├── credit.repository.ts  # Credit CRUD
│   │   ├── design.repository.ts  # Design CRUD
│   │   └── prompt.repository.ts  # Prompt moderation
│   └── middleware/               # Server middleware
│       ├── require-auth.ts       # Auth middleware
│       ├── require-admin.ts      # Admin middleware
│       └── rate-limit.ts         # Rate limiting
│
├── lib/                          # Shared utilities
│   ├── auth.ts                   # Auth utilities
│   ├── db.ts                     # Database client (Prisma)
│   ├── env.ts                    # Environment config
│   ├── runpod.ts                 # RunPod client
│   ├── validators.ts             # Input validation
│   ├── constants.ts              # App constants
│   └── utils.ts                  # General utilities
│
├── types/                        # TypeScript types
│   ├── auth.ts                   # Auth types
│   ├── user.ts                   # User types
│   ├── credit.ts                 # Credit types
│   ├── design.ts                 # Design types
│   ├── generation.ts             # Generation types
│   ├── admin.ts                  # Admin types
│   └── api.ts                    # API response types
│
├── config/                       # Configuration files
│   ├── site.ts                   # Site metadata
│   ├── navigation.ts             # Navigation config
│   ├── admin-navigation.ts       # Admin nav config
│   ├── dashboard.ts              # Dashboard config
│   └── design-system.ts          # Design tokens
│
├── hooks/                        # Global React hooks
│   ├── use-mobile.ts             # Mobile detection
│   └── use-toast.ts              # Toast notifications
│
├── store/                        # Client state management
│   ├── auth-store.ts             # Auth state
│   ├── generation-store.ts       # Generation state
│   └── preview-store.ts          # Preview state
│
├── providers/                    # React context providers
│   ├── app-provider.tsx          # Main app provider
│   ├── query-provider.tsx        # React Query provider
│   └── theme-provider.tsx        # Theme provider
│
├── styles/                       # Global styles
│   └── globals.css               # Tailwind + custom styles
│
└── public/                       # Static assets
    └── images/
        ├── mockups/              # 3D mockup images
        └── logos/                # User logos
```

## 🎯 Architecture Principles

### 1. **Route Groups for Separation**
- `(marketing)` - Public pages, SEO-optimized
- `(auth)` - Authentication flows
- `(user)` - User dashboard, requires auth
- `(admin)` - Admin panel, requires admin role

### 2. **Feature-Based Organization**
Each feature module contains:
- `components/` - Feature-specific UI
- `hooks/` - Feature-specific React hooks
- `services/` - Client-side API calls
- `types.ts` - Feature type definitions

### 3. **Server-Side Separation**
- `services/` - Business logic
- `repositories/` - Database operations
- `middleware/` - Request processing

### 4. **Shared Resources**
- `components/ui/` - Reusable UI components
- `lib/` - Utility functions
- `types/` - Global type definitions
- `config/` - Configuration files

## 🔄 Data Flow

```
User Action
    ↓
Feature Component
    ↓
Feature Hook (useGeneration)
    ↓
Feature Service (generationService)
    ↓
API Route (/api/generation/generate)
    ↓
Server Service (GenerationService)
    ↓
Repository (DesignRepository)
    ↓
Database (Prisma)
```

## 🚀 Next Steps

1. **Database Setup**
   - Install Prisma
   - Define schema for users, designs, credits
   - Run migrations

2. **Authentication**
   - Implement NextAuth.js or custom JWT
   - Add password hashing with bcrypt
   - Implement session management

3. **Credit System**
   - Implement credit balance tracking
   - Add transaction logging
   - Integrate payment gateway

4. **AI Generation**
   - Set up RunPod API integration
   - Implement FLUX.1 + LoRA inference
   - Add image compositing with Pillow

5. **3D Preview**
   - Integrate Three.js
   - Create 3D mockup models
   - Implement 360° rotation

6. **File Upload**
   - Set up storage (S3, Cloudinary)
   - Implement logo upload
   - Add background removal

7. **Admin Panel**
   - Build user management UI
   - Implement content moderation
   - Add analytics dashboard

## 📝 Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserProfile`)
- **Types**: PascalCase (`UserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

## 🎨 Design System

Colors and design tokens are defined in:
- `config/design-system.ts` - Design tokens
- `styles/globals.css` - CSS variables and utilities

## 🔐 Security Considerations

- All user routes require authentication
- Admin routes require admin role
- Rate limiting on API endpoints
- Input validation on all forms
- Secure file upload handling
- SQL injection prevention (Prisma)
- XSS prevention (React escaping)

## 📦 Dependencies to Add

```bash
# Database
npm install @prisma/client
npm install -D prisma

# Authentication
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# State Management
npm install zustand

# API Client
npm install @tanstack/react-query axios

# 3D Graphics
npm install three @react-three/fiber @react-three/drei

# Image Processing
npm install sharp

# Validation
npm install zod

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install sonner # Toast notifications
```

## 🧪 Testing Structure (Future)

```
__tests__/
├── unit/
│   ├── services/
│   ├── repositories/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

---

**Built with ❤️ for Indonesian UMKM**
