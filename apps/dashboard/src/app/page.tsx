import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeLeak } from '@/components/home/HomeLeak';
import { HomeCycle } from '@/components/home/HomeCycle';
import { HomeEngine } from '@/components/home/HomeEngine';
import { HomeIntel } from '@/components/home/HomeIntel';
import { HomeMeasure } from '@/components/home/HomeMeasure';
import { HomeScope } from '@/components/home/HomeScope';
import { HomeProcess } from '@/components/home/HomeProcess';
import { HomeGuarantee } from '@/components/home/HomeGuarantee';
import { HomeFaq } from '@/components/home/HomeFaq';
import { HomeCta } from '@/components/home/HomeCta';
import { HomeFooter } from '@/components/home/HomeFooter';
import { JsonLd } from '@/components/seo/JsonLd';
import { es } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Omona | Sistemas a la medida para negocios que venden por WhatsApp',
  description:
    'Te construyo el sistema que contesta, da seguimiento, captura solo y te dice como vas. Hecho para tu negocio, no una app que rentas. Cuentame tu caso sin costo.',
  openGraph: {
    title: 'Omona | Sistemas a la medida para negocios que venden por WhatsApp',
    description:
      'Vendes por WhatsApp y ahi se te pierde. Te construyo el sistema que lo arregla, a la medida de tu negocio.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona | Sistemas a la medida para negocios que venden por WhatsApp',
    description:
      'Vendes por WhatsApp y ahi se te pierde. Te construyo el sistema que lo arregla.',
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
        'Omona construye sistemas a la medida para negocios pequenos y medianos que venden por WhatsApp: respuesta automatica, seguimiento, captura de datos sin trabajo manual y tablero de resultados.',
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
        url: 'https://api.whatsapp.com/send?phone=529849800629',
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
        'Implementacion a la medida sobre el WhatsApp que el negocio ya usa. Se empieza por el problema que mas cuesta y se entrega funcionando, con las cuentas a nombre del cliente.',
      serviceType: 'Automatizacion de ventas por WhatsApp',
      audience: {
        '@type': 'BusinessAudience',
        name: 'Negocios de 2 a 20 personas que venden por WhatsApp',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Que se construye',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Respuesta automatica',
              description:
                'Contesta en segundos a cualquier hora, con el catalogo y los precios del negocio. Entiende notas de voz y escala a una persona cuando hace falta.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Seguimiento que no se olvida',
              description:
                'Retoma al cliente que dejo de contestar, avisa a quien hay que buscar hoy y agenda la cita dentro del mismo chat.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Captura automatica de datos',
              description:
                'Nombre, empresa, necesidad y presupuesto salen de la conversacion y entran al sistema del negocio sin que nadie los teclee.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Tablero de resultados',
              description:
                'Cuantos mensajes llegaron, cuantos se contestaron y en que punto se pierden los clientes, sin pedirle reportes a nadie.',
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
      dateModified: '2026-09-15',
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
 *   3. ciclo        las cuatro etapas — el corazón de la página
 *   4. motor        el seguimiento abierto, que es donde está la diferencia
 *   5. inteligencia de la conversación al dato (y aquí se menciona el chat)
 *   6. medición     cómo se sabe si funcionó, y la fuga en pesos
 *   7. alcance      lo que hace y, explícitamente, lo que no
 *   8. proceso      seis semanas
 *   9. garantía     la respuesta a "¿y si no funciona?"
 *  10. preguntas
 *  11. cierre
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
        <HomeCycle />
        <HomeEngine />
        <HomeIntel />
        <HomeMeasure />
        <HomeScope />
        <HomeProcess />
        <HomeGuarantee />
        <HomeFaq />
        <HomeCta />
      </main>

      <HomeFooter />
    </div>
  );
}
