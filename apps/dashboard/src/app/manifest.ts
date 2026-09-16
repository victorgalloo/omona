import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omona - Sistemas a la medida para vender por WhatsApp',
    short_name: 'Omona',
    description: 'Te construyo el sistema que contesta, da seguimiento y captura solo, sobre el WhatsApp que ya usas.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0C0C0C',
    theme_color: '#0C0C0C',
    lang: 'es-MX',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { src: '/logo-mark.png', sizes: '128x128', type: 'image/png' },
      { src: '/logo-mark@2x.png', sizes: '256x256', type: 'image/png' },
    ],
  };
}
