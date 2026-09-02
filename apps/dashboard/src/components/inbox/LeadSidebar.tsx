'use client';

import { useState, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  phone_number: string;
  score: number;
  status: string;
  company_size: string | null;
  budget: string | null;
  timeline: string | null;
  interest: string | null;
  pain_points: string | null;
  notes: string | null;
}

interface LeadSidebarProps {
  lead: Lead | null;
  onClose: () => void;
}

const statusLabels: Record<string, string> = {
  new: 'Nuevo',
  qualified: 'Calificado',
  contacted: 'Contactado',
  demo_scheduled: 'Demo agendada',
  converted: 'Convertido',
  lost: 'Perdido',
};

// Etapas en monocromático, igual que el tablero de /leads/pipeline. La
// distinción es tipográfica, no cromática: 'converted' pesa más porque es el
// estado ganado. No se tocan las variantes de Badge — son compartidas por toda
// la app y agrisarlas apagaría también los errores y advertencias reales.
const statusColors: Record<string, 'outline' | 'terminal'> = {
  new: 'outline',
  qualified: 'outline',
  contacted: 'outline',
  demo_scheduled: 'outline',
  converted: 'terminal',
  lost: 'outline',
};

export function LeadSidebar({ lead, onClose }: LeadSidebarProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: lead?.name ?? '',
    email: lead?.email ?? '',
    company: lead?.company ?? '',
    notes: lead?.notes ?? '',
  });

  const handleSave = useCallback(async () => {
    if (!lead) return;
    try {
      await api.patch(`/api/leads/${lead.id}`, form);
      setEditing(false);
    } catch {
      // Handle error silently
    }
  }, [lead, form]);

  if (!lead) {
    return (
      <div className="flex w-[320px] flex-col items-center justify-center border-l border-border bg-background p-6">
        <p className="text-sm text-muted">No hay lead asociado</p>
      </div>
    );
  }

  return (
    <div className="flex w-[320px] flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Info del contacto</h3>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-surface-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Score */}
        <div className="mb-4 text-center">
          <div className="mb-2 text-3xl font-bold text-accent-green">{lead.score}</div>
          <Progress value={lead.score} className="mb-1" />
          <p className="text-xs text-muted">Puntuación del lead</p>
        </div>

        <div className="mb-3 flex justify-center">
          <Badge variant={statusColors[lead.status]}>
            {statusLabels[lead.status] ?? lead.status}
          </Badge>
        </div>

        <Separator className="my-4" />

        {/* Contact Info */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted">Nombre</Label>
            {editing ? (
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 h-8 text-sm"
              />
            ) : (
              <p className="text-sm text-foreground">{lead.name || '—'}</p>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted">Teléfono</Label>
            <p className="text-sm text-foreground">{lead.phone_number}</p>
          </div>

          <div>
            <Label className="text-xs text-muted">Email</Label>
            {editing ? (
              <Input
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 h-8 text-sm"
              />
            ) : (
              <p className="text-sm text-foreground">{lead.email || '—'}</p>
            )}
          </div>

          <div>
            <Label className="text-xs text-muted">Empresa</Label>
            {editing ? (
              <Input
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="mt-1 h-8 text-sm"
              />
            ) : (
              <p className="text-sm text-foreground">{lead.company || '—'}</p>
            )}
          </div>

          <Separator className="my-3" />

          {lead.interest && (
            <div>
              <Label className="text-xs text-muted">Interés</Label>
              <p className="text-sm text-foreground">{lead.interest}</p>
            </div>
          )}

          {lead.budget && (
            <div>
              <Label className="text-xs text-muted">Presupuesto</Label>
              <p className="text-sm text-foreground">{lead.budget}</p>
            </div>
          )}

          {lead.timeline && (
            <div>
              <Label className="text-xs text-muted">Timeline</Label>
              <p className="text-sm text-foreground">{lead.timeline}</p>
            </div>
          )}

          {lead.company_size && (
            <div>
              <Label className="text-xs text-muted">Tamaño empresa</Label>
              <p className="text-sm text-foreground">{lead.company_size}</p>
            </div>
          )}

          {lead.pain_points && (
            <div>
              <Label className="text-xs text-muted">Puntos de dolor</Label>
              <p className="text-sm text-foreground">{lead.pain_points}</p>
            </div>
          )}

          <div>
            <Label className="text-xs text-muted">Notas</Label>
            {editing ? (
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-info/30"
                rows={3}
              />
            ) : (
              <p className="text-sm text-foreground">{lead.notes || '—'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3">
        {editing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="flex-1">
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} className="flex-1">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Guardar
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="w-full">
            Editar info
          </Button>
        )}
      </div>
    </div>
  );
}
