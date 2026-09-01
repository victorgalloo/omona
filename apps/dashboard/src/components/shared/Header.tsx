'use client';

interface HeaderProps {
  title: string;
  /** Una línea que explica para qué sirve la pantalla. Sin ella el header
   *  conserva su altura compacta de siempre. */
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header
      className={`flex shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6 ${
        subtitle ? 'py-3' : 'h-14'
      }`}
    >
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-muted truncate">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {children}
      </div>
    </header>
  );
}
