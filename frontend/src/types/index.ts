export type UserRole = 'admin' | 'operator' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type TicketStatus = 'BOOKED' | 'CANCELLED' | 'COMPLETED';

export interface Ticket {
  _id: string;
  passengerName: string;
  route: string;
  seatNumber: string;
  departureTime: string;
  fare: number;
  status: TicketStatus;
  bookingTimestamp: string;
  bookedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Statistics {
  totalRevenue: number;
  totalTickets: number;
  booked: number;
  cancelled: number;
  completed: number;
}

export interface BookTicketPayload {
  passengerName: string;
  route: string;
  seatNumber: string;
  departureTime: string;
  fare: number;
}
