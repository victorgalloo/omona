import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omona - Agente de Ventas IA para WhatsApp',
    short_name: 'Omona',
    description: 'Automatiza tus ventas por WhatsApp con inteligencia artificial. CRM integrado para pymes en Mexico y LATAM.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0C0C',
    theme_color: '#27C93F',
    lang: 'es-MX',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
