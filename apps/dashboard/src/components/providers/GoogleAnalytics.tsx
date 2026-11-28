'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Google Analytics 4 (propiedad «omona.tech», flujo «omona.tech web»). El ID de
// medición es público: viaja en el HTML de cualquier sitio que use GA.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-YSX0GFQS97';

// Solo se mide el sitio público. El panel (login, inbox, leads…) queda fuera:
// lo que pasa ahí dentro no es tráfico de marketing ni debe salir a terceros.
const PRIVADAS = [
  '/login', '/signup', '/forgot-password', '/auth', '/onboarding', '/admin',
  '/analytics', '/broadcast', '/calendar', '/handoff', '/inbox', '/leads',
  '/settings', '/tasks', '/test',
];

const esPrivada = (ruta: string) => PRIVADAS.some((p) => ruta === p || ruta.startsWith(`${p}/`));

export function GoogleAnalytics() {
  const pathname = usePathname() || '/';
  const privada = esPrivada(pathname);

  // Interruptor oficial de GA (`ga-disable-<ID>`). Se fija durante el render,
  // antes de que Next escriba la nueva URL en el historial, para que la vista
  // de página automática de una ruta privada nunca llegue a enviarse.
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = privada;
  }

  if (!GA_ID || privada) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { allow_google_signals: false, allow_ad_personalization_signals: false });`}
      </Script>
    </>
  );
}
