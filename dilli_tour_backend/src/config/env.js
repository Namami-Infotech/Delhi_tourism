const dotenv = require('dotenv');
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  FAST2SMS_API_KEY: process.env.FAST2SMS_API_KEY || '',
  FAST2SMS_SENDER_ID: process.env.FAST2SMS_SENDER_ID || 'NAMINF',
  FAST2SMS_DLT_TEMPLATE_ID: process.env.FAST2SMS_DLT_TEMPLATE_ID || '205150',
  FAST2SMS_COMPANY_NAME: process.env.FAST2SMS_COMPANY_NAME || 'DROP',
};

// Validate required environment variables
const required = ['DATABASE_URL', 'JWT_SECRET'];
required.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = env;
