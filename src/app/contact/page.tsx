import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Contact</span>
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 sm:text-5xl">Nous sommes à votre écoute</h1>
            <p className="text-lg text-gray-600">Une question, une suggestion ou besoin d&apos;aide ? Notre équipe est disponible pour vous accompagner.</p>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold text-secondary-900">Informations de contact</h2>
              <div className="space-y-6">
                {[
                  { icon: MapPin, label: 'Adresse', value: '12 Avenue de la Santé\n75013 Paris, France' },
                  { icon: Phone, label: 'Téléphone', value: '01 23 45 67 89' },
                  { icon: Mail, label: 'Email', value: 'contact@medicoplace.com' },
                  { icon: Clock, label: 'Horaires', value: 'Lun - Sam : 8h00 - 20h00\nDimanche : Fermé' },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="whitespace-pre-line text-sm text-gray-500">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="card-premium p-8">
                <h2 className="mb-6 text-2xl font-bold text-secondary-900">Envoyez-nous un message</h2>
                <form className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                      <input id="firstName" type="text" placeholder="Votre prénom" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                      <input id="lastName" type="text" placeholder="Votre nom" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" placeholder="votre@email.com" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
                    <input id="subject" type="text" placeholder="Objet de votre message" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" rows={5} placeholder="Décrivez votre demande..." className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                  </div>
                  <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
                    <Send className="h-4 w-4" /> Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
