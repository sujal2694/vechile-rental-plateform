# Payment Error Troubleshooting Guide

## Error: "payment error, invalid payment session"

### Step 1: Check Server Logs
When you click "Pay with Stripe" and see the error, check your **backend terminal** for these logs:

**Expected logs (working):**
```
Creating Stripe session with line items: 1
Metadata: { cartItems: '1 items', userId: '...' }
✅ Session created: cs_test_...
```

**Error logs (not working):**
```
❌ Checkout session error:
  Type: StripeInvalidRequestError
  Message: ...
```

### Step 2: Verify Configuration

Run this diagnostic:
```bash
cd backend
node diagnosticPayment.js
```

Should show all ✅ checks passing.

### Step 3: Check Frontend Environment Variables

In `client/`, create or verify `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Test Payment Manually

1. Open browser console (F12)
2. Go to checkout page
3. Open browser console and paste:

```javascript
// Check if backend is reachable
fetch('http://localhost:5000/api/vehicles')
  .then(r => r.status === 200 ? console.log('✅ Backend reachable') : console.log('❌ Error:', r.status))
  .catch(e => console.log('❌ Cannot reach backend:', e.message))

// Check auth token
const token = localStorage.getItem('authToken')
console.log('Token:', token ? '✅ Present' : '❌ Missing')
```

### Step 5: Common Issues & Fixes

#### Issue: "Invalid Stripe Key"
**Solution:**
```bash
# Check .env file
cat backend/.env | grep STRIPE_SECRET_KEY

# Should show: sk_test_... (not empty or placeholder)
```

#### Issue: "Payment system not configured"
**Solution:** Backend is not recognizing Stripe key. Check:
1. `.env` file exists in backend directory
2. `STRIPE_SECRET_KEY` is set correctly
3. Restart backend server: `npm start`

#### Issue: "Invalid request" from Stripe
**Solution:** Check line items being sent. The problem might be:
1. Invalid `unit_amount` (must be positive integer in cents)
2. Empty product description
3. Invalid currency code

#### Issue: "Missing metadata in session"
**Solution:** Cart items not being passed to Stripe. Check:
1. Cart has items before checkout
2. All cart items have `vehicleId` field
3. Network request is sending proper body

### Step 6: Full Debugging Flow

```bash
# 1. Check MongoDB
cd backend
node verifyVehiclePrices.js
# Should show: ✅ ALL VEHICLES READY FOR CHECKOUT!

# 2. Restart backend with logging
npm start
# Look for "Creating Stripe session" when you click Pay

# 3. Check browser console (F12)
# Should see successful fetch to /api/bookings/create-checkout-session
```

### Step 7: Enable Detailed Logging

Update `backend/controllers/bookingController.js` line 499 to trace the exact issue:

```javascript
console.log('Cart items received:', cartItems);
console.log('Line items for Stripe:', lineItems);
```

### Step 8: Test with Stripe Test Card

Payment form should show when you click "Pay with Stripe". Test card:
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/26`)
- **CVC:** Any 3 digits (e.g., `123`)

If Stripe form doesn't appear = session creation failed (check backend logs)
If payment fails = Stripe validation error (check Stripe dashboard)

---

## Quick Restart Checklist

1. ✅ Both backend and frontend running
2. ✅ `.env` file in backend with valid `STRIPE_SECRET_KEY`
3. ✅ MongoDB connection working (7 vehicles loaded)
4. ✅ Cart has items with valid dates
5. ✅ User is logged in
6. ✅ Browser console shows no CORS errors

---

## Check Backend Status

Run this to see current setup:
```bash
cd backend

# Check all services
node diagnosticPayment.js

# Check database
node verifyVehiclePrices.js

# Start backend (with logs)
npm start
```

