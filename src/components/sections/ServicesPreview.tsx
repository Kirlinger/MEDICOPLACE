import Link from 'next/link';
import { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart };

const previewServices = [
  { icon: 'Stethoscope', title: 'Consultation Générale', desc: 'Médecins généralistes qualifiés pour un suivi personnalisé.' },
  { icon: 'Video', title: 'Téléconsultation', desc: 'Consultez un médecin par vidéo depuis chez vous.' },
  { icon: 'Pill', title: 'Pharmacie en Ligne', desc: 'Commandez vos produits de santé en toute sécurité.' },
  { icon: 'UserCheck', title: 'Spécialistes', desc: 'Accédez à un réseau de spécialistes reconnus.' },
  { icon: 'FlaskConical', title: 'Analyses Médicales', desc: 'Réservez vos analyses et recevez vos résultats en ligne.' },
  { icon: 'Heart', title: 'Urgences', desc: 'Orientation et conseils de premiers secours 24h/24.' },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Nos services</span>
          <h2 className="mb-4 text-3xl font-bold text-secondary-900 sm:text-4xl">Une solution complète pour votre santé</h2>
          <p className="mx-auto max-w-2xl text-gray-500">Découvrez notre gamme de services médicaux conçus pour vous offrir les meilleurs soins, où que vous soyez.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewServices.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <div key={service.title} className="card-premium group p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                  {Icon && <Icon className="h-6 w-6" />}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{service.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{service.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700">
            Voir tous nos services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
