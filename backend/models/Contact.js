/**
 * Contact Model - Represents contact form submissions
 */

const contactSchema = {
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
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: 'string',
    default: '',
    match: /^[\d+\-() ]*$/,
  },
  subject: {
    type: 'string',
    required: true,
    minlength: 5,
    maxlength: 200,
  },
  message: {
    type: 'string',
    required: true,
    minlength: 10,
    maxlength: 2000,
  },
  status: {
    type: 'string',
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new',
  },
  priority: {
    type: 'string',
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'low',
  },
  assignedTo: {
    type: 'ObjectId',
    ref: 'User',
    default: null,
  },
  reply: {
    type: 'string',
    default: '',
    maxlength: 2000,
  },
  repliedAt: {
    type: 'date',
    default: null,
  },
  tags: {
    type: 'array',
    default: [],
    items: 'string', // e.g., ['billing', 'vehicle-issue', 'booking']
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

module.exports = contactSchema;
