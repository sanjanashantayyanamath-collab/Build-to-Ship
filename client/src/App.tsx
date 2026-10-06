import React, { useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-emerald-800">CropAdvisor</Link>
        <div className="flex items-center gap-3 text-sm">
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 rounded-full border border-slate-200">Login</Link>
              <Link to="/register" className="px-4 py-2 rounded-full bg-emerald-700 text-white">Get Started</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="px-3 py-2 rounded-full hover:bg-slate-100">Dashboard</Link>
              <Link to="/history" className="px-3 py-2 rounded-full hover:bg-slate-100">History</Link>
              <Link to="/profile" className="px-3 py-2 rounded-full hover:bg-slate-100">Profile</Link>
              <button onClick={signOut} className="px-4 py-2 rounded-full bg-slate-800 text-white">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-14 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-[0.2em]">AI-powered guidance</span>
          <h1 className="mt-5 text-4xl md:text-6xl font-black text-slate-900 leading-tight">Smarter crop decisions for farmers.</h1>
          <p className="mt-5 text-lg text-slate-600 max-w-xl">
            Get field-specific recommendations for irrigation, nutrient management, disease risk, and seasonal planning.
          </p>
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link to="/register" className="px-6 py-3 rounded-full bg-emerald-700 text-white font-medium shadow-lg">Create account</Link>
            <Link to="/login" className="px-6 py-3 rounded-full border border-emerald-700 text-emerald-700 font-medium">Sign in</Link>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Crop</p>
              <p className="mt-2 text-2xl font-bold text-slate-800">Tomato</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Risk</p>
              <p className="mt-2 text-2xl font-bold text-amber-700">Medium</p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Guidance</p>
              <p className="mt-2 text-base font-medium text-sky-700">Check drainage, monitor disease pressure, and reduce overhead irrigation.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
        <h2 className="text-3xl font-bold text-slate-800">Welcome back</h2>
        <p className="mt-2 text-slate-600">Log in to continue.</p>
        {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
          </label>
        </div>
        <button disabled={loading} className="mt-6 w-full bg-emerald-700 text-white py-3 rounded-xl font-medium disabled:opacity-60">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="mt-5 text-center text-sm text-slate-600">
          No account? <Link to="/register" className="text-emerald-700 font-medium">Create one</Link>
        </p>
      </form>
    </div>
  );
}

function RegisterPage() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: 'Demo Farmer', email: 'demo@example.com', password: 'demo123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUp(form);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-lg p-6">
        <h2 className="text-3xl font-bold text-slate-800">Create account</h2>
        <p className="mt-2 text-slate-600">Join the crop advisory platform.</p>
        {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 focus:border-emerald-500 focus:outline-none" />
          </label>
        </div>
        <button disabled={loading} className="mt-6 w-full bg-emerald-700 text-white py-3 rounded-xl font-medium disabled:opacity-60">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-emerald-700 font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.name || 'Farmer'}</h1>
          </div>
          <Link to="/advisory/new" className="bg-emerald-700 text-white px-5 py-3 rounded-full font-medium inline-block">New Advisory</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total advisories</p><p className="mt-2 text-3xl font-bold">3</p></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Low risk</p><p className="mt-2 text-3xl font-bold text-emerald-600">1</p></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Top crop</p><p className="mt-2 text-3xl font-bold text-amber-600">Tomato</p></div>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-slate-600">Page not found.</p>
        <Link to="/" className="mt-4 inline-block rounded-full bg-emerald-700 px-5 py-2 text-white">Back home</Link>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
