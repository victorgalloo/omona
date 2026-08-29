'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Kanban,
  MessageSquare,
  Send,
  Settings2,
  FileText,
  BookOpen,
  BarChart3,
  Phone,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  X,
  Shield,
  Zap,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIsSuperadmin } from '@/hooks/useAdmin';
import { useUserRole, useTrialStatus } from './AuthGuard';
import { cn } from '@/lib/utils';
import { useT } from '@/contexts/LanguageContext';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Which roles can see this item. Defaults to all roles. */
  roles?: Array<'admin' | 'agent' | 'viewer'>;
};

type NavSection = {
  label?: string;
  items: NavItem[];
};

function useSections(): NavSection[] {
  const t = useT();
  return [
    {
      items: [
        { href: '/inbox', label: 'Overview', icon: LayoutDashboard },
      ],
    },
    {
      label: t.dashboard.sections.monitor,
      items: [
        { href: '/leads/pipeline', label: 'Pipeline', icon: Kanban },
        { href: '/inbox', label: 'Inbox', icon: MessageSquare },
        { href: '/broadcast', label: 'Broadcasts', icon: Send, roles: ['admin'] },
      ],
    },
    {
      label: t.dashboard.sections.configure,
      items: [
        { href: '/settings', label: 'Setup', icon: Settings2, roles: ['admin'] },
        { href: '/handoff', label: 'Handoff', icon: FileText, roles: ['admin', 'agent'] },
        { href: '/leads', label: 'Leads', icon: BookOpen },
      ],
    },
    {
      label: t.dashboard.sections.configuration,
      items: [
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/calendar', label: t.dashboard.items.calendar, icon: Phone },
        { href: '/test', label: t.dashboard.items.tests, icon: Settings, roles: ['admin', 'agent'] },
      ],
    },
  ];
}

export function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const isSuperadmin = useIsSuperadmin();
  const { role } = useUserRole();
  const trial = useTrialStatus();
  const t = useT();
  const sections = useSections();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!mobile) {
      const saved = localStorage.getItem('omona-sidebar-collapsed');
      if (saved === 'true') setCollapsed(true);
    }
  }, [mobile]);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('omona-sidebar-collapsed', String(next));
  };

  const allItems = sections.flatMap(s => s.items);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const activeItem = allItems.find(
    item => pathname === item.href || pathname?.startsWith(item.href + '/')
  );

  const width = collapsed ? 64 : 240;

  const content = (
    <aside
      className={cn(
        'flex h-screen flex-col bg-background border-r border-border transition-all duration-200',
        mobile ? 'w-[240px]' : ''
      )}
      style={mobile ? undefined : { width }}
    >
      {/* Header */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex items-center gap-1.5">
          <div className={cn('rounded-full bg-terminal-red', collapsed ? 'w-2 h-2' : 'w-2.5 h-2.5')} />
          <div className={cn('rounded-full bg-terminal-yellow', collapsed ? 'w-2 h-2' : 'w-2.5 h-2.5')} />
          <div className={cn('rounded-full bg-terminal-green', collapsed ? 'w-2 h-2' : 'w-2.5 h-2.5')} />
        </div>
        {!collapsed && (
          <span className="font-mono font-semibold text-sm text-foreground ml-1.5">omona_</span>
        )}
        {!mobile && (
          <button
            onClick={toggleCollapse}
            className="ml-auto text-muted hover:text-foreground transition-colors"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        )}
        {mobile && onClose && (
          <button onClick={onClose} className="ml-auto text-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {sections.map((section, si) => {
          const visibleItems = section.items.filter(item => !item.roles || item.roles.includes(role));
          if (visibleItems.length === 0) return null;
          return (
            <div key={si} className={si > 0 ? 'mt-4' : ''}>
              {section.label && !collapsed && (
                <p className="text-[11px] uppercase tracking-widest text-muted px-3 mb-2">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={mobile ? onClose : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'text-foreground font-medium'
                          : 'text-muted hover:text-foreground hover:bg-surface'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 bg-surface-2 rounded-xl"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      <item.icon className="relative z-10 h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <span className="relative z-10 truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Admin link */}
      {isSuperadmin && (
        <div className="border-t border-border px-2 py-2">
          <Link
            href="/admin"
            onClick={mobile ? onClose : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
              pathname === '/admin'
                ? 'text-foreground font-medium bg-surface-2'
                : 'text-muted hover:text-foreground hover:bg-surface'
            )}
          >
            <Shield className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">Admin</span>}
          </Link>
        </div>
      )}

      {/* Trial / Plan banner */}
      {trial.isTrial && (
        <div className="border-t border-border px-2 py-2">
          {!collapsed ? (
            <div className="rounded-xl bg-surface p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-muted font-medium">{t.dashboard.freePlan}</span>
                <span className={cn(
                  'text-[11px] font-semibold',
                  (trial.daysRemaining ?? 0) <= 3 ? 'text-warning' : 'text-muted'
                )}>
                  {t.dashboard.daysLeft(trial.daysRemaining ?? 0)}
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    (trial.daysRemaining ?? 0) <= 3 ? 'bg-warning' : 'bg-accent-green'
                  )}
                  style={{ width: `${Math.min(100, ((trial.daysRemaining ?? 0) / 14) * 100)}%` }}
                />
              </div>
              <a
                href="https://wa.me/5214773920529?text=Hola%2C%20quiero%20actualizar%20mi%20plan%20de%20Omona"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-accent-green px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Zap className="h-3 w-3" />
                {t.dashboard.upgradeNow}
              </a>
            </div>
          ) : (
            <div className="flex justify-center">
              <a
                href="https://wa.me/5214773920529?text=Hola%2C%20quiero%20actualizar%20mi%20plan%20de%20Omona"
                target="_blank"
                rel="noopener noreferrer"
                title={t.dashboard.trialTooltip(trial.daysRemaining ?? 0)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                  (trial.daysRemaining ?? 0) <= 3
                    ? 'bg-warning/15 text-warning'
                    : 'bg-accent-green/15 text-accent-green'
                )}
              >
                <Zap className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      )}

      {trial.plan !== 'free' && (
        <div className="border-t border-border px-2 py-2">
          {!collapsed ? (
            <div className="flex items-center gap-2 px-1">
              <Crown className="h-3.5 w-3.5 text-accent-green" />
              <span className="text-xs font-medium text-accent-green capitalize">{trial.plan}</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <Crown className="h-4 w-4 text-accent-green" />
            </div>
          )}
        </div>
      )}

      {/* WhatsApp Status */}
      <div className="border-t border-border px-3 py-2">
        {!collapsed ? (
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-terminal-green" />
            <span className="text-xs text-muted">{t.dashboard.connected}</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-terminal-green" />
          </div>
        )}
      </div>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 border border-border text-xs font-medium text-foreground">
            {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
          </div>
          {!collapsed && (
            <>
              <span className="text-sm font-medium text-foreground truncate flex-1">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
              </span>
              <button
                onClick={() => { if (!confirm(t.dashboard.signOutConfirm)) return; signOut(); }}
                className="text-muted hover:text-terminal-red transition-colors"
                title={t.dashboard.signOut}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  if (mobile) {
    return content;
  }

  return content;
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-0 left-0 z-50 h-full"
          >
            <Sidebar mobile onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
