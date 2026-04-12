const express = require('express');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  createCheckoutSession,
  verifyCheckout,
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Payment routes (public)
router.post('/checkout/create-session', createCheckoutSession);
router.get('/checkout/verify/:sessionId', verifyCheckout);

// Protected booking routes (require auth)
router.post('/', authMiddleware, createBooking); // Create booking
router.get('/', authMiddleware, getUserBookings); // Get user's bookings
router.get('/:id', authMiddleware, getBookingById); // Get booking details
router.put('/:id/status', adminMiddleware, updateBookingStatus); // Update status (admin)
router.put('/:id/cancel', authMiddleware, cancelBooking); // Cancel booking (user)

module.exports = router;