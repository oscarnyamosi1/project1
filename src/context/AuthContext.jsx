import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getStoredToken,
  getStoredUser,
  loginUser,
  logoutUser,
  registerUser,
} from '@/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUser(getStoredUser());
      setToken(getStoredToken());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const login = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      setUser(res.data.user);
      setToken(res.data.token);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
  };

  const updateUserLocally = (patch) =>
    setUser((u) => {
      const next = { ...(u || {}), ...patch };
      localStorage.setItem('wp_user', JSON.stringify(next));
      return next;
    });

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      loading,
      login,
      register,
      logout,
      updateUserLocally,
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
