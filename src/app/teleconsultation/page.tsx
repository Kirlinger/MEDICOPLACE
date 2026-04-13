'use client';

import { Video, Shield, Clock, Monitor, MessageSquare, FileCheck, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export default function TeleconsultationPage() {
  const { t } = useLanguage();

  const features = [
    { icon: Video, titleKey: 'teleconsultation.f1Title', descKey: 'teleconsultation.f1Desc' },
    { icon: Shield, titleKey: 'teleconsultation.f2Title', descKey: 'teleconsultation.f2Desc' },
    { icon: Clock, titleKey: 'teleconsultation.f3Title', descKey: 'teleconsultation.f3Desc' },
    { icon: MessageSquare, titleKey: 'teleconsultation.f4Title', descKey: 'teleconsultation.f4Desc' },
    { icon: FileCheck, titleKey: 'teleconsultation.f5Title', descKey: 'teleconsultation.f5Desc' },
    { icon: Monitor, titleKey: 'teleconsultation.f6Title', descKey: 'teleconsultation.f6Desc' },
  ];

  const steps = [
    { stepKey: 'teleconsultation.step1', titleKey: 'teleconsultation.step1Title', descKey: 'teleconsultation.step1Desc' },
    { stepKey: 'teleconsultation.step2', titleKey: 'teleconsultation.step2Title', descKey: 'teleconsultation.step2Desc' },
    { stepKey: 'teleconsultation.step3', titleKey: 'teleconsultation.step3Title', descKey: 'teleconsultation.step3Desc' },
    { stepKey: 'teleconsultation.step4', titleKey: 'teleconsultation.step4Title', descKey: 'teleconsultation.step4Desc' },
  ];

  const whyItems = ['why1', 'why2', 'why3', 'why4', 'why5'].map((k) => `teleconsultation.${k}`);

  return (
    <>
      <section className="gradient-hero py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-primary-300 backdrop-blur-sm">
              <Video className="h-4 w-4" /> {t('teleconsultation.badge')}
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">{t('teleconsultation.title')}</h1>
            <p className="mb-8 text-lg text-gray-300">{t('teleconsultation.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/inscription" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-500">
                {t('teleconsultation.cta')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                {t('teleconsultation.ctaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('teleconsultation.featuresLabel')}</span>
            <h2 className="text-3xl font-bold text-secondary-900">{t('teleconsultation.featuresTitle')}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.titleKey} className="card-premium p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><feature.icon className="h-6 w-6" /></div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{t(feature.titleKey)}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">{t('teleconsultation.stepsLabel')}</span>
            <h2 className="text-3xl font-bold text-secondary-900">{t('teleconsultation.stepsTitle')}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.stepKey} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-xl font-bold text-white">{t(step.stepKey)}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{t(step.titleKey)}</h3>
                <p className="text-sm text-gray-500">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary-50 p-8 sm:p-12">
            <h2 className="mb-4 text-center text-2xl font-bold text-secondary-900">{t('teleconsultation.whyTitle')}</h2>
            <div className="mt-8 space-y-4">
              {whyItems.map((key) => (
                <div key={key} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 shrink-0 text-primary-600" /><span className="text-gray-700">{t(key)}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

