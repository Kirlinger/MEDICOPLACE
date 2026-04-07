/**
 * POST /api/auth/logout
 * Clear the session cookie.
 */
import { clearSessionCookie, getSession } from '@/lib/server/auth';
import { logAuditEvent } from '@/lib/server/audit-log';
import { NextRequest } from 'next/server';
import { getClientIp } from '@/lib/server/api-helpers';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const session = await getSession();

  await clearSessionCookie();

  if (session) {
    await logAuditEvent({
      userId: session.userId,
      action: 'logout',
      resource: 'auth',
      details: 'User logged out',
      ipAddress: ip,
    });
  }

  return Response.json({ success: true });
}
