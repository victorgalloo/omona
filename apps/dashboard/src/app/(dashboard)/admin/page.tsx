'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import {
  Building2,
  ChevronDown,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { api } from '@/lib/api';
import { cn, formatRelativeTime, formatTime, getInitials, truncate } from '@/lib/utils';

interface AccountProfile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  email: string;
}

interface Account {
  id: string;
  name: string;
  slug: string;
  plan: string;
  trial_ends_at: string | null;
  created_at: string;
  trialActive: boolean;
  trialExpired: boolean;
  daysRemaining: number | null;
  profiles: AccountProfile[];
  agent_configs: { business_name: string; industry: string | null }[];
  whatsapp_sessions: { status: string; phone_number: string | null; last_connected_at: string | null }[];
}

interface ConversationLead {
  id?: string;
  name: string | null;
  email: string | null;
  company: string | null;
  phone_number?: string | null;
  status?: string;
  score?: number;
  created_at?: string;
  updated_at?: string;
}

interface ConversationPreviewMessage {
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: string;
}

interface AccountConversationSummary {
  id: string;
  phone_number: string;
  contact_name: string | null;
  status: 'active' | 'handoff' | 'resolved' | 'archived';
  summary: string | null;
  unread_count: number;
  last_message_at: string;
  created_at: string;
  lead: ConversationLead | null;
  last_message: ConversationPreviewMessage | null;
}

interface AccountConversationDetail extends AccountConversationSummary {
  updated_at: string;
  messages: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
  }[];
}

function getAccountStatusBadge(acc: Account) {
  if (acc.plan === 'pro') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent-green/15 text-accent-green">Pro</span>;
  if (acc.plan === 'enterprise') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-info/15 text-info">Enterprise</span>;
  if (acc.trialExpired) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-error/15 text-error">Trial expirado</span>;
  if (acc.trialActive) return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-warning">{acc.daysRemaining}d restantes</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-2 text-muted">Free</span>;
}

function getWhatsAppStatus(acc: Account) {
  const session = acc.whatsapp_sessions?.[0];
  if (!session) return <span className="text-xs text-muted">Sin WhatsApp</span>;
  const colors: Record<string, string> = {
    connected: 'text-accent-green',
    disconnected: 'text-error',
    connecting: 'text-warning',
    qr_pending: 'text-warning',
  };

  return (
    <span className={`text-xs font-medium ${colors[session.status] || 'text-muted'}`}>
      {session.status}
      {session.phone_number && ` · ${session.phone_number}`}
    </span>
  );
}

function getConversationStatusBadge(status: AccountConversationSummary['status']) {
  const styles: Record<AccountConversationSummary['status'], string> = {
    active: 'bg-accent-green/10 text-accent-green',
    handoff: 'bg-warning/15 text-warning',
    resolved: 'bg-info/15 text-info',
    archived: 'bg-surface-2 text-muted',
  };

  const labels: Record<AccountConversationSummary['status'], string> = {
    active: 'Activa',
    handoff: 'Handoff',
    resolved: 'Resuelta',
    archived: 'Archivada',
  };

  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>{labels[status]}</span>;
}

function AdminMessageBubble({
  message,
  isLast,
}: {
  message: AccountConversationDetail['messages'][number];
  isLast: boolean;
}) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className="rounded-full bg-surface px-3 py-1 text-[11px] text-muted">{message.content}</div>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm',
          isUser
            ? 'bg-foreground text-background'
            : 'border border-border bg-background text-foreground'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className={cn('mt-1 flex items-center justify-end gap-2 text-[11px]', isUser ? 'text-background/60' : 'text-muted')}>
          <span>{formatTime(message.created_at)}</span>
          {isLast && <span className="uppercase tracking-wide">último</span>}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);

  const [accountConversations, setAccountConversations] = useState<Record<string, AccountConversationSummary[]>>({});
  const [accountConversationsLoading, setAccountConversationsLoading] = useState<Record<string, boolean>>({});
  const [accountConversationsError, setAccountConversationsError] = useState<Record<string, string | null>>({});
  const [conversationSearch, setConversationSearch] = useState<Record<string, string>>({});

  const [selectedConversationByOrg, setSelectedConversationByOrg] = useState<Record<string, string | null>>({});
  const [conversationDetails, setConversationDetails] = useState<Record<string, AccountConversationDetail>>({});
  const [conversationDetailLoading, setConversationDetailLoading] = useState<Record<string, boolean>>({});
  const [conversationDetailError, setConversationDetailError] = useState<Record<string, string | null>>({});

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await api.get<{ accounts: Account[] }>('/api/admin/accounts');
      setAccounts(data.accounts);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetailKey = useCallback((orgId: string, conversationId: string) => `${orgId}:${conversationId}`, []);

  const loadConversationDetail = useCallback(async (orgId: string, conversationId: string, force = false) => {
    const detailKey = getDetailKey(orgId, conversationId);
    setSelectedConversationByOrg((prev) => ({ ...prev, [orgId]: conversationId }));

    if (!force && conversationDetails[detailKey]) return;

    setConversationDetailLoading((prev) => ({ ...prev, [detailKey]: true }));
    setConversationDetailError((prev) => ({ ...prev, [detailKey]: null }));

    try {
      const detail = await api.get<AccountConversationDetail>(`/api/admin/accounts/${orgId}/conversations/${conversationId}`);
      setConversationDetails((prev) => ({ ...prev, [detailKey]: detail }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setConversationDetailError((prev) => ({ ...prev, [detailKey]: msg }));
    } finally {
      setConversationDetailLoading((prev) => ({ ...prev, [detailKey]: false }));
    }
  }, [conversationDetails, getDetailKey]);

  const loadAccountConversations = useCallback(async (orgId: string, force = false) => {
    if (!force && accountConversations[orgId]) return;

    setAccountConversationsLoading((prev) => ({ ...prev, [orgId]: true }));
    setAccountConversationsError((prev) => ({ ...prev, [orgId]: null }));

    try {
      const data = await api.get<{ conversations: AccountConversationSummary[] }>(`/api/admin/accounts/${orgId}/conversations?limit=40`);
      setAccountConversations((prev) => ({ ...prev, [orgId]: data.conversations }));

      const currentSelected = selectedConversationByOrg[orgId];
      const selectedStillExists = currentSelected && data.conversations.some((conversation) => conversation.id === currentSelected);
      const nextSelected = selectedStillExists ? currentSelected : data.conversations[0]?.id || null;

      setSelectedConversationByOrg((prev) => ({ ...prev, [orgId]: nextSelected }));

      if (nextSelected) {
        await loadConversationDetail(orgId, nextSelected, force);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setAccountConversationsError((prev) => ({ ...prev, [orgId]: msg }));
    } finally {
      setAccountConversationsLoading((prev) => ({ ...prev, [orgId]: false }));
    }
  }, [accountConversations, loadConversationDetail, selectedConversationByOrg]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const toggleExpandedOrg = async (orgId: string) => {
    const nextExpanded = expandedOrg === orgId ? null : orgId;
    setExpandedOrg(nextExpanded);

    if (nextExpanded === orgId) {
      await loadAccountConversations(orgId);
    }
  };

  const doAction = async (orgId: string, action: string, body?: object) => {
    setActionLoading(`${orgId}:${action}`);
    try {
      await api.post(`/api/admin/accounts/${orgId}/${action}`, body);
      await fetchAccounts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      alert(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const doDelete = async (acc: Account) => {
    const name = acc.agent_configs?.[0]?.business_name || acc.name;
    if (!confirm(`¿Eliminar "${name}" y TODOS sus datos? Esta acción no se puede deshacer.`)) return;
    if (!confirm(`¿Estás seguro? Se eliminarán conversaciones, leads, mensajes y toda la configuración de "${name}".`)) return;
    setActionLoading(`${acc.id}:delete`);
    try {
      await api.delete(`/api/admin/accounts/${acc.id}`);
      setExpandedOrg((prev) => (prev === acc.id ? null : prev));
      setAccountConversations((prev) => {
        const next = { ...prev };
        delete next[acc.id];
        return next;
      });
      await fetchAccounts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      alert(msg);
    } finally {
      setActionLoading(null);
    }
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Shield className="mx-auto mb-3 h-12 w-12 text-error" />
          <h2 className="mb-1 text-lg font-semibold text-foreground">Acceso denegado</h2>
          <p className="text-sm text-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-green border-t-transparent" />
      </div>
    );
  }

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((account) => account.plan !== 'free' || account.trialActive).length;
  const expiredAccounts = accounts.filter((account) => account.trialExpired).length;

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent-green" />
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <p className="text-sm text-muted">Gestionar cuentas registradas y revisar conversaciones como superadmin</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="mb-1 flex items-center gap-2 text-muted">
            <Users className="h-4 w-4" />
            <span className="text-xs">Total cuentas</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalAccounts}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="mb-1 flex items-center gap-2 text-accent-green">
            <Power className="h-4 w-4" />
            <span className="text-xs">Activas</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{activeAccounts}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="mb-1 flex items-center gap-2 text-error">
            <PowerOff className="h-4 w-4" />
            <span className="text-xs">Trial expirado</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{expiredAccounts}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">Empresa</th>
              <th className="hidden px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted sm:table-cell">Usuarios</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">WhatsApp</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">Estado</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted">Registro</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => {
              const orgConversations = accountConversations[acc.id] || [];
              const orgSearch = (conversationSearch[acc.id] || '').trim().toLowerCase();
              const filteredConversations = orgConversations.filter((conversation) => {
                if (!orgSearch) return true;
                return [
                  conversation.contact_name || '',
                  conversation.phone_number,
                  conversation.lead?.name || '',
                  conversation.lead?.email || '',
                  conversation.lead?.company || '',
                  conversation.summary || '',
                  conversation.last_message?.content || '',
                ].some((value) => value.toLowerCase().includes(orgSearch));
              });

              const selectedConversationId = selectedConversationByOrg[acc.id] || null;
              const selectedConversationKey = selectedConversationId ? getDetailKey(acc.id, selectedConversationId) : null;
              const selectedConversation = selectedConversationKey ? conversationDetails[selectedConversationKey] : null;
              const selectedConversationLoading = selectedConversationKey ? !!conversationDetailLoading[selectedConversationKey] : false;
              const selectedConversationError = selectedConversationKey ? conversationDetailError[selectedConversationKey] : null;

              return (
                <Fragment key={acc.id}>
                  <tr
                    className="cursor-pointer border-b border-border transition-colors hover:bg-surface/50"
                    onClick={() => void toggleExpandedOrg(acc.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`h-3 w-3 text-muted transition-transform ${expandedOrg === acc.id ? 'rotate-0' : '-rotate-90'}`} />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {acc.agent_configs?.[0]?.business_name || acc.name}
                          </p>
                          <p className="text-xs text-muted">{acc.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="space-y-0.5">
                        {acc.profiles?.length ? acc.profiles.map((p) => (
                          <div key={p.id} className="flex items-center gap-1.5 text-xs">
                            <span className="truncate font-medium text-foreground" style={{ maxWidth: 120 }}>{p.full_name || 'Sin nombre'}</span>
                            {p.email && (
                              <a href={`mailto:${p.email}`} className="truncate text-info hover:underline" style={{ maxWidth: 180 }} title={p.email}>{p.email}</a>
                            )}
                            <span className="shrink-0 rounded bg-surface-2 px-1 py-0.5 text-[10px] uppercase text-muted">{p.role}</span>
                          </div>
                        )) : <span className="text-xs text-muted">0</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {acc.whatsapp_sessions?.length ? acc.whatsapp_sessions.map((ws, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                          <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${ws.status === 'connected' ? 'bg-accent-green' : ws.status === 'linked' ? 'bg-info' : ws.status === 'connecting' || ws.status === 'qr_pending' ? 'bg-warning' : 'bg-error'}`} />
                          <span className="font-medium text-foreground">{ws.phone_number || 'Sin número'}</span>
                          <span className="text-muted">({ws.status})</span>
                        </div>
                      )) : <span className="text-xs text-muted">No conectado</span>}
                    </td>
                    <td className="px-4 py-3">{getAccountStatusBadge(acc)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted">{new Date(acc.created_at).toLocaleDateString('es-MX')}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                        {acc.plan === 'free' ? (
                          <button
                            onClick={() => void doAction(acc.id, 'activate')}
                            disabled={actionLoading === `${acc.id}:activate`}
                            className="rounded-lg bg-accent-green px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            {actionLoading === `${acc.id}:activate` ? '...' : 'Activar'}
                          </button>
                        ) : (
                          <button
                            onClick={() => { if (confirm(`¿Desactivar ${acc.name}?`)) void doAction(acc.id, 'deactivate'); }}
                            disabled={actionLoading === `${acc.id}:deactivate`}
                            className="rounded-lg bg-error/10 px-2.5 py-1 text-xs font-medium text-error transition-colors hover:bg-error/20 disabled:opacity-50"
                          >
                            {actionLoading === `${acc.id}:deactivate` ? '...' : 'Desactivar'}
                          </button>
                        )}
                        {acc.plan === 'free' && (
                          <button
                            onClick={() => {
                              const days = prompt('¿Cuántos días extender?', '14');
                              if (days) void doAction(acc.id, 'extend-trial', { days: parseInt(days, 10) });
                            }}
                            disabled={!!actionLoading}
                            className="rounded-lg bg-surface-2 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-border disabled:opacity-50"
                          >
                            <Clock className="mr-1 inline h-3 w-3" />
                            Extender
                          </button>
                        )}
                        <button
                          onClick={() => void doDelete(acc)}
                          disabled={!!actionLoading}
                          className="rounded-lg px-2 py-1 text-xs font-medium text-error transition-colors hover:bg-error/10 disabled:opacity-50"
                          title="Eliminar cuenta"
                        >
                          {actionLoading === `${acc.id}:delete` ? '...' : <Trash2 className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedOrg === acc.id && (
                    <tr className="border-b border-border bg-surface/30">
                      <td colSpan={6} className="px-6 py-5">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                            <div className="rounded-2xl border border-border bg-background p-4">
                              <p className="mb-3 text-xs uppercase tracking-wider text-muted">Usuarios del account</p>
                              <div className="space-y-3">
                                {acc.profiles?.map((profile) => (
                                  <div key={profile.id} className="flex items-start gap-3">
                                    <Avatar size="md">{getInitials(profile.full_name || profile.email || '?')}</Avatar>
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-foreground">{profile.full_name || 'Sin nombre'}</p>
                                      <p className="truncate text-xs text-muted">{profile.email || 'Email no disponible'}</p>
                                      <p className="text-[11px] uppercase tracking-wide text-muted">{profile.role}</p>
                                    </div>
                                  </div>
                                ))}
                                {(!acc.profiles || acc.profiles.length === 0) && <p className="text-xs text-muted">Sin usuarios</p>}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-border bg-background p-4">
                              <p className="mb-3 text-xs uppercase tracking-wider text-muted">Detalles</p>
                              <div className="space-y-2 text-xs">
                                <p><span className="text-muted">Plan:</span> <span className="font-medium text-foreground">{acc.plan}</span></p>
                                <p><span className="text-muted">Trial hasta:</span> <span className="text-foreground">{acc.trial_ends_at ? new Date(acc.trial_ends_at).toLocaleString('es-MX') : 'N/A'}</span></p>
                                <p><span className="text-muted">Industria:</span> <span className="text-foreground">{acc.agent_configs?.[0]?.industry || 'No especificada'}</span></p>
                                <p><span className="text-muted">Org ID:</span> <span className="font-mono text-foreground">{acc.id}</span></p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
                            <div className="overflow-hidden rounded-2xl border border-border bg-background">
                              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                                <div>
                                  <p className="text-sm font-semibold text-foreground">Mensajes del account</p>
                                  <p className="text-xs text-muted">Últimas 40 conversaciones, con email si fue capturado</p>
                                </div>
                                <button
                                  onClick={() => void loadAccountConversations(acc.id, true)}
                                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                                  title="Recargar conversaciones"
                                >
                                  <RefreshCw className={cn('h-4 w-4', accountConversationsLoading[acc.id] && 'animate-spin')} />
                                </button>
                              </div>

                              <div className="border-b border-border px-4 py-3">
                                <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
                                  <Search className="h-4 w-4 text-muted" />
                                  <input
                                    value={conversationSearch[acc.id] || ''}
                                    onChange={(event) => setConversationSearch((prev) => ({ ...prev, [acc.id]: event.target.value }))}
                                    placeholder="Buscar por nombre, teléfono o email..."
                                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div className="max-h-[540px] overflow-y-auto">
                                {accountConversationsLoading[acc.id] && orgConversations.length === 0 ? (
                                  <div className="flex items-center justify-center p-6">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-green border-t-transparent" />
                                  </div>
                                ) : accountConversationsError[acc.id] ? (
                                  <div className="p-4 text-sm text-error">{accountConversationsError[acc.id]}</div>
                                ) : filteredConversations.length === 0 ? (
                                  <div className="p-6 text-center">
                                    <MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted" />
                                    <p className="text-sm font-medium text-foreground">Sin conversaciones</p>
                                    <p className="text-xs text-muted">No hay resultados para este account</p>
                                  </div>
                                ) : (
                                  filteredConversations.map((conversation) => (
                                    <button
                                      key={conversation.id}
                                      onClick={() => void loadConversationDetail(acc.id, conversation.id)}
                                      className={cn(
                                        'w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-surface',
                                        selectedConversationId === conversation.id && 'bg-surface'
                                      )}
                                    >
                                      <div className="mb-1 flex items-center justify-between gap-2">
                                        <span className="truncate text-sm font-medium text-foreground">
                                          {conversation.contact_name || conversation.lead?.name || conversation.phone_number}
                                        </span>
                                        <span className="text-[11px] text-muted">{formatRelativeTime(conversation.last_message_at)}</span>
                                      </div>
                                      <div className="mb-2 flex flex-wrap items-center gap-2">
                                        {getConversationStatusBadge(conversation.status)}
                                        {conversation.lead?.email && (
                                          <span className="rounded-full bg-info/10 px-2 py-0.5 text-[11px] text-info">
                                            {conversation.lead.email}
                                          </span>
                                        )}
                                      </div>
                                      <p className="truncate text-xs text-muted">
                                        {conversation.last_message ? truncate(conversation.last_message.content, 72) : conversation.summary || 'Sin mensajes'}
                                      </p>
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-border bg-background">
                              {!selectedConversationId ? (
                                <div className="flex h-full min-h-[540px] items-center justify-center p-6 text-center">
                                  <div>
                                    <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted" />
                                    <p className="text-sm font-medium text-foreground">Selecciona una conversación</p>
                                    <p className="text-sm text-muted">Aquí podrás ver mensajes, email y datos del lead</p>
                                  </div>
                                </div>
                              ) : selectedConversationLoading && !selectedConversation ? (
                                <div className="flex min-h-[540px] items-center justify-center">
                                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-green border-t-transparent" />
                                </div>
                              ) : selectedConversationError ? (
                                <div className="p-6 text-sm text-error">{selectedConversationError}</div>
                              ) : selectedConversation ? (
                                <div className="flex min-h-[540px] flex-col">
                                  <div className="border-b border-border px-5 py-4">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div>
                                        <div className="mb-1 flex items-center gap-2">
                                          <h2 className="text-base font-semibold text-foreground">
                                            {selectedConversation.contact_name || selectedConversation.lead?.name || selectedConversation.phone_number}
                                          </h2>
                                          {getConversationStatusBadge(selectedConversation.status)}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                                          <span className="inline-flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5" />
                                            {selectedConversation.phone_number}
                                          </span>
                                          <span className="inline-flex items-center gap-1">
                                            <Mail className="h-3.5 w-3.5" />
                                            {selectedConversation.lead?.email || 'Sin email capturado'}
                                          </span>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => void loadConversationDetail(acc.id, selectedConversation.id, true)}
                                        className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface"
                                      >
                                        Recargar hilo
                                      </button>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                      <div className="rounded-xl bg-surface px-3 py-2">
                                        <p className="text-[11px] uppercase tracking-wide text-muted">Lead</p>
                                        <p className="truncate text-sm text-foreground">{selectedConversation.lead?.name || selectedConversation.contact_name || 'Sin nombre'}</p>
                                      </div>
                                      <div className="rounded-xl bg-surface px-3 py-2">
                                        <p className="text-[11px] uppercase tracking-wide text-muted">Empresa</p>
                                        <p className="truncate text-sm text-foreground">{selectedConversation.lead?.company || 'No detectada'}</p>
                                      </div>
                                      <div className="rounded-xl bg-surface px-3 py-2">
                                        <p className="text-[11px] uppercase tracking-wide text-muted">Actualizado</p>
                                        <p className="truncate text-sm text-foreground">{new Date(selectedConversation.updated_at).toLocaleString('es-MX')}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex-1 space-y-3 overflow-y-auto bg-surface/40 px-5 py-4">
                                    {selectedConversation.messages.length === 0 ? (
                                      <div className="flex h-full items-center justify-center text-sm text-muted">Sin mensajes</div>
                                    ) : (
                                      selectedConversation.messages.map((message, index) => (
                                        <AdminMessageBubble
                                          key={message.id}
                                          message={message}
                                          isLast={index === selectedConversation.messages.length - 1}
                                        />
                                      ))
                                    )}
                                  </div>

                                  {selectedConversation.summary && (
                                    <div className="border-t border-border bg-background px-5 py-4">
                                      <p className="mb-1 text-[11px] uppercase tracking-wide text-muted">Resumen AI</p>
                                      <p className="text-sm text-foreground">{selectedConversation.summary}</p>
                                    </div>
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {accounts.length === 0 && (
          <div className="py-12 text-center">
            <Building2 className="mx-auto mb-3 h-10 w-10 text-muted" />
            <p className="text-sm text-muted">No hay cuentas registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}
