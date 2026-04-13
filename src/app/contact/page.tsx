'use client';

import { Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('contact.label')}</span>
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 sm:text-5xl">{t('contact.title')}</h1>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="card-premium p-12">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Clock className="h-8 w-8" />
              </div>
              <p className="text-xl font-semibold text-secondary-900">{t('contact.comingSoon')}</p>
              <p className="mt-4 text-gray-500">{t('contact.patience')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

