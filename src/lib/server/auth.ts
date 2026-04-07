/**
 * Server-side authentication utilities.
 * Handles password hashing, JWT creation/verification, and session management.
 *
 * JWT tokens include user profile data (firstName, lastName, email, phone)
 * so that /api/auth/me can return user info even when the database or
 * in-memory store is not available (e.g. serverless cold starts on Vercel
 * without Supabase). This is safe because the token is signed and httpOnly.
 */
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SALT_ROUNDS = 12;
const JWT_SECRET_RAW = process.env.JWT_SECRET || '';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW || 'dev-secret-change-in-production-must-be-32-chars!!');

/** Call at request time to enforce production secret configuration */
export function assertProductionSecrets(): void {
  if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production');
  }
}
const SESSION_COOKIE = 'medicoplace_session';
const SESSION_MAX_AGE = 30 * 60; // 30 minutes in seconds

/** User profile data embedded in the JWT for session resilience */
export interface SessionUser {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** Hash a plaintext password using bcrypt */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Verify a plaintext password against a bcrypt hash */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a signed JWT token for a user session with embedded profile data */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    userId: user.userId,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

/** Verify and decode a JWT session token */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      role: (payload.role as string) || 'user',
      firstName: (payload.firstName as string) || '',
      lastName: (payload.lastName as string) || '',
      email: (payload.email as string) || '',
      phone: (payload.phone as string) || '',
    };
  } catch {
    return null;
  }
}

/** Set the session cookie (httpOnly, secure, sameSite=lax) */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/** Get the current session from cookies */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Clear the session cookie */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
