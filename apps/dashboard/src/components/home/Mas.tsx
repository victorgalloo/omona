import { Emphasis } from './Emphasis';
import { tiempoDeLectura } from '@/lib/utils';

/**
 * El bloque profundo de una sección: cerrado por defecto, con su tiempo de
 * lectura a la vista.
 *
 * Por qué existe: la portada medía 1,384 palabras visibles sin tocar nada —
 * siete minutos antes de entender qué se vende. El recorte no puede ser solo
 * borrar, porque parte de ese texto sí lo quiere quien está evaluando en serio.
 * Entonces la página se parte en dos capas: una línea por sección para quien
 * escanea, y esto para quien decidió profundizar.
 *
 * Por qué <details> nativo y no estado en React: no pesa un byte, funciona sin
 * JavaScript, el navegador ya le da la semántica de expandido/colapsado, y
 * Ctrl+F encuentra el texto de dentro — cosa que con un panel desmontado no
 * pasa. Es el mismo patrón que ya usaba HomeFaq, ahora extraído para reusarse.
 *
 * Por qué el cuerpo se pasa como `parrafos` y no como children: el tiempo se
 * calcula de lo que este componente renderiza. Si el texto viviera fuera y el
 * conteo aquí, los dos se separarían en la primera edición y el minuto
 * anunciado dejaría de ser verdad. Para lo que no es prosa —una tabla, una
 * lista— están `children` y `contar`.
 */
export function Mas({
  resumen,
  parrafos = [],
  contar = [],
  children,
}: {
  /** Lo que se lee en el summary. Sin el tiempo: lo agrega el componente. */
  resumen: string;
  /** El cuerpo en prosa. Es lo que se cuenta para el tiempo. */
  parrafos?: string[];
  /** Texto que vive en `children` y también debe contar. */
  contar?: string[];
  children?: React.ReactNode;
}) {
  const tiempo = tiempoDeLectura(...parrafos, ...contar);

  return (
    <details className="group mt-6 border-t border-hairline">
      <summary className="flex cursor-pointer list-none items-center gap-2 py-4 text-[14px] text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        {/* El triangulo es decorativo: <details> ya anuncia el estado. */}
        <span aria-hidden className="md-syntax transition-transform group-open:rotate-90">
          &rsaquo;
        </span>
        {resumen}
        <span aria-hidden className="md-syntax">·</span>
        <span className="tabular-nums">{tiempo}</span>
      </summary>
      <div className="md-measure pb-6 text-[14.5px] leading-[1.75] text-muted-foreground">
        {parrafos.map((p, i) => (
          <p key={i} className={i > 0 ? 'mt-4' : undefined}>
            <Emphasis text={p} />
          </p>
        ))}
        {children}
      </div>
    </details>
  );
}
