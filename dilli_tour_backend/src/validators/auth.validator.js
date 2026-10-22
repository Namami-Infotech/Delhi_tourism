const { body } = require('express-validator');

// Admin login validator
const loginValidator = [
  body('email').isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

// Tourist / User Send OTP validator
const sendOtpValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Mobile phone number is required.')
    .matches(/^[0-9+\s-]{10,15}$/)
    .withMessage('Please provide a valid 10-digit phone number.'),
];

// Tourist / User Verify OTP validator
const verifyOtpValidator = [
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Mobile phone number is required.')
    .matches(/^[0-9+\s-]{10,15}$/)
    .withMessage('Please provide a valid 10-digit phone number.'),
  body('otp')
    .trim()
    .notEmpty()
    .withMessage('OTP is required.')
    .isLength({ min: 4, max: 8 })
    .withMessage('OTP must be a valid code.'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),
];

// Tourist / User Register (Email & Password)
const userRegisterValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number.'),
];

// Tourist / User Login (Email & Password)
const userLoginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

// User update profile
const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9+\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number.'),
  body('avatar').optional().trim(),
];

module.exports = {
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
  userRegisterValidator,
  userLoginValidator,
  updateProfileValidator,
};
