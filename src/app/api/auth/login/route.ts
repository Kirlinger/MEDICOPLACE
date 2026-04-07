/**
 * POST /api/auth/login
 * Authenticate a user with email/password, set session cookie.
 */
import { NextRequest } from 'next/server';
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/server/auth';
import { isValidEmail, sanitize, safeError } from '@/lib/server/validation';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore } from '@/lib/server/db';
import { getClientIp, applyRateLimit, requireCsrf } from '@/lib/server/api-helpers';
import { logAuditEvent } from '@/lib/server/audit-log';

// Generic error to prevent user enumeration
const AUTH_ERROR = 'Email ou mot de passe incorrect.';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit (strict for auth)
  const rateLimitError = applyRateLimit(ip, 'auth/login', 'auth');
  if (rateLimitError) return rateLimitError;

  // CSRF validation
  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return safeError('Requête invalide.', 400);
  }

  const email = sanitize(body.email, 254).toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';

  if (!isValidEmail(email) || !password) {
    return safeError(AUTH_ERROR, 401);
  }

  let userId: string;
  let passwordHash: string;
  let role: string;
  let firstName: string;
  let lastName: string;
  let phone: string;

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data: user } = await supabase
      .from('users')
      .select('id, password_hash, role, first_name, last_name, email, phone')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      // Constant-time: hash a dummy password to prevent timing attacks
      await verifyPassword(password, '$2a$12$dummyhashfortiminganddummyhash');
      return safeError(AUTH_ERROR, 401);
    }

    userId = user.id;
    passwordHash = user.password_hash;
    role = user.role;
    firstName = user.first_name;
    lastName = user.last_name;
    phone = user.phone || '';
  } else {
    // In-memory fallback
    const user = memoryStore.findUserByEmail(email);
    if (!user) {
      await verifyPassword(password, '$2a$12$dummyhashfortiminganddummyhash');
      return safeError(AUTH_ERROR, 401);
    }

    userId = user.id;
    passwordHash = user.password_hash;
    role = user.role;
    firstName = user.first_name;
    lastName = user.last_name;
    phone = user.phone || '';
  }

  // Verify password
  const isValid = await verifyPassword(password, passwordHash);
  if (!isValid) {
    await logAuditEvent({
      userId,
      action: 'login_failed',
      resource: 'auth',
      details: `Failed login attempt for ${email}`,
      ipAddress: ip,
    });
    return safeError(AUTH_ERROR, 401);
  }

  // Create session
  const token = await createSessionToken(userId, role);
  await setSessionCookie(token);

  // Audit log
  await logAuditEvent({
    userId,
    action: 'login',
    resource: 'auth',
    details: `User logged in: ${email}`,
    ipAddress: ip,
  });

  return Response.json({
    success: true,
    user: { id: userId, firstName, lastName, email, phone },
  });
}
