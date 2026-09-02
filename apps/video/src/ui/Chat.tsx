import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { fontMono, palettes, type ThemeName, EASE_OUT } from "../theme";

export type Turn = { role: "cliente" | "agente"; text: string };

/**
 * Burbuja que entra desde abajo. `at` es el frame en que aparece.
 * El texto del agente se escribe carácter por carácter: es lo que vende
 * la idea de "está respondiendo solo".
 */
export const Bubble: React.FC<{
  theme: ThemeName;
  turn: Turn;
  at: number;
  /** Frames que tarda en escribirse el texto. 0 = aparece completo. */
  typeOver?: number;
  fontSize?: number;
}> = ({ theme, turn, at, typeOver = 0, fontSize = 26 }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();
  const isCliente = turn.role === "cliente";

  const chars = typeOver
    ? Math.round(
        interpolate(frame, [at + 4, at + 4 + typeOver], [0, turn.text.length], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      )
    : turn.text.length;

  return (
    <Interactive.Div
      name={isCliente ? "BurbujaCliente" : "BurbujaAgente"}
      style={{
        display: "flex",
        justifyContent: isCliente ? "flex-end" : "flex-start",
        opacity: interpolate(frame, [at, at + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE_OUT),
        }),
        translate: interpolate(frame, [at, at + 12], ["0px 16px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE_OUT),
        }),
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          padding: "18px 24px",
          borderRadius: 0,
          fontSize,
          lineHeight: 1.45,
          // El cliente habla en negativo; el agente, en fosforescente. Así se
          // distingue quién es quién sin depender del lado de la burbuja.
          backgroundColor: isCliente ? p.foreground : p.fill,
          color: isCliente ? p.background : "#0A0A0A",
          border: "none",
          minHeight: fontSize,
        }}
      >
        {turn.text.slice(0, chars)}
      </div>
    </Interactive.Div>
  );
};

/** Tres puntos pulsando, el "escribiendo…" de WhatsApp. */
export const Typing: React.FC<{ theme: ThemeName; at: number; until: number }> = ({ theme, at, until }) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Escribiendo"
      style={{
        display: "flex",
        justifyContent: "flex-start",
        opacity: interpolate(frame, [at, at + 6, until - 4, until], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          padding: "20px 26px",
          borderRadius: 0,
          backgroundColor: p.fill,
        }}
      >
        {[0, 6, 12].map((offset) => (
          <div
            key={offset}
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: "#0A0A0A",
              opacity: interpolate((frame + offset) % 30, [0, 15, 30], [0.25, 1, 0.25]),
            }}
          />
        ))}
      </div>
    </Interactive.Div>
  );
};

/** Etiqueta de contexto en mono, como el `// crm-embebido` de la landing. */
export const MonoLabel: React.FC<{ theme: ThemeName; children: React.ReactNode; at?: number }> = ({
  theme,
  children,
  at = 0,
}) => {
  const p = palettes[theme];
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Etiqueta"
      style={{
        fontFamily: fontMono,
        fontSize: 20,
        color: p.muted,
        opacity: interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      {children}
    </Interactive.Div>
  );
};
