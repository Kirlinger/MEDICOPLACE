/**
 * GET  /api/orders  — Fetch authenticated user's orders
 * POST /api/orders  — Create a new order with server-side validation
 */
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getClientIp, applyRateLimit, requireCsrf, requireAuth } from '@/lib/server/api-helpers';
import { isValidName, isValidPhone, isValidAddress, isValidQuantity, sanitize, safeError } from '@/lib/server/validation';
import { getSupabaseAdmin, isDatabaseConfigured, memoryStore, InMemoryOrder } from '@/lib/server/db';
import { logAuditEvent } from '@/lib/server/audit-log';

/** GET /api/orders — list orders for authenticated user */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  const rateLimitError = applyRateLimit(ip, 'orders:get', 'api');
  if (rateLimitError) return rateLimitError;

  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const { session } = authResult;

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, items, total, shipping, status, payment_method, payment_status, created_at')
      .eq('user_id', session.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return safeError('Erreur lors de la récupération des commandes.', 500);
    }

    return Response.json({ orders: orders || [] }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  }

  // In-memory fallback
  const orders = memoryStore.orders
    .filter((o) => o.user_id === session.userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 50)
    .map(({ id, items, total, shipping, status, payment_method, payment_status, created_at }) => ({
      id, items, total, shipping, status, payment_method, payment_status, created_at,
    }));

  return Response.json({ orders }, {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit
  const rateLimitError = applyRateLimit(ip, 'orders', 'sensitive');
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

  // Validate shipping address
  const shipping = body.shippingAddress as Record<string, unknown> | undefined;
  if (!shipping) return safeError('Adresse de livraison requise.');

  const firstName = sanitize(shipping.firstName, 100);
  const lastName = sanitize(shipping.lastName, 100);
  const address = sanitize(shipping.address, 200);
  const city = sanitize(shipping.city, 100);
  const department = sanitize(shipping.department, 100);
  const phone = sanitize(shipping.phone, 20);

  if (!isValidName(firstName)) return safeError('Prénom invalide.');
  if (!isValidName(lastName)) return safeError('Nom invalide.');
  if (!isValidAddress(address)) return safeError('Adresse invalide.');
  if (!city.trim()) return safeError('Ville requise.');
  if (!department.trim()) return safeError('Département requis.');
  if (!isValidPhone(phone, true)) return safeError('Téléphone invalide.');

  // Validate order items
  const items = body.items as Array<Record<string, unknown>> | undefined;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return safeError('Le panier est vide.');
  }
  if (items.length > 50) return safeError('Trop d\'articles dans le panier.');

  const validatedItems: Array<{ product_id: string; name: string; quantity: number; price: number }> = [];
  let computedTotal = 0;

  for (const item of items) {
    const productId = sanitize(item.id, 50);
    const name = sanitize(item.name, 200);
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    const price = typeof item.price === 'number' ? item.price : 0;

    if (!productId || !name) return safeError('Article invalide dans le panier.');
    if (!isValidQuantity(quantity)) return safeError(`Quantité invalide pour ${name}.`);
    if (price <= 0 || price > 100000) return safeError(`Prix invalide pour ${name}.`);

    validatedItems.push({ product_id: productId, name, quantity, price });
    computedTotal += price * quantity;
  }

  const shippingCost = computedTotal >= 500 ? 0 : 75;
  const grandTotal = computedTotal + shippingCost;

  const orderId = uuidv4();
  const now = new Date().toISOString();

  const order = {
    id: orderId,
    user_id: session.userId,
    items: validatedItems,
    total: grandTotal,
    shipping: shippingCost,
    status: 'pending' as const,
    shipping_address: { firstName, lastName, address, city, department, phone },
    payment_method: 'cash_on_delivery',
    payment_status: 'pending' as const,
    created_at: now,
  };

  if (isDatabaseConfigured()) {
    const supabase = getSupabaseAdmin()!;
    const { error: insertError } = await supabase.from('orders').insert(order);
    if (insertError) {
      console.error('Order insert error:', insertError.message);
      return safeError('Erreur lors de la création de la commande.', 500);
    }
  } else {
    memoryStore.orders.push(order as InMemoryOrder);
    memoryStore.persist();
  }

  // Audit log
  await logAuditEvent({
    userId: session.userId,
    action: 'create_order',
    resource: 'order',
    resourceId: orderId,
    details: `Order created: ${validatedItems.length} items, total ${grandTotal} HTG`,
    ipAddress: ip,
  });

  return Response.json({
    success: true,
    orderId,
    total: grandTotal,
  });
}
