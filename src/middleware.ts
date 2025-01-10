// import { authService } from '@/services/auth.service';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';


// // Define route configurations
// const ROUTES = {
//   public: ['/auth/login', '/auth/register', '/auth/forgot-password'],
//   protected: ['/dashboard', '/dashboard/profile', '/dashboard/settings', '/dashboard/orders']
// } as const;

// // Token validation function
// async function validateToken(token: string): Promise<boolean> {
//   try {
//     // Use your existing backend token verification
//     await authService.verifyAccessToken(token);
//     return true;
//   } catch (error) {
//     // Log in development
//     if (process.env.NODE_ENV === 'development') {
//       console.error('Token Validation Error:', error);
//     }
//     return false;
//   }
// }

// export async function middleware(request: NextRequest) {
//   // Extract the path and token
//   const path = request.nextUrl.pathname;
//   const accessToken = request.cookies.get('accessToken')?.value;

//   // Logging for debugging (remove in production)
//   console.log('Middleware Details', {
//     path,
//     hasToken: !!accessToken,
//   });

//   // Check if current path matches route type
//   const isPublicRoute = ROUTES.public.some(route =>
//     path === route || path.startsWith(`${route}/`)
//   );

//   const isProtectedRoute = ROUTES.protected.some(route =>
//     path === route || path.startsWith(`${route}/`)
//   );

//   // Validate token
//   const isTokenValid = accessToken ? await validateToken(accessToken) : false;

//   // Handle public routes (auth pages)
//   if (isPublicRoute) {
//     if (isTokenValid) {
//       console.log('Redirecting from public route to dashboard');
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
//     return NextResponse.next();
//   }

//   // Handle protected routes (dashboard pages)
//   if (isProtectedRoute) {
//     if (!isTokenValid) {
//       console.log('Redirecting from protected route to login');
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     // Match all public and protected routes
//     '/auth/:path*',
//     '/dashboard/:path*'
//   ]
// };


// import { authService } from '@/services/auth.service';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// const ROUTES = {
//   public: ['/auth/login', '/auth/register', '/auth/forgot-password'],
//   protected: ['/dashboard', '/dashboard/profile', '/dashboard/settings', '/dashboard/orders']
// } as const;

// async function validateToken(token: string): Promise<boolean> {
//   try {
//     const response =await authService.verifyAccessToken(token);
//     console.log('Token is valid',response);
//     return true;
//   } catch (error) {
//     if (process.env.NODE_ENV === 'development') {
//       console.error('Token Validation Error:', error);
//     }
//     return false;
//   }
// }

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
//   console.log("request",request.headers);

//   // Get token from Authorization header
//   const authHeader = request.headers.get('Authorization');
//   const accessToken = authHeader?.replace('Bearer ', '');
//   console.log('Access Token',accessToken);

//   if (process.env.NODE_ENV === 'development') {
//     console.log('Middleware Details', {
//       path,
//       hasToken: !!accessToken,
//     });
//   }

//   const isPublicRoute = ROUTES.public.some(route =>
//     path === route || path.startsWith(`${route}/`)
//   );

//   const isProtectedRoute = ROUTES.protected.some(route =>
//     path === route || path.startsWith(`${route}/`)
//   );

//   const isTokenValid = accessToken ? await validateToken(accessToken) : false;

//   // Handle public routes (auth pages)
//   if (isPublicRoute) {
//     if (isTokenValid) {
//       return NextResponse.redirect(new URL('/dashboard', request.url));
//     }
//     return NextResponse.next();
//   }

//   // Handle protected routes (dashboard pages)
//   if (isProtectedRoute) {
//     if (!isTokenValid) {
//       return NextResponse.redirect(new URL('/auth/login', request.url));
//     }
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/auth/:path*',
//     '/dashboard/:path*'
//   ]
// };

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