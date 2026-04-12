# Frontend & Backend Integration Guide

## ✅ Connection Complete!

Your Next.js frontend is now fully integrated with the Express.js backend API.

---

## 🚀 Getting Started

### Terminal 1: Start Backend Server

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

### Terminal 2: Start Frontend Server

```bash
cd client
npm run dev      # Starts on http://localhost:3000
```

You should see:
```
> ready - started server on 0.0.0.0:3000
```

### Open in Browser

Visit: **http://localhost:3000**

---

## 🔗 What's Connected

### ✅ Authentication System
- **Register** at `/login` → Saves user to MongoDB & returns JWT token
- **Login** at `/login` → Authenticates user & stores token in localStorage
- **Logout** → Clears token from localStorage
- **Auto-check** → Navbar shows user name when logged in

### ✅ Vehicle Management
- **Home Page** → Fetches featured vehicles from `/api/vehicles`
- **Vehicles Page** → Lists all vehicles with category filtering
- **Search** → Can filter by category and price range
- **Add to Cart** → Opens modal with date selection for rental

### ✅ Booking System
- **Create Booking** → Saves to database when adding vehicle to cart
- **View Bookings** → Shows user's rental history (protected route)
- **Cancel Booking** → Can cancel bookings from cart page

### ✅ Contact Form
- **Submit Message** → Saves to database with all required fields
- **Admin Panel** → Backend can view all submissions

---

## 📂 New Files Created

### Frontend API Service (`app/lib/apiService.js`)
Central file for all API calls. Handles:
- User authentication (register, login, logout)
- Vehicle operations (get all, search, filter)
- Booking management (create, view, cancel)
- Contact form submission
- User profile management

All API calls automatically include JWT token when needed.

---

## 📋 Updated Components

### Login Page (`app/login/page.js`)
- ✅ Calls `/api/auth/register` for signup
- ✅ Calls `/api/auth/login` for signin
- ✅ Shows loading state while processing
- ✅ Displays error/success messages
- ✅ Redirects to home on successful login

### Vehicles Page (`app/vehicles/page.js`)
- ✅ Fetches from `/api/vehicles` on page load
- ✅ Shows loading spinner while fetching
- ✅ Displays error if fetch fails
- ✅ Supports category filtering
- ✅ Shows "no vehicles" message if empty

### Featured Vehicles (`app/components/FeaturedVehicles.jsx`)
- ✅ Fetches first 6 vehicles from API
- ✅ Shows loading spinner
- ✅ Updates in real-time from database

### Contact Page (`app/contact/page.js`)
- ✅ Submits form to `/api/contact`
- ✅ Shows success/error messages
- ✅ Resets form on successful submission
- ✅ Shows loading state while sending

### Navbar (`app/components/Navbar.jsx`)
- ✅ Checks authentication status on mount
- ✅ Shows user name when logged in
- ✅ Shows "Logout" button instead of "Login" when authenticated
- ✅ Updates cart count from context

---

## 🌐 Environment Configuration

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

This sets the base URL for all API calls. Change this when deploying!

### Backend `.env`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vehicle-rental-shop
JWT_SECRET=jwt#secret
PORT=5000
NODE_ENV=development
```

---

## 🧪 Test the Full Flow

### 1. Register New Account
1. Visit http://localhost:3000/login
2. Click "Sign Up" tab
3. Fill in:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: password123
4. Click "Create Account"
5. **Should redirect to home** & Navbar shows "Hi, John"

### 2. Browse Vehicles
1. Click "Vehicles" in navbar
2. See list of vehicles from database
3. Try filtering by category
4. Click "Add to Cart" on any vehicle

### 3. Select Rental Dates
1. Modal opens with date pickers
2. Select start and end dates
3. Click "Add to Cart"
4. **Modal closes** & vehicle added to cart

### 4. View Cart
1. Click cart icon in navbar
2. See vehicle details and rental info
3. Can change quantities
4. Shows total price

### 5. Submit Contact Form
1. Go to `/contact` page
2. Fill in form fields
3. Click "Send Message"
4. **Should show success message**

### 6. Logout
1. Click "Logout" button in navbar
2. **Redirects to home**
3. Navbar shows "Log In / Sign Up" again

---

## 🔐 Security Features

✅ **JWT Authentication**
- Tokens stored in localStorage
- Sent automatically with protected requests
- Tokens expire after 7 days

✅ **Password Security**
- Hashed with bcrypt on backend
- Never stored in plain text
- Never transmitted back to frontend

✅ **Input Validation**
- Email validation on frontend and backend
- Password strength checking
- Required field validation

✅ **Protected Routes**
- Bookings require authentication
- User profile requires token
- Backend verifies token on every request

---

## 📝 API Endpoints Reference

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/profile` | ✅ | Get user profile |
| GET | `/api/vehicles` | ❌ | Get all vehicles |
| GET | `/api/vehicles/search` | ❌ | Search vehicles |
| POST | `/api/bookings` | ✅ | Create booking |
| GET | `/api/bookings` | ✅ | Get user bookings |
| POST | `/api/contact` | ❌ | Send message |

---

## 🐛 Troubleshooting

### "Cannot connect to API"
**Problem:** API errors in browser console

**Check:**
1. Is backend running on port 5000?
2. Check terminal where backend is running for errors
3. Check network tab in DevTools (F12)

**Fix:**
```bash
# Restart backend
cd backend
npm run dev
```

### "Login fails with 'MongoDB Connection Error'"
**Problem:** Backend can't connect to MongoDB database

**Check:**
1. Is MongoDB running?
2. Is connection string in `.env` correct?

**Fix:**
```bash
# For local MongoDB, start MongoDB service
# Windows: Open MongoDB Compass
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Then restart backend
npm run dev
```

### "Token is invalid"
**Problem:** Bookings or profile not loading

**Check:**
1. Is user logged in? (Check localStorage in DevTools)
2. Has token expired? (7 days)

**Fix:**
- Login again to get fresh token
- Check backend logs for token error

### "Vehicles not showing"
**Problem:** Vehicles page is empty or loading forever

**Check:**
1. Check browser console (F12) for errors
2. Check network tab to see API response
3. Are there vehicles in the database?

**Fix:**
```bash
# Add sample vehicles via test-api.html
# Or use MongoDB Compass to insert manually
```

---

## 🚀 Production Deployment

### Before Deploying

1. **Update API URL**
   - Change `.env.local` to production backend URL
   - Example: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

2. **Secure Secrets**
   - Never commit `.env` files
   - Add to `.gitignore`
   - Use environment variable management on hosting

3. **Enable HTTPS**
   - Backend must use HTTPS in production
   - Frontend localStorage works only on HTTPS

4. **Update CORS**
   - Restrict CORS to only your domain
   - Change in `server.js`

### Deploy Backend
- Heroku, Railway, AWS, DigitalOcean
- Set environment variables on hosting platform
- Use production MongoDB URI (Atlas)

### Deploy Frontend
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

---

## 📞 Quick Reference

### Start Everything
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd client && npm run dev

# Visit http://localhost:3000
```

### View Database
- Download MongoDB Compass
- Connect to: `mongodb+srv://full_stack:full_stack_123@cluster0.nojqt8f.mongodb.net`
- Browse `vehicle-rental-shop` database

### Test API Endpoints
- Open `backend/test-api.html` in browser
- Or use Postman
- Or use curl commands (see `backend/test-api.sh`)

---

## ✨ Summary

Your vehicle rental platform is now fully integrated!

✅ Frontend calls backend APIs
✅ Authentication working with JWT tokens
✅ Vehicles loading from database
✅ Bookings saved to database
✅ Contact submissions working
✅ All data persists across sessions

**You're ready to use the platform!** 🎉

---

## 🎯 Next Steps

1. Add more sample vehicles (use test-api.html)
2. Test all features listed above
3. Add payment processing (Stripe/PayPal) - optional
4. Add email notifications - optional
5. Deploy to production when ready

Enjoy your vehicle rental platform! 🚗✨
