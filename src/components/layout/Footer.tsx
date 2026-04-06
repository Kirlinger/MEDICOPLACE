import Link from 'next/link';
import { Plus, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
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
            <p className="text-sm leading-relaxed text-gray-400">
              Votre plateforme de santé de confiance. Consultations médicales, pharmacie en ligne et téléconsultation — tout au même endroit.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Navigation</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/a-propos', label: 'À propos' },
                { href: '/services', label: 'Services' },
                { href: '/boutique', label: 'Boutique' },
                { href: '/faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Services</h3>
            <ul className="space-y-3">
              {['Consultation générale', 'Téléconsultation', 'Pharmacie en ligne', 'Spécialistes', 'Analyses médicales'].map((s) => (
                <li key={s}><span className="text-sm text-gray-400">{s}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-sm text-gray-400">12 Avenue de la Santé, 75013 Paris, France</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-sm text-gray-400">01 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary-400" />
                <span className="text-sm text-gray-400">contact@medicoplace.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} MEDICOPLACE. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300">Mentions légales</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300">Politique de confidentialité</Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-gray-300">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
