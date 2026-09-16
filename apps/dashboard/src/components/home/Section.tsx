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
    // `font-mono` explicito: antes lo heredaba de `.md`, que ponia toda la
    // pagina en monoespaciado. Ahora el cuerpo es Inter y el rotulo es uno de
    // los cinco sitios donde el mono se queda por firma.
    <p className="mb-5 font-mono text-label uppercase tracking-[0.14em] text-accent-green">
      {/* El rotulo es el unico verde de la seccion, y el `//` lo ancla al
          lenguaje del archivo. Aparte va aria-hidden:"barra barra" antes de
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
      {/* `display-sm` en vez de un clamp escrito a mano que topaba en 35px. El
          salto entre titulo y cuerpo es lo unico que hace que una pagina se
          escanee sola; con 35px contra 15px no habia salto suficiente. */}
      <h2 className="text-display-sm font-semibold text-foreground">{title}</h2>
      {subtitle && (
        <p className="md-measure mt-5 text-muted-foreground">
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
      {/* <blockquote> de verdad y no un div con borde: un lector de pantalla
          lo anuncia como cita. Ya no hereda el `> ` de markdown —esa regla se
          retiro— y lo que la marca es la regla verde de la izquierda. */}
      <blockquote className="border-l border-accent-green pl-5">
        <p className="max-w-[54ch] text-[clamp(1.25rem,2.4vw,1.75rem)] font-medium leading-snug tracking-[-0.015em] text-foreground">
          {children}
        </p>
      </blockquote>
    </Reveal>
  );
}
