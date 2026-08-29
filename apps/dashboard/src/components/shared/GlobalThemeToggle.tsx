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
    localStorage.setItem('loomi-theme', next);
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggle}
      title="Cambiar tema"
      className="fixed bottom-4 right-4 z-50 p-2.5 rounded-full shadow-md transition-colors"
      style={{
        background: isDark ? '#2a2a2a' : '#f5f5f5',
        border: '1px solid ' + (isDark ? '#3a3a3a' : '#e0e0e0'),
      }}
    >
      {isDark
        ? <Sun className="h-4 w-4" style={{ color: '#a3a3a3' }} />
        : <Moon className="h-4 w-4" style={{ color: '#525252' }} />
      }
    </button>
  );
}
