
// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const PROTECTED_PATHS = ['/dashboard', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's a public path
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

  // Check if it's a protected path
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  

  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;

  // If trying to access public path while logged in
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected path while logged out
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ]
};