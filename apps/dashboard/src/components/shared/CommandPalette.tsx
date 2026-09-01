'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MessageSquare, Users, PhoneForwarded, BarChart3, Settings, Send, Kanban, CalendarDays } from 'lucide-react';

const COMMANDS = [
  { label: 'Inbox', href: '/inbox', icon: MessageSquare, keywords: 'mensajes chat conversaciones' },
  { label: 'Leads', href: '/leads', icon: Users, keywords: 'contactos clientes prospectos' },
  { label: 'Pipeline', href: '/leads/pipeline', icon: Kanban, keywords: 'kanban embudo ventas' },
  { label: 'Handoff', href: '/handoff', icon: PhoneForwarded, keywords: 'transferir humano agente' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, keywords: 'estadísticas métricas reportes' },
  { label: 'Calendario', href: '/calendar', icon: CalendarDays, keywords: 'citas agenda appointments demos' },
  { label: 'Broadcasts', href: '/broadcast', icon: Send, keywords: 'broadcast masivo mensaje difusión' },
  { label: 'Settings', href: '/settings', icon: Settings, keywords: 'configuración perfil whatsapp ajustes' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
        setQuery('');
        setSelected(0);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = COMMANDS.filter(cmd => {
    const q = query.toLowerCase();
    return !q || cmd.label.toLowerCase().includes(q) || cmd.keywords.includes(q);
  });

  const go = useCallback((href: string) => {
    router.push(href);
    setOpen(false);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) go(filtered[selected].href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-md border-t border-border shadow-elevated" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar página..."
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted"
          />
          <kbd className="hidden sm:block rounded-md bg-surface-2 border border-border px-1.5 py-0.5 text-[10px] text-muted font-mono">ESC</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.map((cmd, i) => (
            <button
              key={cmd.href}
              onClick={() => go(cmd.href)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors rounded-xl mx-1 ${
                i === selected ? 'bg-surface-2 text-foreground' : 'text-muted hover:text-foreground hover:bg-surface-2'
              }`}
              style={{ width: 'calc(100% - 8px)' }}
            >
              <cmd.icon className="h-4 w-4" />
              {cmd.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted">No se encontraron resultados</p>
          )}
        </div>
      </div>
    </div>
  );
}
