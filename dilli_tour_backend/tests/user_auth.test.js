const http = require('http');
const app = require('../src/app');
const prisma = require('../src/config/database');

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

async function runUserAuthTests() {
  console.log('🧪 Starting User SMS OTP & Email/Password Authentication Tests...\n');

  try {
    server = app.listen(0);
    port = server.address().port;

    // 1. Send OTP to test number 9999999999
    console.log('--- 1. Test Fixed OTP for 9999999999 ---');
    const resOtp1 = await request('POST', '/api/v1/auth/user/send-otp', {
      phone: '9999999999',
    });
    assert(resOtp1.status === 200, 'POST /api/v1/auth/user/send-otp returns 200');
    assert(resOtp1.data.data.otp === '123456', 'Fixed OTP for 9999999999 is 123456');
    assert(resOtp1.data.data.phone === '9999999999', 'Returns cleaned 10-digit phone number');

    // 2. Send OTP to test number 8888888888
    console.log('\n--- 2. Test Fixed OTP for 8888888888 ---');
    const resOtp2 = await request('POST', '/api/v1/auth/user/send-otp', {
      phone: '+91 88888 88888',
    });
    assert(resOtp2.status === 200, 'POST /api/v1/auth/user/send-otp cleans format and returns 200');
    assert(resOtp2.data.data.otp === '123456', 'Fixed OTP for 8888888888 is 123456');

    // 3. Send OTP to any other regular number
    console.log('\n--- 3. Test Dynamic OTP for Regular Number ---');
    const dynamicPhone = '9811223344';
    const resOtp3 = await request('POST', '/api/v1/auth/user/send-otp', {
      phone: dynamicPhone,
    });
    assert(resOtp3.status === 200, 'Dynamic OTP generated successfully');
    assert(typeof resOtp3.data.data.otp === 'string' && resOtp3.data.data.otp.length === 6, 'Dynamic OTP is 6 digits');
    assert(resOtp3.data.data.otp !== '123456', 'Dynamic OTP is randomly generated');
    const regularOtp = resOtp3.data.data.otp;

    // 4. Verify OTP for test number 9999999999 (Auto registration)
    console.log('\n--- 4. Verify OTP & Auto-Register User ---');
    const resVerify = await request('POST', '/api/v1/auth/user/verify-otp', {
      phone: '9999999999',
      otp: '123456',
      name: 'Rajesh Kumar',
    });
    assert(resVerify.status === 200, 'POST /api/v1/auth/user/verify-otp succeeds');
    assert(typeof resVerify.data.data.token === 'string', 'JWT token generated on OTP login');
    assert(resVerify.data.data.user.phone === '9999999999', 'User phone matches');
    assert(resVerify.data.data.user.isPhoneVerified === true, 'isPhoneVerified marked true');
    const userToken = resVerify.data.data.token;

    // 5. Test Invalid OTP rejection
    console.log('\n--- 5. Verify Invalid OTP Rejection ---');
    const resInvalidOtp = await request('POST', '/api/v1/auth/user/verify-otp', {
      phone: dynamicPhone,
      otp: '000000',
    });
    assert(resInvalidOtp.status === 400, 'Invalid OTP correctly rejected with 400');

    // 6. Verify with Correct Dynamic OTP
    console.log('\n--- 6. Verify Dynamic OTP for Regular User ---');
    const resVerifyDyn = await request('POST', '/api/v1/auth/user/verify-otp', {
      phone: dynamicPhone,
      otp: regularOtp,
      name: 'Pooja Verma',
    });
    assert(resVerifyDyn.status === 200, 'Dynamic OTP verification succeeds');
    assert(resVerifyDyn.data.data.user.phone === dynamicPhone, 'User record created with dynamic phone');

    // 7. Email & Password Registration
    console.log('\n--- 7. Email & Password User Registration ---');
    const uniqueEmail = `tourist.${Date.now()}@example.com`;
    const uniquePhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    const resRegister = await request('POST', '/api/v1/auth/user/register', {
      name: 'Amitabh Sen',
      email: uniqueEmail,
      password: 'TouristPassword@123',
      phone: uniquePhone,
    });
    assert(resRegister.status === 201, 'POST /api/v1/auth/user/register creates account with 201');
    assert(typeof resRegister.data.data.token === 'string', 'Returns JWT token');
    assert(resRegister.data.data.user.email === uniqueEmail, 'Email matches registered email');

    // 8. Email & Password Login
    console.log('\n--- 8. Email & Password Login ---');
    const resLogin = await request('POST', '/api/v1/auth/user/login', {
      email: uniqueEmail,
      password: 'TouristPassword@123',
    });
    assert(resLogin.status === 200, 'POST /api/v1/auth/user/login succeeds with 200');
    assert(typeof resLogin.data.data.token === 'string', 'Returns new JWT token');

    // Invalid password rejection
    const resBadLogin = await request('POST', '/api/v1/auth/user/login', {
      email: uniqueEmail,
      password: 'WrongPassword',
    });
    assert(resBadLogin.status === 401, 'Wrong password rejected with 401');

    // 9. Profile & Me Endpoint (GET /api/v1/auth/user/me)
    console.log('\n--- 9. Get User Profile (/api/v1/auth/user/me) ---');
    const resMe = await request('GET', '/api/v1/auth/user/me', null, {
      Authorization: `Bearer ${userToken}`,
    });
    assert(resMe.status === 200, 'GET /api/v1/auth/user/me returns 200');
    assert(resMe.data.data.phone === '9999999999', 'Returns correct authenticated user profile');
    assert(Array.isArray(resMe.data.data.bookings), 'Profile includes bookings list');

    // 10. Profile Update (PUT /api/v1/auth/user/profile)
    console.log('\n--- 10. Update User Profile ---');
    const resUpdate = await request(
      'PUT',
      '/api/v1/auth/user/profile',
      { name: 'Rajesh Kumar Updated' },
      { Authorization: `Bearer ${userToken}` }
    );
    assert(resUpdate.status === 200, 'PUT /api/v1/auth/user/profile returns 200');
    assert(resUpdate.data.data.name === 'Rajesh Kumar Updated', 'Profile name updated successfully');

    // 11. Existing Admin Login Still Works
    console.log('\n--- 11. Existing Admin Authentication Verification ---');
    const resAdminLogin = await request('POST', '/api/v1/auth/login', {
      email: 'admin@delhitourism.dev',
      password: 'Admin@123',
    });
    assert(resAdminLogin.status === 200, 'Admin login still works smoothly with 200');
    assert(resAdminLogin.data.data.admin.role === 'SUPER_ADMIN', 'Admin role preserved');

    console.log('\n🎉 ALL USER AUTH & SMS OTP TESTS PASSED! 🎉\n');
  } catch (err) {
    console.error('❌ User auth test failed:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
    await prisma.$disconnect();
  }
}

runUserAuthTests();
