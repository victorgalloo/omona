import { Hono } from 'hono';
import { getAuth } from './middleware.js';
import { getSupabase } from '../db/client.js';

const sb = () => getSupabase();

export const analyticsRoutes = new Hono();

analyticsRoutes.get('/', async (c) => {
  const { orgId } = getAuth(c);

  const [convos, leads, handoffs] = await Promise.all([
    sb().from('conversations').select('id, status, created_at', { count: 'exact' }).eq('organization_id', orgId),
    sb().from('leads').select('id, score, status', { count: 'exact' }).eq('organization_id', orgId),
    sb().from('handoffs').select('id', { count: 'exact' }).eq('organization_id', orgId),
  ]);

  const totalConversations = convos.count ?? 0;
  const activeConversations = (convos.data ?? []).filter(c => c.status === 'active').length;
  const totalLeads = leads.count ?? 0;
  const qualifiedLeads = (leads.data ?? []).filter(l => l.score > 50).length;
  const totalHandoffs = handoffs.count ?? 0;
  const handoffRate = totalConversations > 0 ? Math.round((totalHandoffs / totalConversations) * 100) : 0;
  const avgLeadScore = totalLeads > 0
    ? Math.round((leads.data ?? []).reduce((sum, l) => sum + (l.score || 0), 0) / totalLeads)
    : 0;

  // Conversations by day (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentConvos } = await sb()
    .from('conversations')
    .select('created_at')
    .eq('organization_id', orgId)
    .gte('created_at', thirtyDaysAgo);

  const byDay: Record<string, number> = {};
  for (const conv of recentConvos ?? []) {
    const date = conv.created_at.slice(0, 10);
    byDay[date] = (byDay[date] || 0) + 1;
  }
  const conversationsByDay = Object.entries(byDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Leads by status
  const statusCount: Record<string, number> = {};
  for (const lead of leads.data ?? []) {
    statusCount[lead.status] = (statusCount[lead.status] || 0) + 1;
  }
  const leadsByStatus = Object.entries(statusCount).map(([status, count]) => ({ status, count }));

  return c.json({
    total_conversations: totalConversations,
    active_conversations: activeConversations,
    total_leads: totalLeads,
    qualified_leads: qualifiedLeads,
    total_handoffs: totalHandoffs,
    handoff_rate: handoffRate,
    avg_lead_score: avgLeadScore,
    conversations_by_day: conversationsByDay,
    leads_by_status: leadsByStatus,
  });
});

// ── Conversation Funnel ─────────────────────────────────────────────────
analyticsRoutes.get('/funnel', async (c) => {
  const { orgId } = getAuth(c);

  const { data: leads } = await sb()
    .from('leads')
    .select('status')
    .eq('organization_id', orgId);

  const stages = ['new', 'contacted', 'qualified', 'demo_scheduled', 'converted', 'lost'] as const;
  const counts: Record<string, number> = {};
  stages.forEach(s => { counts[s] = 0; });
  for (const l of leads ?? []) {
    const s = l.status as string;
    if (s in counts) counts[s]!++;
  }

  const labels: Record<string, string> = { new: 'Nuevos', contacted: 'Contactados', qualified: 'Calificados', demo_scheduled: 'Demo agendado', converted: 'Convertidos' };
  const funnelStages = ['new', 'contacted', 'qualified', 'demo_scheduled', 'converted'];
  const funnel = funnelStages.map(stage => ({
    stage,
    count: counts[stage] ?? 0,
    label: labels[stage] || stage,
  }));

  const total = leads?.length ?? 0;
  const converted = counts['converted'] ?? 0;
  const lost = counts['lost'] ?? 0;

  return c.json({
    funnel,
    total_leads: total,
    conversion_rate: total > 0 ? Math.round((converted / total) * 100) : 0,
    lost_rate: total > 0 ? Math.round((lost / total) * 100) : 0,
  });
});

// ── AI Performance Stats ────────────────────────────────────────────────
analyticsRoutes.get('/ai-performance', async (c) => {
  const { orgId } = getAuth(c);

  const [convResult, handoffResult, msgResult] = await Promise.all([
    sb().from('conversations').select('id, status', { count: 'exact' }).eq('organization_id', orgId),
    sb().from('handoffs').select('id, status', { count: 'exact' }).eq('organization_id', orgId),
    sb().from('conversations')
      .select('id')
      .eq('organization_id', orgId)
      .then(async ({ data: convs }) => {
        if (!convs?.length) return { total: 0, aiMessages: 0, avgPerConv: 0 };
        const convIds = convs.map(c => c.id);
        const { count: total } = await sb().from('messages').select('*', { count: 'exact', head: true }).in('conversation_id', convIds);
        const { count: aiMsgs } = await sb().from('messages').select('*', { count: 'exact', head: true }).in('conversation_id', convIds).eq('role', 'assistant');
        return { total: total ?? 0, aiMessages: aiMsgs ?? 0, avgPerConv: convs.length > 0 ? Math.round((total ?? 0) / convs.length) : 0 };
      }),
  ]);

  const totalConvs = convResult.count ?? 0;
  const totalHandoffs = handoffResult.count ?? 0;
  const resolvedWithoutHuman = totalConvs - totalHandoffs;
  const handoffRate = totalConvs > 0 ? Math.round((totalHandoffs / totalConvs) * 100) : 0;
  const resolutionRate = totalConvs > 0 ? Math.round((resolvedWithoutHuman / totalConvs) * 100) : 0;

  return c.json({
    total_conversations: totalConvs,
    total_handoffs: totalHandoffs,
    resolved_without_human: Math.max(0, resolvedWithoutHuman),
    handoff_rate: handoffRate,
    ai_resolution_rate: resolutionRate,
    total_messages: msgResult.total,
    ai_messages: msgResult.aiMessages,
    avg_messages_per_conversation: msgResult.avgPerConv,
  });
});
