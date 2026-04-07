'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Appointment } from '@/types';

const appointments: Appointment[] = [
  { id: '1', doctor: 'Dr. Sophie Martin', specialty: 'Médecine Générale', date: '2026-04-10', time: '10:00', status: 'confirmed', type: 'Cabinet' },
  { id: '2', doctor: 'Dr. Pierre Leroy', specialty: 'Cardiologie', date: '2026-04-15', time: '14:30', status: 'pending', type: 'Téléconsultation' },
  { id: '3', doctor: 'Dr. Amina El-Fassi', specialty: 'Cardiologie', date: '2026-03-20', time: '09:00', status: 'completed', type: 'Téléconsultation' },
  { id: '4', doctor: 'Dr. Marc Dubois', specialty: 'Dermatologie', date: '2026-03-10', time: '11:30', status: 'cancelled', type: 'Cabinet' },
];

const specialties = ['Médecine Générale', 'Cardiologie', 'Dermatologie', 'Pédiatrie', 'Ophtalmologie', 'ORL'];

export default function AppointmentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setShowForm(false);
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

      <div className="space-y-3">
        {appointments.map((apt) => (
          <div key={apt.id} className="card-premium flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{apt.doctor}</h3>
                <p className="text-sm text-gray-500">{apt.specialty}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {apt.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {apt.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {apt.type}</span>
                </div>
              </div>
            </div>
            <span className={`self-start rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(apt.status)}`}>{getStatusLabel(apt.status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
