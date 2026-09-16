import type { Metadata } from 'next';
import { DemoPageContent } from '@/components/demo/DemoPageContent';

export const metadata: Metadata = {
  title: 'Demo Interactivo | Omona - Prueba el Agente de Ventas IA',
  description:
    'Prueba gratis el agente de ventas IA de Omona. Chatea en tiempo real y ve como responde, califica leads y agenda citas por WhatsApp automaticamente.',
  openGraph: {
    title: 'Demo Interactivo | Omona - Prueba el Agente de Ventas IA',
    description:
      'El sistema de inteligencia comercial que Omona construyo y opera en produccion. Chatea con el agente y ve como extrae datos, califica y agenda. Es evidencia de delivery, no la oferta de servicios.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech/demo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo Interactivo | Omona - Prueba el Agente de Ventas IA',
    description:
      'Prueba gratis el agente de ventas IA de Omona. Chatea en tiempo real y ve como responde, califica leads y agenda citas.',
  },
  alternates: {
    canonical: 'https://omona.tech/demo',
  },
};

export default function DemoPage() {
  return <DemoPageContent />;
}
