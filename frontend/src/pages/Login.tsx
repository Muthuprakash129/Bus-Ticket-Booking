import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    try {
      const { data } = await authApi.login(email, password);
      if (data.success && data.token && data.user) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setSubmitError('Login failed');
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Login failed';
      setSubmitError(msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft">
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-xl font-bold text-white shadow-lg shadow-primary-500/30">
              B
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
              <p className="text-sm text-slate-500">Bus Ticket Booking</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 hover:shadow-primary-600/30 active:scale-[0.99]"
            >
              Sign in
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
