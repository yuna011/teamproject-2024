// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to check authentication
export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token');

    // If there is no token and the user is not on the auth page, redirect to /auth
    if (!token && !request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // If token is present or user is on /auth, continue to the next step
    return NextResponse.next();
}

// Configure the matcher to specify which paths to apply the middleware to
export const config = {
    matcher: ['/((?!auth|_next/static|favicon.ico).*)'], // Apply middleware to all paths except /auth, static files, and favicon
};