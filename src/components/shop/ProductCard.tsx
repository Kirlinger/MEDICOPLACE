'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="card-premium group relative flex flex-col overflow-hidden">
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
          {product.badge}
        </span>
      )}
      <Link href={`/boutique/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-1 text-xs font-medium uppercase tracking-wider text-primary-600">
          {product.category}
        </span>
        <Link href={`/boutique/${product.id}`}>
          <h3 className="mb-2 text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-700">
            {product.name}
          </h3>
        </Link>
        <div className="mb-3 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviews} avis)</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="rounded-lg bg-primary-50 p-2 text-primary-600 transition-colors hover:bg-primary-600 hover:text-white"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
