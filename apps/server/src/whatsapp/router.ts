/**
 * Router de mensajería dual: decide el canal por organización.
 *
 *   organizations.whatsapp_provider = 'baileys'   → sessionManager (QR, número personal)
 *                                    = 'cloud_api' → cloudApi driver (número oficial Meta)
 *
 * Todos los puntos de envío (conversaciones, broadcast, calendar, handoff,
 * notifications) llaman a whatsappRouter.sendMessage() — nunca a un driver directo.
 * El webhook entrante de Meta llega a /api/webhooks/cloud-api y entra al mismo
 * pipeline processIncomingMessage() que Baileys.
 */
import * as db from '../db/queries.js';
import { sessionManager } from './session-manager.js';
import { cloudApi, type CloudApiCreds } from './cloud-api.js';
import { logger } from '../logger.js';

export type WhatsAppProvider = 'baileys' | 'cloud_api';

/** Cache corto de provider por org (evita query por mensaje). 60s TTL. */
const providerCache = new Map<string, { provider: WhatsAppProvider; at: number }>();
const TTL_MS = 60_000;

async function providerOf(orgId: string): Promise<WhatsAppProvider> {
  const hit = providerCache.get(orgId);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.provider;
  let provider: WhatsAppProvider = 'baileys';
  try {
    const stored = await db.getOrganizationWhatsAppProvider(orgId);
    provider = stored === 'cloud_api' ? 'cloud_api' : 'baileys';
  } catch (err) {
    logger.warn({ err, orgId }, 'No pude leer provider de la org; default baileys');
  }
  providerCache.set(orgId, { provider, at: Date.now() });
  return provider;
}

function invalidate(orgId: string): void {
  providerCache.delete(orgId);
}

export const whatsappRouter = {
  /** Envía un mensaje por el canal configurado de la org. */
  async sendMessage(orgId: string, phoneNumber: string, text: string, jid?: string): Promise<void> {
    const provider = await providerOf(orgId);
    if (provider === 'cloud_api') {
      const creds = await getCloudCreds(orgId);
      await cloudApi.sendMessage(creds, phoneNumber, text);
      return;
    }
    await sessionManager.sendMessage(orgId, phoneNumber, text, jid);
  },

  /** Estado de conexión uniforme para el dashboard. */
  async status(orgId: string): Promise<{
    provider: WhatsAppProvider;
    connected: boolean;
    qr?: string | null;
    display_name?: string | null;
  }> {
    const provider = await providerOf(orgId);
    const session = await db.getWhatsAppSession(orgId);
    if (provider === 'cloud_api') {
      const creds = session?.cloud_creds as CloudApiCreds | undefined;
      const ok = !!(creds?.phone_number_id && creds?.access_token);
      return { provider, connected: ok, display_name: creds?.display_name ?? null };
    }
    return {
      provider,
      connected: session?.status === 'connected',
      qr: session?.qr_code ?? null,
    };
  },

  /** Guarda/actualiza credenciales Cloud API de una org (onboarding oficial). */
  async setCloudCreds(orgId: string, creds: CloudApiCreds): Promise<void> {
    await db.upsertWhatsAppSession(orgId, {
      status: 'connected',
      provider: 'cloud_api',
      cloud_creds: creds as unknown as Record<string, unknown>,
    });
    invalidate(orgId);
    logger.info({ orgId, phoneNumberId: creds.phone_number_id }, 'Cloud API creds guardadas');
  },

  /** Cambia el canal de la org (dashboard: settings → canales). */
  async setProvider(orgId: string, provider: WhatsAppProvider): Promise<void> {
    await db.setOrganizationWhatsAppProvider(orgId, provider);
    invalidate(orgId);
  },

  /** Invalida el cache cuando cambia algo de la org. */
  invalidate,
};

/** Lee las credenciales Cloud API de la org desde whatsapp_sessions. */
async function getCloudCreds(orgId: string): Promise<CloudApiCreds> {
  const session = await db.getWhatsAppSession(orgId);
  const creds = session?.cloud_creds as CloudApiCreds | undefined;
  if (!creds?.phone_number_id || !creds?.access_token) {
    throw new Error('cloud_api_not_configured');
  }
  return creds;
}
