/**
 * POST /api/auth/reset-password
 * Reset a user's password using a valid reset token.
 */
import { NextRequest } from 'next/server';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/server/auth';
import { isStrongPassword, safeError } from '@/lib/server/validation';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore } from '@/lib/server/db';
import { getClientIp, applyRateLimit, requireCsrf } from '@/lib/server/api-helpers';
import { logAuditEvent } from '@/lib/server/audit-log';
import { verifyResetToken, invalidateResetToken } from '@/lib/server/reset-tokens';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit
  const rateLimitError = applyRateLimit(ip, 'auth/reset-password', 'sensitive');
  if (rateLimitError) return rateLimitError;

  // CSRF
  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return safeError('Requête invalide.', 400);
  }

  const token = typeof body.token === 'string' ? body.token : '';
  const newPassword = typeof body.password === 'string' ? body.password : '';

  if (!token || !newPassword) {
    return safeError('Jeton et mot de passe requis.');
  }

  // Validate password strength
  const passwordCheck = isStrongPassword(newPassword);
  if (!passwordCheck.valid) {
    return safeError(passwordCheck.reason || 'Le mot de passe est trop faible.');
  }

  // Verify reset token
  const tokenData = await verifyResetToken(token);
  if (!tokenData) {
    return safeError('Lien de réinitialisation invalide ou expiré. Veuillez en demander un nouveau.', 401);
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: passwordHash, updated_at: now })
      .eq('id', tokenData.userId);

    if (updateError) {
      return safeError('Erreur lors de la réinitialisation du mot de passe.', 500);
    }
  } else {
    const user = memoryStore.findUserById(tokenData.userId);
    if (user) {
      user.password_hash = passwordHash;
      user.updated_at = now;
    }
  }

  // Invalidate the used token
  invalidateResetToken(token);

  // Resolve user profile data for the session token
  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data: userData } = await supabase
      .from('users')
      .select('first_name, last_name, email, phone')
      .eq('id', tokenData.userId)
      .maybeSingle();
    if (userData) {
      firstName = userData.first_name;
      lastName = userData.last_name;
      email = userData.email;
      phone = userData.phone || '';
    }
  } else {
    const memUser = memoryStore.findUserById(tokenData.userId);
    if (memUser) {
      firstName = memUser.first_name;
      lastName = memUser.last_name;
      email = memUser.email;
      phone = memUser.phone || '';
    }
  }

  // Create a session for the user
  const sessionToken = await createSessionToken({
    userId: tokenData.userId,
    role: 'user',
    firstName,
    lastName,
    email,
    phone,
  });
  await setSessionCookie(sessionToken);

  await logAuditEvent({
    userId: tokenData.userId,
    action: 'password_reset_completed',
    resource: 'auth',
    details: 'Password reset completed successfully',
    ipAddress: ip,
  });

  return Response.json({ success: true });
}
