import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Omona · laboratorio open source de Victor Gallo',
    short_name: 'Omona',
    description: 'Pull requests, reportes y notas de ingeniería de Victor Gallo sobre agentes de IA en Amazon Bedrock.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAFA',
    theme_color: '#FAFAFA',
    lang: 'es-MX',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { src: '/logo-mark.png', sizes: '128x128', type: 'image/png' },
      { src: '/logo-mark@2x.png', sizes: '256x256', type: 'image/png' },
    ],
  };
}
