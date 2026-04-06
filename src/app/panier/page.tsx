'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const shipping = totalPrice >= 49 ? 0 : 4.99;

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100"><ShoppingBag className="h-10 w-10 text-gray-400" /></div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Votre panier est vide</h1>
          <p className="mb-8 text-gray-500">Découvrez notre boutique pour trouver les produits qu&apos;il vous faut.</p>
          <Link href="/boutique" className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">Explorer la boutique <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-secondary-900">Votre panier <span className="text-lg font-normal text-gray-400">({totalItems} article{totalItems > 1 ? 's' : ''})</span></h1>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.id} className="card-premium flex gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-28 sm:w-28">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/boutique/${item.id}`} className="font-semibold text-gray-900 hover:text-primary-700">{item.name}</Link>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-[2.5rem] text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1.5 text-gray-500 hover:text-gray-700"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="card-premium sticky top-24 p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Récapitulatif</h2>
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Sous-total</span><span className="font-medium">{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Livraison</span><span className="font-medium">{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span></div>
              </div>
              <div className="flex justify-between py-4 text-lg font-bold"><span>Total</span><span>{formatPrice(totalPrice + shipping)}</span></div>
              {shipping > 0 && <p className="mb-4 text-xs text-gray-400">Livraison gratuite dès 49€ d&apos;achat</p>}
              <Link href="/paiement"><Button fullWidth size="lg"><ArrowRight className="h-4 w-4" /> Passer commande</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
