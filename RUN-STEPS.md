# How to Run – Bus Ticket Booking (Step by Step)

---

## Step 1: Install MongoDB (if not installed)

- **Option A – Local:** Download and install [MongoDB Community](https://www.mongodb.com/try/download/community) and start the MongoDB service.
- **Option B – Cloud:** Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), get the connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`).

See **MONGODB-SETUP.md** for detailed steps.

---

## Step 2: Backend – Create `.env` file

1. Open **File Explorer** and go to: `f:\zepto\backend`
2. Find the file **`.env.example`**
3. **Copy** it and **rename** the copy to **`.env`**
4. Open **`.env`** in a text editor and set:
   - **MONGODB_URI** – e.g. `mongodb://localhost:27017/bus-ticket-booking` (or your Atlas connection string)
   - **JWT_SECRET** – e.g. `your-secret-key-change-this`
5. Save and close the file.

---

## Step 3: Backend – Install and run

1. Open **Cursor Terminal** (or PowerShell).
2. Run:
   ```powershell
   cd f:\zepto\backend
   ```
3. Install dependencies (only needed once):
   ```powershell
   npm install
   ```
4. Start the backend server:
   ```powershell
   npm run dev
   ```
5. Wait until you see: **"MongoDB connected successfully"** and **"Server running on http://localhost:5000"**
6. **Leave this terminal open** (do not close it).

---

## Step 4: Frontend – Open a new terminal

1. In Cursor, open a **new terminal** (so the backend keeps running in the first one).
2. Run:
   ```powershell
   cd f:\zepto\frontend
   ```
3. Install dependencies (only needed once):
   ```powershell
   npm install
   ```
4. Start the frontend:
   ```powershell
   npm run dev
   ```
5. Wait until you see a line like: **"Local: http://localhost:3000"**
6. **Leave this terminal open** as well.

---

## Step 5: Open the app in the browser

1. Open your browser (Chrome, Edge, etc.).
2. Go to: **http://localhost:3000**
3. You should see the **Bus Ticket Booking** login/register page.

---

## Step 6: Create an account and use the app

1. Click **Register**.
2. Enter:
   - Name  
   - Email  
   - Password (at least 6 characters)  
   - Role: **Customer**, **Operator**, or **Admin**
3. Click **Register** – you will be logged in automatically.
4. You can now:
   - **Dashboard** – view revenue and ticket statistics
   - **Tickets** – view, filter, sort, and cancel tickets
   - **Book Ticket** – create a new booking

---

## Summary checklist

| Step | What to do |
|------|------------|
| 1 | MongoDB installed and running (local or Atlas) |
| 2 | Copy `backend\.env.example` to `backend\.env`; set `MONGODB_URI` and `JWT_SECRET` |
| 3 | Terminal 1: `cd f:\zepto\backend` → `npm run dev` (keep running) |
| 4 | Terminal 2: `cd f:\zepto\frontend` → `npm run dev` (keep running) |
| 5 | Browser: open **http://localhost:3000** |
| 6 | Register and use Dashboard, Tickets, Book Ticket |

---

## If something goes wrong

- **"Cannot connect to MongoDB"**  
  Check that MongoDB is running and that `MONGODB_URI` in `backend\.env` is correct.

- **"Port 5000 already in use"**  
  Either stop the program using port 5000, or in `backend\.env` set `PORT=5001` (or another free port).

- **Frontend can’t reach backend**  
  Ensure the backend is running in the first terminal and that you open the app at **http://localhost:3000** (Vite will proxy API calls to the backend).
