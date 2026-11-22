#!/usr/bin/env node
/**
 * Arma data/now/now.json: la bitácora «Ahora» de omona.tech (portada, /now,
 * /now/rss.xml, llms-full.txt). Corre a diario después de oss-refresh.mjs
 * (cron `omona-oss-diario`, ~/.hermes/scripts/omona_oss_refresh.sh).
 *
 *   node apps/dashboard/scripts/now-refresh.mjs          # escribe el JSON
 *   node apps/dashboard/scripts/now-refresh.mjs --check  # solo imprime
 *
 * Fuentes, todas públicas:
 *   - data/oss/oss.json       PRs abiertos / merged / cerrados, reportes, repos propios
 *   - data/notas/*.md         notas del blog (frontmatter date/title/description)
 *   - data/now/manual.json    eventos y foco confirmados a mano (con `hasta` opcional)
 *   - ~/.hermes/omona/devin/bitacora.jsonl, si existe: SOLO líneas con
 *     `"public": true` (liga a github.com u omona.tech) o el PR público upstream
 *     de una sesión (`upstream_pr`) que oss.json no tenga todavía.
 * Toda línea pasa por ~/.hermes/state/showcase_blocklist.txt (nombres de
 * clientes/personas): si aparece uno, la línea no se publica.
 *
 * Regla (skill omona-tech): nunca «merged» si GitHub no lo dice; el estado
 * sale de oss.json, que a su vez sale de GitHub en cada corrida.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(aqui, '..', 'data');
const SALIDA = path.join(DATA, 'now', 'now.json');
const soloRevisar = process.argv.includes('--check');
const BITACORA = process.env.OMONA_BITACORA || path.join(os.homedir(), '.hermes', 'omona', 'devin', 'bitacora.jsonl');
const BLOCKLIST = path.join(os.homedir(), '.hermes', 'state', 'showcase_blocklist.txt');
const MAX = 40;

const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
const dia = (iso) => (iso ? new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' }) : null);
const leer = (f, d) => {
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {
    return d;
  }
};

const bloqueadas = (() => {
  try {
    return fs
      .readFileSync(BLOCKLIST, 'utf8')
      .split('\n')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length >= 4 && !s.startsWith('#'))
      // La lista es del escaparate de SuperLeads, donde Omona no va; aquí Omona es el sitio.
      .filter((s) => !['omona', 'omona.tech'].includes(s));
  } catch {
    return [];
  }
})();
const limpio = (it) => {
  const t = `${it.es} ${it.en}`.toLowerCase();
  return !bloqueadas.some((b) => t.includes(b));
};

const oss = leer(path.join(DATA, 'oss', 'oss.json'), { prs: [], issues: [], projects: [] });
const manual = leer(path.join(DATA, 'now', 'manual.json'), { foco: [], eventos: [] });
const corto = (repo) => repo.split('/')[1] ?? repo;
// Mismas organizaciones que oss-refresh.mjs (terceros abiertos).
const permitidoLab = (repo) => ['NousResearch', 'strands-agents'].includes(repo.split('/')[0]);
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const items = [];

// 1. Pull requests: abierto, y además merged o cerrado cuando GitHub lo diga.
for (const p of oss.prs) {
  items.push({
    date: dia(p.createdAt),
    kind: 'pr',
    es: `Abrí ${corto(p.repo)}#${p.number}: ${p.es}`,
    en: `Opened ${corto(p.repo)}#${p.number}: ${p.en}`,
    url: p.url,
    ref: p.key,
  });
  if (p.state === 'merged' && p.mergedAt) {
    items.push({
      date: dia(p.mergedAt),
      kind: 'merged',
      es: `Merged en ${p.repo}: #${p.number}, ${p.title}`,
      en: `Merged into ${p.repo}: #${p.number}, ${p.title}`,
      url: p.url,
      ref: p.key,
    });
  } else if (p.state === 'closed' && p.closedAt) {
    items.push({
      date: dia(p.closedAt),
      kind: 'cerrado',
      es: `Se cerró sin merge ${corto(p.repo)}#${p.number}.`,
      en: `${corto(p.repo)}#${p.number} was closed without merging.`,
      url: p.url,
      ref: p.key,
    });
  }
}

// 2. Reportes (issues). Si el arreglo es de otra persona, se dice.
for (const i of oss.issues) {
  const de = i.fixedBy ? ` Arreglo: PR #${i.fixedBy.pr.split('#')[1]} de @${i.fixedBy.author}.` : '';
  const by = i.fixedBy ? ` Fix: PR #${i.fixedBy.pr.split('#')[1]} by @${i.fixedBy.author}.` : '';
  items.push({
    date: dia(i.createdAt),
    kind: 'reporte',
    es: `Reporté ${corto(i.repo)}#${i.number}. ${cap(i.es.replace(/^(Reporte|Propuesta): /, ''))}${de}`,
    en: `Reported ${corto(i.repo)}#${i.number}. ${cap(i.en.replace(/^(Report|Proposal): /, ''))}${by}`,
    url: i.url,
    ref: i.key,
  });
}

// 3. Notas del blog.
const DIR_NOTAS = path.join(DATA, 'notas');
for (const f of fs.existsSync(DIR_NOTAS) ? fs.readdirSync(DIR_NOTAS).filter((x) => x.endsWith('.md')) : []) {
  const raw = fs.readFileSync(path.join(DIR_NOTAS, f), 'utf8');
  const m = /^---\n([\s\S]*?)\n---/.exec(raw);
  if (!m) continue;
  const meta = Object.fromEntries(
    m[1]
      .split('\n')
      .map((l) => [l.slice(0, l.indexOf(':')).trim(), l.slice(l.indexOf(':') + 1).trim()])
      .filter(([k]) => k),
  );
  if (!meta.date || meta.date > hoy) continue;
  const slug = f.replace(/\.md$/, '');
  items.push({
    date: meta.date,
    kind: 'nota',
    es: meta.title,
    en: `${meta.title} (note in Spanish)`,
    url: `https://omona.tech/blog/${slug}`,
    ref: `nota:${slug}`,
  });
}

// 4. Eventos y programas confirmados a mano.
for (const e of manual.eventos ?? []) {
  if (!e.date || e.date > hoy || (e.hasta && e.hasta < hoy)) continue;
  items.push({ date: e.date, kind: e.kind || 'evento', es: e.es, en: e.en, url: e.url ?? null, ref: `manual:${e.date}:${e.kind}` });
}

// 5. Bitácora del laboratorio (Devin/Omona, ~/.hermes/omona/devin/bitacora.jsonl).
//    Esa bitácora es interna (sesiones, lecciones, ligas privadas). Solo entra:
//    a) una línea marcada a mano `"public": true` con liga a github.com u omona.tech, o
//    b) una sesión que terminó en un PR público upstream (`upstream_pr`) que oss.json aún no
//       lista; de esa se publica solo el PR y su estado, nunca el texto interno.
const clavesPr = new Set(oss.prs.map((p) => p.key));
if (fs.existsSync(BITACORA)) {
  for (const linea of fs.readFileSync(BITACORA, 'utf8').split('\n')) {
    if (!linea.trim()) continue;
    let b;
    try {
      b = JSON.parse(linea);
    } catch {
      continue;
    }
    const d = dia(b.date || b.fecha || b.fecha_inicio || b.ts);
    if (!d || d > hoy) continue;
    const pr = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/.exec(b.upstream_pr || '');
    if (b.public === true) {
      const url = b.url_publica || b.url || '';
      const es = b.es || b.resumen;
      if (!es || !/^https:\/\/(github\.com|omona\.tech)\//.test(url)) continue;
      items.push({ date: d, kind: 'laboratorio', es, en: b.en || es, url, ref: `lab:${url}` });
    } else if (pr && permitidoLab(pr[1]) && !clavesPr.has(`${pr[1]}#${pr[2]}`)) {
      const estado = b.upstream_estado || 'abierto';
      items.push({
        date: d,
        kind: 'laboratorio',
        es: `Aporte del laboratorio: ${corto(pr[1])}#${pr[2]} (${estado}).`,
        en: `Lab contribution: ${corto(pr[1])}#${pr[2]} (${estado}).`,
        url: pr[0],
        ref: `${pr[1]}#${pr[2]}`,
      });
    }
  }
}

// Orden: más reciente primero; a igual fecha, merged > pr > reporte > nota > resto.
const peso = { merged: 0, pr: 1, cerrado: 2, reporte: 3, nota: 4 };
const vistos = new Set();
const feed = items
  .filter((it) => it.date && limpio(it))
  .filter((it) => {
    const k = `${it.kind}|${it.ref}`;
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  })
  .sort((a, b) => (a.date === b.date ? (peso[a.kind] ?? 9) - (peso[b.kind] ?? 9) : a.date < b.date ? 1 : -1))
  .slice(0, MAX);

const foco = (manual.foco ?? []).filter((f) => !f.hasta || f.hasta >= hoy).filter(limpio).map(({ hasta, ...f }) => f);
const s = oss.stats ?? {};
foco.unshift({
  es: `${s.open ?? 0} pull requests esperando revisión en Hermes Agent y Strands Agents${s.merged ? ` · ${s.merged} merged` : ''}.`,
  en: `${s.open ?? 0} pull requests awaiting review in Hermes Agent and Strands Agents${s.merged ? ` · ${s.merged} merged` : ''}.`,
  url: 'https://omona.tech/open-source',
});

const salida = { generatedAt: new Date().toISOString(), updated: feed[0]?.date ?? hoy, foco, items: feed };

if (soloRevisar) {
  console.log(JSON.stringify(salida, null, 2));
} else {
  fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
  fs.writeFileSync(SALIDA, `${JSON.stringify(salida, null, 2)}\n`);
  console.log(`now.json: ${feed.length} entradas, ${foco.length} de foco, última ${salida.updated}`);
}
