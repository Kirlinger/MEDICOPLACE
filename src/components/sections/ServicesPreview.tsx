'use client';

import Link from 'next/link';
import { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart };

const serviceIcons = ['Stethoscope', 'Video', 'Pill', 'UserCheck', 'FlaskConical', 'Heart'];
const serviceKeys = [
  { titleKey: 'servicesPreview.item1Title', descKey: 'servicesPreview.item1Desc' },
  { titleKey: 'servicesPreview.item2Title', descKey: 'servicesPreview.item2Desc' },
  { titleKey: 'servicesPreview.item3Title', descKey: 'servicesPreview.item3Desc' },
  { titleKey: 'servicesPreview.item4Title', descKey: 'servicesPreview.item4Desc' },
  { titleKey: 'servicesPreview.item5Title', descKey: 'servicesPreview.item5Desc' },
  { titleKey: 'servicesPreview.item6Title', descKey: 'servicesPreview.item6Desc' },
];

export default function ServicesPreview() {
  const { t } = useLanguage();
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('servicesPreview.label')}</span>
          <h2 className="mb-4 text-3xl font-bold text-secondary-900 sm:text-4xl">{t('servicesPreview.title')}</h2>
          <p className="mx-auto max-w-2xl text-gray-500">{t('servicesPreview.subtitle')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceKeys.map((keys, i) => {
            const Icon = iconMap[serviceIcons[i]];
            return (
              <div key={keys.titleKey} className="card-premium group p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{t(keys.titleKey)}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{t(keys.descKey)}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">
            {t('servicesPreview.viewAll')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

