import { Hono } from 'hono';
import { listLeads, getLead, updateLead } from '../db/queries.js';
import { getSupabase } from '../db/client.js';
import { getAuth, requireRole } from './middleware.js';

export const leadRoutes = new Hono();

function csvEscape(val: unknown): string {
  return `"${String(val ?? '').replace(/"/g, '""')}"`;
}

leadRoutes.get('/export', async (c) => {
  const { orgId } = getAuth(c);
  const leads = await listLeads(orgId);

  const header = ['name', 'phone', 'email', 'company', 'score', 'status', 'tags', 'created_at'];
  const rows = leads.map((l) => [
    csvEscape(l.name),
    csvEscape(l.phone_number),
    csvEscape(l.email),
    csvEscape(l.company),
    csvEscape(l.score),
    csvEscape(l.status),
    csvEscape(''),
    csvEscape(l.created_at),
  ].join(','));

  const csv = [header.join(','), ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=leads.csv',
    },
  });
});

leadRoutes.get('/', async (c) => {
  const { orgId } = getAuth(c);
  const status = c.req.query('status');
  const leads = await listLeads(orgId, status || undefined);
  return c.json({ data: leads });
});

leadRoutes.get('/:id', async (c) => {
  const { orgId } = getAuth(c);
  const lead = await getLead(orgId, c.req.param('id'));
  if (!lead) return c.json({ error: 'Lead no encontrado' }, 404);
  return c.json(lead);
});

leadRoutes.post('/bulk', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const { ids, action, status } = await c.req.json();
  if (!ids?.length) return c.json({ error: 'IDs requeridos' }, 400);

  const sb = getSupabase();
  if (action === 'update_status' && status) {
    await sb.from('leads').update({ status, updated_at: new Date().toISOString() }).in('id', ids).eq('organization_id', orgId);
  } else if (action === 'delete') {
    await sb.from('leads').delete().in('id', ids).eq('organization_id', orgId);
  } else {
    return c.json({ error: 'Acción no válida' }, 400);
  }
  return c.json({ ok: true, affected: ids.length });
});

leadRoutes.patch('/:id', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const body = await c.req.json();
  const leadId = c.req.param('id');
  if (!await getLead(orgId, leadId)) return c.json({ error: 'Lead no encontrado' }, 404);
  await updateLead(orgId, leadId, body);
  const updated = await getLead(orgId, leadId);
  return c.json(updated);
});

// ── Tags ──────────────────────────────────────────────────────────────────
leadRoutes.post('/:id/tags', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const { tag } = await c.req.json();
  if (!tag) return c.json({ error: 'Tag requerido' }, 400);
  const leadId = c.req.param('id');
  const { data: lead } = await getSupabase().from('leads').select('tags').eq('id', leadId).eq('organization_id', orgId).single();
  if (!lead) return c.json({ error: 'Lead no encontrado' }, 404);
  const tags = [...new Set([...(lead.tags || []), tag])];
  await getSupabase().from('leads').update({ tags }).eq('id', leadId).eq('organization_id', orgId);
  return c.json({ tags });
});

leadRoutes.delete('/:id/tags/:tag', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const leadId = c.req.param('id');
  const tagToRemove = decodeURIComponent(c.req.param('tag'));
  const { data: lead } = await getSupabase().from('leads').select('tags').eq('id', leadId).eq('organization_id', orgId).single();
  if (!lead) return c.json({ error: 'Lead no encontrado' }, 404);
  const tags = (lead.tags || []).filter((t: string) => t !== tagToRemove);
  await getSupabase().from('leads').update({ tags }).eq('id', leadId).eq('organization_id', orgId);
  return c.json({ tags });
});

// ── Assignment ────────────────────────────────────────────────────────────
leadRoutes.post('/:id/assign', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const { user_id } = await c.req.json();
  const leadId = c.req.param('id');
  const { data: updated } = await getSupabase().from('leads').update({ assigned_to: user_id || null, updated_at: new Date().toISOString() }).eq('id', leadId).eq('organization_id', orgId).select().maybeSingle();
  if (!updated) return c.json({ error: 'Lead no encontrado' }, 404);
  return c.json(updated);
});

// ── Custom Fields ─────────────────────────────────────────────────────────
leadRoutes.patch('/:id/custom-fields', requireRole('admin', 'agent'), async (c) => {
  const { orgId } = getAuth(c);
  const fields = await c.req.json();
  const leadId = c.req.param('id');
  const { data: lead } = await getSupabase().from('leads').select('custom_fields').eq('id', leadId).eq('organization_id', orgId).single();
  if (!lead) return c.json({ error: 'Lead no encontrado' }, 404);
  const custom_fields = { ...(lead.custom_fields || {}), ...fields };
  await getSupabase().from('leads').update({ custom_fields, updated_at: new Date().toISOString() }).eq('id', leadId).eq('organization_id', orgId);
  return c.json({ custom_fields });
});

// ── Suggested Replies (AI-powered) ────────────────────────────────────────
leadRoutes.get('/:id/suggested-replies', async (c) => {
  const leadId = c.req.param('id');
  const { orgId } = getAuth(c);
  const lead = await getLead(orgId, leadId);
  if (!lead?.conversation_id) return c.json({ suggestions: [] });

  const { getRecentMessages } = await import('../db/queries.js');
  const { getAgentConfig } = await import('../db/queries.js');
  const [messages, agentConfig] = await Promise.all([
    getRecentMessages(lead.conversation_id, 10),
    getAgentConfig(orgId),
  ]);

  if (!messages.length) return c.json({ suggestions: [] });

  const { chatCompletion } = await import('../ai/client.js');

  const conversationText = messages.map(m => `${m.role === 'user' ? 'Cliente' : 'Agente'}: ${m.content}`).join('\n');

  try {
    const text = await chatCompletion({
      system: `Eres un asistente de ventas para ${agentConfig?.business_name || 'un negocio'}. Genera exactamente 3 respuestas sugeridas cortas (1-2 oraciones), naturales y en español.

Responde SOLO con un JSON array de 3 strings, sin explicación:
["respuesta 1", "respuesta 2", "respuesta 3"]`,
      messages: [{
        role: 'user',
        content: `Basándote en esta conversación, sugiere 3 respuestas:\n\n${conversationText}`,
      }],
      maxTokens: 500,
    });

    const match = text.match(/\[[\s\S]*\]/);
    const suggestions = match ? JSON.parse(match[0]) : [];
    return c.json({ suggestions });
  } catch {
    return c.json({ suggestions: [] });
  }
});
