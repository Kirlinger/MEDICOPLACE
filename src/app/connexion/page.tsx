'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isValidEmail } from '@/lib/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ConnexionPage() {
  const router = useRouter();
  const { login, isLocked } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/tableau-de-bord');
      } else {
        setError(result.error || 'Identifiants incorrects.');
      }
    } finally { setLoading(false); }
  };

  return (
    <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-50/50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white"><Plus className="h-6 w-6" strokeWidth={3} /></div>
            <span className="text-2xl font-bold text-secondary-900">MEDICO<span className="text-primary-600">PLACE</span></span>
          </Link>
        </div>
        <div className="card-premium p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-secondary-900">Bienvenue</h1>
            <p className="mt-2 text-sm text-gray-500">Connectez-vous à votre espace MEDICOPLACE</p>
          </div>
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Email" type="email" placeholder="votre@email.com" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" maxLength={254} />
            <Input label="Mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" maxLength={128} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link href="/mot-de-passe-oublie" className="text-sm font-medium text-primary-600 hover:text-primary-700">Mot de passe oublié ?</Link>
            </div>
            <Button type="submit" fullWidth loading={loading} size="lg" disabled={isLocked}>Se connecter</Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Pas encore de compte ?{' '}<Link href="/inscription" className="font-semibold text-primary-600 hover:text-primary-700">Créer un compte</Link></p>
        </div>
      </div>
    </section>
  );
}
