# Backend Dependencies & Package Information

## 📦 Installed Packages (in package.json)

### Production Dependencies

#### `express` (v5.2.1)
- **Purpose:** Node.js web framework for building API
- **Used for:** Creating server, routing, middleware
- **Example:** `const app = express()`

#### `mongodb` (v7.1.1)
- **Purpose:** Official MongoDB Node.js driver
- **Used for:** Database connection and operations
- **Example:** `const collection = db.collection('users')`

#### `jsonwebtoken` (v9.0.3)
- **Purpose:** Create and verify JWT tokens
- **Used for:** User authentication and authorization
- **Example:** `jwt.sign({ userId }, secret, { expiresIn: '7d' })`

#### `bcrypt` (v6.0.0)
- **Purpose:** Password hashing and verification
- **Used for:** Secure password storage
- **Example:** `await bcrypt.hash(password, 10)`

#### `cors` (v2.8.6)
- **Purpose:** Enable Cross-Origin Resource Sharing
- **Used for:** Allow frontend (different port) to access backend
- **Example:** `app.use(cors())`

#### `validator` (v13.15.35)
- **Purpose:** String validation and sanitization
- **Used for:** Validate emails, inputs
- **Example:** `validator.isEmail(email)`

#### `dotenv` (v16.3.1)
- **Purpose:** Load environment variables from .env file
- **Used for:** Secure configuration management
- **Example:** `require('dotenv').config()`

#### `nodemon` (v3.1.14)
- **Purpose:** Auto-restart server on file changes (Development)
- **Used for:** Development convenience
- **Example:** `npm run dev`

---

## 🔍 Detailed Package Usage in the Code

### Authentication System (Uses: jsonwebtoken, bcrypt)
```javascript
// Hashing password on registration
const hashedPassword = await bcrypt.hash(password, 10);

// Verifying password on login
const isValid = await bcrypt.compare(password, user.password);

// Creating JWT token
const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

// Verifying token in middleware
const decoded = jwt.verify(token, JWT_SECRET);
```

### Database Connection (Uses: mongodb)
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(mongoURI);
const db = client.db('vehicle_rental');
const collection = db.collection('vehicles');
```

### Express Server (Uses: express, cors)
```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies
```

### Input Validation (Uses: validator)
```javascript
if (!validator.isEmail(email)) {
  return res.status(400).json({ message: 'Invalid email' });
}
```

### Environment Variables (Uses: dotenv)
```javascript
require('dotenv').config();
const mongoURI = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;
```

---

## 🚀 Installation & Version Management

### Check Node.js Version
```bash
node --version  # Should be v14 or higher
npm --version   # Should be v6 or higher
```

### Install All Dependencies
```bash
npm install
# This reads package.json and installs all packages with exact versions
```

### Add New Package (if needed)
```bash
npm install package-name         # Adds to dependencies
npm install --save-dev package-name  # Adds to devDependencies
```

### Update Packages (carefully!)
```bash
npm update                # Updates all packages
npm outdated             # Shows outdated packages
npm audit                # Shows security vulnerabilities
```

---

## 📋 Package Purpose Summary

| Package | Purpose | Critical? |
|---------|---------|-----------|
| express | Web framework | ✅ YES |
| mongodb | Database driver | ✅ YES |
| jsonwebtoken | JWT auth | ✅ YES |
| bcrypt | Password hashing | ✅ YES |
| cors | Cross-origin support | ✅ YES |
| validator | Input validation | ⭐ IMPORTANT |
| dotenv | Config management | ⭐ IMPORTANT |
| nodemon | Dev convenience | ❌ NO (dev only) |

---

## 🔒 Security Implications

### Password Security (bcrypt)
- Never store plain passwords in database
- Always hash passwords with salt rounds (10)
- Use `bcrypt.compare()` to verify passwords

### Token Security (jsonwebtoken)
- JWT_SECRET should be strong and unique
- Keep JWT_SECRET in `.env`, never in code
- Set reasonable expiration times (7 days)
- Always send tokens over HTTPS in production

### Input Validation (validator)
- Always validate email format before storing
- Sanitize all user inputs
- Check field presence before processing

### CORS Security
- In production, specify allowed origins
- Don't use `origins: '*'` on sensitive APIs
- Include credentials settings if needed

---

## 🧪 Testing Packages (Optional)

If you want to add unit tests later:

```bash
npm install --save-dev jest     # Testing framework
npm install --save-dev supertest # HTTP assertion library
```

Example test:
```javascript
const request = require('supertest');
const app = require('../server');

describe('GET /api/vehicles', () => {
  it('should return array of vehicles', async () => {
    const res = await request(app).get('/api/vehicles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.vehicles)).toBe(true);
  });
});
```

---

## 📦 Package.json Structure

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "commonjs",           // Uses require(), not ES6 import
  "main": "server.js",
  "scripts": {
    "start": "node server.js",  // Production
    "dev": "nodemon server.js"  // Development
  },
  "dependencies": {
    // Packages needed for production
  },
  "devDependencies": {
    // Packages only needed during development
  }
}
```

---

## 🔄 Dependency Update Checklist

Before updating packages in production:

- [ ] Check changelog for breaking changes
- [ ] Test locally with new version
- [ ] Run `npm audit` to check security
- [ ] Test all critical features
- [ ] Update `.env` if needed
- [ ] Restart server and verify

---

## 💡 Best Practices

1. **Lock Versions:** Use `package-lock.json` (auto-generated)
2. **Security:** Run `npm audit` regularly
3. **Updates:** Update monthly, not immediately
4. **Testing:** Test package updates locally first
5. **Dependencies:** Minimize external dependencies
6. **Documentation:** Each package serves a clear purpose

---

## 🚀 Ready to Go!

All dependencies are correctly configured.

**Start using the backend:**
```bash
npm install  # Install all packages
npm run dev  # Start development server
```

The server will use all these packages automatically! 🎉
