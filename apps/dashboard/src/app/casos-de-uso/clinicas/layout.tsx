import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Omona para Clínicas y Consultorios | Agente AI para WhatsApp',
  description:
    'Automatiza la agenda de citas y atención al paciente por WhatsApp. Omona responde 24/7, agenda citas y envía recordatorios automáticos.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
