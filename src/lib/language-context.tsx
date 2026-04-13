'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import fr from '@/i18n/locales/fr.json';
import en from '@/i18n/locales/en.json';
import ht from '@/i18n/locales/ht.json';

export type Locale = 'fr' | 'en' | 'ht';
const locales = { fr, en, ht };
const STORAGE_KEY = 'medicoplace_lang';

interface LanguageContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

function resolve(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return path;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : path;
}

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'fr';
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && stored in locales) return stored;
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('ht')) return 'ht';
  return 'fr';
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    let val = resolve(locales[locale] as unknown as Record<string, unknown>, key);
    if (val === key) val = resolve(locales.fr as unknown as Record<string, unknown>, key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        val = val.replace(`{{${k}}}`, v);
      });
    }
    return val;
  }, [locale]);

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
