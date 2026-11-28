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
    `> ${NOMBRE} (${NOMBRE_LEGAL}) builds bilingual (Spanish + English) commercial AI agents and defensive cybersecurity architectures for Hispanic-owned and bilingual small businesses in the United States (+5M Hispanic-owned US businesses: construction/contractors, tax preparers & accounting firms under FTC Safeguards Rule / IRS WISP, trucking, clinics, and B2B services). Omona (omona.tech) also hosts his open-source engineering lab (upstream pull requests, issue reports, and technical notes on AWS Bedrock, Strands Agents, and Hermes Agent).`,
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
  L.push(`- [Knowledge base](${BASE}/en/knowledge): who he is and how he works, one line per topic with expandable detail (commercial processes + AI, defensive cybersecurity, visibility on Google/ChatGPT/Claude/Gemini with an agent, agent system, second brain, open source, stack). Spanish: ${BASE}/conocimiento`);
  L.push(`- [Now](${BASE}/now): daily log, Spanish. RSS: ${BASE}/now/rss.xml`);
  L.push(`- [Open source](${BASE}/en/open-source): PRs and issues with live status. Spanish: ${BASE}/open-source`);
  L.push(`- [Blog](${BASE}/blog): engineering notes, Spanish. RSS: ${BASE}/blog/rss.xml`);
  L.push(`- [Bilingual Commercial AI Agents for US Hispanic Businesses](${BASE}/en/commercial-ai): end-to-end bilingual (Spanish + English) commercial funnels with AI agents on WhatsApp, SMS, web and CRM (sub-minute response, deterministic pricing guardrails in code, context-rich human handoff, and multi-agent hierarchies on AWS Bedrock) for Hispanic-owned and bilingual SMBs in the United States outside education. Spanish (es-US): ${BASE}/comercial-ia`);
  L.push(`- [Cybersecurity for US Hispanic Businesses & AI Agents](${BASE}/en/security): defensive-only security reviews for bilingual US small businesses and AI-agent deployments (BEC/ACH wire fraud & email anti-spoofing SPF/DKIM/DMARC, Google Workspace & Microsoft 365 hardening, FTC Safeguards Rule & IRS Pub 4557 WISP controls, US cyber insurance readiness, AWS Bedrock IAM & MCP security), provided by a formally incorporated Mexican legal entity under the Omona brand, with ${NOMBRE_LEGAL} as the responsible person. Spanish (es-US): ${BASE}/seguridad`);
  L.push(`- [Visibility on Google and in AI assistants](${BASE}/#posicionamiento): visibility on Google and in AI assistants (ChatGPT, Claude, Gemini), a product run with an agent; contact victor@omona.tech. Spanish (es-US).`);
  L.push(`- [Free Speed-to-Lead & Bilingual Website Checker](${BASE}/en/speed-to-lead-checker): zero-token passive homepage reader (one GET, no forms submitted) with 7 checks: instant text channel (chat, SMS, WhatsApp), prefilled WhatsApp/SMS message, click-to-call, contact form, online booking, bilingual Spanish + English site and es/en hreflang; each check is benchmarked against 593 US Hispanic chamber member websites measured 2026-11-26 (11.3% instant text, 0.7% prefilled WhatsApp, 42.2% click-to-call, 45.4% form, 4.7% booking, 25.5% bilingual, 6.4% hreflang) and returns a downloadable .md action plan. Spanish (es-US): ${BASE}/verificador-embudo-bilingue`);
  L.push(`- [Free Passive SPF, DMARC & Domain Security Checker](${BASE}/en/dmarc-spf-checker): zero-token read-only DNS & HTTP posture scanner (SPF, DMARC, CAA, TLS/HSTS, CSP, security.txt) to prevent BEC wire/ACH invoice spoofing and verify US cyber insurance & FTC Safeguards hygiene. Spanish (es-US / es-MX): ${BASE}/verificador-dmarc-spf`);
  L.push(`- [Free AI Visibility Checker: Google and AI assistants](${BASE}/en/ai-visibility-checker): zero-token passive read (at most 4 GETs: homepage, robots.txt, llms.txt, sitemap.xml) with 10 weighted checks: indexable homepage, Googlebot and 8 AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended) not blocked in robots.txt, sitemap, llms.txt, title, meta description, single H1, JSON-LD and server-rendered text; returns a Google result preview and a downloadable .md fix list. Spanish (es-US / es-MX): ${BASE}/verificador-visibilidad-ia`);
  L.push(`- [Pillar Guide: Cybersecurity & Bilingual AI for Latino Businesses in the United States](${BASE}/blog/ciberseguridad-negocios-latinos-estados-unidos): practical Spanish guide for US Hispanic business owners covering FBI IC3 BEC/ACH wire transfer fraud prevention, FTC Safeguards Rule (16 CFR Part 314) & IRS WISP for tax preparers/bookkeepers, US cyber insurance underwriting requirements, and secure bilingual AI agents on AWS Bedrock. Spanish (es-US).`);
  L.push(`- [Original data + guide: IRS WISP & FTC Safeguards Rule for tax preparers](${BASE}/blog/irs-wisp-ftc-safeguards-tax-preparers): passive DNS measurement (2026-11-26) of 604 email domains published by members of two US Hispanic chambers of commerce (Fort Worth TX, New Jersey); 62.7% can be spoofed (28.3% no DMARC, 34.4% p=none), only 18.9% enforce p=reject; plus the 9 FTC Safeguards Rule (16 CFR 314.4) controls, the <5,000-consumer exemption scope, the 500-consumer/30-day FTC notice and a 7-day WISP plan from IRS Pub 5708. English (en-US). Spanish (es-US): ${BASE}/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos`);
  L.push(`- [Original data + guide: wire fraud & ACH fraud for small businesses](${BASE}/blog/wire-fraud-ach-fraud-small-business): passive DNS measurement (2026-11-26) of the mail provider behind 604 US Hispanic chamber member domains: Google Workspace domains are 84.9% spoofable (only 3.8% p=reject, 39.6% DKIM on the default selector) vs Microsoft 365 48.4% and filtering gateways 25.0%; payment-heavy sectors (construction, transportation, real estate, wholesale) 65.9% spoofable; plus FBI IC3 2025 BEC losses ($3.05B, 24,768 complaints; 58% frozen by the Recovery Asset Team), the 2026 Nacha fraud-monitoring rules (Phase 2 June 19, 2026: every non-consumer ACH originator) and a 7-step callback / dual-approval / Positive Pay playbook. English (en-US). Spanish (es-US): ${BASE}/blog/fraude-ach-wire-facturas-falsas-contratistas`);
  L.push(`- [Original data + guide: cyber insurance checklist for small business](${BASE}/blog/cyber-insurance-small-business-checklist): outside-in read (2026-11-26) of 595 US Hispanic chamber member businesses with email and an active website, on the 6 signals an insurer's external scan sees (valid SPF, enforced DMARC, valid HTTPS, HTTP→HTTPS, HSTS, no version banner): only 17.3% pass all six, 63.4% do not enforce DMARC, 46.1% lack HSTS; construction 8.7%, Google Workspace 7.6%, Microsoft 365 22.7%, filtering gateways 39.1%; plus the NAIC 2026 market report (2025: $9.46B premium, 5.84M policies, 56,323 claims, loss ratio 53; standard cyber policies frequently exclude or sharply limit social engineering / funds transfer fraud), the 12 controls behind applications (MFA, EDR, immutable backups, RDP) and a 7-day pre-renewal plan. English (en-US). Spanish (es-US): ${BASE}/blog/seguro-cibernetico-pequenas-empresas`);
  L.push(`- [Original data + guide: bilingual answering service with AI for US small businesses](${BASE}/blog/bilingual-answering-service-ai-small-business): passive homepage measurement (2026-11-26) of 593 active member websites of two US Hispanic chambers of commerce (Fort Worth TX, New Jersey); only 11.3% offer an instant text channel (chat 7.1%, SMS 2.5%, WhatsApp 2.2%), 35.4% rely on the phone as the only fast channel, 25.6% show no contact channel in the homepage HTML, 25.5% offer both Spanish and English, and just 3.5% are both bilingual and instant; plus a human vs AI vs hybrid comparison, code-level guardrails (no invented prices, TCPA consent, A2P 10DLC) and a 7-day plan. English (en-US). Spanish (es-US): ${BASE}/blog/recepcionista-bilingue-ia-negocios-latinos`);
  L.push(`- [Original data + guide: AI-to-human handoff and price guardrails for sales](${BASE}/blog/ai-to-human-handoff-sales-guardrails): passive homepage measurement (2026-11-28) of 558 US Hispanic chamber member websites: 83.3% publish no public price source (no sales price, no pricing page), 16.8% ask for a custom quote (38.0% in construction), 75.0% of sites with chat/SMS/WhatsApp have no public price; runnable price guard in code and a warm handoff packet. English; Spanish pair: ${BASE}/blog/traspaso-ia-a-vendedor-humano-candados-precios.`);
  L.push(`- [Original data: commercial digital readiness in Mexico](${BASE}/blog/procesos-comerciales-ia-whatsapp-arquitectura): passive homepage measurement (2026-11-25) of 255 active business .mx websites; 77.3% lack any immediate response channel on their homepage, 20.0% link to WhatsApp and 64.7% of those open blank without prefilled context. Spanish.`);
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
  L.push('## Engineering notes (Spanish; English where marked en-US)', '');
  for (const n of getNotas()) L.push(`- [${n.title}](${BASE}/blog/${n.slug})${n.lang === 'en' ? ' (en-US)' : ''}: ${n.description}`);
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
