const http = require('http');
const { PrismaClient } = require('@prisma/client');
const app = require('../src/app');
const authService = require('../src/services/auth.service');
const bookingService = require('../src/services/booking.service');

const prisma = new PrismaClient();
let server;
let port;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const reqHeaders = { ...headers };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = http.request(
      {
        hostname: 'localhost',
        port,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✅ ${message}`);
}

async function runTests() {
  console.log('🧪 Starting Ticket Booking & Razorpay Flow Tests (Token Required Verification)...');

  try {
    server = app.listen(0);
    port = server.address().port;

    // 1. Find a place with entry fee
    const paidPlace = await prisma.place.findFirst({
      where: { entryFeeIndian: { gt: 0 } },
    });

    if (!paidPlace) {
      throw new Error('No place with entry fee found for testing.');
    }

    console.log(`📍 Testing with Place: "${paidPlace.name}" (Fee: ₹${paidPlace.entryFeeIndian})`);

    const bookingPayload = {
      placeId: paidPlace.id,
      visitDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot: 'Morning (09:00 - 12:00)',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@example.com',
      customerPhone: '9999999999',
      indianAdults: 2,
    };

    // 2. Test Unauthenticated Request (Must Fail with 401)
    console.log('\n--- 1. Testing Without Token (Must be Rejected) ---');
    const resNoToken = await request('POST', '/api/v1/bookings/initiate', bookingPayload);
    assert(resNoToken.status === 401, 'POST /api/v1/bookings/initiate without token returns 401');

    // 3. Log In Test User via OTP to get valid token
    console.log('\n--- 2. Log in User via OTP to get Token ---');
    const loginResult = await authService.verifyOtp({
      phone: '9999999999',
      otp: '123456',
      name: 'Rahul Sharma',
    });
    const userToken = loginResult.token;
    assert(typeof userToken === 'string', 'User token received successfully');

    // 4. Test Authenticated Booking Initiation
    console.log('\n--- 3. Testing With Valid Token ---');
    const resWithToken = await request(
      'POST',
      '/api/v1/bookings/initiate',
      bookingPayload,
      { Authorization: `Bearer ${userToken}` }
    );
    assert(resWithToken.status === 201, 'POST /api/v1/bookings/initiate with token succeeds with 201');
    assert(typeof resWithToken.data.data.razorpayOrderId === 'string', 'Razorpay Order ID created');
    const bookingId = resWithToken.data.data.booking.id;

    // 5. Test Payment Simulation (Requires Token)
    console.log('\n--- 4. Testing Payment Simulation with Token ---');
    const resSimulate = await request(
      'POST',
      '/api/v1/bookings/simulate-payment',
      { bookingId },
      { Authorization: `Bearer ${userToken}` }
    );
    assert(resSimulate.status === 200, 'POST /api/v1/bookings/simulate-payment returns 200');
    assert(resSimulate.data.data.bookingStatus === 'CONFIRMED', 'Booking confirmed after payment');

    // 6. Test User's Own Bookings List
    console.log('\n--- 5. Testing GET /api/v1/bookings/user/my-bookings ---');
    const resMyBookings = await request(
      'GET',
      '/api/v1/bookings/user/my-bookings',
      null,
      { Authorization: `Bearer ${userToken}` }
    );
    assert(resMyBookings.status === 200, 'GET /api/v1/bookings/user/my-bookings returns 200');
    assert(resMyBookings.data.count >= 1, 'My bookings list contains user booking');

    // 7. Test Gate Pass Verification (Public for Gate Staff / Scanner)
    console.log('\n--- 6. Testing Gate Pass Verification ---');
    const passCode = resWithToken.data.data.booking.ticketPassCode;
    const resPass = await request('GET', `/api/v1/bookings/verify-pass/${passCode}`);
    assert(resPass.status === 200 && resPass.data.data.valid === true, 'Gate pass verification succeeds');

    console.log('\n🎉 ALL TOKEN-PROTECTED BOOKING TESTS PASSED! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }
}

runTests();
