import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { DiagnosticoCabeceras } from '@/components/site/DiagnosticoCabeceras';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, ORG, ORG_DESC_ES, ORG_ID, PERSON } from '@/lib/entidad';
import { BASE_CABECERAS as B } from '@/lib/cabeceras';

/**
 * Área 02 · herramienta gratuita e indexable de 0 tokens (Ciro, Hito US-5).
 * Pareja ES/EN con hreflang recíproco: /verificador-cabeceras-seguridad ↔ /en/security-headers-checker.
 * Línea base pública = BASE_CABECERAS (medir_cabeceras_us.py, 586 sitios hispanos calificables, 28-nov-2026).
 */

type Lang = 'es' | 'en';

const ES_PATH = '/verificador-cabeceras-seguridad';
const EN_PATH = '/en/security-headers-checker';

const pctEs = (n: number) => `${n.toFixed(1)} %`;
const pctEn = (n: number) => `${n.toFixed(1)}%`;

const T = {
  es: {
    path: ES_PATH,
    title: 'Verificador de Cabeceras de Seguridad Web | Omona',
    desc: 'Revisa gratis HSTS, CSP, X-Frame-Options, nosniff, Referrer y Permissions-Policy de tu sitio: calificación A–F y cabeceras listas para copiar.',
    eyebrow: 'Herramienta gratuita · Área 02 · Lectura pasiva de tu portada · 0 tokens',
    h1: 'Verificador gratuito de cabeceras de seguridad HTTP.',
    sub: `Las cabeceras de seguridad le dicen al navegador cómo proteger a quien visita tu sitio: que solo use HTTPS, qué scripts puede ejecutar y que nadie meta tu página en un marco falso. Revisa las tuyas en dos segundos y compárate con ${B.n} negocios hispanos de EE. UU. que medimos: la mediana sacó ${B.mediana}/100 y solo ${pctEs(B.letras.A)} llegó a A.`,
    tableH: `Qué revisan los 8 controles y cómo salieron ${B.n} negocios hispanos`,
    tableSub: `Línea base: portadas públicas de miembros de las cámaras hispanas de Fort Worth (TX) y New Jersey, leídas el 28-nov-2026 con la misma especificación que usa esta herramienta (${B.leidos} sitios leídos; se excluyen los que no tienen HTTPS válido o respondieron con reto anti-bot).`,
    cols: ['Control', 'Qué revisa', 'Puntos', 'Lo pasan'],
    rows: [
      ['HTTPS + redirección', 'Que la portada cargue por HTTPS y que http:// mande a https://.', '10', pctEs(B.pasa.https)],
      ['HSTS', 'Strict-Transport-Security con max-age de seis meses o más.', '15', pctEs(B.pasa.hsts)],
      ['CSP', "Content-Security-Policy que restringe scripts, sin 'unsafe-inline', 'unsafe-eval' ni comodines.", '20', pctEs(B.pasa.csp)],
      ['Anti-clickjacking', "X-Frame-Options DENY/SAMEORIGIN o frame-ancestors en la CSP.", '15', pctEs(B.pasa.clickjacking)],
      ['nosniff', 'X-Content-Type-Options: nosniff.', '10', pctEs(B.pasa.xcto)],
      ['Referrer-Policy', 'Una política que no manda la URL completa a otros sitios.', '10', pctEs(B.pasa.referrer)],
      ['Permissions-Policy', 'Cámara, micrófono, ubicación y pagos cerrados salvo lo que uses.', '10', pctEs(B.pasa.permissions)],
      ['Sin versión', 'Que Server y X-Powered-By no anuncien versión (Apache/2.4, PHP/7.4).', '10', pctEs(B.pasa.version)],
    ],
    letrasH: 'Calificaciones de la muestra',
    letras: `A ${pctEs(B.letras.A)} · B ${pctEs(B.letras.B)} · C ${pctEs(B.letras.C)} · D ${pctEs(B.letras.D)} · F ${pctEs(B.letras.F)}. A = 90 o más, B = 75, C = 60, D = 40, F = menos de 40.`,
    cspH: 'Evaluador de CSP: los errores más comunes',
    cspP: `${pctEs(B.cspPresente)} de los sitios medidos manda alguna Content-Security-Policy, pero casi ninguna protege contra scripts inyectados: en ${pctEs(B.cspEnPresentes['sin-script-src'])} de esas políticas no hay script-src ni default-src (muchas solo traen upgrade-insecure-requests o frame-ancestors que pone el constructor del sitio), ${pctEs(B.cspEnPresentes['unsafe-inline'])} permite 'unsafe-inline' y ${pctEs(B.cspEnPresentes['unsafe-eval'])} permite 'unsafe-eval'. La herramienta te dice cuál de estos tiene la tuya.`,
    faqH: 'Preguntas frecuentes sobre cabeceras de seguridad',
    faqs: [
      ['¿Qué son las cabeceras de seguridad HTTP?', 'Son líneas que tu servidor manda junto con cada página (Strict-Transport-Security, Content-Security-Policy, X-Frame-Options y otras). No cambian cómo se ve tu sitio: le dicen al navegador qué bloquear. Se configuran una vez en el servidor, el hosting o el CDN.'],
      ['¿Cuál pongo primero?', 'Las que no rompen nada: HSTS (si todo tu sitio ya está en HTTPS), X-Content-Type-Options, X-Frame-Options y Referrer-Policy. La CSP va al final y en modo Report-Only primero, porque una política mal hecha puede bloquear tu chat, tu analítica o tu botón de pago.'],
      ['Mi sitio está en WordPress, Wix o GoDaddy, ¿cómo las agrego?', 'En hosting administrado casi nunca tocas el servidor. Lo más simple es poner Cloudflare gratis delante del sitio y agregar las cabeceras en Transform Rules → Modify Response Header. En WordPress con acceso a .htaccess, el entregable trae las líneas para Apache.'],
      ['¿Tiene que ver con mi seguro cibernético?', 'Sí. Las aseguradoras escanean tu dominio desde fuera antes de cotizar: HTTPS, redirección desde HTTP, HSTS y versiones anunciadas son de lo primero que ven. En nuestra lectura tipo aseguradora de 595 negocios hispanos, solo 17.3 % cumplió las 6 señales externas.'],
      ['¿Es seguro y legal correr esta revisión?', 'Es la misma lectura que hace cualquier navegador al abrir tu portada: un GET por HTTPS y otro por HTTP. No prueba rutas ocultas, no envía formularios y no intenta entrar. Si quieres revisar también correo y archivos expuestos, usa el verificador SPF/DMARC con tu autorización.'],
    ],
    fuentes: 'Fuentes: OWASP Secure Headers Project y la referencia de cabeceras HTTP de MDN.',
    linksLabel: 'Guías y áreas relacionadas:',
    links: [
      { href: '/seguridad', label: 'Área 02 · Ciberseguridad defensiva' },
      { href: '/verificador-dmarc-spf', label: 'Verificador SPF/DMARC' },
      { href: '/blog/seguro-cibernetico-pequenas-empresas', label: 'Seguro cibernético: requisitos (595 negocios)' },
      { href: '/blog/cabeceras-seguridad-web-pymes-mexico', label: 'Estudio de cabeceras en 304 sitios .mx' },
      { href: '/comercial-ia', label: 'Área 01 · Procesos comerciales + IA' },
      { href: EN_PATH, label: 'English version (US)' },
    ],
  },
  en: {
    path: EN_PATH,
    title: 'Free Security Headers Checker (A–F Grade) | Omona',
    desc: 'Free security headers check: HSTS, CSP, X-Frame-Options, nosniff, Referrer and Permissions-Policy graded A–F with copy-paste fixes.',
    eyebrow: 'Free tool · Area 02 · Passive homepage read · 0 LLM tokens',
    h1: 'Free HTTP security headers checker.',
    sub: `Security headers tell the browser how to protect your visitors: use HTTPS only, which scripts may run, and never let another site frame your page. Check yours in two seconds and compare with ${B.n} US Hispanic-owned businesses we measured: the median scored ${B.mediana}/100 and only ${pctEn(B.letras.A)} got an A.`,
    tableH: `What the 8 checks inspect, and how ${B.n} Hispanic businesses did`,
    tableSub: `Baseline: public homepages of member businesses of the Fort Worth (TX) and New Jersey Hispanic chambers, read on Nov 28, 2026 with the same scoring this tool runs (${B.leidos} sites read; sites without valid HTTPS or behind an anti-bot challenge are excluded).`,
    cols: ['Check', 'What it inspects', 'Points', 'Pass rate'],
    rows: [
      ['HTTPS + redirect', 'Homepage loads over HTTPS and http:// redirects to https://.', '10', pctEn(B.pasa.https)],
      ['HSTS', 'Strict-Transport-Security with a max-age of six months or more.', '15', pctEn(B.pasa.hsts)],
      ['CSP', "Content-Security-Policy that restricts scripts, without 'unsafe-inline', 'unsafe-eval' or wildcards.", '20', pctEn(B.pasa.csp)],
      ['Clickjacking', 'X-Frame-Options DENY/SAMEORIGIN or CSP frame-ancestors.', '15', pctEn(B.pasa.clickjacking)],
      ['nosniff', 'X-Content-Type-Options: nosniff.', '10', pctEn(B.pasa.xcto)],
      ['Referrer-Policy', 'A policy that does not send full URLs to other sites.', '10', pctEn(B.pasa.referrer)],
      ['Permissions-Policy', 'Camera, microphone, geolocation and payment closed unless used.', '10', pctEn(B.pasa.permissions)],
      ['No version', 'Server and X-Powered-By do not disclose versions (Apache/2.4, PHP/7.4).', '10', pctEn(B.pasa.version)],
    ],
    letrasH: 'Grades in the sample',
    letras: `A ${pctEn(B.letras.A)} · B ${pctEn(B.letras.B)} · C ${pctEn(B.letras.C)} · D ${pctEn(B.letras.D)} · F ${pctEn(B.letras.F)}. A = 90+, B = 75, C = 60, D = 40, F = under 40.`,
    cspH: 'CSP evaluator: the most common mistakes',
    cspP: `${pctEn(B.cspPresente)} of the sites we measured send some Content-Security-Policy, yet almost none protect against injected scripts: ${pctEn(B.cspEnPresentes['sin-script-src'])} of those policies have no script-src or default-src (many only carry upgrade-insecure-requests or a site builder's frame-ancestors), ${pctEn(B.cspEnPresentes['unsafe-inline'])} allow 'unsafe-inline' and ${pctEn(B.cspEnPresentes['unsafe-eval'])} allow 'unsafe-eval'. The tool tells you which of these yours has.`,
    faqH: 'Security headers FAQ',
    faqs: [
      ['What are HTTP security headers?', 'Lines your server sends with every page (Strict-Transport-Security, Content-Security-Policy, X-Frame-Options and others). They do not change how your site looks: they tell the browser what to block. You set them once at the server, host or CDN.'],
      ['Which one should I add first?', 'The ones that break nothing: HSTS (once the whole site is on HTTPS), X-Content-Type-Options, X-Frame-Options and Referrer-Policy. Add CSP last, in Report-Only mode first, because a bad policy can block your chat widget, analytics or pay button.'],
      ['My site runs on WordPress, Wix or GoDaddy. How do I add them?', 'On managed hosting you rarely touch the server. The simplest path is free Cloudflare in front of the site, then Transform Rules → Modify Response Header. On WordPress with .htaccess access, the deliverable includes the Apache lines.'],
      ['Does this affect my cyber insurance?', 'Yes. Insurers scan your domain from the outside before quoting: HTTPS, the HTTP redirect, HSTS and disclosed versions are among the first things they see. In our insurer-style read of 595 Hispanic-owned businesses, only 17.3% passed all 6 outside-in signals.'],
      ['Is it safe and legal to run this check?', 'It is the same read any browser does when it opens your homepage: one GET over HTTPS and one over HTTP. No hidden paths, no form submissions, no login attempts. To also check email and exposed files, use the SPF/DMARC checker with your authorization.'],
    ],
    fuentes: 'Sources: OWASP Secure Headers Project and the MDN HTTP headers reference.',
    linksLabel: 'Related guides & areas:',
    links: [
      { href: '/en/security', label: 'Area 02 · Defensive Cybersecurity' },
      { href: '/en/dmarc-spf-checker', label: 'SPF/DMARC checker' },
      { href: '/blog/cyber-insurance-small-business-checklist', label: 'Cyber insurance checklist (595 businesses)' },
      { href: '/blog/wire-fraud-ach-fraud-small-business', label: 'Wire fraud & ACH fraud playbook' },
      { href: '/en/commercial-ai', label: 'Area 01 · Bilingual Commercial AI' },
      { href: ES_PATH, label: 'Versión en español (EE. UU.)' },
    ],
  },
} as const;

export function verificadorCabecerasMetadata(lang: Lang): Metadata {
  const t = T[lang];
  const url = `${BASE}${t.path}`;
  return {
    title: { absolute: t.title },
    description: t.desc,
    alternates: {
      canonical: url,
      languages: {
        'es-US': `${BASE}${ES_PATH}`,
        'es-MX': `${BASE}${ES_PATH}`,
        'en-US': `${BASE}${EN_PATH}`,
        en: `${BASE}${EN_PATH}`,
        'x-default': `${BASE}${ES_PATH}`,
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

export function VerificadorCabecerasPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const en = lang === 'en';
  const url = `${BASE}${t.path}`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      en ? ORG : { ...ORG, description: ORG_DESC_ES },
      PERSON,
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: t.title,
        description: t.desc,
        inLanguage: en ? 'en-US' : 'es-US',
        isPartOf: { '@id': `${BASE}/#website` },
        publisher: { '@id': ORG_ID },
        mainEntity: { '@id': `${url}#app` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: en ? 'Security Headers Checker' : 'Verificador de cabeceras de seguridad HTTP',
        url,
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        inLanguage: en ? 'en-US' : 'es-US',
        areaServed: ['US'],
        audience: { '@type': 'BusinessAudience', name: en ? 'Hispanic-owned and bilingual small businesses in the United States' : 'Negocios latinos e hispanos en Estados Unidos' },
        publisher: { '@id': ORG_ID },
      },
    ],
  };

  const link = 'underline decoration-hair underline-offset-4 hover:decoration-obsidian';

  return (
    <div lang={en ? 'en-US' : 'es-US'} className="md min-h-screen bg-paper text-obsidian">
      <JsonLd data={graph} />
      <LandingNav lang={en ? 'en' : undefined} />
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

        <section className="py-4 sm:py-6">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <DiagnosticoCabeceras lang={lang} />
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="tabla-cabeceras">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="tabla-cabeceras" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
              {t.tableH}
            </h2>
            <p className="mt-2 max-w-[72ch] text-[14px] leading-[1.5] text-stone">{t.tableSub}</p>
            <div className="mt-6 overflow-x-auto border-y border-hair">
              <table className="w-full min-w-[620px] border-collapse text-left text-[14px] tabular-nums">
                <thead>
                  <tr className="border-b border-hair text-graphite">
                    <th className="py-3 pr-6 font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[0]}</th>
                    <th className="py-3 pr-6 font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[1]}</th>
                    <th className="py-3 pr-6 text-right font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[2]}</th>
                    <th className="py-3 text-right font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[3]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hair">
                  {t.rows.map(([ctrl, det, pts, pct]) => (
                    <tr key={ctrl}>
                      <td className="whitespace-nowrap py-3.5 pr-6 align-top font-medium text-obsidian">{ctrl}</td>
                      <td className="py-3.5 pr-6 align-top leading-[1.5] text-charcoal">{det}</td>
                      <td className="py-3.5 pr-6 text-right align-top font-mono text-stone">{pts}</td>
                      <td className="py-3.5 text-right align-top font-mono text-obsidian">{pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[14px] leading-[1.5] text-charcoal">
              <span className="mono-label mr-2 text-graphite">{t.letrasH}</span>
              {t.letras}
            </p>
          </div>
        </section>

        <section className="py-8 sm:py-10" aria-labelledby="evaluador-csp">
          <div className="mx-auto w-full max-w-[1080px] border-t border-hair px-6 pt-8 lg:px-12">
            <h2 id="evaluador-csp" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
              {t.cspH}
            </h2>
            <p className="mt-3 max-w-[72ch] text-pretty text-[15px] leading-[1.58] text-charcoal">{t.cspP}</p>
          </div>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="faq-cabeceras">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="faq-cabeceras" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
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
            <p className="mt-4 text-[13px] leading-[1.5] text-stone">
              {t.fuentes}{' '}
              <a href="https://owasp.org/www-project-secure-headers/" rel="noopener noreferrer" className={link}>
                OWASP
              </a>{' '}
              ·{' '}
              <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers" rel="noopener noreferrer" className={link}>
                MDN
              </a>
            </p>

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
