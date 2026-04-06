import HeroSection from '@/components/sections/HeroSection';
import TrustSection from '@/components/sections/TrustSection';
import ServicesPreview from '@/components/sections/ServicesPreview';
import CTASection from '@/components/sections/CTASection';
import ProductCard from '@/components/shop/ProductCard';
import { products } from '@/data/products';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <HeroSection />
      <TrustSection />
      <ServicesPreview />

      <section className="bg-gray-50/50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">Boutique</span>
              <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl">Produits populaires</h2>
            </div>
            <Link href="/boutique" className="hidden items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 sm:inline-flex">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/boutique" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
              Voir toute la boutique <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
