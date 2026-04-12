# Backend Folder Structure Guide

```
backend/
│
├── server.js                    # 🚀 MAIN SERVER ENTRY POINT
│                                # Starts on port 5000
│
├── package.json                 # 📦 Dependencies & scripts
├── .env                         # 🔐 Configuration (your secrets)
├── .env.example                 # 📋 Configuration template
│
├── config/
│   └── db.js                   # 🗄️ MongoDB connection setup
│
├── middleware/
│   └── authMiddleware.js       # 🔒 JWT verification for protected routes
│
├── controllers/
│   ├── authController.js       # 👤 Register, Login, Get Profile
│   ├── vehicleController.js    # 🚗 Vehicle CRUD + Search
│   ├── bookingController.js    # 📅 Booking management
│   ├── contactController.js    # 📧 Contact forms
│   └── userController.js       # 👥 User profiles
│
├── routes/
│   ├── authRoutes.js           # /api/auth/* endpoints
│   ├── vehicleRoutes.js        # /api/vehicles/* endpoints
│   ├── bookingRoutes.js        # /api/bookings/* endpoints
│   ├── contactRoutes.js        # /api/contact/* endpoints
│   └── userRoutes.js           # /api/users/* endpoints
│
├── node_modules/               # 📚 All npm packages (auto-installed)
│
├── 📚 DOCUMENTATION FILES:
├── README.md                   # Complete API reference & examples
├── SETUP.md                    # Quick start guide
├── COMPLETE.md                 # Installation summary
├── DEPENDENCIES.md             # Package information
│
└── 🧪 TESTING FILES:
    ├── test-api.html           # Interactive API tester (browser)
    ├── test-api.sh             # Curl commands for testing
    └── seedData.js             # Sample vehicle data
```

---

## 📂 What Each Folder Does

### `config/`
**Purpose:** Configuration and external service connections

- `db.js` - Connects to MongoDB and ensures collections exist
- Called once when server starts

### `middleware/`
**Purpose:** Functions that process requests before they reach routes

- `authMiddleware.js` - Checks if JWT token is valid
- Applied to protected endpoints (require login)

### `controllers/`
**Purpose:** Contains business logic for each feature

| File | Handles |
|------|---------|
| `authController.js` | User registration, login, profile |
| `vehicleController.js` | List vehicles, search, CRUD operations |
| `bookingController.js` | Create bookings, view, cancel, update status |
| `contactController.js` | Receive and manage contact form submissions |
| `userController.js` | Get and update user profile |

Each controller has functions like:
- `function_name()` - async function that handles one endpoint
- Receives `(req, res)` - request and response objects
- Queries database using MongoDB
- Sends back JSON response

### `routes/`
**Purpose:** Maps HTTP requests to controller functions

**Pattern:** 
```
GET /api/vehicles → getallVehicles()
POST /api/vehicles → createVehicle() [Protected]
```

Each route file:
- Imports controller functions
- Creates Express router
- Defines endpoints
- Applies middleware (auth, validation)
- Exports router to `server.js`

---

## 🔄 How a Request Flows Through the Code

### Example: User Login

```
1. Browser sends:
   POST http://localhost:5000/api/auth/login
   { email: "john@example.com", password: "123456" }

2. Server receives in authRoutes.js:
   router.post('/login', login)
   → Calls: controllers/authController.js → login()

3. login() function:
   - Validates input
   - Queries MongoDB for user
   - Compares passwords with bcrypt
   - Creates JWT token
   - Sends back: { success: true, token: "...", user: {...} }

4. Browser receives token and saves it

5. Browser uses token in next request:
   GET /api/auth/profile
   Header: Authorization: Bearer <token>

6. authMiddleware.js verifies token
   - If valid: Continues to controller
   - If invalid: Returns 401 Unauthorized

7. Controller returns user profile
```

---

## 📊 Database Collections Created Automatically

- **users** - Stores registered users with hashed passwords
- **vehicles** - Stores available vehicles for rent
- **bookings** - Stores rental bookings with dates and status
- **contacts** - Stores contact form submissions

---

## 🛠️ How to Add a New Feature

### Example: Add "Wishlist" functionality

1. **Create Controller** (`controllers/wishlistController.js`)
   ```javascript
   const addToWishlist = async (req, res) => {
     // Business logic here
   };
   module.exports = { addToWishlist };
   ```

2. **Create Routes** (`routes/wishlistRoutes.js`)
   ```javascript
   const { addToWishlist } = require('../controllers/wishlistController');
   router.post('/', authMiddleware, addToWishlist);
   ```

3. **Register in server.js**
   ```javascript
   app.use('/api/wishlist', require('./routes/wishlistRoutes'));
   ```

4. **Test the new endpoint**
   ```bash
   curl -X POST http://localhost:5000/api/wishlist \
     -H "Authorization: Bearer TOKEN"
   ```

---

## 📝 Code Organization Principles

### Separation of Concerns
- `routes/` - Only route definitions
- `controllers/` - Only business logic
- `middleware/` - Only request processing
- `config/` - Only external connections

### File Naming
- Controllers: `featureController.js`
- Routes: `featureRoutes.js`
- Middleware: `featureMiddleware.js`
- Collections: `featureCollection.js`

### Function Structure
```javascript
const functionName = async (req, res) => {
  try {
    // 1. Extract data from request
    const { email, name } = req.body;
    
    // 2. Validate
    if (!email) return res.status(400).json({ message: 'Email required' });
    
    // 3. Query database
    const db = getDB();
    const result = await db.collection('users').findOne({ email });
    
    // 4. Process
    if (!result) return res.status(404).json({ message: 'User not found' });
    
    // 5. Return response
    res.json({ success: true, user: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## 🔍 Understanding the Environment File

### `.env` File (SECRET - Never commit to Git)
```
MONGODB_URI=mongodb://localhost:27017/vehicle_rental
  ↓ MongoDB connection string (where your data lives)

JWT_SECRET=vehicle_rental_secret_key_2024
  ↓ Private key to sign JWT tokens

PORT=5000
  ↓ Which port server listens on

NODE_ENV=development
  ↓ Environment mode (development/production)
```

### Why `.env` is Important
- Keeps secrets out of source code
- Different values for dev/production
- Security - never commit to Git
- Example: Use local DB in dev, cloud DB in production

---

## 🚨 Common Code Patterns

### Protected Route (Requires Login)
```javascript
// In routes file
router.get('/profile', authMiddleware, getProfile);
           ↑                ↑
        Route name    Requires token
```

### Database Query
```javascript
const db = getDB();
const user = await db.collection('users').findOne({ email });
```

### Error Handling
```javascript
try {
  // Do something
  res.json({ success: true, data });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
```

### Validation
```javascript
if (!email || !password) {
  return res.status(400).json({ message: 'Missing fields' });
}
if (!validator.isEmail(email)) {
  return res.status(400).json({ message: 'Invalid email' });
}
```

---

## 📞 File Interactions Map

```
server.js (Main)
    ↓
    ├─→ config/db.js (Connect to MongoDB)
    ├─→ middleware/authMiddleware.js (Protect routes)
    │
    ├─→ routes/authRoutes.js
    │       ↓
    │       └─→ controllers/authController.js
    │               ↓
    │               └─→ config/db.js (MongoDB query)
    │
    ├─→ routes/vehicleRoutes.js
    │       ↓
    │       └─→ controllers/vehicleController.js
    │               ↓
    │               └─→ config/db.js
    │
    └─→ (Similar pattern for all other routes)
```

---

## ✨ Key Takeaways

1. **server.js** is the entry point - all routes go here
2. **routes/** receives requests and calls controllers
3. **controllers/** do the work (validate, query DB, respond)
4. **middleware/** checks authorization before controller
5. **config/db.js** handles database connection
6. **.env** stores secrets (never commit!)

---

## 🎓 Learning Path

1. Read `README.md` to understand all endpoints
2. Read `server.js` to see route registration
3. Pick a simple endpoint (like GET /vehicles)
4. Follow the code: route → controller → database
5. Try adding a simple new field to vehicles
6. Build from there!

---

Happy coding! 🚀
