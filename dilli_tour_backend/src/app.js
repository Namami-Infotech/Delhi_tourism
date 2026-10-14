const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const errorMiddleware = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const circuitRoutes = require('./routes/circuit.routes');
const placeRoutes = require('./routes/place.routes');
const itineraryRoutes = require('./routes/itinerary.routes');
const eventRoutes = require('./routes/event.routes');
const galleryRoutes = require('./routes/gallery.routes');
const searchRoutes = require('./routes/search.routes');
const adminRoutes = require('./routes/admin.routes');
const bannerRoutes = require('./routes/banner.routes');
const homeRoutes = require('./routes/home.routes');

const app = express();

const path = require('path');

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Delhi Tourism API is running.' });
});

// API routes
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/circuits', circuitRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/itineraries', itineraryRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/galleries', galleryRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/home', homeRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;
