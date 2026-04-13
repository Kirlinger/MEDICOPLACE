'use client';

import { Shield, Heart, Target, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    { icon: Shield, titleKey: 'about.value1Title', descKey: 'about.value1Desc' },
    { icon: Heart, titleKey: 'about.value2Title', descKey: 'about.value2Desc' },
    { icon: Target, titleKey: 'about.value3Title', descKey: 'about.value3Desc' },
    { icon: Globe, titleKey: 'about.value4Title', descKey: 'about.value4Desc' },
  ];

  const team = [
    { nameKey: 'about.teamMember1Name', roleKey: 'about.teamMember1Role', descKey: 'about.teamMember1Desc', initials: 'DIIL' },
  ];

  const stats = [
    { value: '100%', labelKey: 'about.stat1' },
    { value: '500+', labelKey: 'about.stat2' },
    { value: '98%', labelKey: 'about.stat3' },
    { value: '24/7', labelKey: 'about.stat4' },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('about.label')}</span>
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 sm:text-5xl">{t('about.title')}</h1>
            <p className="text-lg leading-relaxed text-gray-600">{t('about.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('about.missionLabel')}</span>
              <h2 className="mb-6 text-3xl font-bold text-secondary-900">{t('about.missionTitle')}</h2>
              <div className="space-y-4 text-gray-600">
                <p>{t('about.missionP1')}</p>
                <p>{t('about.missionP2')}</p>
                <p>{t('about.missionP3')}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.labelKey} className="rounded-2xl bg-primary-50 p-6 text-center">
                  <div className="text-3xl font-bold text-primary-700">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('about.valuesLabel')}</span>
            <h2 className="text-3xl font-bold text-secondary-900">{t('about.valuesTitle')}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.titleKey} className="card-premium p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{t(value.titleKey)}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{t(value.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('about.teamLabel')}</span>
            <h2 className="text-3xl font-bold text-secondary-900">{t('about.teamTitle')}</h2>
          </div>
          <div className="flex justify-center">
            {team.map((member) => (
              <div key={member.nameKey} className="card-premium overflow-hidden w-full max-w-sm">
                <div className="flex h-48 items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary-600 shadow-sm">
                    {member.initials}
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-gray-900">{t(member.nameKey)}</h3>
                  <p className="mb-2 text-sm font-medium text-primary-600">{t(member.roleKey)}</p>
                  <p className="text-sm text-gray-500">{t(member.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-base text-gray-500">{t('about.teamMoreSoon')}</p>
        </div>
      </section>
    </>
  );
}

