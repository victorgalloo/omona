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
  title: 'Omona | Socio tecnico de delivery para automatizaciones Claude',
  description:
    'Llevamos automatizaciones Claude de prototipo a produccion: integraciones, permisos, aprobaciones, evaluaciones y transferencia a tu equipo. Para consultoras, agencias e integradores que ya vendieron el proyecto.',
  openGraph: {
    title: 'Omona | Socio tecnico de delivery para automatizaciones Claude',
    description:
      'De piloto a operacion real. Integraciones, controles y evaluaciones para agentes Claude, bajo tu marca o junto a tu equipo.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona | Socio tecnico de delivery para automatizaciones Claude',
    description:
      'De piloto a operacion real. Integraciones, controles y evaluaciones para agentes Claude, bajo tu marca o junto a tu equipo.',
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
        'Omona es un socio tecnico de delivery para consultoras, agencias e integradores que necesitan construir, endurecer y operar automatizaciones basadas en Claude para clientes de habla hispana.',
      // Sin `sameAs`: los siete perfiles que se declaraban (LinkedIn, GitHub,
      // G2, Capterra, Crunchbase, Product Hunt, AlternativeTo) devuelven 404.
      // Un sameAs a una pagina inexistente le dice a los motores que la entidad
      // no esta verificada, que es peor que no declarar ninguno. Se reponen
      // cuando existan las URLs reales.
      areaServed: [
        { '@type': 'Country', name: 'Mexico' },
        { '@type': 'Country', name: 'Espana' },
        { '@type': 'Country', name: 'Colombia' },
        { '@type': 'Country', name: 'Chile' },
        { '@type': 'Country', name: 'Argentina' },
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
      // Era `SoftwareApplication`: describia el producto de WhatsApp como la
      // oferta. Ahora la oferta es el servicio, y el producto es evidencia.
      '@type': 'ProfessionalService',
      name: 'Omona',
      url: 'https://omona.tech',
      inLanguage: 'es-MX',
      description:
        'Delivery tecnico de automatizaciones con Claude: descubrimiento del proceso, integraciones con CRM, ERP y SaaS, permisos y tool use, aprobaciones humanas, evaluaciones con datos reales, observabilidad y transferencia operativa al equipo del cliente.',
      serviceType: 'Implementacion de agentes y automatizaciones con IA',
      audience: {
        '@type': 'BusinessAudience',
        name: 'Consultoras de IA, agencias de automatizacion, software factories e integradores',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios de delivery',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Pilot-to-Production Sprint',
              description:
                'Un prototipo ya comprometido con un cliente se vuelve operable: manejo de errores, aprobaciones, permisos, logs, pruebas y documentacion.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'White-label Delivery Partner',
              description:
                'La consultora conserva la relacion comercial; Omona aporta arquitectura, construccion y hardening sin aparecer frente al cliente final.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Production Readiness Audit',
              description:
                'Diagnostico de riesgos de arquitectura, permisos, datos, evaluaciones y costo. Entregable: plan priorizado para llegar a produccion.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Claude Workflow Build',
              description:
                'Del proceso de negocio real a la operacion: descubrir, disenar, integrar, construir, probar y transferir.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Rescue & Hardening',
              description:
                'Estabilizacion de automatizaciones que ya fallan en produccion: respuestas inconsistentes, costos descontrolados e integraciones fragiles.',
            },
          },
        ],
      },
      // Sin `aggregateRating` ni `review`: no hay resenas verificables, y
      // marcarlas de todas formas es lo que Google penaliza. Sin `offers` con
      // precio: el alcance define la cifra y publicar una obligaria a inventarla.
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
      name: 'Omona - Socio tecnico de delivery para automatizaciones Claude',
      url: 'https://omona.tech',
      inLanguage: 'es-MX',
      datePublished: '2025-01-01',
      dateModified: '2026-09-15',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Omona',
        url: 'https://omona.tech',
      },
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
    <div className="min-h-screen bg-background font-sans text-foreground">
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
