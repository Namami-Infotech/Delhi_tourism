const prisma = require('../config/database');
const bookingService = require('../services/booking.service');

const initiate = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.user) {
      payload.userId = req.user.id;
      if (!payload.customerName) payload.customerName = req.user.name || 'Delhi Tourist';
      if (!payload.customerPhone) payload.customerPhone = req.user.phone || '';
      if (!payload.customerEmail) {
        payload.customerEmail = req.user.email || `${req.user.phone || req.user.id}@delhitourism.dev`;
      }
    }
    const result = await bookingService.initiateBooking(payload);
    res.status(201).json({
      success: true,
      message: result.requiresPayment
        ? 'Booking initiated. Please complete the Razorpay payment.'
        : 'Booking confirmed successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            slug: true,
            locality: true,
            coverImage: true,
            imageUrl: true,
          },
        },
        payments: true,
      },
    });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const booking = await bookingService.verifyPayment(req.body);
    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully.',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

const simulatePayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'bookingId is required.' });
    }
    const booking = await bookingService.simulatePayment(bookingId);
    res.status(200).json({
      success: true,
      message: 'Payment simulated and ticket confirmed successfully.',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

const getByNumber = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingByNumber(req.params.bookingNumber);
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

const verifyPass = async (req, res, next) => {
  try {
    const result = await bookingService.verifyTicketPass(req.params.passCode);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const cancel = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.body.reason);
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await bookingService.getAllBookings(req.query);
    res.status(200).json({ success: true, data: result.bookings, pagination: result.pagination });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status, cancellationReason);
    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}.`,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await bookingService.getBookingStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const result = await bookingService.handleWebhook(rawBody, signature);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  initiate,
  getMyBookings,
  verifyPayment,
  simulatePayment,
  getById,
  getByNumber,
  verifyPass,
  cancel,
  getAll,
  updateStatus,
  getStats,
  handleWebhook,
};
