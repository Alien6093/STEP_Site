/**
 * Lightweight in-process rate limiter for Next.js Route Handlers.
 *
 * Strategy: sliding-window counter keyed on (route, identifier).
 * - For authenticated routes the key is the Supabase user.id.
 * - For unauthenticated routes (e.g. /api/abandoned) the key is the hashed IP.
 *
 * Why not Redis/KV?
 * This is intentionally zero-dependency. For a small-team production portal
 * this in-memory approach is sufficient. If the app is deployed to multiple
 * Vercel regions, upgrade to Vercel KV + @upstash/ratelimit for cross-pod
 * consistency.
 *
 * Usage:
 *   const limited = rateLimit("bookings", userId, { maxRequests: 5, windowMs: 60_000 });
 *   if (limited) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
 */

interface RateLimitOptions {
  /** Maximum number of requests allowed in the sliding window. */
  maxRequests: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

interface RateLimitEntry {
  count:       number;
  windowStart: number;
}

/* Single shared Map — persists across requests within one process/pod */
const store = new Map<string, RateLimitEntry>();

/**
 * Returns `true` if the caller has exceeded the rate limit (should be blocked).
 * Returns `false` if the request is within limits (should proceed).
 */
export function rateLimit(
  route:      string,
  identifier: string,
  options:    RateLimitOptions,
): boolean {
  const { maxRequests, windowMs } = options;
  const key = `${route}::${identifier}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    /* First request, or previous window has expired — open a new window */
    store.set(key, { count: 1, windowStart: now });
    return false; // not rate-limited
  }

  if (entry.count >= maxRequests) {
    return true; // rate-limited — block this request
  }

  /* Increment within the current window */
  entry.count += 1;
  return false; // not rate-limited
}

/**
 * Extracts a best-effort identifier from request headers for use as a
 * rate-limit key on unauthenticated endpoints.
 *
 * Priority: x-forwarded-for → x-real-ip → "unknown"
 * Hashing is omitted here for simplicity — the raw IP is only stored in
 * server memory, never logged or returned to the client.
 */
export function getIpIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
