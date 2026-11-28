import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { DiagnosticoSaaS } from '@/components/site/DiagnosticoSaaS';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, ORG, ORG_DESC_ES, ORG_ID, PERSON } from '@/lib/entidad';

type Lang = 'es' | 'en';

const T = {
  es: {
    path: '/verificador-dmarc-spf',
    title: 'Verificador SPF, DMARC y Seguridad Web Gratis | Omona',
    desc: 'Revisa gratis en 2 segundos los registros SPF, DMARC, cabeceras HTTP y TLS de tu dominio para frenar facturas falsas (BEC) y brechas web.',
    eyebrow: 'Herramienta gratuita · Lectura pasiva DNS y HTTP · 0 tokens',
    h1: 'Verificador gratuito de SPF, DMARC y seguridad web para tu dominio.',
    sub: 'Comprueba en dos segundos si terceros pueden enviar facturas falsas o cambios de cuenta ACH/SPEI usando tu dominio (@tuempresa.com), si tienes registros SPF duplicados y si tu sitio cumple las cabeceras que exigen aseguradoras cyber y FTC Safeguards.',
    tableH: 'Qué revisan los 9 controles pasivos (sin tocar tus servidores)',
    cols: ['Control', 'Qué detecta', 'Qué significa para tu negocio'],
    rows: [
      ['SPF (TXT)', 'Servidores autorizados y error común de múltiples registros SPF (permerror).', 'Evita que correos legítimos caigan en spam o que servidores ajenos envíen a tu nombre.'],
      ['DMARC (_dmarc)', 'Política activa: inexistente, p=none (solo observa), p=quarantine o p=reject.', 'En nuestros 285 dominios .mx medidos, 66 % permiten suplantación por no llegar a p=reject.'],
      ['CAA en DNS', 'Autoridades certificadoras autorizadas para emitir certificados TLS.', 'Impide que terceros emitan certificados HTTPS válidos para subdominios tuyos.'],
      ['HTTPS y TLS', 'Redirección limpia desde HTTP y vigencia del certificado.', 'Base mínima para formularios de contacto, portales de clientes y pasarelas de pago.'],
      ['HSTS', 'Cabecera Strict-Transport-Security activa en respuestas HTTPS.', 'Evita degradación a HTTP en redes Wi-Fi abiertas (60 % de sitios .mx medidos carecen de ella).'],
      ['CSP', 'Content-Security-Policy declarada contra inyección de scripts.', 'Reduce robo de sesiones y alteración de formularios de captura (71 % de sitios .mx sin CSP).'],
      ['Anti-framing y MIME', 'X-Frame-Options / frame-ancestors y X-Content-Type-Options: nosniff.', 'Bloquea clickjacking sobre botones de pago o WhatsApp y ejecución accidental de archivos.'],
      ['Archivos expuestos', 'Comprobación no intrusiva de rutas públicas accidentales.', 'Verifica que credenciales o respaldos no respondan públicamente con HTTP 200.'],
      ['Gobernanza y contacto', 'Presencia de /.well-known/security.txt y /llms.txt.', 'Canal formal de reporte de seguridad y contexto verificable para buscadores de IA.'],
    ],
    faqH: 'Errores frecuentes al revisar SPF y DMARC',
    faqs: [
      ['¿Por qué falla tener dos registros SPF?', 'El estándar RFC 7208 exige un único registro TXT que inicie con v=spf1. Cuando conectas Google Workspace o Microsoft 365 junto a un CRM o facturador y creas dos líneas v=spf1 separadas, los receptores devuelven permerror y dejan tu dominio desprotegido. Unifícalos en un solo registro con mecanismos include:.'],
      ['¿Por qué p=none en DMARC NO frena facturas falsas?', 'p=none solo envía reportes de monitoreo: los bancos, clientes y proveedores siguen recibiendo en bandeja de entrada cualquier correo falsificado con tu dominio. Para bloquear el desvío de transferencias ACH, wire o SPEI hay que avanzar gradualmente a p=quarantine y p=reject tras validar DKIM y SPF.'],
      ['¿Qué relación tiene esto con tus agentes comerciales en WhatsApp y CRM?', 'Cuando automatizas cotizaciones y seguimiento comercial, el correo y el dominio son la raíz de identidad de tu empresa. Blindar SPF/DMARC y cabeceras web cierra la puerta a suplantación mientras tus agentes atienden prospectos en menos de 60 segundos.'],
    ],
    linksLabel: 'Guías y áreas relacionadas:',
    links: [
      { href: '/seguridad', label: 'Área 02 · Ciberseguridad defensiva' },
      { href: '/comercial-ia', label: 'Área 01 · Procesos comerciales + IA' },
      { href: '/blog/dmarc-spf-facturas-falsas-pymes', label: 'Estudio DMARC/SPF (285 dominios)' },
      { href: '/blog/ciberseguridad-negocios-latinos-estados-unidos', label: 'Guía negocios latinos en EE. UU.' },
      { href: '/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos', label: 'Plan WISP del IRS (604 dominios hispanos)' },
      { href: '/blog/fraude-ach-wire-facturas-falsas-contratistas', label: 'Fraude ACH y wire: facturas y W-9 falsos' },
      { href: '/blog/seguro-cibernetico-pequenas-empresas', label: 'Seguro cibernético: requisitos y solicitud' },
      { href: '/verificador-cabeceras-seguridad', label: 'Verificador de cabeceras de seguridad (A–F)' },
    ],
  },
  en: {
    path: '/en/dmarc-spf-checker',
    title: 'Free SPF, DMARC & Domain Security Checker | Omona',
    desc: 'Check your domain SPF, DMARC, TLS and HTTP security headers in 2 seconds to stop BEC wire/invoice spoofing and meet FTC & cyber insurance basics.',
    eyebrow: 'Free diagnostic tool · Passive DNS & HTTP read · 0 LLM tokens',
    h1: 'Free SPF, DMARC, and domain security posture checker.',
    sub: 'Verify in two seconds whether attackers can spoof your company domain (@yourcompany.com) for BEC wire/ACH invoice fraud, whether multiple SPF records break delivery, and whether your website sends the baseline headers expected by US cyber insurers and FTC Safeguards.',
    tableH: 'What the 9 passive checks inspect (zero intrusive traffic)',
    cols: ['Check', 'What it inspects', 'Business impact'],
    rows: [
      ['SPF (TXT)', 'Authorized sending hosts and duplicate v=spf1 records (RFC 7208 permerror).', 'Prevents legitimate invoices from landing in spam and blocks unauthorized mail servers.'],
      ['DMARC (_dmarc)', 'Active policy: missing, p=none (monitoring only), p=quarantine, or p=reject.', 'Only p=quarantine and p=reject instruct receiving servers to block spoofed wire/ACH emails.'],
      ['DNS CAA', 'Certificate Authorities allowed to issue TLS certificates for your domain.', 'Prevents unauthorized TLS certificate issuance across subdomains.'],
      ['HTTPS & TLS', 'Clean HTTP-to-HTTPS redirect and active certificate validity.', 'Baseline requirement for lead forms, client portals, and cyber insurance questionnaires.'],
      ['HSTS', 'Strict-Transport-Security header on HTTPS responses.', 'Stops protocol downgrade attacks on public or job-site Wi-Fi networks.'],
      ['CSP', 'Content-Security-Policy header against cross-site script injection.', 'Protects lead-capture and intake forms from third-party script tampering.'],
      ['Frame & MIME locks', 'X-Frame-Options / frame-ancestors and X-Content-Type-Options: nosniff.', 'Prevents clickjacking overlays and MIME-sniffing execution risks.'],
      ['Accidental exposure', 'Non-intrusive check that common config paths are not publicly served.', 'Confirms environment or metadata files are not exposed on the public root.'],
      ['Security & AI files', 'Presence of /.well-known/security.txt and /llms.txt.', 'Establishes a clear security contact and structured context for AI answer engines.'],
    ],
    faqH: 'Common SPF & DMARC pitfalls in small businesses',
    faqs: [
      ['Why do multiple SPF records fail?', 'RFC 7208 allows only one TXT record starting with v=spf1 per domain. Adding a second v=spf1 record for a CRM, payroll, or invoicing tool triggers an SPF permerror. Merge every authorized sender into one record using include: mechanisms and stay under the 10-DNS-lookup limit.'],
      ['Why does DMARC p=none still allow wire/ACH invoice spoofing?', 'A p=none policy only collects XML reports—receiving mail servers still deliver spoofed emails straight to your customer’s inbox. Stopping Business Email Compromise (BEC) requires aligning DKIM/SPF for your real senders and moving to p=quarantine and p=reject.'],
      ['How does domain security connect to bilingual AI sales agents?', 'Before connecting AI agents to WhatsApp, SMS, web chat, and your CRM, locking down your domain identity ensures customers can trust quotes and payment instructions while deterministic code guardrails keep agents accurate.'],
    ],
    linksLabel: 'Related areas & guides:',
    links: [
      { href: '/en/security', label: 'Area 02 · Defensive Cybersecurity' },
      { href: '/en/commercial-ai', label: 'Area 01 · Bilingual Commercial AI' },
      { href: '/verificador-dmarc-spf', label: 'Versión en español (ES)' },
      { href: '/blog/ciberseguridad-negocios-latinos-estados-unidos', label: 'US Hispanic SMB Guide (ES)' },
      { href: '/blog/irs-wisp-ftc-safeguards-tax-preparers', label: 'IRS WISP guide + data on 604 Hispanic domains' },
      { href: '/blog/wire-fraud-ach-fraud-small-business', label: 'Wire fraud & ACH fraud playbook' },
      { href: '/blog/cyber-insurance-small-business-checklist', label: 'Cyber insurance checklist (595 businesses)' },
      { href: '/en/security-headers-checker', label: 'Security headers checker (A–F grade)' },
    ],
  },
} as const;

export function verificadorMetadata(lang: Lang): Metadata {
  const t = T[lang];
  const url = `${BASE}${t.path}`;
  return {
    title: { absolute: t.title },
    description: t.desc,
    alternates: {
      canonical: url,
      languages: {
        'es-US': `${BASE}/verificador-dmarc-spf`,
        'es-MX': `${BASE}/verificador-dmarc-spf`,
        'en-US': `${BASE}/en/dmarc-spf-checker`,
        en: `${BASE}/en/dmarc-spf-checker`,
        'x-default': `${BASE}/verificador-dmarc-spf`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.desc,
      url,
      type: 'website',
      siteName: 'Omona',
      locale: lang === 'es' ? 'es_US' : 'en_US',
      alternateLocale: lang === 'es' ? ['es_MX', 'en_US'] : ['es_US', 'es_MX'],
    },
    twitter: { card: 'summary_large_image', title: t.title, description: t.desc },
  };
}

export function VerificadorDominioPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const url = `${BASE}${t.path}`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      lang === 'es' ? { ...ORG, description: ORG_DESC_ES } : ORG,
      PERSON,
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: t.title,
        description: t.desc,
        inLanguage: lang === 'es' ? 'es-US' : 'en-US',
        isPartOf: { '@id': `${BASE}/#website` },
        publisher: { '@id': ORG_ID },
      },
    ],
  };

  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <JsonLd data={graph} />
      <LandingNav lang={lang === 'en' ? 'en' : undefined} />
      <main>
        <section className="pt-14 pb-8 sm:pt-20 sm:pb-10">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <p className="eyebrow eyebrow-muted">{t.eyebrow}</p>
            <h1 className="mt-3 max-w-[26ch] text-balance text-[32px] font-semibold leading-[1.08] tracking-[-0.035em] text-obsidian sm:text-[44px]">
              {t.h1}
            </h1>
            <p className="mt-4 max-w-[68ch] text-pretty text-[16px] leading-[1.58] text-charcoal">{t.sub}</p>
          </div>
        </section>

        <section className="py-4 sm:py-6" id="diagnostico">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <DiagnosticoSaaS lang={lang} />
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="tabla-controles">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="tabla-controles" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
              {t.tableH}
            </h2>
            <div className="mt-6 overflow-x-auto border-y border-hair">
              <table className="w-full min-w-[620px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-hair text-graphite">
                    <th className="py-3 pr-6 font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[0]}</th>
                    <th className="py-3 pr-6 font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[1]}</th>
                    <th className="py-3 font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[2]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hair">
                  {t.rows.map(([ctrl, det, imp]) => (
                    <tr key={ctrl}>
                      <td className="py-3.5 pr-6 align-top font-medium text-obsidian whitespace-nowrap">{ctrl}</td>
                      <td className="py-3.5 pr-6 align-top leading-[1.5] text-charcoal">{det}</td>
                      <td className="py-3.5 align-top leading-[1.5] text-stone">{imp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="guia-errores">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="guia-errores" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
              {t.faqH}
            </h2>
            <dl className="mt-6 divide-y divide-hair border-y border-hair">
              {t.faqs.map(([q, a]) => (
                <div key={q} className="grid gap-2 py-5 sm:grid-cols-[280px_minmax(0,1fr)] sm:gap-8">
                  <dt className="text-[15px] font-medium leading-[1.4] text-obsidian">{q}</dt>
                  <dd className="text-pretty text-[15px] leading-[1.58] text-charcoal">{a}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-stone">
              <span className="mono-label text-graphite">{t.linksLabel}</span>
              {t.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-obsidian underline decoration-hair underline-offset-4 transition-colors hover:decoration-obsidian"
                >
                  {l.label} →
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  );
}
