import { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart, CheckCircle } from 'lucide-react';
import { services } from '@/data/services';
import Link from 'next/link';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Stethoscope, Video, Pill, UserCheck, FlaskConical, Heart };

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Services</span>
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 sm:text-5xl">Des services de santé complets et accessibles</h1>
            <p className="text-lg text-gray-600">Découvrez l&apos;ensemble de nos services médicaux, conçus pour simplifier votre parcours de soins et améliorer votre qualité de vie.</p>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {services.map((service) => {
              const Icon = iconMap[service.icon];
              return (
                <div key={service.id} className="card-premium flex gap-6 p-8">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    {Icon && <Icon className="h-7 w-7" />}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">{service.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-500">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 shrink-0 text-primary-500" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="bg-gray-50/50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-secondary-900">Besoin d&apos;une consultation ?</h2>
          <p className="mb-8 text-gray-600">Prenez rendez-vous en quelques clics ou contactez-nous pour plus d&apos;informations sur nos services.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/inscription" className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">Prendre rendez-vous</Link>
            <Link href="/contact" className="rounded-lg border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Nous contacter</Link>
          </div>
        </div>
      </section>
    </>
  );
}
