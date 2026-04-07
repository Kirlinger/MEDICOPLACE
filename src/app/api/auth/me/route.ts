/**
 * GET /api/auth/me
 * Return the current authenticated user's profile.
 * Also ensures a CSRF token cookie exists on each request.
 *
 * When a valid JWT session exists but the user is not found in the database
 * or in-memory store (e.g. serverless cold start on Vercel without Supabase),
 * the endpoint returns the profile data embedded in the JWT itself.
 */
import { getSession } from '@/lib/server/auth';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore } from '@/lib/server/db';
import { ensureCsrfToken } from '@/lib/server/csrf';

export async function GET() {
  // Ensure CSRF cookie is set for the client
  await ensureCsrfToken();

  const session = await getSession();
  if (!session) {
    return Response.json({ user: null });
  }

  let user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    address?: string;
  } | null = null;

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, phone, date_of_birth, address')
      .eq('id', session.userId)
      .maybeSingle();

    if (data) {
      user = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone || '',
        dateOfBirth: data.date_of_birth || '',
        address: data.address || '',
      };
    }
  } else {
    const memUser = memoryStore.findUserById(session.userId);
    if (memUser) {
      user = {
        id: memUser.id,
        firstName: memUser.first_name,
        lastName: memUser.last_name,
        email: memUser.email,
        phone: memUser.phone || '',
        dateOfBirth: memUser.date_of_birth || '',
        address: memUser.address || '',
      };
    }
  }

  // Fallback: if the user isn't found in DB/memory but the JWT session is valid,
  // return the profile data embedded in the token. This handles serverless cold
  // starts where the in-memory store is empty.
  if (!user && session.firstName && session.email) {
    user = {
      id: session.userId,
      firstName: session.firstName,
      lastName: session.lastName,
      email: session.email,
      phone: session.phone || '',
      dateOfBirth: '',
      address: '',
    };
  }

  return Response.json({ user }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}
