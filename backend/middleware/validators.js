const validator = require('validator');

/**
 * Validate email format
 */
const validateEmail = (email) => {
  return validator.isEmail(email.toLowerCase().trim());
};

/**
 * Validate password strength (min 6 chars, at least 1 number)
 */
const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least 1 number' };
  }
  return { valid: true };
};

/**
 * Validate phone number (optional but strict if provided)
 */
const validatePhone = (phone) => {
  if (!phone) return { valid: true }; // Optional field
  return {
    valid: /^[\d+\-() ]{7,20}$/.test(phone),
    message: 'Invalid phone number format',
  };
};

/**
 * Validate booking dates
 */
const validateBookingDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // Start date must be in future
  if (start < now) {
    return { valid: false, message: 'Start date must be in the future' };
  }

  // End date must be after start date
  if (end <= start) {
    return { valid: false, message: 'End date must be after start date' };
  }

  // Calculate rental days
  const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (rentalDays > 365) {
    return { valid: false, message: 'Rental period cannot exceed 365 days' };
  }

  return { valid: true, rentalDays };
};

/**
 * Validate price (must be positive number)
 */
const validatePrice = (price) => {
  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return { valid: false, message: 'Price must be a positive number' };
  }
  return { valid: true, price: priceNum };
};

/**
 * Validate vehicle fields
 */
const validateVehicleData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('Vehicle name must be at least 2 characters');
  }

  const validCategories = ['economy', 'standard', 'premium', 'luxury', 'suv'];
  if (!validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }

  const priceValidation = validatePrice(data.pricePerDay);
  if (!priceValidation.valid) {
    errors.push(priceValidation.message);
  }

  if (data.seats && (data.seats < 1 || data.seats > 8)) {
    errors.push('Seats must be between 1 and 8');
  }

  const validTransmissions = ['Manual', 'Automatic'];
  if (data.transmission && !validTransmissions.includes(data.transmission)) {
    errors.push(`Transmission must be one of: ${validTransmissions.join(', ')}`);
  }

  const validFuels = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  if (data.fuel && !validFuels.includes(data.fuel)) {
    errors.push(`Fuel must be one of: ${validFuels.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize user input to prevent XSS
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

/**
 * Sanitize object
 */
const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateBookingDates,
  validatePrice,
  validateVehicleData,
  sanitizeInput,
  sanitizeObject,
};
