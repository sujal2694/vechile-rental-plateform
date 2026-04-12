/**
 * User Model - Represents vehicle rental platform user
 */

const userSchema = {
  _id: 'ObjectId',
  fullName: {
    type: 'string',
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: 'string',
    required: true,
    minlength: 6, // Must be hashed!
  },
  phone: {
    type: 'string',
    default: '',
    match: /^[\d+\-() ]*$/,
  },
  address: {
    type: 'string',
    default: '',
    maxlength: 200,
  },
  role: {
    type: 'string',
    enum: ['user', 'admin'],
    default: 'user',
  },
  profileImage: {
    type: 'string',
    default: '',
  },
  isActive: {
    type: 'boolean',
    default: true,
  },
  createdAt: {
    type: 'date',
    default: 'Date.now()',
  },
  updatedAt: {
    type: 'date',
    default: 'Date.now()',
  },
  lastLogin: {
    type: 'date',
    default: null,
  },
};

module.exports = userSchema;
