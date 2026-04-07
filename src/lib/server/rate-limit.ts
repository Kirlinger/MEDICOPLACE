/**
 * In-memory rate limiter for API routes.
 * Uses a sliding window approach to limit requests per IP.
 * In production with multiple instances, use Redis or a distributed store.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 60s)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

interface RateLimitConfig {
  /** Maximum number of requests in the window */
  maxRequests: number;
  /** Window size in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Check rate limit for a given key (typically IP + route).
 * Returns whether the request is allowed and the remaining count.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — create new entry
    store.set(key, { count: 1, resetAt: now + config.windowSeconds * 1000 });
    return { allowed: true, remaining: config.maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= config.maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, remaining: config.maxRequests - entry.count, retryAfterSeconds: 0 };
}

/** Predefined rate limit profiles */
export const RATE_LIMITS = {
  /** Auth routes: 10 attempts per 5 minutes */
  auth: { maxRequests: 10, windowSeconds: 300 },
  /** General API: 60 requests per minute */
  api: { maxRequests: 60, windowSeconds: 60 },
  /** Sensitive operations: 5 per 10 minutes */
  sensitive: { maxRequests: 5, windowSeconds: 600 },
} as const;
