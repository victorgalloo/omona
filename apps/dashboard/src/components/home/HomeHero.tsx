'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useT } from '@/contexts/LanguageContext';
import { CTA_PROYECTO } from '@/lib/cta';
import { Reveal } from './Reveal';
import { Emphasis } from './Emphasis';
import { FlowField } from '@/components/ui/flow-field';

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
 * Y ya no lleva ilustración. Pasó por un chat, luego por una tarjeta de
 * jugada, y las dos tenían el mismo defecto: explicaban el mecanismo en el
 * sitio donde el visitante todavía no sabe si le interesa. El mecanismo ya se
 * enseña abajo, en la corrida de evaluaciones. Aquí pesan el titular y el
 * botón.
 */
export function HomeHero() {
  const t = useT();
  const h = t.home.hero;

  return (
    <header className="relative overflow-hidden border-b border-hairline px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36">
      {/* La retícula se queda —es la que da la sensación de archivo— y encima
          va el campo de flujo: catorce trazos convergiendo al centro. No es
          adorno suelto, es la tesis dibujada: prospectar, seguir y cerrar
          terminan en el mismo dato. Enmascarado hacia abajo para que no
          compita con el titular. */}
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <FlowField className="absolute inset-0 -z-10 h-full w-full [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_20%,transparent_100%)]" />

      {/* Una sola columna. La tarjeta que iba a la derecha se retiro: decia
          lo mismo que la seccion de evaluaciones —una conversacion entra, un
          dato sale— y el heroe es el peor sitio para explicar el mecanismo.
          Aqui se decide si vale la pena seguir leyendo, y para eso pesan el
          titular y el boton, no una maqueta de producto. */}
      <div className="mx-auto w-full max-w-3xl">
        <Reveal>
          {/* Era una pastilla con borde redondeado. En un archivo eso no
              existe: es una linea de comentario. */}
          <p className="mb-6 font-mono text-label uppercase tracking-[0.14em] text-muted">
            <span aria-hidden className="md-syntax">{'// '}</span>
            {h.eyebrow}
          </p>

          {/* Los dos `# ` se retiraron con el resto de los signos del texto
              corrido. El titular es lo primero que se lee y arrancaba con dos
              glifos grises que no son la frase. `display-hero` sube el tope de
              48px a 72px: el salto contra el cuerpo es lo que da jerarquia. */}
          <h1 className="text-display-hero font-semibold text-foreground">
            {h.title}
            <br />
            <span className="text-muted">{h.titleAccent}</span>
            <span aria-hidden className="md-caret" />
          </h1>

          <p
            id="hero-description"
            className="mt-7 max-w-xl text-[19px] leading-[1.6] text-muted-foreground sm:text-[21px]"
          >
            <Emphasis text={h.subtitle} />
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={CTA_PROYECTO}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 bg-foreground px-6 py-3.5 font-medium text-background transition-opacity hover:opacity-90"
            >
              {h.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="#ciclo"
              className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3.5 font-medium text-foreground transition-colors hover:border-border-hover hover:bg-surface"
            >
              {h.ctaSecondary}
            </Link>
          </div>

          <p className="mt-6 font-mono text-xs text-muted">{h.note}</p>
        </Reveal>

      </div>
    </header>
  );
}
