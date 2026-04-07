'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    void email;
    void password;
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser(demoUser);
    return true;
  }, []);

  const register = useCallback(
    async (data: Partial<User> & { password: string }): Promise<boolean> => {
      void data.password;
      await new Promise((resolve) => setTimeout(resolve, 800));
      setUser({
        ...demoUser,
        firstName: data.firstName || demoUser.firstName,
        lastName: data.lastName || demoUser.lastName,
        email: data.email || demoUser.email,
      });
      return true;
    },
    []
  );

  const logout = useCallback(() => { setUser(null); }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
