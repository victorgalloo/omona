import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Frame, LoopBody } from "../ui/Frame";
import { MonoLabel } from "../ui/Chat";
import { EASE_OUT, fontMono, palettes, type LoopProps } from "../theme";

/**
 * Las seis etapas REALES del pipeline, tal como están en
 * apps/dashboard/src/app/(dashboard)/leads/pipeline/page.tsx.
 * Antes aquí había cuatro inventadas ("Cita agendada", "Cliente") — enseñar un
 * pipeline que no es el nuestro es el mismo error que dejar las capturas de
 * Twenty. Si allá cambian las etapas, cambian aquí.
 */
const COLUMNAS = ["Nuevo", "Calificado", "Contactado", "Demo Agendada", "Convertido", "Perdido"];

/** Los campos se llenan en cascada: nadie los capturó, salieron de la conversación. */
const CAMPOS = [
  { etiqueta: "nombre", valor: "Ricardo Salas", at: 52 },
  { etiqueta: "empresa", valor: "Talleres Salas", at: 76 },
  { etiqueta: "teléfono", valor: "+52 999 412 8830", at: 100 },
  { etiqueta: "correo", valor: "ricardo@tallersalas.mx", at: 124 },
];

/** Ancho de columna y separación; la tarjeta viaja de la columna 0 a la 1. */
const COL_W = 168;
const GAP = 16;

export const CrmSeLlenaSolo: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  const score = Math.round(
    interpolate(frame, [148, 190], [0, 82], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...EASE_OUT),
    }),
  );

  return (
    <Frame theme={theme} title="crm.omona.tech — pipeline" padding={36}>
      <LoopBody>
        <Interactive.Div name="Tablero" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <MonoLabel theme={theme} at={4}>
            // el agente terminó de platicar. nadie capturó nada.
          </MonoLabel>

          <div style={{ display: "flex", gap: GAP, position: "relative" }}>
            {COLUMNAS.map((col, i) => (
              <Interactive.Div
                key={col}
                name={`Columna ${col}`}
                style={{
                  position: "relative",
                  width: COL_W,
                  minHeight: 372,
                  flexShrink: 0,
                  borderRadius: 16,
                  backgroundColor: p.surface,
                  border: `1px dashed ${p.border}`,
                  padding: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: fontMono,
                    fontSize: 13,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: p.foreground,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </span>
                {/* Resalta la columna destino cuando la tarjeta va a caer ahí */}
                {i === 1 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 16,
                      border: `2px solid ${p.accent}`,
                      opacity: interpolate(frame, [196, 210, 236, 250], [0, 0.6, 0.6, 0], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                      pointerEvents: "none",
                    }}
                  />
                )}
              </Interactive.Div>
            ))}

            {/* La tarjeta: aparece en Nuevo, se llena, y se muda a Calificado */}
            <Interactive.Div
              name="TarjetaLead"
              style={{
                position: "absolute",
                top: 46,
                left: 16,
                width: COL_W - 24,
                padding: 18,
                borderRadius: 14,
                backgroundColor: p.background,
                border: `1px solid ${p.border}`,
                boxShadow: p.shadow,
                opacity: interpolate(frame, [20, 34], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                }),
                scale: interpolate(frame, [20, 38], [0.92, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                  output: "perceptual-scale",
                }),
                translate: interpolate(frame, [200, 234], ["0px 0px", `${COL_W + GAP}px 0px`], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...EASE_OUT),
                }),
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {CAMPOS.map((campo) => (
                  <div key={campo.etiqueta} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ fontFamily: fontMono, fontSize: 13, color: p.muted }}>{campo.etiqueta}</span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: p.foreground,
                        opacity: interpolate(frame, [campo.at, campo.at + 12], [0, 1], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                          easing: Easing.bezier(...EASE_OUT),
                        }),
                        translate: interpolate(frame, [campo.at, campo.at + 14], ["-8px 0px", "0px 0px"], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                          easing: Easing.bezier(...EASE_OUT),
                        }),
                      }}
                    >
                      {campo.valor}
                    </span>
                    {/* Placeholder que se apaga en cuanto llega el dato real */}
                    <div
                      style={{
                        position: "relative",
                        marginTop: -22,
                        height: 12,
                        width: "62%",
                        borderRadius: 4,
                        backgroundColor: p.surface2,
                        opacity: interpolate(frame, [campo.at - 4, campo.at + 6], [1, 0], {
                          extrapolateLeft: "clamp",
                          extrapolateRight: "clamp",
                        }),
                      }}
                    />
                  </div>
                ))}

                <div
                  style={{
                    marginTop: 6,
                    paddingTop: 13,
                    borderTop: `1px solid ${p.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: interpolate(frame, [146, 158], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                  }}
                >
                  <span style={{ fontFamily: fontMono, fontSize: 13, color: p.muted }}>score</span>
                  <span style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700, color: p.accent }}>
                    {score}
                  </span>
                </div>
              </div>
            </Interactive.Div>
          </div>
        </Interactive.Div>
      </LoopBody>
    </Frame>
  );
};
