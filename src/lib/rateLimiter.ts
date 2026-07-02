import { createHash } from "crypto";

const globalAny = globalThis as any;
const rateLimitStore: Map<string, { count: number; resetAt: number }> =
  globalAny.__ECONEXO_RATE_LIMIT_STORE__ || new Map();

globalAny.__ECONEXO_RATE_LIMIT_STORE__ = rateLimitStore;

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  headers: Record<string, string>;
};

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getClientIdentifier(request: Request) {
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
  const cookieHeader = request.headers.get("cookie");
  const forwarded =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("fastly-client-ip") ||
    request.headers.get("true-client-ip");

  if (authHeader) {
    return `auth:${hashIdentifier(authHeader)}`;
  }

  if (cookieHeader) {
    const tokenMatch = cookieHeader.match(/(?:sb-access-token|sb-refresh-token|access_token)=([^;]+)/);
    if (tokenMatch?.[1]) {
      return `cookie:${hashIdentifier(tokenMatch[1])}`;
    }
  }

  if (forwarded) {
    return `ip:${forwarded.split(",")[0].trim()}`;
  }

  const userAgent = request.headers.get("user-agent") || "unknown-agent";
  return `anon:${hashIdentifier(userAgent)}`;
}

function cleanupStore(now: number) {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

export function rateLimit(
  request: Request,
  prefix: string,
  limit = 15,
  windowMs = 60000,
  explicitIdentifier?: string
): RateLimitResult {
  const identifier = explicitIdentifier || getClientIdentifier(request);
  const key = `${prefix}:${identifier}`;
  const now = Date.now();

  cleanupStore(now);

  const current = rateLimitStore.get(key);
  const resetAt = now + windowMs;

  if (!current) {
    rateLimitStore.set(key, { count: 1, resetAt });
    const headers = {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(limit - 1),
      "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
    };
    return { success: true, limit, remaining: limit - 1, resetAt, headers };
  }

  if (current.count >= limit) {
    const headers = {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.ceil(current.resetAt / 1000)),
    };
    return { success: false, limit, remaining: 0, resetAt: current.resetAt, headers };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  const headers = {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(limit - current.count),
    "X-RateLimit-Reset": String(Math.ceil(current.resetAt / 1000)),
  };
  return { success: true, limit, remaining: limit - current.count, resetAt: current.resetAt, headers };
}
