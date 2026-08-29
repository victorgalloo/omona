'use client';

import { useState } from 'react';
import { ExternalLink, ChevronRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatRelativeTime } from '@/lib/utils';

interface Lead {
  id: string;
  phone_number: string;
  name: string | null;
  email: string | null;
  company: string | null;
  company_size: string | null;
  budget: string | null;
  timeline: string | null;
  interest: string | null;
  pain_points: string | null;
  score: number;
  status: 'new' | 'qualified' | 'contacted' | 'demo_scheduled' | 'converted' | 'lost';
  conversation_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LeadTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: string) => void;
}

const statusLabels: Record<string, string> = {
  new: 'Nuevo',
  qualified: 'Calificado',
  contacted: 'Contactado',
  demo_scheduled: 'Demo agendada',
  converted: 'Convertido',
  lost: 'Perdido',
};

const statusColors: Record<string, 'success' | 'info' | 'warning' | 'default' | 'error' | 'secondary'> = {
  new: 'info',
  qualified: 'success',
  contacted: 'warning',
  demo_scheduled: 'default',
  converted: 'success',
  lost: 'error',
};

export function LeadTable({ leads, onStatusChange }: LeadTableProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-medium text-muted">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Último contacto</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-muted">
                      <Users className="h-8 w-8 text-accent-green" />
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">Sin leads todavía</p>
                      <p className="text-sm text-muted mt-1">Los leads aparecerán cuando tus clientes escriban por WhatsApp</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => handleRowClick(lead)}
                  className="cursor-pointer border-b border-border transition-colors hover:bg-surface/50 last:border-0"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    {lead.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted">
                    {lead.company || '—'}
                  </td>
                  <td
                    className="px-4 py-3 text-sm cursor-pointer select-none transition-colors hover:text-accent-green"
                    title="Copiar teléfono"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(lead.phone_number);
                      setCopiedId(lead.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                  >
                    {copiedId === lead.id ? (
                      <span className="text-accent-green font-medium">¡Copiado!</span>
                    ) : (
                      lead.phone_number
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Progress value={lead.score} className="w-16" />
                      <span className="text-xs font-medium text-muted">
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={lead.status}
                      onValueChange={(v) => onStatusChange(lead.id, v)}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {formatRelativeTime(lead.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-muted" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedLead.name || 'Lead sin nombre'}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant={statusColors[selectedLead.status]}>
                    {statusLabels[selectedLead.status]}
                  </Badge>
                  <span className="text-sm font-bold text-accent-green">
                    Score: {selectedLead.score}
                  </span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted">Teléfono</Label>
                    <p className="text-sm">{selectedLead.phone_number}</p>
                  </div>
                  {selectedLead.email && (
                    <div>
                      <Label className="text-xs text-muted">Email</Label>
                      <p className="text-sm">{selectedLead.email}</p>
                    </div>
                  )}
                  {selectedLead.company && (
                    <div>
                      <Label className="text-xs text-muted">Empresa</Label>
                      <p className="text-sm">{selectedLead.company}</p>
                    </div>
                  )}
                  {selectedLead.company_size && (
                    <div>
                      <Label className="text-xs text-muted">Tamaño</Label>
                      <p className="text-sm">{selectedLead.company_size}</p>
                    </div>
                  )}
                  {selectedLead.budget && (
                    <div>
                      <Label className="text-xs text-muted">Presupuesto</Label>
                      <p className="text-sm">{selectedLead.budget}</p>
                    </div>
                  )}
                  {selectedLead.timeline && (
                    <div>
                      <Label className="text-xs text-muted">Timeline</Label>
                      <p className="text-sm">{selectedLead.timeline}</p>
                    </div>
                  )}
                  {selectedLead.interest && (
                    <div>
                      <Label className="text-xs text-muted">Interés</Label>
                      <p className="text-sm">{selectedLead.interest}</p>
                    </div>
                  )}
                  {selectedLead.pain_points && (
                    <div>
                      <Label className="text-xs text-muted">Puntos de dolor</Label>
                      <p className="text-sm">{selectedLead.pain_points}</p>
                    </div>
                  )}
                  {selectedLead.notes && (
                    <div>
                      <Label className="text-xs text-muted">Notas</Label>
                      <p className="text-sm">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>

                {selectedLead.conversation_id && (
                  <>
                    <Separator />
                    <a
                      href={`/inbox?conversation=${selectedLead.conversation_id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-accent-green hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver conversación
                    </a>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
