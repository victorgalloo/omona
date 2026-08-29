import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'terminal' | 'outline' | 'success' | 'info' | 'warning' | 'error' | 'secondary';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-surface-2 text-muted border-border',
  terminal: 'bg-surface-2 text-foreground border-border',
  outline: 'border-border text-muted bg-transparent',
  success: 'bg-success-muted text-success border-success/20',
  info: 'bg-info-muted text-info border-info/20',
  warning: 'bg-warning-muted text-warning border-warning/20',
  error: 'bg-error-muted text-error border-error/20',
  secondary: 'bg-surface-2 text-muted border-border',
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 text-label font-medium rounded-lg border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
