'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, GripVertical } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/lib/api';

interface Lead {
  id: string;
  name: string | null;
  phone_number: string;
  company: string | null;
  score: number;
  status: string;
}

const COLUMNS = [
  { status: 'new', label: 'Nuevo' },
  { status: 'qualified', label: 'Calificado' },
  { status: 'contacted', label: 'Contactado' },
  { status: 'demo_scheduled', label: 'Demo Agendada' },
  { status: 'converted', label: 'Convertido' },
  { status: 'lost', label: 'Perdido' },
];

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="shrink-0 border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">
      {score}
    </span>
  );
}

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const posthog = usePostHog();

  useEffect(() => {
    api.get<{ data: Lead[] }>('/api/leads')
      .then(res => setLeads(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDragId(leadId);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    setDragId(null);
    if (!leadId) return;

    const fromStatus = leads.find(l => l.id === leadId)?.status;
    // Optimistic update
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    try {
      await api.patch(`/api/leads/${leadId}`, { status: newStatus });
      posthog?.capture('lead_stage_changed', { lead_id: leadId, from_stage: fromStatus, to_stage: newStatus });
    } catch {
      // Revert on error
      api.get<{ data: Lead[] }>('/api/leads').then(res => setLeads(res.data));
    }
  }, [leads, posthog]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className="flex h-full flex-col">
      <Header title="Pipeline de Leads" subtitle="Tus oportunidades por etapa, de nuevo hasta convertido.">
        <Link href="/leads" className="text-xs text-accent-green hover:underline font-medium">
          ← Vista tabla
        </Link>
      </Header>

      <div className="flex-1 overflow-x-auto p-4">
        {loading ? (
          <div className="flex gap-4">
            {COLUMNS.map(c => (
              <div key={c.status} className="h-96 w-64 shrink-0 animate-pulse border border-border bg-surface" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 min-h-[calc(100vh-180px)]">
            {COLUMNS.map(col => {
              const colLeads = leads.filter(l => l.status === col.status);
              return (
                <div
                  key={col.status}
                  className="flex w-64 shrink-0 flex-col border border-border p-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.status)}
                >
                  {/* Column Header */}
                  <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-foreground">{col.label}</h3>
                    <span className="font-mono text-xs text-muted">{colLeads.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2 flex-1">
                    {colLeads.map(lead => (
                      <Link
                        key={lead.id}
                        href={`/leads/${lead.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className={`block cursor-grab border border-border bg-background p-3 transition-colors hover:border-border-hover active:cursor-grabbing ${
                          dragId === lead.id ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {lead.name || lead.phone_number}
                            </p>
                            {lead.company && (
                              <p className="text-xs text-muted truncate">{lead.company}</p>
                            )}
                            {lead.name && (
                              <p className="text-[10px] text-muted mt-0.5">{lead.phone_number}</p>
                            )}
                          </div>
                          <ScoreBadge score={lead.score} />
                        </div>
                      </Link>
                    ))}
                    {colLeads.length === 0 && (
                      <div className="flex h-20 items-center justify-center border border-dashed border-border font-mono text-xs text-muted">
                        Arrastra leads aquí
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
