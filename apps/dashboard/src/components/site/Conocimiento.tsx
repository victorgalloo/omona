/**
 * /conocimiento y /en/knowledge: la base de conocimiento pública de Victor
 * (pedido de Victor, 27-nov-2026: «poco texto pero potente, y si quieres
 * profundizar le pones ver más… y te vas hasta el fondo»).
 *
 * Un solo patrón en toda la página: línea potente → «Ver más» abre viñetas →
 * cada viñeta puede abrir otro «Ver más» (máx. 3 niveles) → al fondo, la liga a
 * la evidencia. Todo con <details>/<summary> nativo: HTML de servidor, indexable,
 * sin JS y con teclado. Al llegar solo se ven las líneas potentes.
 *
 * Datos: data/conocimiento/*.md (lib/conocimiento.ts). Franjas con divisores de
 * 1 px, sin cards (DESIGN_SYSTEM.md, skill omona-tech).
 */
import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Wrap, Eyebrow } from './Home';
import { BASE, ORG, ORG_ID, PERSON, PERSON_REF } from '@/lib/entidad';
import { getConocimiento, type LangK, type Tema, type Vineta } from '@/lib/conocimiento';

const T = {
  es: {
    path: '/conocimiento',
    other: { href: '/en/knowledge', label: 'English (US)' },
    eyebrow: 'Base de conocimiento · Victor Gallo',
    h1: 'Lo que sé y cómo trabajo, en corto.',
    sub: 'Una línea por tema. «Ver más» abre el detalle, hasta el fondo.',
    mas: 'Ver más',
    menos: 'Ver menos',
    bovedaH: 'Desde mi bóveda',
    bovedaSub: (n: number) => `${n} ${n === 1 ? 'nota pública' : 'notas públicas'} de mi segundo cerebro, tal cual`,
    bovedaLang: '',
    title: 'Base de conocimiento de Victor Gallo',
    desc: 'Victor Gallo en corto: procesos comerciales con IA, ciberseguridad defensiva, posicionamiento en buscadores e IA, agentes, segundo cerebro y open source.',
    locale: 'es_US',
    inLanguage: 'es-US',
  },
  en: {
    path: '/en/knowledge',
    other: { href: '/conocimiento', label: 'Español (EE. UU.)' },
    eyebrow: 'Knowledge base · Victor Gallo',
    h1: 'What I know and how I work, in short.',
    sub: 'One line per topic. “See more” opens the detail, all the way down.',
    mas: 'See more',
    menos: 'See less',
    bovedaH: 'From my vault',
    bovedaSub: (n: number) => `${n} public ${n === 1 ? 'note' : 'notes'} from my second brain, as written`,
    bovedaLang: ' (in Spanish)',
    title: "Victor Gallo's knowledge base",
    desc: 'Victor Gallo in short: commercial processes with AI, defensive cybersecurity, visibility on search and AI assistants, agents, second brain, open source.',
    locale: 'en_US',
    inLanguage: 'en-US',
  },
};

export function conocimientoMetadata(lang: LangK): Metadata {
  const t = T[lang];
  return {
    title: t.title,
    description: t.desc,
    alternates: {
      canonical: `${BASE}${t.path}`,
      languages: {
        'es-US': `${BASE}/conocimiento`,
        'es-MX': `${BASE}/conocimiento`,
        'en-US': `${BASE}/en/knowledge`,
        en: `${BASE}/en/knowledge`,
        'x-default': `${BASE}/conocimiento`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.desc,
      url: `${BASE}${t.path}`,
      type: 'profile',
      siteName: 'Omona',
      locale: t.locale,
      alternateLocale: lang === 'es' ? ['en_US', 'es_MX'] : ['es_US', 'es_MX'],
    },
    twitter: { card: 'summary_large_image', title: t.title, description: t.desc },
  };
}

// ── markdown en línea: [texto](url), **negritas**, `código` ─────────────────
const linkCls = 'text-obsidian underline decoration-hair underline-offset-2 hover:decoration-obsidian';

function enLinea(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    if (m[1] !== undefined) {
      const href = m[2];
      if (href.startsWith('/'))
        out.push(
          <Link key={k++} href={href} className={linkCls}>
            {m[1]}
          </Link>,
        );
      else if (href.startsWith('#') || href.startsWith('mailto:'))
        out.push(
          <a key={k++} href={href} className={linkCls}>
            {m[1]}
          </a>,
        );
      else
        out.push(
          <a key={k++} href={href} className={linkCls} rel="noopener noreferrer">
            {m[1]}
          </a>,
        );
    } else if (m[3] !== undefined) out.push(<strong key={k++} className="font-medium text-obsidian">{m[3]}</strong>);
    else out.push(<code key={k++} className="font-mono text-[0.92em]">{m[4]}</code>);
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

// ── «Ver más» ─────────────────────────────────────────────────────────────
// Un nombre de grupo por nivel: el «Ver más» de adentro no hereda el estado del de afuera.
// Índice 4 = el bloque plegado «Desde mi bóveda», que envuelve filas de nivel 0.
const GRUPO = ['group/n0', 'group/n1', 'group/n2', 'group/n3', 'group/bv'] as const;
const OCULTO_ABIERTO = ['group-open/n0:hidden', 'group-open/n1:hidden', 'group-open/n2:hidden', 'group-open/n3:hidden', 'group-open/bv:hidden'] as const;
const VISIBLE_ABIERTO = ['group-open/n0:inline', 'group-open/n1:inline', 'group-open/n2:inline', 'group-open/n3:inline', 'group-open/bv:inline'] as const;
const GIRO = ['group-open/n0:rotate-90', 'group-open/n1:rotate-90', 'group-open/n2:rotate-90', 'group-open/n3:rotate-90', 'group-open/bv:rotate-90'] as const;
const BV = 4;

function VerMas({ nivel, mas, menos }: { nivel: number; mas: string; menos: string }) {
  return (
    <span className="mono-label ml-3 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap align-baseline text-stone group-hover/sum:text-obsidian">
      <span aria-hidden className={`inline-block transition-transform motion-reduce:transition-none ${GIRO[nivel]}`}>
        ›
      </span>
      <span className={OCULTO_ABIERTO[nivel]}>{mas}</span>
      <span className={`hidden ${VISIBLE_ABIERTO[nivel]}`}>{menos}</span>
    </span>
  );
}

const sumCls = 'group/sum cursor-pointer list-none rounded-[2px] [&::-webkit-details-marker]:hidden';

function Vinetas({ items, nivel, t }: { items: Vineta[]; nivel: number; t: (typeof T)[LangK] }) {
  return (
    <ul className={`grid gap-1.5 ${nivel > 1 ? 'mt-2 border-l border-hair pl-4' : ''}`}>
      {items.map((v, i) =>
        v.hijos.length ? (
          <li key={i}>
            <details className={GRUPO[nivel]}>
              <summary className={`${sumCls} text-pretty text-[15px] leading-[1.5] text-charcoal`}>
                <span aria-hidden className="mr-2 font-mono text-ash">
                  –
                </span>
                {enLinea(v.texto)}
                <VerMas nivel={nivel} mas={t.mas} menos={t.menos} />
              </summary>
              <Vinetas items={v.hijos} nivel={nivel + 1} t={t} />
            </details>
          </li>
        ) : (
          <li key={i} className="text-pretty text-[15px] leading-[1.5] text-charcoal">
            <span aria-hidden className="mr-2 font-mono text-ash">
              –
            </span>
            {enLinea(v.texto)}
          </li>
        ),
      )}
    </ul>
  );
}

function Fila({ tema, t, langAttr }: { tema: Tema; t: (typeof T)[LangK]; langAttr?: string }) {
  return (
    <li id={tema.slug} lang={langAttr} className="grid scroll-mt-20 gap-1 py-3.5 md:grid-cols-[30ch_minmax(0,1fr)] md:gap-8">
      <p className="mono-label pt-[5px] text-graphite">{tema.title}</p>
      <details className={GRUPO[0]}>
        <summary className={`${sumCls} text-balance text-[18px] leading-[1.35] tracking-[-0.02em] text-obsidian`}>
          {enLinea(tema.linea)}
          <VerMas nivel={0} mas={t.mas} menos={t.menos} />
        </summary>
        <div className="pb-2 pt-3">
          <Vinetas items={tema.vinetas} nivel={1} t={t} />
          {tema.fondo && (
            <p className="mono-label mt-4">
              {enLinea(`[${tema.fondoTexto || tema.fondo} →](${tema.fondo})`)}
            </p>
          )}
        </div>
      </details>
    </li>
  );
}

export function ConocimientoPage({ lang }: { lang: LangK }) {
  const t = T[lang];
  const { temas, boveda } = getConocimiento(lang);
  const url = `${BASE}${t.path}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#page`,
        name: t.title,
        description: t.desc,
        url,
        inLanguage: t.inLanguage,
        mainEntity: PERSON_REF,
        publisher: { '@id': ORG_ID },
        hasPart: temas.map((x) => ({ '@type': 'WebPageElement', '@id': `${url}#${x.slug}`, name: x.title, abstract: x.linea })),
      },
      PERSON,
      ORG,
    ],
  };

  return (
    <div lang={t.inLanguage} className="md min-h-screen bg-paper text-obsidian">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <LandingNav lang={lang} />
      <main>
        <header className="pb-6 pt-10 sm:pt-14">
          <Wrap>
            <div className="flex items-baseline justify-between gap-6">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <Link href={t.other.href} hrefLang={lang === 'es' ? 'en-US' : 'es-US'} className="mono-label text-charcoal hover:text-obsidian">
                {t.other.label} →
              </Link>
            </div>
            <h1 className="text-heading max-w-[30ch] text-balance text-obsidian">{t.h1}</h1>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-stone">{t.sub}</p>
          </Wrap>
        </header>

        <section aria-label={t.eyebrow}>
          <Wrap>
            <ol className="divide-y divide-hair border-y border-hair">
              {temas.map((x) => (
                <Fila key={x.slug} tema={x} t={t} />
              ))}
            </ol>
          </Wrap>
        </section>

        {boveda.length > 0 && (
          <section className="pt-10" aria-labelledby="boveda">
            <Wrap>
              <details className={GRUPO[BV]}>
                <summary className={`${sumCls} border-b border-hair pb-3`}>
                  <span id="boveda" className="eyebrow eyebrow-muted !mb-0 inline">
                    {t.bovedaH}
                  </span>
                  <span className="ml-3 text-[15px] text-stone">
                    {t.bovedaSub(boveda.length)}
                    {boveda.some((b) => b.lang !== lang) ? t.bovedaLang : ''}
                  </span>
                  <VerMas nivel={BV} mas={t.mas} menos={t.menos} />
                </summary>
                <ol className="divide-y divide-hair border-b border-hair">
                  {boveda.map((x) => (
                    <Fila key={x.slug} tema={x} t={t} langAttr={x.lang !== lang ? (x.lang === 'es' ? 'es-US' : 'en-US') : undefined} />
                  ))}
                </ol>
              </details>
            </Wrap>
          </section>
        )}
      </main>
      <HomeFooter />
    </div>
  );
}
