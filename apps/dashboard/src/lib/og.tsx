import { ImageResponse } from 'next/og';

/**
 * Tarjeta Open Graph del sistema claro (DESIGN_SYSTEM.md): papel #fafafa,
 * texto #171717, glyph negro, rótulos mono en mayúsculas, una línea del
 * gradiente espectro arriba como único acento decorativo. 1200×630.
 */
export const OG_SIZE = { width: 1200, height: 630 };

const GLYPH = 'M4.876 26.063A15 15 0 1 1 5.937 27.124L10.966 22.095A7.905 7.905 0 1 0 9.905 21.034Z';

export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const size = title.length > 70 ? 54 : title.length > 44 ? 64 : 76;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FAFAFA',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4, display: 'flex',
            background: 'linear-gradient(90deg, rgb(0,255,149), rgb(255,208,0), rgb(255,23,68), rgb(149,0,255), rgb(0,229,255))',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 32 32" fill="#000000">
            <path d={GLYPH} />
          </svg>
          <span style={{ fontSize: 34, color: '#171717', letterSpacing: '-1.5px' }}>omona</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 22, color: '#666666', letterSpacing: '1.6px', textTransform: 'uppercase' }}>
            {eyebrow}
          </span>
          <span style={{ fontSize: size, lineHeight: 1.02, color: '#171717', letterSpacing: `${-size * 0.05}px`, maxWidth: 1000 }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: 20, color: '#8F8F8F', letterSpacing: '1.4px', textTransform: 'uppercase' }}>
          <span>{footer ?? 'omona.tech'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#297A3A' }}>
            <svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 10.5l4 4 8-9" stroke="#297A3A" strokeWidth="2.4" fill="none" /></svg>
            omona.tech
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
