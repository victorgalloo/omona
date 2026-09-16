import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omona - Socio tecnico de delivery para automatizaciones Claude',
    short_name: 'Omona',
    description: 'Construimos, endurecemos y transferimos automatizaciones basadas en Claude. De prototipo a produccion.',
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
