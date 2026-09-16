'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { AGENDA_URL } from '@/lib/cta';
import { Terminal } from '@/components/home/Terminal';

/**
 * El recorrido guiado de /demo.
 *
 * Reemplaza al chat de demo anterior, que era una caja de texto donde el
 * visitante tenía que inventar qué preguntar — y que además seguía vendiendo
 * la oferta vieja ("Setup en 2 min", "Escanea un QR").
 *
 * Son cuatro pantallas con DATOS SEMBRADOS, no el dashboard real. El real
 * manda mensajes por WhatsApp, corre broadcasts y borra leads; meter
 * visitantes anónimos ahí exigiría bloquear escrituras en el servidor —no
 * esconder botones— sembrar y resembrar datos, y expirar sesiones. Con datos
 * fijos el recorrido además es determinista: nunca cae en un estado vacío ni
 * depende de que el server esté arriba.
 *
 * El último paso deja un muro sin salida lateral: o se agenda o se vuelve al
 * inicio. La salida al inicio SÍ está, y es deliberado — sin ella, quien no
 * quiere agendar solo puede cerrar la pestaña, y eso pierde al visitante en
 * vez de calificarlo.
 */
export function TourDemo() {
  const t = useT();
  const r = t.recorrido;
  const [paso, setPaso] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const actual = r.pasos[paso];
  const esUltimo = paso === r.pasos.length - 1;

  return (
    <div className="md flex min-h-screen flex-col bg-background text-foreground">
      {/* Barra del recorrido. No es la nav del sitio: durante el recorrido la
          única salida es esta, para que el paso a paso no compita con un menú. */}
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <span className="font-mono text-label uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="md-syntax">{'// '}</span>
            {r.etiqueta}
          </span>
          <Link
            href="/"
            className="font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {r.salir}
          </Link>
        </div>

        {/* Progreso. Una regla por paso: se lee de un vistazo cuántos faltan
            sin necesidad de un número. */}
        <div className="mx-auto flex w-full max-w-6xl gap-1 px-5 pb-3 sm:px-8">
          {r.pasos.map((p, i) => (
            <span
              key={p.id}
              aria-hidden
              className={`h-px flex-1 transition-colors ${
                i <= paso ? 'bg-foreground' : 'bg-hairline'
              }`}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <p className="font-mono text-label text-muted">
          {actual.indice} <span aria-hidden className="md-syntax">·</span> {r.aviso}
        </p>
        <h1 className="mt-3 text-display-sm font-semibold text-foreground">{actual.titulo}</h1>
        <p className="md-measure mt-4 text-muted-foreground">{actual.resumen}</p>

        <div className="mt-10">
          <Pantalla paso={actual} />
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-hairline bg-background/90 px-5 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setPaso((p) => Math.max(0, p - 1))}
            disabled={paso === 0}
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-[15px] text-foreground transition-colors hover:border-border-hover hover:bg-surface disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" />
            {r.anterior}
          </button>
          <button
            type="button"
            onClick={() => (esUltimo ? setTerminado(true) : setPaso((p) => p + 1))}
            className="group inline-flex items-center gap-2 bg-foreground px-6 py-2.5 text-[15px] font-medium text-background transition-opacity hover:opacity-90"
          >
            {esUltimo ? r.ultimo : r.siguiente}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </footer>

      {terminado && <Muro />}
    </div>
  );
}

/** Cada paso dibuja una pantalla distinta. El `pantalla` del i18n la elige. */
function Pantalla({ paso }: { paso: ReturnType<typeof useT>['recorrido']['pasos'][number] }) {
  const t = useT();

  if (paso.pantalla === 'cuentas') {
    return (
      <div className="overflow-x-auto border border-border bg-surface">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              {paso.columnas?.map((c) => (
                <th
                  key={c}
                  className="px-4 py-3 font-mono text-label uppercase tracking-[0.1em] text-muted sm:px-5"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paso.filas?.map((fila) => (
              <tr key={fila[0]} className="border-b border-hairline last:border-b-0">
                <td className="px-4 py-3.5 font-medium text-foreground sm:px-5">{fila[0]}</td>
                <td className="px-4 py-3.5 text-muted-foreground sm:px-5">{fila[1]}</td>
                <td className="px-4 py-3.5 text-muted-foreground sm:px-5">{fila[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (paso.pantalla === 'extraccion') {
    return (
      <div className="grid gap-px border border-border bg-border lg:grid-cols-2">
        <div className="bg-surface p-5 sm:p-6">
          <p className="mb-3 font-mono text-label uppercase tracking-[0.12em] text-muted">
            {paso.fuenteEtiqueta}
          </p>
          <p className="text-[17px] leading-relaxed text-foreground">“{paso.fuente}”</p>
        </div>
        <div className="bg-surface p-5 sm:p-6">
          <p className="mb-3 font-mono text-label uppercase tracking-[0.12em] text-muted">
            {paso.camposEtiqueta}
          </p>
          <dl className="grid gap-2.5">
            {paso.campos?.map(([clave, valor]) => (
              <div key={clave} className="flex flex-wrap gap-x-3 gap-y-0.5">
                <dt className="font-mono text-[13px] text-muted">{clave}</dt>
                <dd className="text-[15px] text-foreground">{valor}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 border-t border-hairline pt-4">
            <span className="font-mono text-label uppercase tracking-[0.12em] text-muted">
              {paso.tareaEtiqueta}
            </span>
            <span className="mt-1.5 flex items-center gap-2 text-[15px] text-foreground">
              <Check aria-hidden className="h-4 w-4 shrink-0" />
              {paso.tarea}
            </span>
          </p>
        </div>
      </div>
    );
  }

  if (paso.pantalla === 'propuesta') {
    return (
      <div className="border border-border bg-surface">
        <p className="border-b border-border px-5 py-3 font-mono text-label uppercase tracking-[0.12em] text-muted">
          {paso.documentoEtiqueta}
        </p>
        <dl className="divide-y divide-hairline">
          {paso.documento?.map(([clave, valor]) => (
            <div key={clave} className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="font-mono text-[13px] text-muted">{clave}</dt>
              <dd className="text-[15px] text-foreground">{valor}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-border px-5 py-4 text-[15px] text-muted-foreground">
          {paso.nota}
        </p>
      </div>
    );
  }

  // La evaluación reusa el mismo <Terminal> de la portada: es literalmente la
  // misma corrida, así que duplicarla habría dejado dos verdades que mantener.
  const m = t.home.measure;
  return (
    <Terminal comando={m.terminal.comando} casos={m.terminal.casos} resumen={m.terminal.resumen} />
  );
}

/**
 * El muro del final. Cubre la pantalla y no se puede descartar: no lleva
 * botón de cerrar, no escucha Escape y no cierra al hacer clic fuera. Las dos
 * únicas salidas son agendar o volver al inicio.
 */
function Muro() {
  const t = useT();
  const c = t.recorrido.cierre;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="muro-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/92 px-5 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg border border-border bg-surface p-7 sm:p-9">
        <p className="font-mono text-label uppercase tracking-[0.14em] text-muted">
          <span aria-hidden className="md-syntax">{'// '}</span>
          {c.etiqueta}
        </p>
        <h2 id="muro-titulo" className="mt-4 text-[clamp(1.5rem,3.4vw,2rem)] font-semibold leading-tight text-foreground">
          {c.titulo}
        </h2>
        <p className="mt-4 text-muted-foreground">{c.cuerpo}</p>

        <a
          href={AGENDA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-7 inline-flex w-full items-center justify-center gap-2 bg-foreground px-6 py-3.5 font-medium text-background transition-opacity hover:opacity-90"
        >
          {c.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="mt-3 text-center font-mono text-[12px] text-muted">{c.nota}</p>

        <Link
          href="/"
          className="mt-5 block text-center text-[14px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {c.salir}
        </Link>
      </div>
    </div>
  );
}
