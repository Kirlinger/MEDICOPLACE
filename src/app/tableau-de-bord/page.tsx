'use client';

import { useAuth } from '@/lib/auth-context';
import { Calendar, ShoppingBag, Clock, Heart, ArrowRight, CalendarCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getStatusColor, getStatusLabel } from '@/lib/utils';

const upcomingAppointments = [
  { id: '1', doctor: 'Dr. Sophie Martin', specialty: 'Médecine Générale', date: '2026-04-10', time: '10:00', status: 'confirmed' as const },
  { id: '2', doctor: 'Dr. Pierre Leroy', specialty: 'Cardiologie', date: '2026-04-15', time: '14:30', status: 'pending' as const },
];

const recentOrders = [
  { id: 'CMD-001', date: '2026-03-28', total: '79,99 €', status: 'Livré' },
  { id: 'CMD-002', date: '2026-04-01', total: '34,98 €', status: 'En cours' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h1 className="text-2xl font-bold text-secondary-900">Bonjour, {user?.firstName} 👋</h1>
        <p className="mt-1 text-gray-500">Bienvenue sur votre tableau de bord. Voici un résumé de votre activité.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Calendar, label: 'Prochains RDV', value: '2', color: 'bg-blue-50 text-blue-600' },
          { icon: ShoppingBag, label: 'Commandes', value: '5', color: 'bg-green-50 text-green-600' },
          { icon: Clock, label: 'Consultations', value: '12', color: 'bg-purple-50 text-purple-600' },
          { icon: Heart, label: 'Santé Score', value: '85%', color: 'bg-red-50 text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="card-premium flex items-center gap-4 p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-premium p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
            <Link href="/tableau-de-bord/rendez-vous" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">Voir tout <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><CalendarCheck className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{apt.doctor}</p>
                    <p className="text-xs text-gray-500">{apt.specialty} • {apt.date} à {apt.time}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(apt.status)}`}>{getStatusLabel(apt.status)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
            <Link href="/tableau-de-bord/historique" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">Voir tout <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                <div><p className="text-sm font-medium text-gray-900">{order.id}</p><p className="text-xs text-gray-500">{order.date}</p></div>
                <div className="text-right"><p className="text-sm font-semibold text-gray-900">{order.total}</p><p className="text-xs text-gray-500">{order.status}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-premium p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Actions rapides</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/tableau-de-bord/rendez-vous" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/50">
            <Calendar className="h-5 w-5 text-primary-600" /><span className="text-sm font-medium text-gray-700">Prendre rendez-vous</span>
          </Link>
          <Link href="/boutique" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/50">
            <ShoppingBag className="h-5 w-5 text-primary-600" /><span className="text-sm font-medium text-gray-700">Commander en pharmacie</span>
          </Link>
          <Link href="/teleconsultation" className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/50">
            <TrendingUp className="h-5 w-5 text-primary-600" /><span className="text-sm font-medium text-gray-700">Téléconsultation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
