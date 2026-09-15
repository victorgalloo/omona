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
    default: 'Omona | Agente de Ventas IA para WhatsApp',
    template: '%s | Omona',
  },
  description:
    'Omona es el agente de ventas con IA para WhatsApp. Responde, califica leads y agenda citas 24/7. CRM integrado para pymes en Mexico y LATAM. Prueba gratis 14 dias.',
  keywords: [
    'agente de ventas IA WhatsApp',
    'chatbot ventas WhatsApp Mexico',
    'automatizacion ventas WhatsApp',
    'CRM WhatsApp IA',
    'bot ventas WhatsApp',
    'asistente virtual ventas',
    'WhatsApp CRM pymes Mexico',
    'chatbot WhatsApp para empresas',
  ],
  authors: [{ name: 'Omona' }],
  openGraph: {
    title: 'Omona | Agente de Ventas IA para WhatsApp',
    description:
      'Automatiza tus ventas por WhatsApp con inteligencia artificial. Responde clientes 24/7, califica leads y agenda citas. CRM integrado para pymes.',
    siteName: 'Omona',
    locale: 'es_MX',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@omona_lat',
    title: 'Omona | Agente de Ventas IA para WhatsApp',
    description:
      'Automatiza tus ventas por WhatsApp con IA. Responde 24/7, califica leads y agenda citas. CRM para pymes en Mexico y LATAM.',
  },
  alternates: {
    canonical: '/',
  },
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
