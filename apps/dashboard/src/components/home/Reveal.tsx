'use client';

import { useEffect, useRef } from 'react';

/**
 * La única animación que queda en la portada: aparecer una vez al entrar.
 *
 * Por qué no `motion`. La versión anterior tenía seis componentes atados al
 * scroll (`useScroll`, `useInView` por sección, un barrido de clip-path por
 * banda, un marquee infinito y una sonda `elementsFromPoint` en cada
 * fotograma para el nav). Cada uno de ellos corre en el hilo principal
 * durante el scroll, que es justo el momento en el que no hay presupuesto.
 * En un teléfono de gama media eso se sentía como que el sitio se trababa.
 *
 * Aquí hay UN observer para toda la página, compartido entre todos los
 * elementos, y en cuanto un elemento entra se le quita de encima
 * (`unobserve`). No hay listener de scroll, no hay rAF, y la transición la
 * corre el compositor porque es sólo `opacity` y `transform`.
 *
 * El estado oculto vive en CSS bajo `.js-reveal [data-reveal]`, y esa clase
 * la pone el script en línea del layout ANTES del primer pintado. Ese orden
 * importa: si el oculto se aplicara desde aquí, el contenido aparecería,
 * desaparecería y volvería a aparecer. Y si el observer nunca corre —JS
 * apagado, navegador viejo, un error más arriba— el contenido queda visible,
 * que es el fallo correcto.
 */

let shared: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return null;
  if (shared) return shared;
  shared = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = 'shown';
        shared?.unobserve(entry.target);
      }
    },
    // Un pelo dentro de la pantalla: revelar justo en el borde hace que el
    // elemento termine de aparecer cuando ya lleva rato a la vista.
    { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
  );
  return shared;
}

export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // El escalonado va como `transition-delay` y no como un setTimeout: así lo
    // aplica el mismo motor que corre la transición, y si el usuario pide
    // menos movimiento la media query de globals.css lo anula todo de una vez.
    if (delayMs) el.style.transitionDelay = `${delayMs}ms`;

    const observer = getObserver();
    if (!observer) {
      el.dataset.reveal = 'shown';
      return;
    }

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [delayMs]);

  return ref;
}

export function Reveal({
  as: Tag = 'div',
  id,
  delay = 0,
  className = '',
  children,
}: {
  as?: 'div' | 'section' | 'li' | 'article' | 'p' | 'header';
  /**
   * Destino de anclaje. Va en el propio elemento seccionador y no en un div
   * de dentro porque el `scroll-margin-top` que compensa el nav fijo está
   * acotado a section/header/article: con el id en un div, el anclaje deja
   * el título escondido bajo la barra.
   */
  id?: string;
  /** Escalonado en milisegundos. Úsalo con el índice de una lista. */
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <Tag ref={ref as never} id={id} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
