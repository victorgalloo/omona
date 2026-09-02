import { Hono } from 'hono';
import { getWhatsAppSession, upsertWhatsAppSession } from '../db/queries.js';
import { sessionManager } from '../whatsapp/session-manager.js';
import { whatsappRouter, type WhatsAppProvider } from '../whatsapp/router.js';
import { getAuth, requireRole } from './middleware.js';
import { logger } from '../logger.js';

export const whatsappRoutes = new Hono();

const PROVIDERS: WhatsAppProvider[] = ['baileys', 'cloud_api'];

whatsappRoutes.get('/status', async (c) => {
  const { orgId, role } = getAuth(c);
  const session = await getWhatsAppSession(orgId);
  const provider = await whatsappRouter.providerOf(orgId);
  return c.json({
    provider,
    status: session?.status || 'disconnected',
    phone_number: session?.phone_number || null,
    // El QR vincula un teléfono a la organización: quien no puede administrar
    // no debería poder escanearlo. El estado sí lo ve todo el equipo.
    qr_code: role === 'admin' ? (session?.qr_code || null) : null,
  });
});

whatsappRoutes.get('/qr', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const session = await getWhatsAppSession(orgId);
  return c.json({
    qr_code: session?.qr_code || null,
    status: session?.status || 'disconnected',
  });
});

whatsappRoutes.post('/connect', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  await upsertWhatsAppSession(orgId, { status: 'connecting', qr_code: null });
  sessionManager.connect(orgId).catch(async (err) => {
    console.error('WhatsApp connect error:', err);
    await upsertWhatsAppSession(orgId, { status: 'error' });
  });
  return c.json({ status: 'connecting' });
});

whatsappRoutes.post('/disconnect', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  await sessionManager.disconnect(orgId);
  return c.json({ ok: true, status: 'disconnected' });
});

whatsappRoutes.post('/reset', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  // Force disconnect + clear auth state
  try { await sessionManager.disconnect(orgId); } catch {}
  await upsertWhatsAppSession(orgId, { status: 'disconnected', qr_code: null, phone_number: null });
  return c.json({ ok: true, status: 'disconnected', message: 'Sesión reseteada. Puedes volver a conectar.' });
});

/**
 * Canal de la organización. `whatsappRouter.setProvider` existía desde el
 * modo dual pero nunca tuvo una ruta que lo llamara, así que en la práctica
 * todas las organizaciones quedaban clavadas en el default 'baileys'.
 */
whatsappRoutes.post('/provider', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { provider } = await c.req.json();

  // setOrganizationWhatsAppProvider recibe un string pelón; sin esta guarda,
  // un valor inválido llega hasta el CHECK de Postgres.
  if (!PROVIDERS.includes(provider)) {
    return c.json({ error: `provider debe ser uno de: ${PROVIDERS.join(', ')}` }, 400);
  }

  await whatsappRouter.setProvider(orgId, provider);
  logger.info({ orgId, provider }, 'Canal de WhatsApp cambiado');
  return c.json({ ok: true, provider });
});

/**
 * Credenciales de la API oficial de Meta.
 *
 * Enviar sólo necesita phone_number_id y access_token; waba_id se exige
 * porque es lo que permite listar las plantillas aprobadas.
 */
whatsappRoutes.post('/cloud-credentials', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { phone_number_id, waba_id, access_token, display_name } = await c.req.json();

  const faltan = [
    !phone_number_id && 'phone_number_id',
    !waba_id && 'waba_id',
    !access_token && 'access_token',
  ].filter(Boolean);

  if (faltan.length) {
    return c.json({ error: `Faltan credenciales: ${faltan.join(', ')}` }, 400);
  }

  await whatsappRouter.setCloudCreds(orgId, {
    phone_number_id, waba_id, access_token, display_name: display_name ?? null,
  });

  // setCloudCreds sólo escribe whatsapp_sessions.provider, pero el router lee
  // organizations.whatsapp_provider. Sin esta segunda llamada las credenciales
  // se guardan y los mensajes siguen saliendo por Baileys.
  await whatsappRouter.setProvider(orgId, 'cloud_api');

  logger.info({ orgId, phone_number_id }, 'Credenciales de Cloud API guardadas');
  return c.json({ ok: true, provider: 'cloud_api' });
});
