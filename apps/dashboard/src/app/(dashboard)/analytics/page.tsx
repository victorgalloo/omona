'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Users, PhoneForwarded, Target, Bot, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import { Header } from '@/components/shared/Header';
import { api } from '@/lib/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList,
} from 'recharts';

interface Analytics {
  total_conversations: number;
  active_conversations: number;
  total_leads: number;
  qualified_leads: number;
  total_handoffs: number;
  handoff_rate: number;
  avg_lead_score: number;
  conversations_by_day: { date: string; count: number }[];
  leads_by_status: { status: string; count: number }[];
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo', qualified: 'Calificado', contacted: 'Contactado',
  demo_scheduled: 'Demo', converted: 'Convertido', lost: 'Perdido',
};

const COLORS = ['#25D366', '#128C7E', '#075E54', '#34B7F1', '#ECE5DD', '#DC3545'];
const FUNNEL_COLORS = ['#25D366', '#20BD5A', '#1AAF50', '#128C7E', '#075E54'];

interface FunnelData {
  funnel: { stage: string; count: number; label: string }[];
  total_leads: number;
  conversion_rate: number;
  lost_rate: number;
}

interface AIPerformance {
  total_conversations: number;
  total_handoffs: number;
  resolved_without_human: number;
  handoff_rate: number;
  ai_resolution_rate: number;
  total_messages: number;
  ai_messages: number;
  avg_messages_per_conversation: number;
}

function StatCard({ icon: Icon, label, value, suffix }: { icon: any; label: string; value: number | string; suffix?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-green/10">
        <Icon className="h-6 w-6 text-accent-green" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}{suffix}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return <div className="h-24 animate-pulse rounded-xl bg-surface-2" />;
}

function SkeletonChart() {
  return <div className="h-[300px] animate-pulse rounded-xl bg-surface-2" />;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [aiPerf, setAiPerf] = useState<AIPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Analytics>('/api/analytics').then(setData).catch(() => {}),
      api.get<FunnelData>('/api/analytics/funnel').then(setFunnel).catch(() => {}),
      api.get<AIPerformance>('/api/analytics/ai-performance').then(setAiPerf).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-full flex-col">
      <Header title="Analíticas" />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            <>
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </>
          ) : (
            <>
              <StatCard icon={MessageSquare} label="Conversaciones" value={data?.total_conversations ?? 0} />
              <StatCard icon={Users} label="Leads" value={data?.total_leads ?? 0} />
              <StatCard icon={PhoneForwarded} label="Tasa Handoff" value={data?.handoff_rate ?? 0} suffix="%" />
              <StatCard icon={Target} label="Score Promedio" value={data?.avg_lead_score ?? 0} />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Conversations by Day */}
          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Conversaciones últimos 30 días</h3>
            {loading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.conversations_by_day ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#25D366" strokeWidth={2} dot={{ fill: '#25D366', r: 3 }} name="Conversaciones" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Leads by Status */}
          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Leads por estado</h3>
            {loading ? <SkeletonChart /> : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={(data?.leads_by_status ?? []).map(d => ({ ...d, label: STATUS_LABELS[d.status] || d.status }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#25D366" radius={[4, 4, 0, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Embudo de conversión</h3>
            {funnel && (
              <div className="flex gap-4 text-xs">
                <span className="text-accent-green font-semibold">{funnel.conversion_rate}% conversión</span>
                <span className="text-error font-semibold">{funnel.lost_rate}% pérdida</span>
              </div>
            )}
          </div>
          {loading ? <SkeletonChart /> : (
            <div className="space-y-2">
              {(funnel?.funnel ?? []).map((stage, i) => {
                const maxCount = Math.max(...(funnel?.funnel ?? []).map(s => s.count), 1);
                const width = Math.max((stage.count / maxCount) * 100, 8);
                return (
                  <div key={stage.stage} className="flex items-center gap-3">
                    <span className="w-28 text-xs text-muted text-right">{stage.label}</span>
                    <div className="flex-1 h-8 bg-surface rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center px-3 text-xs font-semibold text-background transition-all"
                        style={{ width: `${width}%`, backgroundColor: FUNNEL_COLORS[i] || FUNNEL_COLORS[0] }}
                      >
                        {stage.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Performance */}
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Rendimiento del AI</h3>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard icon={Bot} label="Resolución sin humano" value={aiPerf?.ai_resolution_rate ?? 0} suffix="%" />
              <StatCard icon={Zap} label="Mensajes del AI" value={aiPerf?.ai_messages ?? 0} />
              <StatCard icon={BarChart3} label="Msgs/conversación" value={aiPerf?.avg_messages_per_conversation ?? 0} />
              <StatCard icon={TrendingUp} label="Tasa de handoff" value={aiPerf?.handoff_rate ?? 0} suffix="%" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
