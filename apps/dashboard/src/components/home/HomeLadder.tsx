'use client';

import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';
import { Mas } from './Mas';

/**
 * Los seis niveles de autonomía.
 *
 * Contesta la pregunta que todo director comercial se hace en silencio y casi
 * nunca dice en voz alta: "¿y si le manda una babosada a mi mejor cuenta?".
 *
 * La respuesta honesta no es "eso no pasa" —pasa— sino esta escala: el sistema
 * empieza mirando, y cada permiso nuevo se gana contra una prueba. Por eso va
 * entre el ciclo y la medición: primero qué hace, luego hasta dónde puede
 * llegar solo, luego cómo se comprueba que puede.
 *
 * Es una <ol> y no una tabla ni seis tarjetas. Una escala numerada es el
 * formato más rápido que existe para leer información ordenada, y sobrevive a
 * 390px sin desplazamiento horizontal: el número y el nombre quedan en una
 * fila y el detalle pasa abajo.
 */
export function HomeLadder() {
  const t = useT();
  const l = t.home.ladder;

  return (
    <Section id="autonomia">
      <SectionHeader label={l.label} title={l.title} subtitle={l.subtitle} />

      <ol className="mt-12">
        {l.levels.map((level, i) => (
          <Reveal
            as="li"
            key={level.n}
            delay={i * 50}
            className="grid gap-x-8 gap-y-1 border-t border-hairline py-4 sm:grid-cols-[13rem_1fr] sm:items-baseline"
          >
            <p className="flex items-baseline gap-3">
              {/* El número lleva su rótulo: "01" suelto se lee como un índice
                  de sección, y lo que esta lista enumera son permisos. */}
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-green">
                {l.levelWord} {level.n}
              </span>
              <span className="font-medium text-foreground">{level.name}</span>
            </p>
            <p className="text-[15px] leading-relaxed text-muted-foreground">{level.detail}</p>
          </Reveal>
        ))}
      </ol>

      {/* La línea que cierra la sección es el compromiso, no un resumen: el
          visitante puede irse habiendo leído sólo esto y se lleva lo que
          importa. Por eso va fuera del <Mas> y con la regla completa encima. */}
      <Reveal className="border-t border-hairline pt-6">
        <p className="md-measure text-foreground">
          <Emphasis text={l.note} />
        </p>
      </Reveal>

      <div className="mx-auto max-w-3xl">
        <Mas resumen={l.mas.resumen} parrafos={l.mas.parrafos} />
      </div>
    </Section>
  );
}
