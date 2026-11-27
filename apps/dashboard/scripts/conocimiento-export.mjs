#!/usr/bin/env node
/**
 * Exporta notas públicas de la bóveda de Obsidian (~/Cerebro) a
 * data/conocimiento/boveda/*.md, en el esquema que lee src/lib/conocimiento.ts.
 *
 *   node scripts/conocimiento-export.mjs --seco      # solo dice qué saldría y qué se niega
 *   node scripts/conocimiento-export.mjs             # escribe (y quita lo que ya no es público)
 *   --boveda <dir>   (default ~/Cerebro)   --destino <dir>   (default data/conocimiento/boveda)
 *
 * Lista blanca: solo sale una nota con `publico: true` en su frontmatter.
 * Se NIEGA a exportar una nota si:
 *   - coincide con ~/.hermes/state/showcase_blocklist.txt (menos «omona»: aquí Omona es el sitio),
 *     ~/Cerebro/_sistema/personal.txt o ~/Cerebro/_sistema/privado.txt;
 *   - trae la etiqueta `privado` (tags o #privado) o `privado: true`;
 *   - contiene teléfonos, correos de terceros (solo pasa victor@omona.tech), montos de dinero,
 *     URLs o rutas internas, ids largos;
 *   - su línea potente pasa de 14 palabras o el cuerpo pasa de 3 niveles de «ver más».
 *
 * Nunca escribe en la bóveda: solo la lee.
 *
 * Formato de la nota en la bóveda (ver «10 Conocimiento público/Conocimiento público.md»):
 *   # Título · > línea potente · viñetas sueltas = nivel 1 · ## = una viñeta de nivel 1 que abre
 *   sus viñetas · ### dentro de ## = nivel 2 que abre las suyas · [[Nota]] = texto · %%…%% nunca sale.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const SECO = args.includes('--seco');
const BOVEDA = path.resolve(opt('--boveda', path.join(os.homedir(), 'Cerebro')));
const DESTINO = path.resolve(opt('--destino', path.join(AQUI, '..', 'data', 'conocimiento', 'boveda')));
const BLOCKLIST = path.join(os.homedir(), '.hermes', 'state', 'showcase_blocklist.txt');
const PERSONAL = path.join(BOVEDA, '_sistema', 'personal.txt');
const PRIVADO = path.join(BOVEDA, '_sistema', 'privado.txt');
const MAX_PALABRAS = 14;
const MAX_NIVELES = 3;
const OMITIR_DIRS = new Set(['_sistema', '_plantillas', '_adjuntos', '.obsidian', '.git', '.trash', 'node_modules']);

if (DESTINO.startsWith(BOVEDA + path.sep) || DESTINO === BOVEDA) {
  console.error('✕ El destino está dentro de la bóveda. Este script no escribe en la bóveda.');
  process.exit(2);
}

// ── listas ────────────────────────────────────────────────────────────────
const sinAcentos = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function leerLista(file, { obligatoria }) {
  if (!fs.existsSync(file)) {
    if (obligatoria) {
      console.error(`✕ Falta ${file}: sin esa lista no se exporta nada.`);
      process.exit(2);
    }
    return [];
  }
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((s) => s.replace(/#.*$/, '').trim())
    .filter(Boolean);
}

/** showcase_blocklist: sin mayúsculas; ≥4 letras = subcadena (como now-refresh), menos = palabra completa. */
const showcase = leerLista(BLOCKLIST, { obligatoria: true })
  .map((s) => sinAcentos(s))
  .filter((s) => !['omona', 'omona.tech'].includes(s))
  .map((s) => ({ s, re: s.length >= 4 ? new RegExp(escRe(s)) : new RegExp(`(^|[^\\p{L}\\p{N}])${escRe(s)}($|[^\\p{L}\\p{N}])`, 'u') }));

/** personal.txt / privado.txt: palabra completa, sin acentos ni mayúsculas, `*` al final = prefijo. */
const palabras = (file) =>
  leerLista(file, { obligatoria: true }).map((t) => {
    const pref = t.endsWith('*');
    const base = escRe(sinAcentos(pref ? t.slice(0, -1) : t));
    return { s: t, re: new RegExp(`(^|[^\\p{L}\\p{N}])${base}${pref ? '' : '($|[^\\p{L}\\p{N}])'}`, 'u') };
  });
const personal = palabras(PERSONAL);
const privado = palabras(PRIVADO);

// ── patrones sensibles ────────────────────────────────────────────────────
const CORREO_OK = new Set(['victor@omona.tech']);
const HOSTS_INTERNOS = [
  /(^|\.)superleads\.mx$/i,
  /(^|\.)superleads\.awsapps\.com$/i,
  /^localhost$/i,
  /\.(local|internal|lan|home|corp)$/i,
  /^(10|127)\.\d+\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
  /\.vercel\.app$/i,
  /\.ngrok(-free)?\.(io|app)$/i,
  /(^|\.)notion\.(so|site)$/i,
  /^docs\.google\.com$/i,
  /^drive\.google\.com$/i,
  /^app\.openseo\.so$/i,
  /(^|\.)console\.aws\.amazon\.com$/i,
  /^dash\.cloudflare\.com$/i,
];

function sensibles(texto) {
  const motivos = [];
  // Teléfonos: 10+ dígitos con separadores opcionales, o ids de WhatsApp.
  const sinFechas = texto.replace(/\b\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?\b/g, ' ').replace(/\b\d{1,2}:\d{2}\b/g, ' ');
  if (/(?:\+?\d[ ().-]?){10,}/.test(sinFechas)) motivos.push('teléfono o id numérico largo');
  if (/@(lid|g\.us|s\.whatsapp\.net|c\.us)\b/i.test(texto)) motivos.push('id de WhatsApp');
  for (const m of texto.matchAll(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g))
    if (!CORREO_OK.has(m[0].toLowerCase())) motivos.push(`correo de tercero (${m[0].replace(/^(.).*@/, '$1…@')})`);
  // Dinero: símbolo + cifra, cifra + moneda, o monedas sueltas con número.
  if (/(US\$|MX\$|\$|€|£)\s?\d/.test(texto) || /\b\d[\d.,]*\s?(k|mil|M|millones?)?\s?(USD|MXN|EUR|pesos|d[oó]lares|dollars|euros)\b/i.test(texto))
    motivos.push('monto de dinero');
  // URLs internas.
  for (const m of texto.matchAll(/\bhttps?:\/\/([^/\s)>\]]+)/gi)) {
    const host = m[1].replace(/:\d+$/, '').replace(/^[^@]*@/, '');
    if (HOSTS_INTERNOS.some((re) => re.test(host))) motivos.push(`URL interna (${host})`);
  }
  for (const m of texto.matchAll(/\b([a-z0-9-]+\.)+superleads\.mx\b/gi)) motivos.push(`dominio interno (${m[0]})`);
  if (/(^|[\s(`])(~\/|\/Users\/|\/home\/|[A-Z]:\\)/.test(texto)) motivos.push('ruta local');
  if (/\bssh\s+\S+@/i.test(texto)) motivos.push('acceso ssh');
  // Ids y llaves.
  if (/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i.test(texto)) motivos.push('UUID');
  if (/\b[0-9a-f]{24,}\b/i.test(texto) || /\b(sk|pk|ghp|gho|xox[abp]|AKIA)[-_A-Za-z0-9]{12,}/.test(texto)) motivos.push('llave o id largo');
  return [...new Set(motivos)];
}

function coincidencias(texto) {
  const t = sinAcentos(texto);
  const out = [];
  if (showcase.some((x) => x.re.test(t))) out.push('showcase_blocklist');
  if (personal.some((x) => x.re.test(t))) out.push('personal.txt');
  if (privado.some((x) => x.re.test(t))) out.push('privado.txt');
  return out; // nunca se imprime el término: las listas son privadas
}

// ── lectura de la bóveda ──────────────────────────────────────────────────
function* notas(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || OMITIR_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* notas(p);
    else if (e.isFile() && e.name.endsWith('.md')) yield p;
  }
}

function frontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return { meta, body: m[2] };
}

const lista = (v) =>
  (v || '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((s) => s.trim().replace(/^#/, '').toLowerCase())
    .filter(Boolean);

const slugify = (s) =>
  sinAcentos(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

/** Nota de la bóveda → { titulo, linea, vinetas: [{texto, hijos}] } o error. */
function convertir(body, tituloArchivo, publicas) {
  let b = body.replace(/%%[\s\S]*?%%/g, '');
  let titulo = tituloArchivo;
  let linea = '';
  const raiz = [];
  let h2 = null; // viñeta de nivel 1 abierta por ##
  let h3 = null; // viñeta de nivel 2 abierta por ###
  const wiki = (s) =>
    s.replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g, (_, dest, alias) => {
      const texto = (alias || dest).trim();
      const slug = publicas.get(dest.trim());
      return slug ? `[${texto}](#${slug})` : texto;
    });
  const destinoActual = () => (h3 ? h3.hijos : h2 ? h2.hijos : raiz);
  const nivelBase = () => (h3 ? 2 : h2 ? 1 : 0);
  const pila = [];
  for (const crudo of b.split(/\r?\n/)) {
    const l = crudo.replace(/\t/g, '  ');
    if (!l.trim()) continue;
    let m;
    if ((m = /^# (.+)$/.exec(l))) {
      titulo = m[1].trim();
      continue;
    }
    if ((m = /^>\s?(.+)$/.exec(l))) {
      if (!linea) linea = wiki(m[1].trim());
      continue;
    }
    if ((m = /^## (.+)$/.exec(l))) {
      h2 = { texto: wiki(m[1].trim()), hijos: [] };
      h3 = null;
      raiz.push(h2);
      pila.length = 0;
      continue;
    }
    if ((m = /^### (.+)$/.exec(l))) {
      h3 = { texto: wiki(m[1].trim()), hijos: [] };
      (h2 ? h2.hijos : raiz).push(h3);
      pila.length = 0;
      continue;
    }
    if (/^#{4,} /.test(l)) return { error: 'encabezado de 4.º nivel (más de 3 niveles)' };
    m = /^( *)[-*+] (.+)$/.exec(l) || /^( *)\d+\. (.+)$/.exec(l);
    const sangria = m ? Math.floor(m[1].length / 2) : 0;
    const texto = wiki((m ? m[2] : l).trim());
    const nivel = nivelBase() + sangria;
    if (nivel >= MAX_NIVELES) return { error: `más de ${MAX_NIVELES} niveles de «ver más»` };
    while (pila.length && pila[pila.length - 1].sangria >= sangria) pila.pop();
    const v = { texto, hijos: [] };
    (pila.length ? pila[pila.length - 1].v.hijos : destinoActual()).push(v);
    pila.push({ sangria, v });
  }
  if (!linea) return { error: 'sin línea potente (falta «> …»)' };
  return { titulo, linea, vinetas: raiz };
}

function aMarkdown(vs, nivel = 0) {
  return vs.map((v) => `${'  '.repeat(nivel)}- ${v.texto.replace(/\n/g, ' ')}\n${aMarkdown(v.hijos, nivel + 1)}`).join('');
}

// ── corrida ───────────────────────────────────────────────────────────────
if (!fs.existsSync(BOVEDA)) {
  console.error(`✕ No existe la bóveda ${BOVEDA}`);
  process.exit(2);
}

const candidatas = [];
for (const file of notas(BOVEDA)) {
  const raw = fs.readFileSync(file, 'utf8');
  const { meta, body } = frontmatter(raw);
  if (String(meta.publico).toLowerCase() !== 'true') continue;
  candidatas.push({ file, rel: path.relative(BOVEDA, file), meta, body, titulo: path.basename(file, '.md') });
}

// Slugs de las públicas (para que [[Otra nota]] ligue a su ancla si también sale).
const publicas = new Map(candidatas.map((c) => [c.titulo, `boveda-${slugify(c.titulo)}`]));

const salen = [];
const niegan = [];
for (const c of candidatas) {
  const motivos = [];
  const tags = lista(c.meta.tags);
  if (tags.includes('privado') || /(^|\s)#privado\b/i.test(c.body) || String(c.meta.privado).toLowerCase() === 'true')
    motivos.push('etiqueta privado');
  const conv = convertir(c.body, c.titulo, publicas);
  if (conv.error) motivos.push(conv.error);
  const todo = [c.titulo, ...Object.values(c.meta), c.body.replace(/%%[\s\S]*?%%/g, '')].join('\n');
  motivos.push(...coincidencias(todo), ...sensibles(todo));
  if (!conv.error) {
    const n = conv.linea.split(/\s+/).filter(Boolean).length;
    if (n > MAX_PALABRAS) motivos.push(`línea potente de ${n} palabras (máx. ${MAX_PALABRAS})`);
  }
  if (motivos.length) {
    niegan.push({ rel: c.rel, motivos: [...new Set(motivos)] });
    continue;
  }
  const slug = publicas.get(c.titulo);
  const lang = c.meta.lang === 'en' ? 'en' : 'es';
  const orden = 1000 + (Number(c.meta.orden ?? c.meta.order) || 0);
  const fm = [
    '---',
    `title: ${conv.titulo}`,
    `orden: ${orden}`,
    `linea: ${conv.linea}`,
    `lang: ${lang}`,
    c.meta.par ? `par: boveda-${slugify(c.meta.par)}` : null,
    c.meta.area ? `area: ${c.meta.area}` : null,
    'origen: boveda',
    `actualizado: ${c.meta.actualizado || c.meta.updated || ''}`,
    '---',
  ].filter((x) => x !== null);
  salen.push({ rel: c.rel, slug, contenido: `${fm.join('\n')}\n${aMarkdown(conv.vinetas)}` });
}

console.log(`Bóveda: ${BOVEDA}`);
console.log(`Destino: ${DESTINO}${SECO ? '  (--seco: no se escribe nada)' : ''}`);
console.log(`Con publico: true: ${candidatas.length} · salen: ${salen.length} · se niegan: ${niegan.length}`);
for (const s of salen) console.log(`  ✓ ${s.rel} → ${s.slug}.md`);
for (const n of niegan) console.log(`  ✕ ${n.rel}: ${n.motivos.join('; ')}`);

if (SECO) process.exit(0);

fs.mkdirSync(DESTINO, { recursive: true });
const vivos = new Set();
for (const s of salen) {
  const f = path.join(DESTINO, `${s.slug}.md`);
  vivos.add(path.basename(f));
  const antes = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
  if (antes !== s.contenido) fs.writeFileSync(f, s.contenido);
}
// Despublicar: solo borra archivos que este script escribió (origen: boveda) y que ya no salen.
for (const f of fs.readdirSync(DESTINO)) {
  if (!f.endsWith('.md') || vivos.has(f)) continue;
  const p = path.join(DESTINO, f);
  if (/^origen: boveda$/m.test(fs.readFileSync(p, 'utf8'))) {
    fs.unlinkSync(p);
    console.log(`  − quitado ${f} (ya no es pública o se negó)`);
  }
}
console.log('Listo.');
