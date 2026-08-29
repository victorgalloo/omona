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
  /** comparativa | articulo */
  kind: "articulo" | "comparativa";
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
    body = raw;
    h1 = title || path.basename(file).replace(/_/g, " ");
  }

  body = cortarCuerpo(body);
  // La línea de meta description no se muestra: vive en <meta>.
  body = body.replace(/^\**Meta description\**:[^\n]*\n?/m, "").trim();

  // "Actualizado agosto 2026"
  let updated: string | null = null;
  const u = /Actualizado\s+(\w+)\s+(\d{4})/.exec(body);
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

let cache: { articulos: GeoArticle[]; comparativas: GeoArticle[] } | null = null;

export function getAllGeo(): { articulos: GeoArticle[]; comparativas: GeoArticle[] } {
  if (cache) return cache;
  const articulos: GeoArticle[] = [];
  const comparativas: GeoArticle[] = [];

  const artsDir = path.join(GEO_DIR, "articles");
  if (fs.existsSync(artsDir)) {
    for (const f of fs.readdirSync(artsDir).filter((f) => f.endsWith(".md")).sort()) {
      articulos.push(parseArticulo(path.join(artsDir, f), "articulo"));
    }
  }
  const compDir = path.join(GEO_DIR, "comparatives");
  if (fs.existsSync(compDir)) {
    for (const f of fs.readdirSync(compDir).filter((f) => f.endsWith(".md")).sort()) {
      comparativas.push(parseArticulo(path.join(compDir, f), "comparativa"));
    }
  }
  cache = { articulos, comparativas };
  return cache;
}

export function getArticulo(slug: string): GeoArticle | undefined {
  return getAllGeo().articulos.find((a) => a.slug === slug);
}

export function getComparativa(slug: string): GeoArticle | undefined {
  return getAllGeo().comparativas.find((c) => c.slug === slug);
}
