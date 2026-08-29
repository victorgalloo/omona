import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { config } from './config.js';
import { apiRoutes } from './api/routes.js';
import { cloudApiWebhookRoutes } from './api/cloud-api-webhook.js';
import { generateDemoResponse } from './ai/demo-engine.js';
import { logger } from './logger.js';
import { sessionManager } from './whatsapp/session-manager.js';
import { getSupabase } from './db/client.js';
import { checkStaleConversations } from './services/follow-up.js';
import { checkUpcomingReminders } from './api/calendar.js';
import { widgetRoutes } from './api/widget.js';
import { authHookRoutes } from './api/auth-hooks.js';

async function reconnectActiveSessions(): Promise<void> {
  try {
    const { data, error } = await getSupabase()
      .from('whatsapp_sessions')
      .select('organization_id')
      .in('status', ['connected', 'connecting']);
    if (error) { logger.warn({ error }, 'Failed to fetch whatsapp_sessions for reconnect'); return; }
    for (const row of data ?? []) {
      logger.info({ orgId: row.organization_id }, 'Auto-reconnecting WhatsApp session');
      sessionManager.connect(row.organization_id).catch((err) => logger.warn({ err, orgId: row.organization_id }, 'Auto-reconnect failed'));
    }
  } catch (err) {
    logger.warn({ err }, 'reconnectActiveSessions error');
  }
}

async function main() {
  const app = new Hono();

  app.use('*', cors({
    origin: (origin) => origin || '*',
    credentials: true,
  }));
  app.use('*', honoLogger());

  app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }));

  // Public demo endpoint — no auth required
  app.post('/api/test/demo', async (c) => {
    const { message, conversation_id } = await c.req.json();
    if (!message) return c.json({ error: 'Mensaje requerido' }, 400);
    try {
      const res = await generateDemoResponse(message, conversation_id);
      return c.json(res);
    } catch (error) {
      logger.error({ error }, 'Demo chat error');
      return c.json({ error: 'Error al procesar el mensaje' }, 500);
    }
  });

  // Widget (public, no auth)
  app.route('/widget', widgetRoutes);

  // Auth endpoints (public — signup, reset password, email via Resend)
  app.route('/auth', authHookRoutes);

  // WhatsApp Cloud API webhook (public — lo llama Meta)
  app.route('/webhooks/cloud-api', cloudApiWebhookRoutes);

  // All other API routes require Supabase auth
  app.route('/api', apiRoutes);

  serve({ fetch: app.fetch, port: config.PORT, hostname: '0.0.0.0' }, (info) => {
    logger.info(`🚀 Omona server on http://0.0.0.0:${info.port}`);
  });

  setTimeout(reconnectActiveSessions, 3000);

  // Follow-up automation: check every 4 hours
  setInterval(() => {
    checkStaleConversations().catch((err) => logger.warn({ err }, 'Follow-up check failed'));
  }, 14400000);

  // Appointment reminders: check every hour
  setInterval(() => {
    checkUpcomingReminders().catch((err) => logger.warn({ err }, 'Reminder check failed'));
  }, 3600000);
}

main().catch((err) => { logger.error(err, 'Startup failed'); process.exit(1); });
