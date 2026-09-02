import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Frame, LoopBody } from "../ui/Frame";
import { MonoLabel } from "../ui/Chat";
import { EASE_OUT, fontMono, palettes, type LoopProps } from "../theme";

/**
 * Las tres vistas de NUESTRO dashboard, sustituyendo las capturas de Twenty
 * que la landing venía mostrando. Se dibujan aquí en vez de capturarse porque
 * así no hacen falta login ni datos sembrados, se re-rinden solas cuando cambia
 * la paleta, y no se desactualizan a escondidas.
 *
 * Fuente de verdad de cada una, en apps/dashboard/src/app/(dashboard)/:
 *   PipelineReal → leads/pipeline/page.tsx   (las 6 etapas y la tarjeta)
 *   InboxReal    → inbox
 *   TareasReal   → tasks/page.tsx            (checkbox, título, vencimiento)
 */

/* ── Pipeline ──────────────────────────────────────────── */

const ETAPAS = [
  { label: "Nuevo", n: 3 },
  { label: "Calificado", n: 2 },
  { label: "Contactado", n: 2 },
  { label: "Demo Agendada", n: 1 },
  { label: "Convertido", n: 1 },
  { label: "Perdido", n: 0 },
];

const TARJETAS: Record<string, { nombre: string; empresa: string; score: number }[]> = {
  Nuevo: [
    { nombre: "Ricardo Salas", empresa: "Talleres Salas", score: 41 },
    { nombre: "Ana Beltrán", empresa: "Refaccionaria AB", score: 28 },
    { nombre: "Jorge Nava", empresa: "Constructora Nava", score: 35 },
  ],
  Calificado: [
    { nombre: "Lucía Márquez", empresa: "Hidráulica del Sur", score: 82 },
    { nombre: "Iván Robles", empresa: "Robles y Cía.", score: 74 },
  ],
  Contactado: [
    { nombre: "Paola Cruz", empresa: "Grupo Cruz", score: 66 },
    { nombre: "Efraín Ríos", empresa: "Bombas Ríos", score: 58 },
  ],
  "Demo Agendada": [{ nombre: "Marisol Vega", empresa: "Vega Industrial", score: 91 }],
  Convertido: [{ nombre: "Tomás Ibarra", empresa: "Ibarra Herramientas", score: 96 }],
  Perdido: [],
};

const COL_W = 168;
const GAP = 14;

export const PipelineReal: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  return (
    <Frame theme={theme} title="omona — pipeline de leads" padding={30}>
      <LoopBody>
        <Interactive.Div name="Tablero" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <MonoLabel theme={theme} at={4}>
            // tus oportunidades por etapa, de nuevo hasta convertido
          </MonoLabel>

          {/* El tablero real se desplaza en horizontal: la sexta columna
              asomando por el borde es fiel, no un recorte accidental. */}
          <div style={{ display: "flex", gap: GAP }}>
            {ETAPAS.map((etapa, ci) => (
              <Interactive.Div
                key={etapa.label}
                name={`Columna ${etapa.label}`}
                style={{
                  width: COL_W,
                  flexShrink: 0,
                  minHeight: 400,
                  border: `1px solid ${p.border}`,
                  padding: 12,
                  opacity: interpolate(frame, [10 + ci * 5, 26 + ci * 5], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(...EASE_OUT),
                  }),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${p.border}`,
                    paddingBottom: 8,
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: fontMono,
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: p.foreground,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {etapa.label}
                  </span>
                  <span style={{ fontFamily: fontMono, fontSize: 12, color: p.muted }}>
                    {etapa.n}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(TARJETAS[etapa.label] ?? []).map((lead, li) => {
                    const at = 40 + ci * 8 + li * 10;
                    return (
                      <div
                        key={lead.nombre}
                        style={{
                          border: `1px solid ${p.border}`,
                          padding: 10,
                          opacity: interpolate(frame, [at, at + 14], [0, 1], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(...EASE_OUT),
                          }),
                          translate: interpolate(frame, [at, at + 16], ["0px 10px", "0px 0px"], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                            easing: Easing.bezier(...EASE_OUT),
                          }),
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 6,
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 600, color: p.foreground }}>
                            {lead.nombre}
                          </span>
                          <span
                            style={{
                              flexShrink: 0,
                              border: `1px solid ${p.border}`,
                              padding: "1px 5px",
                              fontFamily: fontMono,
                              fontSize: 10,
                              color: p.muted,
                            }}
                          >
                            {lead.score}
                          </span>
                        </div>
                        <p style={{ margin: "5px 0 0", fontSize: 11, color: p.muted }}>
                          {lead.empresa}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Interactive.Div>
            ))}
          </div>
        </Interactive.Div>
      </LoopBody>
    </Frame>
  );
};

/* ── Inbox ─────────────────────────────────────────────── */

const CONVERSACIONES = [
  { nombre: "Ricardo Salas", ultimo: "Continuo, es para un taller", sinLeer: 2, activa: true },
  { nombre: "Lucía Márquez", ultimo: "¿Me mandas la cotización?", sinLeer: 0, activa: false },
  { nombre: "Paola Cruz", ultimo: "Gracias, lo reviso", sinLeer: 0, activa: false },
  { nombre: "Efraín Ríos", ultimo: "¿Tienen bombas de 2 HP?", sinLeer: 1, activa: false },
];

const HILO = [
  { role: "cliente", text: "¿Tienen compresores de 5 HP?" },
  { role: "agente", text: "Sí, el trifásico queda en $18,400 + IVA." },
  { role: "cliente", text: "Continuo, es para un taller" },
];

export const InboxReal: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  return (
    <Frame theme={theme} title="omona — inbox" padding={0}>
      <LoopBody>
        <div style={{ display: "flex", height: 620 }}>
          {/* Lista de conversaciones */}
          <div style={{ width: 300, borderRight: `1px solid ${p.border}`, flexShrink: 0 }}>
            {CONVERSACIONES.map((c, i) => (
              <Interactive.Div
                key={c.nombre}
                name={`Conversación ${c.nombre}`}
                style={{
                  padding: "16px 18px",
                  borderBottom: `1px solid ${p.border}`,
                  backgroundColor: c.activa ? p.surface : "transparent",
                  opacity: interpolate(frame, [12 + i * 9, 28 + i * 9], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(...EASE_OUT),
                  }),
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: p.foreground }}>
                    {c.nombre}
                  </span>
                  {c.sinLeer > 0 && (
                    <span
                      style={{
                        flexShrink: 0,
                        backgroundColor: p.fill,
                        color: "#0A0A0A",
                        fontFamily: fontMono,
                        fontSize: 11,
                        padding: "1px 6px",
                      }}
                    >
                      {c.sinLeer}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    margin: "5px 0 0",
                    fontSize: 13,
                    color: p.muted,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.ultimo}
                </p>
              </Interactive.Div>
            ))}
          </div>

          {/* Hilo */}
          <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontFamily: fontMono, fontSize: 13, color: p.muted }}>
              Ricardo Salas · +52 999 412 8830
            </span>
            {HILO.map((m, i) => {
              const at = 55 + i * 26;
              const esCliente = m.role === "cliente";
              return (
                <div
                  key={m.text}
                  style={{
                    display: "flex",
                    justifyContent: esCliente ? "flex-start" : "flex-end",
                    opacity: interpolate(frame, [at, at + 12], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(...EASE_OUT),
                    }),
                  }}
                >
                  <div
                    style={{
                      maxWidth: "76%",
                      padding: "12px 16px",
                      fontSize: 15,
                      lineHeight: 1.4,
                      backgroundColor: esCliente ? p.surface2 : p.fill,
                      color: esCliente ? p.foreground : "#0A0A0A",
                      border: esCliente ? `1px solid ${p.border}` : "none",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {/* El agente sigue trabajando: el indicador nunca se queda quieto */}
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginTop: 4,
                opacity: interpolate(frame, [140, 152], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <span style={{ fontFamily: fontMono, fontSize: 12, color: p.muted }}>
                el agente está respondiendo
              </span>
              {[0, 8, 16].map((o) => (
                <div
                  key={o}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: p.accent,
                    opacity: interpolate((frame + o) % 30, [0, 15, 30], [0.25, 1, 0.25]),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </LoopBody>
    </Frame>
  );
};

/* ── Tareas ────────────────────────────────────────────── */

const TAREAS = [
  { titulo: "Mandar cotización del compresor a Ricardo Salas", vence: "hoy", vencida: false },
  { titulo: "Confirmar visita a Talleres Salas", vence: "mañana", vencida: false },
  { titulo: "Llamar a Lucía Márquez por el descuento", vence: "ayer", vencida: true },
  { titulo: "Cargar precios de bombas al catálogo", vence: "vie 12", vencida: false },
];

export const TareasReal: React.FC<LoopProps> = ({ theme }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  return (
    <Frame theme={theme} title="omona — tareas" padding={36}>
      <LoopBody>
        <Interactive.Div name="Tareas" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <MonoLabel theme={theme} at={4}>
            // los compromisos que deja el agente, no solo los tuyos
          </MonoLabel>

          <div style={{ display: "flex", gap: 10 }}>
            {["mías", "abiertas", "completadas"].map((f, i) => (
              <span
                key={f}
                style={{
                  fontFamily: fontMono,
                  fontSize: 13,
                  padding: "6px 12px",
                  border: `1px solid ${i === 1 ? p.foreground : p.border}`,
                  backgroundColor: i === 1 ? p.foreground : "transparent",
                  color: i === 1 ? p.background : p.muted,
                }}
              >
                {f}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {TAREAS.map((t, i) => {
              const at = 34 + i * 16;
              // La primera se marca como completada a mitad del loop.
              const hecha = i === 0 && frame > 150;
              return (
                <div
                  key={t.titulo}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "16px 0",
                    borderBottom: `1px solid ${p.border}`,
                    opacity: interpolate(frame, [at, at + 14], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(...EASE_OUT),
                    }),
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      marginTop: 2,
                      border: `1px solid ${hecha ? p.accent : p.border}`,
                      backgroundColor: hecha ? p.accent : "transparent",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 17,
                        color: hecha ? p.muted : p.foreground,
                        textDecoration: hecha ? "line-through" : "none",
                      }}
                    >
                      {t.titulo}
                    </p>
                    <span
                      style={{
                        fontFamily: fontMono,
                        fontSize: 12,
                        color: t.vencida ? p.accent : p.muted,
                      }}
                    >
                      vence {t.vence}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Interactive.Div>
      </LoopBody>
    </Frame>
  );
};
