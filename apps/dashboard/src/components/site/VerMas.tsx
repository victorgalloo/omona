/**
 * «Ver más» compartido: la misma pieza en /conocimiento y en la portada.
 *
 * <details>/<summary> nativo (HTML de servidor, indexable, sin JS y con
 * teclado). Un nombre de grupo por nivel para que el «Ver más» de adentro no
 * herede el estado del de afuera. Índice 4 = el bloque plegado «Desde mi
 * bóveda» de /conocimiento. Las clases van escritas completas para que
 * Tailwind las encuentre.
 */
export const GRUPO = ['group/n0', 'group/n1', 'group/n2', 'group/n3', 'group/bv'] as const;
const OCULTO_ABIERTO = ['group-open/n0:hidden', 'group-open/n1:hidden', 'group-open/n2:hidden', 'group-open/n3:hidden', 'group-open/bv:hidden'] as const;
const VISIBLE_ABIERTO = ['group-open/n0:inline', 'group-open/n1:inline', 'group-open/n2:inline', 'group-open/n3:inline', 'group-open/bv:inline'] as const;
const GIRO = ['group-open/n0:rotate-90', 'group-open/n1:rotate-90', 'group-open/n2:rotate-90', 'group-open/n3:rotate-90', 'group-open/bv:rotate-90'] as const;
export const BV = 4;

/** Clases del <summary>: sin marcador nativo; el foco visible sale de globals.css. */
export const sumCls = 'group/sum cursor-pointer list-none rounded-[2px] [&::-webkit-details-marker]:hidden';

export function VerMas({ nivel, mas = 'Ver más', menos = 'Ver menos' }: { nivel: number; mas?: string; menos?: string }) {
  return (
    <span className="mono-label ml-3 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap align-baseline text-stone group-hover/sum:text-obsidian">
      <span aria-hidden className={`inline-block transition-transform motion-reduce:transition-none ${GIRO[nivel]}`}>
        ›
      </span>
      <span className={OCULTO_ABIERTO[nivel]}>{mas}</span>
      <span className={`hidden ${VISIBLE_ABIERTO[nivel]}`}>{menos}</span>
    </span>
  );
}
