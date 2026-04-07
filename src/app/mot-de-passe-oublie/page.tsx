'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Mail, Plus, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSent(true);
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
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50"><CheckCircle className="h-8 w-8 text-primary-600" /></div>
              <h1 className="mb-2 text-2xl font-bold text-secondary-900">Email envoyé !</h1>
              <p className="mb-6 text-sm text-gray-500">Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques instants.</p>
              <Link href="/connexion" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"><ArrowLeft className="h-4 w-4" /> Retour à la connexion</Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-secondary-900">Mot de passe oublié ?</h1>
                <p className="mt-2 text-sm text-gray-500">Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Email" type="email" placeholder="votre@email.com" icon={<Mail className="h-4 w-4" />} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button type="submit" fullWidth loading={loading} size="lg">Envoyer le lien</Button>
              </form>
              <p className="mt-6 text-center"><Link href="/connexion" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"><ArrowLeft className="h-4 w-4" /> Retour à la connexion</Link></p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
