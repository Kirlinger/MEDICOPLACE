import { Shield, Heart, Target, Globe } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Confiance', desc: 'La sécurité et la confidentialité de vos données sont notre priorité absolue.' },
  { icon: Heart, title: 'Bienveillance', desc: 'Chaque patient est unique. Nous offrons un accompagnement personnalisé et humain.' },
  { icon: Target, title: 'Excellence', desc: 'Nous collaborons avec les meilleurs professionnels de santé pour vous garantir des soins de qualité.' },
  { icon: Globe, title: 'Accessibilité', desc: 'La santé doit être accessible à tous, partout et à tout moment.' },
];

const team = [
  { name: 'Dr. Marie-Claire Joseph', role: 'Directrice Médicale', desc: "Spécialiste en médecine interne avec 15 ans d'expérience hospitalière en Haïti." },
  { name: 'Jean-Baptiste Pierre', role: 'Directeur Technique', desc: "Expert en technologies de santé et en systèmes d'information médicale." },
  { name: 'Dr. Farah Étienne', role: 'Responsable Téléconsultation', desc: 'Pionnière de la télémédecine en Haïti, cardiologue de formation.' },
  { name: 'Stéphane Louis', role: 'Responsable Pharmacie', desc: 'Pharmacien diplômé avec une expertise en e-commerce santé.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">À propos</span>
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 sm:text-5xl">Réinventer l&apos;accès aux soins de santé</h1>
            <p className="text-lg leading-relaxed text-gray-600">MEDICOPLACE est née de la conviction que chacun mérite un accès simple, rapide et sécurisé à des soins médicaux de qualité. Notre mission est de connecter les patients aux meilleurs professionnels de santé grâce à la technologie.</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Notre mission</span>
              <h2 className="mb-6 text-3xl font-bold text-secondary-900">Rendre la santé accessible et moderne</h2>
              <div className="space-y-4 text-gray-600">
                <p>Fondée en 2024, MEDICOPLACE s&apos;est rapidement imposée comme la référence en matière de services de santé numériques en Haïti.</p>
                <p>Notre plateforme combine consultations médicales, pharmacie en ligne et téléconsultation dans un écosystème unique, pensé pour simplifier le parcours de soins des patients.</p>
                <p>Avec plus de 500 médecins partenaires et une communauté grandissante de patients satisfaits, nous construisons chaque jour le futur de la santé connectée.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '100%', label: 'Patients satisfaits' },
                { value: '500+', label: 'Médecins partenaires' },
                { value: '98%', label: 'Satisfaction client' },
                { value: '24/7', label: 'Disponibilité' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-primary-50 p-6 text-center">
                  <div className="text-3xl font-bold text-primary-700">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Nos valeurs</span>
            <h2 className="text-3xl font-bold text-secondary-900">Ce qui nous guide au quotidien</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="card-premium p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Notre équipe</span>
            <h2 className="text-3xl font-bold text-secondary-900">Des experts passionnés par la santé</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="card-premium overflow-hidden">
                <div className="flex h-48 items-center justify-center bg-gradient-to-b from-primary-50 to-primary-100">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-2xl font-bold text-primary-600 shadow-sm">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="mb-2 text-sm font-medium text-primary-600">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
