import { Hono } from 'hono';
import { listHandoffs, updateHandoff, getConversation, updateConversation } from '../db/queries.js';
import { getAuth, requireRole } from './middleware.js';
import { whatsappRouter } from '../whatsapp/router.js';
import { logger } from '../logger.js';

export const handoffRoutes = new Hono();

handoffRoutes.get('/', async (c) => {
  const { orgId } = getAuth(c);
  const status = c.req.query('status');
  const handoffs = await listHandoffs(orgId, status || undefined);
  return c.json({ data: handoffs });
});

handoffRoutes.post('/:id/accept', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const handoffId = c.req.param('id');

  const handoffs = await listHandoffs(orgId);
  const handoff = handoffs.find((h) => h.id === handoffId);

  if (handoff?.conversation_id) {
    const conv = await getConversation(orgId, handoff.conversation_id);
    if (conv?.phone_number) {
      try {
        const storedJid = (conv.metadata as any)?.whatsapp_jid as string | undefined;
        await whatsappRouter.sendMessage(
          orgId,
          conv.phone_number,
          'Un agente humano tomará tu conversación. Te atenderemos en breve.',
          storedJid,
        );
      } catch (err) {
        logger.warn({ err }, 'Failed to send accept WhatsApp message to customer');
      }
    }
    await updateConversation(orgId, handoff.conversation_id, { status: 'handoff' } as any);
  }

  await updateHandoff(orgId, handoffId, { status: 'accepted' });
  return c.json({ ok: true });
});

handoffRoutes.post('/:id/resolve', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const handoffId = c.req.param('id');

  const handoffs = await listHandoffs(orgId);
  const handoff = handoffs.find((h) => h.id === handoffId);
  if (!handoff) {
    return c.json({ error: 'Handoff no encontrado' }, 404);
  }

  // Mark handoff as resolved FIRST so the self-healing in processIncomingMessage
  // can detect there are no active handoffs and auto-recover the conversation
  await updateHandoff(orgId, handoffId, { status: 'resolved', resolved_at: new Date().toISOString() });

  if (handoff.conversation_id) {
    // Always set conversation back to active, even if WhatsApp send fails
    try {
      await updateConversation(orgId, handoff.conversation_id, { status: 'active' } as any);
      logger.info({ conversationId: handoff.conversation_id, orgId }, 'Handoff resolved, conversation set back to active');
    } catch (err) {
      logger.error({ err, conversationId: handoff.conversation_id }, 'Failed to set conversation back to active');
    }

    const conv = await getConversation(orgId, handoff.conversation_id);
    if (conv?.phone_number) {
      try {
        const storedJid = (conv.metadata as any)?.whatsapp_jid as string | undefined;
        await whatsappRouter.sendMessage(
          orgId,
          conv.phone_number,
          'Tu consulta ha sido resuelta. Si necesitas algo más, ¡escríbenos!',
          storedJid,
        );
      } catch (err) {
        logger.warn({ err }, 'Failed to send resolve WhatsApp message to customer');
      }
    }
  }

  return c.json({ ok: true });
});
