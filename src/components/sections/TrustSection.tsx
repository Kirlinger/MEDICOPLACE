import { ShieldCheck, Users, Headphones, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '100%', label: 'De nos patients sont satisfaits' },
  { icon: ShieldCheck, value: '100%', label: 'Données sécurisées' },
  { icon: Award, value: '500+', label: 'Médecins partenaires' },
  { icon: Headphones, value: '24/7', label: 'Support disponible' },
];

export default function TrustSection() {
  return (
    <section className="border-y border-gray-100 bg-gray-50/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-secondary-900 sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
