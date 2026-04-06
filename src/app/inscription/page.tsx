'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function InscriptionPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      router.push('/tableau-de-bord');
    } finally { setLoading(false); }
  };

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-50/50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white"><Plus className="h-6 w-6" strokeWidth={3} /></div>
            <span className="text-2xl font-bold text-secondary-900">MEDICO<span className="text-primary-600">PLACE</span></span>
          </Link>
        </div>
        <div className="card-premium p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-secondary-900">Créer un compte</h1>
            <p className="mt-2 text-sm text-gray-500">Rejoignez MEDICOPLACE et accédez à tous nos services de santé</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Prénom" placeholder="Votre prénom" icon={<User className="h-4 w-4" />} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              <Input label="Nom" placeholder="Votre nom" icon={<User className="h-4 w-4" />} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <Input label="Email" type="email" placeholder="votre@email.com" icon={<Mail className="h-4 w-4" />} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Téléphone" type="tel" placeholder="06 12 34 56 78" icon={<Phone className="h-4 w-4" />} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            <Button type="submit" fullWidth loading={loading} size="lg">Créer mon compte</Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Déjà un compte ?{' '}<Link href="/connexion" className="font-semibold text-primary-600 hover:text-primary-700">Se connecter</Link></p>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">En créant un compte, vous acceptez nos{' '}<Link href="#" className="underline hover:text-gray-600">conditions d&apos;utilisation</Link>{' '}et notre{' '}<Link href="#" className="underline hover:text-gray-600">politique de confidentialité</Link>.</p>
      </div>
    </section>
  );
}
