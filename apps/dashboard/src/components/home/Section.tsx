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
    <p className="mb-5 text-xs uppercase tracking-[0.14em] text-accent-green">
      {/* El rotulo es el unico verde de la seccion, y el `//` lo ancla al
          lenguaje del archivo. Aparte va aria-hidden: "barra barra" antes de
          cada rotulo es ruido para quien escucha la pagina. */}
      <span aria-hidden className="md-syntax">// </span>
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
      <h2 className="text-[clamp(1.5rem,3.4vw,2.2rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="md-measure mt-5 text-[15px] leading-[1.75] text-muted-foreground sm:text-[16px]">
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
    <Reveal className="mt-14">
      {/* <blockquote> de verdad, no un div con borde: asi hereda el `> ` que
          .md blockquote::before dibuja, y ademas lo anuncia como cita. */}
      <blockquote className="border-l border-accent-green pl-5">
        <p className="max-w-[60ch] text-[clamp(1rem,2vw,1.3rem)] font-medium leading-snug text-foreground">
          {children}
        </p>
      </blockquote>
    </Reveal>
  );
}
