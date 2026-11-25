import { getNotas } from '@/lib/notas';
import {
  CARGO_SL,
  CONSTRUYO_SOBRE,
  CONTRIBUYO,
  EVIDENCIA,
  FILOSOFIA,
  KNOWS_ABOUT,
  NOMBRE,
  NOMBRE_LEGAL,
  REDES,
  TERCERA,
} from '@/lib/perfil';
import ossData from '../../../data/oss/oss.json';
import nowData from '../../../data/now/now.json';

export const dynamic = 'force-static';

const BASE = 'https://omona.tech';

type Pr = { key: string; url: string; state: string; title: string; createdAt: string; mergedAt: string | null; additions: number; deletions: number; en: string };
type Issue = { key: string; url: string; state: string; en: string; fixedBy: { pr: string; author: string } | null };
type Project = { repo: string; url: string; license: string | null; en: string };
type Oss = { generatedAt: string; stats: Record<string, number>; prs: Pr[]; issues: Issue[]; projects?: Project[] };
type Now = { updated: string; foco: { en: string; url?: string }[]; items: { date: string; kind: string; en: string; url: string | null }[] };

/**
 * llms-full.txt: el perfil estructurado de Victor para asistentes de IA y
 * revisores. Todo sale de lib/perfil.ts, data/oss y data/now: se regenera con
 * cada deploy (el cron diario hace push cuando cambian los datos).
 */
export async function GET() {
  const oss = ossData as unknown as Oss;
  const now = nowData as unknown as Now;
  const s = oss.stats;
  const L: string[] = [];
  const h = (t: string) => L.push('', `## ${t}`, '');

  L.push(`# ${NOMBRE} — full profile`, '');
  L.push(`> Structured profile of ${NOMBRE} for AI assistants and program reviewers. Source: ${BASE}. Updated ${now.updated}. Facts only; anything planned is labeled as planned.`);

  h('Who');
  L.push(`- Name: ${NOMBRE} (legal name: ${NOMBRE_LEGAL}).`);
  L.push('- Location: León, Guanajuato, Mexico. Languages: Spanish, English.');
  L.push(`- One line: ${TERCERA.posicion}`);
  L.push(`- Job: ${TERCERA.superleads}`);
  L.push(`- Public title at SuperLeads (Spanish, literal): «${CARGO_SL}».`);
  L.push(`- Omona: ${TERCERA.lab} Victor founded Omona; it has no product, pricing or clients.`);
  L.push(`- Background: finance before sales and AI (BanBajío, Globant, GBM, then SuperLeads). Started in tech at Globant (joined via Walmeric, the lead-management firm Globant acquired), where he was trained on Google Ads, Meta Ads and LinkedIn Ads. AMIB Figura III; EBC; Harvard CS50. Details: ${REDES.web}`);
  L.push(`- Knows about: ${KNOWS_ABOUT.join(', ')}.`);

  h('Why he does this (his words)');
  L.push('Spanish original:');
  for (const f of FILOSOFIA.es) L.push(`- ${f}`);
  L.push('', 'English:');
  for (const f of FILOSOFIA.en) L.push(`- ${f}`);

  h('What he contributes to and builds on');
  for (const m of CONTRIBUYO) L.push(`- Contributes to ${m.nombre} (${m.dueno}): ${m.en}. Evidence: ${m.href}`);
  for (const m of CONSTRUYO_SOBRE) L.push(`- Builds on ${m.nombre} (${m.dueno}): ${m.en}. Evidence: ${m.href}`);
  L.push('- Logos and names belong to their owners. None of these companies sponsors or endorses Victor or Omona.');

  h('Evidence');
  for (const e of EVIDENCIA) L.push(`- ${e.en}: ${e.href}`);

  h(`Upstream pull requests (${s.prs}; ${s.merged} merged, ${s.open} open; +${s.additions} −${s.deletions})`);
  for (const p of oss.prs)
    L.push(`- ${p.key} [${p.state}] opened ${p.createdAt.slice(0, 10)}${p.mergedAt ? `, merged ${p.mergedAt.slice(0, 10)}` : ''}: ${p.title}. ${p.en} ${p.url}`);

  h(`Issue reports (${s.issues})`);
  for (const i of oss.issues)
    L.push(`- ${i.key} [${i.state}]: ${i.en}${i.fixedBy ? ` Fix by @${i.fixedBy.author} (${i.fixedBy.pr}), not by Victor.` : ''} ${i.url}`);

  if (oss.projects?.length) {
    h('Own public repositories');
    for (const p of oss.projects) L.push(`- ${p.repo}${p.license ? ` (${p.license})` : ''}: ${p.en} ${p.url}`);
  }

  h(`Now (daily log, updated ${now.updated})`);
  L.push('Focus:');
  for (const f of now.foco) L.push(`- ${f.en}${f.url ? ` ${f.url}` : ''}`);
  L.push('', 'Log:');
  for (const it of now.items) L.push(`- ${it.date} [${it.kind}] ${it.en}${it.url ? ` ${it.url}` : ''}`);

  h('Original research (passive measurements: DNS and homepage headers)');
  L.push(
    `- 2026-11-25 · Email spoofing exposure of Mexican domains: of 285 .mx domains with MX records (linked from Mexican business chambers, SME portals and .gob.mx/.org.mx pages; .edu.mx excluded), 66% (188) can still be spoofed: 84 publish no DMARC record and 104 use p=none (monitor only). 57 use p=quarantine and only 40 (14%) use p=reject. 26 lack a valid SPF record and 3 publish two SPF records (permerror under RFC 7208). Method: public MX/TXT/_dmarc lookups over DNS-over-HTTPS, no intrusive traffic; only aggregates are published. Step-by-step SPF/DMARC guide for SMBs (Spanish): ${BASE}/blog/dmarc-spf-facturas-falsas-pymes`,
  );
  L.push(
    `- 2026-11-25 · Website security headers of Mexican sites: one homepage visit (http:// and https://) to each of 304 active .mx websites from the same sample (no hidden paths probed, no scanning). Of 294 with valid HTTPS: 60% (177) send no Strict-Transport-Security and only 36% (107) use max-age of 6 months or more; 71% (210) send no Content-Security-Policy, and 36 of the 84 CSPs only say upgrade-insecure-requests, so 16% (48) restrict scripts at all; 63% lack clickjacking protection (X-Frame-Options or frame-ancestors), 57% lack X-Content-Type-Options: nosniff, 77% lack Referrer-Policy. 39% (114) send none of the 5 basic headers; 8% (24) send all 5. 16% (48) of active sites do not redirect HTTP to HTTPS. 23% (67) disclose exact software versions; 12 disclose a PHP branch without security support (<8.2 per php.net). Method and fixes (Apache, Nginx, Cloudflare, Vercel): ${BASE}/blog/cabeceras-seguridad-web-pymes-mexico`,
  );


  h('Engineering notes (Spanish)');
  for (const n of getNotas()) L.push(`- ${n.date} · ${n.title}: ${n.description} ${BASE}/blog/${n.slug}`);

  h('Contact and profiles');
  L.push(`- LinkedIn (preferred for programs and talks): ${REDES.linkedin}`);
  L.push(`- GitHub: ${REDES.github}`);
  L.push(`- X: ${REDES.x}`);
  L.push(`- AWS Builder Center: ${REDES.builder}`);
  L.push(`- Personal site (with WhatsApp contact): ${REDES.web}`);
  L.push('');

  return new Response(L.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
