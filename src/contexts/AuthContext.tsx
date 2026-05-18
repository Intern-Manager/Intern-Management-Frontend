import  { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authService } from '../services/authService';

const STORAGE_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const ROLE_ROUTES: Record<number, string> = {
  1: '/admin/dashboard',
  2: '/mentor/dashboard',
  3: '/intern/dashboard',
  4: '/hr/dashboard',
  5: '/coordinator/dashboard',
};

export interface User {
  userId: number;
  fullName: string;
  email: string;
  roleId: number;
  status: string;
  emailVerified: boolean;
  avatarUrl?: string | null;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (userData: User, accessToken: string, refreshTokenValue: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function removeStored(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStored(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => getStored(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => getStored(REFRESH_TOKEN_KEY));

  const login = useCallback((userData: User, accessToken: string, refreshTokenValue: string) => {
    setUser(userData);
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setStored(STORAGE_KEY, JSON.stringify(userData));
    setStored(TOKEN_KEY, accessToken);
    setStored(REFRESH_TOKEN_KEY, refreshTokenValue);
  }, []);

  const logout = useCallback(async () => {
    const rt = getStored(REFRESH_TOKEN_KEY);
    if (rt) {
      authService.logout(rt).catch(() => {});
    }
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    removeStored(STORAGE_KEY);
    removeStored(TOKEN_KEY);
    removeStored(REFRESH_TOKEN_KEY);
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      setStored(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, isAuthenticated: !!token, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
