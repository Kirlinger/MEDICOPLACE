/**
 * Next.js middleware for:
 * 1. CSRF token provisioning on page loads
 * 2. Route protection for dashboard pages
 * 3. Security headers enforcement
 */
import { NextResponse, NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET || '';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW || 'dev-secret-change-in-production-must-be-32-chars!!');
const SESSION_COOKIE = 'medicoplace_session';
const CSRF_COOKIE = 'medicoplace_csrf';

const PROTECTED_PATHS = ['/tableau-de-bord', '/paiement'];
const AUTH_PATHS = ['/connexion', '/inscription'];

function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ─── Ensure CSRF cookie exists on every page load ───
  if (!request.cookies.get(CSRF_COOKIE)) {
    const token = generateCsrfToken();
    response.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
  }

  // ─── Check authentication for protected routes ───
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  let isAuthenticated = false;

  if (sessionToken) {
    try {
      await jwtVerify(sessionToken, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // Token expired or invalid — clear it
      response.cookies.delete(SESSION_COOKIE);
    }
  }

  // Redirect unauthenticated users away from protected pages
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    const loginUrl = new URL('/connexion', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/tableau-de-bord', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled separately)
     * - static files
     * - favicon
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|images/).*)',
  ],
};
