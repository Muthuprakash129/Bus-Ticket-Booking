# Bus Ticket Booking Management System

Full-stack Bus Ticket Booking system with React (TypeScript + Tailwind) frontend and Node.js (Express + MongoDB) backend, as per TASK 03 requirements.

## Features

- **User roles**: Admin/Operator, Customer (authenticated)
- **Ticket booking**: Passenger name, route (dropdown), seat number, departure time, fare; auto booking timestamp
- **View all tickets**, **cancel by ID** with confirmation (only BOOKED)
- **Filter** by route, **sort** by booking date (descending), **reset filters**
- **Dashboard**: Total revenue (BOOKED only), total tickets, active vs cancelled stats
- **UI**: Responsive (Tailwind), React Router, status badges (Booked=green, Cancelled=red, Completed=blue), form validation, confirmation dialog, currency/date formatting
- **Conflict handling**: Double booking prevention (same route + seat + departure)
- **Pagination** on ticket list

## Repos / Folders

- **frontend** – React + TypeScript + Tailwind + Vite
- **backend** – Node.js + Express + TypeScript + MongoDB (Mongoose)
- **db** – Schema/docs for database (MongoDB)

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET
npm install
npm run dev
```

Runs at `http://localhost:5000`. Needs MongoDB running locally or a cloud URI in `.env`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:3000` with API proxy to backend.

### 3. Use the app

1. Open `http://localhost:3000`
2. Register (or Login) – choose role: Customer / Operator / Admin
3. Dashboard: view revenue and ticket stats
4. Tickets: view list, filter by route, sort by date, cancel (with confirmation), pagination
5. Book Ticket: create new booking (validated; duplicate seat/route/time prevented)

## API (sample)

- `POST /api/auth/register` – register
- `POST /api/auth/login` – login (returns JWT)
- `POST /api/tickets/book` – book ticket (auth)
- `GET /api/tickets/all` – all tickets (auth)
- `GET /api/tickets/byRoute?route=...` – filter by route (auth)
- `GET /api/tickets/sortedByDate` – tickets sorted by date (auth)
- `PUT /api/tickets/cancel/:id` – cancel ticket (auth)
- `GET /api/tickets/statistics` – dashboard stats (auth)

## Env files

- **backend**: copy `backend/.env.example` to `backend/.env` and set `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
- **frontend**: optional `frontend/.env` with `VITE_API_BASE_URL` if not using Vite proxy (default proxy targets `http://localhost:5000`).

## Pushing to GitHub

As per task: push as 3 repos – Frontend, Backend, DB. Include `.env.example` in each relevant repo; do not commit real `.env` or secrets.
