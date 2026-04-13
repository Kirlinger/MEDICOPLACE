'use client';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Locale } from '@/lib/language-context';
import { cn } from '@/lib/utils';

const LANGUAGE_CODES: { code: Locale; flag: string }[] = [
  { code: 'fr', flag: '🇫🇷' },
  { code: 'en', flag: '🇺🇸' },
  { code: 'ht', flag: '🇭🇹' },
];

export default function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_CODES.find((l) => l.code === locale) ?? LANGUAGE_CODES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{current.flag} {t(`lang.${locale}`)}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-150', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-100 bg-white py-1 shadow-lg z-50">
          {LANGUAGE_CODES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code); setOpen(false); }}
              className={cn(
                'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-gray-50',
                locale === lang.code ? 'font-semibold text-primary-600' : 'text-gray-700'
              )}
            >
              <span>{lang.flag}</span>
              <span>{t(`lang.${lang.code}`)}</span>
              {locale === lang.code && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
