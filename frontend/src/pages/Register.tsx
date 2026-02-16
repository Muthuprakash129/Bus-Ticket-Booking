import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin' | 'operator'>('customer');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    try {
      const { data } = await authApi.register({ email, password, name, role });
      if (data.success && data.token && data.user) {
        login(data.token, data.user);
        navigate('/');
      } else {
        setSubmitError('Registration failed');
      }
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Registration failed';
      setSubmitError(msg || 'Registration failed');
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
              <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
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
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
                placeholder="Min 6 characters"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'customer' | 'admin' | 'operator')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="customer">Customer</option>
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 hover:shadow-primary-600/30 active:scale-[0.99]"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
