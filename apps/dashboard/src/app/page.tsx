import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero, Marcas, PorQue, Ahora, Actividad, Proyectos, Notas, Quien } from '@/components/site/Home';
import { BASE, ORG, ORG_DESC_ES, ORG_ID, PERSON } from '@/lib/entidad';
import { HomeFooter } from '@/components/home/HomeFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import ossData from '../../data/oss/oss.json';
import nowData from '../../data/now/now.json';

const TITLE = 'Omona · IA Bilingüe y Ciberseguridad en EE. UU.';
const DESC =
  'Agentes de IA bilingües (español e inglés) y ciberseguridad para dueños de negocios latinos en Estados Unidos: correo, FTC, web y AWS.';

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
 * v2, 22-nov-2026 (Victor: «lúcame más», logos, filosofía, algo que se actualice solo). Orden:
 *   1. héroe       Victor: nombre, foto, su línea, su cargo en SuperLeads
 *   2. marcas      contribuyo a / construyo sobre (logos nominativos con evidencia)
 *   3. por qué     su filosofía (BORRADOR en revisión, lib/perfil.ts)
 *   4. ahora       bitácora diaria (data/now/now.json, cron)
 *   5. actividad   panel CLI con el estado real de GitHub
 *   6. proyectos   repos propios
 *   7. notas       las últimas del blog
 *   8. qué es      Omona = laboratorio, sin producto
 * Las secciones del producto (ciclo, medición, alcance, FAQ, cierre) se
 * retiraron; siguen en el historial de git.
 */
export default function LandingPage() {
  return (
    <div className="md min-h-screen bg-paper text-obsidian">
      <JsonLd data={jsonLdGraph} />
      <LandingNav />
      <main>
        <Hero />
        <Marcas />
        <Actividad />
        <Proyectos />
        <Notas />
        <Ahora />
        <Quien />
      </main>
      <HomeFooter />
    </div>
  );
}
