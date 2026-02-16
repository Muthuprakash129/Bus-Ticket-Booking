import mongoose, { Document, Schema } from 'mongoose';

export type TicketStatus = 'BOOKED' | 'CANCELLED' | 'COMPLETED';

export interface ITicket extends Document {
  passengerName: string;
  route: string;
  seatNumber: string;
  departureTime: Date;
  fare: number;
  status: TicketStatus;
  bookingTimestamp: Date;
  bookedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    passengerName: { type: String, required: true },
    route: { type: String, required: true },
    seatNumber: { type: String, required: true },
    departureTime: { type: Date, required: true },
    fare: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['BOOKED', 'CANCELLED', 'COMPLETED'], default: 'BOOKED' },
    bookingTimestamp: { type: Date, default: Date.now },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

ticketSchema.index({ route: 1, seatNumber: 1, departureTime: 1, status: 1 });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
