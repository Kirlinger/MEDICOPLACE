/**
 * Audit logging system for admin and sensitive operations.
 * Logs are stored in the database (Supabase) or in-memory for development.
 */
import { v4 as uuidv4 } from 'uuid';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore, AuditLogEntry } from './db';

interface LogParams {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
}

/** Record an audit log entry */
export async function logAuditEvent(params: LogParams): Promise<void> {
  const entry: AuditLogEntry = {
    id: uuidv4(),
    user_id: params.userId,
    action: params.action,
    resource: params.resource,
    resource_id: params.resourceId || '',
    details: params.details || '',
    ip_address: params.ipAddress || 'unknown',
    created_at: new Date().toISOString(),
  };

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('audit_logs').insert(entry);
    }
  } else {
    // In-memory fallback for development
    memoryStore.auditLogs.push(entry);
    // Keep only last 1000 entries in memory
    if (memoryStore.auditLogs.length > 1000) {
      memoryStore.auditLogs = memoryStore.auditLogs.slice(-1000);
    }
  }
}

/** Get recent audit logs (admin only) */
export async function getAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      return data || [];
    }
  }
  return memoryStore.auditLogs.slice(-limit).reverse();
}
