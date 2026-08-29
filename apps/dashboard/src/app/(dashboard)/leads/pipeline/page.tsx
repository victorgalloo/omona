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
  { status: 'new', label: 'Nuevo', color: 'bg-info-muted border-info/20', badge: 'bg-info' },
  { status: 'qualified', label: 'Calificado', color: 'bg-success-muted border-green-200', badge: 'bg-accent-green' },
  { status: 'contacted', label: 'Contactado', color: 'bg-warning-muted border-warning/20', badge: 'bg-warning-muted0' },
  { status: 'demo_scheduled', label: 'Demo Agendada', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-500' },
  { status: 'converted', label: 'Convertido', color: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-500' },
  { status: 'lost', label: 'Perdido', color: 'bg-error-muted border-error/20', badge: 'bg-error' },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 60 ? 'bg-success-muted text-green-700' : score >= 30 ? 'bg-yellow-100 text-warning' : 'bg-error-muted text-error';
  return <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${color}`}>{score}</span>;
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
      <Header title="Pipeline de Leads">
        <Link href="/leads" className="text-xs text-accent-green hover:underline font-medium">
          ← Vista tabla
        </Link>
      </Header>

      <div className="flex-1 overflow-x-auto p-4">
        {loading ? (
          <div className="flex gap-4">
            {COLUMNS.map(c => (
              <div key={c.status} className="w-64 shrink-0 animate-pulse rounded-xl bg-surface h-96" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 min-h-[calc(100vh-180px)]">
            {COLUMNS.map(col => {
              const colLeads = leads.filter(l => l.status === col.status);
              return (
                <div
                  key={col.status}
                  className={`w-64 shrink-0 rounded-xl border ${col.color} p-3 flex flex-col`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.status)}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{col.label}</h3>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-background ${col.badge}`}>
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2 flex-1">
                    {colLeads.map(lead => (
                      <Link
                        key={lead.id}
                        href={`/leads/${lead.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className={`block rounded-lg border border-white/80 bg-background p-3 shadow-sm cursor-grab active:cursor-grabbing transition-opacity hover:shadow-md ${
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
                      <div className="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-border text-xs text-muted">
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
