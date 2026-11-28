import type { MetadataRoute } from 'next';
import { getNotas, notaLanguages } from '@/lib/notas';

export const dynamic = 'force-static';

/**
 * 22-nov-2026: solo el laboratorio (portada, open source ES/EN, blog, about y
 * las notas). Las rutas del producto responden 301 (next.config.js) y ya no
 * se anuncian; /privacidad y /terminos siguen para el dashboard, con noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omona.tech';
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          'es-US': baseUrl,
          'es-MX': baseUrl,
          'x-default': baseUrl,
        },
      },
    },
    ...['/open-source', '/en/open-source'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/open-source`,
          'es-MX': `${baseUrl}/open-source`,
          'en-US': `${baseUrl}/en/open-source`,
          en: `${baseUrl}/en/open-source`,
          'x-default': `${baseUrl}/open-source`,
        },
      },
    })),
    ...['/comercial-ia', '/en/commercial-ai'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/comercial-ia`,
          'es-MX': `${baseUrl}/comercial-ia`,
          'en-US': `${baseUrl}/en/commercial-ai`,
          en: `${baseUrl}/en/commercial-ai`,
          'x-default': `${baseUrl}/comercial-ia`,
        },
      },
    })),
    ...['/verificador-embudo-bilingue', '/en/speed-to-lead-checker'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/verificador-embudo-bilingue`,
          'es-MX': `${baseUrl}/verificador-embudo-bilingue`,
          'en-US': `${baseUrl}/en/speed-to-lead-checker`,
          en: `${baseUrl}/en/speed-to-lead-checker`,
          'x-default': `${baseUrl}/verificador-embudo-bilingue`,
        },
      },
    })),
    ...['/verificador-dmarc-spf', '/en/dmarc-spf-checker'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/verificador-dmarc-spf`,
          'es-MX': `${baseUrl}/verificador-dmarc-spf`,
          'en-US': `${baseUrl}/en/dmarc-spf-checker`,
          en: `${baseUrl}/en/dmarc-spf-checker`,
          'x-default': `${baseUrl}/verificador-dmarc-spf`,
        },
      },
    })),
    ...['/verificador-cabeceras-seguridad', '/en/security-headers-checker'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/verificador-cabeceras-seguridad`,
          'es-MX': `${baseUrl}/verificador-cabeceras-seguridad`,
          'en-US': `${baseUrl}/en/security-headers-checker`,
          en: `${baseUrl}/en/security-headers-checker`,
          'x-default': `${baseUrl}/verificador-cabeceras-seguridad`,
        },
      },
    })),
    ...['/verificador-visibilidad-ia', '/en/ai-visibility-checker'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/verificador-visibilidad-ia`,
          'es-MX': `${baseUrl}/verificador-visibilidad-ia`,
          'en-US': `${baseUrl}/en/ai-visibility-checker`,
          en: `${baseUrl}/en/ai-visibility-checker`,
          'x-default': `${baseUrl}/verificador-visibilidad-ia`,
        },
      },
    })),
    ...['/seguridad', '/en/security'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/seguridad`,
          'es-MX': `${baseUrl}/seguridad`,
          'en-US': `${baseUrl}/en/security`,
          en: `${baseUrl}/en/security`,
          'x-default': `${baseUrl}/seguridad`,
        },
      },
    })),
    ...['/conocimiento', '/en/knowledge'].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          'es-US': `${baseUrl}/conocimiento`,
          'es-MX': `${baseUrl}/conocimiento`,
          'en-US': `${baseUrl}/en/knowledge`,
          en: `${baseUrl}/en/knowledge`,
          'x-default': `${baseUrl}/conocimiento`,
        },
      },
    })),
    { url: `${baseUrl}/now`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...getNotas().map((n) => ({
      url: `${baseUrl}/blog/${n.slug}`,
      lastModified: new Date(n.updated),
      changeFrequency: 'monthly' as const,
      priority: ['ciberseguridad-negocios-latinos-estados-unidos', 'plan-wisp-irs-ftc-safeguards-preparadores-impuestos', 'irs-wisp-ftc-safeguards-tax-preparers', 'wire-fraud-ach-fraud-small-business', 'fraude-ach-wire-facturas-falsas-contratistas', 'cyber-insurance-small-business-checklist', 'seguro-cibernetico-pequenas-empresas'].includes(n.slug) ? 0.9 : 0.8,
      alternates: { languages: notaLanguages(n, baseUrl) },
    })),
  ];
}
