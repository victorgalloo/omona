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

  h('Two core areas at Omona (US Hispanic & Bilingual SMB Focus: Commercial AI & Defensive Cybersecurity)');
  L.push(`- Primary Market: Hispanic-owned and bilingual small & mid-sized businesses in the United States (+5M Hispanic-owned US businesses across construction/contractors, tax preparers & accounting firms subject to FTC Safeguards Rule & IRS WISP, trucking/logistics, private clinics, and B2B services; es-US + en-US), plus cross-border B2B teams in Mexico. Strictly zero education sector (served exclusively by SuperLeads).`);
  L.push(`- Area 1 — Bilingual Commercial Processes + AI (${BASE}/comercial-ia, EN-US: ${BASE}/en/commercial-ai): bilingual (Spanish + English) commercial funnel design, sub-minute WhatsApp/SMS/web qualification with deterministic code guardrails (zero hallucinated prices), executive human handoff into CRM, and manager→agent→subagent orchestration on AWS Bedrock.`);
  L.push(`- Area 2 — Defensive Cybersecurity from BEC/FTC to AI (${BASE}/seguridad, EN-US: ${BASE}/en/security): SPF/DKIM/DMARC anti-spoofing against ACH/wire invoice fraud (FBI IC3 BEC), Google Workspace & Microsoft 365 hardening, FTC Safeguards Rule (16 CFR Part 314) & IRS Pub 4557 WISP technical readiness, US cyber insurance underwriting controls, passive domain diagnostic (${BASE}/#diagnostico), least-privilege AWS Bedrock IAM, secrets vaults, and prompt-injection/MCP guardrails under written authorization. US Pillar Guide (Spanish): ${BASE}/blog/ciberseguridad-negocios-latinos-estados-unidos`);

  h('Original research (passive measurements: commercial funnels, DNS, and homepage headers)');
  L.push(
    `- 2026-11-27 · Cyber insurance outside-in signals of US Hispanic chamber members: re-read, with no new traffic, of the 2026-11-26 measurements for the 595 members with both MX records and an active homepage. Six signals an underwriting scan can see: valid SPF (one record, -all/~all), DMARC enforced (quarantine/reject), valid HTTPS certificate, HTTP→HTTPS redirect, HSTS, no software version banner. Pass all 6: 103 (17.3%); 4 or fewer: 275 (46.2%). Failures: DMARC not enforced 63.4%, no HSTS 46.1%, SPF invalid/missing 12.1%, version banner 11.6%, no HTTP→HTTPS 10.1%, invalid HTTPS 2.4%; 14 sites announce PHP older than 8.2. All 6 by group: Finance & Insurance 34.1% (n=91), construction 8.7% (n=69), health care 6.9% (n=29), payment-heavy sectors 14.1% (n=128); Google Workspace 7.6% (n=158), Microsoft 365 22.7% (n=220), filtering gateways 39.1% (n=69). Aggregates only. Guide: ${BASE}/blog/cyber-insurance-small-business-checklist (EN) · ${BASE}/blog/seguro-cibernetico-pequenas-empresas (ES)`,
    `- 2026-11-26 · Mail provider vs. spoofability of US Hispanic chamber members (payment-diversion exposure): the same 604 member domains with MX, read via DNS-over-HTTPS only (MX, DKIM on the provider's default selector, _mta-sts). Microsoft 365: 225 domains (37.3%), 48.4% spoofable, 23.1% p=reject, 67.1% DKIM on selector1/selector2. Google Workspace: 159 (26.3%), 84.9% spoofable, 3.8% p=reject, 39.6% DKIM on the google selector. Other hosting: 139 (23.0%), 77.7% spoofable. Filtering gateways (Proofpoint, Mimecast, etc.): 72 (11.9%), 25.0% spoofable, 56.9% p=reject. Payment-heavy sectors (construction, equipment, transportation, real estate, manufacturing/wholesale, industrial supplies; 129 domains): 65.9% spoofable, 15.5% p=reject. MTA-STS on 1.7% of all domains. DKIM figures are a floor (custom selectors are invisible). Aggregates only. Guide: ${BASE}/blog/wire-fraud-ach-fraud-small-business (EN) · ${BASE}/blog/fraude-ach-wire-facturas-falsas-contratistas (ES)`,
    `- 2026-11-26 · Email and website posture of US Hispanic chamber members: from the public ChamberMaster member directories of the Fort Worth Hispanic Chamber (TX, 716 listings) and the Statewide Hispanic Chamber of Commerce of New Jersey (199 listings), excluding government/education, 604 member domains with MX records were read via DNS-over-HTTPS. 62.7% (379) can be spoofed: 171 (28.3%) publish no DMARC record and 208 (34.4%) use p=none; 111 (18.4%) use p=quarantine and 114 (18.9%) p=reject; 51 (8.4%) lack SPF. Finance & Insurance members (91): 45.1% spoofable, 37.4% p=reject. Restaurants 80.8%, legal 75%, construction 68.1% spoofable. The 27 chamber/.org domains: 59.3% spoofable, 7.4% p=reject; the 3 federal .gov portals with email: 100% p=reject (CISA BOD 18-01). Of 654 active member homepages: 72.2% send no Content-Security-Policy, 45.1% no HSTS, 27.9% none of 5 basic headers. Aggregates only. Guide: ${BASE}/blog/irs-wisp-ftc-safeguards-tax-preparers (EN) · ${BASE}/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos (ES)`,
  );
  L.push(
    `- 2026-11-26 · First-response and bilingual readiness of US Hispanic chamber members: from the public ChamberMaster directories of the Fort Worth Hispanic Chamber (TX) and the Statewide Hispanic Chamber of Commerce of New Jersey, excluding government/education, 593 active member homepages were read with 1 passive GET each (no forms submitted, no chats opened). 11.3% (67) offer an instant text channel (chat widget 7.1%, sms: link 2.5%, WhatsApp 2.2%; 9 of 13 WhatsApp links open blank); 63.1% (374) offer only slow channels (form, mailto:, phone, booking) and 35.4% (210) rely on a tel: link as the only fast channel; 25.6% (152) show no contact channel in the homepage HTML. 25.5% (151) offer both Spanish and English (hreflang 6.4%, language switcher 12.8%, translation plugin 11.8%); 81.5% have English-dominant copy; only 3.5% (21) are both bilingual and instant. Construction & contractors (75): 16.0% instant, 12.0% bilingual, 40.0% phone-only. Finance & insurance (88): 13.6% / 27.3% / 35.2%. JavaScript-injected widgets are not visible, so shares are a floor. Aggregates only. Guide: ${BASE}/blog/bilingual-answering-service-ai-small-business (EN) · ${BASE}/blog/recepcionista-bilingue-ia-negocios-latinos (ES)`,
    `- 2026-11-25 · Commercial digital readiness of Mexican business sites: passive homepage review of 255 active non-governmental, non-educational .mx websites linked by Mexican business chambers and SME portals (1 GET to public homepage HTML, zero form submissions). 77.3% (197) offer no immediate response channel on their homepage (29.8% rely only on static forms, mailto:, or phone; 47.5% show no direct commercial channel on the homepage). Only 20.0% (51) link directly to WhatsApp, and 64.7% (33 of 51) open blank with no prefilled context; 4.3% (11) run a chat/CRM widget and 0.4% (1) offer direct online booking. Architecture & guide (Spanish): ${BASE}/blog/procesos-comerciales-ia-whatsapp-arquitectura`,
  );
  L.push(
    `- 2026-11-25 · Email spoofing exposure of Mexican domains: of 285 .mx domains with MX records (linked from Mexican business chambers, SME portals and .gob.mx/.org.mx pages; .edu.mx excluded), 66% (188) can still be spoofed: 84 publish no DMARC record and 104 use p=none (monitor only). 57 use p=quarantine and only 40 (14%) use p=reject. 26 lack a valid SPF record and 3 publish two SPF records (permerror under RFC 7208). Method: public MX/TXT/_dmarc lookups over DNS-over-HTTPS, no intrusive traffic; only aggregates are published. Step-by-step SPF/DMARC guide for SMBs (Spanish): ${BASE}/blog/dmarc-spf-facturas-falsas-pymes`,
  );
  L.push(
    `- 2026-11-25 · Website security headers of Mexican sites: one homepage visit (http:// and https://) to each of 304 active .mx websites from the same sample (no hidden paths probed, no scanning). Of 294 with valid HTTPS: 60% (177) send no Strict-Transport-Security and only 36% (107) use max-age of 6 months or more; 71% (210) send no Content-Security-Policy, and 36 of the 84 CSPs only say upgrade-insecure-requests, so 16% (48) restrict scripts at all; 63% lack clickjacking protection (X-Frame-Options or frame-ancestors), 57% lack X-Content-Type-Options: nosniff, 77% lack Referrer-Policy. 39% (114) send none of the 5 basic headers; 8% (24) send all 5. 16% (48) of active sites do not redirect HTTP to HTTPS. 23% (67) disclose exact software versions; 12 disclose a PHP branch without security support (<8.2 per php.net). Method and fixes (Apache, Nginx, Cloudflare, Vercel): ${BASE}/blog/cabeceras-seguridad-web-pymes-mexico`,
  );


  h('Engineering notes (Spanish; English where marked en-US)');
  for (const n of getNotas()) L.push(`- ${n.date} · ${n.title}${n.lang === 'en' ? ' (en-US)' : ''}: ${n.description} ${BASE}/blog/${n.slug}`);

  h('Contact and profiles');
  L.push(`- LinkedIn (preferred for programs and talks): ${REDES.linkedin}`);
  L.push(`- GitHub: ${REDES.github}`);
  L.push(`- X: ${REDES.x}`);
  L.push(`- AWS Builder Center: ${REDES.builder}`);
  L.push(`- Personal site (with WhatsApp contact): ${REDES.web}`);
  L.push('');

  return new Response(L.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
