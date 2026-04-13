'use client';

import { useState } from 'react';
import { Calendar, Plus, Inbox } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLanguage } from '@/lib/language-context';

export default function AppointmentsPage() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const specialties = [
    t('appointments.specialties.generalMedicine'), t('appointments.specialties.cardiology'), t('appointments.specialties.dermatology'),
    t('appointments.specialties.pediatrics'), t('appointments.specialties.ophthalmology'), t('appointments.specialties.ent'),
  ];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setShowForm(false);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="card-premium flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">{t('appointments.title')}</h1>
          <p className="mt-1 text-gray-500">{t('appointments.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> {t('appointments.newAppointment')}</Button>
      </div>

      {showForm && (
        <div className="card-premium p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('appointments.bookTitle')}</h2>
          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">{t('appointments.specialty')}</label>
                <select id="specialty" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  {specialties.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">{t('appointments.type')}</label>
                <select id="type" className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20">
                  <option>{t('appointments.typeClinic')}</option>
                  <option>{t('appointments.typeTele')}</option>
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label={t('appointments.date')} type="date" />
              <Input label={t('appointments.time')} type="time" />
            </div>
            <Input label={t('appointments.reason')} placeholder={t('appointments.reasonPlaceholder')} />
            <div className="flex gap-3">
              <Button type="submit" loading={loading}>{t('appointments.confirm')}</Button>
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>{t('appointments.cancel')}</Button>
            </div>
          </form>
        </div>
      )}

      {submitted && (
        <div className="card-premium rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {t('appointments.successMsg')}
        </div>
      )}

      <div className="card-premium flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="mb-3 h-12 w-12 text-gray-300" />
        <p className="text-gray-500">{t('appointments.noAppointments')}</p>
        <p className="mt-1 text-sm text-gray-400">{t('appointments.comingSoon')}</p>
        <button onClick={() => setShowForm(true)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
          <Calendar className="h-4 w-4" /> {t('appointments.bookNow')}
        </button>
      </div>
    </div>
  );
}

