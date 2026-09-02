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

/** Plantilla registrada en la WABA, tal como la devuelve Meta. */
export interface MessageTemplate {
  name: string;
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED' | 'DISABLED';
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  /** Texto del cuerpo, con {{1}}, {{2}}… donde van las variables. */
  body: string;
  /** Cuántas variables espera el cuerpo. */
  variables: number;
}

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

  /**
   * Manda una plantilla aprobada. Es la única forma de escribirle a alguien
   * fuera de la ventana de 24 h: el texto libre lo rechaza Meta con el
   * error 131047.
   */
  async sendTemplate(
    creds: CloudApiCreds,
    phoneNumber: string,
    template: { name: string; language: string; params?: string[] },
  ): Promise<{ messageId: string }> {
    const to = phoneNumber.replace(/[^\d]/g, '');
    const params = template.params ?? [];

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
        type: 'template',
        template: {
          name: template.name,
          language: { code: template.language },
          // Meta rechaza un components vacío: sólo se manda si hay variables.
          ...(params.length
            ? { components: [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text })) }] }
            : {}),
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.error(
        { status: res.status, body: body.slice(0, 300), template: template.name, phone: phoneNumber },
        'Cloud API template send failed',
      );
      throw new Error(`cloud_api_template_failed_${res.status}`);
    }
    const json = (await res.json()) as { messages?: { id: string }[] };
    return { messageId: json.messages?.[0]?.id ?? 'unknown' };
  },

  /**
   * Lista las plantillas de la WABA. Primer uso real de `waba_id`, que hasta
   * ahora se guardaba y nunca se leía.
   */
  async listTemplates(creds: CloudApiCreds): Promise<MessageTemplate[]> {
    if (!creds.waba_id) throw new Error('cloud_api_missing_waba_id');

    const url = `${GRAPH}/${creds.waba_id}/message_templates?limit=100`;
    const res = await fetch(url, { headers: { authorization: `Bearer ${creds.access_token}` } });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.error({ status: res.status, body: body.slice(0, 300) }, 'Cloud API list templates failed');
      throw new Error(`cloud_api_templates_failed_${res.status}`);
    }

    const json = (await res.json()) as { data?: RawTemplate[] };
    return (json.data ?? []).map(toTemplate);
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

interface RawTemplate {
  name: string;
  language: string;
  status: string;
  category: string;
  components?: { type: string; text?: string }[];
}

/** Aplana la respuesta de Meta a lo que la interfaz necesita mostrar. */
function toTemplate(raw: RawTemplate): MessageTemplate {
  const body = raw.components?.find((c) => c.type === 'BODY')?.text ?? '';
  // Las variables son {{1}}, {{2}}… y pueden repetirse: cuenta las distintas.
  const distintas = new Set(body.match(/\{\{(\d+)\}\}/g) ?? []);
  return {
    name: raw.name,
    language: raw.language,
    status: raw.status as MessageTemplate['status'],
    category: raw.category as MessageTemplate['category'],
    body,
    variables: distintas.size,
  };
}
