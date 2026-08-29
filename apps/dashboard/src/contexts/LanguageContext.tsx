'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { es, en, type Translations } from '@/lib/i18n';

type Lang = 'es' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => {},
  t: es,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    const saved = localStorage.getItem('omona-lang') as Lang | null;
    if (saved === 'es' || saved === 'en') {
      setLangState(saved);
      document.documentElement.setAttribute('lang', saved);
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem('omona-lang', next);
    document.documentElement.setAttribute('lang', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: lang === 'en' ? en : es }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Shorthand: returns only the translations object */
export function useT() {
  return useContext(LanguageContext).t;
}
