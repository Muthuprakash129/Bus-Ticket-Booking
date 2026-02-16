# Database (Bus Ticket Booking) – MongoDB

The backend uses **MongoDB** with **Mongoose**. No separate DB server repo is required; the backend connects using `MONGODB_URI` in `.env`.

## Collections (Mongoose models)

- **users** – email (unique), password (hashed), name, role (admin | operator | customer), createdAt
- **tickets** – passengerName, route, seatNumber, departureTime, fare, status (BOOKED | CANCELLED | COMPLETED), bookingTimestamp, bookedBy (ref User), createdAt, updatedAt

## Indexes

- **tickets**: compound index on (route, seatNumber, departureTime, status) for double-booking checks.
- **users**: unique index on email (via Mongoose schema).

## Connection

Set `MONGODB_URI` in `backend/.env`:

- Local: `mongodb://localhost:27017/bus-ticket-booking`
- Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/bus-ticket-booking?retryWrites=true&w=majority`

Schema and models are defined in `backend/src/models/` (User.ts, Ticket.ts).
