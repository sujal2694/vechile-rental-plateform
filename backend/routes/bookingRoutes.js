const express = require('express');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  createCheckoutSession,
  verifyCheckout,
} = require('../controllers/bookingController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Payment routes (require authentication)
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.get('/verify-checkout/:sessionId', authMiddleware, verifyCheckout);

// Protected booking routes (require auth)
router.post('/', authMiddleware, createBooking); // Create booking
router.get('/', authMiddleware, getUserBookings); // Get user's bookings
router.get('/all', adminMiddleware, getAllBookings); // Get all bookings for admin
router.get('/:id', authMiddleware, getBookingById); // Get booking details
router.put('/:id/status', adminMiddleware, updateBookingStatus); // Update status (admin)
router.put('/:id/cancel', authMiddleware, cancelBooking); // Cancel booking (user)

module.exports = router;