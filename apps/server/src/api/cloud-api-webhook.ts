/**
 * Webhook de WhatsApp Cloud API (Meta) — ruta PÚBLICA (la llama Meta).
 *
 *   GET  /webhooks/cloud-api  → verificación del webhook (hub.challenge)
 *   POST /webhooks/cloud-api  → mensajes entrantes → mismo pipeline que Baileys
 *
 * Config en Railway:
 *   WHATSAPP_APP_SECRET      (verificación de firma)
 *   WHATSAPP_VERIFY_TOKEN    (token que pongas en Meta al registrar el webhook)
 */
import { Hono } from 'hono';
import { logger } from '../logger.js';
import { config } from '../config.js';
import { cloudApi, type CloudApiWebhook } from '../whatsapp/cloud-api.js';
import { handleIncomingMessage, type IncomingMessage } from '../whatsapp/message-handler.js';
import { whatsappRouter } from '../whatsapp/router.js';
import * as db from '../db/queries.js';
import { getSupabase } from '../db/client.js';

export const cloudApiWebhookRoutes = new Hono();

/** Config del agente de la org; si no tiene, default del sistema. */
async function agentConfigOf(orgId: string) {
  const cfg = await db.getAgentConfig(orgId);
  if (cfg) return cfg;
  const { DEMO_CONFIG } = await import('../ai/demo-config.js');
  return DEMO_CONFIG;
}

// GET: verificación de suscripción del webhook en Meta App Dashboard
cloudApiWebhookRoutes.get('/', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');
  if (mode === 'subscribe' && token && token === config.WHATSAPP_VERIFY_TOKEN) {
    logger.info('Webhook Cloud API verificado por Meta');
    return new Response(challenge ?? '', { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
});

// POST: mensajes entrantes
cloudApiWebhookRoutes.post('/', async (c) => {
  const raw = await c.req.text();

  // firma HMAC si hay app secret configurado
  if (config.WHATSAPP_APP_SECRET) {
    const sig = c.req.header('x-hub-signature-256') ?? null;
    if (!cloudApi.verifySignature(raw, sig, config.WHATSAPP_APP_SECRET)) {
      logger.warn('Webhook Cloud API con firma inválida');
      return new Response('Forbidden', { status: 403 });
    }
  }

  let payload: CloudApiWebhook;
  try {
    payload = JSON.parse(raw) as CloudApiWebhook;
  } catch {
    return new Response('EVENT_RECEIVED', { status: 200 }); // Meta reintenta si no es 200, pero un body roto no se arregla
  }

  const messages = cloudApi.parseInboundWebhook(payload);

  // 200 inmediato: Meta exige respuesta rápida; el pipeline corre async
  if (messages.length) {
    void (async () => {
      for (const msg of messages) {
        try {
          // resolver org por phone_number_id → whatsapp_sessions.cloud_creds
          const sb = getSupabase();
          const { data: session } = await sb
            .from('whatsapp_sessions')
            .select('organization_id')
            .eq('cloud_creds->>phone_number_id', msg.phoneNumberId)
            .single();
          if (!session?.organization_id) {
            logger.warn({ phoneNumberId: msg.phoneNumberId }, 'Webhook de phone_number_id desconocido');
            continue;
          }
          // ¿el mensaje ya se procesó? (dedup por waMessageId)
          if (await db.messageExists(msg.messageId)) continue;
          await handleIncomingMessage(
            {
              orgId: session.organization_id,
              phoneNumber: msg.from,
              contactName: msg.name,
              messageText: msg.text,
              whatsappMessageId: msg.messageId,
            },
            await agentConfigOf(session.organization_id),
            async (phoneNumber, reply) => {
              await whatsappRouter.sendMessage(session.organization_id, phoneNumber, reply);
            },
          );
        } catch (err) {
          logger.error({ err }, 'Pipeline Cloud API falló');
        }
      }
    })();
  }

  return new Response('EVENT_RECEIVED', { status: 200 });
});
