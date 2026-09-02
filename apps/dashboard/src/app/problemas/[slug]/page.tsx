import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProblemPageLayout } from '@/components/landing/ProblemPageLayout';
import { JsonLd } from '@/components/seo/JsonLd';
import { es } from '@/lib/i18n';

/**
 * Páginas nombradas por problema. Los slugs y los metadatos salen del español,
 * que es el idioma canónico del sitio (`inLanguage: es-MX`); el contenido
 * visible sí cambia con el selector de idioma.
 */
export function generateStaticParams() {
  return es.problems.items.map((problem) => ({ slug: problem.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const problem = es.problems.items.find((p) => p.slug === params.slug);
  if (!problem) return {};

  const url = `https://omona.tech/problemas/${problem.slug}`;

  return {
    title: problem.metaTitle,
    description: problem.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: problem.metaTitle,
      description: problem.metaDescription,
      url,
      locale: 'es_MX',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: problem.metaTitle,
      description: problem.metaDescription,
    },
  };
}

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const problem = es.problems.items.find((p) => p.slug === params.slug);
  if (!problem) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: problem.metaTitle,
        description: problem.metaDescription,
        url: `https://omona.tech/problemas/${problem.slug}`,
        inLanguage: 'es-MX',
        isPartOf: { '@type': 'WebSite', name: 'Omona', url: 'https://omona.tech' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Omona', item: 'https://omona.tech' },
          {
            '@type': 'ListItem',
            position: 2,
            name: problem.short,
            item: `https://omona.tech/problemas/${problem.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ProblemPageLayout slug={params.slug} />
    </>
  );
}
