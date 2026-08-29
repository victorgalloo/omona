'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, SendHorizontal, RotateCcw, Info, X, ChevronUp } from 'lucide-react';
import { MessageBubble } from '@/components/inbox/MessageBubble';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';

interface TestMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ExtractedInfo {
  name: string | null;
  email: string | null;
  company: string | null;
  company_size: string | null;
  budget: string | null;
  timeline: string | null;
  interest: string | null;
  pain_points: string | null;
}

interface TestChatResponse {
  reply: string;
  conversation_id: string;
  extracted_info: ExtractedInfo;
  lead_score: number;
}

const infoLabels: Record<string, string> = {
  name: 'Nombre',
  email: 'Email',
  company: 'Empresa',
  company_size: 'Tamaño',
  budget: 'Presupuesto',
  timeline: 'Timeline',
  interest: 'Interés',
  pain_points: 'Pain points',
};

export default function TestPage() {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [convId, setConvId] = useState<string | undefined>();
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const [leadScore, setLeadScore] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      });

      setConvId(res.conversation_id);
      setExtractedInfo(res.extracted_info);
      setLeadScore(res.lead_score);

      const botMsg: TestMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: 'Error al conectar con el servidor.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, sending, convId]);

  const handleReset = () => {
    setMessages([]);
    setConvId(undefined);
    setExtractedInfo(null);
    setLeadScore(0);
    setShowInfo(false);
  };

  const hasInfo = extractedInfo && Object.values(extractedInfo).some((v) => v);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface-2 px-3 py-2.5 md:px-4 md:py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-green">
            <Bot className="h-4.5 w-4.5 text-background" />
          </div>
          <div>
            <p className="text-sm font-medium text-background">Omona Bot</p>
            <p className="text-[11px] text-background/70">Modo de prueba</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {hasInfo && (
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-background/70 hover:bg-background/10 hover:text-background"
            >
              <Info className="h-4.5 w-4.5" />
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex h-9 w-9 items-center justify-center rounded-full text-background/70 hover:bg-background/10 hover:text-background"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info drawer (mobile: slides up, desktop: side panel) */}
      {showInfo && extractedInfo && (
        <div className="md:hidden absolute inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom rounded-t-2xl bg-background shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Info del lead</h3>
            <button onClick={() => setShowInfo(false)} className="text-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-4">
            <div className="mb-4 text-center">
              <div className="text-3xl font-bold text-accent-green">{leadScore}</div>
              <Progress value={leadScore} className="mx-auto mt-1 max-w-[200px]" />
              <p className="mt-1 text-xs text-muted">Puntuación</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(extractedInfo).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div key={key} className="rounded-lg bg-surface p-2.5">
                    <Label className="text-[10px] uppercase tracking-wide text-muted">
                      {infoLabels[key] || key}
                    </Label>
                    <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex flex-1 flex-col">
          {/* Messages */}
          <div className="bg-background flex-1 overflow-y-auto px-3 py-3 md:px-10 md:py-4">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center px-6">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-background/80 shadow-sm">
                    <Bot className="h-8 w-8 text-accent-green" />
                  </div>
                  <p className="text-sm text-muted">
                    Envía un mensaje para probar tu agente de ventas
                  </p>
                </div>
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
                <div className="rounded-lg bg-foreground px-4 py-2.5 shadow-sm">
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

          {/* Score pill (mobile, when there's info) */}
          {hasInfo && !showInfo && (
            <div className="md:hidden flex justify-center -mt-2 mb-1 relative z-10">
              <button
                onClick={() => setShowInfo(true)}
                className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs shadow-md border border-border"
              >
                <div className="h-2 w-2 rounded-full bg-accent-green" />
                <span className="font-medium text-foreground">Score: {leadScore}</span>
                <ChevronUp className="h-3 w-3 text-muted" />
              </button>
            </div>
          )}

          {/* Input */}
          <div className="flex items-end gap-2 bg-surface px-2 py-2 md:px-4 md:py-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Escribe un mensaje..."
                disabled={sending}
                rows={1}
                className="w-full resize-none rounded-2xl border-0 bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent-green"
                style={{ maxHeight: '100px' }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 100) + 'px';
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-green text-background transition-all active:scale-95 disabled:opacity-40"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop side panel */}
        <div className="hidden md:block w-[280px] border-l border-border bg-background overflow-y-auto">
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted" />
              <h3 className="text-sm font-semibold text-foreground">Info extraída</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="mb-4 text-center">
              <div className="text-2xl font-bold text-accent-green">{leadScore}</div>
              <Progress value={leadScore} className="mt-1" />
              <p className="mt-1 text-xs text-muted">Puntuación del lead</p>
            </div>
            {extractedInfo ? (
              <div className="space-y-3">
                {Object.entries(extractedInfo).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key}>
                      <Label className="text-[10px] uppercase tracking-wide text-muted">
                        {infoLabels[key] || key}
                      </Label>
                      <p className="text-sm text-foreground">{value}</p>
                    </div>
                  );
                })}
                {!hasInfo && (
                  <p className="text-center text-sm text-muted">
                    Aún no se ha extraído información
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-sm text-muted">
                La info aparecerá conforme el bot la extraiga
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
