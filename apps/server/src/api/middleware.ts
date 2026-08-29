import { Context, Next } from 'hono';
import { getSupabase } from '../db/client.js';
import { logger } from '../logger.js';

const sb = () => getSupabase();

export type UserRole = 'admin' | 'agent' | 'viewer';

export type OrgPlan = 'free' | 'pro' | 'enterprise';

export interface AuthContext {
  userId: string;
  orgId: string;
  email: string;
  role: UserRole;
  plan: OrgPlan;
  trialEndsAt: string | null;
}

/**
 * Check if a user has a pending team invite and join them to that org.
 * Handles both cases: profile already exists (DB trigger) or needs to be created.
 * Returns the invited orgId if found, or null otherwise.
 */
async function checkAndAcceptPendingInvite(
  userId: string,
  email: string | undefined,
  fullName: string | undefined,
  profileExists: boolean
): Promise<{ orgId: string; role: string } | null> {
  if (!email) return null;

  const { data: pendingInvite } = await sb()
    .from('team_invites')
    .select('*')
    .eq('email', email)
    .eq('status', 'pending')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!pendingInvite) return null;

  const displayName = fullName || email.split('@')[0] || 'Usuario';

  if (profileExists) {
    // Profile already exists (created by DB trigger) — update it to point to invited org
    const { error } = await sb()
      .from('profiles')
      .update({
        organization_id: pendingInvite.organization_id,
        role: pendingInvite.role,
        onboarding_completed: true,
      })
      .eq('id', userId);

    if (error) {
      logger.error({ error, userId, orgId: pendingInvite.organization_id }, 'Failed to update profile for invite');
      return null;
    }
  } else {
    // No profile yet — create one in the invited org
    const { error } = await sb()
      .from('profiles')
      .insert({
        id: userId,
        organization_id: pendingInvite.organization_id,
        full_name: displayName,
        role: pendingInvite.role,
        onboarding_completed: true,
      });

    if (error) {
      logger.error({ error, userId, orgId: pendingInvite.organization_id }, 'Failed to create profile for invite');
      return null;
    }
  }

  await sb().from('team_invites').update({ status: 'accepted' }).eq('id', pendingInvite.id);
  logger.info({ userId, orgId: pendingInvite.organization_id, email, role: pendingInvite.role }, 'User auto-joined team via pending invite');

  return { orgId: pendingInvite.organization_id, role: pendingInvite.role };
}

/**
 * Middleware: verify Supabase JWT, resolve user's org (create if first login).
 * Sets c.set('auth', { userId, orgId, email }) for downstream routes.
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'No autorizado — token requerido' }, 401);
  }

  const token = authHeader.slice(7);

  // Verify JWT with Supabase
  const { data: { user }, error } = await sb().auth.getUser(token);
  if (error || !user) {
    logger.debug({ error: error?.message }, 'Auth failed');
    return c.json({ error: 'Token inválido o expirado' }, 401);
  }

  // Look up user's profile → org
  const { data: profile } = await sb()
    .from('profiles')
    .select('organization_id, onboarding_completed, role')
    .eq('id', user.id)
    .single();

  let orgId: string;
  let userRole: UserRole = 'admin';

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario';

  if (profile?.organization_id) {
    userRole = (profile.role as UserRole) || 'viewer';
    // Profile exists. If onboarding isn't complete, check for pending invites
    // (DB trigger may have created a new org before the invite could be accepted)
    if (!profile.onboarding_completed) {
      const invite = await checkAndAcceptPendingInvite(user.id, user.email, userName, true);
      if (invite) {
        orgId = invite.orgId;
        userRole = invite.role as UserRole;
      } else {
        orgId = profile.organization_id;
      }
    } else {
      orgId = profile.organization_id;
    }
  } else {
    // Profile doesn't exist yet — the DB trigger (handle_new_user) should have created it
    // on auth.users INSERT. Retry the lookup in case of race condition.
    await new Promise(r => setTimeout(r, 500)); // Brief wait for trigger

    const { data: retryProfile } = await sb()
      .from('profiles')
      .select('organization_id, onboarding_completed, role')
      .eq('id', user.id)
      .single();

    if (retryProfile?.organization_id) {
      userRole = (retryProfile.role as UserRole) || 'viewer';
      // Profile was created by trigger. Still check for pending invites.
      if (!retryProfile.onboarding_completed) {
        const invite = await checkAndAcceptPendingInvite(user.id, user.email, userName, true);
        if (invite) { orgId = invite.orgId; userRole = invite.role as UserRole; } else { orgId = retryProfile.organization_id; }
      } else {
        orgId = retryProfile.organization_id;
      }
    } else {
      // No profile at all — check for invite first, then create org as fallback
      const invite = await checkAndAcceptPendingInvite(user.id, user.email, userName, false);
      if (invite) {
        orgId = invite.orgId;
        userRole = invite.role as UserRole;
      } else {
        // No pending invite — create org + profile manually
        const orgName = `${userName}'s Business`;
        const slug = `org-${user.id.slice(0, 8)}`;

        const { data: org, error: orgErr } = await sb()
          .from('organizations')
          .insert({ name: orgName, slug })
          .select()
          .single();

        if (orgErr) {
          const { data: existing } = await sb()
            .from('profiles')
            .select('organization_id')
            .eq('id', user.id)
            .single();
          if (existing?.organization_id) {
            orgId = existing.organization_id;
          } else {
            logger.error({ error: orgErr }, 'Failed to create org');
            return c.json({ error: 'Error creando organización' }, 500);
          }
        } else {
          orgId = org.id;

          await sb()
            .from('profiles')
            .upsert({
              id: user.id,
              organization_id: orgId,
              full_name: userName,
              role: 'admin',
              onboarding_completed: false,
            });

          await sb()
            .from('agent_configs')
            .insert({
              organization_id: orgId,
              business_name: orgName,
              language: 'es-MX',
            });

          logger.info({ userId: user.id, orgId, email: user.email }, 'New user onboarded (fallback)');
        }
      }
    }
  }

  // Fetch org plan + trial info (used by trial middleware downstream)
  let plan: OrgPlan = 'free';
  let trialEndsAt: string | null = null;
  if (orgId) {
    const { data: orgData } = await sb()
      .from('organizations')
      .select('plan, trial_ends_at')
      .eq('id', orgId)
      .single();
    if (orgData) {
      plan = (orgData.plan as OrgPlan) || 'free';
      trialEndsAt = orgData.trial_ends_at;
    }
  }

  c.set('auth', { userId: user.id, orgId, email: user.email || '', role: userRole, plan, trialEndsAt } as AuthContext);
  await next();
}

/** Helper to get auth context from Hono context */
export function getAuth(c: Context): AuthContext {
  return c.get('auth') as AuthContext;
}

/**
 * Middleware factory: restrict access to specific roles.
 * Usage: router.use(requireRole('admin')) or requireRole('admin', 'agent')
 */
export function requireRole(...allowed: UserRole[]) {
  return async (c: Context, next: Next) => {
    const auth = getAuth(c);
    if (!allowed.includes(auth.role)) {
      return c.json({ error: 'No tienes permisos para esta acción' }, 403);
    }
    await next();
  };
}
