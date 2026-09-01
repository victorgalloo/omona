'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Phone, Mail, Building2, User, Tag, X, Plus, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { ActivityTimeline } from '@/components/crm/ActivityTimeline';
import { LeadTasks } from '@/components/crm/LeadTasks';
import { CustomFields } from '@/components/crm/CustomFields';

interface Lead {
  id: string;
  name: string | null;
  phone_number: string;
  email: string | null;
  company: string | null;
  score: number;
  status: string;
  notes: string | null;
  tags: string[];
  assigned_to: string | null;
  custom_fields: Record<string, string>;
  conversation_id: string | null;
  created_at: string;
}

interface TeamMember {
  id: string;
  full_name: string | null;
  email: string;
}

const TAG_COLORS = ['bg-info-muted text-info', 'bg-success-muted text-green-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700', 'bg-teal-100 text-teal-700'];

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  new: 'Nuevo', qualified: 'Calificado', contacted: 'Contactado',
  demo_scheduled: 'Demo Agendada', converted: 'Convertido', lost: 'Perdido',
};

const statusColors: Record<string, string> = {
  new: 'bg-info-muted text-blue-800', qualified: 'bg-success-muted text-green-800',
  contacted: 'bg-yellow-100 text-yellow-800', demo_scheduled: 'bg-purple-100 text-purple-800',
  converted: 'bg-emerald-100 text-emerald-800', lost: 'bg-error-muted text-red-800',
};

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 60 ? '#25D366' : score >= 30 ? '#F59E0B' : '#EF4444';
  const pct = Math.min(100, Math.max(0, score));
  const r = 36, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="absolute -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} stroke="#E5E7EB" strokeWidth="6" fill="none" />
        <circle cx="48" cy="48" r={r} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="text-2xl font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<Lead>(`/api/leads/${id}`),
      api.get<{ data: TeamMember[] }>('/api/team/members').catch(() => ({ data: [] })),
    ]).then(([l, team]) => {
      setLead(l);
      setNotes(l.notes || '');
      setTeamMembers(team.data || []);
      if (l.conversation_id) {
        api.get<{ messages: Message[] }>(`/api/conversations/${l.conversation_id}`)
          .then(conv => setMessages(conv.messages || []))
          .catch(() => {});
      }
    }).catch(() => router.push('/leads'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSaveNotes = useCallback(async () => {
    if (!id) return;
    setSaving(true);
    try {
      await api.patch(`/api/leads/${id}`, { notes });
    } catch {} finally { setSaving(false); }
  }, [id, notes]);

  const handleAddTag = useCallback(async () => {
    if (!id || !newTag.trim()) return;
    const { tags } = await api.post<{ tags: string[] }>(`/api/leads/${id}/tags`, { tag: newTag.trim() });
    setLead(prev => prev ? { ...prev, tags } : prev);
    setNewTag('');
    setShowTagInput(false);
  }, [id, newTag]);

  const handleRemoveTag = useCallback(async (tag: string) => {
    if (!id) return;
    const { tags } = await api.delete<{ tags: string[] }>(`/api/leads/${id}/tags/${encodeURIComponent(tag)}`);
    setLead(prev => prev ? { ...prev, tags } : prev);
  }, [id]);

  const handleAssign = useCallback(async (userId: string) => {
    if (!id) return;
    const updated = await api.post<Lead>(`/api/leads/${id}/assign`, { user_id: userId || null });
    setLead(updated);
  }, [id]);

  const handleGetSuggestions = useCallback(async () => {
    if (!id) return;
    setLoadingSuggestions(true);
    try {
      const { suggestions: s } = await api.get<{ suggestions: string[] }>(`/api/leads/${id}/suggested-replies`);
      setSuggestions(s);
    } catch {} finally { setLoadingSuggestions(false); }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-green border-t-transparent" />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <Link href="/leads" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface">
          <ArrowLeft className="h-5 w-5 text-muted" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-foreground">{lead.name || lead.phone_number}</h1>
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[lead.status] || 'bg-surface text-foreground'}`}>
            {statusLabels[lead.status] || lead.status}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Lead Info */}
          <div className="border-t border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Información</h3>
              <ScoreCircle score={lead.score} />
            </div>
            <div className="space-y-3">
              {lead.name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted" />
                  <span className="text-foreground">{lead.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted" />
                <span className="text-foreground">{lead.phone_number}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted" />
                  <span className="text-foreground">{lead.email}</span>
                </div>
              )}
              {lead.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted" />
                  <span className="text-foreground">{lead.company}</span>
                </div>
              )}
              <p className="text-xs text-muted pt-2">
                Creado: {new Date(lead.created_at).toLocaleDateString('es-MX')}
              </p>
            </div>
          </div>

          {/* Tags + Assignment */}
          <div className="border-t border-border p-5 lg:col-span-2 space-y-5">
            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted" />
                <h3 className="text-sm font-semibold text-foreground">Etiquetas</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(lead.tags || []).map((tag, i) => (
                  <span key={tag} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70"><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {showTagInput ? (
                  <form onSubmit={(e) => { e.preventDefault(); handleAddTag(); }} className="inline-flex items-center gap-1">
                    <input
                      autoFocus
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nueva etiqueta..."
                      className="w-24 rounded border border-border px-2 py-0.5 text-xs outline-none focus:border-accent-green"
                      onBlur={() => { if (!newTag) setShowTagInput(false); }}
                    />
                    <button type="submit" className="text-accent-green text-xs font-medium">✓</button>
                  </form>
                ) : (
                  <button onClick={() => setShowTagInput(true)} className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted hover:border-accent-green hover:text-accent-green">
                    <Plus className="h-3 w-3" /> Agregar
                  </button>
                )}
              </div>
            </div>

            {/* Assignment */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="h-4 w-4 text-muted" />
                <h3 className="text-sm font-semibold text-foreground">Asignado a</h3>
              </div>
              <select
                value={lead.assigned_to || ''}
                onChange={(e) => handleAssign(e.target.value)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-accent-green w-full max-w-xs"
              >
                <option value="">Sin asignar</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
                ))}
              </select>
            </div>


          </div>
        </div>

        <CustomFields
          leadId={lead.id}
          values={(lead as unknown as { custom_fields?: Record<string, unknown> }).custom_fields ?? {}}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ActivityTimeline leadId={lead.id} />
          <LeadTasks leadId={lead.id} />
        </div>

        {/* Suggested Replies */}
        {lead.conversation_id && (
          <div className="mt-6 border-t border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-green" />
                <h3 className="text-sm font-semibold text-foreground">Respuestas sugeridas</h3>
              </div>
              <Button size="sm" variant="outline" onClick={handleGetSuggestions} disabled={loadingSuggestions}>
                {loadingSuggestions ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-3.5 w-3.5" />}
                Generar
              </Button>
            </div>
            {suggestions.length > 0 && (
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => navigator.clipboard.writeText(s)}
                    className="block w-full text-left rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-foreground/30 hover:border-accent-green transition-colors">
                    {s}
                    <span className="block text-[10px] text-muted mt-0.5">Click para copiar</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Conversation Timeline */}
        {messages.length > 0 && (
          <div className="mt-6 border-t border-border p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Conversación</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-background border border-border text-foreground'
                      : 'bg-foreground text-foreground'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className={`mt-1 text-[10px] text-right ${msg.role === 'user' ? 'text-muted' : 'text-[#6B8A6E]'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
