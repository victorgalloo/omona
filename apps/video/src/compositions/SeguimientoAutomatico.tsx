import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Frame, LoopBody } from "../ui/Frame";
import { Bubble, MonoLabel } from "../ui/Chat";
import { EASE_OUT, fontMono, palettes, type LoopProps } from "../theme";

export const SeguimientoAutomatico: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  // El contador de horas es el corazón de este loop: muestra el tiempo muerto.
  const horas = Math.round(
    interpolate(frame, [50, 112], [0, 24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  return (
    <Frame theme={theme} title="seguimiento — la conversación no se enfría" padding={40}>
      <LoopBody>
        <Interactive.Div name="Flujo" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <MonoLabel theme={theme} at={4}>
            // el cliente dejó de contestar
          </MonoLabel>

          <Bubble
            theme={theme}
            at={12}
            fontSize={23}
            turn={{ role: "agente", text: "Te dejo la cotización. ¿La reviso contigo el jueves?" }}
          />

          {/* Separador con el reloj corriendo */}
          <Interactive.Div
            name="TiempoMuerto"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "6px 0",
              opacity: interpolate(frame, [44, 56], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <div style={{ flex: 1, height: 1, borderTop: `1px dashed ${p.border}` }} />
            <span
              style={{
                fontFamily: fontMono,
                fontSize: 20,
                color: horas >= 24 ? p.accent : p.muted,
                whiteSpace: "nowrap",
              }}
            >
              sin respuesta · {horas} h
            </span>
            <div style={{ flex: 1, height: 1, borderTop: `1px dashed ${p.border}` }} />
          </Interactive.Div>

          {/* Disparo del follow-up */}
          <Interactive.Div
            name="Disparo"
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderRadius: 999,
              border: `1px solid ${p.accent}`,
              backgroundColor: p.surface,
              opacity: interpolate(frame, [112, 124, 150, 160], [0, 1, 1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE_OUT),
              }),
            }}
          >
            <span style={{ fontFamily: fontMono, fontSize: 16, color: p.accent }}>
              el agente retoma solo
            </span>
          </Interactive.Div>

          <Bubble
            theme={theme}
            at={140}
            typeOver={40}
            fontSize={23}
            turn={{
              role: "agente",
              text: "Ricardo, ¿seguimos con el compresor de 300 L? Si te urge para el jueves aparto el último que queda.",
            }}
          />
        </Interactive.Div>
      </LoopBody>
    </Frame>
  );
};
