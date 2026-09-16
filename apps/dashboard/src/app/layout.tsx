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
    default: 'Omona | Socio tecnico de delivery para automatizaciones Claude',
    template: '%s | Omona',
  },
  description:
    'Omona construye, endurece y transfiere automatizaciones basadas en Claude para consultoras, agencias e integradores con clientes de habla hispana. De prototipo a produccion.',
  keywords: [
    'socio tecnico de delivery IA',
    'llevar piloto de IA a produccion',
    'partner white label automatizaciones IA',
    'implementacion de agentes Claude',
    'auditoria de agente IA en produccion',
    'integracion de Claude con CRM y ERP',
    'evaluaciones de agentes LLM',
    'human in the loop agentes IA',
  ],
  authors: [{ name: 'Omona' }],
  openGraph: {
    title: 'Omona | Socio tecnico de delivery para automatizaciones Claude',
    description:
      'De piloto a operacion real. Integraciones, permisos, aprobaciones, evaluaciones y transferencia a tu equipo. Bajo tu marca o junto a el.',
    siteName: 'Omona',
    locale: 'es_MX',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@omona_lat',
    title: 'Omona | Socio tecnico de delivery para automatizaciones Claude',
    description:
      'De piloto a operacion real. Integraciones, permisos, aprobaciones, evaluaciones y transferencia a tu equipo.',
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
