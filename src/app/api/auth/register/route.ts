/**
 * POST /api/auth/register
 * Create a new user account with server-side validation and password hashing.
 */
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, createSessionToken, setSessionCookie, assertProductionSecrets } from '@/lib/server/auth';
import { isValidEmail, isValidName, isValidPhone, isStrongPassword, sanitize, safeError } from '@/lib/server/validation';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore, InMemoryUser } from '@/lib/server/db';
import { getClientIp, applyRateLimit, requireCsrf } from '@/lib/server/api-helpers';
import { logAuditEvent } from '@/lib/server/audit-log';

export async function POST(request: NextRequest) {
  assertProductionSecrets();
  const ip = getClientIp(request);

  // Rate limit
  const rateLimitError = applyRateLimit(ip, 'auth/register', 'auth');
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

  // Validate and sanitize inputs
  const firstName = sanitize(body.firstName, 100);
  const lastName = sanitize(body.lastName, 100);
  const email = sanitize(body.email, 254).toLowerCase();
  const phone = sanitize(body.phone, 20);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!isValidName(firstName)) return safeError('Prénom invalide.');
  if (!isValidName(lastName)) return safeError('Nom invalide.');
  if (!isValidEmail(email)) return safeError('Adresse email invalide.');
  if (phone && !isValidPhone(phone)) return safeError('Numéro de téléphone invalide.');

  const passwordCheck = isStrongPassword(password);
  if (!passwordCheck.valid) return safeError(passwordCheck.reason || 'Mot de passe trop faible.');

  // Hash password
  const passwordHash = await hashPassword(password);

  const userId = uuidv4();
  const now = new Date().toISOString();

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return safeError('Un compte existe déjà avec cet email.');
    }

    // Insert user
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      role: 'user',
      created_at: now,
      updated_at: now,
    });

    if (insertError) {
      console.error('Registration insert error:', insertError.message);
      return safeError('Erreur lors de la création du compte.', 500);
    }
  } else {
    // In-memory fallback
    if (memoryStore.findUserByEmail(email)) {
      return safeError('Un compte existe déjà avec cet email.');
    }

    const newUser: InMemoryUser = {
      id: userId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone,
      date_of_birth: '',
      address: '',
      role: 'user',
      created_at: now,
      updated_at: now,
    };
    memoryStore.users.push(newUser);
    memoryStore.persist();
  }

  // Create session
  const token = await createSessionToken(userId, 'user');
  await setSessionCookie(token);

  // Audit log
  await logAuditEvent({
    userId,
    action: 'register',
    resource: 'user',
    resourceId: userId,
    details: `New user registered: ${email}`,
    ipAddress: ip,
  });

  return Response.json({
    success: true,
    user: { id: userId, firstName, lastName, email, phone },
  }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}
