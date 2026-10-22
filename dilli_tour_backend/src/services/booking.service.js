const prisma = require('../config/database');
const env = require('../config/env');
const razorpayHelper = require('../config/razorpay');

/**
 * Generate a unique human-friendly booking reference
 * Example: DL-261021-A9X2
 */
const generateBookingNumber = () => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DL-${dateStr}-${randomChars}`;
};

/**
 * Generate secure ticket pass verification token for gate QR check
 */
const generateTicketPassCode = () => {
  const part1 = Math.random().toString(36).substring(2, 8).toUpperCase();
  const part2 = Date.now().toString(36).toUpperCase();
  return `TKT-${part1}-${part2}`;
};

/**
 * Initiate a new booking and create Razorpay order
 */
const initiateBooking = async (data) => {
  const {
    placeId,
    visitDate,
    timeSlot = 'General (09:00 - 17:00)',
    customerName,
    customerEmail,
    customerPhone,
    indianAdults = 0,
    indianChildren = 0,
    foreignerAdults = 0,
    foreignerChildren = 0,
    idProofType = null,
    idProofNumber = null,
    notes = null,
    userId = null,
  } = data;

  // 1. Fetch Place
  const place = await prisma.place.findUnique({
    where: { id: parseInt(placeId, 10) },
    select: {
      id: true,
      name: true,
      slug: true,
      locality: true,
      address: true,
      entryFeeIndian: true,
      entryFeeForeigner: true,
      entryFeeChild: true,
      isTicketRequired: true,
      ticketInformation: true,
      isActive: true,
      coverImage: true,
      imageUrl: true,
    },
  });

  if (!place || !place.isActive) {
    const err = new Error('Selected destination is not available for booking.');
    err.statusCode = 404;
    throw err;
  }

  // 2. Validate ticket counts
  const indAdults = Math.max(0, parseInt(indianAdults, 10) || 0);
  const indChildren = Math.max(0, parseInt(indianChildren, 10) || 0);
  const forAdults = Math.max(0, parseInt(foreignerAdults, 10) || 0);
  const forChildren = Math.max(0, parseInt(foreignerChildren, 10) || 0);

  const totalTickets = indAdults + indChildren + forAdults + forChildren;
  if (totalTickets <= 0) {
    const err = new Error('Please select at least 1 visitor ticket.');
    err.statusCode = 400;
    throw err;
  }

  // 3. Calculate pricing
  const feeIndian = Number(place.entryFeeIndian || 0);
  const feeForeigner = Number(place.entryFeeForeigner || 0);
  const feeChild = Number(place.entryFeeChild || (feeIndian > 0 ? Math.floor(feeIndian / 2) : 0));
  const feeForeignerChild = feeForeigner > 0 ? Math.floor(feeForeigner / 2) : 0;

  const subtotal =
    indAdults * feeIndian +
    indChildren * feeChild +
    forAdults * feeForeigner +
    forChildren * feeForeignerChild;

  const taxAmount = 0; // Heritage entry tickets are exempt or tax inclusive
  const totalAmount = subtotal + taxAmount;

  // 4. Unique booking reference & verification token
  let bookingNumber;
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 5) {
    bookingNumber = generateBookingNumber();
    const existing = await prisma.booking.findUnique({ where: { bookingNumber } });
    if (!existing) isUnique = true;
    attempts++;
  }

  const ticketPassCode = generateTicketPassCode();

  // If monument entry is completely free
  const isFreeEntry = totalAmount === 0;

  // 5. Create Booking in database
  const booking = await prisma.booking.create({
    data: {
      bookingNumber,
      placeId: place.id,
      customerName,
      customerEmail,
      customerPhone,
      visitDate: new Date(visitDate),
      timeSlot,
      indianAdults: indAdults,
      indianChildren: indChildren,
      foreignerAdults: forAdults,
      foreignerChildren: forChildren,
      totalTickets,
      subtotal,
      taxAmount,
      totalAmount,
      currency: 'INR',
      bookingStatus: isFreeEntry ? 'CONFIRMED' : 'PENDING',
      paymentStatus: isFreeEntry ? 'PAID' : 'PENDING',
      ticketPassCode,
      idProofType,
      idProofNumber,
      notes,
      userId: userId ? parseInt(userId, 10) : null,
    },
    include: {
      place: {
        select: {
          id: true,
          name: true,
          slug: true,
          locality: true,
          address: true,
          coverImage: true,
          imageUrl: true,
        },
      },
    },
  });

  // If free entry, no Razorpay order required
  if (isFreeEntry) {
    return {
      booking,
      requiresPayment: false,
      message: 'Ticket booked successfully. Entry is complimentary for this location.',
    };
  }

  // 6. Create Razorpay Order
  const amountInPaise = Math.round(totalAmount * 100);
  const razorpayOrder = await razorpayHelper.createOrder({
    amount: amountInPaise,
    currency: 'INR',
    receipt: booking.bookingNumber,
    notes: {
      bookingId: String(booking.id),
      bookingNumber: booking.bookingNumber,
      placeName: place.name,
      customerEmail,
    },
  });

  // 7. Record pending payment entry
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      status: 'PENDING',
      rawResponse: JSON.stringify(razorpayOrder),
    },
  });

  return {
    booking,
    requiresPayment: true,
    razorpayOrderId: razorpayOrder.id,
    amount: totalAmount,
    amountInPaise,
    currency: 'INR',
    razorpayKeyId: env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
    isSimulationMode: razorpayHelper.isSimulationMode,
  };
};

/**
 * Verify Razorpay payment and confirm ticket booking
 */
const verifyPayment = async ({
  bookingId,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  paymentMethod = 'razorpay',
}) => {
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(bookingId, 10) },
    include: {
      place: true,
      payments: true,
    },
  });

  if (!booking) {
    const err = new Error('Booking not found.');
    err.statusCode = 404;
    throw err;
  }

  // If already confirmed
  if (booking.bookingStatus === 'CONFIRMED' && booking.paymentStatus === 'PAID') {
    return booking;
  }

  // Verify Signature
  const isValid = razorpayHelper.verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    // Record failure in payment record
    await prisma.payment.updateMany({
      where: { bookingId: booking.id, razorpayOrderId: razorpay_order_id },
      data: {
        status: 'FAILED',
        errorCode: 'SIGNATURE_VERIFICATION_FAILED',
        errorDescription: 'The provided signature does not match.',
      },
    });

    const err = new Error('Payment verification failed: invalid signature.');
    err.statusCode = 400;
    throw err;
  }

  // Update or Create Payment record as PAID
  const existingPayment = await prisma.payment.findFirst({
    where: {
      bookingId: booking.id,
      OR: [
        { razorpayOrderId: razorpay_order_id },
        { status: 'PENDING' },
      ],
    },
  });

  if (existingPayment) {
    await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'PAID',
        method: paymentMethod,
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: booking.totalAmount,
        currency: booking.currency,
        status: 'PAID',
        method: paymentMethod,
      },
    });
  }

  // Confirm booking
  const updatedBooking = await prisma.booking.update({
    where: { id: booking.id },
    data: {
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    include: {
      place: {
        select: {
          id: true,
          name: true,
          slug: true,
          locality: true,
          address: true,
          openingTime: true,
          closingTime: true,
          coverImage: true,
          imageUrl: true,
        },
      },
      payments: true,
    },
  });

  return updatedBooking;
};

/**
 * Simulate payment success for development / testing without live gateway
 */
const simulatePayment = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(bookingId, 10) },
    include: { payments: true },
  });

  if (!booking) {
    const err = new Error('Booking not found.');
    err.statusCode = 404;
    throw err;
  }

  const simulatedPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderId =
    booking.payments[0]?.razorpayOrderId ||
    `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return verifyPayment({
    bookingId: booking.id,
    razorpay_order_id: orderId,
    razorpay_payment_id: simulatedPaymentId,
    razorpay_signature: 'simulated_signature',
    paymentMethod: 'simulation_test',
  });
};

/**
 * Get booking by primary ID
 */
const getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      place: {
        select: {
          id: true,
          name: true,
          slug: true,
          locality: true,
          address: true,
          openingTime: true,
          closingTime: true,
          coverImage: true,
          imageUrl: true,
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!booking) {
    const err = new Error('Booking not found.');
    err.statusCode = 404;
    throw err;
  }

  return booking;
};

/**
 * Get booking by public booking number (e.g. DL-261021-A9X2)
 */
const getBookingByNumber = async (bookingNumber) => {
  const booking = await prisma.booking.findUnique({
    where: { bookingNumber },
    include: {
      place: {
        select: {
          id: true,
          name: true,
          slug: true,
          locality: true,
          address: true,
          openingTime: true,
          closingTime: true,
          coverImage: true,
          imageUrl: true,
        },
      },
      payments: {
        select: {
          id: true,
          razorpayPaymentId: true,
          amount: true,
          status: true,
          method: true,
          createdAt: true,
        },
      },
    },
  });

  if (!booking) {
    const err = new Error(`No booking found with reference ${bookingNumber}.`);
    err.statusCode = 404;
    throw err;
  }

  return booking;
};

/**
 * Verify ticket pass code at monument entry gate
 */
const verifyTicketPass = async (passCode) => {
  const booking = await prisma.booking.findUnique({
    where: { ticketPassCode: passCode },
    include: {
      place: {
        select: {
          id: true,
          name: true,
          locality: true,
        },
      },
    },
  });

  if (!booking) {
    return {
      valid: false,
      message: 'Invalid ticket pass code. Entry not permitted.',
    };
  }

  const visitDate = new Date(booking.visitDate);
  const today = new Date();
  const isSameDay =
    visitDate.getFullYear() === today.getFullYear() &&
    visitDate.getMonth() === today.getMonth() &&
    visitDate.getDate() === today.getDate();

  const isConfirmed = booking.bookingStatus === 'CONFIRMED' && booking.paymentStatus === 'PAID';

  return {
    valid: isConfirmed,
    isConfirmed,
    isSameDay,
    bookingNumber: booking.bookingNumber,
    customerName: booking.customerName,
    placeName: booking.place?.name,
    visitDate: booking.visitDate,
    timeSlot: booking.timeSlot,
    totalTickets: booking.totalTickets,
    breakdown: {
      indianAdults: booking.indianAdults,
      indianChildren: booking.indianChildren,
      foreignerAdults: booking.foreignerAdults,
      foreignerChildren: booking.foreignerChildren,
    },
    status: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
  };
};

/**
 * Cancel booking
 */
const cancelBooking = async (id, reason = 'Cancelled by customer') => {
  const booking = await prisma.booking.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!booking) {
    const err = new Error('Booking not found.');
    err.statusCode = 404;
    throw err;
  }

  if (booking.bookingStatus === 'CANCELLED') {
    return booking;
  }

  return prisma.booking.update({
    where: { id: booking.id },
    data: {
      bookingStatus: 'CANCELLED',
      cancellationReason: reason,
      cancelledAt: new Date(),
    },
  });
};

/**
 * Admin: Get all bookings with filtering & pagination
 */
const getAllBookings = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 15));
  const skip = (page - 1) * limit;

  const where = {};

  if (query.status) {
    where.bookingStatus = query.status;
  }

  if (query.paymentStatus) {
    where.paymentStatus = query.paymentStatus;
  }

  if (query.placeId) {
    where.placeId = parseInt(query.placeId, 10);
  }

  if (query.date) {
    const d = new Date(query.date);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);
    where.visitDate = {
      gte: d,
      lt: nextD,
    };
  }

  if (query.search) {
    const s = query.search.trim();
    where.OR = [
      { bookingNumber: { contains: s } },
      { customerName: { contains: s } },
      { customerEmail: { contains: s } },
      { customerPhone: { contains: s } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        place: {
          select: {
            id: true,
            name: true,
            slug: true,
            locality: true,
          },
        },
        payments: {
          select: {
            id: true,
            razorpayPaymentId: true,
            status: true,
            method: true,
          },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return {
    bookings,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Admin: Update booking status
 */
const updateBookingStatus = async (id, status, cancellationReason) => {
  const data = { bookingStatus: status };
  if (status === 'CANCELLED') {
    data.cancelledAt = new Date();
    if (cancellationReason) data.cancellationReason = cancellationReason;
  }

  return prisma.booking.update({
    where: { id: parseInt(id, 10) },
    data,
    include: {
      place: { select: { id: true, name: true } },
    },
  });
};

/**
 * Admin: Get booking & revenue statistics
 */
const getBookingStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    todayBookings,
    revenueAggregate,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { bookingStatus: 'CONFIRMED' } }),
    prisma.booking.count({ where: { bookingStatus: 'PENDING' } }),
    prisma.booking.count({ where: { bookingStatus: 'CANCELLED' } }),
    prisma.booking.count({
      where: {
        createdAt: { gte: today, lt: tomorrow },
      },
    }),
    prisma.booking.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true, totalTickets: true },
    }),
    prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        place: { select: { name: true } },
      },
    }),
  ]);

  return {
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    todayBookings,
    totalRevenue: Number(revenueAggregate._sum.totalAmount || 0),
    totalTicketsSold: Number(revenueAggregate._sum.totalTickets || 0),
    recentBookings,
  };
};

/**
 * Handle incoming Razorpay webhook events
 */
const handleWebhook = async (rawBody, signature) => {
  const isValid = razorpayHelper.verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    const err = new Error('Invalid webhook signature.');
    err.statusCode = 400;
    throw err;
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  if (event === 'payment.captured') {
    const paymentEntity = payload.payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: orderId },
      include: { booking: true },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: paymentId,
          status: 'PAID',
          method: paymentEntity.method,
          rawResponse: JSON.stringify(paymentEntity),
        },
      });

      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          bookingStatus: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });
    }
  }

  return { received: true, event };
};

module.exports = {
  initiateBooking,
  verifyPayment,
  simulatePayment,
  getBookingById,
  getBookingByNumber,
  verifyTicketPass,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
  handleWebhook,
};
