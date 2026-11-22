import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from 'sonner';
import { PHProvider } from '@/components/providers/PostHogProvider';
import { PostHogPageView } from '@/components/providers/PostHogPageView';
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
    default: 'Omona · laboratorio open source de Victor Gallo',
    template: '%s | Omona',
  },
  description:
    'Pull requests, reportes y notas de ingeniería de Victor Gallo sobre agentes de IA en Amazon Bedrock, Hermes Agent y Strands Agents.',
  keywords: ['Victor Gallo', 'open source', 'Hermes Agent', 'Strands Agents', 'Amazon Bedrock', 'agentes de IA', 'pull requests'],
  authors: [{ name: 'Victor Gallo', url: 'https://victorgallo.com' }],
  creator: 'Victor Gallo',
  openGraph: {
    title: 'Omona · laboratorio open source de Victor Gallo',
    description: 'Agentes de IA en producción. Los arreglos, upstream: PRs, reportes y notas con su estado real en GitHub.',
    siteName: 'Omona',
    locale: 'es_MX',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Omona · laboratorio open source de Victor Gallo',
    description: 'Agentes de IA en producción. Los arreglos, upstream: PRs, reportes y notas con su estado real en GitHub.',
  },
  alternates: {
    canonical: '/',
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
