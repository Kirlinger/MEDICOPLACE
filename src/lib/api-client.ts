/**
 * Client-side API helper.
 * Handles CSRF token inclusion and typed responses for all API calls.
 */

/** Read the CSRF token from the cookie */
function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/medicoplace_csrf=([^;]+)/);
  return match ? match[1] : '';
}

/** Make an API request with CSRF token and JSON body */
export async function apiRequest<T = Record<string, unknown>>(
  url: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
  } = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const { method = 'GET', body } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Include CSRF token for mutating requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });

  let data: T;
  try {
    data = await response.json();
  } catch {
    // Server returned non-JSON (e.g. HTML error page from unhandled exception)
    console.error(`[API] Non-JSON response from ${method} ${url}: HTTP ${response.status}`);
    data = { error: `Erreur serveur (${response.status}). Veuillez réessayer.` } as T;
  }

  return { ok: response.ok, status: response.status, data };
}
