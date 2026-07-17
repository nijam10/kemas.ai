import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Use getToken directly which is Edge compatible
  let isLoggedIn = !!(await getToken({ req, secret: process.env.AUTH_SECRET }));
  
  // Allow E2E tests to bypass JWT verification via header
  if (process.env.NODE_ENV !== 'production' && req.headers.has('x-e2e-session')) {
    isLoggedIn = req.headers.get('x-e2e-session') === 'true';
  }
  
  const pathname = req.nextUrl.pathname;
  
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/generate') || 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/history') ||
    pathname.startsWith('/gallery');
  
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
