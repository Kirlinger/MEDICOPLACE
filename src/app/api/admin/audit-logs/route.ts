/**
 * GET /api/admin/audit-logs
 * Return recent audit logs. Admin-only endpoint.
 */
import { NextRequest } from 'next/server';
import { getClientIp, applyRateLimit, requireAdmin } from '@/lib/server/api-helpers';
import { getAuditLogs } from '@/lib/server/audit-log';

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit
  const rateLimitError = applyRateLimit(ip, 'admin/audit-logs', 'api');
  if (rateLimitError) return rateLimitError;

  // Admin only
  const authResult = await requireAdmin();
  if (authResult.error) return authResult.error;

  const url = new URL(request.url);
  const limitParam = url.searchParams.get('limit');
  const limit = Math.min(Math.max(parseInt(limitParam || '50', 10) || 50, 1), 200);

  const logs = await getAuditLogs(limit);

  return Response.json({ logs }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
