/**
 * Base de conocimiento pública de Victor (/conocimiento y /en/knowledge).
 *
 * Datos: data/conocimiento/*.md. Cada archivo es un tema:
 *
 *   ---
 *   title: Quién soy          (rótulo de la fila)
 *   orden: 10                 (orden en la página, ascendente)
 *   linea: …                  (la línea potente, ≤14 palabras: lo único visible al llegar)
 *   lang: es | en
 *   par: <slug>               (el mismo tema en el otro idioma; slug = nombre de archivo sin .md)
 *   fondo: /about             (opcional: liga a la evidencia o nota completa, al fondo del «ver más»)
 *   fondo_texto: …            (opcional: texto de esa liga)
 *   origen: boveda            (lo pone scripts/conocimiento-export.mjs, que escribe en data/conocimiento/boveda/;
 *                              esas notas van en un bloque aparte, plegado, al final de la página)
 *   ---
 *   - viñeta de nivel 1       (se ve al abrir «Ver más»)
 *     - viñeta de nivel 2     (2 espacios = un nivel; abre su propio «Ver más»)
 *       - viñeta de nivel 3   (el fondo; máximo 3 niveles)
 *
 * En las viñetas: [texto](url), **negritas** y `código`. Fichas que salen de
 * data/oss/oss.json y data/now/now.json para no escribir cifras a mano (nunca
 * «merged» a mano): {{prs}}, {{merged}}, {{open}}, {{issues}}, {{repos}},
 * {{fecha_oss}}; una viñeta que sea solo {{lista_prs}}, {{lista_proyectos}} o
 * {{foco}} se expande a una viñeta por elemento.
 *
 * Reglas (encargo 27-nov-2026 + skill omona-tech): sin datos de SuperLeads más
 * allá de lo que ya publica el sitio, sin clientes, personas, teléfonos, dinero
 * ni dominios internos. Lo que llega de la bóveda pasa antes por el exportador.
 */
import fs from 'fs';
import path from 'path';
import ossData from '../../data/oss/oss.json';
import nowData from '../../data/now/now.json';

export type LangK = 'es' | 'en';

export interface Vineta {
  texto: string;
  hijos: Vineta[];
}

export interface Tema {
  slug: string;
  title: string;
  orden: number;
  linea: string;
  lang: LangK;
  par: string | null;
  fondo: string | null;
  fondoTexto: string | null;
  origen: string | null;
  area: string | null;
  vinetas: Vineta[];
}

const DIR = path.join(process.cwd(), 'data', 'conocimiento');
export const MAX_NIVELES = 3;
export const MAX_PALABRAS_LINEA = 14;

type Pr = { key: string; url: string; state: string; title: string };
type Proyecto = { repo: string; url: string; es: string; en: string };
type Oss = { generatedAt: string; stats: Record<string, number>; prs: Pr[]; projects?: Proyecto[] };
type Now = { foco: { es: string; en: string; url?: string }[] };
const oss = ossData as unknown as Oss;
const now = nowData as unknown as Now;

const ESTADO: Record<LangK, Record<string, string>> = {
  es: { open: 'abierto, en revisión', merged: 'merged', closed: 'cerrado sin merge' },
  en: { open: 'open, under review', merged: 'merged', closed: 'closed, not merged' },
};

function fichas(s: string): string {
  const st = oss.stats;
  return s
    .replace(/\{\{prs\}\}/g, String(st.prs))
    .replace(/\{\{merged\}\}/g, String(st.merged))
    .replace(/\{\{open\}\}/g, String(st.open))
    .replace(/\{\{issues\}\}/g, String(st.issues))
    .replace(/\{\{repos\}\}/g, String(st.repos))
    .replace(/\{\{fecha_oss\}\}/g, oss.generatedAt.slice(0, 10));
}

/** Viñetas que se expanden desde los datos generados (estado siempre de GitHub). */
function expandir(texto: string, lang: LangK): Vineta[] | null {
  const t = texto.trim();
  if (t === '{{lista_prs}}')
    return oss.prs.map((p) => ({ texto: `[${p.key}](${p.url}) · ${ESTADO[lang][p.state] ?? p.state}: ${p.title}`, hijos: [] }));
  if (t === '{{lista_proyectos}}')
    return (oss.projects ?? []).map((p) => ({ texto: `[${p.repo.split('/')[1]}](${p.url}): ${p[lang]}`, hijos: [] }));
  if (t === '{{foco}}') return now.foco.map((f) => ({ texto: f.url ? `${f[lang]} [→](${f.url})` : f[lang], hijos: [] }));
  return null;
}

function parseFrontmatter(raw: string, file: string) {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`Tema sin frontmatter: ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}

/** Viñetas anidadas por sangría (2 espacios por nivel). Falla si pasa de MAX_NIVELES. */
export function parseVinetas(body: string, lang: LangK, file = ''): Vineta[] {
  const raiz: Vineta[] = [];
  const pila: { nivel: number; lista: Vineta[] }[] = [{ nivel: -1, lista: raiz }];
  for (const linea of body.split('\n')) {
    if (!linea.trim()) continue;
    const m = /^( *)- (.+)$/.exec(linea.replace(/\t/g, '  '));
    if (!m) throw new Error(`Solo viñetas en ${file}: «${linea.trim().slice(0, 60)}»`);
    const nivel = Math.floor(m[1].length / 2);
    if (nivel >= MAX_NIVELES) throw new Error(`Más de ${MAX_NIVELES} niveles en ${file}`);
    while (pila[pila.length - 1].nivel >= nivel) pila.pop();
    const padre = pila[pila.length - 1];
    if (nivel > padre.nivel + 1) throw new Error(`Sangría saltada en ${file}: «${m[2].slice(0, 60)}»`);
    const exp = expandir(m[2], lang);
    if (exp) {
      padre.lista.push(...exp);
      continue;
    }
    const v: Vineta = { texto: fichas(m[2].trim()), hijos: [] };
    padre.lista.push(v);
    pila.push({ nivel, lista: v.hijos });
  }
  return raiz;
}

const palabras = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Solo entran archivos con el esquema de la página (linea + lang). Otros formatos se ignoran sin romper el build. */
function esTema(meta: Record<string, string>) {
  return Boolean(meta.linea && (meta.lang === 'es' || meta.lang === 'en'));
}

function parse(file: string): Tema | null {
  const { meta, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'), file);
  if (!esTema(meta)) return null;
  const lang: LangK = meta.lang === 'en' ? 'en' : 'es';
  const linea = fichas(meta.linea || '');
  if (!meta.title || !linea) throw new Error(`Falta title o linea: ${file}`);
  if (palabras(linea) > MAX_PALABRAS_LINEA) throw new Error(`Línea de más de ${MAX_PALABRAS_LINEA} palabras: ${file}`);
  return {
    slug: path.basename(file, '.md'),
    title: meta.title,
    orden: Number(meta.orden || 999),
    linea,
    lang,
    par: meta.par || null,
    fondo: meta.fondo || null,
    fondoTexto: meta.fondo_texto || null,
    origen: meta.origen || null,
    area: meta.area || null,
    vinetas: parseVinetas(body, lang, file),
  };
}

let cache: Tema[] | null = null;

export function getTemas(lang?: LangK): Tema[] {
  if (!cache) {
    // Raíz = siembra escrita a mano; boveda/ = lo que escribe scripts/conocimiento-export.mjs.
    const leer = (dir: string) =>
      fs.existsSync(dir)
        ? fs
            .readdirSync(dir)
            .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
            .map((f) => parse(path.join(dir, f)))
        : [];
    cache = [...leer(DIR), ...leer(path.join(DIR, 'boveda'))]
      .filter((t): t is Tema => t !== null)
      .sort((a, b) => a.orden - b.orden || a.slug.localeCompare(b.slug));
  }
  return lang ? cache.filter((t) => t.lang === lang) : cache;
}

/** Siembra en el idioma pedido + notas de la bóveda (todas: hoy solo existen en español). */
export function getConocimiento(lang: LangK): { temas: Tema[]; boveda: Tema[] } {
  const todos = getTemas();
  return {
    temas: todos.filter((t) => t.origen !== 'boveda' && t.lang === lang),
    // Una nota de la bóveda sin par en este idioma sale en su idioma original (mismos datos en ES y EN).
    boveda: todos.filter(
      (t) =>
        t.origen === 'boveda' &&
        (t.lang === lang || !todos.some((o) => o.lang === lang && (o.slug === t.par || o.par === t.slug))),
    ),
  };
}

/** Texto plano (sin markdown) para llms-full.txt. */
export function plano(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t: string, u0: string) => {
      const u = u0.startsWith('/') ? `https://omona.tech${u0}` : u0;
      return t === '→' ? u : `${t} (${u})`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}
