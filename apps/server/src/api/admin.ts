import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getSupabase } from '../db/client.js';
import { getAuth } from './middleware.js';
import { logger } from '../logger.js';
import { getMessages } from '../db/queries.js';

const sb = () => getSupabase();

/** Supabase joins may return a single object instead of an array — normalise. */
function toArray<T>(val: T | T[] | null | undefined): T[] {
  if (val == null) return [];
  return Array.isArray(val) ? val : [val];
}

export const adminRoutes = new Hono();

adminRoutes.use('/*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
}));

interface AdminProfile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

async function getAuthEmailsByUserId(userIds: string[]): Promise<Map<string, string>> {
  const ids = new Set(userIds);
  const emails = new Map<string, string>();

  if (ids.size === 0) return emails;

  try {
    let page = 1;
    const perPage = 500;

    while (true) {
      const { data, error } = await sb().auth.admin.listUsers({ page, perPage });
      if (error) throw error;

      for (const user of data.users ?? []) {
        if (ids.has(user.id) && user.email) {
          emails.set(user.id, user.email);
        }
      }

      if ((data.users?.length ?? 0) < perPage || emails.size >= ids.size) break;
      page += 1;
    }
  } catch (error) {
    logger.warn({ error }, 'Admin: failed to enrich user emails from auth');
  }

  return emails;
}

// Superadmin guard
adminRoutes.use('/*', async (c, next) => {
  const auth = getAuth(c);
  const { data: profile, error } = await sb()
    .from('profiles')
    .select('is_superadmin')
    .eq('id', auth.userId)
    .single();

  logger.info({ userId: auth.userId, profile, error: error?.message }, 'Admin guard check');

  if (!profile?.is_superadmin) {
    return c.json({ error: 'No autorizado' }, 403);
  }
  return next();
});

// GET /admin/accounts — list all organizations with their users
adminRoutes.get('/accounts', async (c) => {
  const { data: orgs, error } = await sb()
    .from('organizations')
    .select(`
      id, name, slug, plan, trial_ends_at, created_at, updated_at,
      profiles ( id, full_name, role, created_at ),
      agent_configs ( business_name, industry ),
      whatsapp_sessions ( status, phone_number, last_connected_at )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error({ error }, 'Admin: failed to list accounts');
    return c.json({ error: 'Error fetching accounts' }, 500);
  }

  const emailMap = await getAuthEmailsByUserId(
    (orgs || []).flatMap((org) => toArray(org.profiles as AdminProfile | AdminProfile[]).map((profile) => profile.id))
  );

  type WaSession = { status: string; phone_number: string | null; last_connected_at: string | null };

  // For orgs where whatsapp_sessions has no phone_number, try to get it from conversations
  const orgsNeedingPhone = (orgs || []).filter(org => {
    const sessions = toArray(org.whatsapp_sessions as WaSession | WaSession[]);
    return sessions.length === 0 || sessions.every(s => !s.phone_number);
  });

  const conversationPhoneMap = new Map<string, string>();
  if (orgsNeedingPhone.length > 0) {
    const orgIds = orgsNeedingPhone.map(o => o.id);
    const { data: convPhones } = await sb()
      .from('conversations')
      .select('organization_id, phone_number')
      .in('organization_id', orgIds)
      .order('last_message_at', { ascending: false });

    for (const row of convPhones || []) {
      if (row.phone_number && !conversationPhoneMap.has(row.organization_id)) {
        conversationPhoneMap.set(row.organization_id, row.phone_number);
      }
    }
  }

  // Enrich with trial status
  const now = new Date();
  const enriched = (orgs || []).map(org => {
    const sessions = toArray(org.whatsapp_sessions as WaSession | WaSession[]);
    const hasPhoneInSession = sessions.some(s => !!s.phone_number);
    const fallbackPhone = conversationPhoneMap.get(org.id) || null;

    return {
      ...org,
      profiles: toArray(org.profiles as AdminProfile | AdminProfile[]).map((profile) => ({
        ...profile,
        email: emailMap.get(profile.id) || '',
      })),
      whatsapp_sessions: hasPhoneInSession
        ? sessions
        : sessions.length > 0
          ? sessions.map(s => ({ ...s, phone_number: s.phone_number || fallbackPhone }))
          : fallbackPhone
            ? [{ status: 'linked', phone_number: fallbackPhone, last_connected_at: null }]
            : [],
      trialActive: org.plan === 'free' && org.trial_ends_at && new Date(org.trial_ends_at) > now,
      trialExpired: org.plan === 'free' && org.trial_ends_at && new Date(org.trial_ends_at) <= now,
      daysRemaining: org.trial_ends_at
        ? Math.max(0, Math.ceil((new Date(org.trial_ends_at).getTime() - now.getTime()) / 86400000))
        : null,
    };
  });

  return c.json({ accounts: enriched });
});

// GET /admin/accounts/:orgId/conversations — latest conversations with lead emails
adminRoutes.get('/accounts/:orgId/conversations', async (c) => {
  const orgId = c.req.param('orgId');
  const rawLimit = Number.parseInt(c.req.query('limit') || '25', 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 25;

  const { data: conversations, error } = await sb()
    .from('conversations')
    .select('id, phone_number, contact_name, status, summary, unread_count, last_message_at, created_at')
    .eq('organization_id', orgId)
    .order('last_message_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error({ error, orgId }, 'Admin: failed to list account conversations');
    return c.json({ error: 'Error fetching conversations' }, 500);
  }

  const conversationIds = (conversations || []).map((conversation) => conversation.id);
  const leadByConversationId = new Map<string, { name: string | null; email: string | null; company: string | null }>();

  if (conversationIds.length > 0) {
    const { data: leads, error: leadError } = await sb()
      .from('leads')
      .select('conversation_id, name, email, company')
      .eq('organization_id', orgId)
      .in('conversation_id', conversationIds);

    if (leadError) {
      logger.warn({ error: leadError, orgId }, 'Admin: failed to fetch lead emails for conversations');
    } else {
      for (const lead of leads || []) {
        leadByConversationId.set(lead.conversation_id, {
          name: lead.name ?? null,
          email: lead.email ?? null,
          company: lead.company ?? null,
        });
      }
    }
  }

  const enriched = await Promise.all((conversations || []).map(async (conversation) => {
    const { data: lastMessages, error: messageError } = await sb()
      .from('messages')
      .select('content, role, created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (messageError) {
      logger.warn({ error: messageError, conversationId: conversation.id }, 'Admin: failed to fetch last message preview');
    }

    return {
      ...conversation,
      lead: leadByConversationId.get(conversation.id) || null,
      last_message: lastMessages?.[0] || null,
    };
  }));

  return c.json({ conversations: enriched });
});

// GET /admin/accounts/:orgId/conversations/:conversationId — conversation detail with full messages
adminRoutes.get('/accounts/:orgId/conversations/:conversationId', async (c) => {
  const orgId = c.req.param('orgId');
  const conversationId = c.req.param('conversationId');

  const { data: conversation, error } = await sb()
    .from('conversations')
    .select('id, phone_number, contact_name, status, summary, unread_count, last_message_at, created_at, updated_at')
    .eq('id', conversationId)
    .eq('organization_id', orgId)
    .single();

  if (error || !conversation) {
    logger.warn({ error, orgId, conversationId }, 'Admin: conversation not found for account');
    return c.json({ error: 'Conversación no encontrada' }, 404);
  }

  const [messages, leadResult, lastMessageResult] = await Promise.all([
    getMessages(conversationId),
    sb()
      .from('leads')
      .select('id, name, email, company, phone_number, status, score, created_at, updated_at')
      .eq('organization_id', orgId)
      .eq('conversation_id', conversationId)
      .maybeSingle(),
    sb()
      .from('messages')
      .select('content, role, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1),
  ]);

  if (leadResult.error) {
    logger.warn({ error: leadResult.error, orgId, conversationId }, 'Admin: failed to fetch conversation lead');
  }

  if (lastMessageResult.error) {
    logger.warn({ error: lastMessageResult.error, orgId, conversationId }, 'Admin: failed to fetch last message detail');
  }

  return c.json({
    ...conversation,
    lead: leadResult.data || null,
    last_message: lastMessageResult.data?.[0] || null,
    messages,
  });
});

// PATCH /admin/accounts/:orgId — update plan, trial, etc.
adminRoutes.patch('/accounts/:orgId', async (c) => {
  const orgId = c.req.param('orgId');
  const body = await c.req.json();
  const updates: Record<string, unknown> = {};

  if (body.plan) updates.plan = body.plan;
  if (body.trial_ends_at !== undefined) updates.trial_ends_at = body.trial_ends_at;
  updates.updated_at = new Date().toISOString();

  const { error } = await sb()
    .from('organizations')
    .update(updates)
    .eq('id', orgId);

  if (error) {
    logger.error({ error, orgId }, 'Admin: failed to update account');
    return c.json({ error: 'Error updating account' }, 500);
  }

  logger.info({ orgId, updates }, 'Admin: account updated');
  return c.json({ ok: true });
});

// POST /admin/accounts/:orgId/activate — set plan to pro (unlocks trial)
adminRoutes.post('/accounts/:orgId/activate', async (c) => {
  const orgId = c.req.param('orgId');
  const { error } = await sb()
    .from('organizations')
    .update({ plan: 'pro', trial_ends_at: null, updated_at: new Date().toISOString() })
    .eq('id', orgId);

  if (error) return c.json({ error: 'Error activating' }, 500);
  logger.info({ orgId }, 'Admin: account activated (pro)');
  return c.json({ ok: true });
});

// POST /admin/accounts/:orgId/deactivate — set plan back to free with expired trial
adminRoutes.post('/accounts/:orgId/deactivate', async (c) => {
  const orgId = c.req.param('orgId');
  const { error } = await sb()
    .from('organizations')
    .update({
      plan: 'free',
      trial_ends_at: new Date(0).toISOString(), // expired
      updated_at: new Date().toISOString(),
    })
    .eq('id', orgId);

  if (error) return c.json({ error: 'Error deactivating' }, 500);
  logger.info({ orgId }, 'Admin: account deactivated');
  return c.json({ ok: true });
});

// DELETE /admin/accounts/:orgId — delete an organization and all its data
adminRoutes.delete('/accounts/:orgId', async (c) => {
  const { userId } = getAuth(c);
  const orgId = c.req.param('orgId');

  // Prevent deleting your own org
  const { data: profile } = await sb()
    .from('profiles')
    .select('organization_id')
    .eq('id', userId)
    .single();
  if (profile?.organization_id === orgId) {
    return c.json({ error: 'No puedes eliminar tu propia organización' }, 400);
  }

  // Get all conversation IDs for this org to delete messages
  const { data: convs } = await sb()
    .from('conversations')
    .select('id')
    .eq('organization_id', orgId);
  const convIds = (convs || []).map(c => c.id);

  // Delete in order respecting foreign keys
  if (convIds.length > 0) {
    await sb().from('messages').delete().in('conversation_id', convIds);
    await sb().from('handoffs').delete().in('conversation_id', convIds);
    await sb().from('appointments').delete().in('conversation_id', convIds);
  }
  await sb().from('conversations').delete().eq('organization_id', orgId);
  await sb().from('leads').delete().eq('organization_id', orgId);
  await sb().from('broadcast_messages').delete().eq('organization_id', orgId);
  await sb().from('broadcast_campaigns').delete().eq('organization_id', orgId);
  // 'knowledge_documents' tampoco existe en la base: resto de una función que
  // no llegó. Se deja comentado en vez de borrar contra una tabla fantasma.
  // await sb().from('knowledge_documents').delete().eq('organization_id', orgId);
  // La tabla se llama 'webhooks' (migración 007). 'webhook_subscriptions' no
  // existe, así que al borrar una cuenta sus webhooks se quedaban vivos.
  await sb().from('webhooks').delete().eq('organization_id', orgId);
  await sb().from('availability_rules').delete().eq('organization_id', orgId);
  await sb().from('team_invites').delete().eq('organization_id', orgId);
  await sb().from('whatsapp_sessions').delete().eq('organization_id', orgId);
  await sb().from('agent_configs').delete().eq('organization_id', orgId);
  await sb().from('profiles').delete().eq('organization_id', orgId);

  const { error } = await sb().from('organizations').delete().eq('id', orgId);
  if (error) {
    logger.error({ error, orgId }, 'Admin: failed to delete account');
    return c.json({ error: 'Error eliminando cuenta' }, 500);
  }

  logger.info({ orgId, deletedBy: userId }, 'Admin: account deleted');
  return c.json({ ok: true });
});

// POST /admin/accounts/:orgId/extend-trial — extend trial by N days
adminRoutes.post('/accounts/:orgId/extend-trial', async (c) => {
  const orgId = c.req.param('orgId');
  const { days } = await c.req.json();
  if (!days || days < 1) return c.json({ error: 'days required (>=1)' }, 400);

  const { data: org } = await sb()
    .from('organizations')
    .select('plan, trial_ends_at')
    .eq('id', orgId)
    .single();

  if (org?.plan && org.plan !== 'free') {
    return c.json({ error: `No se puede extender trial: la cuenta está en plan ${org.plan}` }, 400);
  }

  const base = org?.trial_ends_at ? new Date(org.trial_ends_at) : new Date();
  const from = base < new Date() ? new Date() : base; // extend from now if already expired
  const newEnd = new Date(from.getTime() + days * 86400000);

  const { error } = await sb()
    .from('organizations')
    .update({ trial_ends_at: newEnd.toISOString(), updated_at: new Date().toISOString() })
    .eq('id', orgId);

  if (error) return c.json({ error: 'Error extending trial' }, 500);
  logger.info({ orgId, days, newEnd }, 'Admin: trial extended');
  return c.json({ ok: true, trial_ends_at: newEnd.toISOString() });
});
