import { NextRequest, NextResponse } from "next/server";

/**
 * Edge-runtime rate limiter.
 *
 * Limits each IP to MAX_REQUESTS per WINDOW_MS.
 * Returns HTTP 429 with a Retry-After header on excess requests.
 *
 * Note: state is per-edge-node (in-memory Map).  This is intentionally
 * lightweight — it deters scraping and accidental hammering without
 * requiring an external store like Redis/Vercel KV for a public club site.
 * Upgrade to @vercel/kv if cross-node consistency becomes important.
 */

const WINDOW_MS = 60_000;   // 1-minute sliding window
const MAX_REQUESTS = 150;    // requests per IP per window (generous for a public site)

interface RateEntry {
  count: number;
  reset: number; // absolute timestamp in ms
}

// Map is module-scoped — survives across requests on the same edge instance
const rateMap = new Map<string, RateEntry>();

// Periodically purge expired entries so the Map does not grow indefinitely
function purgeExpired(now: number) {
  for (const [ip, entry] of rateMap) {
    if (now > entry.reset) rateMap.delete(ip);
  }
}

let lastPurge = Date.now();

export function middleware(req: NextRequest) {
  const now = Date.now();

  // Purge stale entries every 5 minutes
  if (now - lastPurge > 300_000) {
    purgeExpired(now);
    lastPurge = now;
  }

  // Resolve client IP — Vercel forwards the real IP in x-forwarded-for
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = (forwarded ? forwarded.split(",")[0] : "unknown").trim();

  const entry = rateMap.get(ip);

  if (!entry || now > entry.reset) {
    // Start a fresh window for this IP
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
  } else {
    entry.count++;

    if (entry.count > MAX_REQUESTS) {
      const retryAfterSec = Math.ceil((entry.reset - now) / 1000);
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Content-Type": "text/plain",
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Limit": String(MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.reset / 1000)),
        },
      });
    }
  }

  return NextResponse.next();
}

// Apply to all routes except Next.js internals and static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
