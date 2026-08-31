import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Omona - Agente de Ventas IA para WhatsApp';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0C0C0C',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Marca Omona */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '32px' }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="#FAFAFA">
            <path d="M4.876 26.063A15 15 0 1 1 5.937 27.124L10.966 22.095A7.905 7.905 0 1 0 9.905 21.034Z" />
          </svg>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 48, color: '#FAFAFA' }}>
            omona_
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#FAFAFA',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          Agente de Ventas IA
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: '#27C93F',
            textAlign: 'center',
            lineHeight: 1.2,
            marginTop: 8,
          }}
        >
          para WhatsApp
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#8A8A8A',
            marginTop: 32,
            textAlign: 'center',
          }}
        >
          Responde, califica leads y agenda citas 24/7
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(to right, #FF5F56, #FFBD2E, #27C93F)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
