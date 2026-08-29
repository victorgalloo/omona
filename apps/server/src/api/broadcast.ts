import { Hono } from 'hono';
import { getAuth, requireRole } from './middleware.js';
import { listLeads } from '../db/queries.js';
import { whatsappRouter } from '../whatsapp/router.js';
import { logger } from '../logger.js';

export const broadcastRoutes = new Hono();

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

broadcastRoutes.post('/', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { message, phone_numbers, filter } = await c.req.json();

  if (!message) return c.json({ error: 'Mensaje requerido' }, 400);

  let phones: string[] = [];

  if (phone_numbers?.length) {
    phones = phone_numbers;
  } else if (filter) {
    const leads = await listLeads(orgId, filter === 'all' ? undefined : filter === 'qualified' ? 'qualified' : 'new');
    phones = leads.map(l => l.phone_number).filter(Boolean);
  }

  if (phones.length === 0) return c.json({ error: 'No hay contactos para enviar', sent: 0, failed: 0 }, 400);

  // Send in background to avoid timeout
  let sent = 0, failed = 0;
  const results: { phone: string; ok: boolean }[] = [];

  for (const phone of phones) {
    try {
      await whatsappRouter.sendMessage(orgId, phone, message);
      sent++;
      results.push({ phone, ok: true });
    } catch (err) {
      failed++;
      results.push({ phone, ok: false });
      logger.warn({ err, phone }, 'Broadcast send failed');
    }
    // Rate limit: 2s between messages
    if (phones.indexOf(phone) < phones.length - 1) await sleep(2000);
  }

  logger.info({ orgId, sent, failed, total: phones.length }, 'Broadcast complete');
  return c.json({ sent, failed, total: phones.length });
});
