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
  title: 'Omona | Inteligencia comercial para todo el ciclo de venta B2B',
  description:
    'Prospeccion, seguimiento, cierre y propuestas sobre el mismo dato. Omona lee cada conversacion, llena tu CRM solo y entrega la siguiente jugada: a quien buscar hoy, con que mensaje y por que. Sobre el CRM que ya tienes.',
  openGraph: {
    title: 'Omona | Inteligencia comercial para todo el ciclo de venta B2B',
    description:
      'Prospeccion, seguimiento, cierre y propuestas sobre el mismo dato. Cada conversacion entra sola al CRM y sale una jugada con mensaje, responsable y fecha.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona | Inteligencia comercial para el ciclo de venta B2B',
    description:
      'Prospeccion, seguimiento, cierre y propuestas sobre el mismo dato. El CRM se llena solo y el motor dice a quien buscar hoy.',
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
        'Omona es una plataforma de inteligencia comercial para equipos B2B. Cubre el ciclo completo de venta —prospeccion, seguimiento, cierre y generacion de propuestas— leyendo las conversaciones del equipo y escribiendo de vuelta en el CRM que la empresa ya usa.',
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
      '@type': 'SoftwareApplication',
      name: 'Omona',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'es-MX',
      softwareVersion: '1.0',
      description:
        'Plataforma de inteligencia comercial que cubre el ciclo de venta completo: investiga cuentas antes del primer contacto, calcula el estado real de cada oportunidad y entrega una jugada al dia con el mensaje redactado, detecta objeciones y senales de compra, y genera borradores de propuesta a partir de la conversacion.',
      featureList: [
        'Prospeccion con investigacion de cuenta y angulo de entrada',
        'Motor de seguimiento por cohortes con reloj rapido y reloj lento',
        'Una jugada al dia con mensaje redactado, responsable y fecha',
        'Extraccion estructurada de necesidad, presupuesto, plazo, objecion y quien decide',
        'Escritura automatica en el CRM existente sin captura manual',
        'Deteccion de objeciones y senales de compra para el cierre',
        'Escalamiento a direccion cuando una oportunidad se estanca',
        'Generacion de borradores de propuesta y presentacion personalizados',
        'Validacion de cada mensaje contra el manual de voz de la empresa',
        'Medicion de tiempo al primer contacto, tasa de recuperacion y que guion convierte',
      ],
      // Sin `offers`: la pagina ya no publica precio, y dejar las cifras aqui
      // haria que buscadores y asistentes citaran un numero que el visitante no
      // ve en ningun lado. Sin `aggregateRating` tampoco: no hay resenas
      // verificables, y marcarlo de todas formas es lo que Google penaliza.
    },
    {
      '@type': 'Service',
      name: 'Inteligencia Comercial en 6 Semanas',
      serviceType: 'Inteligencia comercial para el ciclo de venta B2B',
      provider: { '@type': 'Organization', name: 'Omona', url: 'https://omona.tech' },
      areaServed: { '@type': 'Country', name: 'Mexico' },
      audience: {
        '@type': 'BusinessAudience',
        name: 'Equipos comerciales B2B de 3 a 20 vendedores',
      },
      description:
        'Implementacion de un sistema de inteligencia comercial en seis semanas: diagnostico y medicion de linea base, piloto de un flujo con revision humana, y corte contra la linea base. Si al terminar el CRM no refleja el 90% de las conversaciones comerciales y cada oportunidad abierta no tiene proxima tarea con responsable y fecha, se devuelve el 100% del piloto.',
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
      name: 'Omona - Inteligencia comercial para todo el ciclo de venta B2B',
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
