/**
 * Brillo que recorre un botón en reposo, sin necesidad de hover.
 *
 * Es CSS y no `motion` a propósito: un bucle infinito no debe depender de
 * requestAnimationFrame. `prefers-reduced-motion` lo apaga desde la hoja de
 * estilos, así que este componente no necesita ser cliente ni leer nada.
 *
 * El padre debe ser `relative overflow-hidden`, y el contenido ir en un
 * elemento `relative` para quedar por encima del brillo.
 */
export function Shimmer({ className = 'bg-ink/15' }: { className?: string }) {
  return <span aria-hidden className={`anim-brillo absolute inset-y-0 w-20 ${className}`} />;
}
