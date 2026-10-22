const env = require('./env');

/**
 * Send SMS using Fast2SMS DLT bulkV2 API
 *
 * @param {string} phone - 10-digit mobile number
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<{ success: boolean, requestId?: string, error?: string }>}
 */
const sendFast2SmsOtp = async (phone, otp) => {
  // If no API key configured or test numbers, skip actual gateway call
  if (!env.FAST2SMS_API_KEY || phone === '9999999999' || phone === '8888888888') {
    return {
      success: true,
      simulated: true,
      message: `SMS simulated for ${phone}`,
    };
  }

  try {
    const payload = {
      route: 'dlt',
      sender_id: env.FAST2SMS_SENDER_ID || 'NAMINF',
      message: env.FAST2SMS_DLT_TEMPLATE_ID || '205150',
      variables_values: `${otp}|${env.FAST2SMS_COMPANY_NAME || 'DROP'}`,
      flash: 0,
      numbers: phone,
    };

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: env.FAST2SMS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data && data.return === true) {
      return {
        success: true,
        requestId: data.request_id,
        message: data.message ? data.message[0] : 'SMS sent successfully.',
      };
    } else {
      console.warn('⚠️ Fast2SMS API response error:', data);
      return {
        success: false,
        error: data.message ? (Array.isArray(data.message) ? data.message[0] : data.message) : 'Failed to send SMS.',
      };
    }
  } catch (err) {
    console.error('❌ Fast2SMS network error:', err.message);
    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports = {
  sendFast2SmsOtp,
};
