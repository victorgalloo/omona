'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, Webhook, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface WebhookSub {
  id: string;
  url: string;
  events: string[];
  secret: string | null;
  active: boolean;
  last_success_at: string | null;
  last_error: string | null;
}

const ALL_EVENTS = [
  { value: 'lead.created', label: 'Lead creado' },
  { value: 'lead.updated', label: 'Lead actualizado' },
  { value: 'lead.qualified', label: 'Lead calificado' },
  { value: 'conversation.created', label: 'Conversación iniciada' },
  { value: 'conversation.message', label: 'Nuevo mensaje' },
  { value: 'handoff.requested', label: 'Handoff solicitado' },
  { value: 'handoff.accepted', label: 'Handoff aceptado' },
  { value: 'handoff.resolved', label: 'Handoff resuelto' },
];

export function WebhookSettings() {
  const [webhooks, setWebhooks] = useState<WebhookSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');
  const [newSecret, setNewSecret] = useState('');
  const [newEvents, setNewEvents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<{ data: WebhookSub[] }>('/api/webhooks')
      .then(res => setWebhooks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addWebhook = async () => {
    if (!newUrl.trim() || !newEvents.length) return;
    setSaving(true);
    try {
      const wh = await api.post<WebhookSub>('/api/webhooks', {
        url: newUrl, events: newEvents, secret: newSecret || null,
      });
      setWebhooks([...webhooks, wh]);
      setNewUrl(''); setNewSecret(''); setNewEvents([]);
    } catch {} finally { setSaving(false); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const updated = await api.patch<WebhookSub>(`/api/webhooks/${id}`, { active: !active });
    setWebhooks(webhooks.map(w => w.id === id ? updated : w));
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('¿Eliminar este webhook?')) return;
    await api.delete(`/api/webhooks/${id}`);
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  const toggleEvent = (ev: string) => {
    setNewEvents(prev => prev.includes(ev) ? prev.filter(e => e !== ev) : [...prev, ev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-surface p-2">
          <Webhook className="h-5 w-5 text-accent-green" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Webhooks</h3>
          <p className="text-xs text-muted mt-0.5">
            Envía eventos automáticamente a Zapier, Make, o tu backend
          </p>
        </div>
      </div>

      {/* Existing */}
      {webhooks.map(wh => (
        <div key={wh.id} className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <code className="text-xs text-foreground truncate flex-1">{wh.url}</code>
            <div className="flex items-center gap-2">
              {wh.last_success_at && <CheckCircle className="h-3.5 w-3.5 text-accent-green" />}
              {wh.last_error && <span title={wh.last_error}><XCircle className="h-3.5 w-3.5 text-error" /></span>}
              <button onClick={() => toggleActive(wh.id, wh.active)} className={`text-xs px-2 py-0.5 rounded-full ${wh.active ? 'bg-success-muted text-green-700' : 'bg-surface text-muted'}`}>
                {wh.active ? 'Activo' : 'Inactivo'}
              </button>
              <button onClick={() => deleteWebhook(wh.id)} className="text-red-400 hover:text-error">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {wh.events.map(ev => (
              <span key={ev} className="rounded-full bg-accent-green/10 px-2 py-0.5 text-[10px] text-accent-green font-medium">{ev}</span>
            ))}
          </div>
        </div>
      ))}

      {/* Add new */}
      <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
        <Label className="text-xs font-medium">Nuevo webhook</Label>
        <Input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://hooks.zapier.com/..." className="h-8 text-sm" />
        <Input value={newSecret} onChange={e => setNewSecret(e.target.value)} placeholder="Secret (opcional, para firma HMAC)" className="h-8 text-sm" />
        <div className="flex flex-wrap gap-2">
          {ALL_EVENTS.map(ev => (
            <label key={ev.value} className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input type="checkbox" checked={newEvents.includes(ev.value)} onChange={() => toggleEvent(ev.value)} className="accent-accent-green" />
              {ev.label}
            </label>
          ))}
        </div>
        <Button size="sm" onClick={addWebhook} disabled={saving || !newUrl.trim() || !newEvents.length}>
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Plus className="mr-1.5 h-4 w-4" />}
          Agregar webhook
        </Button>
      </div>
    </div>
  );
}
