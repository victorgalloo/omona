import { Hono } from 'hono';
import { getAuth, requireRole } from './middleware.js';
import { getSupabase } from '../db/client.js';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { emailFrom } from '../services/email.js';

const sb = () => getSupabase();

export const teamRoutes = new Hono();

// List team members
teamRoutes.get('/members', async (c) => {
  const { orgId } = getAuth(c);
  const { data } = await sb().from('profiles')
    .select('id, full_name, role, created_at')
    .eq('organization_id', orgId)
    .order('created_at');

  // Enrich with emails from Supabase Auth (profiles may not have email column)
  const members = await Promise.all(
    (data ?? []).map(async (profile) => {
      let email = '';
      try {
        const { data: { user } } = await sb().auth.admin.getUserById(profile.id);
        email = user?.email ?? '';
      } catch {}
      return { ...profile, email };
    })
  );

  return c.json({ data: members });
});

// List pending invites
teamRoutes.get('/invites', async (c) => {
  const { orgId } = getAuth(c);
  const { data } = await sb().from('team_invites')
    .select('id, email, role, status, created_at, expires_at')
    .eq('organization_id', orgId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  return c.json({ data: data ?? [] });
});

// Send invite (admin only)
teamRoutes.post('/invites', requireRole('admin'), async (c) => {
  const { orgId, userId } = getAuth(c);
  const { email, role } = await c.req.json();

  if (!email) return c.json({ error: 'Email requerido' }, 400);
  const validRoles = ['admin', 'agent', 'viewer'];
  const inviteRole = validRoles.includes(role) ? role : 'agent';

  // Check if already a member — look up the auth user by email via admin API
  try {
    const { data: { users } } = await sb().auth.admin.listUsers({ perPage: 1000 });
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      const { data: existingProfile } = await sb().from('profiles')
        .select('id').eq('id', existingUser.id).eq('organization_id', orgId).single();
      if (existingProfile) return c.json({ error: 'Este usuario ya es miembro del equipo' }, 409);
    }
  } catch {
    // Fall through — duplicate check is best-effort; the invite upsert handles conflicts
  }

  // Upsert invite (re-sends if pending)
  const { data: invite, error } = await sb().from('team_invites').upsert({
    organization_id: orgId,
    email,
    role: inviteRole,
    invited_by: userId,
    status: 'pending',
    token: crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, ''),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }, { onConflict: 'organization_id,email' }).select().single();

  if (error) return c.json({ error: error.message }, 500);

  // Send invite email via Resend
  if (config.RESEND_API_KEY && invite) {
    try {
      const dashboardUrl = config.DASHBOARD_URL;
      const inviteUrl = `${dashboardUrl}/auth/invite?token=${invite.token}`;

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom(),
          to: [email],
          subject: 'Te invitaron a Omona',
          html: `
            <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:32px 20px">
              <div style="text-align:center;margin-bottom:24px">
                <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background:#25D366">
                  <span style="color:white;font-weight:bold;font-size:20px">L</span>
                </div>
              </div>
              <h2 style="text-align:center;color:#111B21;margin:0 0 8px">Te invitaron a Omona</h2>
              <p style="text-align:center;color:#667781;font-size:14px;margin:0 0 24px">
                Únete al equipo como <strong>${inviteRole}</strong> y empieza a gestionar conversaciones de ventas.
              </p>
              <div style="text-align:center">
                <a href="${inviteUrl}" style="display:inline-block;background:#25D366;color:white;text-decoration:none;padding:12px 32px;border-radius:12px;font-weight:600;font-size:14px">
                  Aceptar invitación
                </a>
              </div>
              <p style="text-align:center;color:#667781;font-size:12px;margin-top:24px">
                Este enlace expira en 7 días.
              </p>
            </div>
          `,
        }),
      });
      logger.info({ email, orgId, role: inviteRole }, 'Team invite email sent');
    } catch (err) {
      logger.warn({ err, email }, 'Failed to send invite email');
    }
  }

  return c.json(invite, 201);
});

// Revoke invite (admin only)
teamRoutes.delete('/invites/:id', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  await sb().from('team_invites').delete().eq('id', c.req.param('id')).eq('organization_id', orgId);
  return c.json({ ok: true });
});

// Accept invite (called during signup/login with invite token)
teamRoutes.post('/invites/accept', async (c) => {
  const { userId, email } = getAuth(c);
  const { token } = await c.req.json();

  if (!token) return c.json({ error: 'Token requerido' }, 400);

  const { data: invite } = await sb().from('team_invites')
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!invite) {
    // Check if already accepted (idempotent — user may have been auto-joined by middleware)
    const { data: accepted } = await sb().from('team_invites')
      .select('organization_id, role, email')
      .eq('token', token)
      .eq('status', 'accepted')
      .single();
    if (accepted) {
      // Verify the accepted invite belongs to this user
      if (accepted.email.toLowerCase() !== email.toLowerCase()) {
        return c.json({ error: 'Esta invitación fue enviada a otro correo' }, 403);
      }
      return c.json({ ok: true, organization_id: accepted.organization_id, role: accepted.role });
    }
    return c.json({ error: 'Invitación no válida o expirada' }, 404);
  }

  // Verify the logged-in user's email matches the invite email
  if (invite.email.toLowerCase() !== email.toLowerCase()) {
    logger.warn({ userId, email, inviteEmail: invite.email }, 'User tried to accept invite meant for different email');
    return c.json({ error: 'Esta invitación fue enviada a otro correo. Inicia sesión con el correo correcto.' }, 403);
  }

  // Add user to org — mark onboarding complete so invited users skip the setup wizard
  const { error: updateError } = await sb().from('profiles').update({
    organization_id: invite.organization_id,
    role: invite.role,
    onboarding_completed: true,
  }).eq('id', userId);

  if (updateError) {
    logger.error({ error: updateError, userId, orgId: invite.organization_id }, 'Failed to update profile for invite accept');
    return c.json({ error: 'Error al aceptar invitación' }, 500);
  }

  // Mark invite as accepted
  await sb().from('team_invites').update({ status: 'accepted' }).eq('id', invite.id);

  logger.info({ userId, email, orgId: invite.organization_id, role: invite.role }, 'Team invite accepted');
  return c.json({ ok: true, organization_id: invite.organization_id, role: invite.role });
});

// Update member role (admin only)
teamRoutes.patch('/members/:id', requireRole('admin'), async (c) => {
  const { orgId } = getAuth(c);
  const { role } = await c.req.json();
  if (!['admin', 'agent', 'viewer'].includes(role)) return c.json({ error: 'Rol no válido' }, 400);

  await sb().from('profiles').update({ role }).eq('id', c.req.param('id')).eq('organization_id', orgId);
  return c.json({ ok: true });
});

// Remove member (admin only)
teamRoutes.delete('/members/:id', requireRole('admin'), async (c) => {
  const { orgId, userId } = getAuth(c);
  const targetId = c.req.param('id');
  if (targetId === userId) return c.json({ error: 'No puedes eliminarte a ti mismo' }, 400);

  await sb().from('profiles').update({ organization_id: null }).eq('id', targetId).eq('organization_id', orgId);
  return c.json({ ok: true });
});
