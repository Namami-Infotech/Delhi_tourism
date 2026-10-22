const { body, param, query } = require('express-validator');

const createBookingValidator = [
  body('placeId')
    .notEmpty()
    .withMessage('Place ID is required.')
    .isInt({ min: 1 })
    .withMessage('Place ID must be a positive integer.'),
  body('visitDate')
    .notEmpty()
    .withMessage('Visit date is required.')
    .isISO8601()
    .withMessage('Visit date must be a valid date (YYYY-MM-DD).'),
  body('timeSlot')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  body('customerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be between 2 and 150 characters.'),
  body('customerEmail')
    .optional()
    .trim()
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
  body('customerPhone')
    .optional()
    .trim()
    .isLength({ min: 7, max: 20 })
    .withMessage('Phone number must be between 7 and 20 digits.'),
  body('indianAdults')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Indian adults count must be 0 or greater.'),
  body('indianChildren')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Indian children count must be 0 or greater.'),
  body('foreignerAdults')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Foreigner adults count must be 0 or greater.'),
  body('foreignerChildren')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Foreigner children count must be 0 or greater.'),
  body('idProofType')
    .optional()
    .trim()
    .isLength({ max: 50 }),
  body('idProofNumber')
    .optional()
    .trim()
    .isLength({ max: 100 }),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }),
];

const verifyPaymentValidator = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required.')
    .isInt({ min: 1 })
    .withMessage('Booking ID must be a valid integer.'),
  body('razorpay_order_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Order ID is required.'),
  body('razorpay_payment_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Payment ID is required.'),
  body('razorpay_signature')
    .trim()
    .notEmpty()
    .withMessage('Razorpay Signature is required.'),
];

const updateStatusValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid booking ID is required.'),
  body('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'EXPIRED'])
    .withMessage('Invalid booking status.'),
  body('cancellationReason')
    .optional()
    .trim()
    .isLength({ max: 300 }),
];

module.exports = {
  createBookingValidator,
  verifyPaymentValidator,
  updateStatusValidator,
};
