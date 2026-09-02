import { Hono } from 'hono';
import { getAgentConfig, upsertAgentConfig } from '../db/queries.js';
import { getAuth, requireRole } from './middleware.js';
import { getSupabase } from '../db/client.js';
import { sanitizeObject } from '../utils/sanitize.js';

export const settingsRoutes = new Hono();

settingsRoutes.get('/', async (c) => {
  const { orgId } = getAuth(c);
  const agentConfig = await getAgentConfig(orgId);
  return c.json({ agent_config: agentConfig });
});

settingsRoutes.put('/', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const body = await c.req.json();
  const sanitized = sanitizeObject(body, ['business_name', 'business_description', 'custom_personality', 'target_audience']);
  const updated = await upsertAgentConfig(orgId, sanitized);
  return c.json(updated);
});

settingsRoutes.put('/agent', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const body = await c.req.json();
  const sanitized = sanitizeObject(body, ['business_name', 'business_description', 'custom_personality', 'target_audience']);
  const updated = await upsertAgentConfig(orgId, sanitized);
  return c.json(updated);
});

// Onboarding status
settingsRoutes.get('/onboarding', async (c) => {
  const { userId } = getAuth(c);
  const { data } = await getSupabase().from('profiles')
    .select('onboarding_completed, onboarding_step')
    .eq('id', userId).single();
  return c.json(data ?? { onboarding_completed: false, onboarding_step: 0 });
});

settingsRoutes.put('/onboarding', async (c) => {
  const { userId } = getAuth(c);
  const { step, completed } = await c.req.json();
  const updates: Record<string, unknown> = {};
  if (step != null) updates.onboarding_step = step;
  if (completed != null) updates.onboarding_completed = completed;
  await getSupabase().from('profiles').update(updates).eq('id', userId);
  return c.json({ ok: true });
});

// Tutorial de 10 pasos. El contador vive en el perfil y no en localStorage,
// para que no reaparezca en cada navegador nuevo del mismo usuario.
// Se muestra mientras tutorial_views < 2.
const TUTORIAL_MAX_VIEWS = 2;

settingsRoutes.post('/tutorial-view', async (c) => {
  const { userId } = getAuth(c);
  const supabase = getSupabase();

  const { data: profile } = await supabase
    .from('profiles')
    .select('tutorial_views')
    .eq('id', userId)
    .single();

  // Se topa en el máximo: sin esto, una pestaña rezagada podría dejar el
  // contador en un número arbitrario.
  const views = Math.min((profile?.tutorial_views ?? 0) + 1, TUTORIAL_MAX_VIEWS);

  await supabase.from('profiles').update({ tutorial_views: views }).eq('id', userId);
  return c.json({ tutorial_views: views });
});

settingsRoutes.post('/tutorial-reset', async (c) => {
  const { userId } = getAuth(c);
  await getSupabase().from('profiles').update({ tutorial_views: 0 }).eq('id', userId);
  return c.json({ tutorial_views: 0 });
});
