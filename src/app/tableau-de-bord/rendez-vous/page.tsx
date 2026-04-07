'use client';

import { useState } from 'react';
import { Calendar, Plus, Inbox } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const specialties = ['Médecine Générale', 'Cardiologie', 'Dermatologie', 'Pédiatrie', 'Ophtalmologie', 'ORL'];

export default function AppointmentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Appointment booking is not yet connected to a backend
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setShowForm(false);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="card-premium flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Rendez-vous</h1>
          <p className="mt-1 text-gray-500">Gérez et planifiez vos rendez-vous médicaux</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> Nouveau rendez-vous</Button>
      </div>

      {showForm && (
        <div className="card-premium p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Prendre un rendez-vous</h2>
          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Spécialité</label>
                <select id="specialty" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  {specialties.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de consultation</label>
                <select id="type" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>Cabinet</option>
                  <option>Téléconsultation</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Date souhaitée" type="date" />
              <Input label="Heure souhaitée" type="time" />
            </div>
            <Input label="Motif de consultation" placeholder="Décrivez brièvement le motif de votre visite..." />
            <div className="flex gap-3">
              <Button type="submit" loading={loading}>Confirmer le rendez-vous</Button>
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      )}

      {submitted && (
        <div className="card-premium rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Votre demande de rendez-vous a été enregistrée. La fonctionnalité de gestion des rendez-vous sera bientôt disponible.
        </div>
      )}

      <div className="card-premium flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="mb-3 h-12 w-12 text-gray-300" />
        <p className="text-gray-500">Aucun rendez-vous pour le moment.</p>
        <p className="mt-1 text-sm text-gray-400">La gestion des rendez-vous sera disponible prochainement.</p>
        <button onClick={() => setShowForm(true)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
          <Calendar className="h-4 w-4" /> Prendre un rendez-vous
        </button>
      </div>
    </div>
  );
}
