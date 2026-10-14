/**
 * Comprehensive API Test Runner for Delhi Tourism Backend
 * Tests all endpoints: Auth, Categories, Circuits, Places, Itineraries, Events, Galleries, Search, Admin Stats & Users.
 */

const http = require('http');
const app = require('../src/app');

let server;
let baseUrl;
let authToken;

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✅ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  };

  const request = async (method, path, body = null, headers = {}) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${baseUrl}${path}`, options);
    let data = null;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: res.status, data };
  };

  console.log('\n==============================');
  console.log('🚀 RUNNING DELHI TOURISM API TESTS');
  console.log('==============================\n');

  // 1. Health check
  console.log('--- 1. Health Check ---');
  {
    const res = await request('GET', '/api/health');
    assert(res.status === 200 && res.data.success === true, 'GET /api/health returns 200 OK');
  }

  // 2. Categories
  console.log('\n--- 2. Categories API ---');
  {
    const resAll = await request('GET', '/api/v1/categories');
    assert(resAll.status === 200 && resAll.data.success === true, 'GET /api/v1/categories returns 200');
    assert(Array.isArray(resAll.data.data) && resAll.data.data.length >= 12, 'Categories list contains all 12 categories');

    const resSingle = await request('GET', '/api/v1/categories/spiritual-circuits');
    assert(resSingle.status === 200 && resSingle.data.data.name === 'Spiritual Circuits', 'GET /api/v1/categories/:slug returns category details');

    const res404 = await request('GET', '/api/v1/categories/nonexistent-category');
    assert(res404.status === 404 && res404.data.success === false, 'GET /api/v1/categories/:slug 404 for invalid category');
  }

  // 3. Circuits
  console.log('\n--- 3. Circuits API ---');
  {
    const resAll = await request('GET', '/api/v1/circuits');
    assert(resAll.status === 200 && resAll.data.success === true, 'GET /api/v1/circuits returns 200');
    assert(Array.isArray(resAll.data.data) && resAll.data.data.length >= 4, 'Circuits list contains initial circuits');

    const resSingle = await request('GET', '/api/v1/circuits/echoes-of-delhi');
    assert(resSingle.status === 200 && resSingle.data.data.name === 'Echoes of Delhi', 'GET /api/v1/circuits/:slug returns circuit details');
    assert(Array.isArray(resSingle.data.data.places), 'Circuit includes associated places');

    const res404 = await request('GET', '/api/v1/circuits/nonexistent-circuit');
    assert(res404.status === 404 && res404.data.success === false, 'GET /api/v1/circuits/:slug 404 for invalid circuit');
  }

  // 4. Places
  console.log('\n--- 4. Places API ---');
  {
    const resAll = await request('GET', '/api/v1/places');
    assert(resAll.status === 200 && resAll.data.success === true, 'GET /api/v1/places returns 200');
    assert(Array.isArray(resAll.data.data) && resAll.data.data.length >= 8, 'Places list contains seeded places');

    const resFeatured = await request('GET', '/api/v1/places?featured=true');
    assert(resFeatured.status === 200 && resFeatured.data.data.length > 0, 'GET /api/v1/places?featured=true filters featured places');

    const resSingle = await request('GET', '/api/v1/places/red-fort');
    assert(resSingle.status === 200 && resSingle.data.data.name === 'Red Fort', 'GET /api/v1/places/:slug returns place details');
    assert(Array.isArray(resSingle.data.data.features) && resSingle.data.data.features.length > 0, 'Place includes features array');

    const res404 = await request('GET', '/api/v1/places/nonexistent-place');
    assert(res404.status === 404 && res404.data.success === false, 'GET /api/v1/places/:slug 404 for invalid place');
  }

  // 5. Itineraries
  console.log('\n--- 5. Itineraries API ---');
  {
    const resAll = await request('GET', '/api/v1/itineraries');
    assert(resAll.status === 200 && resAll.data.success === true, 'GET /api/v1/itineraries returns 200');

    const resSingle = await request('GET', '/api/v1/itineraries/classic-delhi-2-days');
    assert(resSingle.status === 200 && resSingle.data.data.stops.length > 0, 'GET /api/v1/itineraries/:slug returns itinerary with stops');

    const res404 = await request('GET', '/api/v1/itineraries/nonexistent');
    assert(res404.status === 404, 'GET /api/v1/itineraries/:slug 404 for invalid itinerary');
  }

  // 6. Events
  console.log('\n--- 6. Events API ---');
  {
    const resAll = await request('GET', '/api/v1/events');
    assert(resAll.status === 200 && resAll.data.success === true, 'GET /api/v1/events returns 200');

    const resSingle = await request('GET', '/api/v1/events/delhi-international-arts-festival-2026');
    assert(resSingle.status === 200 && resSingle.data.data.title.includes('Delhi International'), 'GET /api/v1/events/:slug returns event details');

    const res404 = await request('GET', '/api/v1/events/nonexistent');
    assert(res404.status === 404, 'GET /api/v1/events/:slug 404 for invalid event');
  }

  // 7. Search
  console.log('\n--- 7. Search API ---');
  {
    const res = await request('GET', '/api/v1/search?q=fort');
    assert(res.status === 200 && res.data.success === true, 'GET /api/v1/search?q=fort returns 200');
    assert(res.data.data.places && res.data.data.places.length > 0, 'Search returns matching places');
    assert(res.data.data.circuits !== undefined, 'Search response categorized with circuits');
  }

  // 8. Home API (Banners + Categories)
  console.log('\n--- 8. Home API ---');
  {
    const resHome = await request('GET', '/api/v1/home');
    assert(resHome.status === 200 && resHome.data.success === true, 'GET /api/v1/home returns 200 OK');
    assert(Array.isArray(resHome.data.data.banners) && resHome.data.data.banners.length >= 3, 'Home API returns multiple banners');
    assert(Array.isArray(resHome.data.data.categories) && resHome.data.data.categories.length >= 12, 'Home API returns categories');
  }

  // 9. Banners API
  console.log('\n--- 9. Banners API ---');
  {
    const resBanners = await request('GET', '/api/v1/banners');
    assert(resBanners.status === 200 && resBanners.data.success === true, 'GET /api/v1/banners returns 200 OK');
    assert(Array.isArray(resBanners.data.data) && resBanners.data.data.length >= 3, 'Banners list contains multiple banners');
  }

  // 10. Authentication & Authorization
  console.log('\n--- 10. Authentication & Authorization ---');
  {
    // Invalid credentials
    const resBadLogin = await request('POST', '/api/v1/auth/login', {
      email: 'admin@delhitourism.dev',
      password: 'WrongPassword',
    });
    assert(resBadLogin.status === 401 && resBadLogin.data.success === false, 'POST /api/v1/auth/login fails with invalid credentials');

    // Validation error
    const resValFail = await request('POST', '/api/v1/auth/login', {
      email: 'not-an-email',
      password: '',
    });
    assert(resValFail.status === 422 && resValFail.data.success === false, 'POST /api/v1/auth/login returns 422 for malformed body');

    // Valid login
    const resLogin = await request('POST', '/api/v1/auth/login', {
      email: 'admin@delhitourism.dev',
      password: 'Admin@123',
    });
    assert(resLogin.status === 200 && resLogin.data.success === true && !!resLogin.data.data.token, 'POST /api/v1/auth/login returns JWT token');
    authToken = resLogin.data.data.token;

    // Me without token
    const resMeUnauthorized = await request('GET', '/api/v1/auth/me');
    assert(resMeUnauthorized.status === 401, 'GET /api/v1/auth/me returns 401 without Bearer token');

    // Me with token
    const resMe = await request('GET', '/api/v1/auth/me', null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resMe.status === 200 && resMe.data.data.email === 'admin@delhitourism.dev', 'GET /api/v1/auth/me returns admin identity');

    // Logout
    const resLogout = await request('POST', '/api/v1/auth/logout', null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resLogout.status === 200 && resLogout.data.success === true, 'POST /api/v1/auth/logout returns 200');
  }

  // 9. Admin Dashboard & Admin User CRUD
  console.log('\n--- 9. Admin Dashboard & Users API ---');
  {
    const resStats = await request('GET', '/api/v1/admin/stats', null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resStats.status === 200 && resStats.data.data.totalCategories >= 12, 'GET /api/v1/admin/stats returns correct category count');
    assert(resStats.data.data.totalPlaces >= 8, 'Admin stats returns place count');
    assert(Array.isArray(resStats.data.data.recentPlaces), 'Admin stats returns recentPlaces');

    // Create a new admin user with unique email
    const uniqueEmail = `test.editor.${Date.now()}@delhitourism.dev`;
    const resCreateAdmin = await request('POST', '/api/v1/admin/users', {
      name: 'Test Editor',
      email: uniqueEmail,
      password: 'EditorPassword123',
      role: 'EDITOR',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreateAdmin.status === 201 && resCreateAdmin.data.data.role === 'EDITOR', 'POST /api/v1/admin/users creates editor account');
    const createdAdminId = resCreateAdmin.data.data.id;

    // Get all admin users
    const resAllUsers = await request('GET', '/api/v1/admin/users', null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resAllUsers.status === 200 && resAllUsers.data.count >= 2, 'GET /api/v1/admin/users returns user list');

    // Update admin user
    const resUpdateUser = await request('PUT', `/api/v1/admin/users/${createdAdminId}`, {
      name: 'Updated Editor Name',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resUpdateUser.status === 200 && resUpdateUser.data.data.name === 'Updated Editor Name', 'PUT /api/v1/admin/users/:id updates admin user');

    // Deactivate admin user
    const resDeactivate = await request('DELETE', `/api/v1/admin/users/${createdAdminId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeactivate.status === 200 && resDeactivate.data.success === true, 'DELETE /api/v1/admin/users/:id deactivates admin');
  }

  // 10. Admin CRUD for Content Entities
  console.log('\n--- 10. Content CRUD Operations ---');
  {
    const ts = Date.now();
    // Category CRUD
    const resCatVal = await request('POST', '/api/v1/categories', { name: '' }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCatVal.status === 422, 'POST /api/v1/categories validates input with 422');

    const resCreateCat = await request('POST', '/api/v1/categories', {
      name: `Temporary Category ${ts}`,
      shortDescription: 'For test suite',
      displayOrder: 99,
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreateCat.status === 201 && !!resCreateCat.data.data.slug, 'POST /api/v1/categories creates new category');
    const tempCatId = resCreateCat.data.data.id;

    const resUpdateCat = await request('PUT', `/api/v1/categories/${tempCatId}`, {
      shortDescription: 'Updated test description',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resUpdateCat.status === 200 && resUpdateCat.data.data.shortDescription === 'Updated test description', 'PUT /api/v1/categories/:id updates category');

    const resDeleteCat = await request('DELETE', `/api/v1/categories/${tempCatId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeleteCat.status === 200 && resDeleteCat.data.success === true, 'DELETE /api/v1/categories/:id soft deletes category');

    // Place CRUD
    const resCreatePlace = await request('POST', '/api/v1/places', {
      name: `Agrasen Ki Baoli Test ${ts}`,
      shortDescription: 'Historical stepwell',
      locality: 'Connaught Place',
      latitude: 28.6258,
      longitude: 77.2250,
      features: ['Historical', 'Photography'],
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreatePlace.status === 201 && !!resCreatePlace.data.data.slug, 'POST /api/v1/places creates new place');
    const tempPlaceId = resCreatePlace.data.data.id;

    const resUpdatePlace = await request('PUT', `/api/v1/places/${tempPlaceId}`, {
      shortDescription: 'Updated stepwell description',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resUpdatePlace.status === 200 && resUpdatePlace.data.data.shortDescription === 'Updated stepwell description', 'PUT /api/v1/places/:id updates place');

    // Circuit CRUD
    const resCreateCircuit = await request('POST', '/api/v1/circuits', {
      name: `Heritage Baolis Test Circuit ${ts}`,
      categoryId: 2,
      tagline: 'Water structures of old Delhi',
      shortDescription: 'Historic water architecture',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreateCircuit.status === 201 && !!resCreateCircuit.data.data.slug, 'POST /api/v1/circuits creates new circuit');
    const tempCircuitId = resCreateCircuit.data.data.id;

    const resDeleteCircuit = await request('DELETE', `/api/v1/circuits/${tempCircuitId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeleteCircuit.status === 200 && resDeleteCircuit.data.success === true, 'DELETE /api/v1/circuits/:id deactivates circuit');

    // Itinerary CRUD
    const resCreateItinerary = await request('POST', '/api/v1/itineraries', {
      title: `Delhi Heritage Walking Tour Test ${ts}`,
      description: 'A 1-day walking tour',
      duration: '1 Day',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreateItinerary.status === 201 && !!resCreateItinerary.data.data.slug, 'POST /api/v1/itineraries creates itinerary');
    const tempItineraryId = resCreateItinerary.data.data.id;

    const resDeleteItinerary = await request('DELETE', `/api/v1/itineraries/${tempItineraryId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeleteItinerary.status === 200 && resDeleteItinerary.data.success === true, 'DELETE /api/v1/itineraries/:id deactivates itinerary');

    // Event CRUD
    const resCreateEvent = await request('POST', '/api/v1/events', {
      title: `Delhi Winter Street Carnival Test ${ts}`,
      startDate: new Date().toISOString(),
      venue: 'India Gate Lawns',
      category: 'Festival',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreateEvent.status === 201 && !!resCreateEvent.data.data.slug, 'POST /api/v1/events creates event');
    const tempEventId = resCreateEvent.data.data.id;

    const resDeleteEvent = await request('DELETE', `/api/v1/events/${tempEventId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeleteEvent.status === 200 && resDeleteEvent.data.success === true, 'DELETE /api/v1/events/:id deactivates event');

    // Gallery CRUD
    const resCreateGallery = await request('POST', '/api/v1/galleries', {
      entityType: 'place',
      entityId: tempPlaceId,
      imageUrl: 'https://images.unsplash.com/photo-stepwell',
      title: 'Baoli architecture',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreateGallery.status === 201 && resCreateGallery.data.data.title === 'Baoli architecture', 'POST /api/v1/galleries creates gallery photo');
    const tempGalleryId = resCreateGallery.data.data.id;

    const resDeleteGallery = await request('DELETE', `/api/v1/galleries/${tempGalleryId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeleteGallery.status === 200 && resDeleteGallery.data.success === true, 'DELETE /api/v1/galleries/:id removes gallery image');

    // Banner CRUD
    const resCreateBanner = await request('POST', '/api/v1/banners', {
      title: `Special Delhi Tour Banner ${ts}`,
      subtitle: 'Exclusive heritage festival special',
      imageUrl: 'https://images.unsplash.com/photo-heritage-banner',
      linkUrl: '/circuits/heritage-delhi',
      displayOrder: 99,
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resCreateBanner.status === 201 && resCreateBanner.data.data.title.includes('Special Delhi Tour Banner'), 'POST /api/v1/banners creates banner');
    const tempBannerId = resCreateBanner.data.data.id;

    const resUpdateBanner = await request('PUT', `/api/v1/banners/${tempBannerId}`, {
      subtitle: 'Updated banner subtitle',
    }, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resUpdateBanner.status === 200 && resUpdateBanner.data.data.subtitle === 'Updated banner subtitle', 'PUT /api/v1/banners/:id updates banner');

    const resDeleteBanner = await request('DELETE', `/api/v1/banners/${tempBannerId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeleteBanner.status === 200 && resDeleteBanner.data.success === true, 'DELETE /api/v1/banners/:id deactivates banner');

    // Delete place
    const resDeletePlace = await request('DELETE', `/api/v1/places/${tempPlaceId}`, null, {
      Authorization: `Bearer ${authToken}`,
    });
    assert(resDeletePlace.status === 200 && resDeletePlace.data.success === true, 'DELETE /api/v1/places/:id soft deletes place');
  }

  console.log('\n==============================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================\n');

  return failed === 0;
};

// Start server on ephemeral port and run tests
const port = 5099;
server = http.createServer(app);
server.listen(port, async () => {
  baseUrl = `http://localhost:${port}`;
  try {
    const success = await runTests();
    server.close(() => {
      process.exit(success ? 0 : 1);
    });
  } catch (err) {
    console.error('Test execution error:', err);
    server.close(() => {
      process.exit(1);
    });
  }
});
