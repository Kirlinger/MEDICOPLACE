/**
 * Supabase database client for server-side operations.
 * Uses the service role key for privileged operations (never exposed to client).
 * Falls back to a persistent in-memory store when Supabase is not configured
 * (development only). Data is preserved across HMR reloads via globalThis and
 * across server restarts via JSON file persistence.
 * Users must register a real account before accessing any private area.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use globalThis to preserve the Supabase client across HMR reloads in development
const globalForDb = globalThis as typeof globalThis & {
  __medicoplace_supabaseAdmin?: SupabaseClient;
  __medicoplace_memoryStore?: InMemoryStore;
};

/** Get the server-side Supabase client (service role — bypasses RLS) */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) return null;
  if (!globalForDb.__medicoplace_supabaseAdmin) {
    globalForDb.__medicoplace_supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return globalForDb.__medicoplace_supabaseAdmin;
}

/** Check if the database is configured */
export function isDatabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}

// ─── In-memory fallback store (development without Supabase) ───
// Data persists across HMR reloads (globalThis) and across server
// restarts (JSON file in project root, excluded from git).

/** Path to the JSON file used for development data persistence */
const DEV_STORE_PATH = path.join(process.cwd(), '.medicoplace-dev-store.json');

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

  constructor() {
    this.loadFromDisk();
  }

  findUserByEmail(email: string): InMemoryUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): InMemoryUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  /**
   * Persist user and order data to disk so it survives server restarts.
   * Audit logs are intentionally excluded (ephemeral in dev).
   *
   * NOTE: The persisted file contains password hashes and PII.
   * It is excluded from git via .gitignore and must never be shared.
   */
  persist(): void {
    try {
      const data = JSON.stringify(
        { users: this.users, orders: this.orders },
        null,
        2
      );
      fs.writeFileSync(DEV_STORE_PATH, data, 'utf-8');
    } catch (err) {
      console.warn('[MEDICOPLACE] Failed to persist dev store to disk:', err);
    }
  }

  /** Load previously persisted data from disk */
  private loadFromDisk(): void {
    try {
      if (!fs.existsSync(DEV_STORE_PATH)) return;
      const raw = fs.readFileSync(DEV_STORE_PATH, 'utf-8');
      const data = JSON.parse(raw) as {
        users?: InMemoryUser[];
        orders?: InMemoryOrder[];
      };
      if (Array.isArray(data.users)) this.users = data.users;
      if (Array.isArray(data.orders)) this.orders = data.orders;
    } catch (err) {
      console.warn('[MEDICOPLACE] Failed to load dev store from disk (starting fresh):', err);
    }
  }
}

// Singleton preserved across HMR reloads via globalThis
export const memoryStore =
  globalForDb.__medicoplace_memoryStore ??
  (globalForDb.__medicoplace_memoryStore = new InMemoryStore());
