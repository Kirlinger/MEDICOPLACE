'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { formatPrice } from '@/lib/utils';
import { isValidName, isValidPhone, isValidAddress } from '@/lib/validation';
import { apiRequest } from '@/lib/api-client';
import { ShieldCheck, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
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
      setError(t('checkout.errorInvalidName'));
      return;
    }

    if (!isValidAddress(form.address)) {
      setError(t('checkout.errorInvalidAddress'));
      return;
    }

    if (!form.city.trim() || !form.department.trim()) {
      setError(t('checkout.errorFillAll'));
      return;
    }

    if (!isValidPhone(form.phone, true)) {
      setError(t('checkout.errorInvalidPhone'));
      return;
    }

    setLoading(true);

    try {
      if (!isAuthenticated) {
        setError(t('checkout.loginRequired'));
        return;
      }

      const { ok, data } = await apiRequest<{ success?: boolean; orderId?: string; error?: string }>(
        '/api/orders',
        {
          method: 'POST',
          body: {
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: form,
          },
        }
      );

      if (ok && data.orderId) {
        setOrderId('CMD-' + data.orderId.substring(0, 8).toUpperCase());
        clearCart();
        setOrderPlaced(true);
      } else {
        setError(data.error || t('checkout.orderError'));
      }
    } catch {
      setError(t('checkout.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50"><CheckCircle className="h-10 w-10 text-green-500" /></div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{t('checkout.successTitle')}</h1>
          <p className="mb-2 text-gray-500">{t('checkout.successSubtitle')}</p>
          <p className="mb-8 text-sm text-gray-400">{t('checkout.orderNumber')} {orderId}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tableau-de-bord" className="rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">{t('checkout.goToDashboard')}</Link>
            <Link href="/boutique" className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">{t('checkout.continueShopping')}</Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">{t('checkout.emptyCartTitle')}</h1>
          <Link href="/boutique" className="text-sm font-medium text-primary-600 hover:text-primary-700">{t('checkout.backToShop')}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-secondary-900">{t('checkout.title')}</h1>
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
                <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('checkout.shippingTitle')}</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label={t('checkout.firstName')} placeholder={t('checkout.firstName')} required autoComplete="given-name" maxLength={100} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                    <Input label={t('checkout.lastName')} placeholder={t('checkout.lastName')} required autoComplete="family-name" maxLength={100} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                  <Input label={t('checkout.address')} placeholder={t('checkout.addressPlaceholder')} required autoComplete="street-address" maxLength={200} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label={t('checkout.city')} placeholder={t('checkout.cityPlaceholder')} required autoComplete="address-level2" maxLength={100} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                    <Input label={t('checkout.department')} placeholder={t('checkout.departmentPlaceholder')} required autoComplete="address-level1" maxLength={100} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                  </div>
                  <Input label={t('checkout.phone')} type="tel" placeholder="+509 00 00 0000" required autoComplete="tel" maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="card-premium p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('checkout.paymentTitle')}</h2>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-800">{t('checkout.paymentComingSoon')}</p>
                  <p className="mt-1 text-xs text-amber-600">{t('checkout.paymentCOD')}</p>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"><Lock className="h-4 w-4" /> {t('checkout.securePayment')}</div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="card-premium sticky top-24 p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('checkout.orderTitle')}</h2>
                <div className="space-y-3 border-b border-gray-100 pb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm"><span className="text-gray-600">{item.name} ×{item.quantity}</span><span className="font-medium">{formatPrice(item.price * item.quantity)}</span></div>
                  ))}
                </div>
                <div className="space-y-2 border-b border-gray-100 py-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">{t('checkout.subtotal')}</span><span>{formatPrice(totalPrice)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">{t('checkout.shipping')}</span><span>{shipping === 0 ? t('checkout.free') : formatPrice(shipping)}</span></div>
                </div>
                <div className="flex justify-between py-4 text-lg font-bold"><span>{t('checkout.total')}</span><span>{formatPrice(grandTotal)}</span></div>
                <Button type="submit" fullWidth size="lg" loading={loading}><ShieldCheck className="h-4 w-4" /> {t('checkout.confirmBtn')}</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

