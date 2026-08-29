'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/lib/api';

type Filter = 'all' | 'new' | 'qualified';

export default function BroadcastPage() {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const posthog = usePostHog();

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!confirm(`¿Enviar mensaje a ${filter === 'all' ? 'todos los contactos' : filter === 'new' ? 'leads nuevos' : 'leads calificados'}?`)) return;
    setSending(true);
    setResult(null);
    try {
      const res = await api.post<{ sent: number; failed: number; total: number }>('/api/broadcast', { message, filter });
      posthog?.capture('broadcast_sent', { recipient_count: res.sent, filter });
      setResult(res);
    } catch {
      setResult({ sent: 0, failed: 0, total: 0 });
    } finally {
      setSending(false);
    }
  };

  const filters: { value: Filter; label: string; desc: string }[] = [
    { value: 'all', label: 'Todos', desc: 'Enviar a todos los contactos' },
    { value: 'new', label: 'Nuevos', desc: 'Solo leads con estado "nuevo"' },
    { value: 'qualified', label: 'Calificados', desc: 'Solo leads calificados (score > 50)' },
  ];

  return (
    <div className="flex h-full flex-col">
      <Header title="Difusión" />

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-xl space-y-6">
          {/* Icon */}
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10">
              <Megaphone className="h-8 w-8 text-accent-green" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Enviar mensaje masivo</h3>
            <p className="text-sm text-muted text-center">
              Envía un mensaje a múltiples contactos por WhatsApp
            </p>
          </div>

          {/* Message */}
          <div>
            <Label className="text-sm font-medium">Mensaje</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={5}
              className="mt-1.5 resize-none"
            />
            <p className="mt-1 text-xs text-muted">{message.length} caracteres</p>
          </div>

          {/* Filter */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Destinatarios</Label>
            <div className="space-y-2">
              {filters.map((f) => (
                <label
                  key={f.value}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    filter === f.value ? 'border-accent-green bg-accent-green/5' : 'border-border hover:bg-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="filter"
                    value={f.value}
                    checked={filter === f.value}
                    onChange={() => setFilter(f.value)}
                    className="accent-accent-green"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.label}</p>
                    <p className="text-xs text-muted">{f.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Send */}
          <Button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="w-full"
            size="lg"
          >
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {sending ? 'Enviando...' : 'Enviar difusión'}
          </Button>

          {/* Result */}
          {result && (
            <div className="rounded-lg border border-border bg-background p-4">
              <h4 className="font-medium text-foreground mb-2">Resultado</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-accent-green" />
                  <span>{result.sent} enviados</span>
                </div>
                {result.failed > 0 && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <XCircle className="h-4 w-4 text-error" />
                    <span>{result.failed} fallidos</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
