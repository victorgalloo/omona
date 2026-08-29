'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

interface Conversation {
  id: string;
  organization_id: string;
  phone_number: string;
  contact_name: string | null;
  status: 'active' | 'handoff' | 'resolved' | 'archived';
  lead_id: string | null;
  summary: string | null;
  metadata: Record<string, unknown>;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  last_message?: {
    id: string;
    content: string;
    role: string;
    created_at: string;
  };
  unread_count?: number;
}

interface PaginatedResponse {
  data: Conversation[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export function useConversations(filter?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const params = filter && filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get<PaginatedResponse>(`/api/conversations${params}`);
      setConversations(res.data);
    } catch {
      // Silently fail - conversations will be empty
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}
