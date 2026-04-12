const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key. Set STRIPE_SECRET_KEY in backend/.env');
}
const stripe = require('stripe')(stripeSecretKey);

const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, totalCost, pickupLocation, dropoffLocation } = req.body;

    if (!vehicleId || !startDate || !endDate || !totalCost) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const db = getDB();

    const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(vehicleId) });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const newBooking = {
      userId: new ObjectId(req.user.userId),
      vehicleId: new ObjectId(vehicleId),
      vehicleName: vehicle.name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalCost,
      pickupLocation: pickupLocation || '',
      dropoffLocation: dropoffLocation || '',
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await db.collection('bookings').insertOne(newBooking);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: { id: result.insertedId, ...newBooking },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const db = getDB();
    const bookings = await db.collection('bookings')
      .find({ userId: new ObjectId(req.user.userId) })
      .toArray();

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const db = getDB();
    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'cancelled', cancelledAt: new Date() } }
    );

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
};

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, vehicleId, rentalDays } = req.body;

    if (!amount || !vehicleId || !rentalDays) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const db = getDB();
    const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(vehicleId) });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Create Stripe payment intent (don't confirm yet)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create payment intent' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, vehicleId, rentalDays, totalCost } = req.body;
    const userId = req.user?.userId;

    if (!paymentIntentId || !vehicleId || !rentalDays || !totalCost) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const db = getDB();
    const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(vehicleId) });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    // Retrieve and check payment intent status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Create booking in database
      const booking = {
        userId: userId ? new ObjectId(userId) : null,
        vehicleId: new ObjectId(vehicleId),
        vehicleName: vehicle.name,
        rentalDays,
        totalCost,
        status: 'confirmed',
        paymentId: paymentIntent.id,
        createdAt: new Date(),
      };

      const result = await db.collection('bookings').insertOne(booking);

      res.json({
        success: true,
        message: 'Payment confirmed and booking created',
        booking: { id: result.insertedId, ...booking },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment confirmation failed' });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, successUrl, cancelUrl } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const db = getDB();
    const lineItems = [];

    for (const item of cartItems) {
      const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(item.vehicleId) });
      if (!vehicle) {
        return res.status(404).json({ success: false, message: `Vehicle ${item.vehicleId} not found` });
      }

      const pricePerDay = parseInt(vehicle.price.replace('$', '').replace('/day', ''));
      const unitAmount = Math.round(pricePerDay * 100); // Convert to cents

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: vehicle.name,
            description: `${vehicle.category} - ${vehicle.seats} seats, ${vehicle.transmission}, ${vehicle.fuel}`,
            images: [`http://localhost:5000${vehicle.image}`],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity * item.rentalDays,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'http://localhost:3000/cart',
      metadata: {
        cartItems: JSON.stringify(cartItems),
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create checkout session' });
  }
};

const verifyCheckout = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    const cartItems = JSON.parse(session.metadata.cartItems);
    const db = getDB();
    const bookings = [];

    for (const item of cartItems) {
      const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(item.vehicleId) });
      if (!vehicle) {
        continue; // Skip if vehicle not found
      }

      const pricePerDay = parseInt(vehicle.price.replace('$', '').replace('/day', ''));
      const totalCost = pricePerDay * item.rentalDays * item.quantity;

      const booking = {
        userId: null, // Anonymous booking for now
        vehicleId: new ObjectId(item.vehicleId),
        vehicleName: vehicle.name,
        rentalDays: item.rentalDays,
        quantity: item.quantity,
        totalCost,
        status: 'confirmed',
        paymentId: session.payment_intent,
        sessionId: session.id,
        createdAt: new Date(),
      };

      const result = await db.collection('bookings').insertOne(booking);
      bookings.push({ id: result.insertedId, ...booking });
    }

    res.json({
      success: true,
      message: 'Checkout verified and bookings created',
      bookings,
    });
  } catch (error) {
    console.error('Checkout verification error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to verify checkout' });
  }
};

module.exports = { createBooking, getUserBookings, getBookingById, updateBookingStatus, cancelBooking, createPaymentIntent, confirmPayment, createCheckoutSession, verifyCheckout };