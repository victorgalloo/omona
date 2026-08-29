import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loomi para Bienes Raíces | Agente AI para WhatsApp',
  description:
    'Automatiza la captación de prospectos inmobiliarios por WhatsApp. Loomi filtra por presupuesto, zona y tipo de propiedad antes del handoff a tu asesor.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
