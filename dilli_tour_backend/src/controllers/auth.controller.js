const authService = require('../services/auth.service');

// Admin Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// Admin Me
const me = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: req.admin });
  } catch (err) {
    next(err);
  }
};

// Logout (Stateless JWT)
const logout = async (_req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

// ─── Tourist / User Auth Handlers ─────────────────────────────────────────────

// Send SMS OTP
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const result = await authService.sendOtp(phone);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Verify SMS OTP & Login / Auto-register
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, name } = req.body;
    const result = await authService.verifyOtp({ phone, otp, name });
    res.status(200).json({
      success: true,
      message: result.isNewUser
        ? 'Welcome! Account created and logged in successfully.'
        : 'Welcome back! Logged in successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// User Register (Email & Password)
const registerUser = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// User Login (Email & Password)
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// User Me (Current Tourist Profile)
const userMe = async (req, res, next) => {
  try {
    const profile = await authService.getUserProfile(req.user.id);
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

// Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const updated = await authService.updateUserProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  me,
  logout,
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  userMe,
  updateProfile,
};
