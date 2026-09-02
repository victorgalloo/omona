'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

export function GlobalThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Read current theme on mount
    const current = document.documentElement.getAttribute('data-theme');
    setIsDark(current === 'dark');

    // Watch for external changes (e.g. ThemeScript or DashboardLayoutClient)
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      setIsDark(theme === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('omona-theme', next);
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      title="Cambiar tema"
      // Sin hex sueltos: con la paleta fosforescente estos valores grises
      // quedaban fuera de sistema en las dos direcciones.
      className="fixed bottom-4 right-4 z-50 rounded-full border border-border bg-surface p-2.5 text-muted transition-colors hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
