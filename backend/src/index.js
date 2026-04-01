const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database
const { pool } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const motorcycleRoutes = require('./routes/motorcycles');
const transactionRoutes = require('./routes/transactions');
const nfcRoutes = require('./routes/nfc');
const promotionRoutes = require('./routes/promotions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚗 MARKIR E-Parking API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      motorcycles: '/api/motorcycles',
      transactions: '/api/transactions',
      nfc: '/api/nfc',
      promotions: '/api/promotions',
    },
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/motorcycles', motorcycleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/nfc', nfcRoutes);
app.use('/api/promotions', promotionRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW(), current_database(), current_user');
    console.log('✅ Connected to PostgreSQL database:', result.rows[0].current_database);
    console.log('   User:', result.rows[0].current_user);
    client.release();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`
  ╔═══════════════════════════════════════════════╗
  ║   🚗 MARKIR E-Parking API Server             ║
  ║   📡 Running on: http://localhost:${PORT}     ║
  ║   🌍 Environment: ${process.env.NODE_ENV || 'development'}              ║
  ╚═══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    console.error('   Make sure PostgreSQL is running and credentials are correct');
    process.exit(1);
  }
};

startServer();

module.exports = app;
