import { Video, Shield, Clock, Monitor, MessageSquare, FileCheck, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const features = [
  { icon: Video, title: 'Vidéo HD sécurisée', desc: 'Consultations en vidéo haute définition avec chiffrement de bout en bout.' },
  { icon: Shield, title: 'Confidentialité garantie', desc: 'Vos données médicales sont protégées et conformes au RGPD.' },
  { icon: Clock, title: 'Disponible 7j/7', desc: 'Consultez un médecin du lundi au dimanche, de 7h à 23h.' },
  { icon: MessageSquare, title: 'Chat intégré', desc: 'Échangez par messagerie avec votre médecin avant et après la consultation.' },
  { icon: FileCheck, title: 'Ordonnance en ligne', desc: 'Recevez votre ordonnance directement dans votre espace patient.' },
  { icon: Monitor, title: 'Multi-plateformes', desc: 'Accessible depuis votre ordinateur, tablette ou smartphone.' },
];

const steps = [
  { step: '01', title: 'Choisissez votre médecin', desc: 'Sélectionnez un médecin disponible selon la spécialité souhaitée.' },
  { step: '02', title: 'Réservez un créneau', desc: 'Choisissez la date et l\'heure qui vous conviennent.' },
  { step: '03', title: 'Consultez en vidéo', desc: 'Connectez-vous à l\'heure du rendez-vous depuis votre appareil.' },
  { step: '04', title: 'Recevez votre ordonnance', desc: 'Votre ordonnance est disponible immédiatement dans votre espace.' },
];

export default function TeleconsultationPage() {
  return (
    <>
      <section className="gradient-hero py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-primary-300 backdrop-blur-sm">
              <Video className="h-4 w-4" /> Bientôt disponible
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">Téléconsultation médicale</h1>
            <p className="mb-8 text-lg text-gray-300">Consultez un médecin qualifié par vidéo depuis chez vous. Rapide, sécurisé et remboursé.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/inscription" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-500">
                S&apos;inscrire pour être informé <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Nos autres services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Fonctionnalités</span>
            <h2 className="text-3xl font-bold text-secondary-900">Une expérience de consultation optimale</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card-premium p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><feature.icon className="h-6 w-6" /></div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Comment ça marche</span>
            <h2 className="text-3xl font-bold text-secondary-900">4 étapes simples</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-xl font-bold text-white">{step.step}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary-50 p-8 sm:p-12">
            <h2 className="mb-4 text-center text-2xl font-bold text-secondary-900">Pourquoi choisir la téléconsultation MEDICOPLACE ?</h2>
            <div className="mt-8 space-y-4">
              {[
                'Consultation remboursée par l\'Assurance Maladie',
                'Médecins diplômés et vérifiés',
                'Disponible 7 jours sur 7',
                'Ordonnance électronique envoyée directement en pharmacie',
                'Aucun logiciel à installer',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 shrink-0 text-primary-600" /><span className="text-gray-700">{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
