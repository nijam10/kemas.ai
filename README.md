# Kemas.ai - AI Packaging Design for Indonesian UMKM

> Generate stunning, market-ready packaging designs in seconds with AI-powered automation.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **3D Graphics**: Three.js (planned)
- **AI Model**: FLUX.1 + LoRA via RunPod Serverless
- **Database**: Prisma ORM (to be configured)
- **Authentication**: NextAuth.js (to be configured)

## 📁 Project Structure

This project follows a **clean, feature-based architecture** optimized for scalability:

```
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Public landing pages
│   ├── (auth)/            # Login, register, forgot password
│   ├── (user)/            # User dashboard, generate, history
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes
├── features/              # Feature modules (auth, generation, etc.)
├── components/            # Shared UI components
├── server/                # Server-side services & repositories
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript type definitions
├── config/                # Configuration files
└── styles/                # Global styles
```

See [STRUCTURE.md](./STRUCTURE.md) for detailed architecture documentation.

## 🎯 Features

### For Users
- ✨ AI-powered packaging design generation
- 🎨 Multiple packaging types (Pouch, Box, Bottle, etc.)
- 📤 Logo upload and smart compositing
- 🔄 3D preview with 360° rotation
- 📚 Design history gallery
- 💳 Credit-based billing system

### For Admins
- 👥 User management (ban, suspend, credit adjustment)
- 🛡️ Content moderation (prompts & designs)
- 📊 Analytics dashboard
- ⚙️ System settings

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kemas.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Random secret for auth
   - `RUNPOD_API_KEY` - RunPod API key
   - `RUNPOD_ENDPOINT` - RunPod endpoint URL

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Development Roadmap

### Phase 1: Foundation ✅
- [x] Clean project structure
- [x] Route organization
- [x] Type definitions
- [x] Configuration files
- [x] Placeholder pages

### Phase 2: Authentication (Next)
- [ ] Set up Prisma with PostgreSQL
- [ ] Implement NextAuth.js
- [ ] User registration with email
- [ ] Login/logout functionality
- [ ] Password hashing with bcrypt
- [ ] Role-based access control (USER/ADMIN)

### Phase 3: Credit System
- [ ] Credit balance tracking
- [ ] Transaction logging
- [ ] Payment gateway integration
- [ ] Admin credit management

### Phase 4: AI Generation
- [ ] RunPod API integration
- [ ] FLUX.1 + LoRA inference
- [ ] Logo upload handling
- [ ] Image compositing with Pillow
- [ ] Background removal
- [ ] Generation queue system

### Phase 5: 3D Preview
- [ ] Three.js integration
- [ ] 3D mockup models
- [ ] 360° rotation controls
- [ ] High-resolution export

### Phase 6: History & Gallery
- [ ] Design history storage
- [ ] Gallery view with filters
- [ ] Re-download without credit cost
- [ ] Design sharing (optional)

### Phase 7: Admin Panel
- [ ] User management UI
- [ ] Content moderation queue
- [ ] Analytics dashboard
- [ ] System configuration

### Phase 8: Production
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Deployment (Vercel)

## 🎨 Design System

Kemas.ai uses an **Editorial Warm Cream** aesthetic:

- **Primary**: `#F97316` (Orange)
- **Accent**: `#FACC15` (Gold)
- **Background**: `#FCFBF7` (Warm Cream)
- **Text**: `#1A1A1A` (Near Black)
- **Muted**: `#737373` (Gray)

## 🔐 Security

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS prevention (React)

## 📦 Key Dependencies to Add

```bash
# Database & ORM
npm install @prisma/client
npm install -D prisma

# Authentication
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query axios

# 3D Graphics
npm install three @react-three/fiber @react-three/drei

# Image Processing
npm install sharp

# Validation
npm install zod

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install sonner
```

## 🤝 Contributing

This is a private project for Indonesian UMKM. Contributions are welcome from team members.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- FLUX.1 model by Black Forest Labs
- Indonesian UMKM community
- Next.js team for the amazing framework

---

**Built with ❤️ for Indonesian UMKM**
