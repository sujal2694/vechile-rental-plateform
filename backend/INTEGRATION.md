# Backend + Frontend Integration Guide

## 🔄 Connecting Everything Together

You now have:
- ✅ **Frontend:** Next.js vehicle rental website (client folder)
- ✅ **Backend:** Express.js API server (backend folder)
- ✅ **Database:** MongoDB (ready to connect)

This guide shows how to make them work together.

---

## 🎯 Final Setup (5 Minutes)

### Terminal 1: Start the Backend Server

```bash
cd backend
npm install      # First time only
npm run dev      # Starts on http://localhost:5000
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

### Terminal 2: Start the Frontend Server

```bash
cd client
npm run dev      # Starts on http://localhost:3000  
```

You should see:
```
> ready - started server on 0.0.0.0:3000
```

### Open in Browser

Visit: `http://localhost:3000`

Your website should load! 🎉

---

## 🔗 Testing User Journey

### 1. Register a New Account

1. Go to http://localhost:3000/login
2. Click "Sign Up"
3. Fill in details:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
4. Click "Sign Up" button

**Behind the scenes:**
- Frontend sends → Backend receives
- Backend hashes password  
- Backend saves to MongoDB
- Backend returns JWT token
- Frontend saves token in localStorage

### 2. View Vehicles

1. After login, go home or /vehicles
2. See list of vehicles
3. Click "Add to Cart" on any vehicle
4. Select dates for rental
5. Click "Add to Cart"

**Behind the scenes:**
- Frontend fetches from `/api/vehicles`
- Backend queries MongoDB vehicles collection
- Frontend displays in grid

### 3. View Shopping Cart

1. Click cart icon in navbar
2. See items you added
3. Can change quantities
4. See total price

### 4. Create Booking

1. From cart, click "Proceed to Checkout"
2. System creates booking in database
3. Gets confirmation

**Database operations:**
- ✅ User saved in `users` collection
- ✅ Booking saved in `bookings` collection
- ✅ Vehicle referenced from `vehicles` collection

---

## 📊 Data Flow Diagram

```
Browser (Frontend - http://localhost:3000)
    ↓
Next.js Application (client folder)
    ↓
API Requests to Backend
    ↓
Express.js Server (http://localhost:5000)
    ↓
Controllers (Process requests, validate)
    ↓
Middleware (Check JWT, log requests)
    ↓
MongoDB Database
    ↓
Data returned back through the chain
```

---

## 🌐 API Endpoints Your Frontend Uses

These are called automatically by Next.js components:

### Public Endpoints (No Login Required)
```
GET http://localhost:5000/api/vehicles
  ↓ Fetches all vehicles for display

GET http://localhost:5000/api/vehicles/search?category=SUV
  ↓ Search and filter vehicles

POST http://localhost:5000/api/contact
  ↓ Submit contact form
```

### Auth Endpoints
```
POST http://localhost:5000/api/auth/register
  ↓ Register new user

POST http://localhost:5000/api/auth/login
  ↓ Login with email/password

GET http://localhost:5000/api/auth/profile
  ↓ Get logged-in user's profile (requires token)
```

### Protected Endpoints (Require Login Token)
```
POST http://localhost:5000/api/bookings
  ↓ Create booking

GET http://localhost:5000/api/bookings
  ↓ Get user's bookings

PUT http://localhost:5000/api/bookings/:id/cancel
  ↓ Cancel specific booking
```

---

## 🔐 Token Flow Explained

### 1. User Registers

```
Frontend → Backend (POST /auth/register)
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Backend → Frontend (Response)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "email": "john@example.com" }
}

Frontend saves token in browser localStorage
```

### 2. User Makes Protected Request

```
Frontend reads token from localStorage
Frontend → Backend (GET /api/bookings)
  Header: Authorization: Bearer {token}

Backend receives request
middleware/authMiddleware.js verifies token
  ✓ Token is valid → Continue to controller
  ✗ Token is invalid → Return 401 Unauthorized

Controller processes request
Backend → Frontend (Response with user's bookings)
```

---

## 🛠️ Frontend Updates Needed (Optional)

Your frontend might need small updates to connect properly:

### 1. Set API URL

**In client/.env.local** (create if doesn't exist):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Update API Calls in Components

**Before:**
```javascript
const response = await fetch('/api/vehicles');
```

**After:**
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${API_URL}/vehicles`);
```

### 3. Add Token to Protected Requests

```javascript
// Get token from localStorage
const token = localStorage.getItem('token');

// Use in API call
const response = await fetch(`${API_URL}/bookings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← Add this
  },
  body: JSON.stringify(bookingData)
});
```

---

## 🧪 Test Everything Works

### Method 1: Use Browser

1. Open http://localhost:3000
2. Register new account
3. Browse vehicles
4. Add to cart
5. Check console (F12) for any errors

### Method 2: Test API Directly

1. Open http://localhost:5000/api/health
   - Should show: "Server is running"

2. Open http://localhost:5000/api/vehicles
   - Should show: Array of vehicles (if added)

3. Test in browser console:
   ```javascript
   const response = await fetch('http://localhost:5000/api/vehicles');
   const vehicles = await response.json();
   console.log(vehicles);
   ```

### Method 3: Use test-api.html

1. Open `backend/test-api.html` in browser
2. Register user
3. Test endpoints
4. See responses

---

## 📱 Data Persistence

### Frontend (Browser)
- Cart items stored in React Context
- Auth token stored in localStorage
- Data persists across page refreshes

### Backend (Server Memory)
- Running server keeps MongoDB connection
- If server restarts, data still in MongoDB

### Database (MongoDB)
- All user, vehicle, booking data permanently saved
- Survives server restarts
- Same data available to all users

---

## 🚨 If Something Goes Wrong

### "Can't connect to backend from frontend"

**Problem:** Frontend shows network error

**Check:**
1. Is backend running? (see in terminal)
2. Is frontend trying right URL?
3. CORS enabled in backend? (should be auto)

**Fix:**
```bash
# Terminal 1: Restart backend
cd backend
npm run dev

# Terminal 2: Restart frontend
cd client
npm run dev
```

### "Login not working"

**Problem:** Register works but login fails

**Check:**
1. Is email correct?
2. Is password correct?
3. Is MongoDB running?

**Fix:**
```bash
# Check if MongoDB is running
# Windows: Open MongoDB Compass
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### "Bookings not saving"

**Problem:** Can create booking but doesn't appear in cart

**Check:**
1. Are you logged in?
2. Is cart context connected?
3. Are there frontend errors? (Check F12)

**Fix:**
```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// Check API response
const res = await fetch('http://localhost:5000/api/bookings', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
});
console.log(await res.json());
```

---

## 📊 Testing Checklist

Go through each step to ensure everything works:

- [ ] Backend started with `npm run dev`
- [ ] Frontend started with `npm run dev`
- [ ] Can visit http://localhost:3000
- [ ] Can register new account
- [ ] Can login with account
- [ ] Can see vehicle list
- [ ] Can click "Add to Cart"
- [ ] Can select rental dates
- [ ] Can add vehicle to cart
- [ ] Can view cart items
- [ ] Cart icon shows item count
- [ ] API requests don't error (check F12)

---

## 🔍 Monitoring Requests

### Check Frontend Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Perform actions (register, login, add to cart)
4. See all API requests and responses

```
POST http://localhost:5000/api/auth/register
  Status: 201 Created
  Response: { token, user }

GET http://localhost:5000/api/vehicles
  Status: 200 OK
  Response: { vehicles: [...] }
```

### Check Backend Logs

Look at Terminal 1 where backend is running:

```
POST /api/auth/register - 201
GET /api/vehicles - 200
POST /api/bookings - 201
```

Each request shows status code and path.

---

## 🚀 What's Next?

1. ✅ Both frontend and backend running
2. ✅ Users can register and login
3. ✅ Users can browse vehicles
4. ✅ Users can make bookings
5. → Add payment gateway (Stripe)
6. → Add email confirmations
7. → Add admin dashboard
8. → Deploy to production

---

## 📦 Production Deployment

When ready to deploy (not now):

### Backend Hosting Options:
- Heroku (easy, free tier)
- Railway (modern, free tier)
- AWS EC2 (scalable, paid)
- DigitalOcean (simple, cheap)

### Frontend Hosting Options:
- Vercel (official Next.js host, free)
- Netlify (if exported as static)
- AWS S3 + CloudFront

---

## ✨ Summary

You now have a **complete, working vehicle rental platform**:

- ✅ Modern Next.js frontend
- ✅ Full Express.js backend
- ✅ MongoDB database
- ✅ User authentication
- ✅ Vehicle management
- ✅ Booking system
- ✅ Contact forms

### Run Commands:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd client && npm run dev
```

Then visit: **http://localhost:3000**

Happy building! 🚗✨

---

## 📞 Need Help?

1. Check console errors (F12 in browser)
2. Check terminal logs (where servers are running)
3. Check API response in Network tab
4. Read documentation files in `backend/` folder
5. Verify database connection in `.env`

You've got this! 🎉
