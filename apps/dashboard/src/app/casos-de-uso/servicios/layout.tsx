import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loomi para Venta de Servicios | Agente AI para WhatsApp',
  description:
    'Automatiza la venta de servicios profesionales por WhatsApp. Loomi responde cotizaciones, califica prospectos y agenda llamadas de cierre 24/7.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
