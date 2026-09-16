'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { AGENDA_URL } from '@/lib/cta';
import { Emphasis } from '@/components/home/Emphasis';

/**
 * ══ EL RECORRIDO ════════════════════════════════════════════════════════
 *
 * No enseña el sistema: hace que el visitante intente el trabajo PRIMERO y
 * después le muestra qué se le fue. Esa diferencia es todo el diseño.
 *
 * La versión anterior eran cuatro pantallas con botón de Siguiente. Se leía
 * como folleto: nadie discute un folleto, pero tampoco lo siente. Aquí eliges
 * la cuenta equivocada, o marcas tres de seis campos, y eso produce el único
 * argumento que no se puede refutar — te acaba de pasar a ti, con el ejemplo
 * más fácil que existe.
 *
 * ── Sobre la gamificación ───────────────────────────────────────────────
 *
 * Es seca a propósito. Cero confeti, cero puntos inventados, cero rachas. El
 * marcador cuenta dos cosas y las dos son reales: campos capturados sobre el
 * total, y segundos medidos en el navegador. Un marcador honesto pega más
 * fuerte que uno generoso, y es lo único coherente con un sitio que acaba de
 * quitar todas sus cifras inventadas.
 *
 * Tampoco hay respuestas "malas" con regaño. En el paso 3 las tres opciones
 * lentas cuentan como acierto: la pregunta no es un examen, es que el
 * visitante diga en voz alta cuánto le cuesta hoy.
 *
 * ── Sobre el color ──────────────────────────────────────────────────────
 *
 * Capturado y perdido NO se distinguen por verde y rojo: la identidad es
 * monocroma. Lo capturado va sólido con palomita; lo que se fue va en borde
 * punteado y atenuado. La forma carga el significado, igual que en el
 * terminal de la portada.
 */

type Opcion = { id: string; texto: string; detalle?: string; acierto: boolean };
type Paso = {
  id: string;
  indice: string;
  titulo: string;
  instruccion: string;
  tipo: string;
  cita?: string;
  opciones: Opcion[];
  revelacion: { titulo: string; cuerpo: string; puntos: string[] };
};

/**
 * El `as unknown as` existe porque TypeScript infiere los cuatro pasos como
 * una unión —solo uno trae `cita`— y entonces ninguna propiedad opcional es
 * accesible sin estrechar en cada uso. La forma la garantiza el diccionario,
 * que es la fuente de verdad, y `Translations = typeof es` obliga a que el
 * inglés la respete.
 */
function usePasos(): Paso[] {
  const t = useT();
  return t.recorrido.pasos as unknown as Paso[];
}

export function TourDemo() {
  const t = useT();
  const r = t.recorrido;
  const pasos = usePasos();

  const [paso, setPaso] = useState(0);
  const [fase, setFase] = useState<'pregunta' | 'revelacion'>('pregunta');
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [segundos, setSegundos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const inicio = useRef<number>(Date.now());

  const actual = pasos[paso];
  const esUltimo = paso === pasos.length - 1;
  const correctas = actual.opciones.filter((o) => o.acierto);

  // Un solo intervalo, y solo mientras hay una pregunta abierta. Se apaga en
  // cuanto el visitante responde: cronometrar la lectura de la revelación
  // seria medir otra cosa.
  useEffect(() => {
    if (fase !== 'pregunta' || terminado) return;
    const id = setInterval(() => setSegundos(Math.round((Date.now() - inicio.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, [fase, terminado]);

  const alternar = useCallback(
    (id: string) => {
      if (fase !== 'pregunta') return;
      setSeleccion((s) =>
        actual.tipo === 'una' ? [id] : s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
      );
    },
    [actual.tipo, fase],
  );

  function responder() {
    setAciertos((a) => a + seleccion.filter((id) => correctas.some((c) => c.id === id)).length);
    setFase('revelacion');
  }

  function avanzar() {
    if (esUltimo) {
      setTerminado(true);
      return;
    }
    setPaso((p) => p + 1);
    setSeleccion([]);
    setFase('pregunta');
  }

  // El total contra el que se compara son las respuestas correctas de TODOS
  // los pasos, no solo del que tiene seis campos: si no, el marcador diría
  // "6 de 6" por acertar una sola pregunta.
  const totalCorrectas = pasos.reduce((n, p) => n + p.opciones.filter((o) => o.acierto).length, 0);

  return (
    <div className="md flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <span className="font-mono text-label uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="md-syntax">{'// '}</span>
            {r.etiqueta} <span aria-hidden className="md-syntax">·</span> {actual.indice}/
            {String(pasos.length).padStart(2, '0')}
          </span>
          <span className="flex items-center gap-4">
            <span className="font-mono text-[12px] tabular-nums text-muted" aria-live="off">
              {segundos}s
            </span>
            <Link
              href="/"
              className="font-mono text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {r.salir}
            </Link>
          </span>
        </div>
        <div className="mx-auto flex w-full max-w-4xl gap-1 px-5 pb-3 sm:px-8">
          {pasos.map((p, i) => (
            <span
              key={p.id}
              aria-hidden
              className={`h-px flex-1 transition-colors ${i <= paso ? 'bg-foreground' : 'bg-hairline'}`}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        <p className="font-mono text-label text-muted">{r.aviso}</p>
        <h1 className="mt-3 text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {actual.titulo}
        </h1>
        <p className="md-measure mt-4 text-muted-foreground">
          <Emphasis text={actual.instruccion} />
        </p>

        {actual.cita && (
          <blockquote className="mt-7 border-l border-foreground pl-5">
            <p className="max-w-[62ch] text-[17px] leading-relaxed text-foreground">
              “{actual.cita}”
            </p>
          </blockquote>
        )}

        <ul className="mt-8 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {actual.opciones.map((o) => {
            const elegida = seleccion.includes(o.id);
            const revelado = fase === 'revelacion';
            const perdida = revelado && o.acierto && !elegida;
            return (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => alternar(o.id)}
                  disabled={revelado}
                  aria-pressed={elegida}
                  className={`flex h-full w-full items-start gap-3 p-4 text-left transition-colors sm:p-5 ${
                    revelado
                      ? o.acierto
                        ? 'bg-foreground text-background'
                        : 'bg-surface text-muted opacity-50'
                      : elegida
                        ? 'bg-foreground text-background'
                        : 'bg-background hover:bg-surface'
                  } ${perdida ? 'outline-dashed outline-1 -outline-offset-4 outline-background/60' : ''}`}
                >
                  <span aria-hidden className="mt-0.5 shrink-0">
                    {revelado && o.acierto ? (
                      <Check className="h-4 w-4" />
                    ) : elegida ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4 opacity-40" />
                    )}
                  </span>
                  <span>
                    <span className="block text-[15.5px] font-medium">{o.texto}</span>
                    {o.detalle && (
                      <span className="mt-1 block text-[13.5px] opacity-70">{o.detalle}</span>
                    )}
                    {perdida && (
                      <span className="mt-1.5 block font-mono text-[11px] uppercase tracking-[0.12em] opacity-80">
                        se te fue
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {fase === 'revelacion' && (
          <section className="mt-10 border-t border-foreground pt-8">
            <h2 className="text-[clamp(1.3rem,2.8vw,1.75rem)] font-semibold leading-snug text-foreground">
              {actual.revelacion.titulo}
            </h2>
            <p className="md-measure mt-4 text-muted-foreground">
              <Emphasis text={actual.revelacion.cuerpo} />
            </p>
            <ul className="mt-6 grid gap-3">
              {actual.revelacion.puntos.map((p) => (
                <li key={p} className="flex gap-3.5 text-[15px] leading-relaxed text-muted-foreground">
                  <span aria-hidden className="mt-[0.62em] h-px w-4 shrink-0 bg-border-hover" />
                  {p}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="sticky bottom-0 border-t border-hairline bg-background/90 px-5 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex w-full max-w-4xl justify-end">
          {fase === 'pregunta' ? (
            <button
              type="button"
              onClick={responder}
              disabled={seleccion.length === 0}
              className="group inline-flex items-center gap-2 bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-30"
            >
              {r.responder}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={avanzar}
              className="group inline-flex items-center gap-2 bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              {esUltimo ? r.ultimo : r.siguiente}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </footer>

      {terminado && <Marcador aciertos={aciertos} total={totalCorrectas} segundos={segundos} />}
    </div>
  );
}

/**
 * El muro del final, con el marcador del visitante encima.
 *
 * No se puede descartar: sin botón de cerrar, sin Escape, sin clic fuera. Las
 * dos únicas salidas son agendar o volver al inicio. La salida al inicio SÍ
 * está y es deliberado — sin ella, quien no quiere agendar solo puede cerrar
 * la pestaña, y eso pierde al visitante en vez de calificarlo.
 */
function Marcador({
  aciertos,
  total,
  segundos,
}: {
  aciertos: number;
  total: number;
  segundos: number;
}) {
  const t = useT();
  const m = t.recorrido.marcador;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="marcador-titulo"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-background/95 px-5 py-10 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg border border-border bg-surface p-7 sm:p-9">
        <p className="font-mono text-label uppercase tracking-[0.14em] text-muted">
          <span aria-hidden className="md-syntax">{'// '}</span>
          {m.etiqueta}
        </p>

        <dl className="mt-6 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          <div className="bg-background p-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {m.camposLinea}
            </dt>
            <dd className="mt-1.5 text-[2rem] font-semibold leading-none tabular-nums text-foreground">
              {aciertos}
              <span className="text-muted"> / {total}</span>
            </dd>
          </div>
          <div className="bg-background p-5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {m.tiempoLinea}
            </dt>
            <dd className="mt-1.5 text-[2rem] font-semibold leading-none tabular-nums text-foreground">
              {segundos}s
            </dd>
            <dd className="mt-1 font-mono text-[11px] text-muted">{m.sistemaLinea}</dd>
          </div>
        </dl>

        <h2
          id="marcador-titulo"
          className="mt-7 text-[clamp(1.4rem,3vw,1.9rem)] font-semibold leading-tight text-foreground"
        >
          {m.titulo}
        </h2>
        <p className="mt-3 text-muted-foreground">
          <Emphasis text={m.cuerpo} />
        </p>

        <p className="mt-6 border-t border-hairline pt-6 font-medium text-foreground">
          {m.cierreTitulo}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{m.cierreCuerpo}</p>

        <a
          href={AGENDA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-7 inline-flex w-full items-center justify-center gap-2 bg-foreground px-6 py-3.5 font-medium text-background transition-opacity hover:opacity-90"
        >
          {m.cta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <p className="mt-3 text-center font-mono text-[12px] text-muted">{m.nota}</p>

        <Link
          href="/"
          className="mt-5 block text-center text-[14px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {m.salir}
        </Link>
      </div>
    </div>
  );
}
