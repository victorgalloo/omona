import { Hono } from 'hono';
import { getAuth } from './middleware.js';
import { getSupabase } from '../db/client.js';

export const deviceTokenRoutes = new Hono();

deviceTokenRoutes.post('/', async (c) => {
  const { userId, orgId } = getAuth(c);
  const { token, platform = 'ios' } = await c.req.json();

  if (!token) return c.json({ error: 'Token requerido' }, 400);

  await getSupabase()
    .from('device_tokens')
    .upsert({ user_id: userId, organization_id: orgId, token, platform }, { onConflict: 'user_id,token' });

  return c.json({ ok: true });
});

deviceTokenRoutes.delete('/', async (c) => {
  const { userId } = getAuth(c);
  const { token } = await c.req.json();

  if (!token) return c.json({ error: 'Token requerido' }, 400);

  await getSupabase().from('device_tokens').delete().eq('user_id', userId).eq('token', token);

  return c.json({ ok: true });
});
