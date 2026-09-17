'use client';

import { ArrowRight, Minus } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';

/**
 * La categoría, en dos columnas.
 *
 * Va justo después del diagnóstico porque ahí está la objeción real: el
 * visitante acaba de reconocer su problema y lo siguiente que piensa es "esto
 * ya me lo ofrecieron veinte veces". Contestarlo con adjetivos —"a la medida",
 * "de verdad inteligente"— no funciona: los veinte dicen lo mismo. Lo único
 * que funciona es poner las dos columnas una al lado de otra y dejar que
 * compare.
 *
 * Seis renglones, ninguna prosa, cero <Mas>. Es la sección más rápida de leer
 * de la página y así debe quedarse: quien ya entendió la diferencia sigue
 * bajando, y quien no, la ve entera en un vistazo.
 *
 * Los iconos hacen el trabajo que en escritorio hacen los encabezados de
 * columna. En 390px las dos celdas se apilan, y sin el guion y la flecha no
 * habría forma de saber cuál es cuál — que es el defecto de resolver esto con
 * una <table>, además de que una tabla de dos columnas a esa anchura obliga a
 * desplazamiento horizontal.
 */
export function HomeShift() {
  const t = useT();
  const s = t.home.shift;

  return (
    <Section id="categoria">
      <SectionHeader label={s.label} title={s.title} subtitle={s.subtitle} />

      <div className="mt-12">
        {/* Los rótulos de columna sólo existen donde hay dos columnas. */}
        <div className="hidden gap-8 pb-3 sm:grid sm:grid-cols-2">
          <p className="font-mono text-label uppercase tracking-[0.14em] text-muted">
            {s.commonTitle}
          </p>
          <p className="font-mono text-label uppercase tracking-[0.14em] text-accent-green">
            {s.omonaTitle}
          </p>
        </div>

        {s.rows.map((row, i) => (
          <Reveal
            key={row.omona}
            delay={i * 50}
            className="grid gap-x-8 gap-y-2 border-t border-hairline py-4 sm:grid-cols-2"
          >
            <p className="flex gap-3 text-[15px] leading-relaxed text-muted">
              <Minus aria-hidden className="mt-[0.4rem] h-3.5 w-3.5 shrink-0" />
              {row.common}
            </p>
            <p className="flex gap-3 text-[15px] leading-relaxed text-foreground">
              <ArrowRight
                aria-hidden
                className="mt-[0.4rem] h-3.5 w-3.5 shrink-0 text-accent-green"
              />
              {row.omona}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
