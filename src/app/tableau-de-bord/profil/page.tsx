'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, Save, AlertCircle, Lock } from 'lucide-react';
import { isValidEmail, isValidPhone, isValidName, checkPasswordStrength, passwordsMatch } from '@/lib/validation';
import { apiRequest } from '@/lib/api-client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '',
    phone: user?.phone || '', dateOfBirth: user?.dateOfBirth || '', address: user?.address || '',
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const passwordStrength = checkPasswordStrength(passwordForm.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!isValidName(form.firstName) || !isValidName(form.lastName)) {
      setError('Veuillez entrer un prénom et un nom valides.');
      return;
    }

    if (!isValidEmail(form.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    if (form.phone && !isValidPhone(form.phone)) {
      setError('Veuillez entrer un numéro de téléphone valide (+509 XX XX XXXX).');
      return;
    }

    setSaving(true);
    try {
      const { ok, data } = await apiRequest<{ success?: boolean; error?: string }>(
        '/api/users/profile',
        { method: 'PATCH', body: form }
      );

      if (ok) {
        setSuccess(true);
        await refreshUser();
      } else {
        setError(data.error || 'Erreur lors de la mise à jour du profil.');
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h1 className="text-2xl font-bold text-secondary-900">Mon profil</h1>
        <p className="mt-1 text-gray-500">Gérez vos informations personnelles et vos préférences</p>
      </div>
      <div className="card-premium p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            <User className="h-10 w-10" />
          </div>
          <div><h2 className="text-lg font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h2><p className="text-sm text-gray-500">{user?.email}</p></div>
        </div>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Profil mis à jour avec succès.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} autoComplete="given-name" maxLength={100} />
            <Input label="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} autoComplete="family-name" maxLength={100} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" maxLength={254} />
            <Input label="Téléphone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" maxLength={20} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Date de naissance" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} autoComplete="bday" />
            <Input label="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} autoComplete="street-address" maxLength={200} />
          </div>
          <div className="flex justify-end"><Button type="submit" loading={saving}><Save className="h-4 w-4" /> Sauvegarder</Button></div>
        </form>
      </div>

      {/* Password Change Section */}
      <div className="card-premium p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Changer le mot de passe</h2>
        {passwordError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}
        {passwordSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Mot de passe modifié avec succès.
          </div>
        )}
        <form onSubmit={async (e) => {
          e.preventDefault();
          setPasswordError('');
          setPasswordSuccess(false);

          if (!passwordForm.currentPassword) {
            setPasswordError('Veuillez entrer votre mot de passe actuel.');
            return;
          }

          if (!passwordStrength.isValid) {
            setPasswordError('Le nouveau mot de passe ne remplit pas les critères de sécurité.');
            return;
          }

          if (!passwordsMatch(passwordForm.newPassword, passwordForm.confirmPassword)) {
            setPasswordError('Les mots de passe ne correspondent pas.');
            return;
          }

          setPasswordSaving(true);
          try {
            const { ok, data } = await apiRequest<{ success?: boolean; error?: string }>(
              '/api/auth/password',
              { method: 'PATCH', body: { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword } }
            );

            if (ok) {
              setPasswordSuccess(true);
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
              setPasswordError(data.error || 'Erreur lors du changement de mot de passe.');
            }
          } catch {
            setPasswordError('Erreur de connexion. Veuillez réessayer.');
          } finally {
            setPasswordSaving(false);
          }
        }} className="space-y-4" noValidate>
          <Input label="Mot de passe actuel" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required autoComplete="current-password" maxLength={128} />
          <Input label="Nouveau mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required autoComplete="new-password" maxLength={128} />
          {passwordForm.newPassword && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-2 text-xs font-medium text-gray-600">Exigences :</p>
              <ul className="space-y-1 text-xs">
                <li className={passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}>• Au moins 8 caractères</li>
                <li className={passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>• Majuscule et minuscule</li>
                <li className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>• Un chiffre</li>
                <li className={passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>• Un caractère spécial</li>
              </ul>
            </div>
          )}
          <Input label="Confirmer le nouveau mot de passe" type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required autoComplete="new-password" maxLength={128} error={passwordForm.confirmPassword && !passwordsMatch(passwordForm.newPassword, passwordForm.confirmPassword) ? 'Les mots de passe ne correspondent pas' : undefined} />
          <div className="flex justify-end"><Button type="submit" loading={passwordSaving}><Lock className="h-4 w-4" /> Changer le mot de passe</Button></div>
        </form>
      </div>
    </div>
  );
}
