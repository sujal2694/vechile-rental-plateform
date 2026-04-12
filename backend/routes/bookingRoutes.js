const express = require('express');
const { createBooking, getUserBookings, getBookingById, updateBookingStatus, cancelBooking, createPaymentIntent, confirmPayment, createCheckoutSession, verifyCheckout } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getUserBookings);
router.get('/:id', authMiddleware, getBookingById);
router.put('/:id/status', authMiddleware, updateBookingStatus);
router.put('/:id/cancel', authMiddleware, cancelBooking);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/verify-checkout/:sessionId', verifyCheckout);

module.exports = router;