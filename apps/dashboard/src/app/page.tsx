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
import { LandingPriceAdvantage } from '@/components/landing/LandingPriceAdvantage';
import { LandingPricing } from '@/components/landing/LandingPricing';
import { LandingUseCases } from '@/components/landing/LandingUseCases';
import { LandingFAQ } from '@/components/landing/LandingFAQ';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { FloatingCTA } from '@/components/landing/motion/FloatingCTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { es } from '@/lib/i18n';
import { Logo } from '../components/shared/Logo';

export const metadata: Metadata = {
  title: 'Omona | Agente de Ventas IA para WhatsApp | Mexico y LATAM',
  description:
    'Automatiza tus ventas por WhatsApp con inteligencia artificial. Omona responde clientes 24/7, califica leads y agenda citas. CRM integrado para pymes. Desde $499 MXN/mes. Prueba gratis 14 dias.',
  openGraph: {
    title: 'Omona | Agente de Ventas IA para WhatsApp | Mexico y LATAM',
    description:
      'Automatiza tus ventas por WhatsApp con IA. Omona responde 24/7, califica leads y agenda citas. CRM para pymes desde $499 MXN/mes.',
    locale: 'es_MX',
    type: 'website',
    url: 'https://omona.tech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona | Agente de Ventas IA para WhatsApp',
    description:
      'Automatiza tus ventas por WhatsApp con IA. Responde 24/7, califica leads y agenda citas. CRM para pymes en Mexico y LATAM.',
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
        'Omona es un agente de ventas con inteligencia artificial para WhatsApp. Automatiza la atencion al cliente, califica leads y agenda citas 24/7 para pymes en Mexico y Latinoamerica.',
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
        'Agente de ventas con IA para WhatsApp. Automatiza respuestas, califica leads y agenda citas. CRM integrado para pymes en Mexico y LATAM.',
      featureList: [
        'Respuesta automatica 24/7 por WhatsApp en segundos',
        'Calificacion de leads con IA (score 0-100)',
        'Agendamiento automatico de citas sin intervencion humana',
        'CRM integrado con pipeline Kanban',
        'Analytics de conversaciones y tasa de conversion',
        'Follow-up automatizado de leads inactivos',
        'Transferencia a agente humano (handoff) inteligente',
        'Transcripcion de mensajes de voz',
      ],
      offers: [
        {
          '@type': 'Offer',
          name: 'Starter',
          price: '499',
          priceCurrency: 'MXN',
          priceValidUntil: '2026-12-31',
          url: 'https://omona.tech/signup',
        },
        {
          '@type': 'Offer',
          name: 'Pro',
          price: '1499',
          priceCurrency: 'MXN',
          priceValidUntil: '2026-12-31',
          url: 'https://omona.tech/signup',
        },
      ],
      // Sin `aggregateRating`: no hay reseñas verificables que lo respalden, y
      // marcarlo de todas formas es justo lo que Google penaliza.
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
      name: 'Omona - Agente de Ventas IA para WhatsApp',
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

      <LandingCrmEmbedded />

      <LandingUseCases />

      <LandingHowItWorks />

      {/* El precio se compara antes de mostrarse: así la cifra de $499 llega
          con contexto en vez de sola. */}
      <LandingPriceAdvantage />

      <LandingPricing />

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
