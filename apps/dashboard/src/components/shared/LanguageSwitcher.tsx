'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={cn('flex items-center rounded-lg border border-[#2A2A2A] overflow-hidden text-xs font-mono', className)}>
      <button
        onClick={() => setLang('es')}
        className={cn(
          'px-2.5 py-1.5 transition-colors',
          lang === 'es'
            ? 'bg-[#FAFAFA] text-[#0C0C0C] font-semibold'
            : 'text-[#8A8A8A] hover:text-[#FAFAFA]'
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
            ? 'bg-[#FAFAFA] text-[#0C0C0C] font-semibold'
            : 'text-[#8A8A8A] hover:text-[#FAFAFA]'
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
