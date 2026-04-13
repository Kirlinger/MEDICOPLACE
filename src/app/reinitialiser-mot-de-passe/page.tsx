'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { checkPasswordStrength, passwordsMatch } from '@/lib/validation';
import { useLanguage } from '@/lib/language-context';
import { apiRequest } from '@/lib/api-client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const strength = checkPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError(t('auth.resetInvalidToken'));
      return;
    }

    if (!strength.isValid) {
      setError(t('auth.errorPasswordStrength'));
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      setError(t('auth.errorPasswordMatch'));
      return;
    }

    setLoading(true);
    try {
      const { ok, status, data } = await apiRequest<{ success?: boolean; error?: string }>(
        '/api/auth/reset-password',
        { method: 'POST', body: { token, password } }
      );

      if (ok && data.success) {
        setDone(true);
      } else if (status === 429) {
        setError(t('auth.tooManyAttempts'));
      } else {
        setError(data.error || t('auth.resetError'));
      }
    } catch {
      setError(t('auth.connectionError'));
    } finally {
      setLoading(false);
    }
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
              <h1 className="mb-2 text-2xl font-bold text-secondary-900">{t('auth.resetDoneTitle')}</h1>
              <p className="mb-6 text-sm text-gray-500">{t('auth.resetDoneText')}</p>
              <Link href="/connexion" className="inline-flex rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700">{t('auth.loginBtn')}</Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-secondary-900">{t('auth.resetTitle')}</h1>
                <p className="mt-2 text-sm text-gray-500">{t('auth.resetSubtitle')}</p>
              </div>
              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input label={t('auth.newPassword')} type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" maxLength={128} />
                <Input label={t('auth.confirmNewPassword')} type="password" placeholder="••••••••" icon={<Lock className="h-4 w-4" />} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" maxLength={128} error={confirmPassword && !passwordsMatch(password, confirmPassword) ? t('auth.errorPasswordMatch') : undefined} />
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-2 text-xs font-medium text-gray-600">{t('auth.passwordRequirements')}</p>
                  <ul className="space-y-1 text-xs">
                    <li className={`flex items-center gap-1.5 ${strength.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {strength.hasMinLength ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} {t('auth.req1')}
                    </li>
                    <li className={`flex items-center gap-1.5 ${strength.hasUpperCase && strength.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {strength.hasUpperCase && strength.hasLowerCase ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} {t('auth.req2')}
                    </li>
                    <li className={`flex items-center gap-1.5 ${strength.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {strength.hasNumber ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} {t('auth.req3')}
                    </li>
                    <li className={`flex items-center gap-1.5 ${strength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      {strength.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <span className="h-3 w-3">•</span>} {t('auth.req4')}
                    </li>
                  </ul>
                </div>
                <Button type="submit" fullWidth loading={loading} size="lg">{t('auth.resetBtn')}</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

