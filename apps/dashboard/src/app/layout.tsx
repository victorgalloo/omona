import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
    <html lang="es" data-theme="light" suppressHydrationWarning className={inter.variable}>
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
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('omona-theme');
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('omona-theme', 'light');
        }
      } catch(e) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
