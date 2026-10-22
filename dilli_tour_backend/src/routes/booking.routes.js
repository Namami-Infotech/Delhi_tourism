const express = require("express");
const bookingController = require("../controllers/booking.controller");
const {
  protect,
  restrict,
  protectUser,
} = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const {
  createBookingValidator,
  verifyPaymentValidator,
  updateStatusValidator,
} = require("../validators/booking.validator");

const router = express.Router();

// ─── Protected Tourist Booking & Payment Routes (Token Required) ──────────────

// Initiate ticket booking & create Razorpay order (Requires user token)
router.post(
  "/initiate",
  protectUser,
  createBookingValidator,
  validate,
  bookingController.initiate,
);
router.post(
  "/",
  protectUser,
  createBookingValidator,
  validate,
  bookingController.initiate,
);

// Verify Razorpay payment signature & confirm booking (Requires user token)
router.post(
  "/verify-payment",
  protectUser,
  verifyPaymentValidator,
  validate,
  bookingController.verifyPayment,
);

// Test/Sandbox payment simulation endpoint (Requires user token)
router.post(
  "/simulate-payment",
  protectUser,
  bookingController.simulatePayment,
);

// Get all bookings made by the currently logged-in user
router.get("/user/my-bookings", protectUser, bookingController.getMyBookings);

// ─── Public Verification & Pass Check Routes ──────────────────────────────────

// Get booking details by public reference number (e.g. DL-261021-A9X2)
router.get("/reference/:bookingNumber", bookingController.getByNumber);

// Gate check-in QR code / ticket pass verification
router.get("/verify-pass/:passCode", bookingController.verifyPass);

// Cancel booking by customer/system
router.post("/:id/cancel", bookingController.cancel);

// Razorpay webhook
router.post("/webhook", bookingController.handleWebhook);

// ─── Admin Booking Management Routes ──────────────────────────────────────────

router.get(
  "/admin/stats",
  protect,
  restrict("SUPER_ADMIN", "ADMIN", "EDITOR"),
  bookingController.getStats,
);

router.get(
  "/admin/all",
  protect,
  restrict("SUPER_ADMIN", "ADMIN", "EDITOR"),
  bookingController.getAll,
);

router.patch(
  "/admin/:id/status",
  protect,
  restrict("SUPER_ADMIN", "ADMIN"),
  updateStatusValidator,
  validate,
  bookingController.updateStatus,
);

// Get booking by ID (can be accessed with booking ID)
router.get("/:id", bookingController.getById);

module.exports = router;
