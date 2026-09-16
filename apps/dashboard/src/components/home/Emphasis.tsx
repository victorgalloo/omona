/**
 * Resalta la frase que carga el sentido dentro de una cadena de i18n.
 *
 * Por qué existe: el copy de la home se escribió para poder **escanearse sin
 * leerse**. Eso necesita un ancla visual por bloque, y el ancla tiene que
 * viajar con el texto — si vive en el componente, la traducción al inglés la
 * pierde, porque el énfasis no cae en la misma palabra en los dos idiomas.
 *
 * Por qué no JSX en el diccionario: `Translations = typeof es` (es.ts) obliga a
 * que `en.ts` tenga exactamente la misma forma, y esa simetría es lo único que
 * hace que el build avise cuando falta una traducción. Con nodos de React
 * dentro, se pierde.
 *
 * Por qué no `dangerouslySetInnerHTML`: no hace falta. Partir por `**` y
 * envolver los tramos impares da el mismo resultado sin abrir una vía de
 * inyección en texto que algún día podría venir de fuera.
 *
 * Una sola marca por bloque. Dos anclas en el mismo párrafo dejan de ser
 * ancla y se vuelven ruido.
 */
export function Emphasis({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-medium text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </span>
  );
}
