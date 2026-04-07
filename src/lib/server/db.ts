/**
 * Supabase database client for server-side operations.
 * Uses the service role key for privileged operations (never exposed to client).
 * Falls back to an in-memory store when Supabase is not configured (development only).
 * Users must register a real account before accessing any private area.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseAdmin: SupabaseClient | null = null;

/** Get the server-side Supabase client (service role — bypasses RLS) */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return supabaseAdmin;
}

/** Check if the database is configured */
export function isDatabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}

// ─── In-memory fallback store (development without Supabase) ───
export interface InMemoryUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  address: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface InMemoryOrder {
  id: string;
  user_id: string;
  items: Array<{ product_id: string; name: string; quantity: number; price: number }>;
  total: number;
  shipping: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    department: string;
    phone: string;
  };
  payment_method: string;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

class InMemoryStore {
  users: InMemoryUser[] = [];
  orders: InMemoryOrder[] = [];
  auditLogs: AuditLogEntry[] = [];

  findUserByEmail(email: string): InMemoryUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): InMemoryUser | undefined {
    return this.users.find((u) => u.id === id);
  }
}

// Singleton in-memory store
export const memoryStore = new InMemoryStore();
