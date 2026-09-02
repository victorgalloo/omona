import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontMono, fontSans, palettes, type ThemeName, EASE_OUT } from "../theme";

/**
 * Chrome de terminal, el mismo lenguaje visual que ya usa la landing
 * (LandingHero.ChatDemo y LandingCrmEmbedded). El chrome nunca se desvanece:
 * lo que entra y sale es el contenido, para que el loop cierre sin salto.
 */
export const Frame: React.FC<{
  theme: ThemeName;
  title: string;
  children: React.ReactNode;
  padding?: number;
}> = ({ theme, title, children, padding = 44 }) => {
  const p = palettes[theme];

  return (
    <AbsoluteFill
      name="Fondo"
      style={{
        backgroundColor: p.background,
        fontFamily: fontSans,
        padding: 56,
        justifyContent: "center",
      }}
    >
      {/* Retícula decorativa, igual que el overlay del hero */}
      <AbsoluteFill
        name="Reticula"
        style={{
          opacity: 0.04,
          backgroundImage: `linear-gradient(${p.foreground} 1px, transparent 1px), linear-gradient(90deg, ${p.foreground} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <Interactive.Div
        name="Ventana"
        style={{
          border: `2px solid ${p.border}`,
          borderRadius: 0,
          overflow: "hidden",
          backgroundColor: p.background,
        }}
      >
        <Interactive.Div
          name="BarraTitulo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "20px 26px",
            borderBottom: `2px solid ${p.border}`,
          }}
        >
          <span style={{ fontFamily: fontMono, fontSize: 20, color: p.muted, letterSpacing: "0.08em" }}>
            {title}
          </span>
        </Interactive.Div>

        <div style={{ padding }}>{children}</div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

/**
 * Envoltura del contenido animado. Aparece al inicio y se retira al final,
 * de modo que el primer y el último frame son idénticos (opacidad 0).
 */
export const LoopBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <Interactive.Div
      name="ContenidoDelLoop"
      style={{
        opacity: interpolate(
          frame,
          [0, 7, durationInFrames - 14, durationInFrames - 1],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE_OUT) },
        ),
      }}
    >
      {children}
    </Interactive.Div>
  );
};
