'use client';

import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
  isLast?: boolean;
}

export function MessageBubble({ content, role, createdAt, isLast }: MessageBubbleProps) {
  if (role === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className="text-center text-xs text-muted">
          {content}
        </div>
      </div>
    );
  }

  const isUser = role === 'user';

  return (
    <div className={cn('flex mb-1.5', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] px-4 py-2 rounded-2xl text-sm',
          isUser
            ? 'bg-foreground text-background'
            : 'bg-surface-2 border border-border text-foreground'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={cn(
            'text-[11px] leading-none',
            isUser ? 'text-background/60' : 'text-muted'
          )}>
            {formatTime(createdAt)}
          </span>
          {isUser && (
            isLast ? (
              <CheckCheck className={cn('h-3.5 w-3.5', 'text-background/60')} />
            ) : (
              <CheckCheck className="h-3.5 w-3.5 text-background/40" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
