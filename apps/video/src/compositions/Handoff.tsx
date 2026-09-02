import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Frame, LoopBody } from "../ui/Frame";
import { Bubble, MonoLabel } from "../ui/Chat";
import { EASE_OUT, fontMono, palettes, type LoopProps } from "../theme";

const CONTEXTO = [
  { etiqueta: "score", valor: "82 / 100" },
  { etiqueta: "interés", valor: "Compresor 5 HP · 300 L" },
  { etiqueta: "motivo", valor: "Pide descuento por volumen" },
  { etiqueta: "historial", valor: "9 mensajes · 4 min" },
];

export const Handoff: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  return (
    <Frame theme={theme} title="handoff — entra tu equipo" padding={36}>
      <LoopBody>
        <div style={{ display: "flex", gap: 30 }}>
          <Interactive.Div name="Chat" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <MonoLabel theme={theme} at={4}>
              // esto ya no le toca al agente
            </MonoLabel>

            <Bubble
              theme={theme}
              at={12}
              fontSize={21}
              turn={{ role: "cliente", text: "Si llevo cuatro, ¿me dejas el precio en 16 mil cada uno?" }}
            />

            {/* Aviso de escalamiento */}
            <Interactive.Div
              name="AvisoEscalamiento"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 20px",
                borderRadius: 12,
                border: `1px solid ${p.accent}`,
                backgroundColor: p.surface,
                opacity: interpolate(frame, [56, 70], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                }),
                translate: interpolate(frame, [56, 74], ["0px 10px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                }),
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: p.accent,
                  opacity: interpolate(frame % 40, [0, 20, 40], [0.35, 1, 0.35]),
                }}
              />
              <span style={{ fontFamily: fontMono, fontSize: 17, color: p.foreground }}>
                autoriza descuentos → pasa a una persona
              </span>
            </Interactive.Div>

            <Bubble
              theme={theme}
              at={128}
              typeOver={34}
              fontSize={21}
              turn={{
                role: "agente",
                text: "Déjame confirmarlo con el área comercial, te contestan en un momento.",
              }}
            />
          </Interactive.Div>

          {/* Tarjeta que ve el humano */}
          <Interactive.Div
            name="TarjetaHumano"
            style={{
              width: 400,
              borderRadius: 16,
              border: `1px solid ${p.border}`,
              backgroundColor: p.surface,
              padding: 24,
              opacity: interpolate(frame, [82, 98], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_OUT),
              }),
              translate: interpolate(frame, [82, 104], ["18px 0px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_OUT),
              }),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  backgroundColor: p.foreground,
                  color: p.background,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fontMono,
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                MG
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 19, fontWeight: 600, color: p.foreground }}>Mariana G.</p>
                <span style={{ fontFamily: fontMono, fontSize: 14, color: p.muted }}>ventas · tomó el chat</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CONTEXTO.map((c, i) => (
                <div
                  key={c.etiqueta}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    paddingBottom: 12,
                    borderBottom: i === CONTEXTO.length - 1 ? "none" : `1px dashed ${p.border}`,
                    opacity: interpolate(frame, [104 + i * 12, 116 + i * 12], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  <span style={{ fontFamily: fontMono, fontSize: 15, color: p.muted }}>{c.etiqueta}</span>
                  <span style={{ fontSize: 16, fontWeight: 500, color: p.foreground, textAlign: "right" }}>
                    {c.valor}
                  </span>
                </div>
              ))}
            </div>
          </Interactive.Div>
        </div>
      </LoopBody>
    </Frame>
  );
};
