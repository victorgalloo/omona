import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';

/**
 * El contenedor de sección de la portada.
 *
 * Reemplaza a <Band>, que pintaba cada sección de un color a sangre (lima,
 * cyan, naranja) y la barría con un clip-path al entrar. Aquí hay una sola
 * superficie de arriba a abajo y lo que separa una sección de otra es una
 * regla de 1px y el aire — el criterio de Vercel, GitHub y Supabase.
 *
 * Es un componente de servidor: no tiene estado ni escucha nada, así que no
 * lleva 'use client' y no pesa un byte en el bundle del navegador.
 */
export function Section({
  id,
  rule = true,
  className = '',
  children,
}: {
  id?: string;
  /** Regla superior. Apágala en la primera sección tras el héroe. */
  rule?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`${rule ? 'border-t border-hairline' : ''} px-5 py-20 sm:px-8 sm:py-28 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

/** Rótulo monoespaciado de sección. El acento de color de la página. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-accent-green">
      {children}
    </p>
  );
}

export function SectionHeader({
  label,
  title,
  subtitle,
  className = '',
}: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Reveal as="header" className={`max-w-3xl ${className}`}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-[clamp(1.9rem,4.4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-muted-foreground">
          <Emphasis text={subtitle} />
        </p>
      )}
    </Reveal>
  );
}

/**
 * Cita a sangre. Es el recurso que sustituye a la banda de neón: interrumpe
 * por tipografía y por aire, no por un fondo de color.
 */
export function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="mt-14 border-l-2 border-accent-green pl-6 sm:pl-8">
      <p className="max-w-3xl text-[clamp(1.15rem,2.4vw,1.6rem)] font-medium leading-snug tracking-[-0.02em] text-foreground">
        {children}
      </p>
    </Reveal>
  );
}
