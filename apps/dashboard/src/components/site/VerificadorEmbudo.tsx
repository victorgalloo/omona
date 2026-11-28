import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { DiagnosticoEmbudo } from '@/components/site/DiagnosticoEmbudo';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, ORG, ORG_DESC_ES, ORG_ID, PERSON } from '@/lib/entidad';

/**
 * Área 01 · herramienta gratuita e indexable de 0 tokens (Darío, Hito 3 del plan comercial).
 * Pareja ES/EN con hreflang recíproco: /verificador-embudo-bilingue ↔ /en/speed-to-lead-checker.
 * Línea base pública = agregados de medicion_embudo_us_hispanos.json (593 portadas, 26-nov-2026).
 */

type Lang = 'es' | 'en';

const ES_PATH = '/verificador-embudo-bilingue';
const EN_PATH = '/en/speed-to-lead-checker';

const T = {
  es: {
    path: ES_PATH,
    title: 'Verificador de Respuesta Rápida y Web Bilingüe | Omona',
    desc: 'Revisa gratis en 2 segundos si tu sitio contesta por texto al instante, tiene botón para llamar, agenda y versión en español e inglés.',
    eyebrow: 'Herramienta gratuita · Área 01 · Lectura pasiva de tu portada · 0 tokens',
    h1: 'Verificador gratuito de respuesta rápida y sitio bilingüe.',
    sub: 'En Estados Unidos el contrato se lo lleva quien contesta primero. Revisa si tu sitio deja que un cliente te escriba por texto al instante, te llame con un toque, aparte cita y te lea en español y en inglés, y compárate con 593 negocios hispanos que medimos.',
    tableH: 'Qué revisan los 7 controles y cómo salieron 593 negocios hispanos',
    tableSub: 'Línea base: portadas públicas de miembros de las cámaras hispanas de Fort Worth (TX) y New Jersey, leídas el 26-nov-2026 con el mismo código que usa esta herramienta.',
    cols: ['Control', 'Qué detecta', 'Lo cumplen'],
    rows: [
      ['Texto inmediato', 'Widget de chat, enlace sms: o enlace de WhatsApp en la portada.', '11.3 %'],
      ['Mensaje precargado', 'Que el enlace de WhatsApp o SMS abra con texto (?text= / ?body=) y no en blanco.', '0.7 %'],
      ['Botón para llamar', 'Enlace tel: que en celular marca con un toque.', '42.2 %'],
      ['Formulario', 'Formulario de contacto o cotización (incluye constructores embebidos).', '45.4 %'],
      ['Agenda en línea', 'Calendly, Square, Jobber, Housecall Pro, agenda del CRM y similares.', '4.7 %'],
      ['Sitio bilingüe', 'hreflang, selector de idioma, plugin de traducción o texto en los dos idiomas.', '25.5 %'],
      ['hreflang es + en', 'Etiquetas que le dicen a Google qué versión mostrar en cada idioma.', '6.4 %'],
    ],
    faqH: 'Preguntas frecuentes sobre respuesta rápida',
    faqs: [
      ['¿Qué es «speed to lead» y por qué importa tanto?', 'Es el tiempo entre que un cliente pide información y alguien le contesta. Harvard Business Review auditó 2,241 empresas de EE. UU.: el promedio tardó 42 horas, y quienes contestaron en menos de una hora tuvieron casi 7 veces más probabilidad de calificar al prospecto que quienes tardaron una hora más (y más de 60 veces que quienes tardaron 24 horas).'],
      ['¿Por qué un canal de texto y no solo el teléfono?', 'En nuestra medición, 35.4 % de los negocios hispanos tiene el teléfono como único canal rápido. Si estás en obra, en ruta o con otro cliente, esa llamada se pierde. Un SMS o WhatsApp se contesta en segundos, aunque sea con un agente que solo confirma datos y agenda.'],
      ['¿Qué es «missed call text back»?', 'Es mandar un SMS automático en segundos a cada llamada que no contestaste («Hola, soy de <negocio>, ¿en qué te ayudo?»). Necesita el número registrado en A2P 10DLC y el consentimiento del cliente (TCPA). La herramienta no puede verlo desde tu portada: revísalo tú con una llamada de prueba.'],
      ['¿La IA va a inventar precios?', 'No si los candados están en código: el agente solo cotiza lo que está en tu lista autorizada y todo lo demás pasa a una persona con un resumen del caso. Así lo construimos en el Área 01 de Omona.'],
    ],
    linksLabel: 'Guías y áreas relacionadas:',
    links: [
      { href: '/comercial-ia', label: 'Área 01 · Procesos comerciales + IA' },
      { href: '/blog/recepcionista-bilingue-ia-negocios-latinos', label: 'Recepcionista bilingüe con IA (593 sitios)' },
      { href: '/blog/traspaso-ia-a-vendedor-humano-candados-precios', label: 'Traspaso a humano sin inventar precios' },
      { href: '/blog/procesos-comerciales-ia-whatsapp-arquitectura', label: 'Arquitectura comercial con IA' },
      { href: EN_PATH, label: 'English version (US)' },
      { href: '/verificador-dmarc-spf', label: 'Área 02 · Verificador SPF/DMARC' },
    ],
  },
  en: {
    path: EN_PATH,
    title: 'Free Speed-to-Lead Website Checker | Omona',
    desc: 'Free speed-to-lead check: see in 2 seconds if your site offers instant text, click-to-call, booking and Spanish + English. Benchmarked on 593 US sites.',
    eyebrow: 'Free tool · Area 01 · Passive homepage read · 0 LLM tokens',
    h1: 'Free speed-to-lead and bilingual website checker.',
    sub: 'In the US, the job goes to whoever answers first. Check whether your website lets a customer text you instantly, call with one tap, book a visit and read you in Spanish and English, and compare yourself with 593 Hispanic-owned businesses we measured.',
    tableH: 'What the 7 checks inspect, and how 593 Hispanic businesses did',
    tableSub: 'Baseline: public homepages of member businesses of the Fort Worth (TX) and New Jersey Hispanic chambers, read on Nov 26, 2026 with the same code this tool runs.',
    cols: ['Check', 'What it detects', 'Pass rate'],
    rows: [
      ['Instant text', 'Chat widget, sms: link or WhatsApp link on the homepage.', '11.3%'],
      ['Prefilled message', 'WhatsApp or SMS link that opens with text (?text= / ?body=), not blank.', '0.7%'],
      ['Click-to-call', 'tel: link that dials with one tap on mobile.', '42.2%'],
      ['Contact form', 'Contact or quote form (embedded form builders included).', '45.4%'],
      ['Online booking', 'Calendly, Square, Jobber, Housecall Pro, CRM booking widgets and similar.', '4.7%'],
      ['Bilingual site', 'hreflang, language switcher, translation plugin or copy in both languages.', '25.5%'],
      ['hreflang es + en', 'Tags that tell Google which version to show in each language.', '6.4%'],
    ],
    faqH: 'Speed-to-lead FAQ',
    faqs: [
      ['What is speed to lead and why does it matter?', 'It is the time between a customer asking for information and someone answering. Harvard Business Review audited 2,241 US companies: the average response took 42 hours, and firms that answered within an hour were nearly 7 times as likely to qualify the lead as those that waited one more hour (and more than 60 times as likely as those that waited 24 hours).'],
      ['Why a text channel and not just the phone?', 'In our benchmark, 35.4% of Hispanic-owned businesses rely on the phone as their only fast channel. When you are on a job site, on the road or with another customer, that call is lost. An SMS or WhatsApp can be answered in seconds, even by an agent that only confirms details and books the visit.'],
      ['What is missed call text back?', 'An automatic SMS sent within seconds to every call you could not pick up ("Hi, this is <business>, how can we help?"). It needs an A2P 10DLC-registered number and customer consent under the TCPA. This tool cannot see it from your homepage: test it with a call of your own.'],
      ['Will AI make up prices?', 'Not when the guardrails live in code: the agent only quotes what is on your approved price list, and everything else goes to a person with a case summary. That is how Omona builds Area 01.'],
    ],
    linksLabel: 'Related guides & areas:',
    links: [
      { href: '/en/commercial-ai', label: 'Area 01 · Bilingual Commercial AI' },
      { href: '/blog/bilingual-answering-service-ai-small-business', label: 'Bilingual answering service guide (593 sites)' },
      { href: '/blog/ai-to-human-handoff-sales-guardrails', label: 'AI-to-human handoff without invented prices' },
      { href: ES_PATH, label: 'Versión en español (EE. UU.)' },
      { href: '/en/dmarc-spf-checker', label: 'Area 02 · SPF/DMARC checker' },
    ],
  },
} as const;

export function verificadorEmbudoMetadata(lang: Lang): Metadata {
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

export function VerificadorEmbudoPage({ lang }: { lang: Lang }) {
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
        name: en ? 'Speed-to-Lead & Bilingual Website Checker' : 'Verificador de respuesta rápida y sitio bilingüe',
        url,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        inLanguage: en ? 'en-US' : 'es-US',
        areaServed: ['US'],
        audience: { '@type': 'BusinessAudience', name: en ? 'Hispanic-owned and bilingual small businesses in the United States' : 'Negocios latinos e hispanos en Estados Unidos' },
        publisher: { '@id': ORG_ID },
      },
    ],
  };

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
            <DiagnosticoEmbudo lang={lang} />
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="tabla-embudo">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="tabla-embudo" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
              {t.tableH}
            </h2>
            <p className="mt-2 max-w-[72ch] text-[14px] leading-[1.5] text-stone">{t.tableSub}</p>
            <div className="mt-6 overflow-x-auto border-y border-hair">
              <table className="w-full min-w-[560px] border-collapse text-left text-[14px] tabular-nums">
                <thead>
                  <tr className="border-b border-hair text-graphite">
                    <th className="py-3 pr-6 font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[0]}</th>
                    <th className="py-3 pr-6 font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[1]}</th>
                    <th className="py-3 text-right font-mono text-[12px] uppercase tracking-[0.06em]">{t.cols[2]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hair">
                  {t.rows.map(([ctrl, det, pct]) => (
                    <tr key={ctrl}>
                      <td className="whitespace-nowrap py-3.5 pr-6 align-top font-medium text-obsidian">{ctrl}</td>
                      <td className="py-3.5 pr-6 align-top leading-[1.5] text-charcoal">{det}</td>
                      <td className="py-3.5 text-right align-top font-mono text-obsidian">{pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="faq-embudo">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="faq-embudo" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
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
              {en ? 'Source: ' : 'Fuente: '}
              <a
                href="https://hbr.org/2011/03/the-short-life-of-online-sales-leads"
                rel="noopener noreferrer"
                className="underline decoration-hair underline-offset-4 hover:decoration-obsidian"
              >
                Oldroyd, McElheran &amp; Elkington, «The Short Life of Online Sales Leads», Harvard Business Review (2011)
              </a>
              .
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
