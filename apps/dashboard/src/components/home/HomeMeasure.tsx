'use client';

import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';
import { Mas } from './Mas';
import { Terminal } from './Terminal';

/**
 * Lo que separa esto de un chatbot: las evaluaciones.
 *
 * La fórmula de "terminado" va como bloque de código monoespaciado a
 * propósito: verla escrita como cálculo —y no como párrafo— es lo que la
 * vuelve un criterio y no una promesa de marketing. Va dentro de <Mas> porque
 * es la pregunta de quien ya está negociando.
 */
export function HomeMeasure() {
  const t = useT();
  const m = t.home.measure;

  return (
    <Section id="medicion">
      <SectionHeader label={m.label} title={m.title} subtitle={m.subtitle} />

      {/* La corrida de prueba va ANTES de las cuatro tarjetas: enseña el
          argumento y después lo explica, no al revés. Era la sección más
          abstracta de la página —cuatro bloques de texto afirmando que se
          evalúa— y sin nada que mirar. */}
      <Reveal className="mt-12">
        <Terminal
          comando={m.terminal.comando}
          casos={m.terminal.casos}
          resumen={m.terminal.resumen}
        />
      </Reveal>

      <div className="rule-grid mt-12 grid sm:grid-cols-2">
        {m.metrics.map((metric, i) => (
          <Reveal key={metric.name} delay={i * 60} className="p-6 sm:p-8">
            <h3 className="mb-2.5 text-[17px] font-medium tracking-[-0.01em] text-foreground">
              {metric.name}
            </h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              <Emphasis text={metric.detail} />
            </p>
          </Reveal>
        ))}
      </div>

      {/* La definición de "terminado" va colapsada: es la pregunta de quien ya
          está negociando, no la de quien está decidiendo si sigue leyendo. El
          `contar` le pasa el texto de la fórmula al cálculo del tiempo, porque
          la fórmula se renderiza aquí y no dentro de <Mas>. */}
      <Mas resumen={m.moneyLabel} contar={[m.moneyFormula, m.moneyNote]}>
        <div className="overflow-x-auto border border-border bg-surface">
          <pre className="px-5 py-5 font-mono text-[12px] leading-[1.9] text-foreground sm:px-6 sm:text-[13px]">
            {m.moneyFormula}
          </pre>
        </div>
        <p className="mt-5 max-w-2xl">{m.moneyNote}</p>
      </Mas>
    </Section>
  );
}
