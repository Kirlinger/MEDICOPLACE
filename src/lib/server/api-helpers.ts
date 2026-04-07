/**
 * Shared API route helpers for request processing.
 */
import { NextRequest } from 'next/server';
import { checkRateLimit, RATE_LIMITS } from './rate-limit';
import { validateCsrf } from './csrf';
import { getSession } from './auth';

/** Extract client IP from request headers */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Apply rate limiting to a request. Returns error response if rate limited. */
export function applyRateLimit(
  ip: string,
  route: string,
  profile: keyof typeof RATE_LIMITS = 'api'
): Response | null {
  const key = `${ip}:${route}`;
  const result = checkRateLimit(key, RATE_LIMITS[profile]);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfterSeconds),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }
  return null;
}

/** Validate CSRF for mutating requests. Returns error response if invalid. */
export async function requireCsrf(request: Request): Promise<Response | null> {
  const isValid = await validateCsrf(request);
  if (!isValid) {
    return Response.json({ error: 'Jeton CSRF invalide. Veuillez rafraîchir la page.' }, { status: 403 });
  }
  return null;
}

/** Require an authenticated session. Returns error response or session data. */
export async function requireAuth(): Promise<
  | { session: { userId: string; role: string }; error: null }
  | { session: null; error: Response }
> {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: Response.json({ error: 'Non authentifié. Veuillez vous connecter.' }, { status: 401 }),
    };
  }
  return { session, error: null };
}

/** Require admin role. Returns error response or session data. */
export async function requireAdmin(): Promise<
  | { session: { userId: string; role: string }; error: null }
  | { session: null; error: Response }
> {
  const result = await requireAuth();
  if (result.error) return result;
  if (result.session.role !== 'admin') {
    return {
      session: null,
      error: Response.json({ error: 'Accès refusé.' }, { status: 403 }),
    };
  }
  return result;
}
