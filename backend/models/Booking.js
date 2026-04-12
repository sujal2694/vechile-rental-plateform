/**
 * Booking Model - Represents vehicle rental bookings
 */

const bookingSchema = {
  _id: 'ObjectId',
  userId: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
  vehicleId: {
    type: 'ObjectId',
    ref: 'Vehicle',
    required: true,
  },
  vehicleName: {
    type: 'string',
    required: true,
  },
  vehicleCategory: {
    type: 'string',
    default: '',
  },
  startDate: {
    type: 'date',
    required: true,
  },
  endDate: {
    type: 'date',
    required: true,
  },
  rentalDays: {
    type: 'number',
    required: true,
    min: 1,
  },
  quantity: {
    type: 'number',
    default: 1,
    min: 1,
  },
  pickupLocation: {
    type: 'string',
    default: '',
    maxlength: 200,
  },
  dropoffLocation: {
    type: 'string',
    default: '',
    maxlength: 200,
  },
  pricePerDay: {
    type: 'number',
    required: true,
    min: 0,
  },
  totalCost: {
    type: 'number',
    required: true,
    min: 0,
  },
  discount: {
    type: 'number',
    default: 0,
    min: 0,
  },
  status: {
    type: 'string',
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: 'string',
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  paymentMethod: {
    type: 'string',
    enum: ['stripe', 'cash', 'bank_transfer'],
    default: null,
  },
  paymentId: {
    type: 'string',
    default: '',
  },
  sessionId: {
    type: 'string',
    default: '',
  },
  notes: {
    type: 'string',
    default: '',
    maxlength: 500,
  },
  cancellationReason: {
    type: 'string',
    default: '',
    maxlength: 300,
  },
  cancelledAt: {
    type: 'date',
    default: null,
  },
  completedAt: {
    type: 'date',
    default: null,
  },
  createdAt: {
    type: 'date',
    default: 'Date.now()',
  },
  updatedAt: {
    type: 'date',
    default: 'Date.now()',
  },
};

module.exports = bookingSchema;
