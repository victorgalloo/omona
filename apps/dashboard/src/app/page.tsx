import type { Metadata } from 'next';
import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingFeatures } from '@/components/landing/LandingFeatures';
import { LandingCrmEmbedded } from '@/components/landing/LandingCrmEmbedded';
import { LandingHowItWorks } from '@/components/landing/LandingHowItWorks';
import { LandingStats } from '@/components/landing/LandingStats';
import { LandingPricing } from '@/components/landing/LandingPricing';
import { LandingUseCases } from '@/components/landing/LandingUseCases';
import { LandingCTA } from '@/components/landing/LandingCTA';
import { JsonLd } from '@/components/seo/JsonLd';
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
        'Respuesta automatica 24/7 por WhatsApp en menos de 1 segundo',
        'Calificacion de leads con IA (score 0-100)',
        'Agendamiento automatico de citas sin intervencion humana',
        'CRM integrado con pipeline Kanban',
        'Analytics de conversaciones y tasa de conversion',
        'Follow-up automatizado de leads inactivos',
        'Transferencia a agente humano (handoff) inteligente',
        'Transcripcion de mensajes de voz con Whisper AI',
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
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '200',
        bestRating: '5',
        worstRating: '1',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Que es Omona?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Omona es un agente de ventas con inteligencia artificial que se conecta a tu WhatsApp Business. Responde automaticamente a tus clientes en menos de 1 segundo, califica leads con un score de 0 a 100, agenda citas y gestiona tu pipeline de ventas las 24 horas del dia, los 7 dias de la semana. Segun estudios de Harvard Business Review, las empresas que responden en menos de 5 minutos tienen 9 veces mas probabilidades de convertir un lead. Omona responde en 0.8 segundos.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuanto cuesta Omona?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Omona ofrece un plan Starter desde $499 MXN/mes (~$25 USD) y un plan Pro desde $1,499 MXN/mes (~$75 USD). Ambos incluyen prueba gratuita de 14 dias sin necesidad de tarjeta de credito. El ROI promedio de nuestros clientes es de 8x en los primeros 3 meses gracias al incremento en leads calificados y la reduccion de tiempo de respuesta.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Como funciona Omona?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El proceso tiene 3 pasos: 1) Conectas tu WhatsApp escaneando un codigo QR (5 minutos de configuracion). 2) Configuras tus productos, servicios y personalidad del agente. 3) Omona empieza a atender el 100% de tus leads automaticamente. Usa modelos de lenguaje avanzados para mantener conversaciones naturales en espanol, califica leads con un score de 0-100, y agenda citas directamente en tu calendario sin intervencion humana.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Omona funciona en Mexico y Latinoamerica?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Si, Omona esta disenado especificamente para el mercado de Mexico y LATAM. Responde en espanol con contexto cultural local, maneja precios en MXN, COP, ARS, CLP y otras monedas de la region. Mas de 200 empresas en Mexico, Colombia, Argentina, Chile y Peru ya usan Omona para automatizar sus ventas por WhatsApp.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Necesito tarjeta de credito para probar Omona?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No, puedes iniciar tu prueba gratuita de 14 dias sin tarjeta de credito. Solo necesitas un correo electronico y un numero de WhatsApp. El setup tarda menos de 5 minutos y puedes cancelar en cualquier momento.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Omona puede transferir la conversacion a un humano?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Si. Cuando un lead esta listo para cerrar o tiene una consulta compleja, Omona detecta automaticamente el momento adecuado y transfiere la conversacion a un agente humano con todo el contexto: historial completo, score del lead, informacion extraida y razon del traspaso. El equipo de ventas recibe una notificacion inmediata y puede continuar la conversacion directamente desde el dashboard.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Que pasa si el cliente escribe fuera del horario de negocio?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Omona responde las 24 horas del dia. Puedes configurar un mensaje especial para fuera de horario o permitir que el agente IA continue atendiendo y calificando leads en todo momento. Los negocios que atienden fuera de horario capturan en promedio un 35% mas de oportunidades segun datos internos de Omona.',
          },
        },
      ],
    },
    {
      '@type': 'WebPage',
      name: 'Omona - Agente de Ventas IA para WhatsApp',
      url: 'https://omona.tech',
      inLanguage: 'es-MX',
      datePublished: '2025-01-01',
      dateModified: '2026-03-26',
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

      <LandingStats />

      <LandingFeatures />

      <LandingCrmEmbedded />

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-border" /></div>

      <LandingUseCases />

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-border" /></div>

      <LandingHowItWorks />

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-border" /></div>

      <LandingPricing />

      <div className="max-w-5xl mx-auto px-4"><div className="border-t border-dashed border-border" /></div>

      <LandingCTA />

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-1.5">
              <Logo size={24} className="shrink-0 text-foreground" />
              <span className="font-mono font-semibold text-lg text-foreground ml-2">omona_</span>
            </div>
            <div className="flex gap-6 text-sm text-muted">
              <Link href="/login" className="hover:text-foreground transition-colors">Iniciar sesión</Link>
              <Link href="/signup" className="hover:text-foreground transition-colors">Registrarse</Link>
              <Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link>
              <Link href="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link href="/terminos" className="hover:text-foreground transition-colors">Términos de uso</Link>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted">© {new Date().getFullYear()} omona by anthana · made with ♥ in méxico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
