'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { User, Save, AlertCircle, Lock } from 'lucide-react';
import { isValidEmail, isValidPhone, isValidName, checkPasswordStrength, passwordsMatch } from '@/lib/validation';
import { apiRequest } from '@/lib/api-client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '',
    phone: user?.phone || '', dateOfBirth: user?.dateOfBirth || '', address: user?.address || '',
  });

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
      setError(t('auth.errorInvalidName'));
      return;
    }

    if (!isValidEmail(form.email)) {
      setError(t('auth.errorInvalidEmail'));
      return;
    }

    if (form.phone && !isValidPhone(form.phone)) {
      setError(t('auth.errorInvalidPhone'));
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
        setError(data.error || t('profile.errorUpdateProfile'));
      }
    } catch {
      setError(t('auth.connectionError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <h1 className="text-2xl font-bold text-secondary-900">{t('profile.title')}</h1>
        <p className="mt-1 text-gray-500">{t('profile.subtitle')}</p>
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
            {t('profile.successMsg')}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('auth.firstName')} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} autoComplete="given-name" maxLength={100} />
            <Input label={t('auth.lastName')} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} autoComplete="family-name" maxLength={100} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('auth.email')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" maxLength={254} />
            <Input label={t('auth.phone')} type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" maxLength={20} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label={t('profile.dateOfBirth')} type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} autoComplete="bday" />
            <Input label={t('profile.address')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} autoComplete="street-address" maxLength={200} />
          </div>
          <div className="flex justify-end"><Button type="submit" loading={saving}><Save className="h-4 w-4" /> {t('profile.save')}</Button></div>
        </form>
      </div>

      <div className="card-premium p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('profile.changePasswordTitle')}</h2>
        {passwordError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}
        {passwordSuccess && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {t('profile.passwordSuccessMsg')}
          </div>
        )}
        <form onSubmit={async (e) => {
          e.preventDefault();
          setPasswordError('');
          setPasswordSuccess(false);

          if (!passwordForm.currentPassword) {
            setPasswordError(t('profile.errorCurrentPassword'));
            return;
          }

          if (!passwordStrength.isValid) {
            setPasswordError(t('auth.errorPasswordStrength'));
            return;
          }

          if (!passwordsMatch(passwordForm.newPassword, passwordForm.confirmPassword)) {
            setPasswordError(t('auth.errorPasswordMatch'));
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
              setPasswordError(data.error || t('profile.errorChangePassword'));
            }
          } catch {
            setPasswordError(t('auth.connectionError'));
          } finally {
            setPasswordSaving(false);
          }
        }} className="space-y-4" noValidate>
          <Input label={t('profile.currentPassword')} type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required autoComplete="current-password" maxLength={128} />
          <Input label={t('auth.newPassword')} type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required autoComplete="new-password" maxLength={128} />
          {passwordForm.newPassword && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="mb-2 text-xs font-medium text-gray-600">{t('auth.passwordRequirements')}</p>
              <ul className="space-y-1 text-xs">
                <li className={passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'}>• {t('auth.req1')}</li>
                <li className={passwordStrength.hasUpperCase && passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}>• {t('auth.req2')}</li>
                <li className={passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'}>• {t('auth.req3')}</li>
                <li className={passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>• {t('auth.req4')}</li>
              </ul>
            </div>
          )}
          <Input label={t('auth.confirmNewPassword')} type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required autoComplete="new-password" maxLength={128} error={passwordForm.confirmPassword && !passwordsMatch(passwordForm.newPassword, passwordForm.confirmPassword) ? t('auth.errorPasswordMatch') : undefined} />
          <div className="flex justify-end"><Button type="submit" loading={passwordSaving}><Lock className="h-4 w-4" /> {t('profile.changePasswordBtn')}</Button></div>        </form>
      </div>
    </div>
  );
}

