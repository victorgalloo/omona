'use client';

import Link from 'next/link';
import { ArrowRight, Check, Square } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { CTA_PROYECTO } from '@/lib/cta';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';

/**
 * El héroe.
 *
 * Lo que había antes: un titular que entraba palabra por palabra, dos halos de
 * 46vw con `blur(120px)` derivando en bucle, cuatro burbujas de chat subiendo
 * con `backdrop-blur`, un brillo recorriendo el botón y un <video> de 340 KB
 * reproduciéndose solo. Seis fuentes de trabajo simultáneo antes de que el
 * visitante leyera una línea. El desenfoque solo ya obliga a recomponer una
 * superficie enorme en cada fotograma.
 *
 * Lo que hay ahora: una retícula pintada con dos gradientes —una sola capa, sin
 * nodos ni descargas— y contenido estático. El movimiento se limita a la
 * revelación de entrada.
 *
 * Y el cambio de fondo: la ilustración ya no es un chat. Es la tarjeta de
 * jugada, que es el producto real. Un chat contestando lo enseña cualquiera;
 * una tarjeta que dice a quién buscar hoy, con el mensaje escrito y el valor
 * del deal al lado, no.
 */
export function HomeHero() {
  const t = useT();
  const h = t.home.hero;

  return (
    <header className="relative overflow-hidden border-b border-hairline px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            {h.eyebrow}
          </p>

          <h1 className="text-[clamp(2.4rem,6.2vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground">
            {h.title}
            <br />
            <span className="text-muted">{h.titleAccent}</span>
          </h1>

          <p
            id="hero-description"
            className="mt-7 max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-lg"
          >
            <Emphasis text={h.subtitle} />
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={CTA_PROYECTO}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3.5 text-[15px] font-medium text-background transition-opacity hover:opacity-90"
            >
              {h.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="#ciclo"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:border-border-hover hover:bg-surface"
            >
              {h.ctaSecondary}
            </Link>
          </div>

          <p className="mt-6 font-mono text-xs text-muted">{h.note}</p>
        </Reveal>

        <Reveal delay={120}>
          <PlayCard />
        </Reveal>
      </div>
    </header>
  );
}

/**
 * La tarjeta de jugada. Es marcado estático, no una captura: pesa cero, se
 * lee con lector de pantalla, y cuando cambia el tema cambia con él — cosa
 * que una imagen no hace. Los datos son de ejemplo y están en i18n.
 */
function PlayCard() {
  const t = useT();
  const c = t.home.hero.card;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-elevated">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {c.label}
        </span>
        <span className="flex items-center gap-2.5">
          <span className="rounded border border-warning/40 bg-warning-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warning">
            {c.cohort}
          </span>
          <span className="font-mono text-[11px] text-muted">{c.elapsed}</span>
        </span>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <div>
          <p className="text-[15px] font-medium text-foreground">{c.contact}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{c.why}</p>
        </div>

        <div className="rounded-lg border border-hairline bg-background p-3.5 sm:p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {c.messageLabel}
          </p>
          <p className="text-[13.5px] leading-relaxed text-foreground">{c.message}</p>
        </div>

        <div>
          <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {c.checksLabel}
          </p>
          <ul className="space-y-2">
            {c.checks.map((check) => (
              <li key={check} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                <Square aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-4 font-mono text-[11px] text-muted">
          <span>
            {c.valueLabel} <span className="text-foreground">{c.value}</span>
          </span>
          <span>
            {c.timeLabel} <span className="text-foreground">{c.time}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-border px-3 py-1.5 text-[12px] text-muted-foreground">
            {c.actionSecondary}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[12px] font-medium text-background">
            <Check aria-hidden className="h-3.5 w-3.5" />
            {c.actionPrimary}
          </span>
        </div>
      </div>
    </div>
  );
}
