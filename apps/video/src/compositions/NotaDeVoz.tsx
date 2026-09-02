import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Frame, LoopBody } from "../ui/Frame";
import { Bubble, MonoLabel } from "../ui/Chat";
import { EASE_OUT, fontMono, palettes, type LoopProps } from "../theme";

/** Alturas fijas: una onda que se ve real sin depender de aleatoriedad. */
const ONDA = [14, 26, 38, 22, 46, 34, 52, 30, 44, 20, 36, 48, 24, 40, 18, 32, 44, 26, 38, 16, 28, 42, 22, 34];
const TRANSCRIPCION =
  "Oye, quiero saber si me pueden entregar en Mérida y si aceptan factura, es para el taller";

export const NotaDeVoz: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  const chars = Math.round(
    interpolate(frame, [86, 148], [0, TRANSCRIPCION.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  return (
    <Frame theme={theme} title="whatsapp — nota de voz" padding={40}>
      <LoopBody>
        <Interactive.Div name="Flujo" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <MonoLabel theme={theme} at={4}>
            // 0:14 de audio. nadie lo va a escuchar dos veces.
          </MonoLabel>

          {/* Burbuja de audio con la onda reproduciéndose */}
          <Interactive.Div
            name="BurbujaAudio"
            style={{
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "20px 26px",
              borderRadius: 22,
              backgroundColor: p.foreground,
              opacity: interpolate(frame, [12, 24], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_OUT),
              }),
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                backgroundColor: p.background,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderLeft: `14px solid ${p.foreground}`,
                  marginLeft: 4,
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, height: 56 }}>
              {ONDA.map((alto, i) => {
                // La cabeza de reproducción avanza barra por barra
                const leido = interpolate(frame, [24, 84], [0, ONDA.length], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: alto,
                      borderRadius: 999,
                      backgroundColor: p.background,
                      opacity: i < leido ? 1 : 0.32,
                    }}
                  />
                );
              })}
            </div>
            <span style={{ fontFamily: fontMono, fontSize: 16, color: p.background, opacity: 0.7 }}>0:14</span>
          </Interactive.Div>

          {/* Transcripción */}
          <Interactive.Div
            name="Transcripcion"
            style={{
              alignSelf: "flex-end",
              maxWidth: "82%",
              padding: "16px 22px",
              borderRadius: 16,
              border: `1px dashed ${p.border}`,
              backgroundColor: p.surface,
              opacity: interpolate(frame, [80, 92], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_OUT),
              }),
            }}
          >
            <span style={{ fontFamily: fontMono, fontSize: 15, color: p.accent }}>transcrito</span>
            <p style={{ margin: "8px 0 0", fontSize: 22, lineHeight: 1.45, color: p.foreground, minHeight: 64 }}>
              {TRANSCRIPCION.slice(0, chars)}
            </p>
          </Interactive.Div>

          <Bubble
            theme={theme}
            at={158}
            typeOver={42}
            fontSize={23}
            turn={{
              role: "agente",
              text: "Sí, entregamos en Mérida en 48 h y facturamos. ¿Me pasas tu RFC para dejar la factura lista?",
            }}
          />
        </Interactive.Div>
      </LoopBody>
    </Frame>
  );
};
