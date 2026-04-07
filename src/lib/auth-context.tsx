'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAttempts: number;
  isLocked: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity
// Production lockout constants — used when real backend auth is integrated
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MAX_LOGIN_ATTEMPTS = 5;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const demoUser: User = {
  id: '1',
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@email.com',
  phone: '+509 34 12 5678',
  dateOfBirth: '1990-03-15',
  address: 'Pétion-Ville, Port-au-Prince',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLocked, setIsLocked] = useState(false);

  // Session timeout: auto-logout after inactivity
  const resetSessionTimeout = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    sessionTimeoutRef.current = setTimeout(() => {
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
    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / 60000);
      return { success: false, error: `Compte temporairement verrouillé. Réessayez dans ${remainingMinutes} minute(s).` };
    }

    // Reset lockout if expired
    if (lockoutUntil && Date.now() >= lockoutUntil) {
      setLockoutUntil(null);
      setLoginAttempts(0);
      setIsLocked(false);
    }

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Veuillez remplir tous les champs.' };
    }

    // Simulate network delay (constant time to prevent timing attacks)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Demo mode: all logins succeed. In production, a failed login would:
    // 1. Increment loginAttempts
    // 2. If loginAttempts >= MAX_LOGIN_ATTEMPTS, set lockout
    // Example for production backend integration:
    // const newAttempts = loginAttempts + 1;
    // setLoginAttempts(newAttempts);
    // if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
    //   setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS);
    //   setIsLocked(true);
    //   return { success: false, error: 'Trop de tentatives. Compte verrouillé pour 5 minutes.' };
    // }

    setUser(demoUser);
    setLoginAttempts(0);
    setLockoutUntil(null);
    setIsLocked(false);
    return { success: true };
  }, [lockoutUntil]);

  const register = useCallback(
    async (data: Partial<User> & { password: string }): Promise<{ success: boolean; error?: string }> => {
      if (!data.email?.trim() || !data.password?.trim() || !data.firstName?.trim() || !data.lastName?.trim()) {
        return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setUser({
        ...demoUser,
        firstName: data.firstName || demoUser.firstName,
        lastName: data.lastName || demoUser.lastName,
        email: data.email || demoUser.email,
      });
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    if (sessionTimeoutRef.current) clearTimeout(sessionTimeoutRef.current);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loginAttempts, isLocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
