import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener('auth:unauthorized', clearSession);
    const token = localStorage.getItem('token');
    if (!token) {
      setInitializing(false);
      return () => window.removeEventListener('auth:unauthorized', clearSession);
    }

    api.get('/auth/me')
      .then(({ data }) => {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
      })
      .catch(clearSession)
      .finally(() => setInitializing(false));

    return () => window.removeEventListener('auth:unauthorized', clearSession);
  }, [clearSession]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({ user, initializing, login, logout: clearSession }),
    [user, initializing, clearSession]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
