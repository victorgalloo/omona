import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loomi para Escuelas y Cursos | Agente AI para WhatsApp',
  description:
    'Automatiza la captación de alumnos por WhatsApp. Loomi responde sobre programas, costos, becas y agenda entrevistas de admisión 24/7.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
