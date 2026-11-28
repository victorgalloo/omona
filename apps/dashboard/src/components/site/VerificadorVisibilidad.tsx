import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { DiagnosticoVisibilidad } from '@/components/site/DiagnosticoVisibilidad';
import { GRUPO, VerMas, sumCls } from '@/components/site/VerMas';
import { JsonLd } from '@/components/seo/JsonLd';
import { BASE, ORG, ORG_DESC_ES, ORG_ID, PERSON } from '@/lib/entidad';
import { CONTROLES_VISIBILIDAD, BASE_VISIBILIDAD } from '@/lib/visibilidad';

/**
 * Producto «Posicionamiento SEO + GEO» · herramienta gratuita e indexable de 0 tokens.
 * Pareja ES/EN con hreflang recíproco: /verificador-visibilidad-ia ↔ /en/ai-visibility-checker.
 * Candado: sin nombre de producto, precio, plan, clientes, resultados, cifras ni plazos inventados.
 */

type Lang = 'es' | 'en';

const ES_PATH = '/verificador-visibilidad-ia';
const EN_PATH = '/en/ai-visibility-checker';

const ligaCls = 'text-obsidian underline decoration-hair underline-offset-4 hover:decoration-obsidian';

const T = {
  es: {
    path: ES_PATH,
    title: 'Verificador de visibilidad en Google y ChatGPT | Omona',
    desc: 'Revisa gratis si Google, ChatGPT, Claude, Perplexity y Gemini pueden leer tu sitio: robots.txt, llms.txt, sitemap, título y datos estructurados.',
    eyebrow: 'Herramienta gratuita · Posicionamiento SEO + GEO · Lectura pasiva · 0 tokens',
    h1: '¿Te encuentran Google y los asistentes de IA?',
    sub: 'Diez controles sobre lo que Google y los rastreadores de ChatGPT, Claude, Perplexity y Gemini ven de tu sitio, con el arreglo de cada uno.',
    listaH: 'Qué revisa',
    pesoLbl: 'pts',
    faqH: 'Preguntas',
    faqs: [
      {
        q: '¿Puedo ver algo antes de pagar?',
        a: <>Sí: este verificador es gratis, sin registro, y el entregable se descarga.</>,
      },
      {
        q: '¿Cómo me encuentra ChatGPT, Claude o Gemini?',
        a: (
          <>
            Leen páginas públicas con sus rastreadores. Si robots.txt los bloquea o el texto solo aparece con JavaScript, no te pueden citar. SEO es
            Google; GEO son los asistentes de IA.
          </>
        ),
      },
      {
        q: '¿Publicar más artículos me trae ventas?',
        a: (
          <>
            Por sí solo no. Primero, que el sitio se pueda leer e indexar; luego, contenido con dato propio; y que el prospecto reciba respuesta (
            <Link href="/verificador-embudo-bilingue" className={ligaCls}>
              revisa tu respuesta rápida
            </Link>
            ).
          </>
        ),
      },
      {
        q: '¿llms.txt garantiza algo?',
        a: <>No. Es una convención propuesta y no todos los asistentes la leen; por eso pesa poco (7 de 100).</>,
      },
    ],
    linksLabel: 'Otros verificadores:',
    links: [
      { href: '/verificador-embudo-bilingue', label: 'Respuesta rápida y sitio bilingüe' },
      { href: '/verificador-dmarc-spf', label: 'SPF/DMARC' },
      { href: EN_PATH, label: 'English version (US)' },
    ],
    mas: 'Ver respuesta',
    menos: 'Ocultar',
  },
  en: {
    path: EN_PATH,
    title: 'AI Visibility Checker: Google and ChatGPT | Omona',
    desc: 'Free check: can Google, ChatGPT, Claude, Perplexity and Gemini read your site? robots.txt, llms.txt, sitemap, title and structured data.',
    eyebrow: 'Free tool · SEO + GEO visibility · Passive read · 0 LLM tokens',
    h1: 'Can Google and AI assistants find you?',
    sub: 'Ten checks on what Google and the ChatGPT, Claude, Perplexity and Gemini crawlers see of your website, each with its fix.',
    listaH: 'What it checks',
    pesoLbl: 'pts',
    faqH: 'Questions',
    faqs: [
      {
        q: 'Can I see something before paying?',
        a: <>Yes: this checker is free, with no sign-up, and the deliverable downloads.</>,
      },
      {
        q: 'How do ChatGPT, Claude or Gemini find me?',
        a: (
          <>
            They read public pages with their crawlers. If robots.txt blocks them or your copy only appears with JavaScript, they cannot cite you. SEO is
            Google; GEO is AI assistants.
          </>
        ),
      },
      {
        q: 'Will publishing more articles bring sales?',
        a: (
          <>
            Not on its own. First, make the site readable and indexable; then publish content with your own data; and make sure prospects get an answer (
            <Link href="/en/speed-to-lead-checker" className={ligaCls}>
              check your speed to lead
            </Link>
            ).
          </>
        ),
      },
      {
        q: 'Does llms.txt guarantee anything?',
        a: <>No. It is a proposed convention and not every assistant reads it; that is why it weighs little (7 of 100).</>,
      },
    ],
    linksLabel: 'Other checkers:',
    links: [
      { href: '/en/speed-to-lead-checker', label: 'Speed-to-lead & bilingual site' },
      { href: '/en/dmarc-spf-checker', label: 'SPF/DMARC' },
      { href: ES_PATH, label: 'Versión en español (EE. UU.)' },
    ],
    mas: 'Show answer',
    menos: 'Hide',
  },
};

export function verificadorVisibilidadMetadata(lang: Lang): Metadata {
  const t = T[lang];
  const url = `${BASE}${t.path}`;
  const b = BASE_VISIBILIDAD;
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

export function VerificadorVisibilidadPage({ lang }: { lang: Lang }) {
  const t = T[lang];
  const en = lang === 'en';
  const url = `${BASE}${t.path}`;
  const b = BASE_VISIBILIDAD;
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
        name: en ? 'AI Visibility Checker: Google and AI assistants' : 'Verificador de visibilidad en Google y asistentes de IA',
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
            <DiagnosticoVisibilidad lang={lang} />
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="lista-visibilidad">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="lista-visibilidad" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
              {t.listaH}
            </h2>
            {b ? (
              <p className="mt-3 max-w-[72ch] text-pretty text-[15px] leading-[1.58] text-charcoal">
                {en
                  ? `We measured ${b.n} websites of Hispanic-owned businesses in the United States with these same 10 checks (${b.fecha}). ${b.pasa.ia_robots}% let AI crawlers in. The gap is in the basics: ${b.pasa.description}% have a description of the right length, ${b.pasa.h1}% have a single H1 and ${b.pasa.llms_txt}% have an llms.txt.`
                  : `Medimos ${b.n} sitios de negocios hispanos en Estados Unidos con estos mismos 10 controles (${b.fecha}). El ${b.pasa.ia_robots} % deja pasar a los rastreadores de IA. Lo que falla es lo básico: ${b.pasa.description} % tiene una descripción del largo correcto, ${b.pasa.h1} % tiene un solo H1 y ${b.pasa.llms_txt} % tiene llms.txt.`}
              </p>
            ) : null}
            <ol className="mt-6 divide-y divide-hair border-y border-hair">
              {CONTROLES_VISIBILIDAD.map((c, i) => (
                <li key={c.id} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 py-3.5 sm:grid-cols-[2rem_18ch_minmax(0,1fr)_6ch]">
                  <span className="mono-label tabular-nums text-graphite">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[15px] font-medium text-obsidian">{c.nombre[lang]}</span>
                  <span className="col-start-2 col-end-4 text-[14px] leading-[1.5] text-charcoal sm:col-start-3 sm:col-end-4">
                    {c.pasa[lang]}
                    {b ? (
                      <span className="tabular-nums text-stone">
                        {' · '}
                        {en ? `${b.pasa[c.id]}% of ${b.n} pass` : `lo cumple ${b.pasa[c.id]} % de ${b.n}`}
                      </span>
                    ) : null}
                  </span>
                  <span className="mono-label col-start-3 row-start-1 text-right tabular-nums text-stone sm:col-start-4">
                    {c.peso} {t.pesoLbl}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="faq-visibilidad">
          <div className="mx-auto w-full max-w-[1080px] px-6 lg:px-12">
            <h2 id="faq-visibilidad" className="text-[24px] font-semibold leading-[1.2] tracking-[-0.03em] text-obsidian">
              {t.faqH}
            </h2>
            <div className="mt-6 divide-y divide-hair border-y border-hair">
              {t.faqs.map((f) => (
                <details key={f.q} className={GRUPO[0]}>
                  <summary className={`${sumCls} block py-4 text-[15px] font-medium leading-[1.4] text-obsidian`}>
                    {f.q}
                    <VerMas nivel={0} mas={t.mas} menos={t.menos} />
                  </summary>
                  <p className="max-w-[68ch] pb-5 text-pretty text-[15px] leading-[1.58] text-charcoal">{f.a}</p>
                </details>
              ))}
            </div>

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
