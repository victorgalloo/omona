import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'h-12 w-full rounded-xl border border-border bg-surface px-4 text-body text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/30 focus-visible:border-info/50 shadow-subtle transition disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
