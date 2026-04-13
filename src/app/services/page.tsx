'use client';

import { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart, CheckCircle } from 'lucide-react';
import { services } from '@/data/services';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart };

const serviceTranslationKeys: Record<string, { titleKey: string; descKey: string; featKeys: string[] }> = {
  '1': { titleKey: 'services.s1Title', descKey: 'services.s1Desc', featKeys: ['services.s1f1', 'services.s1f2', 'services.s1f3', 'services.s1f4'] },
  '2': { titleKey: 'services.s2Title', descKey: 'services.s2Desc', featKeys: ['services.s2f1', 'services.s2f2', 'services.s2f3', 'services.s2f4'] },
  '3': { titleKey: 'services.s3Title', descKey: 'services.s3Desc', featKeys: ['services.s3f1', 'services.s3f2', 'services.s3f3', 'services.s3f4'] },
  '4': { titleKey: 'services.s4Title', descKey: 'services.s4Desc', featKeys: ['services.s4f1', 'services.s4f2', 'services.s4f3', 'services.s4f4'] },
  '5': { titleKey: 'services.s5Title', descKey: 'services.s5Desc', featKeys: ['services.s5f1', 'services.s5f2', 'services.s5f3', 'services.s5f4'] },
  '6': { titleKey: 'services.s6Title', descKey: 'services.s6Desc', featKeys: ['services.s6f1', 'services.s6f2', 'services.s6f3', 'services.s6f4'] },
};

export default function ServicesPage() {
  const { t } = useLanguage();
  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('services.label')}</span>
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 sm:text-5xl">{t('services.title')}</h1>
            <p className="text-lg text-gray-600">{t('services.subtitle')}</p>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              const keys = serviceTranslationKeys[service.id];
              return (
                <div key={service.id} className="card-premium flex gap-6 p-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    {Icon && <Icon className="h-7 w-7" />}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{keys ? t(keys.titleKey) : service.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-500">{keys ? t(keys.descKey) : service.description}</p>
                    <ul className="space-y-2">
                      {(keys ? keys.featKeys : service.features).map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 shrink-0 text-primary-500" /> {keys ? t(feat) : feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-gray-50/50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-secondary-900">{t('services.ctaTitle')}</h2>
          <p className="mb-8 text-gray-600">{t('services.ctaSubtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/inscription" className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">{t('services.ctaBook')}</Link>
            <Link href="/contact" className="rounded-lg border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">{t('services.ctaContact')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

