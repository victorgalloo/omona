import { Emphasis } from './Emphasis';

/**
 * La salida de una corrida de evaluaciones, dibujada como terminal.
 *
 * Viene de "Code Block" de 21st.dev, pero NO de su código. Aquel importa
 * `shiki` —un resaltador de sintaxis completo— y vuelve a resaltar la cadena
 * entera en CADA carácter mientras la escribe, más un scroll suave por
 * pulsación. Para un bloque de trescientas letras son trescientas pasadas de
 * resaltado. Es exactamente la clase de trabajo por fotograma que este sitio
 * tuvo que quitar dos veces.
 *
 * Lo que se tomó es la idea, que es la buena: la sección que habla de
 * evaluaciones era la más abstracta de la página —cuatro tarjetas de texto
 * afirmando que se prueba— y una corrida de prueba con sus casos lo enseña en
 * vez de prometerlo. Incluido el que falla, que es el que hace creíble al
 * resto.
 *
 * Es un componente de servidor: marcado estático, cero JavaScript, cero
 * dependencias. El cursor reusa `.md-caret`, que ya parpadeaba en el héroe y
 * ya se apaga solo con prefers-reduced-motion.
 */
export function Terminal({
  comando,
  casos,
  resumen,
}: {
  comando: string;
  casos: { nombre: string; marca: string; conteo: string; ok: boolean }[];
  resumen: string;
}) {
  return (
    <div className="overflow-hidden border border-border bg-surface">
      {/* La barra de titulo del terminal. Los tres puntos son los de macOS y
          ya existen como tokens; van aria-hidden porque no dicen nada. */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-red" />
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-yellow" />
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-green" />
        </span>
        <span className="ml-1 font-mono text-[11px] text-muted">evaluación</span>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.9] sm:p-5 sm:text-[13px]">
        <p className="text-muted-foreground">
          <span aria-hidden className="md-syntax">$ </span>
          <span className="text-foreground">{comando}</span>
        </p>

        <ul className="mt-2">
          {casos.map((caso) => (
            <li key={caso.nombre} className="flex items-baseline gap-3">
              <span
                aria-hidden
                className={caso.ok ? 'text-accent-green' : 'text-warning'}
              >
                {caso.marca}
              </span>
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {caso.nombre}
              </span>
              <span className={`tabular-nums ${caso.ok ? 'text-muted' : 'text-warning'}`}>
                {caso.conteo}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-3 border-t border-hairline pt-3 text-foreground">
          <Emphasis text={resumen} />
          <span aria-hidden className="md-caret" />
        </p>
      </div>
    </div>
  );
}
