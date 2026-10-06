import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('cropadvisor-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('cropadvisor-user');
      }
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    if (!email || !password) throw new Error('Email and password are required.');
    const nextUser = { id: 'demo-user', name: 'Demo Farmer', email };
    localStorage.setItem('cropadvisor-user', JSON.stringify(nextUser));
    localStorage.setItem('cropadvisor-token', 'demo-token');
    setUser(nextUser);
    return nextUser;
  }

  async function signUp(form: { name?: string; email: string; password: string }) {
    const nextUser = { id: `user-${Date.now()}`, name: form.name || 'Demo Farmer', email: form.email };
    localStorage.setItem('cropadvisor-user', JSON.stringify(nextUser));
    localStorage.setItem('cropadvisor-token', 'demo-token');
    setUser(nextUser);
    return nextUser;
  }

  async function signOut() {
    localStorage.removeItem('cropadvisor-user');
    localStorage.removeItem('cropadvisor-token');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
