'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneForwarded, Clock, CheckCircle2, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { formatRelativeTime } from '@/lib/utils';

interface Handoff {
  id: string;
  organization_id: string;
  conversation_id: string;
  reason: string | null;
  status: 'pending' | 'accepted' | 'resolved';
  assigned_to: string | null;
  resolved_at: string | null;
  created_at: string;
  conversation?: {
    contact_name: string | null;
    phone_number: string;
  };
}

export default function HandoffPage() {
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const posthog = usePostHog();

  const fetchHandoffs = useCallback(async () => {
    try {
      const res = await api.get<{ data: Handoff[] }>('/api/handoffs');
      setHandoffs(res.data);
    } catch {
      // Handle error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHandoffs();
  }, [fetchHandoffs]);

  useEffect(() => {
    const channel = supabase
      .channel('handoffs-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'handoffs' },
        () => {
          fetchHandoffs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchHandoffs]);

  const handleAccept = async (handoff: Handoff) => {
    try {
      await api.post(`/api/handoffs/${handoff.id}/accept`);
      posthog?.capture('handoff_accepted', { conversation_id: handoff.conversation_id });
      toast.success('Handoff aceptado');
      router.push(`/inbox?conversation=${handoff.conversation_id}`);
    } catch {
      // Handle error
    }
  };

  const handleResolve = async (handoff: Handoff) => {
    try {
      await api.post(`/api/handoffs/${handoff.id}/resolve`);
      posthog?.capture('handoff_resolved', { conversation_id: handoff.conversation_id });
      fetchHandoffs();
    } catch {
      // Handle error
    }
  };

  const pendingHandoffs = handoffs.filter((h) => h.status === 'pending');
  const acceptedHandoffs = handoffs.filter((h) => h.status === 'accepted');
  const resolvedHandoffs = handoffs.filter((h) => h.status === 'resolved');

  return (
    <div className="flex h-full flex-col">
      <Header title="Cola de handoff">
        <Badge variant="warning">{pendingHandoffs.length} pendientes</Badge>
      </Header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 border-t border-border p-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-surface-2 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-surface-2" />
                  <div className="h-3 w-1/2 rounded bg-surface-2" />
                </div>
                <div className="h-8 w-20 rounded bg-surface-2" />
              </div>
            ))}
          </div>
        ) : handoffs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10">
              <PhoneForwarded className="h-8 w-8 text-accent-green" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Todo en orden</h3>
            <p className="mt-1 text-sm text-muted">
              No hay conversaciones pendientes de atención humana
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending */}
            {pendingHandoffs.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
                  Pendientes
                </h3>
                <div className="space-y-3">
                  {pendingHandoffs.map((handoff) => (
                    <div
                      key={handoff.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-t border-border p-4"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                          <UserRound className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {handoff.conversation?.contact_name || handoff.conversation?.phone_number || 'Contacto'}
                          </p>
                          {handoff.reason && (
                            <p className="text-sm text-muted truncate">{handoff.reason}</p>
                          )}
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(handoff.created_at)}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAccept(handoff)} className="w-full sm:w-auto">
                        Aceptar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accepted */}
            {acceptedHandoffs.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
                  En atención
                </h3>
                <div className="space-y-3">
                  {acceptedHandoffs.map((handoff) => (
                    <div
                      key={handoff.id}
                      className="flex items-center gap-4 border-t border-border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info-muted">
                        <UserRound className="h-5 w-5 text-info" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {handoff.conversation?.contact_name || handoff.conversation?.phone_number || 'Contacto'}
                        </p>
                        {handoff.reason && (
                          <p className="text-sm text-muted">{handoff.reason}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/inbox?conversation=${handoff.conversation_id}`)}
                        >
                          Ver chat
                        </Button>
                        <Button size="sm" onClick={() => handleResolve(handoff)}>
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                          Resolver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved */}
            {resolvedHandoffs.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
                  Resueltos
                </h3>
                <div className="space-y-3">
                  {resolvedHandoffs.map((handoff) => (
                    <div
                      key={handoff.id}
                      className="flex items-center gap-4 border-t border-border p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-muted">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {handoff.conversation?.contact_name || handoff.conversation?.phone_number || 'Contacto'}
                        </p>
                        {handoff.reason && (
                          <p className="text-sm text-muted">{handoff.reason}</p>
                        )}
                      </div>
                      <span className="text-xs text-muted">
                        {handoff.resolved_at
                          ? formatRelativeTime(handoff.resolved_at)
                          : formatRelativeTime(handoff.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
