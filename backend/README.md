# Vehicle Rental Platform - Backend API

A complete Node.js/Express backend server for the vehicle rental platform with MongoDB database integration.

## Features

- ✅ User Authentication (Register, Login with JWT)
- ✅ Vehicle Management (CRUD operations)
- ✅ Booking System (Create, view, cancel bookings)
- ✅ Contact Form Management
- ✅ User Profile Management
- ✅ Vehicle Search & Filtering
- ✅ MongoDB Database
- ✅ Role-based Access Control

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env**
   ```
   MONGODB_URI=mongodb://localhost:27017/vehicle_rental
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `GET /api/vehicles/search?category=sedan&minPrice=100&maxPrice=500` - Search vehicles
- `POST /api/vehicles` - Create vehicle (Protected)
- `PUT /api/vehicles/:id` - Update vehicle (Protected)
- `DELETE /api/vehicles/:id` - Delete vehicle (Protected)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get booking details (Protected)
- `PUT /api/bookings/:id/status` - Update booking status (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Protected)
- `PUT /api/contact/:id/status` - Update contact status (Protected)

### Health Check
- `GET /api/health` - Server health check

## Request/Response Examples

### Register User
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

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get All Vehicles
```bash
curl http://localhost:5000/api/vehicles
```

**Response:**
```json
{
  "success": true,
  "vehicles": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Toyota Camry",
      "category": "Sedan",
      "price": "$50/day",
      "seats": 5,
      "transmission": "Automatic",
      "fuel": "Petrol",
      "rating": 4.5,
      "image": "url_to_image",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Create Booking (Protected)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "vehicleId": "507f1f77bcf86cd799439011",
    "startDate": "2024-02-01",
    "endDate": "2024-02-05",
    "totalCost": 250,
    "pickupLocation": "Downtown",
    "dropoffLocation": "Airport"
  }'
```

### Search Vehicles
```bash
curl "http://localhost:5000/api/vehicles/search?category=SUV&minPrice=100&maxPrice=200"
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "subject": "Inquiry",
    "message": "I would like to know more about your services"
  }'
```

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token is received after successful login or registration.

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicles Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  image: String,
  seats: Number,
  transmission: String,
  fuel: String,
  price: String,
  rating: Number,
  createdAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  vehicleId: ObjectId,
  vehicleName: String,
  startDate: Date,
  endDate: Date,
  totalCost: Number,
  pickupLocation: String,
  dropoffLocation: String,
  status: String (pending, confirmed, completed, cancelled),
  createdAt: Date,
  cancelledAt: Date
}
```

### Contacts Collection
```javascript
{
  _id: ObjectId,
  fullName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String (new, in-progress, resolved),
  createdAt: Date
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS enabled for frontend integration
- Input validation with validator library
- Protected routes with middleware

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/vehicle_rental |
| JWT_SECRET | JWT signing secret | your_jwt_secret_key |
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |

## CORS Configuration

The server allows requests from the frontend:
- Update CORS origin in `server.js` if frontend runs on different port

## Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Vehicle reviews and ratings
- [ ] Insurance add-ons
- [ ] Advanced search filters

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify connection string format

**Port Already in Use**
- Change PORT in .env file
- Or kill process on port 5000

**JWT Token Invalid**
- Ensure JWT_SECRET matches between requests
- Token may have expired (7 days validity)
- Include "Bearer" prefix in Authorization header

## Support

For issues and questions, please contact the development team.
