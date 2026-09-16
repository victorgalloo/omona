/**
 * Trazos que convergen al centro, con una partícula viajando por cada uno.
 *
 * ── De dónde viene y qué se cambió ──────────────────────────────────────
 *
 * La idea es de "Gateway Flow" (21st.dev). Su código no se pudo usar:
 * renderizaba un <iframe srcDoc> con un documento HTML completo que pedía
 * cdn.tailwindcss.com —que la propia documentación de Tailwind marca como no
 * apto para producción—, GSAP, ScrollTrigger e Iconify desde cdnjs, y Google
 * Fonts. Dentro corría un canvas con requestAnimationFrame infinito que
 * re-trazaba ochenta curvas bezier con setLineDash en CADA fotograma, y traía
 * un formulario de login y tres avatares con el texto "Validated by
 * distributed consensus nodes" — prueba social inventada, que es la regla que
 * este proyecto ya corrigió dos veces.
 *
 * ── Cómo está hecho aquí ────────────────────────────────────────────────
 *
 * Las curvas son SVG estático: se pintan una vez y no cuestan nada después.
 * Las partículas se mueven con `offset-path` de CSS, que anima el compositor
 * sin tocar el hilo principal. Cero JavaScript, cero canvas, cero red.
 *
 * Es un componente de servidor: no lleva 'use client' y no pesa un byte en el
 * bundle. Si un navegador no soporta `offset-path`, los puntos se quedan
 * quietos en su sitio y las curvas se ven igual.
 *
 * El color sale de `currentColor`, así que sigue al tema sin una sola línea
 * extra: blanco sobre negro, tinta sobre blanco.
 */

const ANCHO = 1200;
const ALTO = 600;
const CENTRO = { x: ANCHO / 2, y: ALTO / 2 };

/** Una curva desde el borde hasta el centro. `lado` es -1 izquierda, 1 derecha. */
function trazo(lado: -1 | 1, y: number) {
  const x0 = lado === -1 ? 0 : ANCHO;
  const c1 = lado === -1 ? ANCHO * 0.26 : ANCHO * 0.74;
  const c2 = lado === -1 ? ANCHO * 0.42 : ANCHO * 0.58;
  return `M ${x0} ${y} C ${c1} ${y}, ${c2} ${CENTRO.y}, ${CENTRO.x} ${CENTRO.y}`;
}

/**
 * Catorce y no ochenta. A partir de una docena el ojo deja de contar trazos y
 * lee "convergencia"; lo que sigue sumando es solo nodos en el DOM.
 */
const TRAZOS = Array.from({ length: 14 }, (_, i) => {
  const lado: -1 | 1 = i % 2 === 0 ? -1 : 1;
  const fila = Math.floor(i / 2);
  const y = -90 + fila * ((ALTO + 180) / 6);
  return {
    id: i,
    d: trazo(lado, y),
    // Duraciones distintas para que no latan al unísono. Primos entre sí para
    // que el patrón tarde mucho en repetirse.
    duracion: 11 + (i % 5) * 2.3,
    retraso: (i % 7) * 1.7,
  };
});

export function FlowField({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      preserveAspectRatio="none"
      className={`pointer-events-none ${className}`}
    >
      <g className="text-foreground">
        {TRAZOS.map((t) => (
          <path
            key={t.id}
            d={t.d}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeDasharray="2 7"
            opacity={0.45}
          />
        ))}
        {TRAZOS.map((t) => (
          <circle
            key={`p-${t.id}`}
            r={2.6}
            fill="currentColor"
            opacity={0.9}
            className="flow-particle"
            style={{
              offsetPath: `path("${t.d}")`,
              animationDuration: `${t.duracion}s`,
              animationDelay: `-${t.retraso}s`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
