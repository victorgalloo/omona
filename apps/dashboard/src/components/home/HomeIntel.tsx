'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Section, SectionHeader } from './Section';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';

/**
 * Aquí la conversación queda puesta en su lugar.
 *
 * Era TODA la portada anterior: seis loops de video de un agente contestando.
 * Ahora es un bloque, y el bloque no enseña la respuesta sino lo que queda
 * guardado después — que es lo que alimenta al motor y lo que el director
 * comercial va a mirar el lunes.
 *
 * El recuadro `aside` dice en voz alta que el agente también contesta. Hace
 * falta: buena parte del tráfico llega buscando "chatbot para WhatsApp", y sin
 * esa frase esa persona no entiende por qué la página le habla de otra cosa.
 * Decirlo y en la misma línea explicar por qué no es el producto convence más
 * que esconderlo.
 */
export function HomeIntel() {
  const t = useT();
  const i = t.home.intel;

  return (
    <Section id="inteligencia">
      <SectionHeader label={i.label} title={i.title} subtitle={i.subtitle} />

      <div className="mt-12 grid items-start gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        {/* Lo que entró */}
        <Reveal className="border border-hairline bg-surface p-5 sm:p-6">
          <p className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {i.sourceLabel}
          </p>
          <p className="leading-relaxed text-muted-foreground">{i.source}</p>
        </Reveal>

        {/* Apunta hacia donde va el flujo: abajo cuando los paneles se apilan
            en móvil, a la derecha cuando van lado a lado. Antes era un
            CornerDownRight girado, y el resultado apuntaba arriba y a la
            izquierda — justo al revés de la lectura. */}
        <Reveal className="flex justify-center py-1 lg:py-0 lg:pt-16">
          <ArrowRight aria-hidden className="h-5 w-5 rotate-90 text-muted lg:rotate-0" />
        </Reveal>

        {/* Lo que quedó guardado */}
        <Reveal delay={80} className="overflow-hidden border border-border bg-background">
          <p className="border-b border-hairline px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {i.fieldsLabel}
          </p>
          <dl className="divide-y divide-hairline">
            {i.fields.map((field) => (
              <div key={field.key} className="grid gap-1 px-5 py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4">
                <dt className="font-mono text-[11.5px] text-accent-green">{field.key}</dt>
                <dd className="text-[13.5px] leading-relaxed text-foreground">{field.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Reveal className="mt-14 flex flex-col gap-5 border-t border-hairline pt-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
        <div className="max-w-2xl">
          <h3 className="mb-2.5 text-[17px] font-medium text-foreground">{i.aside.title}</h3>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            <Emphasis text={i.aside.detail} />
          </p>
        </div>
        <Link
          href="/demo"
          className="group inline-flex shrink-0 items-center gap-2 self-start border border-border px-5 py-3 text-[15px] font-medium text-foreground transition-colors hover:border-border-hover hover:bg-surface"
        >
          {i.aside.cta}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>
    </Section>
  );
}
