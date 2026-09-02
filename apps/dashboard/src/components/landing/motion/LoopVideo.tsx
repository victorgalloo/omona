'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useThemeName } from '@/hooks/useThemeName';

/**
 * Loop de producto rendido con Remotion (apps/video).
 *
 * `autoPlay` va como atributo estático y no como prop calculado, y eso importa:
 * un <video autoPlay loop muted playsInline> lo reproduce el navegador solo, sin
 * JavaScript de por medio. Las dos versiones anteriores de este componente
 * dejaban la reproducción en manos de un IntersectionObserver y el resultado fue
 * que los videos NUNCA arrancaron en producción — medido en omona.tech: los 16
 * elementos con `autoplay: false`, quince de ellos con readyState 0 y
 * networkState idle, o sea que nadie les pidió jamás cargar. Se veía el
 * fotograma 0, que está en blanco por diseño, y parecía un marco vacío.
 *
 * El póster va además como una capa encima que sólo se retira cuando el video
 * dispara `playing`. El atributo `poster` por sí solo no basta: el navegador lo
 * sustituye en cuanto decodifica el primer fotograma, y el fotograma 0 de estos
 * loops está casi vacío porque el contenido entra coreografiado (la burbuja en
 * el 12, la transcripción en el 80). Así, si la reproducción falla por lo que
 * sea, lo que queda a la vista es el póster con el contenido completo, nunca un
 * marco vacío.
 *
 * Reglas que sí siguen valiendo:
 * - Dos variantes por tema: un video es píxeles, no se adapta a `data-theme`.
 * - El observer sólo PAUSA lo que sale de pantalla. Nunca arranca nada.
 * - Con `prefers-reduced-motion` no se monta el <video>: se queda el póster.
 */
export function LoopVideo({
  name,
  alt,
  className = '',
  priority = false,
  active,
}: {
  /** Slug del archivo en /public/video, sin tema ni extensión. */
  name: string;
  alt: string;
  className?: string;
  /** Precarga completa. Para el loop del héroe, que se ve de inmediato. */
  priority?: boolean;
  /**
   * Para paneles donde conviven varios loops apilados (StickyFeatureSwap).
   * Al pasar a activo el video vuelve a 0 para que el loop se lea desde el
   * principio en vez de aparecer a media animación. Omitirlo deja el
   * comportamiento simple: reproduce mientras esté en pantalla.
   */
  active?: boolean;
}) {
  const theme = useThemeName();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [reproduciendo, setReproduciendo] = useState(false);

  // Pausar fuera de pantalla. Arrancar es cosa de `autoPlay`.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch((err) => {
            // Nunca en silencio: un catch vacío aquí escondió este bug dos rondas.
            console.warn(`[LoopVideo] ${name}: play() rechazado —`, err?.message ?? err);
          });
        } else {
          el.pause();
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [name]);

  // Al activarse, el loop se lee desde el principio.
  useEffect(() => {
    const el = ref.current;
    if (!el || active !== true) return;
    try {
      el.currentTime = 0;
    } catch {
      /* todavía sin metadatos: arrancará donde pueda */
    }
    el.play().catch(() => {
      /* el observer ya reporta el motivo; no duplicar el aviso */
    });
  }, [active]);

  // Hasta saber el tema mostramos la variante clara: es el tema por omisión.
  const variant = `${name}-${theme ?? 'light'}`;
  const poster = `/video/${variant}.jpg`;

  if (reduced) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={alt} className={className} loading="lazy" decoding="async" />;
  }

  return (
    <span className={`relative block ${className}`}>
      <video
        ref={ref}
        key={variant}
        className="block h-full w-full object-cover"
        poster={poster}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        onPlaying={() => setReproduciendo(true)}
        onPause={() => setReproduciendo(false)}
      >
        <source src={`/video/${variant}.webm`} type="video/webm" />
        <source src={`/video/${variant}.mp4`} type="video/mp4" />
      </video>

      {/* Red de seguridad: mientras no se reproduzca de verdad, se ve el póster
          —que sí tiene contenido— en vez del fotograma 0 del video. */}
      {!reproduciendo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className="absolute inset-0 block h-full w-full object-cover"
          decoding="async"
        />
      )}
    </span>
  );
}
