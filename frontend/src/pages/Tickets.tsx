import { useEffect, useState, useMemo } from 'react';
import { ticketsApi } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatCurrency, formatDateTime } from '../utils/format';
import type { Ticket } from '../types';

const ROUTES = ['Chennai - Bangalore', 'Chennai - Mumbai', 'Bangalore - Hyderabad', 'Mumbai - Pune', 'Delhi - Jaipur'];
const PAGE_SIZE = 10;

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [sortByDateDesc, setSortByDateDesc] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchTickets = () => {
    setLoading(true);
    setError('');
    const promise = routeFilter
      ? ticketsApi.byRoute(routeFilter)
      : ticketsApi.sortedByDate();
    promise
      .then(({ data }) => {
        if (data.success && data.tickets) setTickets(data.tickets);
      })
      .catch(() => setError('Failed to load tickets'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, [routeFilter]);

  const sortedTickets = useMemo(() => {
    const list = [...tickets];
    list.sort((a, b) => {
      const da = new Date(a.bookingTimestamp).getTime();
      const db = new Date(b.bookingTimestamp).getTime();
      return sortByDateDesc ? db - da : da - db;
    });
    return list;
  }, [tickets, sortByDateDesc]);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedTickets.slice(start, start + PAGE_SIZE);
  }, [sortedTickets, page]);

  const totalPages = Math.ceil(sortedTickets.length / PAGE_SIZE) || 1;

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await ticketsApi.cancel(cancelId);
      setCancelId(null);
      fetchTickets();
    } catch {
      setError('Failed to cancel ticket');
    }
  };

  const resetFilters = () => {
    setRouteFilter('');
    setSortByDateDesc(true);
    setPage(1);
    ticketsApi.sortedByDate().then(({ data }) => {
      if (data.success && data.tickets) setTickets(data.tickets);
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Tickets</h1>
        <p className="mt-1 text-slate-500">View, filter, and manage bookings</p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
        <div className="min-w-[180px]">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
            Filter by Route
          </label>
          <select
            value={routeFilter}
            onChange={(e) => { setRouteFilter(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All routes</option>
            {ROUTES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2.5">
          <input
            type="checkbox"
            checked={sortByDateDesc}
            onChange={(e) => setSortByDateDesc(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-slate-700">Newest first</span>
        </label>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Reset filters
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
            <p className="text-sm font-medium text-slate-500">Loading tickets...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Passenger</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Route</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Seat</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Departure</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Fare</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Booked at</th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedTickets.map((t) => (
                    <tr key={t._id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">{t.passengerName}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{t.route}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{t.seatNumber}</td>
                      <td className="px-5 py-4 text-sm text-slate-600">{formatDateTime(t.departureTime)}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">{formatCurrency(t.fare)}</td>
                      <td className="px-5 py-4"><StatusBadge status={t.status} /></td>
                      <td className="px-5 py-4 text-sm text-slate-500">{formatDateTime(t.bookingTimestamp)}</td>
                      <td className="px-5 py-4 text-right">
                        {t.status === 'BOOKED' && (
                          <button
                            type="button"
                            onClick={() => setCancelId(t._id)}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!cancelId}
        title="Cancel Ticket"
        message="Are you sure you want to cancel this ticket? This cannot be undone."
        confirmLabel="Cancel Ticket"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </div>
  );
}
