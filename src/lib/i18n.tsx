import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'ar';
export type L = { en: string; ar: string };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; tr: (l: L) => string };

const LangContext = createContext<Ctx | null>(null);

const initialLang = (): Lang => {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* storage can be blocked */
  }
  return 'en';
};

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = lang;
    el.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title =
      lang === 'ar' ? 'م. حمزة سلامة — مطوّر ويب وتطبيقات' : 'Eng. Hamza Salameh — Web & App Developer';
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(() => ({ lang, setLang, tr: (l) => l[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const c = useContext(LangContext);
  if (!c) throw new Error('useLang outside LangProvider');
  return c;
}
