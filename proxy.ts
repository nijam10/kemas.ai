/**
 * Kemas.ai — Next.js Proxy (Middleware)
 *
 * Runs on the Edge runtime. Reads the Auth.js JWT cookie to protect routes.
 *
 * IMPORTANT: We do NOT import from @/auth here because that pulls in the
 * Prisma adapter (@prisma/adapter-pg / pg) which cannot run on the Edge.
 * Instead we use NextAuth's built-in JWT verification directly.
 *
 * Route rules:
 *   Public:    /  /about  /login  /forgot-password  /api/auth/*
 *   Protected: everything else → redirect to /login if unauthenticated
 *   Admin:     /admin/*  → redirect to /dashboard if role !== ADMIN
 *   Login:     redirect authenticated users to their dashboard
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = new Set(["/", "/about", "/login", "/forgot-password"]);

const ALWAYS_ALLOWED_PREFIXES = [
  "/api/auth",
  "/_next",
  "/favicon.ico",
];

function isPublic(pathname: string): boolean {
  if (ALWAYS_ALLOWED_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return PUBLIC_PATHS.has(pathname);
}

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Always allow public paths and static assets
  if (isPublic(pathname)) {
    // Redirect already-authenticated users away from /login
    if (pathname === "/login") {
      const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET,
      });
      if (token) {
        const dest = token.role === "ADMIN" ? "/admin" : "/dashboard";
        return NextResponse.redirect(new URL(dest, req.nextUrl));
      }
    }
    return NextResponse.next();
  }

  // Read JWT token from cookie (Edge-safe — no DB call)
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // USER trying to access admin route → redirect to dashboard
  if (isAdminRoute(pathname) && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - image files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
