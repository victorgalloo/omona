'use client';

import { useState, useCallback } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Escribe un mensaje...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const [sending, setSending] = useState(false);

  const handleSend = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;
    setMessage('');
    setSending(true);
    try {
      await onSend(trimmed);
    } catch {
      setMessage(trimmed);
    } finally {
      setSending(false);
    }
  }, [message, onSend, sending]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="flex items-end gap-2 border-t border-border bg-background px-4 py-3">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-info/30 focus:border-info/50 transition"
          style={{ maxHeight: '120px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
          }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={disabled || sending || !message.trim()}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-colors hover:opacity-90 disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
}
