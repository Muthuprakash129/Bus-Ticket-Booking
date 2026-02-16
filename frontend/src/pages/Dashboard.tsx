import { useEffect, useState } from 'react';
import { ticketsApi } from '../services/api';
import type { Statistics } from '../types';
import { formatCurrency } from '../utils/format';

const cardConfig = [
  { label: 'Total Revenue', key: 'totalRevenue', format: (v: number) => formatCurrency(v), bg: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  { label: 'Total Tickets', key: 'totalTickets', format: (v: number) => String(v), bg: 'from-primary-500 to-primary-700', shadow: 'shadow-primary-500/20' },
  { label: 'Booked', key: 'booked', format: (v: number) => String(v), bg: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/20' },
  { label: 'Cancelled', key: 'cancelled', format: (v: number) => String(v), bg: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/20' },
  { label: 'Completed', key: 'completed', format: (v: number) => String(v), bg: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
];

export function Dashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ticketsApi
      .statistics()
      .then(({ data }) => {
        if (data.success && data.statistics) setStats(data.statistics);
      })
      .catch(() => setError('Failed to load statistics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
          <p className="text-sm font-medium text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error || 'No statistics available'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Analytics overview</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {cardConfig.map(({ label, key, format, bg, shadow }) => {
          const value = stats[key as keyof Statistics] ?? 0;
          return (
            <div
              key={label}
              className={`rounded-2xl bg-gradient-to-br ${bg} p-6 text-white shadow-lg ${shadow} transition-transform hover:scale-[1.02]`}
            >
              <p className="text-sm font-medium opacity-90">{label}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight">{format(Number(value))}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
