'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isValidEmail, isValidPhone, isValidName, checkPasswordStrength, passwordsMatch } from '@/lib/validation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function InscriptionPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const strength = checkPasswordStrength(form.password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidName(form.firstName) || !isValidName(form.lastName)) {
      setError('Veuillez entrer un prénom et un nom valides.');
      return;
    }

    if (!isValidEmail(form.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (form.phone && !isValidPhone(form.phone)) {
      setError('Veuillez entrer un numéro de téléphone haïtien valide (+509 XX XX XXXX).');
      return;
    }

    if (!strength.isValid) {
      setError('Votre mot de passe ne remplit pas tous les critères de sécurité.');
      return;
    }

    if (!passwordsMatch(form.password, form.confirmPassword)) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const result = await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      if (result.success) {
        router.push('/tableau-de-bord');
      } else {
        setError(result.error || 'Une erreur est survenue. Veuillez réessayer.');
      }
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
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Prénom" placeholder="Votre prénom" icon={<User className="h-4 w-4" />} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required autoComplete="given-name" maxLength={100} />
              <Input label="Nom" placeholder="Votre nom" icon={<User className="h-4 w-4" />} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required autoComplete="family-name" maxLength={100} />
            </div>
            <Input label="Email" type="email" placeholder="votre@email.com" icon={<Mail className="h-4 w-4" />} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" maxLength={254} />
            <Input label="Téléphone" type="tel" placeholder="+509 00 00 0000" icon={<Phone className="h-4 w-4" />} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" maxLength={20} />
            <Input label="Mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" maxLength={128} />
            {form.password && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="mb-2 text-xs font-medium text-gray-600">Votre mot de passe doit contenir :</p>
                <ul className="space-y-1 text-xs">
                  <li className={`flex items-center gap-1.5 ${strength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {strength.hasMinLength ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} Au moins 8 caractères
                  </li>
                  <li className={`flex items-center gap-1.5 ${strength.hasUpperCase && strength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {strength.hasUpperCase && strength.hasLowerCase ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} Une lettre majuscule et une minuscule
                  </li>
                  <li className={`flex items-center gap-1.5 ${strength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {strength.hasNumber ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} Un chiffre
                  </li>
                  <li className={`flex items-center gap-1.5 ${strength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {strength.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} Un caractère spécial
                  </li>
                </ul>
              </div>
            )}
            <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required autoComplete="new-password" maxLength={128} error={form.confirmPassword && !passwordsMatch(form.password, form.confirmPassword) ? 'Les mots de passe ne correspondent pas' : undefined} />
            <Button type="submit" fullWidth loading={loading} size="lg">Créer mon compte</Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Déjà un compte ?{' '}<Link href="/connexion" className="font-semibold text-primary-600 hover:text-primary-700">Se connecter</Link></p>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">En créant un compte, vous acceptez nos{' '}<Link href="#" className="underline hover:text-gray-600">conditions d&apos;utilisation</Link>{' '}et notre{' '}<Link href="#" className="underline hover:text-gray-600">politique de confidentialité</Link>.</p>
      </div>
    </section>
  );
}
