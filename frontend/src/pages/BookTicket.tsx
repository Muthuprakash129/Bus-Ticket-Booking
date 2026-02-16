import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsApi } from '../services/api';
import type { BookTicketPayload } from '../types';

const ROUTES = ['Chennai - Bangalore', 'Chennai - Mumbai', 'Bangalore - Hyderabad', 'Mumbai - Pune', 'Delhi - Jaipur'];

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20';
const labelClass = 'block text-sm font-semibold text-slate-700 mb-1.5';

export function BookTicket() {
  const navigate = useNavigate();
  const [passengerName, setPassengerName] = useState('');
  const [route, setRoute] = useState(ROUTES[0]);
  const [seatNumber, setSeatNumber] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [fare, setFare] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!passengerName.trim()) next.passengerName = 'Passenger name is required';
    if (!route) next.route = 'Route is required';
    if (!seatNumber.trim()) next.seatNumber = 'Seat number is required';
    if (!departureTime) next.departureTime = 'Departure time is required';
    const fareNum = parseFloat(fare);
    if (fare === '' || isNaN(fareNum) || fareNum <= 0) next.fare = 'Fare must be a positive number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setLoading(true);
    const payload: BookTicketPayload = {
      passengerName: passengerName.trim(),
      route,
      seatNumber: seatNumber.trim(),
      departureTime: new Date(departureTime).toISOString(),
      fare: parseFloat(fare),
    };
    try {
      const { data } = await ticketsApi.book(payload);
      if (data.success) {
        navigate('/tickets');
        return;
      }
      setSubmitError('Booking failed');
    } catch (err: unknown) {
      const res = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data
        : null;
      setSubmitError(res?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Book Ticket</h1>
        <p className="mt-1 text-slate-500">Create a new bus ticket booking</p>
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-soft max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <div>
            <label className={labelClass}>Passenger Name</label>
            <input
              type="text"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className={inputClass}
              placeholder="Full name"
            />
            {errors.passengerName && <p className="mt-1.5 text-sm text-red-600">{errors.passengerName}</p>}
          </div>
          <div>
            <label className={labelClass}>Route</label>
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className={inputClass}
            >
              {ROUTES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.route && <p className="mt-1.5 text-sm text-red-600">{errors.route}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Seat Number</label>
              <input
                type="text"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                className={inputClass}
                placeholder="e.g. A1, B12"
              />
              {errors.seatNumber && <p className="mt-1.5 text-sm text-red-600">{errors.seatNumber}</p>}
            </div>
            <div>
              <label className={labelClass}>Fare (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
              {errors.fare && <p className="mt-1.5 text-sm text-red-600">{errors.fare}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>Departure Time</label>
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className={inputClass}
            />
            {errors.departureTime && <p className="mt-1.5 text-sm text-red-600">{errors.departureTime}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg shadow-primary-600/25 hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Ticket'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
