'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/language-context';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/shop/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">{t('shop.notFound')}</h1>
          <Link href="/boutique" className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('shop.back')}</Link>
        </div>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const guarantees = [
    { icon: Truck, text: t('shop.freeShipping') },
    { icon: ShieldCheck, text: t('shop.securePayment') },
    { icon: RotateCcw, text: t('shop.freeReturn') },
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/boutique" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft className="h-4 w-4" /> {t('shop.back')}</Link>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
            {product.badge && <span className="absolute top-4 left-4 z-10 rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white">{product.badge}</span>}
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" loading="lazy" className="object-contain p-12" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="mb-2 text-sm font-medium uppercase tracking-wider text-primary-600">{product.category}</span>
            <h1 className="mb-4 text-3xl font-bold text-secondary-900">{product.name}</h1>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex items-center gap-1"><Star className="h-5 w-5 fill-amber-400 text-amber-400" /><span className="font-semibold">{product.rating}</span></div>
              <span className="text-sm text-gray-400">({product.reviews} {t('shop.reviews')})</span>
            </div>
            <p className="mb-6 leading-relaxed text-gray-600">{product.description}</p>
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-secondary-900">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>}
            </div>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-200">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-gray-500 hover:text-gray-700"><Minus className="h-4 w-4" /></button>
                <span className="min-w-[3rem] text-center text-sm font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(99, quantity + 1))} className="px-3 py-2 text-gray-500 hover:text-gray-700"><Plus className="h-4 w-4" /></button>
              </div>
              <Button size="lg" onClick={() => { const qty = Math.min(quantity, 99); for (let i = 0; i < qty; i++) addItem(product); }}><ShoppingCart className="h-4 w-4" /> {t('shop.addToCart')}</Button>
            </div>
            <div className="space-y-3 rounded-xl bg-gray-50 p-5">
              {guarantees.map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-gray-600"><item.icon className="h-5 w-5 text-primary-600" /> {item.text}</div>
              ))}
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-secondary-900">{t('shop.related')}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        )}
      </div>
    </section>
  );
}

