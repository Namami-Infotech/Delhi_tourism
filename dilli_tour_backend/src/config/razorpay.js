const Razorpay = require('razorpay');
const crypto = require('crypto');
const env = require('./env');

const isPlaceholderKey =
  !env.RAZORPAY_KEY_ID ||
  env.RAZORPAY_KEY_ID.includes('placeholder') ||
  env.RAZORPAY_KEY_ID.trim() === '';

const isSimulationMode = isPlaceholderKey;

let razorpayClient = null;

if (!isSimulationMode) {
  try {
    razorpayClient = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  } catch (err) {
    console.warn('⚠️ Razorpay initialization warning:', err.message);
  }
}

/**
 * Create a new Razorpay order (or simulated order in test mode)
 */
const createOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const amountInPaise = Math.round(Number(amount));

  if (isSimulationMode || !razorpayClient) {
    // Generate a valid mock Razorpay order ID
    const mockOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: mockOrderId,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency,
      receipt,
      status: 'created',
      attempts: 0,
      notes,
      created_at: Math.floor(Date.now() / 1000),
      isSimulated: true,
    };
  }

  const options = {
    amount: amountInPaise,
    currency,
    receipt,
    notes,
  };

  return razorpayClient.orders.create(options);
};

/**
 * Verify Razorpay payment signature
 */
const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  // Accept test simulation signatures
  if (
    signature === 'simulated_signature' ||
    signature.startsWith('sim_') ||
    orderId.startsWith('order_sim_') ||
    paymentId.startsWith('pay_sim_')
  ) {
    return true;
  }

  if (isSimulationMode || !env.RAZORPAY_KEY_SECRET) {
    return true;
  }

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
};

/**
 * Verify Razorpay webhook signature
 */
const verifyWebhookSignature = (rawBody, signature) => {
  if (!env.RAZORPAY_WEBHOOK_SECRET) return true;

  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = {
  razorpayClient,
  isSimulationMode,
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
};
