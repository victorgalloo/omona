import { Hono } from 'hono';
import { getWhatsAppSession, upsertWhatsAppSession } from '../db/queries.js';
import { sessionManager } from '../whatsapp/session-manager.js';
import { getAuth, requireRole } from './middleware.js';

export const whatsappRoutes = new Hono();

whatsappRoutes.get('/status', async (c) => {
  const { orgId } = getAuth(c);
  const session = await getWhatsAppSession(orgId);
  return c.json({
    status: session?.status || 'disconnected',
    phone_number: session?.phone_number || null,
    qr_code: session?.qr_code || null,
  });
});

whatsappRoutes.get('/qr', async (c) => {
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
