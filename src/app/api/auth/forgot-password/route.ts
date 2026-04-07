/**
 * POST /api/auth/forgot-password
 * Request a password reset. Always returns success to prevent user enumeration.
 * In production, sends a reset email if the user exists.
 */
import { NextRequest } from 'next/server';
import { isValidEmail, sanitize } from '@/lib/server/validation';
import { getClientIp, applyRateLimit, requireCsrf } from '@/lib/server/api-helpers';
import { logAuditEvent } from '@/lib/server/audit-log';
import { isDatabaseConfigured, getSupabaseAdmin, memoryStore } from '@/lib/server/db';
import { createResetToken } from '@/lib/server/reset-tokens';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Strict rate limit — prevent email enumeration and spam
  const rateLimitError = applyRateLimit(ip, 'auth/forgot-password', 'sensitive');
  if (rateLimitError) return rateLimitError;

  // CSRF
  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    // Always return the same response
    return Response.json({ success: true });
  }

  const email = sanitize(body.email, 254).toLowerCase();

  if (!isValidEmail(email)) {
    // Still return success to prevent enumeration
    return Response.json({ success: true });
  }

  // Look up user (silently — never indicate if user exists)
  let userId: string | null = null;

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    userId = user?.id || null;
  } else {
    const user = memoryStore.findUserByEmail(email);
    userId = user?.id || null;
  }

  if (userId) {
    // Generate a secure reset token
    const token = await createResetToken(userId, email);

    // In production, send the reset email here.
    // For now, log the token for development purposes only.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Password reset token for ${email}: ${token}`);
    }

    // TODO: integrate email service (e.g., Resend) to send the reset link:
    // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reinitialiser-mot-de-passe?token=${token}`;
    // await sendEmail({ to: email, subject: '...', html: `<a href="${resetUrl}">...` });

    await logAuditEvent({
      userId,
      action: 'password_reset_requested',
      resource: 'auth',
      details: `Password reset requested for ${email}`,
      ipAddress: ip,
    });
  }

  // Constant response regardless of whether user exists
  return Response.json({ success: true });
}
