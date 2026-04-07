/**
 * PATCH /api/auth/password
 * Change password for authenticated user.
 * Requires old password verification.
 */
import { NextRequest } from 'next/server';
import { verifyPassword, hashPassword } from '@/lib/server/auth';
import { isStrongPassword, safeError } from '@/lib/server/validation';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore } from '@/lib/server/db';
import { getClientIp, applyRateLimit, requireCsrf, requireAuth } from '@/lib/server/api-helpers';
import { logAuditEvent } from '@/lib/server/audit-log';

export async function PATCH(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit (sensitive — prevent brute-force of old password)
  const rateLimitError = applyRateLimit(ip, 'auth/password', 'sensitive');
  if (rateLimitError) return rateLimitError;

  // CSRF
  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  // Auth
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const { session } = authResult;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return safeError('Requête invalide.', 400);
  }

  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

  if (!currentPassword || !newPassword) {
    return safeError('Tous les champs sont requis.');
  }

  // Validate new password strength
  const passwordCheck = isStrongPassword(newPassword);
  if (!passwordCheck.valid) {
    return safeError(passwordCheck.reason || 'Le nouveau mot de passe est trop faible.');
  }

  // Prevent setting same password
  if (currentPassword === newPassword) {
    return safeError('Le nouveau mot de passe doit être différent de l\'ancien.');
  }

  let existingHash: string | null = null;

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', session.userId)
      .maybeSingle();
    existingHash = user?.password_hash || null;
  } else {
    const user = memoryStore.findUserById(session.userId);
    existingHash = user?.password_hash || null;
  }

  if (!existingHash) {
    return safeError('Utilisateur introuvable.', 404);
  }

  // Verify current password
  const isValid = await verifyPassword(currentPassword, existingHash);
  if (!isValid) {
    await logAuditEvent({
      userId: session.userId,
      action: 'password_change_failed',
      resource: 'auth',
      details: 'Incorrect current password during password change attempt',
      ipAddress: ip,
    });
    return safeError('Mot de passe actuel incorrect.', 401);
  }

  // Hash and update new password
  const newHash = await hashPassword(newPassword);
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newHash, updated_at: now })
      .eq('id', session.userId);

    if (updateError) {
      return safeError('Erreur lors de la mise à jour du mot de passe.', 500);
    }
  } else {
    const user = memoryStore.findUserById(session.userId);
    if (user) {
      user.password_hash = newHash;
      user.updated_at = now;
    }
  }

  await logAuditEvent({
    userId: session.userId,
    action: 'password_changed',
    resource: 'auth',
    details: 'Password successfully changed',
    ipAddress: ip,
  });

  return Response.json({ success: true });
}
