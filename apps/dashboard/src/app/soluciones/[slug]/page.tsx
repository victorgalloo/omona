import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSoluciones, getSolucion } from '@/lib/soluciones';
import { SolucionContent } from './SolucionContent';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSoluciones().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solucion = getSolucion(slug);
  if (!solucion) return {};

  return {
    title: solucion.metaTitle,
    description: solucion.metaDescription,
    alternates: { canonical: `/soluciones/${solucion.slug}` },
    openGraph: {
      title: solucion.metaTitle,
      description: solucion.metaDescription,
      url: `/soluciones/${solucion.slug}`,
      type: 'website',
    },
  };
}

export default async function SolucionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solucion = getSolucion(slug);
  if (!solucion) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omona.tech';

  // FAQPage: las preguntas se renderizan visibles en la página (ver UseCasePageLayout),
  // requisito de Google para que el schema sea válido.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: solucion.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: solucion.title,
        item: `${baseUrl}/soluciones/${solucion.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SolucionContent solucion={solucion} />
    </>
  );
}
