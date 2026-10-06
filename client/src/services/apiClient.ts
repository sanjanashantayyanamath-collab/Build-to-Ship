import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('cropadvisor-user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const normalizedUser = { id: 'demo-user', name: 'Demo Farmer', email };
    localStorage.setItem('cropadvisor-user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  };

  const signUp = async ({ name, email, password }) => {
    const normalizedUser = { id: 'demo-user', name: name || 'Demo Farmer', email };
    localStorage.setItem('cropadvisor-user', JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    return normalizedUser;
  };

  const signOut = async () => {
    localStorage.removeItem('cropadvisor-user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
