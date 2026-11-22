#!/usr/bin/env node
/**
 * Refresca data/oss/oss.json con los aportes de código abierto de Victor Gallo
 * (GitHub: victorgalloo) a proyectos que NO son suyos.
 *
 *   node apps/dashboard/scripts/oss-refresh.mjs          # escribe el JSON
 *   node apps/dashboard/scripts/oss-refresh.mjs --check  # solo imprime, no escribe
 *
 * Token: GITHUB_TOKEN o `gh auth token` (sin token también funciona, con el
 * límite de 10 búsquedas por minuto de la API pública).
 *
 * Reglas (ver skill omona-tech):
 * - Solo organizaciones de REPOS_PERMITIDOS: proyectos abiertos de terceros.
 *   Nada de repos de clientes, del empleador ni de amigos.
 * - El estado sale de GitHub en cada corrida. Nunca se escribe «merged» a mano.
 * - La línea ES/EN de cada PR vive en data/oss/notes.json. Un PR nuevo sin
 *   nota se publica con su título (y la corrida lo avisa para escribirla).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AUTOR = 'victorgalloo';
const REPOS_PERMITIDOS = ['NousResearch/hermes-agent', 'strands-agents/harness-sdk', 'strands-agents/sdk-python', 'strands-agents/sdk-typescript', 'strands-agents/tools'];
const ORGS_PERMITIDAS = ['strands-agents'];
// Proyectos propios y públicos que se muestran aparte (no cuentan como aportes).
const PROYECTOS_PROPIOS = ['victorgalloo/bedrock-agent-hierarchy', 'victorgalloo/inscripcion-codi', 'victorgalloo/superleads-ai-aws-nvidia'];

const aqui = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(aqui, '..', 'data', 'oss');
const NOTAS = path.join(DIR, 'notes.json');
const SALIDA = path.join(DIR, 'oss.json');
const soloRevisar = process.argv.includes('--check');

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', timeout: 10_000 }).trim();
  } catch {
    return '';
  }
}

const TOKEN = token();

async function gh(url) {
  const res = await fetch(`https://api.github.com${url}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'omona-oss-refresh',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} en ${url}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

function permitido(repo) {
  return REPOS_PERMITIDOS.includes(repo) || ORGS_PERMITIDAS.includes(repo.split('/')[0]);
}

function repoDe(item) {
  return item.repository_url.replace('https://api.github.com/repos/', '');
}

async function buscar(tipo) {
  const q = encodeURIComponent(`author:${AUTOR} type:${tipo}`);
  const items = [];
  for (let page = 1; page <= 5; page++) {
    const r = await gh(`/search/issues?q=${q}&per_page=100&page=${page}`);
    items.push(...r.items);
    if (r.items.length < 100) break;
  }
  return items.filter((it) => permitido(repoDe(it)));
}

async function main() {
  const notas = JSON.parse(fs.readFileSync(NOTAS, 'utf8'));
  const prsCrudos = await buscar('pr');
  const issuesCrudos = await buscar('issue');

  const prs = [];
  const sinNota = [];
  for (const it of prsCrudos) {
    const repo = repoDe(it);
    const pr = await gh(`/repos/${repo}/pulls/${it.number}`);
    const clave = `${repo}#${it.number}`;
    const nota = notas.prs[clave];
    if (!nota) sinNota.push(clave);
    const estado = pr.merged_at ? 'merged' : pr.state === 'closed' ? 'closed' : pr.draft ? 'draft' : 'open';
    prs.push({
      key: clave,
      repo,
      number: it.number,
      title: pr.title,
      url: pr.html_url,
      state: estado,
      createdAt: pr.created_at,
      mergedAt: pr.merged_at,
      closedAt: pr.closed_at,
      additions: pr.additions,
      deletions: pr.deletions,
      changedFiles: pr.changed_files,
      comments: (pr.comments || 0) + (pr.review_comments || 0),
      fixes: nota?.fixes ?? null,
      area: nota?.area ?? null,
      es: nota?.es ?? pr.title,
      en: nota?.en ?? pr.title,
      post: nota?.post ?? null,
    });
  }
  prs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const issues = [];
  for (const it of issuesCrudos) {
    const repo = repoDe(it);
    const clave = `${repo}#${it.number}`;
    const nota = notas.issues?.[clave];
    let fixedBy = nota?.fixedBy ?? null;
    if (fixedBy?.pr) {
      // El estado del arreglo (de otro autor) también sale de GitHub en cada corrida.
      const [r, n] = fixedBy.pr.split('#');
      const pr = await gh(`/repos/${r}/pulls/${n}`);
      fixedBy = {
        ...fixedBy,
        author: pr.user?.login ?? fixedBy.author,
        state: pr.merged_at ? 'merged' : pr.state === 'closed' ? 'closed' : pr.draft ? 'draft' : 'open',
      };
    }
    issues.push({
      key: clave,
      repo,
      number: it.number,
      title: it.title,
      url: it.html_url,
      state: it.state,
      createdAt: it.created_at,
      closedAt: it.closed_at,
      es: nota?.es ?? it.title,
      en: nota?.en ?? it.title,
      fixedBy,
    });
  }
  issues.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const proyectos = [];
  for (const full of PROYECTOS_PROPIOS) {
    const r = await gh(`/repos/${full}`);
    if (r.private) continue;
    const nota = notas.projects?.[full] ?? {};
    proyectos.push({
      repo: full,
      url: r.html_url,
      description: r.description,
      language: r.language,
      license: r.license?.spdx_id ?? null,
      pushedAt: r.pushed_at,
      stars: r.stargazers_count,
      es: nota.es ?? r.description,
      en: nota.en ?? r.description,
    });
  }

  const cuenta = (s) => prs.filter((p) => p.state === s).length;
  const datos = {
    generatedAt: new Date().toISOString(),
    author: AUTOR,
    stats: {
      prs: prs.length,
      merged: cuenta('merged'),
      open: cuenta('open') + cuenta('draft'),
      closed: cuenta('closed'),
      repos: [...new Set(prs.map((p) => p.repo))].length,
      issues: issues.length,
      additions: prs.reduce((s, p) => s + (p.additions || 0), 0),
      deletions: prs.reduce((s, p) => s + (p.deletions || 0), 0),
    },
    prs,
    issues,
    projects: proyectos,
  };

  const json = `${JSON.stringify(datos, null, 2)}\n`;
  if (soloRevisar) {
    process.stdout.write(json);
  } else {
    fs.writeFileSync(SALIDA, json);
    console.log(`oss.json: ${prs.length} PRs (${datos.stats.merged} merged, ${datos.stats.open} abiertos), ${issues.length} issues`);
  }
  if (sinNota.length) console.log(`SIN NOTA ES/EN (escríbela en data/oss/notes.json): ${sinNota.join(', ')}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
