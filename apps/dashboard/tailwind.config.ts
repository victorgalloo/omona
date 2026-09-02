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
        terminal: {
          red: '#FF5F56',
          yellow: '#FFBD2E',
          green: '#27C93F',
        },
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
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'SF Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        label: ['13px', { lineHeight: '1.4' }],
        body: ['15px', { lineHeight: '1.7' }],
        // Display fluido con interlineado cerrado (Gumroad usa 96px/96px).
        // Sin cajas ni bordes, es el tamaño del titular lo que separa
        // una sección de la siguiente.
        'display-sm': ['clamp(2.25rem, 5vw, 3.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.75rem, 7vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(3rem, 9vw, 7rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        // Para el titular del héroe, que tiene diez palabras: al tope de
        // `display` rompía en seis líneas y no cabía en una pantalla.
        'display-hero': ['clamp(2.5rem, 5.2vw, 4.5rem)', { lineHeight: '0.96', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        subtle: '0 1px 3px var(--shadow-color)',
        card: '0 2px 8px var(--shadow-color)',
        'card-hover': '0 4px 16px var(--shadow-color)',
        elevated: '0 8px 24px var(--shadow-color)',
        'focus-green': '0 0 0 3px var(--focus-ring-alpha)',
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
