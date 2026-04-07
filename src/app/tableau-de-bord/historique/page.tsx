'use client';

import { useEffect, useState } from 'react';
import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h1 className="text-2xl font-bold text-secondary-900">Historique</h1>
        <p className="mt-1 text-gray-500">Retrouvez l&apos;historique de vos commandes et consultations</p>
      </div>
      {loading ? (
        <div className="card-premium flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card-premium flex flex-col items-center justify-center py-12 text-center">
          <Inbox className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">Aucun historique pour le moment.</p>
          <p className="mt-1 text-sm text-gray-400">Vos commandes et consultations apparaîtront ici.</p>
          <Link href="/boutique" className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700">Découvrir la boutique</Link>
        </div>
      ) : (
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Référence</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">CMD-{order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">Commande</span></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.items.map((i) => i.name).join(', ')}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
