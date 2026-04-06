'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { faqs } from '@/data/faq';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(
    (faq) => faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-primary-600">FAQ</span>
            <h1 className="mb-6 text-4xl font-bold text-secondary-900 sm:text-5xl">Questions fréquentes</h1>
            <p className="mb-8 text-lg text-gray-600">Trouvez rapidement les réponses à vos questions sur MEDICOPLACE et nos services.</p>
            <div className="relative mx-auto max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une question..." className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {filtered.map((faq, index) => (
              <div key={index} className="card-premium overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex w-full items-center justify-between p-5 text-left">
                  <span className="pr-4 font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className={cn('h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', openIndex === index && 'rotate-180 text-primary-600')} />
                </button>
                {openIndex === index && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">Aucun résultat trouvé pour &quot;{search}&quot;</p>
              </div>
            )}
          </div>
          <div className="mt-16 rounded-2xl bg-gray-50 p-8 text-center">
            <h3 className="mb-2 text-xl font-bold text-gray-900">Vous n&apos;avez pas trouvé votre réponse ?</h3>
            <p className="mb-6 text-sm text-gray-500">Notre équipe est disponible pour répondre à toutes vos questions.</p>
            <Link href="/contact" className="inline-flex rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">Contactez-nous</Link>
          </div>
        </div>
      </section>
    </>
  );
}
