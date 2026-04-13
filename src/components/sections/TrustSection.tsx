'use client';

import { ShieldCheck, Users, Headphones, Award } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TrustSection() {
  const { t } = useLanguage();
  const stats = [
    { icon: Users, valueKey: 'trust.stat1Value', labelKey: 'trust.stat1Label' },
    { icon: ShieldCheck, valueKey: 'trust.stat2Value', labelKey: 'trust.stat2Label' },
    { icon: Award, valueKey: 'trust.stat3Value', labelKey: 'trust.stat3Label' },
    { icon: Headphones, valueKey: 'trust.stat4Value', labelKey: 'trust.stat4Label' },
  ];
  return (
    <section className="border-y border-gray-100 bg-gray-50/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.labelKey} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 sm:text-3xl">{t(stat.valueKey)}</div>
              <div className="mt-1 text-sm text-gray-500">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

