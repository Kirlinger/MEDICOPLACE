/**
 * Secure reset token management.
 * Uses HMAC-signed tokens with expiration for password reset flows.
 * In production with multiple instances, replace in-memory store with database/Redis.
 */
import { SignJWT, jwtVerify } from 'jose';

const RESET_TOKEN_SECRET_RAW = process.env.RESET_TOKEN_SECRET || process.env.JWT_SECRET || '';
const RESET_TOKEN_SECRET = new TextEncoder().encode(
  RESET_TOKEN_SECRET_RAW || 'dev-reset-secret-change-in-production-32ch!!'
);
const RESET_TOKEN_EXPIRY = 15 * 60; // 15 minutes

// In-memory store of issued tokens (for invalidation)
const issuedTokens = new Map<string, { userId: string; expiresAt: number }>();

// Periodic cleanup of expired tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of issuedTokens.entries()) {
    if (now > data.expiresAt) issuedTokens.delete(token);
  }
}, 60_000);

/** Create a signed reset token for a user */
export async function createResetToken(userId: string, email: string): Promise<string> {
  const token = await new SignJWT({ userId, email, purpose: 'password_reset' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${RESET_TOKEN_EXPIRY}s`)
    .setJti(crypto.randomUUID())
    .sign(RESET_TOKEN_SECRET);

  issuedTokens.set(token, {
    userId,
    expiresAt: Date.now() + RESET_TOKEN_EXPIRY * 1000,
  });

  return token;
}

/** Verify a reset token and return the associated user data */
export async function verifyResetToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    // Check if token was invalidated
    const stored = issuedTokens.get(token);
    if (!stored) return null;
    if (Date.now() > stored.expiresAt) {
      issuedTokens.delete(token);
      return null;
    }

    const { payload } = await jwtVerify(token, RESET_TOKEN_SECRET);
    if (payload.purpose !== 'password_reset') return null;

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

/** Invalidate a used reset token (single-use enforcement) */
export function invalidateResetToken(token: string): void {
  issuedTokens.delete(token);
}
