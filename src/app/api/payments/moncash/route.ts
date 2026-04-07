/**
 * POST /api/payments/moncash
 * Initialize a MonCash payment transaction.
 * This is the integration structure for Digicel MonCash (Haiti's mobile money).
 *
 * MonCash API flow:
 * 1. Client calls this endpoint with orderId and amount
 * 2. Server creates a payment request with MonCash REST API
 * 3. MonCash returns a payment URL
 * 4. Client redirects user to MonCash payment page
 * 5. MonCash redirects back to our callback URL
 * 6. We verify the payment and update order status
 */
import { NextRequest } from 'next/server';
import { getClientIp, applyRateLimit, requireCsrf, requireAuth } from '@/lib/server/api-helpers';
import { sanitize, safeError } from '@/lib/server/validation';
import { logAuditEvent } from '@/lib/server/audit-log';

// MonCash API endpoints
const MONCASH_SANDBOX_URL = 'https://sandbox.moncashbutton.digicelgroup.com';
const MONCASH_PRODUCTION_URL = 'https://moncashbutton.digicelgroup.com';

function getMonCashBaseUrl(): string {
  return process.env.MONCASH_MODE === 'production' ? MONCASH_PRODUCTION_URL : MONCASH_SANDBOX_URL;
}

function isMonCashConfigured(): boolean {
  return !!(process.env.MONCASH_CLIENT_ID && process.env.MONCASH_CLIENT_SECRET);
}

/** Get MonCash OAuth token */
async function getMonCashToken(): Promise<string | null> {
  const clientId = process.env.MONCASH_CLIENT_ID;
  const clientSecret = process.env.MONCASH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const baseUrl = getMonCashBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/Api/oauth/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'scope=read,write&grant_type=client_credentials',
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.access_token || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit
  const rateLimitError = applyRateLimit(ip, 'payments/moncash', 'sensitive');
  if (rateLimitError) return rateLimitError;

  // CSRF
  const csrfError = await requireCsrf(request);
  if (csrfError) return csrfError;

  // Auth
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const { session } = authResult;

  if (!isMonCashConfigured()) {
    return safeError('Le paiement MonCash n\'est pas encore configuré. Paiement à la livraison uniquement.', 503);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return safeError('Requête invalide.', 400);
  }

  const orderId = sanitize(body.orderId, 50);
  const amount = typeof body.amount === 'number' ? body.amount : 0;

  if (!orderId) return safeError('Identifiant de commande requis.');
  if (amount <= 0 || amount > 1000000) return safeError('Montant invalide.');

  // Get MonCash OAuth token
  const token = await getMonCashToken();
  if (!token) {
    return safeError('Impossible de se connecter au service de paiement.', 502);
  }

  // Create payment request
  const baseUrl = getMonCashBaseUrl();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/Api/v1/CreatePayment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        orderId,
        successUrl: `${appUrl}/paiement/succes?orderId=${orderId}`,
        errorUrl: `${appUrl}/paiement/erreur?orderId=${orderId}`,
      }),
    });

    if (!response.ok) {
      return safeError('Erreur lors de la création du paiement.', 502);
    }

    const data = await response.json();
    const paymentToken = data.payment_token?.token;

    if (!paymentToken) {
      return safeError('Réponse de paiement invalide.', 502);
    }

    // Audit log
    await logAuditEvent({
      userId: session.userId,
      action: 'init_payment',
      resource: 'payment',
      resourceId: orderId,
      details: `MonCash payment initiated: ${amount} HTG`,
      ipAddress: ip,
    });

    return Response.json({
      success: true,
      paymentUrl: data.payment_url || `${baseUrl}/Moncash-pay/Redirect?token=${paymentToken}`,
      transactionId: paymentToken,
    });
  } catch {
    return safeError('Erreur de connexion au service de paiement.', 502);
  }
}
