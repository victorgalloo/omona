'use client';

import { useEffect, useRef, useCallback } from 'react';
import { UserRound, Info, HandMetal, Bot, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useMessages } from '@/hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

interface ChatViewProps {
  conversationId: string | null;
  onToggleSidebar?: () => void;
  onBack?: () => void;
}

const statusLabels: Record<string, string> = {
  active: 'Activa',
  handoff: 'Handoff',
  resolved: 'Resuelta',
  archived: 'Archivada',
};

const statusColors: Record<string, string> = {
  active: 'bg-success-muted text-success border-success/20',
  handoff: 'bg-warning-muted text-warning border-warning/20',
  resolved: 'bg-surface-2 text-muted border-border',
  archived: 'bg-surface-2 text-muted border-border',
};

export function ChatView({ conversationId, onToggleSidebar, onBack }: ChatViewProps) {
  const { messages, conversation, loading, sendMessage, refetch } = useMessages(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTakeOver = useCallback(async () => {
    if (!conversationId) return;
    await api.patch(`/api/conversations/${conversationId}`, { status: 'handoff' });
    refetch();
  }, [conversationId, refetch]);

  const handleReturnToBot = useCallback(async () => {
    if (!conversationId) return;
    await api.patch(`/api/conversations/${conversationId}`, { status: 'active' });
    refetch();
  }, [conversationId, refetch]);

  const handleManualSend = useCallback(async (text: string) => {
    if (!conversationId) return;
    try {
      if (conversation?.status !== 'handoff') {
        await api.patch(`/api/conversations/${conversationId}`, { status: 'handoff' });
        refetch();
      }
      await sendMessage(text);
    } catch (err: any) {
      const msg = err.message || 'Error al enviar mensaje';
      if (msg.includes('WhatsApp')) {
        toast.warning(msg);
      } else {
        toast.error(msg);
      }
    }
  }, [conversationId, conversation?.status, sendMessage, refetch]);

  if (!conversationId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-surface">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border border-border">
          <Bot className="h-8 w-8 text-muted" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          <span className="font-mono">omona_</span>
        </h2>
        <p className="mt-2 text-sm text-muted">
          Selecciona una conversación para ver los mensajes
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="flex gap-1">
          {[0, 0.2, 0.4].map((delay) => (
            <div
              key={delay}
              className="w-2 h-2 rounded-full bg-terminal-green animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const isHandoff = conversation?.status === 'handoff';
  const isActive = conversation?.status === 'active';

  return (
    <div className="flex flex-1 flex-col">
      {/* Chat Header */}
      <div className="flex h-14 items-center justify-between border-b border-border bg-surface-2 px-2 md:px-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          {onBack && (
            <button onClick={onBack} className="flex md:hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-surface hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 border border-border text-foreground">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {conversation?.contact_name || conversation?.phone_number}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted font-mono">
                {conversation?.phone_number}
              </span>
              {conversation?.status && (
                <span className={`inline-flex items-center px-1.5 py-0 text-[10px] font-medium rounded-lg border ${statusColors[conversation.status]}`}>
                  {statusLabels[conversation.status]}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isHandoff && (
            <Button variant='outline' size='sm' onClick={handleReturnToBot} className='text-xs rounded-xl'>
              <Bot className='mr-1.5 h-3.5 w-3.5' />
              Devolver al bot
            </Button>
          )}
          {isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTakeOver}
              className="text-xs rounded-xl"
            >
              <HandMetal className="mr-1.5 h-3.5 w-3.5" />
              Tomar control
            </Button>
          )}
          <button
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Status Banners */}
      {isActive && (
        <div className="flex items-center justify-center gap-2 bg-success-muted py-1.5 text-xs text-success border-b border-success/20">
          <Bot className="h-3.5 w-3.5" />
          <span className="font-mono">omona_</span> está respondiendo
        </div>
      )}
      {isHandoff && (
        <div className="flex items-center justify-center gap-2 bg-warning-muted py-1.5 text-xs text-warning border-b border-warning/20">
          <HandMetal className="h-3.5 w-3.5" />
          Modo manual — el bot está pausado
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-background px-3 md:px-12 py-4">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            content={msg.content}
            role={msg.role}
            createdAt={msg.created_at}
            isLast={idx === messages.length - 1 && msg.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSend={handleManualSend} />
    </div>
  );
}
