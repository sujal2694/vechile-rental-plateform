const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const { validateBookingDates, validatePrice } = require('../middleware/validators');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe = null;

if (stripeSecretKey && stripeSecretKey !== 'sk_test_<YOUR_SECRET_KEY_HERE>') {
  stripe = require('stripe')(stripeSecretKey);
} else {
  console.warn(
    '⚠ Stripe not configured. Payment functionality will be disabled.'
  );
}

/**
 * Create a new booking
 */
const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      totalCost,
      pickupLocation,
      dropoffLocation,
      notes,
    } = req.body;

    // Validate required fields
    if (!vehicleId || !startDate || !endDate || !totalCost) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID, start date, end date, and total cost are required',
      });
    }

    // Validate dates
    const dateValidation = validateBookingDates(startDate, endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.message,
      });
    }

    // Validate price
    const priceValidation = validatePrice(totalCost);
    if (!priceValidation.valid) {
      return res.status(400).json({
        success: false,
        message: priceValidation.message,
      });
    }

    if (!ObjectId.isValid(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle ID',
      });
    }

    const db = getDB();

    // Check if vehicle exists
    const vehicle = await db.collection('vehicles').findOne({
      _id: new ObjectId(vehicleId),
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Check for overlapping bookings
    const overlappingBooking = await db.collection('bookings').findOne({
      vehicleId: new ObjectId(vehicleId),
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message:
          'Vehicle is not available for the selected dates. Please choose different dates.',
      });
    }

    const rentalDays = dateValidation.rentalDays;
    const newBooking = {
      userId: new ObjectId(req.user.userId),
      vehicleId: new ObjectId(vehicleId),
      vehicleName: vehicle.name,
      vehicleCategory: vehicle.category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      rentalDays,
      quantity: 1,
      pickupLocation: pickupLocation || '',
      dropoffLocation: dropoffLocation || '',
      pricePerDay: vehicle.pricePerDay,
      totalCost: priceValidation.price,
      discount: 0,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: null,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('bookings').insertOne(newBooking);

    // Increment vehicle booking count
    await db
      .collection('vehicles')
      .updateOne(
        { _id: new ObjectId(vehicleId) },
        { $inc: { bookingCount: 1 } }
      );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: { id: result.insertedId, ...newBooking },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
    });
  }
};

/**
 * Get user bookings with pagination
 */
const getUserBookings = async (req, res) => {
  try {
    const db = getDB();
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const userId = new ObjectId(req.user.userId);

    // Get total count
    const total = await db.collection('bookings').countDocuments({
      userId,
    });

    // Get paginated bookings
    const bookings = await db
      .collection('bookings')
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json({
      success: true,
      bookings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
};

/**
 * Get booking by ID
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const db = getDB();

    const booking = await db.collection('bookings').findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization - user can only view their own bookings
    if (booking.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this booking',
      });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
    });
  }
};

/**
 * Update booking status (ADMIN ONLY typically)
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const db = getDB();
    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : null,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
    });
  }
};

/**
 * Cancel booking
 */
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const db = getDB();

    const booking = await db.collection('bookings').findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason || '',
        },
      }
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
    });
  }
};

/**
 * Create Stripe checkout session
 */
const createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment system not configured. Please contact support.',
      });
    }

    const { cartItems, successUrl, cancelUrl } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart items are required',
      });
    }

    const db = getDB();
    const lineItems = [];

    for (const item of cartItems) {
      if (!ObjectId.isValid(item.vehicleId)) {
        return res.status(400).json({
          success: false,
          message: `Invalid vehicle ID: ${item.vehicleId}`,
        });
      }

      const vehicle = await db.collection('vehicles').findOne({
        _id: new ObjectId(item.vehicleId),
      });

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: `Vehicle ${item.vehicleId} not found`,
        });
      }

      const unitAmount = Math.round(vehicle.pricePerDay * 100); // Convert to cents

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: vehicle.name,
            description: `${vehicle.category} - ${vehicle.seats} seats, ${vehicle.transmission}, ${vehicle.fuel}`,
            images: vehicle.image
              ? [
                  `${process.env.SERVER_URL || 'http://localhost:5000'}${vehicle.image}`,
                ]
              : [],
          },
          unit_amount: unitAmount,
        },
        quantity: (item.quantity || 1) * (item.rentalDays || 1),
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:
        successUrl || 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'http://localhost:3000/cart',
      metadata: {
        cartItems: JSON.stringify(cartItems),
        userId: req.user?.userId || 'guest',
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session',
    });
  }
};

/**
 * Verify Stripe checkout and create booking
 */
const verifyCheckout = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment system not configured',
      });
    }

    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }

    const cartItems = JSON.parse(session.metadata.cartItems);
    const db = getDB();
    const bookings = [];

    for (const item of cartItems) {
      const vehicle = await db.collection('vehicles').findOne({
        _id: new ObjectId(item.vehicleId),
      });

      if (!vehicle) continue;

      const booking = {
        userId: session.metadata.userId !== 'guest' ? new ObjectId(session.metadata.userId) : null,
        vehicleId: new ObjectId(item.vehicleId),
        vehicleName: vehicle.name,
        vehicleCategory: vehicle.category,
        rentalDays: item.rentalDays || 1,
        quantity: item.quantity || 1,
        pricePerDay: vehicle.pricePerDay,
        totalCost: vehicle.pricePerDay * (item.rentalDays || 1) * (item.quantity || 1),
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentId: session.payment_intent,
        sessionId: session.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection('bookings').insertOne(booking);
      bookings.push({ id: result.insertedId, ...booking });
    }

    res.json({
      success: true,
      message: 'Payment verified and bookings created',
      bookings,
    });
  } catch (error) {
    console.error('Checkout verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify checkout',
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  createCheckoutSession,
  verifyCheckout,
};