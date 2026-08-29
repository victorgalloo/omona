'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function TrialExpired() {
  const [daysExpired, setDaysExpired] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .single();
      if (!profile?.organization_id) return;
      const { data: org } = await supabase
        .from('organizations')
        .select('trial_ends_at')
        .eq('id', profile.organization_id)
        .single();
      if (org?.trial_ends_at) {
        const diff = Math.floor((Date.now() - new Date(org.trial_ends_at).getTime()) / 86400000);
        setDaysExpired(Math.max(0, diff));
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-green">
          <span className="text-3xl font-bold text-white">L</span>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Tu prueba gratuita ha terminado
        </h1>
        <p className="mb-8 text-muted">
          {daysExpired > 0
            ? `Tu periodo de prueba venció hace ${daysExpired} día${daysExpired === 1 ? '' : 's'}.`
            : 'Tu periodo de prueba ha finalizado.'}
          {' '}Para seguir usando Omona, contacta a nuestro equipo.
        </p>

        {/* CTA */}
        <a
          href="https://wa.me/5214773920529?text=Hola%2C%20quiero%20continuar%20usando%20Omona"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-green px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.528 5.862L.06 23.854l6.164-1.438A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.785c-2.002 0-3.87-.58-5.445-1.58l-.39-.234-3.66.854.892-3.553-.256-.406A9.735 9.735 0 012.214 12c0-5.397 4.39-9.786 9.786-9.786 5.396 0 9.786 4.39 9.786 9.786 0 5.397-4.39 9.786-9.786 9.786z"/>
          </svg>
          Contactar ventas por WhatsApp
        </a>

        <a
          href="mailto:joscardona@icloud.com?subject=Quiero%20continuar%20con%20Omona"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
        >
          Contactar por email
        </a>

        {/* Sign out */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/login';
          }}
          className="mt-6 text-sm text-muted hover:text-foreground transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
