import type { Metadata } from 'next';
import { TourDemo } from '@/components/demo/TourDemo';

export const metadata: Metadata = {
  title: 'Recorrido | Omona - Prospectar, seguir y cerrar',
  description:
    'Recorrido guiado por el sistema: como se prioriza una cuenta, como una llamada se vuelve campos y tarea en el CRM, como sale el borrador de propuesta y como se evalua antes de operar.',
  openGraph: {
    title: 'Recorrido | Omona',
    description:
      'Cuatro pantallas con datos de ejemplo: prospectar, seguir, cerrar y la corrida de evaluaciones que corre antes de que el agente hable con un cliente.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech/demo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recorrido | Omona',
    description:
      'Prospectar, seguir, cerrar y la evaluacion previa, en cuatro pantallas con datos de ejemplo.',
  },
  alternates: { canonical: 'https://omona.tech/demo' },
};

export default function DemoPage() {
  return <TourDemo />;
}
