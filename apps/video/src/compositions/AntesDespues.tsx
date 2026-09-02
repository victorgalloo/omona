import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE_OUT, fontMono, fontSans, palettes, type LoopProps } from "../theme";

const ANTES = [
  "Contestas a las 11 de la noche.",
  "El que preguntó el lunes ya compró en otro lado.",
  "Cotizas lo mismo veinte veces al día.",
  "Nadie sabe en qué quedó ese chat.",
];

const DESPUES = [
  "Contesta él, a la hora que sea.",
  "Nadie espera. Se responde en segundos.",
  "Cotiza con tu catálogo real.",
  "Todo queda en el CRM, solo.",
];

/**
 * El antes/después que la landing no tenía. También sirve de imagen OG:
 * en un frame se entiende la transformación completa.
 */
export const AntesDespues: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const salida = durationInFrames - 26;

  return (
    <AbsoluteFill
      name="Fondo"
      style={{
        backgroundColor: p.background,
        fontFamily: fontSans,
        padding: 56,
        flexDirection: "row",
        gap: 28,
        alignItems: "stretch",
      }}
    >
      {/* Antes */}
      <Interactive.Div
        name="ColumnaAntes"
        style={{
          flex: 1,
          borderRadius: 24,
          border: `1px dashed ${p.border}`,
          backgroundColor: p.surface,
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <span style={{ fontFamily: fontMono, fontSize: 19, color: p.muted }}>sin omona</span>
        <h2 style={{ margin: 0, fontSize: 46, lineHeight: 1.05, fontWeight: 700, color: p.foreground }}>
          Tú eres el chat
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 4 }}>
          {ANTES.map((linea, i) => (
            <div
              key={linea}
              style={{
                display: "flex",
                gap: 14,
                opacity: interpolate(
                  frame,
                  [10 + i * 10, 24 + i * 10, salida, salida + 18],
                  [0, 1, 1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE_OUT) },
                ),
              }}
            >
              <span style={{ fontFamily: fontMono, fontSize: 22, color: p.muted, lineHeight: 1.4 }}>×</span>
              <span style={{ fontSize: 22, lineHeight: 1.4, color: p.muted }}>{linea}</span>
            </div>
          ))}
        </div>
      </Interactive.Div>

      {/* Después: entra encima, como la tarjeta verde de ManyChat */}
      <Interactive.Div
        name="ColumnaDespues"
        style={{
          flex: 1,
          borderRadius: 24,
          border: `1px solid ${p.accent}`,
          backgroundColor: p.background,
          boxShadow: p.shadow,
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 26,
          opacity: interpolate(frame, [70, 92, salida, salida + 22], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE_OUT),
          }),
          translate: interpolate(frame, [70, 100], ["46px 0px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE_OUT),
          }),
        }}
      >
        <span style={{ fontFamily: fontMono, fontSize: 19, color: p.accent }}>con omona</span>
        <h2 style={{ margin: 0, fontSize: 46, lineHeight: 1.05, fontWeight: 700, color: p.foreground }}>
          El chat trabaja solo
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 4 }}>
          {DESPUES.map((linea, i) => (
            <div
              key={linea}
              style={{
                display: "flex",
                gap: 14,
                opacity: interpolate(
                  frame,
                  [104 + i * 12, 120 + i * 12, salida, salida + 14],
                  [0, 1, 1, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...EASE_OUT) },
                ),
                translate: interpolate(frame, [104 + i * 12, 124 + i * 12], ["-10px 0px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                }),
              }}
            >
              <span style={{ fontSize: 22, color: p.accent, lineHeight: 1.4 }}>✓</span>
              <span style={{ fontSize: 22, lineHeight: 1.4, color: p.foreground }}>{linea}</span>
            </div>
          ))}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
