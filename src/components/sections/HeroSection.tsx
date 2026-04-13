'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function HeroSection() {
  const { t } = useLanguage();
  const features = [
    { icon: Shield, titleKey: 'hero.feature1Title', descKey: 'hero.feature1Desc' },
    { icon: Clock, titleKey: 'hero.feature2Title', descKey: 'hero.feature2Desc' },
    { icon: Award, titleKey: 'hero.feature3Title', descKey: 'hero.feature3Desc' },
  ];
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16,185,129,0.2) 0%, transparent 50%)',
        }} />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-primary-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
            {t('hero.badge')}
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}{' '}<span className="text-primary-400">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/inscription" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-600/25">
              {t('hero.cta')} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
              {t('hero.ctaSecondary')}
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {features.map((item) => (
            <div key={item.titleKey} className="rounded-xl bg-white/5 p-5 backdrop-blur-sm border border-white/10">
              <item.icon className="mb-3 h-6 w-6 text-primary-400" />
              <h3 className="mb-1 text-sm font-semibold text-white">{t(item.titleKey)}</h3>
              <p className="text-sm text-gray-400">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

