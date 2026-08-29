/**
 * Driver de WhatsApp Cloud API (Meta oficial).
 *
 * Segundo canal del sistema dual:
 *   - baileys   → onboarding rápido (QR, número personal del cliente)
 *   - cloud_api → canal oficial (número business verificado, sin riesgo de ban)
 *
 * La org elige su canal en `organizations.whatsapp_provider` ('baileys' | 'cloud_api').
 * Las credenciales de Cloud API viven en `whatsapp_sessions`:
 *   { phone_number_id, waba_id, access_token (cifrado en reposo por Supabase), display_name }
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { logger } from '../logger.js';

const GRAPH = 'https://graph.facebook.com/v21.0';

export interface CloudApiCreds {
  phone_number_id: string;
  waba_id?: string | null;
  access_token: string;
  display_name?: string | null;
}

export const cloudApi = {
  /**
   * Envía un texto por Cloud API. Lanza si Meta rechaza (la capa superior
   * decide reintentar o notificar).
   */
  async sendMessage(
    creds: CloudApiCreds,
    phoneNumber: string,
    text: string,
  ): Promise<{ messageId: string }> {
    const to = phoneNumber.replace(/[^\d]/g, '');
    const res = await fetch(`${GRAPH}/${creds.phone_number_id}/messages`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${creds.access_token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { preview_url: true, body: text },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.error(
        { status: res.status, body: body.slice(0, 300), phone: phoneNumber },
        'Cloud API send failed',
      );
      throw new Error(`cloud_api_send_failed_${res.status}`);
    }
    const json = (await res.json()) as { messages?: { id: string }[] };
    return { messageId: json.messages?.[0]?.id ?? 'unknown' };
  },

  /** Verifica la firma del webhook (X-Hub-Signature-256) contra el app secret. */
  verifySignature(rawBody: string, signature: string | null, appSecret: string): boolean {
    if (!signature?.startsWith('sha256=')) return false;
    // crypto viene de node:crypto (server Node, no Workers)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createHmac, timingSafeEqual } = require('node:crypto') as typeof import('node:crypto');
    const expected = createHmac('sha256', appSecret).update(rawBody).digest('hex');
    const got = signature.slice(7);
    if (expected.length !== got.length) return false;
    return timingSafeEqual(Buffer.from(expected), Buffer.from(got));
  },

  /**
   * Normaliza un webhook entrante de Cloud API a la forma que el pipeline
   * de conversación ya consume.
   */
  parseInboundWebhook(payload: CloudApiWebhook): IncomingMessage[] {
    const out: IncomingMessage[] = [];
    const entries = (payload.entry ?? []) as {
      changes?: { value?: WebhookValue }[];
    }[];
    for (const entry of entries) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        if (!value || !value.messages) continue;
        for (const m of value.messages) {
          // ignorar estados (sent/delivered/read) y mensajes de sistema
          if (m.type !== 'text') continue;
          out.push({
            phoneNumberId: value.metadata?.phone_number_id ?? '',
            from: m.from,
            name: value.contacts?.[0]?.profile?.name ?? m.from,
            text: m.text?.body ?? '',
            messageId: m.id,
            timestamp: new Date(Number(m.timestamp) * 1000),
          });
        }
      }
    }
    return out;
  },

  /** Respuesta al webhook: Meta exige 200 rápido; el pipeline corre async. */
  ack(): Response {
    return new Response('EVENT_RECEIVED', { status: 200 });
  },
};

// ── Tipos mínimos del webhook de Meta ──

export interface CloudApiWebhook {
  entry?: {
    changes?: {
      value?: WebhookValue;
    }[];
  };
}

export interface WebhookValue {
  contacts?: { profile?: { name?: string } }[];
  messages?: {
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text?: { body?: string };
  }[];
  metadata?: { phone_number_id?: string };
}

export interface IncomingMessage {
  phoneNumberId: string;
  from: string;
  name: string;
  text: string;
  messageId: string;
  timestamp: Date;
}
