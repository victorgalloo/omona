import { Hono } from 'hono';
import { getAuth, requireRole } from './middleware.js';
import { getSupabase } from '../db/client.js';
import { logger } from '../logger.js';

export const webhookRoutes = new Hono();

const sb = () => getSupabase();

// CRUD for webhook subscriptions
webhookRoutes.get('/', async (c) => {
  const { orgId } = getAuth(c);
  const { data } = await sb().from('webhooks').select('*').eq('organization_id', orgId).order('created_at');
  return c.json({ data: data ?? [] });
});

webhookRoutes.post('/', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { url, events, secret } = await c.req.json();
  if (!url || !events?.length) return c.json({ error: 'URL y eventos requeridos' }, 400);

  const { data, error } = await sb().from('webhooks').insert({
    organization_id: orgId,
    url,
    events,
    secret: secret || null,
    active: true,
  }).select().single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data, 201);
});

webhookRoutes.patch('/:id', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const body = await c.req.json();
  const { data, error } = await sb().from('webhooks')
    .update(body)
    .eq('id', c.req.param('id'))
    .eq('organization_id', orgId)
    .select().single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

webhookRoutes.delete('/:id', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  await sb().from('webhooks').delete().eq('id', c.req.param('id')).eq('organization_id', orgId);
  return c.json({ ok: true });
});

// Fire webhook events (called internally)
export type WebhookEvent =
  | 'lead.created'
  | 'lead.updated'
  | 'lead.qualified'
  | 'conversation.created'
  | 'conversation.message'
  | 'handoff.requested'
  | 'handoff.accepted'
  | 'handoff.resolved';

export async function fireWebhookEvent(orgId: string, event: WebhookEvent, payload: Record<string, unknown>) {
  try {
    const { data: hooks } = await sb().from('webhooks')
      .select('*')
      .eq('organization_id', orgId)
      .eq('active', true)
      .contains('events', [event]);

    if (!hooks?.length) return;

    const body = JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      data: payload,
    });

    await Promise.allSettled(hooks.map(async (hook: any) => {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (hook.secret) {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey('raw', encoder.encode(hook.secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
        headers['X-Omona-Signature'] = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
      }

      const res = await fetch(hook.url, { method: 'POST', headers, body, signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        logger.warn({ hookId: hook.id, status: res.status }, 'Webhook delivery failed');
        // Increment failure count
        await sb().from('webhooks').update({
          last_error: `HTTP ${res.status}`,
          last_error_at: new Date().toISOString(),
        }).eq('id', hook.id);
      } else {
        await sb().from('webhooks').update({
          last_success_at: new Date().toISOString(),
          last_error: null,
        }).eq('id', hook.id);
      }
    }));
  } catch (err) {
    logger.error({ err, orgId, event }, 'Webhook fire error');
  }
}
