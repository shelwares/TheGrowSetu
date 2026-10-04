import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// Sanitize env vars: strip surrounding quotes and whitespace that Vercel
// sometimes introduces, then validate the URL format before constructing the
// client. A UrlError thrown at module scope would crash every server action.
const rawUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/^["']|["']$/g, '');
const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim().replace(/^["']|["']$/g, '');

const isValidUrl = typeof rawUrl === 'string' && rawUrl.startsWith('https://');
const isValidToken = typeof rawToken === 'string' && rawToken.length > 10;

let redis: InstanceType<typeof Redis> | null = null;
if (isValidUrl && isValidToken) {
  try {
    redis = new Redis({ url: rawUrl!, token: rawToken! });
  } catch (e) {
    // Gracefully degrade — rate limiting disabled, but signup/login still work
    console.error(
      '[rate-limit] Redis init failed — rate limiting disabled:',
      e instanceof Error ? e.message : String(e)
    );
  }
}

// Login: 5 attempts per 15 min per IP+email
export const loginLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: 'rl:login',
    })
  : null;

// Signup: 3 attempts per hour per IP
export const signupLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: 'rl:signup',
    })
  : null;

// Password reset: 3 per 15 min per IP
export const resetLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '15 m'),
      analytics: true,
      prefix: 'rl:reset',
    })
  : null;

// Pool join: 10 per minute per user
export const joinLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'rl:join',
    })
  : null;

// Get real client IP — Vercel sets x-real-ip from trusted edge
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-real-ip') || '127.0.0.1';
}
