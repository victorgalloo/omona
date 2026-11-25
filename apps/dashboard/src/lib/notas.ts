/**
 * Notas de ingeniería del blog (data/notas/*.md).
 *
 * A diferencia del corpus GEO (data/geo), estas piezas las firma una persona,
 * salen de trabajo real (PRs, mediciones) y traen frontmatter explícito:
 *
 *   ---
 *   title: …            (también el <title>)
 *   description: …      (meta description, ≤160)
 *   date: 2026-11-22    (datePublished)
 *   updated: …          (opcional, dateModified)
 *   tags: a, b, c
 *   prs: owner/repo#123, owner/repo#456
 *   image: /blog/<slug>/visual.svg   (visual original de la nota)
 *   imageAlt: …
 *   ---
 *
 * Reglas (skill omona-tech): capa de experiencia completa, nunca «merged» si
 * no lo está, sin nombres de clientes.
 */
import fs from 'fs';
import path from 'path';

export interface Nota {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  prs: { repo: string; number: number; url: string; key: string }[];
  image: string | null;
  imageAlt: string;
  /** Markdown sin frontmatter ni el H1. */
  body: string;
  h1: string;
  palabras: number;
}

const DIR = path.join(process.cwd(), 'data', 'notas');

function parse(file: string): Nota {
  const raw = fs.readFileSync(file, 'utf8');
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!m) throw new Error(`Nota sin frontmatter: ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  let body = m[2].trim();
  let h1 = meta.title;
  const h = /^# (.+)\n/.exec(body);
  if (h) {
    h1 = h[1].trim();
    body = body.slice(h[0].length).trim();
  }
  const prs = (meta.prs || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((key) => {
      const [repo, n] = key.split('#');
      return { repo, number: Number(n), key, url: `https://github.com/${repo}/pull/${n}` };
    });
  return {
    slug: path.basename(file, '.md'),
    title: meta.title,
    description: meta.description,
    date: meta.date,
    updated: meta.updated || meta.date,
    tags: (meta.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
    prs,
    image: meta.image || null,
    imageAlt: meta.imageAlt || '',
    body,
    h1,
    palabras: body.split(/\s+/).filter(Boolean).length,
  };
}

let cache: Nota[] | null = null;

export function getNotas(): Nota[] {
  if (cache) return cache;
  const items = fs.existsSync(DIR)
    ? fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).map((f) => parse(path.join(DIR, f)))
    : [];
  items.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  cache = items;
  return items;
}

export function getNota(slug: string): Nota | undefined {
  return getNotas().find((n) => n.slug === slug);
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function fechaCorta(iso: string): string {
  const [y, mo, d] = iso.split('-').map(Number);
  return `${d} ${MESES[mo - 1]} ${y}`;
}
