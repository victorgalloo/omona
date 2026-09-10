import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingProof } from '@/components/landing/LandingProof';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingCrmEmbedded } from '@/components/landing/LandingCrmEmbedded';
import { LandingBeforeAfter } from '@/components/landing/LandingBeforeAfter';
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks';
import { LandingStats } from '@/components/landing/LandingStats';
import { LandingOfferStack } from '@/components/landing/LandingOfferStack';
import { LandingGuarantee } from '@/components/landing/LandingGuarantee';
import { LandingUseCases } from '@/components/landing/LandingUseCases';
import { LandingFAQ } from '@/components/landing/LandingFAQ';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { FloatingCTA } from '@/components/landing/motion/FloatingCTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { es } from '@/lib/i18n';
import { Logo } from '../components/shared/Logo';

export const metadata: Metadata = {
  title: 'Omona | Inteligencia Comercial con IA para Equipos B2B | Mexico',
  description:
    'Inteligencia comercial para equipos B2B que venden por WhatsApp. Cada conversacion entra sola al CRM, con su proxima tarea, responsable y fecha. Implementacion en 6 semanas con piloto garantizado.',
  openGraph: {
    title: 'Omona | Inteligencia Comercial con IA para Equipos B2B | Mexico',
    description:
      'Inteligencia comercial para equipos B2B que venden por WhatsApp. Cada conversacion entra sola al CRM, con su proxima tarea, responsable y fecha.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona | Inteligencia Comercial con IA para Equipos B2B',
    description:
      'Inteligencia comercial para equipos B2B que venden por WhatsApp. Cada conversacion entra sola al CRM, con tarea, responsable y fecha.',
  },
  alternates: {
    canonical: 'https://omona.tech',
  },
};

/**
 * El FAQPage sale del mismo `es.faq.items` que renderiza LandingFAQ. Antes eran
 * dos listas separadas y se contradecían: el JSON-LD seguía afirmando "más de
 * 200 empresas" y un ROI de 8x que el copy visible ya había retirado por no
 * poder sostenerlos. Con una sola fuente eso no puede volver a pasar.
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
        'Omona es una plataforma de inteligencia comercial con IA conversacional para equipos B2B. Convierte las conversaciones de WhatsApp en registros de CRM, tareas de seguimiento y borradores de propuesta para pymes en Mexico y Latinoamerica.',
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
        'Plataforma de inteligencia comercial con IA conversacional. Extrae necesidades, presupuesto, objeciones y proximos pasos de cada conversacion, actualiza el CRM y genera tareas y borradores de propuesta.',
      featureList: [
        'Captura de conversaciones de WhatsApp, correo y calendario en un solo lugar',
        'Extraccion estructurada de necesidades, presupuesto, objeciones y proximos pasos',
        'Actualizacion automatica del CRM sin captura manual',
        'Tareas de seguimiento con responsable y fecha',
        'Escalamiento a direccion cuando la oportunidad se estanca',
        'Borradores de propuesta con catalogo y precios aprobados',
        'Tablero de pipeline para direccion comercial',
        'Transcripcion de mensajes de voz',
      ],
      // Sin `offers`: la pagina ya no publica precio, y dejar las cifras aqui
      // haria que buscadores y asistentes citaran un numero que el visitante no
      // ve en ningun lado. Sin `aggregateRating` tampoco: no hay resenas
      // verificables, y marcarlo de todas formas es lo que Google penaliza.
    },
    {
      '@type': 'Service',
      name: 'Inteligencia Comercial en 6 Semanas',
      serviceType: 'Inteligencia comercial con IA conversacional',
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
      name: 'Omona - Inteligencia Comercial con IA para Equipos B2B',
      url: 'https://omona.tech',
      inLanguage: 'es-MX',
      datePublished: '2025-01-01',
      dateModified: '2026-09-01',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Omona',
        url: 'https://omona.tech',
      },
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', '#hero-description', '#stats-section'],
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <JsonLd data={jsonLdGraph} />
      <LandingNav />

      <LandingHero />

      {/* La prueba va inmediatamente después del hero, donde ManyChat pone a
          sus creadores: es el punto en que el visitante decide si sigue leyendo. */}
      <LandingProof />

      <LandingStats />

      {/* Antes/después antes de las features: primero la transformación, luego
          el detalle de cómo se logra. */}
      <LandingBeforeAfter />

      <LandingFeatures />

      {/* Qué se implementa (núcleo + bonos) antes del CRM: primero la pieza que
          no se puede comparar contra un chatbot, luego dónde aterriza. */}
      <LandingOfferStack />

      <LandingCrmEmbedded />

      <LandingHowItWorks />

      {/* La garantía va justo después del proceso: es la respuesta inmediata a
          "¿y si no funciona?", que es lo que uno se pregunta al terminar de leer
          las seis semanas. Aquí vivían la comparativa de precios y los planes;
          ambas se retiraron de la home a propósito. Poner la cifra al lado de
          la de los competidores convertía la decisión en una de precio, que es
          la única que no queremos que el prospecto tome. Los componentes siguen
          en el repo por si se revierte. */}
      <LandingGuarantee />

      <LandingUseCases />

      <LandingFAQ />

      <LandingCTA />

      <FloatingCTA label={es.nav.signup} />

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="bg-ink py-16 text-bone">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-1.5">
              <Logo size={24} className="shrink-0 text-bone" />
              <span className="font-mono font-semibold text-lg text-bone ml-2">omona_</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-bone/70">
              <Link href="/login" className="transition-colors hover:text-bone">Iniciar sesión</Link>
              <Link href="/signup" className="transition-colors hover:text-bone">Registrarse</Link>
              <Link href="/demo" className="transition-colors hover:text-bone">Demo</Link>
              <Link href="/privacidad" className="transition-colors hover:text-bone">Privacidad</Link>
              <Link href="/terminos" className="transition-colors hover:text-bone">Términos de uso</Link>
            </div>
          </div>

          {/* Columna de problemas, el equivalente a la de ManyChat: páginas
              nombradas con las palabras del cliente, no con las nuestras. */}
          <div className="mt-12 border-t border-bone/20 pt-8">
            <p className="mb-4 text-center font-mono text-xs text-bone/60">problemas_</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-bone/70">
              {es.problems.items.map((problem) => (
                <Link
                  key={problem.slug}
                  href={`/problemas/${problem.slug}`}
                  className="transition-colors hover:text-bone"
                >
                  {problem.short}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-bone/60">© {new Date().getFullYear()} omona by anthana · made with ♥ in méxico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
