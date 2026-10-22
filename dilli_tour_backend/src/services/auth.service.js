const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const env = require('../config/env');

/**
 * Clean and normalize 10-digit Indian mobile number
 */
const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

/**
 * Admin Login
 */
const login = async (email, password) => {
  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !admin.isActive) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: admin.id, role: admin.role, type: 'admin' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

const { sendFast2SmsOtp } = require('../config/sms');

/**
 * Tourist / User: Send SMS OTP
 *
 * Specific rules:
 * - Test numbers '9999999999' and '8888888888' use fixed OTP '123456'.
 * - Other numbers generate a random 6-digit OTP.
 * - Sends real SMS via Fast2SMS DLT template (205150) with Sender ID (NAMINF) and Company (DROP).
 * - OTP is also returned in the response for smooth local/dev testing.
 */
const sendOtp = async (phone) => {
  const cleanPhone = cleanPhoneNumber(phone);
  if (!cleanPhone || cleanPhone.length !== 10) {
    const err = new Error('Please provide a valid 10-digit phone number.');
    err.statusCode = 400;
    throw err;
  }

  let otp;
  // Test numbers have fixed OTP '123456'
  if (cleanPhone === '9999999999' || cleanPhone === '8888888888') {
    otp = '123456';
  } else {
    otp = Math.floor(100000 + Math.random() * 900000).toString();
  }

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  // Mark previous unused OTPs for this phone as used
  await prisma.otpVerification.updateMany({
    where: { phone: cleanPhone, isUsed: false },
    data: { isUsed: true },
  });

  // Store new OTP in database
  await prisma.otpVerification.create({
    data: {
      phone: cleanPhone,
      otp,
      expiresAt,
      isUsed: false,
    },
  });

  // Send real SMS via Fast2SMS DLT Gateway
  const smsResult = await sendFast2SmsOtp(cleanPhone, otp);

  return {
    phone: cleanPhone,
    otp, // Sent in response for testing
    smsDelivered: smsResult.success,
    expiresInSeconds: 600,
    message: smsResult.simulated
      ? `OTP generated for test number ${cleanPhone}. OTP is: ${otp}`
      : `OTP sent via SMS to ${cleanPhone}. (For dev testing, OTP: ${otp})`,
  };
};

/**
 * Tourist / User: Verify OTP & Universal Login
 *
 * If the user is registered, logs them in.
 * If the user is first time, automatically registers them.
 * No separate registration step required!
 */
const verifyOtp = async ({ phone, otp, name }) => {
  const cleanPhone = cleanPhoneNumber(phone);
  const trimmedOtp = String(otp).trim();

  const isTestNumber = cleanPhone === '9999999999' || cleanPhone === '8888888888';

  let isValidOtp = false;

  if (isTestNumber && trimmedOtp === '123456') {
    isValidOtp = true;
  } else {
    const record = await prisma.otpVerification.findFirst({
      where: {
        phone: cleanPhone,
        otp: trimmedOtp,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (record) {
      isValidOtp = true;
      await prisma.otpVerification.update({
        where: { id: record.id },
        data: { isUsed: true },
      });
    }
  }

  if (!isValidOtp) {
    const err = new Error('Invalid or expired OTP. Please try again.');
    err.statusCode = 400;
    throw err;
  }

  // Find or automatically create user account
  let user = await prisma.user.findUnique({
    where: { phone: cleanPhone },
  });

  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    user = await prisma.user.create({
      data: {
        phone: cleanPhone,
        name: name || 'Delhi Tourist',
        isPhoneVerified: true,
      },
    });
  } else {
    const updateData = {};
    if (!user.isPhoneVerified) updateData.isPhoneVerified = true;
    if (name && (!user.name || user.name === 'Delhi Tourist')) updateData.name = name;

    if (Object.keys(updateData).length > 0) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }
  }

  if (!user.isActive) {
    const err = new Error('Your user account has been deactivated. Please contact support.');
    err.statusCode = 403;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, type: 'user' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    isNewUser,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  };
};

/**
 * Tourist / User: Register with Email and Password
 */
const registerUser = async ({ name, email, password, phone }) => {
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    const err = new Error('An account with this email address already exists.');
    err.statusCode = 409;
    throw err;
  }

  const cleanPhone = phone ? cleanPhoneNumber(phone) : null;
  if (cleanPhone) {
    const existingPhone = await prisma.user.findUnique({ where: { phone: cleanPhone } });
    if (existingPhone) {
      const err = new Error('This phone number is already registered.');
      err.statusCode = 409;
      throw err;
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: cleanPhone,
      passwordHash,
      isEmailVerified: true,
      isPhoneVerified: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
    },
  });

  const token = jwt.sign(
    { id: user.id, role: user.role, type: 'user' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return { token, user };
};

/**
 * Tourist / User: Login with Email and Password
 */
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  if (!user.passwordHash) {
    const err = new Error(
      'This account was registered using Phone OTP. Please log in using SMS OTP.'
    );
    err.statusCode = 400;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, type: 'user' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    },
  };
};

/**
 * Get current user profile with their booked tickets
 */
const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
      bookings: {
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
        },
      },
    },
  });

  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }

  return user;
};

/**
 * Update current user profile
 */
const updateUserProfile = async (userId, data) => {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.avatar !== undefined) updateData.avatar = data.avatar;

  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id: parseInt(userId, 10) } },
    });
    if (existing) {
      const err = new Error('Email is already in use by another account.');
      err.statusCode = 409;
      throw err;
    }
    updateData.email = data.email;
  }

  if (data.phone) {
    const cleanPhone = cleanPhoneNumber(data.phone);
    const existing = await prisma.user.findFirst({
      where: { phone: cleanPhone, NOT: { id: parseInt(userId, 10) } },
    });
    if (existing) {
      const err = new Error('Phone number is already in use by another account.');
      err.statusCode = 409;
      throw err;
    }
    updateData.phone = cleanPhone;
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

module.exports = {
  login,
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
