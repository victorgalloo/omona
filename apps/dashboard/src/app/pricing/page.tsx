import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { PricingPageContent } from './PricingPageContent';

export const metadata: Metadata = {
  title: 'Precios | Loomi - Agente de Ventas IA para WhatsApp',
  description:
    'Planes desde $499 MXN/mes. Automatiza tus ventas por WhatsApp con IA. 14 días gratis, sin tarjeta de crédito. CRM integrado para pymes en México y LATAM.',
  openGraph: {
    title: 'Precios | Loomi - Agente de Ventas IA para WhatsApp',
    description:
      'Planes desde $499 MXN/mes con 14 días gratis. Agente IA para WhatsApp con CRM integrado para pymes en México y LATAM.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://loomi.lat/pricing',
  },
  alternates: {
    canonical: 'https://loomi.lat/pricing',
  },
};

const pricingSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Precios de Loomi',
      url: 'https://loomi.lat/pricing',
      description:
        'Planes y precios del agente de ventas IA para WhatsApp de Loomi. Starter desde $499 MXN/mes y Pro desde $1,499 MXN/mes.',
      inLanguage: 'es-MX',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Loomi',
      applicationCategory: 'BusinessApplication',
      offers: [
        {
          '@type': 'Offer',
          name: 'Plan Starter',
          description:
            'Agente IA 24/7 para WhatsApp, calificación de leads, CRM básico. Ideal para pymes que empiezan a automatizar.',
          price: '499',
          priceCurrency: 'MXN',
          priceValidUntil: '2026-12-31',
          url: 'https://loomi.lat/signup',
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            unitText: 'mes',
          },
        },
        {
          '@type': 'Offer',
          name: 'Plan Pro',
          description:
            'Todo lo del plan Starter más agendamiento automático, follow-up, analytics avanzados, webhooks y equipo ilimitado.',
          price: '1499',
          priceCurrency: 'MXN',
          priceValidUntil: '2026-12-31',
          url: 'https://loomi.lat/signup',
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            unitText: 'mes',
          },
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto cuesta Loomi?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Loomi tiene dos planes: Starter desde $499 MXN/mes (~$25 USD) y Pro desde $1,499 MXN/mes (~$75 USD). Ambos incluyen 14 días de prueba gratuita sin tarjeta de crédito.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué incluye la prueba gratuita?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'La prueba gratuita de 14 días incluye acceso completo al plan que elijas. No se requiere tarjeta de crédito y puedes cancelar en cualquier momento.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo cancelar en cualquier momento?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, puedes cancelar tu suscripción en cualquier momento desde el dashboard. No hay contratos ni penalizaciones por cancelación.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuál es la diferencia entre Starter y Pro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El plan Starter incluye el agente IA 24/7, calificación de leads y CRM básico. El plan Pro agrega agendamiento automático, follow-up automatizado, analytics avanzados y webhooks.',
          },
        },
      ],
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={pricingSchema} />
      <PricingPageContent />
    </>
  );
}
