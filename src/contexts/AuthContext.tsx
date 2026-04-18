'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  getSession,
  saveSession,
  clearSession,
  verifyCredentials,
  registerUser,
} from '@/src/lib/auth/authUtils';
import type { AuthSession } from '@/src/lib/auth/types';

interface AuthContextValue {
  user: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    } else {
      document.cookie = 'auth_session=; path=/; max-age=0';
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const storedUser = await verifyCredentials(email, password);
      const session: AuthSession = {
        userId: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
      };
      saveSession(session);
      setUser(session);
      router.push('/overview');
    },
    [router],
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const storedUser = await registerUser(name, email, password);
      const session: AuthSession = {
        userId: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
      };
      saveSession(session);
      setUser(session);
      router.push('/overview');
    },
    [router],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
