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
        {/* Logo dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#FF5F56' }} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#27C93F' }} />
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 48, color: '#FAFAFA', marginLeft: 12 }}>
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
