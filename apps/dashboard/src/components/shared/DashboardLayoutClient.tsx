'use client';

import { useState, useEffect } from 'react';
import { Menu, Sun, Moon, Zap, X } from 'lucide-react';

function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('omona-theme', next);
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border border-border hover:bg-surface-2 transition-colors"
      title="Cambiar tema"
    >
      {isDark
        ? <Sun className="h-4 w-4 text-muted" />
        : <Moon className="h-4 w-4 text-muted" />
      }
    </button>
  );
}
import { usePathname } from 'next/navigation';
import { AuthGuard, useTrialStatus } from '@/components/shared/AuthGuard';
import { Sidebar, MobileSidebar } from '@/components/shared/Sidebar';
import { OnboardingTutorial } from '@/components/shared/OnboardingTutorial';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { cn } from '@/lib/utils';
import { useT } from '@/contexts/LanguageContext';
import { LanguageSwitcherDashboard } from '@/components/shared/LanguageSwitcher';

function TrialTopBanner() {
  const trial = useTrialStatus();
  const t = useT();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('omona-trial-banner-dismissed');
    if (saved) {
      const dismissedAt = parseInt(saved, 10);
      // Re-show if < 3 days remaining regardless of dismissal
      if ((trial.daysRemaining ?? 99) <= 3) {
        setDismissed(false);
      } else if (Date.now() - dismissedAt < 86400000) {
        setDismissed(true);
      }
    }
  }, [trial.daysRemaining]);

  if (!trial.isTrial || dismissed) return null;

  const urgent = (trial.daysRemaining ?? 0) <= 3;
  const days = trial.daysRemaining ?? 0;

  return (
    <div className={cn(
      'flex items-center justify-between gap-3 px-4 py-2 text-xs font-medium shrink-0',
      urgent
        ? 'bg-warning/10 text-warning border-b border-warning/20'
        : 'bg-info/10 text-info border-b border-info/20'
    )}>
      <div className="flex items-center gap-2 min-w-0">
        <Zap className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {urgent ? t.dashboard.trialUrgent(days) : t.dashboard.trialBanner(days)}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href="https://wa.me/5214773920529?text=Hola%2C%20quiero%20actualizar%20mi%20plan%20de%20Omona"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'rounded-md px-3 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90',
            urgent ? 'bg-warning' : 'bg-info'
          )}
        >
          {t.dashboard.upgradeNow}
        </a>
        <button
          onClick={() => {
            setDismissed(true);
            localStorage.setItem('omona-trial-banner-dismissed', String(Date.now()));
          }}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();

  const breadcrumb = (() => {
    for (const [path, label] of Object.entries(t.dashboard.breadcrumbs)) {
      if (pathname === path || pathname?.startsWith(path + '/')) return label;
    }
    return 'Overview';
  })();

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('omona-theme', next);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden text-foreground"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-foreground">
                {breadcrumb}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Connection badge */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-terminal-green bg-terminal-green/10">
                <div className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
                <span className="hidden sm:inline">{t.dashboard.connected}</span>
              </div>

              {/* Language switcher */}
              <LanguageSwitcherDashboard />

              {/* Theme toggle */}
              <ThemeToggleButton />

              {/* Cmd+K hint */}
              <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-surface text-xs text-muted font-mono">
                ⌘K
              </kbd>
            </div>
          </header>

          <TrialTopBanner />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
      <OnboardingTutorial />
      <CommandPalette />
    </AuthGuard>
  );
}
