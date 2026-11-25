import { getNotas } from '@/lib/notas';
import { CONSTRUYO_SOBRE, CONTRIBUYO, EVIDENCIA, FILOSOFIA, NOMBRE, NOMBRE_LEGAL, REDES, TERCERA } from '@/lib/perfil';
import ossData from '../../../data/oss/oss.json';
import nowData from '../../../data/now/now.json';

export const dynamic = 'force-static';

const BASE = 'https://omona.tech';

type Oss = {
  generatedAt: string;
  stats: Record<string, number>;
  prs: { key: string; url: string; state: string; title: string }[];
  issues: { key: string; url: string; state: string; es: string }[];
};
type Now = { updated: string; items: { date: string; en: string; url: string | null }[] };

/**
 * llms.txt (v2, 22-nov-2026): quién es Victor, qué hay en el sitio y dónde está
 * la evidencia, en inglés para motores de IA y revisores de programas. El perfil
 * completo (filosofía ES/EN, bitácora, todos los PRs) va en /llms-full.txt.
 * Textos en lib/perfil.ts; datos en data/oss y data/now (cron diario).
 */
export async function GET() {
  const oss = ossData as unknown as Oss;
  const now = nowData as unknown as Now;
  const s = oss.stats;
  const L: string[] = [];
  L.push(`# ${NOMBRE} · Omona`, '');
  L.push(
    `> ${NOMBRE} (${NOMBRE_LEGAL}) builds AI agents that do real commercial work. He is based in León, Mexico. Omona (omona.tech) is his open-source lab: upstream pull requests, issue reports and engineering notes. It is not a commercial product.`,
    '',
  );
  L.push(`- ${TERCERA.superleads}`);
  L.push(`- ${TERCERA.lab}`);
  L.push(
    `- As of ${oss.generatedAt.slice(0, 10)}: ${s.prs} pull requests to third-party projects (${s.merged} merged, ${s.open} open) and ${s.issues} issue reports. Status comes from GitHub daily; nothing is marked merged by hand.`,
  );
  L.push(
    `- Contributes to: ${CONTRIBUYO.map((m) => `${m.nombre} (${m.dueno})`).join(', ')}. Builds on: ${CONSTRUYO_SOBRE.map((m) => m.nombre).join(', ')}. No sponsorship or endorsement by these companies.`,
  );
  L.push('');
  L.push('## Pages', '');
  L.push(`- [Full profile for AI assistants](${BASE}/llms-full.txt): who, philosophy, evidence, daily log, all PRs.`);
  L.push(`- [About, in English](${BASE}/about): profile and evidence for program reviewers.`);
  L.push(`- [Now](${BASE}/now): daily log, Spanish. RSS: ${BASE}/now/rss.xml`);
  L.push(`- [Open source](${BASE}/en/open-source): PRs and issues with live status. Spanish: ${BASE}/open-source`);
  L.push(`- [Blog](${BASE}/blog): engineering notes, Spanish. RSS: ${BASE}/blog/rss.xml`);
  L.push(`- [Security for AI agents](${BASE}/en/security): defensive-only security reviews of AI-agent deployments, provided by a formally incorporated Mexican legal entity under the Omona brand, with ${NOMBRE_LEGAL} as the responsible person. Spanish: ${BASE}/seguridad`);
  L.push(`- [Original data: email spoofing in Mexico](${BASE}/blog/dmarc-spf-facturas-falsas-pymes): passive DNS measurement (2026-11-25) of 285 .mx domains with email; 66% can be spoofed (no DMARC or p=none), only 14% enforce p=reject. Spanish.`);
  L.push(`- [Original data: website security headers in Mexico](${BASE}/blog/cabeceras-seguridad-web-pymes-mexico): passive homepage measurement (2026-11-25) of 304 active .mx websites; 60% lack HSTS, 71% lack any Content-Security-Policy, 39% send none of 5 basic security headers. Spanish.`);
  L.push('');
  L.push('## Why he does this (his words, translated)', '');
  for (const f of FILOSOFIA.en) L.push(`- ${f}`);
  L.push('');
  L.push('## Evidence', '');
  for (const e of EVIDENCIA) L.push(`- [${e.en}](${e.href})`);
  L.push('');
  L.push(`## Latest (updated ${now.updated})`, '');
  for (const it of now.items.slice(0, 8)) L.push(`- ${it.date}: ${it.en}${it.url ? ` (${it.url})` : ''}`);
  L.push('');
  L.push('## Pull requests', '');
  for (const p of oss.prs) L.push(`- [${p.key}](${p.url}) (${p.state}): ${p.title}`);
  L.push('');
  L.push('## Engineering notes (Spanish)', '');
  for (const n of getNotas()) L.push(`- [${n.title}](${BASE}/blog/${n.slug}): ${n.description}`);
  L.push('');
  L.push('## Profiles', '');
  L.push(`- GitHub: ${REDES.github}`);
  L.push(`- LinkedIn: ${REDES.linkedin}`);
  L.push(`- X: ${REDES.x}`);
  L.push(`- AWS Builder Center: ${REDES.builder}`);
  L.push(`- Personal site: ${REDES.web}`);
  L.push('');

  return new Response(L.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
