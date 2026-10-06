import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

const LandingPage = () => (
  <div className="min-h-screen bg-emerald-50 text-slate-800">
    <nav className="mx-auto max-w-6xl flex items-center justify-between p-5">
      <div className="text-xl font-bold text-emerald-800">CropAdvisor</div>
      <div className="flex gap-4">
        <Link to="/login" className="rounded-full border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-800">Login</Link>
        <Link to="/register" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white">Get Started</Link>
      </div>
    </nav>
    <main className="mx-auto max-w-6xl p-5 py-10">
      <section className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-800">AI-powered crop guidance</p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">Smarter crop decisions for Indian farmers</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Get crop-specific, contextual guidance on irrigation, nutrient management, disease risk, and farm planning based on your field conditions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="rounded-full bg-emerald-700 px-6 py-3 font-medium text-white shadow-lg">Create account</Link>
            <Link to="/login" className="rounded-full border border-emerald-700 px-6 py-3 font-medium text-emerald-700">Sign in</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl">
          <div className="grid gap-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm text-slate-500">Crop</p>
              <p className="mt-1 text-xl font-semibold">Tomato</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-sm text-slate-500">Risk</p>
              <p className="mt-1 text-xl font-semibold text-amber-700">Medium</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm text-slate-500">Advice</p>
              <p className="mt-1 text-lg font-semibold text-sky-700">Check drainage, monitor leaf spots, and adjust irrigation</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
);

const LoginPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState('demo@example.com');
  const [password, setPassword] = React.useState('demo123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
        </div>
        <button type="submit" className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white">Sign in</button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Need an account? <Link className="text-emerald-700" to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
};

const RegisterPage = () => {
  const { signUp } = useAuth();
  const [name, setName] = React.useState('Demo Farmer');
  const [email, setEmail] = React.useState('demo@example.com');
  const [password, setPassword] = React.useState('demo123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp({ name, email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800">Create account</h2>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
        </div>
        <button type="submit" className="mt-6 w-full rounded-xl bg-emerald-700 px-4 py-3 font-medium text-white">Register</button>
      </form>
    </div>
  );
};

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">Dashboard</p>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.name || 'Farmer'}</h1>
          </div>
          <button onClick={signOut} className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white">Log out</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total advisories</p><p className="mt-2 text-3xl font-bold">3</p></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Low risk</p><p className="mt-2 text-3xl font-bold text-emerald-600">1</p></div>
          <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Top crop</p><p className="mt-2 text-3xl font-bold text-amber-600">Tomato</p></div>
        </div>
      </div>
    </div>
  );
};

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link to="/" className="mt-4 inline-block rounded-full bg-emerald-700 px-5 py-2 text-white">Back home</Link>
    </div>
  </div>
);

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicOnly><LandingPage /></PublicOnly>} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
