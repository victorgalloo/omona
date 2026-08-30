interface LogoProps {
  /** Lado del cuadro en px. Por defecto 24. */
  size?: number;
  className?: string;
}

/**
 * Marca Omona — anillo con una ranura radial de lados paralelos a 135°.
 * Geometría: radio interior / exterior = 0.527.
 *
 * Usa `currentColor`, así que hereda el color del contenedor y funciona
 * igual en tema claro y oscuro sin variantes.
 */
export function Logo({ size = 24, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M4.876 26.063A15 15 0 1 1 5.937 27.124L10.966 22.095A7.905 7.905 0 1 0 9.905 21.034Z" />
    </svg>
  );
}
