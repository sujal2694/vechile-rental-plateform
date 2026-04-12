/**
 * Vehicle Model - Represents rental vehicles
 */

const vehicleSchema = {
  _id: 'ObjectId',
  name: {
    type: 'string',
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  category: {
    type: 'string',
    required: true,
    enum: ['economy', 'standard', 'premium', 'luxury', 'suv'],
  },
  description: {
    type: 'string',
    default: '',
    maxlength: 500,
  },
  image: {
    type: 'string',
    default: '',
  },
  images: {
    type: 'array',
    default: [],
  },
  seats: {
    type: 'number',
    default: 4,
    min: 1,
    max: 8,
  },
  transmission: {
    type: 'string',
    enum: ['Manual', 'Automatic'],
    default: 'Automatic',
  },
  fuel: {
    type: 'string',
    enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
    default: 'Petrol',
  },
  mileage: {
    type: 'number',
    default: 0, // in km/l
  },
  year: {
    type: 'number',
    default: null,
  },
  pricePerDay: {
    type: 'number',
    required: true,
    min: 0,
  },
  pricePerHour: {
    type: 'number',
    default: null,
    min: 0,
  },
  rating: {
    type: 'number',
    default: 4.5,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: 'number',
    default: 0,
    min: 0,
  },
  availability: {
    type: 'boolean',
    default: true,
  },
  features: {
    type: 'array',
    default: [],
    items: 'string', // e.g., ['AC', 'GPS', 'Camera', 'Sunroof']
  },
  isApproved: {
    type: 'boolean',
    default: false, // Admin must approve before display
  },
  createdBy: {
    type: 'ObjectId',
    ref: 'User',
  },
  createdAt: {
    type: 'date',
    default: 'Date.now()',
  },
  updatedAt: {
    type: 'date',
    default: 'Date.now()',
  },
  bookingCount: {
    type: 'number',
    default: 0,
  },
};

module.exports = vehicleSchema;
