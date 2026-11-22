import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--foreground-rgb) / <alpha-value>)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
          elevated: 'var(--surface-elevated)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border-hover)',
        },
        // La línea de 1px de la home. Más tenue que --border porque ahí se
        // repite cada 64px; al valor de --border la retícula tapa el texto.
        hairline: 'var(--hairline)',
        'accent-green': 'var(--accent-green)',
        'accent-link': 'var(--accent-link)',
        // Pigmento de marca. Los neones son color de FONDO (texto negro
        // encima) o texto sobre negro — nunca texto sobre fondo claro.
        // scripts/check-contrast.mjs lo verifica.
        // Forma rgb(<canales> / <alpha-value>) y no var() plano: es la única
        // que deja usar el modificador de opacidad (`text-bone/60`). Con var()
        // Tailwind lo descarta en silencio y el color cae al heredado.
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        bone: 'rgb(var(--bone-rgb) / <alpha-value>)',
        neon: {
          lime: 'rgb(var(--neon-lime-rgb) / <alpha-value>)',
          yellow: 'rgb(var(--neon-yellow-rgb) / <alpha-value>)',
          cyan: 'rgb(var(--neon-cyan-rgb) / <alpha-value>)',
          magenta: 'rgb(var(--neon-magenta-rgb) / <alpha-value>)',
          orange: 'rgb(var(--neon-orange-rgb) / <alpha-value>)',
        },
        electric: 'rgb(var(--electric-blue-rgb) / <alpha-value>)',
        // Contextuales: los pone <Band> en su envoltorio, de modo que un hijo
        // escribe border-band / text-band y hereda el par correcto de la banda
        // en la que vive, sin poder equivocarse de combinación.
        band: {
          DEFAULT: 'rgb(var(--band-fg-rgb) / <alpha-value>)',
          bg: 'rgb(var(--band-bg-rgb) / <alpha-value>)',
          fg: 'rgb(var(--band-fg-rgb) / <alpha-value>)',
          muted: 'var(--band-muted)',
          accent: 'var(--band-accent)',
        },
        // Los puntos de ventana ya no llevan color: el único cromático del
        // sistema es el verde de confirmación.
        terminal: {
          red: '#EBEBEB',
          yellow: '#EBEBEB',
          green: '#297A3A',
        },
        // Escala del sistema claro (DESIGN_SYSTEM.md §2).
        paper: '#FAFAFA',
        hair: '#EBEBEB',
        ash: '#C9C9C9',
        smoke: '#A8A8A8',
        graphite: '#8F8F8F',
        slate: '#7D7D7D',
        stone: '#666666',
        charcoal: '#4D4D4D',
        obsidian: '#171717',
        info: {
          DEFAULT: 'var(--info)',
          muted: 'var(--info-muted)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          muted: 'var(--warning-muted)',
        },
        success: {
          DEFAULT: 'var(--success)',
          muted: 'var(--success-muted)',
        },
        error: {
          DEFAULT: 'var(--error)',
          muted: 'var(--error-muted)',
        },
        primary: {
          DEFAULT: 'var(--foreground)',
          foreground: 'var(--background)',
        },
        secondary: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--foreground)',
        },
        destructive: {
          DEFAULT: 'var(--error)',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--foreground)',
        },
        popover: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--foreground)',
        },
        input: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        ring: 'var(--info)',
      },
      // r6 en todo lo rectangular; nunca más. `rounded-full` queda para
      // pills del nav y avatares.
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '6px',
        xl: '6px',
        '2xl': '6px',
        '3xl': '6px',
        nav: '2px',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        label: ['13px', { lineHeight: '1.4' }],
        body: ['17px', { lineHeight: '1.6' }],
        // Display fluido con interlineado cerrado (Gumroad usa 96px/96px).
        // Sin cajas ni bordes, es el tamaño del titular lo que separa
        // una sección de la siguiente.
        'display-sm': ['clamp(2.125rem, 5vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.06em' }],
        'display': ['clamp(2.5rem, 6.4vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.06em' }],
        'display-lg': ['clamp(2.5rem, 6.4vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.06em' }],
        // Para el titular del héroe, que tiene diez palabras: al tope de
        // `display` rompía en seis líneas y no cabía en una pantalla.
        'display-hero': ['clamp(2.5rem, 6.4vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.06em' }],
      },
      // Sin drop-shadows: toda «sombra» es un anillo de 1px. Se pisan también
      // las de Tailwind (sm…2xl) porque el dashboard las usa en línea.
      boxShadow: {
        DEFAULT: '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        sm: '0 0 0 1px #ebebeb',
        md: '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        lg: '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        xl: '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        '2xl': '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        subtle: '0 0 0 1px #ebebeb',
        card: '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        'card-hover': '0 0 0 1px rgba(0,0,0,.16), 0 0 0 2px #fafafa',
        elevated: '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        'focus-green': '0 0 0 2px rgba(23,23,23,.18)',
        ring: '0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px #fafafa',
        ghost: '0 0 0 1px #ebebeb',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        // La barra de carga la usaba desde siempre vía animate-[shimmer_...],
        // pero el keyframe nunca existió: se quedaba congelada a media barra.
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        shimmer: 'shimmer 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
