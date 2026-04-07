'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { Calendar, ShoppingBag, Clock, TrendingUp, Inbox } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { ok, data } = await apiRequest<{ orders: Order[] }>('/api/orders');
        if (ok && data.orders) {
          setOrders(data.orders);
        }
      } catch {
        // Silently fail — user will see empty state
      } finally {
        setLoadingOrders(false);
      }
    }
    fetchOrders();
  }, []);

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h1 className="text-2xl font-bold text-secondary-900">Bonjour, {user?.firstName} 👋</h1>
        <p className="mt-1 text-gray-500">Bienvenue sur votre tableau de bord. Voici un résumé de votre activité.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: ShoppingBag, label: 'Commandes', value: String(orders.length), color: 'bg-green-50 text-green-600' },
          { icon: Calendar, label: 'Rendez-vous', value: '—', color: 'bg-blue-50 text-blue-600' },
          { icon: Clock, label: 'Consultations', value: '—', color: 'bg-purple-50 text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="card-premium flex items-center gap-4 p-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{loadingOrders ? '…' : stat.value}</p><p className="text-sm text-gray-500">{stat.label}</p></div>
          </div>
        ))}
      </div>

      <div className="card-premium p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
          <Link href="/tableau-de-bord/historique" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">Voir tout</Link>
        </div>
        {loadingOrders ? (
          <div className="flex items-center justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" /></div>
        ) : recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Inbox className="mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">Aucune commande pour le moment.</p>
            <Link href="/boutique" className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700">Découvrir la boutique</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
                <div><p className="text-sm font-medium text-gray-900">CMD-{order.id.substring(0, 8).toUpperCase()}</p><p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p></div>
                <div className="text-right"><p className="text-sm font-semibold text-gray-900">{formatPrice(order.total)}</p><p className="text-xs text-gray-500">{order.status}</p></div>
              </div>
            ))}
          </div>
        )}
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
