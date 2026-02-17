# MongoDB Setup for Bus Ticket Booking

---

## Option A: Install MongoDB on Windows (Local)

### Step 1: Download

1. Go to: **https://www.mongodb.com/try/download/community**
2. Select **Version:** 7.0 or latest, **Platform:** Windows, **Package:** msi.
3. Click **Download**.

### Step 2: Install

1. Run the downloaded `.msi`.
2. Choose **Complete** installation.
3. Optionally install **MongoDB Compass** (GUI).
4. Click **Install** and finish the wizard.

### Step 3: Start MongoDB

1. Press **Win + R**, type `services.msc`, press Enter.
2. Find **MongoDB Server** → Right-click → **Start** (or set Startup type to **Automatic**).

Or from **Administrator** PowerShell:

```powershell
Start-Service MongoDB
```

### Step 4: Use in the project

In `f:\zepto\backend\.env` set:

```
MONGODB_URI=mongodb://localhost:27017/bus-ticket-booking
```

---

## Option B: MongoDB Atlas (Free Cloud – No Local Install)

### Step 1: Create account

1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Click **Try Free** and sign up (Google or email).

### Step 2: Create a free cluster

1. Click **Build a Database** → choose **M0 FREE**.
2. Pick a **cloud provider and region**.
3. Click **Create**.

### Step 3: Create database user

1. **Username and Password** – enter a username (e.g. `busappuser`).
2. Click **Autogenerate Secure Password** and **copy** the password.
3. Click **Create User**.

### Step 4: Allow access

1. **Add My Current IP Address** (or **Allow Access from Anywhere** `0.0.0.0/0` for testing).
2. Click **Finish**.

### Step 5: Get connection string

1. On the cluster, click **Connect** → **Drivers**.
2. Copy the connection string. It looks like:
   ```
   mongodb+srv://busappuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. **Replace `<password>`** with the password you copied (URL-encode special characters if needed).
4. **Add database name** before `?`: change `...mongodb.net/` to `...mongodb.net/bus-ticket-booking?`
   ```
   mongodb+srv://busappuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bus-ticket-booking?retryWrites=true&w=majority
   ```

### Step 6: Use in the project

In `f:\zepto\backend\.env` set:

```
MONGODB_URI=mongodb+srv://busappuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bus-ticket-booking?retryWrites=true&w=majority
```

Replace with your actual username, password, and cluster host.
