import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const mono = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

export const fontSans = inter.fontFamily;
export const fontMono = mono.fontFamily;

export type ThemeName = "light" | "dark";

/**
 * Espejo de los tokens de apps/dashboard/src/app/globals.css.
 * Si allá cambia un token, aquí también — los loops se ven encima de esos fondos.
 */
export type Palette = {
  background: string;
  foreground: string;
  surface: string;
  surface2: string;
  muted: string;
  border: string;
  /** Color de acento COMO TEXTO. Cambia por tema: el lima no se lee sobre hueso. */
  accent: string;
  /** Color de RELLENO fosforescente, siempre con texto negro encima. */
  fill: string;
  /** Trafficlights del chrome de terminal. */
  lights: [string, string, string];
  shadow: string;
};

export const palettes: Record<ThemeName, Palette> = {
  // Los loops viven sobre bandas `neutral` y dentro de marcos negros duros, así
  // que la variante clara usa hueso y la oscura negro brilloso — los mismos
  // tokens de apps/dashboard/src/app/globals.css.
  //
  // Regla heredada del sistema: el lima es color de RELLENO (con texto negro
  // encima), nunca texto sobre hueso, donde da 1.03:1. Por eso en la variante
  // clara el acento de texto es el azul eléctrico (5.32:1) y el lima solo
  // aparece como fondo de burbuja.
  light: {
    background: "#F5F3EC",
    foreground: "#0A0A0A",
    surface: "#EDEBE1",
    surface2: "#E4E1D5",
    muted: "#6B675C",
    border: "#0A0A0A",
    accent: "#2B4BFF",
    fill: "#D8FF3E",
    lights: ["#FF5F56", "#FFBD2E", "#27C93F"],
    shadow: "none",
  },
  dark: {
    background: "#0A0A0A",
    foreground: "#F5F3EC",
    surface: "#141414",
    surface2: "#1C1C1C",
    muted: "#8F8B80",
    border: "#F5F3EC",
    accent: "#D8FF3E",
    fill: "#D8FF3E",
    lights: ["#FF5F56", "#FFBD2E", "#27C93F"],
    shadow: "none",
  },
};

/** Curva de salida suave, la misma sensación que el cubic-bezier de la landing. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Entrada y salida, para los fades de cierre del loop. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export type LoopProps = { theme: ThemeName };
