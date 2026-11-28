import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from 'sonner';
import { PHProvider } from '@/components/providers/PostHogProvider';
import { PostHogPageView } from '@/components/providers/PostHogPageView';
import { GoogleAnalytics } from '@/components/providers/GoogleAnalytics';
import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

// Geist Sans (texto) y Geist Mono (rótulos, metadatos, código), paquete npm
// `geist` (OFL), self-hosted por next/font/local. Exponen --font-geist-sans y
// --font-geist-mono; tailwind.config.ts y globals.css leen esas variables.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omona.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // 22-nov-2026: omona.tech es el laboratorio open source de Victor Gallo, sin producto.
  title: {
    default: 'Omona · IA Bilingüe y Ciberseguridad en EE. UU.',
    template: '%s | Omona',
  },
  description:
    'Agentes comerciales de IA bilingües y ciberseguridad para negocios latinos en EE. UU., sobre AWS Bedrock y código abierto.',
  keywords: [
    'negocios latinos en Estados Unidos',
    'ciberseguridad para pequeñas empresas',
    'bilingual AI agents',
    'hispanic small business cybersecurity',
    'FTC Safeguards Rule',
    'Amazon Bedrock',
    'Hermes Agent',
    'Strands Agents',
    'Victor Gallo',
  ],
  authors: [{ name: 'Victor Gallo', url: 'https://victorgallo.com' }],
  creator: 'Victor Gallo',
  openGraph: {
    title: 'Omona · IA Bilingüe y Ciberseguridad en EE. UU.',
    description:
      'Agentes de IA bilingües (español e inglés) y ciberseguridad defensiva para dueños de negocios hispanos en Estados Unidos.',
    siteName: 'Omona',
    locale: 'es_US',
    alternateLocale: ['en_US', 'es_MX'],
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona · IA Bilingüe y Ciberseguridad en EE. UU.',
    description:
      'Agentes de IA bilingües (español e inglés) y ciberseguridad defensiva para dueños de negocios hispanos en Estados Unidos.',
  },
  // Sin canonical ni hreflang aquí: cada página pública declara los suyos. Si la
  // raíz los define, las páginas noindex (privacidad, términos, login, 404)
  // heredan «canonical = portada» y Google mezcla su noindex con la portada.
  alternates: {
    types: {
      'application/rss+xml': [
        { url: '/blog/rss.xml', title: 'Omona · Notas de ingeniería' },
        { url: '/now/rss.xml', title: 'Victor Gallo · Ahora' },
      ],
      'text/plain': [{ url: '/llms.txt', title: 'llms.txt' }],
    },
  },
  // verification: { google: 'PEGAR_TOKEN_AQUI' },
  icons: {
    icon: '/icon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeScript />
        <GoogleAnalytics />
        <LanguageProvider>
        <PHProvider>
          <PostHogPageView />
          {children}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--foreground)',
              },
            }}
          />
        </PHProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

function ThemeScript() {
  // Tema claro único (DESIGN_SYSTEM.md, 22-nov-2026). El oscuro se retiró del
  // marketing junto con su interruptor: el sistema es papel blanco. Si algún
  // navegador trae 'dark' guardado de antes, se ignora.
  const script = `
    (function() {
      var root = document.documentElement;
      root.setAttribute('data-theme', 'light');
      // Marca que hay JavaScript, y por tanto que el IntersectionObserver de
      // components/home/Reveal.tsx va a poder revelar el contenido. Sólo con
      // esta clase presente esconde CSS los bloques [data-reveal]: el fallo
      // tiene que ser hacia visible.
      try {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          root.classList.add('js-reveal');
        }
      } catch(e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
