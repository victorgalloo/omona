import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeLeak } from '@/components/home/HomeLeak';
import { HomeShift } from '@/components/home/HomeShift';
import { HomeCycle } from '@/components/home/HomeCycle';
import { HomeLadder } from '@/components/home/HomeLadder';
import { HomeMeasure } from '@/components/home/HomeMeasure';
import { HomeScope } from '@/components/home/HomeScope';
import { HomeFaq } from '@/components/home/HomeFaq';
import { HomeCta } from '@/components/home/HomeCta';
import { HomeFooter } from '@/components/home/HomeFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { es } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Omona | Prospectar, seguir y cerrar sin capturar nada',
  description:
    'Agentes que corren tu operacion comercial: arman la lista, extraen lo que se dijo en cada llamada y lo escriben en tu CRM, y preparan la propuesta. Se prueban antes de hablar con un cliente.',
  openGraph: {
    title: 'Omona | Prospectar, seguir y cerrar sin capturar nada',
    description:
      'El pipeline no se cae, se olvida. Agentes que prospectan, dan seguimiento y preparan el cierre, probados antes de hablar con un cliente.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona | Prospectar, seguir y cerrar sin capturar nada',
    description:
      'El pipeline no se cae, se olvida. Agentes que prospectan, dan seguimiento y preparan el cierre, probados antes de hablar con un cliente.',
  },
  alternates: {
    canonical: 'https://omona.tech',
  },
};

/**
 * El FAQPage sale del mismo `es.faq.items` que renderiza HomeFaq. Antes eran
 * dos listas separadas y se contradecían: el JSON-LD seguía afirmando "más de
 * 200 empresas" y un ROI de 8x que el copy visible ya había retirado por no
 * poder sostenerlos. Con una sola fuente eso no puede volver a pasar.
 *
 * El `featureList` se reescribió con el ciclo completo. La versión anterior
 * enumeraba funciones de chatbot —responde, transcribe, agenda— y era lo que
 * los motores generativos citaban al describir el producto: literalmente
 * estábamos pidiendo que nos clasificaran como chatbot.
 */
const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Omona',
      url: 'https://omona.tech',
      logo: 'https://omona.tech/icon.svg',
      description:
        'Omona construye sistemas comerciales a la medida: prospeccion con listas enriquecidas, seguimiento que extrae lo dicho en cada llamada y lo escribe en el CRM del cliente, y preparacion de propuestas. Cada agente se evalua con casos reales antes de exponerlo a un cliente.',
      // Sin `sameAs`: los perfiles que se declaraban devuelven 404, y un
      // sameAs roto le dice a los motores que la entidad no esta verificada.
      areaServed: [
        { '@type': 'Country', name: 'Mexico' },
        { '@type': 'Country', name: 'Colombia' },
        { '@type': 'Country', name: 'Argentina' },
        { '@type': 'Country', name: 'Chile' },
        { '@type': 'Country', name: 'Peru' },
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: 'https://api.whatsapp.com/send?phone=524779083304',
        availableLanguage: ['Spanish'],
      },
    },
    {
      // `ProfessionalService` y no `SoftwareApplication`: no se vende una
      // licencia, se construye un sistema para cada negocio.
      '@type': 'ProfessionalService',
      name: 'Omona',
      url: 'https://omona.tech',
      inLanguage: 'es-MX',
      description:
        'Implementacion a la medida sobre los sistemas que la empresa ya usa. Se empieza por la etapa que mas cuesta, se entrega funcionando y las cuentas quedan a nombre del cliente.',
      serviceType: 'Automatizacion del proceso comercial con agentes de IA',
      audience: {
        '@type': 'BusinessAudience',
        name: 'Equipos comerciales con venta consultiva y ciclo largo',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Que se construye',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Prospeccion',
              description:
                'La lista se arma con Clay, Apollo y LinkedIn Sales Navigator, se cruza con el CRM para no repetir contactos, y el primer mensaje se escribe con una razon real para escribir.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Seguimiento',
              description:
                'Las llamadas se transcriben y el sistema extrae que se acordo, quien decide, que falta y para cuando. Lo escribe en el CRM existente y deja la tarea con responsable y fecha.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Cierre',
              description:
                'La propuesta se arma con lo que el cliente pidio, contra el catalogo y los precios aprobados. Sale como borrador para que una persona lo revise antes de enviarlo.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Evaluacion de agentes',
              description:
                'Se construye un set de prueba con conversaciones reales, el criterio de aceptacion se escribe antes de la prueba y cada cambio vuelve a correr el set completo.',
            },
          },
        ],
      },
      // Sin `aggregateRating`, `review` ni `offers` con precio: no hay resenas
      // verificables y el precio depende de que se construya.
    },
    {
      '@type': 'FAQPage',
      mainEntity: es.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@type': 'WebPage',
      name: 'Omona - Sistemas a la medida para negocios que venden por WhatsApp',
      url: 'https://omona.tech',
      inLanguage: 'es-MX',
      datePublished: '2025-01-01',
      dateModified: '2026-09-17',
      isPartOf: { '@type': 'WebSite', name: 'Omona', url: 'https://omona.tech' },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '#hero-description'],
      },
    },
  ],
};

/**
 * ══ LA PORTADA ══════════════════════════════════════════════════
 *
 * Reordenada alrededor del ciclo de venta. El orden anterior dedicaba seis
 * secciones seguidas —prueba, stats, antes/después, features, CRM embebido,
 * casos de uso— a demostrar que el agente contesta bien, y dejaba la
 * inteligencia comercial como una consecuencia. Es al revés: contestar es la
 * entrada del sistema y lo que se vende es lo que pasa después.
 *
 * El orden de ahora sigue el argumento, no el catálogo:
 *
 *   1. héroe        qué es, con la tarjeta de jugada como cara del producto
 *   2. diagnóstico  dónde se fuga el dinero, que es lo que el visitante vive
 *   3. categoría    contra qué se compara esto, en dos columnas
 *   4. ciclo        las tres etapas — el corazón de la página
 *   5. autonomía    hasta dónde llega solo, y qué se gana contra prueba
 *   6. medición     cómo se prueba antes de encenderlo
 *   7. alcance      lo que hace y, explícitamente, lo que no
 *   8. preguntas
 *   9. cierre
 *
 * Las dos secciones nuevas —categoría y autonomía— entran donde estaban los
 * dos huecos del argumento. Después del diagnóstico el visitante pensaba
 * "esto ya me lo ofrecieron veinte veces" y la página no contestaba hasta el
 * FAQ; y antes de hablar de evaluaciones nadie había dicho qué es lo que el
 * sistema puede llegar a hacer solo, que es lo que vuelve relevante la
 * evaluación. Las dos son formato de escaneo puro —seis renglones cada una,
 * cero prosa visible— justamente porque se suman a una página que ya se había
 * recortado a propósito.
 *
 * Las secciones retiradas (LandingProof, LandingStats, LandingBeforeAfter,
 * LandingFeatures, LandingOfferStack, LandingCrmEmbedded, LandingUseCases,
 * LandingHowItWorks, LandingGuarantee, LandingFAQ, LandingCTA, FloatingCTA)
 * siguen en el repo: las de casos de uso y problemas comparten piezas con
 * ellas. Ya no se importan aquí.
 */
export default function LandingPage() {
  return (
    // `md` enciende el monoespaciado y los signos de markdown; `crt` pinta la
    // unica textura del sitio. Van aqui y no en <body> porque el dashboard
    // comparte el layout raiz y ahi el monoespaciado estorba.
    <div className="md crt min-h-screen bg-background text-foreground">
      <JsonLd data={jsonLdGraph} />
      <LandingNav />

      <main>
        <HomeHero />
        <HomeLeak />
        <HomeShift />
        <HomeCycle />
        <HomeLadder />
        <HomeMeasure />
        <HomeScope />
        <HomeFaq />
        <HomeCta />
      </main>

      <HomeFooter />
    </div>
  );
}
