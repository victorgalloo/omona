'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { TrialExpired } from './TrialExpired';
import { Logo } from './Logo';

export type UserRole = 'admin' | 'agent' | 'viewer';

interface UserRoleContextValue {
  role: UserRole;
  isAdmin: boolean;
  canWrite: boolean; // admin or agent
}

const UserRoleContext = createContext<UserRoleContextValue>({
  role: 'viewer',
  isAdmin: false,
  canWrite: false,
});

export function useUserRole() {
  return useContext(UserRoleContext);
}

// --- Trial status context ---

export interface TrialStatus {
  plan: 'free' | 'pro' | 'enterprise';
  trialEndsAt: string | null;
  daysRemaining: number | null;
  isTrial: boolean; // plan === 'free' && trialEndsAt is set
}

const TrialContext = createContext<TrialStatus>({
  plan: 'free',
  trialEndsAt: null,
  daysRemaining: null,
  isTrial: false,
});

export function useTrialStatus() {
  return useContext(TrialContext);
}

// --- Tutorial ---

/**
 * Veces que se le ha mostrado el tutorial a esta cuenta. Viaja en el mismo
 * select de `profiles` que AuthGuard ya hacía, así que no cuesta una petición
 * extra. `null` = todavía no se sabe (no mostrar nada mientras tanto).
 */
const TutorialViewsContext = createContext<number | null>(null);

export function useTutorialViews() {
  return useContext(TutorialViewsContext);
}

/**
 * AuthGuard — protects dashboard routes.
 *
 * Flow:
 * 1. Check Supabase session → no session = redirect to /login
 * 2. Check profile.onboarding_completed:
 *    - null (no profile yet) → let through (middleware will create it on first API call)
 *    - false → redirect to /onboarding (new user who hasn't finished setup)
 *    - true → let through
 * 3. Check trial: if plan=free and trial_ends_at < now → show paywall
 * 4. If profile query fails (RLS, network, etc) → let through (fail open, don't trap users)
 * 5. Never redirect if already on /onboarding
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('viewer');
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    plan: 'free', trialEndsAt: null, daysRemaining: null, isTrial: false,
  });
  const [tutorialViews, setTutorialViews] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const posthog = usePostHog();

  // La verificación sólo necesita la ruta con la que se montó, para el
  // early-exit de /onboarding. Tenerla en las dependencias del efecto hacía
  // que las tres consultas a Supabase se repitieran en CADA navegación del
  // dashboard, que era la causa principal de la lentitud percibida.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          if (!cancelled) router.replace('/login');
          if (!cancelled) setLoading(false);
          return;
        }

        // Skip onboarding check if we're already on the onboarding page
        if (pathnameRef.current === '/onboarding') {
          if (!cancelled) {
            posthog?.identify(session.user.id, { email: session.user.email });
            setAuthenticated(true);
            setLoading(false);
          }
          return;
        }

        // Check onboarding status and trial — fail open (don't trap users on errors)
        let profileData: { role?: string; organization_id?: string } = {};
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('onboarding_completed, organization_id, role, is_superadmin, tutorial_views')
            .eq('id', session.user.id)
            .single();

          if (!error && profile && !cancelled) setTutorialViews(profile.tutorial_views ?? 0);

          // Set user role from profile
          if (!error && profile?.role) {
            profileData = { role: profile.role, organization_id: profile.organization_id ?? undefined };
            if (!cancelled) setUserRole(profile.role as UserRole);
          }

          // Only redirect if we have a definitive "not completed" answer
          if (!error && profile && profile.onboarding_completed === false) {
            // Before redirecting, trigger a server API call so the auth middleware
            // can auto-accept any pending team invite (which sets onboarding_completed=true)
            try {
              await api.get('/api/team/members');
              // Re-check profile — middleware may have accepted an invite
              const { data: freshProfile } = await supabase
                .from('profiles')
                .select('onboarding_completed, organization_id, role, tutorial_views')
                .eq('id', session.user.id)
                .single();
              if (freshProfile && !cancelled) setTutorialViews(freshProfile.tutorial_views ?? 0);
              if (freshProfile?.onboarding_completed === true) {
                // Invite was auto-accepted — skip onboarding
                if (freshProfile.role && !cancelled) setUserRole(freshProfile.role as UserRole);
                if (!cancelled) {
                  posthog?.identify(session.user.id, { email: session.user.email, role: freshProfile.role, org_id: freshProfile.organization_id });
                  setAuthenticated(true);
                  setLoading(false);
                }
                return;
              }
            } catch {
              // API call failed — proceed with redirect
            }
            if (!cancelled) { router.replace('/onboarding'); setLoading(false); }
            return;
          }

          // Check trial expiration (skip for superadmins)
          if (!error && profile?.organization_id) {
            try {
              const { data: org } = await supabase
                .from('organizations')
                .select('plan, trial_ends_at')
                .eq('id', profile.organization_id)
                .single();

              if (org && !cancelled) {
                const plan = (org.plan || 'free') as TrialStatus['plan'];
                const trialEndsAt = org.trial_ends_at;
                const isTrial = plan === 'free' && !!trialEndsAt;
                const daysRemaining = trialEndsAt
                  ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
                  : null;
                setTrialStatus({ plan, trialEndsAt, daysRemaining, isTrial });
              }

              if (!profile.is_superadmin && org && org.plan === 'free' && org.trial_ends_at) {
                const trialEnd = new Date(org.trial_ends_at);
                if (trialEnd < new Date()) {
                  if (!cancelled) {
                    posthog?.identify(session.user.id, { email: session.user.email, role: profile?.role, org_id: profile?.organization_id, plan: org.plan });
                    posthog?.capture('trial_expired_shown');
                    setTrialExpired(true);
                    setLoading(false);
                  }
                  return;
                }
              }
            } catch {
              // Fail open on trial check errors
            }
          }
        } catch {
          // Fail open — don't trap users if the check itself errors
        }

        if (!cancelled) {
          posthog?.identify(session.user.id, {
            email: session.user.email,
            role: profileData.role,
            org_id: profileData.organization_id,
          });
          setAuthenticated(true);
          setLoading(false);
        }
      } catch {
        // Session check failed — redirect to login
        if (!cancelled) { router.replace('/login'); setLoading(false); }
      }
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session || event === 'SIGNED_OUT') {
        posthog?.reset();
        setAuthenticated(false);
        setTrialExpired(false);
        router.replace('/login');
      }
      // Don't reset trialExpired on token refresh — the paywall should persist
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
    // pathname NO va aquí a propósito: se lee por ref (ver arriba). Incluirlo
    // reejecutaba las consultas de sesión en cada cambio de pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, posthog]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Logo size={22} className="text-foreground" />
            <span className="font-mono text-sm font-semibold text-foreground">omona_</span>
          </div>
          <div className="h-px w-24 overflow-hidden bg-border">
            <div className="h-full w-1/2 animate-shimmer bg-foreground" />
          </div>
        </div>
      </div>
    );
  }

  if (trialExpired) return <TrialExpired />;

  if (!authenticated) return null;

  const roleValue: UserRoleContextValue = {
    role: userRole,
    isAdmin: userRole === 'admin',
    canWrite: userRole === 'admin' || userRole === 'agent',
  };

  return (
    <UserRoleContext.Provider value={roleValue}>
      <TrialContext.Provider value={trialStatus}>
        <TutorialViewsContext.Provider value={tutorialViews}>
          {children}
        </TutorialViewsContext.Provider>
      </TrialContext.Provider>
    </UserRoleContext.Provider>
  );
}
