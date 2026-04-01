// Simple test server to debug issues
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool } = require('./src/config/database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  console.log('✅ GET / - Health check');
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Test database
app.get('/test-db', async (req, res) => {
  try {
    console.log('📊 Testing database connection...');
    const result = await pool.query('SELECT NOW(), current_database()');
    console.log('✅ Database query successful');
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Database error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Test users endpoint
app.get('/api/users', async (req, res) => {
  try {
    console.log('👥 GET /api/users');
    const result = await pool.query('SELECT * FROM users LIMIT 5');
    console.log(`✅ Found ${result.rows.length} users`);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
const startServer = async () => {
  try {
    // Test database
    const client = await pool.connect();
    const result = await client.query('SELECT current_database(), current_user');
    console.log('✅ Database:', result.rows[0].current_database);
    console.log('✅ User:', result.rows[0].current_user);
    client.release();

    // Start Express
    app.listen(PORT, () => {
      console.log(`\n🚀 Test server running on http://localhost:${PORT}\n`);
      console.log('Test endpoints:');
      console.log('  GET /');
      console.log('  GET /test-db');
      console.log('  GET /api/users');
    });
  } catch (error) {
    console.error('❌ Startup error:', error.message);
    process.exit(1);
  }
};

startServer();
