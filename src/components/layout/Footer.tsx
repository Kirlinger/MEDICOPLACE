'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-gray-100 bg-secondary-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
                <Plus className="h-5 w-5" strokeWidth={3} />
              </div>
              <span className="text-xl font-bold text-white">MEDICO<span className="text-primary-400">PLACE</span></span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">{t('footer.tagline')}</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{t('footer.navTitle')}</h3>
            <ul className="space-y-3">
              {[
                { href: '/', labelKey: 'nav.home' },
                { href: '/a-propos', labelKey: 'footer.about' },
                { href: '/services', labelKey: 'nav.services' },
                { href: '/boutique', labelKey: 'nav.boutique' },
                { href: '/faq', labelKey: 'footer.faq' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">{t(link.labelKey)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-3">
              {(['footer.service1', 'footer.service2', 'footer.service3', 'footer.service4', 'footer.service5'] as const).map((key) => (
                <li key={key}><span className="text-sm text-gray-400">{t(key)}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{t('footer.contactTitle')}</h3>
            <div className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-4">
              <p className="text-sm leading-relaxed text-gray-400">{t('footer.addressPlaceholder')}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{t('footer.paymentPlaceholder')}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} MEDICOPLACE. {t('footer.copyright')}</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300">{t('footer.legal')}</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300">{t('footer.privacy')}</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

