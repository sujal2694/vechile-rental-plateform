# Backend Setup & Quick Start Guide

## ✅ What's Been Created

A complete production-ready Node.js/Express backend server with the following structure:

```
backend/
├── server.js                 # Main server entry point
├── package.json             # Dependencies configuration
├── .env                     # Environment variables
├── .env.example            # Example env file
├── README.md               # Full API documentation
├── config/
│   └── db.js              # MongoDB connection & setup
├── middleware/
│   └── authMiddleware.js  # JWT authentication
├── controllers/
│   ├── authController.js      # Register, Login, Profile
│   ├── vehicleController.js   # Vehicle CRUD & Search
│   ├── bookingController.js   # Booking management
│   ├── contactController.js   # Contact form handling
│   └── userController.js      # User profile management
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── vehicleRoutes.js   # Vehicle endpoints
│   ├── bookingRoutes.js   # Booking endpoints
│   ├── contactRoutes.js   # Contact endpoints
│   └── userRoutes.js      # User endpoints
└── node_modules/          # Dependencies
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
```
Already configured in .env:
MONGODB_URI=mongodb://localhost:27017/vehicle_rental
```
Make sure MongoDB is running on your system.

**Option B: MongoDB Atlas (Cloud)**
Replace in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vehicle_rental
```

### 3. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see: `Server running on port 5000`

### 4. Test the Server
Open your browser and visit: `http://localhost:5000/api/health`

You should see:
```json
{ "message": "Server is running" }
```

## 📋 API Endpoints Summary

### Public Endpoints (No Authentication Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `GET /api/vehicles/search` - Search vehicles
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Require JWT Token)
- `GET /api/auth/profile` - Get your profile
- `POST /api/vehicles` - Add vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get your bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/contact` - Get all contacts (admin)
- `PUT /api/contact/:id/status` - Update contact status (admin)

## 🔐 Authentication Flow

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 2. You'll Get Back a Token
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "email": "john@example.com" }
}
```

### 3. Use Token for Protected Routes
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📦 Import Sample Data (Optional)

Create vehicles manually or use MongoDB Compass to insert sample data:

```javascript
// Sample vehicle
{
  "name": "Toyota Camry",
  "category": "Sedan",
  "image": "url_to_image",
  "seats": 5,
  "transmission": "Automatic",
  "fuel": "Petrol",
  "price": "$50/day",
  "rating": 4.5
}
```

## 🛠️ Available npm Scripts

```bash
npm run dev    # Start with nodemon (auto-reload on file changes)
npm start      # Start in production mode
npm test       # Run tests (currently not configured)
```

## ⚙️ Environment Variables Explained

| Variable | Value | Description |
|----------|-------|-------------|
| MONGODB_URI | mongodb://localhost:27017/vehicle_rental | Database connection string |
| JWT_SECRET | vehicle_rental_secret_key_2024 | JWT signing secret (change in production!) |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment mode |

## 🔗 Connecting Frontend to Backend

Update your frontend API calls to use:

**Base URL:** `http://localhost:5000/api`

Example in frontend (Next.js):
```javascript
const response = await fetch('http://localhost:5000/api/vehicles');
const vehicles = await response.json();
```

Or with environment variable:
```javascript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const response = await fetch(`${BASE_URL}/vehicles`);
```

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "MongoDB connection refused"
- Make sure MongoDB is running:
  - Windows: Use MongoDB Compass or `mongod` command
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

### "Port 5000 is in use"
Change in `.env`:
```
PORT=5001
```

### "JWT token is invalid"
- Make sure token is sent with "Bearer " prefix
- Token expires after 7 days, need to login again
- Ensure JWT_SECRET matches

### CORS errors from frontend
The backend allows all origins by default. If you need to restrict:
In `server.js`, modify:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## 📚 Full API Documentation

See `README.md` in the backend folder for complete API documentation with examples.

## 🚀 Next Steps

1. ✅ Start the backend server
2. ✅ Test endpoints using Postman or curl
3. ✅ Connect frontend to backend
4. ✅ Test user registration & login flow
5. ✅ Test vehicle listing
6. ✅ Test booking creation
7. ✅ Deploy to production (Heroku, Railway, etc.)

## 📞 Support

For issues:
1. Check console logs for error messages
2. Verify MongoDB is connected
3. Check .env file configuration
4. Review API documentation in README.md

---

**Backend is now ready to power your vehicle rental platform!** 🎉
