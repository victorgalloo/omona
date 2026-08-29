import { Context, Next } from 'hono';
const requests = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;
export async function rateLimitMiddleware(c: Context, next: Next) {
  const orgId = c.get('auth')?.orgId || c.req.header('x-forwarded-for') || 'anon';
  const now = Date.now();
  let entry = requests.get(orgId);
  if (!entry || now > entry.resetAt) { entry = { count: 0, resetAt: now + WINDOW_MS }; requests.set(orgId, entry); }
  entry.count++;
  c.header('X-RateLimit-Limit', MAX_REQUESTS.toString());
  c.header('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - entry.count).toString());
  if (entry.count > MAX_REQUESTS) { return c.json({ error: 'Demasiadas solicitudes. Intenta de nuevo en un momento.' }, 429); }
  await next();
}
setInterval(() => { const now = Date.now(); for (const [key, val] of requests) { if (now > val.resetAt) requests.delete(key); } }, 300_000);
