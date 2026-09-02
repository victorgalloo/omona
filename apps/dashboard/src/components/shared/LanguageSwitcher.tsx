'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

/**
 * Variante de la landing. Usa los tokens de banda (`--band-*`) que publica
 * <Band> y que LandingNav hereda de la sección activa, así que se re-tiñe con
 * ella. Antes tenía la paleta oscura hardcodeada, de cuando la landing era
 * siempre negra: sobre la banda lima quedaba invisible.
 *
 * Solo debe usarse dentro de una <Band> o del nav; en el dashboard va
 * LanguageSwitcherDashboard, que lee los tokens globales.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={cn('flex items-center overflow-hidden border border-band-fg/30 text-xs font-mono', className)}>
      <button
        onClick={() => setLang('es')}
        className={cn(
          'px-2.5 py-1.5 transition-colors',
          lang === 'es'
            ? 'bg-band-fg font-semibold text-band-bg'
            : 'text-band-muted hover:text-band-fg'
        )}
        aria-label="Español"
      >
        ES
      </button>
      <button
        onClick={() => setLang('en')}
        className={cn(
          'px-2.5 py-1.5 transition-colors',
          lang === 'en'
            ? 'bg-band-fg font-semibold text-band-bg'
            : 'text-band-muted hover:text-band-fg'
        )}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}

/** Variant for dashboard (uses CSS variables) */
export function LanguageSwitcherDashboard({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={cn('flex items-center rounded-lg border border-border overflow-hidden text-xs font-mono', className)}>
      <button
        onClick={() => setLang('es')}
        className={cn(
          'px-2.5 py-1.5 transition-colors',
          lang === 'es'
            ? 'bg-foreground text-background font-semibold'
            : 'text-muted hover:text-foreground'
        )}
        aria-label="Español"
      >
        ES
      </button>
      <button
        onClick={() => setLang('en')}
        className={cn(
          'px-2.5 py-1.5 transition-colors',
          lang === 'en'
            ? 'bg-foreground text-background font-semibold'
            : 'text-muted hover:text-foreground'
        )}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
