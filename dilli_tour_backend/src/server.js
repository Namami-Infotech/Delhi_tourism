const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/database');

const start = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log('✅ Database connected successfully.');

    app.listen(env.PORT, '0.0.0.0', () => {
      // eslint-disable-next-line no-console
      console.log(
        `🚀 Delhi Tourism API running on port ${env.PORT} [${env.NODE_ENV}]`,
      );
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  // eslint-disable-next-line no-console
  console.log('Server shut down gracefully.');
  process.exit(0);
});

start();
