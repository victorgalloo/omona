'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, SendHorizontal, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageBubble } from '@/components/inbox/MessageBubble';
import { api } from '@/lib/api';

interface TestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface TestChatResponse {
  reply: string;
  conversation_id: string;
  extracted_info: Record<string, unknown>;
  lead_score: number;
}

interface StepTestBotProps {
  organizationId: string;
  onComplete: () => void;
}

export function StepTestBot({ organizationId, onComplete }: StepTestBotProps) {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: TestMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await api.post<TestChatResponse>('/api/test/chat', {
        message: text,
        conversation_id: convId,
        organization_id: organizationId,
      });

      setConvId(res.conversation_id);

      const botMsg: TestMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, botMsg]);
    } catch {
      const errorMsg: TestMessage = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: 'Error al conectar con el servidor. Intenta de nuevo.',
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setSending(false);
    }
  }, [input, sending, convId, organizationId]);

  const handleReset = () => {
    setMessages([]);
    setConvId(undefined);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green/10">
        <Bot className="h-8 w-8 text-accent-green" />
      </div>

      <h2 className="mb-2 text-2xl font-semibold text-foreground">
        Prueba tu bot
      </h2>
      <p className="mb-6 text-center text-sm text-muted">
        Envía mensajes de prueba para ver cómo responde tu agente de ventas
      </p>

      {/* Chat Window */}
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between bg-surface-2 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-green text-background">
              <Bot className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-background">Omona Bot</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-background/70 hover:text-background"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
        </div>

        {/* Messages */}
        <div className="bg-background h-[340px] overflow-y-auto px-4 py-3">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted">
                Escribe un mensaje para probar tu bot
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              content={msg.content}
              role={msg.role}
              createdAt={msg.created_at}
            />
          ))}
          {sending && (
            <div className="flex justify-end mb-1">
              <div className="rounded-lg bg-foreground px-4 py-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-border bg-surface px-3 py-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-lg bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-green text-background disabled:opacity-50"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button onClick={onComplete} className="mt-8" size="lg">
        <CheckCircle2 className="mr-2 h-5 w-5" />
        ¡Todo listo! Ir al panel
      </Button>
    </div>
  );
}
