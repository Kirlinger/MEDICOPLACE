'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Lock, Plus, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDone(true);
    setLoading(false);
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
          {done ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50"><CheckCircle className="h-8 w-8 text-primary-600" /></div>
              <h1 className="mb-2 text-2xl font-bold text-secondary-900">Mot de passe modifié !</h1>
              <p className="mb-6 text-sm text-gray-500">Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.</p>
              <Link href="/connexion" className="inline-flex rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">Se connecter</Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-secondary-900">Nouveau mot de passe</h1>
                <p className="mt-2 text-sm text-gray-500">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nouveau mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-2 text-xs font-medium text-gray-600">Votre mot de passe doit contenir :</p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li>• Au moins 8 caractères</li>
                    <li>• Une lettre majuscule et une minuscule</li>
                    <li>• Un chiffre</li>
                    <li>• Un caractère spécial</li>
                  </ul>
                </div>
                <Button type="submit" fullWidth loading={loading} size="lg">Réinitialiser le mot de passe</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
