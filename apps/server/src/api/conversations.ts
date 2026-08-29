import { Hono } from 'hono';
import { listConversations, getConversation, getMessages, updateConversation, addMessage, exportConversations, searchMessages } from '../db/queries.js';
import { getAuth, requireRole } from './middleware.js';
import { getSupabase } from '../db/client.js';
import { whatsappRouter } from '../whatsapp/router.js';
import { logger } from '../logger.js';

export const conversationRoutes = new Hono();

function csvEscape(val: unknown): string {
  return `"${String(val ?? '').replace(/"/g, '""')}"`;
}

conversationRoutes.get('/export', async (c) => {
  const { orgId } = getAuth(c);
  const rows = await exportConversations(orgId);

  const header = ['contact_name', 'phone_number', 'status', 'message_count', 'last_message_at', 'created_at'];
  const csvRows = rows.map((r) => [
    csvEscape(r.contact_name),
    csvEscape(r.phone_number),
    csvEscape(r.status),
    csvEscape(r.message_count),
    csvEscape(r.last_message_at),
    csvEscape(r.created_at),
  ].join(','));

  const csv = [header.join(','), ...csvRows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=conversations.csv',
    },
  });
});

conversationRoutes.get('/search', async (c) => {
  const { orgId } = getAuth(c);
  const q = c.req.query('q') || '';
  if (!q.trim()) return c.json({ data: [] });

  const results = await searchMessages(orgId, q.trim());
  return c.json({ data: results });
});

conversationRoutes.get('/', async (c) => {
  const { orgId } = getAuth(c);
  const status = c.req.query('status');
  const conversations = await listConversations(orgId, status);
  return c.json({ data: conversations });
});

conversationRoutes.get('/:id', async (c) => {
  const conv = await getConversation(c.req.param('id'));
  if (!conv) return c.json({ error: 'Conversación no encontrada' }, 404);
  const messages = await getMessages(conv.id);
  return c.json({ ...conv, messages });
});

conversationRoutes.patch('/:id', requireRole('admin', 'agent'), async (c) => {
  const { orgId, userId } = getAuth(c);
  const body = await c.req.json();
  const convId = c.req.param('id');

  await updateConversation(convId, body);

  // If manually setting to handoff, create a handoff record so the bot stays paused
  if (body.status === 'handoff') {
    const { data: existing } = await getSupabase()
      .from('handoffs')
      .select('id')
      .eq('conversation_id', convId)
      .eq('organization_id', orgId)
      .in('status', ['pending', 'accepted'])
      .limit(1);

    if (!existing?.length) {
      await getSupabase().from('handoffs').insert({
        organization_id: orgId,
        conversation_id: convId,
        reason: 'Toma de control manual',
        status: 'accepted',
        assigned_to: userId,
      });
      logger.info({ convId, orgId, userId }, 'Manual handoff record created');
    }
  }

  // If returning to active from handoff, resolve any open handoffs
  if (body.status === 'active') {
    const { data: openHandoffs } = await getSupabase()
      .from('handoffs')
      .select('id')
      .eq('conversation_id', convId)
      .eq('organization_id', orgId)
      .in('status', ['pending', 'accepted']);

    if (openHandoffs?.length) {
      const { error: handoffError } = await getSupabase()
        .from('handoffs')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .in('id', openHandoffs.map(h => h.id));
      if (handoffError) {
        logger.error({ error: handoffError, convId }, 'Failed to resolve handoffs when returning to bot');
      } else {
        logger.info({ convId, count: openHandoffs.length }, 'Handoffs auto-resolved via return-to-bot');
      }
    }
  }

  const updated = await getConversation(convId);
  return c.json(updated);
});

// Tags
conversationRoutes.post('/:id/tags', requireRole('admin', 'agent'), async (c) => {
  const { tag } = await c.req.json();
  if (!tag) return c.json({ error: 'Tag requerido' }, 400);
  const conv = await getConversation(c.req.param('id'));
  if (!conv) return c.json({ error: 'Not found' }, 404);
  const tags = Array.from(new Set([...(conv.tags || []), tag]));
  await getSupabase().from('conversations').update({ tags }).eq('id', c.req.param('id'));
  return c.json({ tags });
});

conversationRoutes.delete('/:id/tags/:tag', requireRole('admin', 'agent'), async (c) => {
  const conv = await getConversation(c.req.param('id'));
  if (!conv) return c.json({ error: 'Not found' }, 404);
  const tags = (conv.tags || []).filter((t: string) => t !== c.req.param('tag'));
  await getSupabase().from('conversations').update({ tags }).eq('id', c.req.param('id'));
  return c.json({ tags });
});

// Pin/unpin
conversationRoutes.post('/:id/pin', requireRole('admin', 'agent'), async (c) => {
  const conv = await getConversation(c.req.param('id'));
  if (!conv) return c.json({ error: 'Not found' }, 404);
  const pinned = !conv.pinned;
  await getSupabase().from('conversations').update({ pinned }).eq('id', c.req.param('id'));
  return c.json({ pinned });
});

// Mark as read
conversationRoutes.post('/:id/read', async (c) => {
  await getSupabase().from('conversations').update({ unread_count: 0 }).eq('id', c.req.param('id'));
  return c.json({ ok: true });
});

conversationRoutes.post('/:id/send', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const body = await c.req.json();
  const message = body.message || body.content;
  if (!message) return c.json({ error: 'Mensaje requerido' }, 400);
  const conv = await getConversation(c.req.param('id'));
  if (!conv) return c.json({ error: 'Conversación no encontrada' }, 404);
  const msg = await addMessage(conv.id, 'assistant', message);
  let whatsapp_sent = false;
  let whatsapp_error: string | null = null;
  try {
    const storedJid = (conv.metadata as any)?.whatsapp_jid as string | undefined;
    await whatsappRouter.sendMessage(orgId, conv.phone_number, message, storedJid);
    whatsapp_sent = true;
    logger.info({ orgId, convId: conv.id, phone: conv.phone_number, jid: storedJid }, 'Human reply sent to WhatsApp');
  } catch (err: any) {
    whatsapp_error = err.message || 'Error desconocido';
    logger.error({ err, orgId, convId: conv.id, phone: conv.phone_number }, 'WhatsApp send failed, message saved to DB only');
  }
  return c.json({ ...msg, whatsapp_sent, whatsapp_error });
});
