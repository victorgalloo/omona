import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero, Diagnostico, Marcas, LoDemas } from '@/components/site/Home';
import { BASE, ORG, ORG_DESC_ES, ORG_ID, PERSON } from '@/lib/entidad';
import { HomeFooter } from '@/components/home/HomeFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import ossData from '../../data/oss/oss.json';
import nowData from '../../data/now/now.json';

const TITLE = 'Omona · IA Bilingüe y Ciberseguridad en EE. UU.';
const DESC =
  'Posicionamiento en Google, ChatGPT, Claude y Gemini, agentes de IA bilingües y ciberseguridad para negocios latinos en Estados Unidos.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  openGraph: {
    title: TITLE,
    description: DESC,
    locale: 'es_US',
    alternateLocale: ['en_US', 'es_MX'],
    type: 'website',
    url: BASE,
    siteName: 'Omona',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC },
  alternates: {
    canonical: BASE,
    languages: {
      'es-US': BASE,
      'es-MX': BASE,
      'x-default': BASE,
    },
  },
};

/**
 * JSON-LD de la portada. La organización incluye areaServed US + MX y comparte
 * @id con victorgallo.com sin exponer razón social.
 */
const prs = (ossData as { prs: { title: string; url: string }[] }).prs;
const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    { ...ORG, description: ORG_DESC_ES },
    PERSON,
    { '@type': 'WebSite', '@id': `${BASE}/#website`, name: 'Omona', url: BASE, inLanguage: 'es-US', publisher: { '@id': ORG_ID } },
    {
      '@type': 'WebPage',
      '@id': `${BASE}/#page`,
      name: TITLE,
      description: DESC,
      url: BASE,
      inLanguage: 'es-US',
      dateModified: (nowData as { updated: string }).updated,
      isPartOf: { '@id': `${BASE}/#website` },
      about: { '@id': PERSON['@id'] },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${BASE}/victor/victor-gallo.jpg`, width: 824, height: 1024 },
      mainEntity: {
        '@type': 'ItemList',
        name: 'Pull requests de Victor Gallo a proyectos open source',
        itemListElement: prs.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: p.url })),
      },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '#hero-description'] },
    },
  ],
};

/**
 * ══ LA PORTADA ══════════════════════════════════════════════════
 * v6, 27-nov-2026. Victor: «Replantea la landing de omona en base a lo aprendido
 * en mi base de conocimiento y el nuevo producto también de posicionamiento seo
 * geo chatgpt, claude, gemini». Lo aprendido («Poco texto, pero potente»): arriba
 * solo la idea; el detalle existe pero no estorba, detrás de «ver más».
 * Orden:
 *   1. héroe         h1 de tres frases + tres productos con el mismo peso, una
 *                    línea cada uno (<details name="producto">): posicionamiento
 *                    SEO + GEO, agentes comerciales bilingües, ciberseguridad
 *   2. diagnóstico   evaluación gratuita de dominio (#diagnostico)
 *   3. marcas        contribuyo a / construyo sobre (logos nominativos con evidencia)
 *   4. lo demás      cómo pienso, open source, notas, ahora y quién: una línea
 *                    cada uno, todo el contenido plegado en el HTML del servidor
 * La matriz «Sub héroe» y la ficha «Flujo comercial / Capas de defensa» viven
 * ahora dentro de los productos (v5 en el historial de git).
 */
export default function LandingPage() {
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <JsonLd data={jsonLdGraph} />
      <LandingNav />
      <main>
        <Hero />
        <Diagnostico />
        <Marcas />
        <LoDemas />
      </main>
      <HomeFooter />
    </div>
  );
}
