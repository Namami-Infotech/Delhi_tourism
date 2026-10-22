const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect, protectUser } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const {
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
  userRegisterValidator,
  userLoginValidator,
  updateProfileValidator,
} = require('../validators/auth.validator');

const router = express.Router();

// ─── Admin Authentication ─────────────────────────────────────────────────────

router.post('/login', loginValidator, validate, authController.login);
router.get('/me', protect, authController.me);
router.post('/logout', protect, authController.logout);

// ─── Tourist / User Phone SMS OTP Authentication ──────────────────────────────

// Send OTP to phone (Test numbers 9999999999 & 8888888888 use fixed 123456)
router.post('/user/send-otp', sendOtpValidator, validate, authController.sendOtp);

// Verify OTP & log in or auto-register user
router.post('/user/verify-otp', verifyOtpValidator, validate, authController.verifyOtp);

// ─── Tourist / User Email & Password Authentication ───────────────────────────

// Register new tourist with email and password
router.post('/user/register', userRegisterValidator, validate, authController.registerUser);

// Login tourist with email and password
router.post('/user/login', userLoginValidator, validate, authController.loginUser);

// ─── Tourist Profile & Session ────────────────────────────────────────────────

// Get currently logged-in user profile with their booked tickets
router.get('/user/me', protectUser, authController.userMe);

// Update user profile details
router.put('/user/profile', protectUser, updateProfileValidator, validate, authController.updateProfile);

// User logout
router.post('/user/logout', authController.logout);

module.exports = router;
