import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks';
import { LandingOfferStack } from '@/components/landing/LandingOfferStack';
import { LandingGuarantee } from '@/components/landing/LandingGuarantee';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Como trabajamos | Implementacion de inteligencia comercial en 6 semanas',
  description:
    'Diagnostico, piloto y corte contra la linea base. Seis semanas para que cada conversacion comercial entre sola al CRM con su proxima tarea. Si no se cumple, se devuelve el piloto completo.',
  openGraph: {
    title: 'Como trabajamos | Inteligencia comercial en 6 semanas',
    description:
      'Diagnostico, piloto y corte contra la linea base. Si al terminar no se cumple el indicador acordado, se devuelve el 100% del piloto.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech/como-trabajamos',
  },
  alternates: {
    canonical: 'https://omona.tech/como-trabajamos',
  },
};

/**
 * Esta ruta sustituye a /pricing, que ahora redirige aquí.
 *
 * La página vieja abría con dos cifras y una tabla contra competidores. Eso
 * hacía que la decisión del visitante fuera de precio, y en precio siempre va a
 * haber alguien más barato. Aquí lo que se explica es el proceso y el riesgo
 * que asumimos nosotros; la cifra sale en el diagnóstico, cuando ya se sabe
 * volumen, canales y complejidad — que es lo único que permite cotizar sin
 * inventar.
 */
const comoTrabajamosSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Como trabajamos - Omona',
      url: 'https://omona.tech/como-trabajamos',
      description:
        'Proceso de implementacion de inteligencia comercial en seis semanas: diagnostico, piloto y corte contra la linea base, con devolucion completa del piloto si no se cumple el indicador acordado.',
      inLanguage: 'es-MX',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuanto cuesta implementar inteligencia comercial con Omona?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El precio se define en el diagnostico, porque depende del numero de usuarios, el volumen de conversaciones, los canales conectados, el CRM que ya usas y la complejidad de tus propuestas. Cotizar antes de conocer eso obliga a inventar un numero. El diagnostico de 30 minutos no tiene costo.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Que pasa si al terminar el piloto no funciono?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'En la semana 1 se mide la linea base. Si al terminar las seis semanas el CRM no refleja el 90% de las conversaciones comerciales y cada oportunidad abierta no tiene proxima tarea con responsable y fecha, se devuelve el 100% de lo pagado por el piloto.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Hay que cambiar de CRM?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. La implementacion se hace sobre el CRM que el equipo ya usa, aunque este mal configurado. Cambiar de CRM y automatizar el proceso comercial al mismo tiempo multiplica el riesgo de que el equipo no adopte ninguna de las dos cosas.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuanto trabajo implica para el equipo de ventas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Los vendedores no capturan campos. El sistema extrae necesidades, presupuesto, objeciones y proximos pasos de las conversaciones que ya estan teniendo. Lo que si requiere tiempo del cliente es el kickoff, entregar accesos y aprobar plantillas.',
          },
        },
      ],
    },
  ],
};

export default function ComoTrabajamosPage() {
  return (
    <div className="md crt min-h-screen bg-background text-foreground">
      <JsonLd data={comoTrabajamosSchema} />
      <LandingNav />
      <LandingHowItWorks />
      <LandingOfferStack />
      <LandingGuarantee />
      <LandingCTA />
    </div>
  );
}
