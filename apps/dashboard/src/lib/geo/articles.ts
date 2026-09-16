/**
 * Parser de artículos GEO — convierte los .md de Perplexity (formatos A–F y
 * H2) en datos tipados para el blog. Mismo contrato que el generador estático
 * de ~/Projects/omona-site, ahora dentro del Next app.
 *
 * Frontera: este módulo solo lee data/geo (contenido de marca Omona).
 */
import fs from "fs";
import path from "path";

export interface GeoArticle {
  slug: string;
  title: string;
  h1: string;
  meta: string;
  /** Markdown del cuerpo, ya sin metadatos ni apéndices. */
  body: string;
  /** Bloque JSON-LD embebido (string) si el artículo lo trae. */
  jsonld: string | null;
  claims: string[];
  updated: string | null;
  kind: GeoKind;
}

/**
 * Cada tipo de contenido es un directorio bajo data/geo y un segmento de URL.
 * El mapa vive aquí y no en las rutas porque el sitemap, el llms.txt, el
 * canonical y el índice necesitan el mismo dato: mientras estuvo escrito como
 * el ternario `kind === "articulo" ? "blog" : "comparativas"` repetido en
 * cuatro archivos, añadir un tipo significaba encontrarlos todos.
 */
export const GEO_KINDS = {
  articulo: { dir: "articles", segment: "blog" },
  comparativa: { dir: "comparatives", segment: "comparativas" },
  servicio: { dir: "servicios", segment: "servicios" },
  delivery: { dir: "delivery", segment: "delivery" },
} as const;

export type GeoKind = keyof typeof GEO_KINDS;

/** Ruta pública de un documento. Sin slash final: next.config fija trailingSlash: false. */
export function geoUrl(a: Pick<GeoArticle, "kind" | "slug">): string {
  return `/${GEO_KINDS[a.kind].segment}/${a.slug}`;
}

const GEO_DIR = path.join(process.cwd(), "data", "geo");
const MESES: Record<string, number> = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i")
    .replace(/ó/g, "o").replace(/ú/g, "u").replace(/ñ/g, "n")
    .replace(/[‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Corta el cuerpo antes de las secciones de artefactos (JSON-LD, claims, fuentes). */
const SECCIONES_FINALES =
  /^#{2,3}\s*(?:D\.\s|E\.\s|F\.\s|JSON[-‑]LD|Bloque JSON[-‑]LD|CLAIMS|CLAUS|Bloques citables|Fuentes|Referencias|Artículo JSON[-‑]LD)/m;

function cortarCuerpo(md: string): string {
  const m = SECCIONES_FINALES.exec(md);
  return m ? md.slice(0, m.index).trim() : md.trim();
}

/**
 * El corpus trae dos andamiajes de redacción: "A. Título / B. Meta description
 * / C. Artículo en Markdown" y la variante suelta "Título: / Meta description:".
 * Ninguno es contenido — el título y la meta se extraen aparte y viven en
 * <title> y <meta>. Cuando el archivo además no trae "# H1", el cuerpo arrancaba
 * en la primera línea del archivo y el andamiaje salía impreso en la página.
 */
const INICIO_CUERPO = /^\s*(?:C\.\s*)?\*{0,2}Art[íi]culo en Markdown\b[^\n]*\n/im;

function quitarAndamiaje(md: string): string {
  const c = INICIO_CUERPO.exec(md);
  if (c) return md.slice(c.index + c[0].length).trim();

  // Sin marcador "C.": el cuerpo empieza tras el bloque de meta description,
  // que termina en la primera regla horizontal.
  const meta = /^\s*(?:B\.\s*)?\*{0,2}Meta description\*{0,2}\s*:?[^\n]*\n/im.exec(md);
  if (meta) {
    const resto = md.slice(meta.index + meta[0].length);
    const regla = /^\s*---\s*$/m.exec(resto);
    if (regla) return resto.slice(regla.index + regla[0].length).trim();
  }
  return md.trim();
}

/**
 * El JSON-LD ya se extrae con extractJsonld y se inyecta como <script>. Si
 * además queda en el markdown, se renderiza como un bloque de código enorme
 * en mitad del artículo. Pasaba en los archivos cuyo encabezado de sección no
 * coincidía con SECCIONES_FINALES.
 */
function quitarBloquesJsonld(md: string): string {
  return md.replace(/```(?:json)?\s*\n?\{[\s\S]*?"@context"[\s\S]*?\n?```/g, "").trim();
}

function extractJsonld(raw: string): string | null {
  let m = /D\.\s*\*?\*?JSON[-‑]LD[^`]*?```(?:json)?\s*([\s\S]*?)\s*```/.exec(raw);
  if (m) return m[1].trim();
  m = /^#{2,3}[^\n]*JSON[-‑]LD[^\n]*\n+```(?:json)?\s*([\s\S]*?)\s*```/m.exec(raw);
  if (m) return m[1].trim();
  for (const mm of raw.matchAll(/```(?:json)?\s*([\s\S]*?)\s*```/g)) {
    if (mm[1].includes('"@context"')) return mm[1].trim();
  }
  return null;
}

function extractClaims(raw: string): string[] {
  const m =
    /E\.\s*\*?\*?CLAIMS EXTRAÍBLES[^E]*?\n([\s\S]*?)(?=\nF\.\s|\n?$)/.exec(raw) ||
    /^#{2,3}[^\n]*(?:CLAIMS|CLAUS|Bloques citables)[^\n]*\n([\s\S]*?)(?=\n#{2,3}\s|$)/m.exec(raw);
  if (!m) return [];
  const claims: string[] = [];
  for (const line of m[1].split("\n")) {
    const s = line.trim().replace(/^[-*]\s+/, "").trim();
    const num = /^\s*(\d+)\.\s+(.+)$/.exec(s);
    if (num) { claims.push(num[2].replace(/\s+/g, " ").trim()); continue; }
    const quote = /^["\u201c\u00ab]?(.+?)["\u201d\u00bb]?[.,]?\s*(?:\[\d+\][\s,]*)*$/.exec(s);
    if (quote && quote[1].length > 40) {
      claims.push(quote[1].replace(/\*+/g, "").trim());
    }
  }
  return claims;
}

function parseArticulo(file: string, kind: GeoArticle["kind"]): GeoArticle {
  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split("\n");

  // Título: A. / Título: / primer H1
  let title: string | undefined;
  let meta: string | undefined;
  const tA = /(?:A\.\s*\*?\*?Título\*?\*?|Título:)\s*\*?\*?\s*(.+)/.exec(raw);
  if (tA) title = tA[1].trim().replace(/^\*+|\*+$/g, "").trim();
  const mB = /(?:B\.\s*\*?\*?Meta description\*?\*?|\*\*Meta description:\*\*|Meta description:)\s*:?\s*(.+)/.exec(raw);
  if (mB) meta = mB[1].trim().replace(/^\*+|\*+$/g, "").trim();

  // Cuerpo: tras el primer "# H1" hasta D./E. o fin
  let body: string;
  let h1: string;
  const h1Idx = lines.findIndex((l) => l.startsWith("# "));
  if (h1Idx >= 0) {
    h1 = lines[h1Idx].slice(2).trim();
    body = lines.slice(h1Idx + 1).join("\n");
    if (!title) title = h1;
  } else {
    // Sin H1 el cuerpo era el archivo entero, andamiaje incluido: los lectores
    // veían "A. Título", el título repetido, "B. Meta description" y el texto
    // de la meta antes del artículo. Aquí se recorta hasta donde empieza la
    // prosa real.
    body = quitarAndamiaje(raw);
    // Sin `.md`: el nombre de archivo es el último recurso para el título y
    // la extensión terminaba impresa en la tarjeta del blog y en el <title>.
    h1 = title || path.basename(file, ".md").replace(/_/g, " ");
  }

  body = cortarCuerpo(body);
  // La meta description no se muestra: vive en <meta>. Aparece en tres formas
  // —con dos puntos, en negritas sobre su propia línea, o precedida de "B."— y
  // en los archivos que sí traen H1 el cuerpo empieza antes de ella, así que
  // hay que quitarla aquí y no solo en quitarAndamiaje.
  body = body
    .replace(/^\s*(?:B\.\s*)?\*{0,2}Meta description\*{0,2}\s*:[^\n]*\n?/im, "")
    .replace(/^\s*(?:B\.\s*)?\*{0,2}Meta description\*{0,2}\s*\n+[^\n]*\n?/im, "")
    .trim();
  body = quitarBloquesJsonld(body);

  // "Actualizado agosto 2026". Se busca en el archivo completo y no en el
  // cuerpo: la línea va antes del H1 en casi todo el corpus, y el cuerpo
  // empieza después del H1, así que buscarla ahí devolvía null y la fecha
  // nunca se mostraba.
  let updated: string | null = null;
  const u = /Actualizado\s+(\w+)\s+(\d{4})/.exec(raw);
  if (u) updated = `${u[1].charAt(0).toUpperCase()}${u[1].slice(1)} ${u[2]}`;

  if (!meta) {
    const first = body.split("\n").find((l) => l.trim() && !l.startsWith("#")) || "";
    meta = first.replace(/\[.*?\]\(.*?\)|\*\*|\[\d+\]/g, "").slice(0, 155);
  }

  return {
    slug: slugify(path.basename(file).replace(/\.md$/, "")),
    title: title || h1,
    h1,
    meta,
    body,
    jsonld: extractJsonld(raw),
    claims: extractClaims(raw),
    updated,
    kind,
  };
}

const cache: Partial<Record<GeoKind, GeoArticle[]>> = {};

export function getGeo(kind: GeoKind): GeoArticle[] {
  const hit = cache[kind];
  if (hit) return hit;
  const dir = path.join(GEO_DIR, GEO_KINDS[kind].dir);
  const items: GeoArticle[] = [];
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
      items.push(parseArticulo(path.join(dir, f), kind));
    }
  }
  cache[kind] = items;
  return items;
}

export function getAllGeo(): {
  articulos: GeoArticle[];
  comparativas: GeoArticle[];
  servicios: GeoArticle[];
  delivery: GeoArticle[];
} {
  return {
    articulos: getGeo("articulo"),
    comparativas: getGeo("comparativa"),
    servicios: getGeo("servicio"),
    delivery: getGeo("delivery"),
  };
}

export function getGeoBySlug(kind: GeoKind, slug: string): GeoArticle | undefined {
  return getGeo(kind).find((a) => a.slug === slug);
}

export function getArticulo(slug: string): GeoArticle | undefined {
  return getGeoBySlug("articulo", slug);
}

export function getComparativa(slug: string): GeoArticle | undefined {
  return getGeoBySlug("comparativa", slug);
}
