import { useCallback, useState } from 'react';
import type { User } from '../types';

const STORAGE_KEY = 'user';
const TOKEN_KEY = 'token';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAdminOrOperator = user?.role === 'admin' || user?.role === 'operator';

  return { user, token, login, logout, isAuthenticated: !!token, isAdminOrOperator };
}
