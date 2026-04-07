/**
 * CSRF protection using the double-submit cookie pattern.
 * A CSRF token is stored in a cookie and must be sent back as a header
 * on every mutating request (POST, PUT, PATCH, DELETE).
 */
import { cookies } from 'next/headers';

const CSRF_COOKIE = 'medicoplace_csrf';
const CSRF_HEADER = 'x-csrf-token';

/** Generate a cryptographically secure CSRF token */
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Set or refresh the CSRF cookie and return the token */
export async function ensureCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CSRF_COOKIE)?.value;
  if (existing) return existing;

  const token = generateToken();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false, // Must be readable by JS to include in headers
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });
  return token;
}

/** Validate that the CSRF header matches the cookie */
export async function validateCsrf(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) return false;

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) return false;
  let result = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  return result === 0;
}
