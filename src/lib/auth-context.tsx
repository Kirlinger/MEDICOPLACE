'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { User } from '@/types';
import { apiRequest } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch current user from server on mount
  const refreshUser = useCallback(async () => {
    try {
      const { ok, data } = await apiRequest<{ user: User | null }>('/api/auth/me');
      if (ok && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Session timeout: auto-logout after inactivity
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    sessionTimeoutRef.current = setTimeout(async () => {
      await apiRequest('/api/auth/logout', { method: 'POST' });
      setUser(null);
    }, SESSION_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handler = () => resetSessionTimeout();

    events.forEach((event) => window.addEventListener(event, handler, { passive: true }));
    resetSessionTimeout();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handler));
      if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
    };
  }, [user, resetSessionTimeout]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Client-side validation
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Veuillez remplir tous les champs.' };
    }

    try {
      const { ok, data, status } = await apiRequest<{ success?: boolean; error?: string; user?: User }>(
        '/api/auth/login',
        { method: 'POST', body: { email, password } }
      );

      if (ok && data.user) {
        setUser(data.user);
        return { success: true };
      }

      if (status === 429) {
        return { success: false, error: 'Trop de tentatives. Veuillez patienter quelques minutes.' };
      }

      return { success: false, error: data.error || 'Identifiants incorrects.' };
    } catch {
      return { success: false, error: 'Erreur de connexion. Veuillez réessayer.' };
    }
  }, []);

  const register = useCallback(
    async (data: Partial<User> & { password: string }): Promise<{ success: boolean; error?: string }> => {
      if (!data.email?.trim() || !data.password?.trim() || !data.firstName?.trim() || !data.lastName?.trim()) {
        return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
      }

      try {
        const { ok, data: resData, status } = await apiRequest<{ success?: boolean; error?: string; user?: User }>(
          '/api/auth/register',
          {
            method: 'POST',
            body: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone || '',
              password: data.password,
            },
          }
        );

        if (ok && resData.user) {
          setUser(resData.user);
          return { success: true };
        }

        if (status === 429) {
          return { success: false, error: 'Trop de tentatives. Veuillez patienter.' };
        }

        return { success: false, error: resData.error || 'Erreur lors de la création du compte.' };
      } catch {
        return { success: false, error: 'Erreur de connexion. Veuillez réessayer.' };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setUser(null);
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
