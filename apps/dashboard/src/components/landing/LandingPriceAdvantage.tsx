'use client';

import Link from 'next/link';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { Band } from './motion/Band';
import { RevealText } from './motion/RevealText';

/**
 * ManyChat esconde su precio de la landing, y con razón: $29 de plan + $29 del
 * add-on de IA + los fees por mensaje de Meta no se explican en una tarjeta.
 *
 * Omona está en la posición opuesta. Con la IA incluida y sin cobro por
 * contacto, es la opción más barata del mercado LATAM, y esconderlo tira el
 * argumento más fuerte que tiene. Por eso va en la banda más gritona de la
 * página y se compara de frente, en pesos, contra los cuatro competidores que
 * el visitante está evaluando de verdad.
 *
 * Precios verificados el 2026-09-01 sobre fuentes públicas. Si esta tabla
 * envejece deja de ser un argumento y pasa a ser un riesgo: se revisa en cada
 * corrida del benchmark (docs/benchmark/manychat-scorecard.md).
 */
export function LandingPriceAdvantage() {
  const t = useT();
  const { rows, ...copy } = t.priceAdvantage;

  return (
    <Band tone="yellow" id="comparativa" className="py-24 sm:py-32">
      <div className="mb-14 max-w-3xl">
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.16em] text-band-muted">
          {copy.sectionLabel}
        </p>
        <RevealText
          as="h2"
          lines={copy.headingLines}
          className="mb-5 text-display font-bold text-band-fg"
        />
        <p className="text-xl leading-relaxed text-band-muted">{copy.subheading}</p>
      </div>

      {/* overflow-x-auto: la tabla no debe empujar el ancho de la página en móvil */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">{copy.tableCaption}</caption>
          <thead>
            <tr className="border-b-2 border-band-fg">
              {[copy.colTool, copy.colPrice, copy.colAi, copy.colCrm, copy.colNote].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="pb-3 pr-5 font-mono text-xs font-medium uppercase tracking-[0.12em] text-band-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.tool} className="border-b border-band-fg/20">
                <th
                  scope="row"
                  className={`py-5 pr-5 align-top text-base ${
                    row.isOmona ? 'font-bold text-band-fg' : 'font-medium text-band-muted'
                  }`}
                >
                  {row.tool}
                </th>
                <td
                  className={`whitespace-nowrap py-5 pr-5 align-top font-mono ${
                    row.isOmona ? 'text-2xl font-bold text-band-fg' : 'text-base text-band-fg/80'
                  }`}
                >
                  {row.price}
                </td>
                <td className="py-5 pr-5 align-top">
                  <Flag on={row.ai} />
                </td>
                <td className="py-5 pr-5 align-top">
                  <Flag on={row.crm} />
                </td>
                <td className="max-w-sm py-5 align-top text-sm leading-relaxed text-band-muted">
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 max-w-3xl font-mono text-xs leading-relaxed text-band-muted">
        {copy.source}
      </p>

      <div className="mt-12">
        <Link
          href="/signup"
          className="group inline-flex items-center gap-2.5 bg-ink px-8 py-4 text-base font-semibold text-bone transition-transform hover:-translate-y-0.5"
        >
          {copy.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Band>
  );
}

function Flag({ on }: { on: boolean }) {
  return on ? (
    <Check className="h-5 w-5 text-band-fg" aria-label="sí" />
  ) : (
    <Minus className="h-5 w-5 text-band-fg/35" aria-label="no" />
  );
}
