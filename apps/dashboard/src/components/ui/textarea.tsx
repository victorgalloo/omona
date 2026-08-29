import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'min-h-[200px] w-full rounded-xl border border-border bg-surface px-4 py-3 text-body text-foreground font-mono placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/30 focus-visible:border-info/50 shadow-subtle transition disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
