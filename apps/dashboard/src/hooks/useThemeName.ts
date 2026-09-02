'use client';

import { useEffect, useState } from 'react';

export type ThemeName = 'light' | 'dark';

/**
 * Lee el tema activo del atributo `data-theme` del <html> — la misma fuente de
 * verdad que usan ThemeScript (app/layout.tsx) y GlobalThemeToggle — y se
 * actualiza cuando alguien lo cambia.
 *
 * Devuelve null en el primer render para no provocar un mismatch de hidratación:
 * el servidor no sabe qué tema tiene guardado el navegador.
 */
export function useThemeName(): ThemeName | null {
  const [theme, setTheme] = useState<ThemeName | null>(null);

  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
