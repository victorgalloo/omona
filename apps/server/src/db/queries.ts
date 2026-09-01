import { getSupabase } from './client.js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AgentConfig, Conversation, Message, Lead, Handoff, Product, FAQ } from '@omona/shared';

const sb = () => getSupabase();

// ============================================================================
// Organizations
// ============================================================================

export async function getOrCreateDefaultOrg() {
  const { data } = await sb().from('organizations').select('*').eq('slug', 'default').single();
  if (data) return data as { id: string; name: string; slug: string };

  const { data: created, error } = await sb().from('organizations').insert({ name: 'Mi Empresa', slug: 'default' }).select().single();
  if (error) throw error;
  return created as { id: string; name: string; slug: string };
}

// ============================================================================
// Agent Config
// ============================================================================

export async function getAgentConfig(orgId: string): Promise<AgentConfig | null> {
  const { data } = await sb().from('agent_configs').select('*').eq('organization_id', orgId).single();
  if (!data) return null;
  return { ...data, products_services: (data.products_services || []) as Product[], faqs: (data.faqs || []) as FAQ[] };
}

export async function upsertAgentConfig(orgId: string, updates: Partial<AgentConfig>): Promise<AgentConfig> {
  const existing = await getAgentConfig(orgId);
  if (existing) {
    const { data, error } = await sb().from('agent_configs').update({ ...updates, updated_at: new Date().toISOString() }).eq('organization_id', orgId).select().single();
    if (error) throw error;
    return { ...data, products_services: data.products_services || [], faqs: data.faqs || [] };
  } else {
    const { data, error } = await sb().from('agent_configs').insert({ organization_id: orgId, ...updates }).select().single();
    if (error) throw error;
    return { ...data, products_services: data.products_services || [], faqs: data.faqs || [] };
  }
}

// ============================================================================
// Conversations
// ============================================================================

export async function getOrCreateConversation(
  orgId: string,
  phoneNumber: string,
  contactName?: string,
  client?: SupabaseClient,
): Promise<Conversation> {
  const database = client ?? sb();
  const { data } = await database.from('conversations').select('*').eq('organization_id', orgId).eq('phone_number', phoneNumber).single();
  if (data) {
    if (contactName && !data.contact_name) {
      await database
        .from('conversations')
        .update({ contact_name: contactName })
        .eq('id', data.id)
        .eq('organization_id', orgId);
      data.contact_name = contactName;
    }
    return { ...data, metadata: data.metadata || {} };
  }
  const { data: created, error } = await database.from('conversations').insert({ organization_id: orgId, phone_number: phoneNumber, contact_name: contactName || null }).select().single();
  if (error) throw error;
  return { ...created, metadata: created.metadata || {} };
}

export async function listConversations(orgId: string, status?: string) {
  let query = sb().from('conversations').select('*').eq('organization_id', orgId);
  if (status && status !== 'all') query = query.eq('status', status);
  query = query.order('last_message_at', { ascending: false });
  const { data: convs } = await query;
  if (!convs) return [];

  const results = [];
  for (const c of convs) {
    const { data: msgs } = await sb().from('messages').select('*').eq('conversation_id', c.id).order('created_at', { ascending: false }).limit(1);
    results.push({ ...c, metadata: c.metadata || {}, last_message: msgs?.[0] ? { ...msgs[0], metadata: msgs[0].metadata || {} } : undefined });
  }
  return results;
}

export async function getConversation(
  orgId: string,
  convId: string,
  client: SupabaseClient = sb(),
): Promise<Conversation | null> {
  const { data } = await client
    .from('conversations')
    .select('*')
    .eq('id', convId)
    .eq('organization_id', orgId)
    .single();
  if (!data) return null;
  return { ...data, metadata: data.metadata || {} };
}

export async function updateConversation(
  orgId: string,
  convId: string,
  updates: Partial<Conversation>,
  client: SupabaseClient = sb(),
): Promise<void> {
  const { error } = await client
    .from('conversations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', convId)
    .eq('organization_id', orgId);
  if (error) throw new Error(`updateConversation failed for ${convId}: ${error.message}`);
}

// ============================================================================
// Messages
// ============================================================================

export async function addMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string, waMessageId?: string, metadata?: Record<string, unknown>): Promise<Message> {
  const { data, error } = await sb().from('messages').insert({ conversation_id: conversationId, role, content, whatsapp_message_id: waMessageId || null, metadata: metadata || {} }).select().single();
  if (error) throw error;
  await sb().from('conversations').update({ last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', conversationId);
  return { ...data, metadata: data.metadata || {} };
}

export async function getRecentMessages(conversationId: string, limit: number = 20): Promise<Message[]> {
  const { data } = await sb().from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: false }).limit(limit);
  return (data || []).reverse().map(m => ({ ...m, metadata: m.metadata || {} }));
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await sb().from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  return (data || []).map(m => ({ ...m, metadata: m.metadata || {} }));
}

export async function messageExists(waMessageId: string): Promise<boolean> {
  const { data } = await sb().from('messages').select('id').eq('whatsapp_message_id', waMessageId).limit(1);
  return (data?.length ?? 0) > 0;
}

// ============================================================================
// Leads
// ============================================================================

export async function getOrCreateLead(
  orgId: string,
  conversationId: string,
  phoneNumber: string,
  client?: SupabaseClient,
): Promise<Lead> {
  const database = client ?? sb();
  const { data } = await database
    .from('leads')
    .select('*')
    .eq('organization_id', orgId)
    .eq('conversation_id', conversationId)
    .single();
  if (data) return data;

  const { data: created, error } = await database
    .from('leads')
    .insert({ organization_id: orgId, conversation_id: conversationId, phone_number: phoneNumber })
    .select()
    .single();
  if (error) throw error;

  await database
    .from('conversations')
    .update({ lead_id: created.id })
    .eq('id', conversationId)
    .eq('organization_id', orgId);
  return created;
}

export async function updateLead(
  orgId: string,
  leadId: string,
  updates: Partial<Lead>,
  client: SupabaseClient = sb(),
): Promise<void> {
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(updates)) {
    if (v !== null && v !== undefined) clean[k] = v;
  }
  if (Object.keys(clean).length === 0) return;
  clean.updated_at = new Date().toISOString();
  const { error } = await client.from('leads').update(clean).eq('id', leadId).eq('organization_id', orgId);
  if (error) throw new Error(`updateLead failed for ${leadId}: ${error.message}`);
}

export async function updateLeadScore(orgId: string, leadId: string, delta: number): Promise<void> {
  const { data } = await sb().from('leads').select('score').eq('id', leadId).eq('organization_id', orgId).single();
  if (!data) return;
  const newScore = Math.max(0, Math.min(100, (data.score || 0) + delta));
  await sb().from('leads').update({ score: newScore, updated_at: new Date().toISOString() }).eq('id', leadId).eq('organization_id', orgId);
}

export async function listLeads(orgId: string, status?: string): Promise<Lead[]> {
  let query = sb().from('leads').select('*').eq('organization_id', orgId);
  if (status) query = query.eq('status', status);
  query = query.order('updated_at', { ascending: false });
  const { data } = await query;
  return data || [];
}

export async function getLead(
  orgId: string,
  leadId: string,
  client: SupabaseClient = sb(),
): Promise<Lead | null> {
  const { data } = await client
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('organization_id', orgId)
    .single();
  return data || null;
}

// ============================================================================
// Handoffs
// ============================================================================

export async function createHandoff(orgId: string, conversationId: string, reason: string): Promise<Handoff> {
  const { data, error } = await sb().from('handoffs').insert({ organization_id: orgId, conversation_id: conversationId, reason }).select().single();
  if (error) throw error;
  await updateConversation(orgId, conversationId, { status: 'handoff' } as any);
  return data;
}

export async function listHandoffs(orgId: string, status?: string) {
  let query = sb().from('handoffs').select('*').eq('organization_id', orgId);
  if (status) query = query.eq('status', status);
  query = query.order('created_at', { ascending: false });
  const { data } = await query;
  if (!data) return [];
  const results = [];
  for (const h of data) {
    const conv = await getConversation(orgId, h.conversation_id);
    results.push({ ...h, conversation: conv });
  }
  return results;
}

export async function updateHandoff(
  orgId: string,
  handoffId: string,
  updates: { status?: string; assigned_to?: string; resolved_at?: string },
  client: SupabaseClient = sb(),
): Promise<void> {
  const { error } = await client.from('handoffs').update(updates).eq('id', handoffId).eq('organization_id', orgId);
  if (error) throw new Error(`updateHandoff failed for ${handoffId}: ${error.message}`);
}

// ============================================================================
// Export / Search helpers
// ============================================================================

export async function exportConversations(orgId: string) {
  const { data: convs } = await sb()
    .from('conversations')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });
  if (!convs) return [];

  const results = [];
  for (const c of convs) {
    const { count } = await sb()
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('conversation_id', c.id);
    const { data: lastMsgs } = await sb()
      .from('messages')
      .select('content, created_at')
      .eq('conversation_id', c.id)
      .order('created_at', { ascending: false })
      .limit(1);
    results.push({
      contact_name: c.contact_name ?? '',
      phone_number: c.phone_number,
      status: c.status,
      message_count: count ?? 0,
      last_message_at: c.last_message_at,
      created_at: c.created_at,
    });
  }
  return results;
}

export async function searchMessages(orgId: string, query: string) {
  const { data: convs } = await sb()
    .from('conversations')
    .select('id, contact_name, phone_number, status, last_message_at')
    .eq('organization_id', orgId);
  if (!convs || convs.length === 0) return [];

  const convMap = new Map(convs.map((c) => [c.id, c]));
  const convIds = [...convMap.keys()];

  const { data: messages } = await sb()
    .from('messages')
    .select('id, conversation_id, content, created_at')
    .in('conversation_id', convIds)
    .ilike('content', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20);

  if (!messages || messages.length === 0) return [];

  const seen = new Set<string>();
  const results = [];
  for (const msg of messages) {
    if (seen.has(msg.conversation_id)) continue;
    seen.add(msg.conversation_id);
    const conv = convMap.get(msg.conversation_id);
    if (!conv) continue;
    results.push({
      id: conv.id,
      contact_name: conv.contact_name,
      phone_number: conv.phone_number,
      status: conv.status,
      last_message_at: conv.last_message_at,
      matching_message: {
        content: msg.content,
        created_at: msg.created_at,
      },
    });
  }
  return results;
}

// ============================================================================
// WhatsApp Sessions
// ============================================================================

export async function getWhatsAppSession(orgId: string) {
  const { data } = await sb().from('whatsapp_sessions').select('*').eq('organization_id', orgId).single();
  return data;
}

export async function upsertWhatsAppSession(orgId: string, updates: { status?: string; qr_code?: string | null; phone_number?: string | null; metadata?: Record<string, unknown>; provider?: string; cloud_creds?: Record<string, unknown> }): Promise<void> {
  const existing = await getWhatsAppSession(orgId);
  if (existing) {
    await sb().from('whatsapp_sessions').update({ ...updates, updated_at: new Date().toISOString() }).eq('organization_id', orgId);
  } else {
    await sb().from('whatsapp_sessions').insert({ organization_id: orgId, ...updates });
  }
}

/** Canal WhatsApp de la org ('baileys' | 'cloud_api'). */
export async function getOrganizationWhatsAppProvider(orgId: string): Promise<string | null> {
  const { data } = await sb().from('organizations').select('whatsapp_provider').eq('id', orgId).single();
  return data?.whatsapp_provider ?? null;
}

export async function setOrganizationWhatsAppProvider(orgId: string, provider: string): Promise<void> {
  await sb().from('organizations').update({ whatsapp_provider: provider, updated_at: new Date().toISOString() }).eq('id', orgId);
}
