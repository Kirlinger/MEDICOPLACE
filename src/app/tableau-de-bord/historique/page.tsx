'use client';

const history = [
  { id: 'CMD-005', date: '2026-04-01', type: 'Commande', description: 'Paracétamol 500 mg, Multivitamines Adulte', amount: '600 Gdes', status: 'Livré' },
  { id: 'CST-003', date: '2026-03-28', type: 'Consultation', description: 'Dr. Sophie Martin — Médecine Générale', amount: '1 500 Gdes', status: 'Terminée' },
  { id: 'CMD-004', date: '2026-03-20', type: 'Commande', description: 'Sérum de Réhydratation Orale (x10)', amount: '120 Gdes', status: 'Livré' },
  { id: 'CST-002', date: '2026-03-15', type: 'Téléconsultation', description: 'Dr. Amina El-Fassi — Cardiologie', amount: '2 500 Gdes', status: 'Terminée' },
  { id: 'CMD-003', date: '2026-03-10', type: 'Commande', description: 'Amoxicilline 500 mg', amount: '350 Gdes', status: 'Livré' },
  { id: 'CST-001', date: '2026-02-28', type: 'Consultation', description: 'Dr. Pierre Leroy — Cardiologie', amount: '2 500 Gdes', status: 'Terminée' },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h1 className="text-2xl font-bold text-secondary-900">Historique</h1>
        <p className="mt-1 text-gray-500">Retrouvez l&apos;historique de vos commandes et consultations</p>
      </div>
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
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.type === 'Commande' ? 'bg-blue-50 text-blue-700' : item.type === 'Téléconsultation' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700'}`}>{item.type}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.description}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.amount}</td>
                  <td className="px-6 py-4"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
