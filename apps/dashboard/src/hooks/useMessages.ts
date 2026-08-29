'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';

interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  whatsapp_message_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface ConversationDetail {
  id: string;
  organization_id: string;
  phone_number: string;
  contact_name: string | null;
  status: 'active' | 'handoff' | 'resolved' | 'archived';
  lead_id: string | null;
  summary: string | null;
  messages: Message[];
  lead: {
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
  } | null;
  handoff: {
    id: string;
    reason: string | null;
    status: string;
    assigned_to: string | null;
    created_at: string;
  } | null;
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!conversationId) {
      setMessages([]);
      setConversation(null);
      return;
    }

    if (!silent) setLoading(true);
    try {
      const res = await api.get<ConversationDetail>(`/api/conversations/${conversationId}`);
      setConversation(res);
      setMessages(res.messages);
    } catch {
      // Silently fail
    } finally {
      if (!silent) setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Realtime: subscribe to new messages AND conversation updates (last_message_at)
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `id=eq.${conversationId}`,
        },
        () => {
          // Conversation updated (new message changed last_message_at) → silent refetch
          fetchMessages(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  // Polling fallback: check for new messages every 3s in case Realtime misses events
  useEffect(() => {
    if (!conversationId) return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get<ConversationDetail>(`/api/conversations/${conversationId}`);
        setMessages((prev) => {
          // Don't clobber optimistic messages that haven't been saved yet
          if (prev.some((m) => m.id.startsWith('optimistic-'))) return prev;
          // Only update if there are actual changes
          const lastNew = res.messages[res.messages.length - 1];
          const lastOld = prev[prev.length - 1];
          if (res.messages.length !== prev.length) return res.messages;
          if (lastNew && lastOld && lastNew.id !== lastOld.id) return res.messages;
          return prev;
        });
        if (res.status !== conversation?.status) {
          setConversation(res);
        }
      } catch {
        // Silently fail — next poll will catch up
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, conversation?.status]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId) return;

      // Optimistic: show the message immediately in the UI
      const optimisticMsg: Message = {
        id: `optimistic-${Date.now()}`,
        conversation_id: conversationId,
        role: 'assistant',
        content,
        whatsapp_message_id: null,
        metadata: {},
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const saved = await api.post<Message & { whatsapp_sent?: boolean; whatsapp_error?: string | null }>(
          `/api/conversations/${conversationId}/send`,
          { message: content }
        );
        // Replace optimistic message with the real one from the server
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? saved : m))
        );
        // Throw if WhatsApp send failed so caller can show warning
        if (saved.whatsapp_sent === false) {
          throw new Error(saved.whatsapp_error || 'No se pudo enviar por WhatsApp');
        }
      } catch (err) {
        // Only remove optimistic message if the API call itself failed (not WhatsApp)
        if (!(err instanceof Error && err.message.includes('WhatsApp'))) {
          setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        }
        throw err;
      }
    },
    [conversationId]
  );

  return { messages, conversation, loading, sendMessage, refetch: fetchMessages };
}
