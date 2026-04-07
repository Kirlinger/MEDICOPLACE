'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { isValidName, isValidPhone, isValidAddress } from '@/lib/validation';
import { ShieldCheck, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', city: '', department: '', phone: '',
  });

  const shipping = totalPrice >= 500 ? 0 : 75;
  const grandTotal = totalPrice + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidName(form.firstName) || !isValidName(form.lastName)) {
      setError('Veuillez entrer un prénom et un nom valides.');
      return;
    }

    if (!isValidAddress(form.address)) {
      setError('Veuillez entrer une adresse valide.');
      return;
    }

    if (!form.city.trim() || !form.department.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!isValidPhone(form.phone, true)) {
      setError('Veuillez entrer un numéro de téléphone valide (+509 XX XX XXXX).');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setOrderId('CMD-' + crypto.randomUUID().substring(0, 8).toUpperCase());
    clearCart();
    setOrderPlaced(true);
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50"><CheckCircle className="h-10 w-10 text-green-500" /></div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Commande confirmée !</h1>
          <p className="mb-2 text-gray-500">Merci pour votre commande. Un email de confirmation vous a été envoyé.</p>
          <p className="mb-8 text-sm text-gray-400">Numéro de commande : {orderId}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tableau-de-bord" className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">Mon tableau de bord</Link>
            <Link href="/boutique" className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">Continuer mes achats</Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Votre panier est vide</h1>
          <Link href="/boutique" className="text-sm font-medium text-primary-600 hover:text-primary-700">Retour à la boutique</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-secondary-900">Paiement</h1>
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="card-premium p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Adresse de livraison</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Prénom" placeholder="Votre prénom" required autoComplete="given-name" maxLength={100} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    <Input label="Nom" placeholder="Votre nom" required autoComplete="family-name" maxLength={100} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                  <Input label="Adresse" placeholder="Numéro et nom de rue" required autoComplete="street-address" maxLength={200} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Ville" placeholder="Port-au-Prince" required autoComplete="address-level2" maxLength={100} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <Input label="Département" placeholder="Ouest" required autoComplete="address-level1" maxLength={100} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                  </div>
                  <Input label="Téléphone" type="tel" placeholder="+509 00 00 0000" required autoComplete="tel" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="card-premium p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Méthode de paiement</h2>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-800">Les paiements via MonCash et NatCash seront disponibles bientôt.</p>
                  <p className="mt-1 text-xs text-amber-600">En attendant, le paiement sera effectué à la livraison (paiement à la livraison).</p>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"><Lock className="h-4 w-4" /> Vos informations sont protégées et sécurisées</div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="card-premium sticky top-24 p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Votre commande</h2>
                <div className="space-y-3 border-b border-gray-100 pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm"><span className="text-gray-600">{item.name} ×{item.quantity}</span><span className="font-medium">{formatPrice(item.price * item.quantity)}</span></div>
                  ))}
                </div>
                <div className="space-y-2 border-b border-gray-100 py-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Sous-total</span><span>{formatPrice(totalPrice)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Livraison</span><span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span></div>
                </div>
                <div className="flex justify-between py-4 text-lg font-bold"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
                <Button type="submit" fullWidth size="lg" loading={loading}><ShieldCheck className="h-4 w-4" /> Confirmer la commande</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
