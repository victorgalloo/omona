import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { PHProvider } from '@/components/providers/PostHogProvider';
import { PostHogPageView } from '@/components/providers/PostHogPageView';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { GlobalThemeToggle } from '@/components/shared/GlobalThemeToggle';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// tailwind.config.ts ya declaraba JetBrains Mono, pero nunca se cargaba:
// las etiquetas font-mono caían al monoespaciado del sistema.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omona.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Omona | Prospectar, seguir y cerrar sin capturar nada',
    template: '%s | Omona',
  },
  description:
    'Agentes que arman la lista, extraen lo que se dijo en cada llamada y lo escriben en tu CRM, y preparan la propuesta. Probados antes de hablar con un cliente.',
  // Las palabras con las que el comprador describe su problema, no las de la
  // categoria. Google ya no las usa para rankear, pero siguen siendo contexto
  // para los motores generativos, que es donde se juega este sitio.
  keywords: [
    'automatizar la prospeccion b2b',
    'ia para seguimiento comercial',
    'transcribir llamadas de ventas al crm',
    'llenar el crm sin captura manual',
    'generar propuestas comerciales con ia',
    'agentes de ia para ventas consultivas',
    'evaluar agentes de ia antes de produccion',
    'automatizar el proceso comercial a la medida',
  ],
  authors: [{ name: 'Omona' }],
  openGraph: {
    title: 'Omona | Prospectar, seguir y cerrar sin capturar nada',
    description:
      'El pipeline no se cae, se olvida. Agentes que prospectan, dan seguimiento y preparan el cierre.',
    siteName: 'Omona',
    locale: 'es_MX',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@omona_lat',
    title: 'Omona | Prospectar, seguir y cerrar sin capturar nada',
    description:
      'El pipeline no se cae, se olvida. Agentes que prospectan, dan seguimiento y preparan el cierre.',
  },
  alternates: {
    canonical: '/',
  },
  // El token de Search Console va aqui cuando exista. Next lo emite como
  // <meta name="google-site-verification">, que es el metodo que no depende
  // de subir un archivo ni de tocar el DNS.
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
    <html lang="es" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeScript />
        <LanguageProvider>
        <PHProvider>
          <PostHogPageView />
          <GlobalThemeToggle />
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
  // Oscuro por omisión. El sitio se rediseñó sobre negro (Vercel/Supabase), así
  // que el claro pasó a ser la preferencia explícita del visitante y no el
  // punto de partida: antes este script FORZABA 'light' y lo escribía en
  // localStorage, de modo que ningún visitante nuevo podía ver el tema base.
  const script = `
    (function() {
      var root = document.documentElement;
      try {
        var theme = localStorage.getItem('omona-theme');
        root.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
      } catch(e) {
        root.setAttribute('data-theme', 'dark');
      }
      // Marca que hay JavaScript, y por tanto que el IntersectionObserver de
      // components/home/Reveal.tsx va a poder revelar el contenido. Sólo con
      // esta clase presente esconde CSS los bloques [data-reveal].
      //
      // Va aquí y no en el componente por el orden de pintado: puesto desde
      // React, el contenido aparecería, se escondería y volvería a aparecer.
      // Y puesto siempre, sin esta condición, un visitante sin JS se quedaría
      // con la página en blanco — el fallo tiene que ser hacia visible.
      try {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          root.classList.add('js-reveal');
        }
      } catch(e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
