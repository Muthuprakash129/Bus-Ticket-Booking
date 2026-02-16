import api from '../utils/axios';
import type { User, Ticket, Statistics, BookTicketPayload } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; token: string; user: User }>('/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post<{ success: boolean; token: string; user: User }>('/auth/register', data),
};

export const ticketsApi = {
  book: (payload: BookTicketPayload) =>
    api.post<{ success: boolean; ticket: Ticket }>('/tickets/book', payload),
  all: () => api.get<{ success: boolean; tickets: Ticket[] }>('/tickets/all'),
  byRoute: (route: string) =>
    api.get<{ success: boolean; tickets: Ticket[] }>('/tickets/byRoute', { params: { route } }),
  sortedByDate: () =>
    api.get<{ success: boolean; tickets: Ticket[] }>('/tickets/sortedByDate'),
  cancel: (id: string) =>
    api.put<{ success: boolean; ticket: Ticket }>(`/tickets/cancel/${id}`),
  statistics: () =>
    api.get<{ success: boolean; statistics: Statistics }>('/tickets/statistics'),
};
