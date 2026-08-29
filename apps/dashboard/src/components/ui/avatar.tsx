import { cn } from '@/lib/utils';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const sizes = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

export function Avatar({ size = 'md', className, children }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-surface-2 border border-border font-medium text-foreground',
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
}
