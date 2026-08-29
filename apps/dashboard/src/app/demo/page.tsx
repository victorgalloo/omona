import type { Metadata } from 'next';
import { DemoPageContent } from '@/components/demo/DemoPageContent';

export const metadata: Metadata = {
  title: 'Demo Interactivo | Omona - Prueba el Agente de Ventas IA',
  description:
    'Prueba gratis el agente de ventas IA de Omona. Chatea en tiempo real y ve como responde, califica leads y agenda citas por WhatsApp automaticamente.',
  openGraph: {
    title: 'Demo Interactivo | Omona - Prueba el Agente de Ventas IA',
    description:
      'Prueba gratis el agente de ventas IA de Omona. Chatea en tiempo real y ve como responde, califica leads y agenda citas por WhatsApp.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://loomi.lat/demo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo Interactivo | Omona - Prueba el Agente de Ventas IA',
    description:
      'Prueba gratis el agente de ventas IA de Omona. Chatea en tiempo real y ve como responde, califica leads y agenda citas.',
  },
  alternates: {
    canonical: 'https://loomi.lat/demo',
  },
};

export default function DemoPage() {
  return <DemoPageContent />;
}
