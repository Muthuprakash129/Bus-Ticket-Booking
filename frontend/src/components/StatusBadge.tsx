import type { TicketStatus } from '../types';

const styles: Record<TicketStatus, string> = {
  BOOKED: 'bg-green-100 text-green-800 border-green-200/80',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200/80',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200/80',
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}
    >
      {status}
    </span>
  );
}
