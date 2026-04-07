/**
 * PATCH /api/users/profile
 * Update the authenticated user's profile with server-side validation.
 */
import { NextRequest } from 'next/server';
import { getClientIp, applyRateLimit, requireCsrf, requireAuth } from '@/lib/server/api-helpers';
import { isValidName, isValidEmail, isValidPhone, sanitize, safeError } from '@/lib/server/validation';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore } from '@/lib/server/db';
import { logAuditEvent } from '@/lib/server/audit-log';

export async function PATCH(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit
  const rateLimitError = applyRateLimit(ip, 'users/profile', 'api');
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

  const firstName = sanitize(body.firstName, 100);
  const lastName = sanitize(body.lastName, 100);
  const email = sanitize(body.email, 254).toLowerCase();
  const phone = sanitize(body.phone, 20);
  const dateOfBirth = sanitize(body.dateOfBirth, 10);
  const address = sanitize(body.address, 200);

  if (!isValidName(firstName)) return safeError('Prénom invalide.');
  if (!isValidName(lastName)) return safeError('Nom invalide.');
  if (!isValidEmail(email)) return safeError('Email invalide.');
  if (phone && !isValidPhone(phone)) return safeError('Téléphone invalide.');

  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;

    // Check email uniqueness (if changed)
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', session.userId)
      .maybeSingle();

    if (existing) {
      return safeError('Cet email est déjà utilisé par un autre compte.');
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        date_of_birth: dateOfBirth,
        address,
        updated_at: now,
      })
      .eq('id', session.userId);

    if (updateError) {
      console.error('Profile update error:', updateError.message);
      return safeError('Erreur lors de la mise à jour du profil.', 500);
    }
  } else {
    const user = memoryStore.findUserById(session.userId);
    if (user) {
      // Check email uniqueness
      const emailTaken = memoryStore.users.some(
        (u) => u.email.toLowerCase() === email && u.id !== session.userId
      );
      if (emailTaken) return safeError('Cet email est déjà utilisé par un autre compte.');

      user.first_name = firstName;
      user.last_name = lastName;
      user.email = email;
      user.phone = phone;
      user.date_of_birth = dateOfBirth;
      user.address = address;
      user.updated_at = now;
    }
  }

  // Audit log
  await logAuditEvent({
    userId: session.userId,
    action: 'update_profile',
    resource: 'user',
    resourceId: session.userId,
    details: 'Profile updated',
    ipAddress: ip,
  });

  return Response.json({
    success: true,
    user: { id: session.userId, firstName, lastName, email, phone, dateOfBirth, address },
  });
}
