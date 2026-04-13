'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-primary px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
          </div>
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">{t('cta.title')}</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-primary-100">{t('cta.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/inscription" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 transition-all hover:bg-gray-50 hover:shadow-lg">
                {t('cta.register')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
                {t('cta.contact')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

