'use client';

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('omona-theme', next);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-surface-2 hover:bg-border transition-colors"
      title="Cambiar tema"
    >
      <Sun className="h-4 w-4 text-foreground hidden [html[data-theme=dark]_&]:block" />
      <Moon className="h-4 w-4 text-foreground block [html[data-theme=dark]_&]:hidden" />
    </button>
  );
}
