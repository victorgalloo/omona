import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Frame, LoopBody } from "../ui/Frame";
import { Bubble, MonoLabel } from "../ui/Chat";
import { EASE_OUT, fontMono, palettes, type LoopProps } from "../theme";

const HORARIOS = [
  { label: "jue 10:00", at: 76 },
  { label: "jue 16:00", at: 86 },
  { label: "vie 11:00", at: 96 },
];
/** El cliente escoge el segundo. */
const ELEGIDO = 1;
const DIAS = ["lun", "mar", "mié", "jue", "vie"];
const HORAS = ["10:00", "12:00", "14:00", "16:00"];

export const CitaAgendada: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  return (
    <Frame theme={theme} title="agenda — sin ida y vuelta" padding={36}>
      <LoopBody>
        <div style={{ display: "flex", gap: 32 }}>
          {/* Chat */}
          <Interactive.Div name="Chat" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <MonoLabel theme={theme} at={4}>
              // el cliente ya está listo
            </MonoLabel>

            <Bubble
              theme={theme}
              at={12}
              typeOver={34}
              fontSize={21}
              turn={{ role: "agente", text: "Tengo estos huecos esta semana. ¿Cuál te acomoda?" }}
            />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {HORARIOS.map((h, i) => (
                <Interactive.Div
                  key={h.label}
                  name={`Horario ${h.label}`}
                  style={{
                    fontFamily: fontMono,
                    fontSize: 18,
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: `1px solid ${i === ELEGIDO ? p.accent : p.border}`,
                    backgroundColor: p.surface,
                    color: p.foreground,
                    opacity: interpolate(frame, [h.at, h.at + 10], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(...EASE_OUT),
                    }),
                    // El elegido se hunde como si lo hubieran tocado
                    scale:
                      i === ELEGIDO
                        ? interpolate(frame, [118, 126, 136], [1, 0.94, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            output: "perceptual-scale",
                          })
                        : 1,
                  }}
                >
                  {h.label}
                </Interactive.Div>
              ))}
            </div>

            <Bubble theme={theme} at={126} fontSize={21} turn={{ role: "cliente", text: "El jueves a las 4" }} />

            <Bubble
              theme={theme}
              at={182}
              typeOver={40}
              fontSize={21}
              turn={{
                role: "agente",
                text: "Listo, quedó el jueves 16:00. Te mando recordatorio un día antes.",
              }}
            />
          </Interactive.Div>

          {/* Calendario */}
          <Interactive.Div
            name="Calendario"
            style={{
              width: 420,
              borderRadius: 16,
              border: `1px solid ${p.border}`,
              backgroundColor: p.surface,
              padding: 20,
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: `64px repeat(${DIAS.length}, 1fr)`, gap: 6 }}>
              <div />
              {DIAS.map((d) => (
                <span key={d} style={{ fontFamily: fontMono, fontSize: 15, color: p.muted, textAlign: "center" }}>
                  {d}
                </span>
              ))}

              {HORAS.map((hora, fila) => (
                <Interactive.Div key={hora} name={`Fila ${hora}`} style={{ display: "contents" }}>
                  <span style={{ fontFamily: fontMono, fontSize: 14, color: p.muted, paddingTop: 16 }}>{hora}</span>
                  {DIAS.map((dia) => {
                    // jueves 16:00 es la celda que se llena
                    const esLaCita = dia === "jue" && hora === "16:00";
                    return (
                      <div
                        key={dia + hora}
                        style={{
                          height: 48,
                          borderRadius: 8,
                          border: `1px solid ${p.border}`,
                          backgroundColor: esLaCita ? p.accent : p.background,
                          opacity: esLaCita
                            ? interpolate(frame, [150, 168], [0, 1], {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                                easing: Easing.bezier(...EASE_OUT),
                              })
                            : 1,
                          scale: esLaCita
                            ? interpolate(frame, [150, 172], [0.8, 1], {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                                easing: Easing.bezier(...EASE_OUT),
                                output: "perceptual-scale",
                              })
                            : 1,
                        }}
                      />
                    );
                  })}
                </Interactive.Div>
              ))}
            </div>

            <div
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: `1px dashed ${p.border}`,
                opacity: interpolate(frame, [172, 188], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <span style={{ fontFamily: fontMono, fontSize: 14, color: p.muted }}>cita confirmada</span>
              <p style={{ margin: "6px 0 0", fontSize: 19, fontWeight: 600, color: p.foreground }}>
                Ricardo Salas · jue 16:00
              </p>
            </div>
          </Interactive.Div>
        </div>
      </LoopBody>
    </Frame>
  );
};
