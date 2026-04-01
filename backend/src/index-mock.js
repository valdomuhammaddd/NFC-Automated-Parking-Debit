/**
 * MARKIR Backend - Mock Mode (Without PostgreSQL)
 * For testing API structure without database
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// MOCK DATA (In-Memory Database)
// =====================================================
const mockUsers = [
  {
    user_id: 1,
    role_id: 1,
    email: 'admin@markir.com',
    password_hash: 'admin123', // In real, this would be bcrypt hash
    name: 'Admin MARKIR',
    phone: '081234567890',
    saldo_ewallet: 1000000,
    membership_status: 'Platinum',
    is_active: true,
    role_name: 'admin',
  },
  {
    user_id: 3,
    role_id: 2,
    email: 'valdo@markir.com',
    password_hash: 'valdo123',
    name: 'Valdo Rinaldi',
    phone: '081234567892',
    saldo_ewallet: 500000,
    membership_status: 'Gold',
    is_active: true,
    role_name: 'user',
  },
];

const mockMotorcycles = [
  {
    motorcycle_id: 1,
    user_id: 3,
    plat_nomor: 'B1234ABC',
    nfc_uid: 'NFC-UID-001',
    jenis_kendaraan: 'Motor',
    merk: 'Honda Vario',
    warna: 'Merah',
    is_active: true,
  },
  {
    motorcycle_id: 2,
    user_id: 3,
    plat_nomor: 'B5678DEF',
    nfc_uid: 'NFC-UID-002',
    jenis_kendaraan: 'Motor',
    merk: 'Yamaha Mio',
    warna: 'Hitam',
    is_active: true,
  },
];

const mockTransactions = [];

const mockPromotions = [
  {
    promotion_id: 1,
    title: 'Diskon Member Baru',
    description: 'Dapatkan diskon 50% untuk transaksi pertama!',
    code: 'FIRST50',
    discount_type: 'percentage',
    discount_value: 50,
    valid_until: '2025-12-31T23:59:59Z',
    is_active: true,
  },
  {
    promotion_id: 2,
    title: 'Top Up Bonus 10%',
    description: 'Top up minimal 100rb dapat bonus 10%',
    code: 'TOPUP10',
    discount_type: 'percentage',
    discount_value: 10,
    valid_until: '2025-12-31T23:59:59Z',
    is_active: true,
  },
];

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚗 MARKIR E-Parking API is running! (MOCK MODE)',
    version: '1.0.0-mock',
    mode: 'MOCK (No PostgreSQL)',
    endpoints: {
      auth: '/api/auth/login',
      nfc: '/api/nfc/scan, /api/nfc/register',
      transactions: '/api/transactions',
      users: '/api/users',
      promotions: '/api/promotions',
    },
  });
});

// =====================================================
// AUTH ENDPOINTS
// =====================================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('📧 Login attempt:', email);
  
  const user = mockUsers.find(u => u.email === email && u.password_hash === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email atau password salah',
    });
  }
  
  const token = `mock_jwt_token_${user.user_id}_${Date.now()}`;
  
  res.json({
    success: true,
    message: 'Login berhasil',
    data: {
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role_name,
        saldo_ewallet: user.saldo_ewallet,
        membership_status: user.membership_status,
      },
    },
  });
});

// =====================================================
// NFC SCAN (KUNCI KRITIS)
// =====================================================
app.post('/api/nfc/scan', (req, res) => {
  const { nfc_uid } = req.body;
  
  console.log('📡 NFC Scan:', nfc_uid);
  
  const vehicle = mockMotorcycles.find(m => m.nfc_uid === nfc_uid);
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'NFC Tag tidak terdaftar atau tidak aktif',
      nfc_uid,
    });
  }
  
  const owner = mockUsers.find(u => u.user_id === vehicle.user_id);
  
  res.json({
    success: true,
    message: 'Data kendaraan berhasil ditemukan',
    data: {
      vehicle: {
        motorcycle_id: vehicle.motorcycle_id,
        plat_nomor: vehicle.plat_nomor,
        nfc_uid: vehicle.nfc_uid,
        jenis_kendaraan: vehicle.jenis_kendaraan,
        merk: vehicle.merk,
        warna: vehicle.warna,
      },
      owner: {
        user_id: owner.user_id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        saldo_ewallet: owner.saldo_ewallet,
        membership_status: owner.membership_status,
      },
      last_transaction: mockTransactions.length > 0 ? mockTransactions[0] : null,
    },
  });
});

// =====================================================
// NFC REGISTER
// =====================================================
app.post('/api/nfc/register', (req, res) => {
  const { user_id, plat_nomor, nfc_uid, jenis_kendaraan, merk, warna } = req.body;
  
  console.log('✍️ NFC Register:', { plat_nomor, nfc_uid });
  
  // Check duplicates
  if (mockMotorcycles.find(m => m.nfc_uid === nfc_uid)) {
    return res.status(409).json({
      success: false,
      message: 'NFC UID sudah terdaftar',
    });
  }
  
  const newVehicle = {
    motorcycle_id: mockMotorcycles.length + 1,
    user_id,
    plat_nomor,
    nfc_uid,
    jenis_kendaraan,
    merk,
    warna,
    is_active: true,
  };
  
  mockMotorcycles.push(newVehicle);
  
  res.status(201).json({
    success: true,
    message: 'Kendaraan berhasil didaftarkan dengan NFC Tag',
    data: newVehicle,
  });
});

// =====================================================
// CREATE TRANSACTION
// =====================================================
app.post('/api/transactions', (req, res) => {
  const { nfc_uid, petugas_id, amount_charged, location, notes } = req.body;
  
  console.log('💳 Create Transaction:', { nfc_uid, amount_charged });
  
  const vehicle = mockMotorcycles.find(m => m.nfc_uid === nfc_uid);
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Kendaraan tidak ditemukan',
    });
  }
  
  const owner = mockUsers.find(u => u.user_id === vehicle.user_id);
  const initial_balance = owner.saldo_ewallet;
  let status_bayar, final_balance;
  
  if (initial_balance >= amount_charged) {
    status_bayar = 'LUNAS';
    final_balance = initial_balance - amount_charged;
    owner.saldo_ewallet = final_balance;
  } else {
    status_bayar = 'TERTUNGGAK';
    final_balance = initial_balance;
  }
  
  const transaction = {
    transaction_id: mockTransactions.length + 1,
    nfc_uid,
    user_id: owner.user_id,
    petugas_id,
    plat_nomor: vehicle.plat_nomor,
    amount_charged,
    status_bayar,
    initial_balance,
    final_balance,
    location,
    notes,
    timestamp: new Date().toISOString(),
  };
  
  mockTransactions.unshift(transaction);
  
  res.status(201).json({
    success: true,
    message: status_bayar === 'LUNAS' ? 'Pembayaran berhasil' : 'Saldo tidak cukup - Status TERTUNGGAK',
    data: transaction,
  });
});

// =====================================================
// GET TRANSACTIONS
// =====================================================
app.get('/api/transactions', (req, res) => {
  res.json({
    success: true,
    data: mockTransactions,
    pagination: {
      page: 1,
      limit: 20,
      total: mockTransactions.length,
      total_pages: 1,
    },
  });
});

// =====================================================
// GET USERS
// =====================================================
app.get('/api/users', (req, res) => {
  const users = mockUsers.map(u => ({
    user_id: u.user_id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role_name,
    saldo_ewallet: u.saldo_ewallet,
    membership_status: u.membership_status,
    is_active: u.is_active,
  }));
  
  res.json({
    success: true,
    data: users,
    pagination: {
      page: 1,
      limit: 20,
      total: users.length,
      total_pages: 1,
    },
  });
});

// =====================================================
// TOP UP
// =====================================================
app.post('/api/users/:id/topup', (req, res) => {
  const { id } = req.params;
  const { amount, payment_method } = req.body;
  
  const user = mockUsers.find(u => u.user_id === parseInt(id));
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User tidak ditemukan',
    });
  }
  
  const initial_balance = user.saldo_ewallet;
  const final_balance = initial_balance + amount;
  user.saldo_ewallet = final_balance;
  
  res.json({
    success: true,
    message: 'Top up berhasil',
    data: {
      user_id: user.user_id,
      amount,
      initial_balance,
      final_balance,
      payment_method,
    },
  });
});

// =====================================================
// PROMOTIONS
// =====================================================
let promotionIdCounter = 2; // Start from 3 since we have 2 initial promos

app.get('/api/promotions', (req, res) => {
  res.json({
    success: true,
    data: mockPromotions,
  });
});

app.post('/api/promotions', (req, res) => {
  promotionIdCounter++;
  const newPromo = {
    promotion_id: promotionIdCounter,
    ...req.body,
  };
  mockPromotions.push(newPromo);
  
  console.log('➕ Created promotion:', newPromo.promotion_id, newPromo.title);
  
  res.status(201).json({
    success: true,
    message: 'Promosi berhasil dibuat',
    data: newPromo,
  });
});

app.put('/api/promotions/:id', (req, res) => {
  const { id } = req.params;
  const index = mockPromotions.findIndex(p => p.promotion_id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Promosi tidak ditemukan',
    });
  }
  
  mockPromotions[index] = { ...mockPromotions[index], ...req.body };
  
  res.json({
    success: true,
    message: 'Promosi berhasil diupdate',
    data: mockPromotions[index],
  });
});

app.delete('/api/promotions/:id', (req, res) => {
  const { id } = req.params;
  console.log('🗑️ DELETE request for promotion ID:', id, 'Type:', typeof id);
  
  const index = mockPromotions.findIndex(p => p.promotion_id === parseInt(id));
  console.log('🔍 Found at index:', index);
  console.log('📊 Current promotions:', mockPromotions.map(p => ({id: p.promotion_id, title: p.title})));
  
  if (index === -1) {
    console.log('❌ Promotion not found');
    return res.status(404).json({
      success: false,
      message: 'Promosi tidak ditemukan',
    });
  }
  
  const deleted = mockPromotions.splice(index, 1);
  console.log('✅ Deleted:', deleted[0].title);
  console.log('📊 Remaining promotions:', mockPromotions.length);
  
  res.json({
    success: true,
    message: 'Promosi berhasil dihapus',
    data: deleted[0],
  });
});

// =====================================================
// 404 Handler
// =====================================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// =====================================================
// Error Handler
// =====================================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// =====================================================
// Start Server
// =====================================================
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║   🚗 MARKIR E-Parking API Server (MOCK)      ║
  ║   📡 Running on: http://localhost:${PORT}     ║
  ║   🔧 Mode: MOCK (No PostgreSQL required)     ║
  ╚═══════════════════════════════════════════════╝
  
  ✅ Mock data loaded:
     - 2 users (1 admin, 1 user)
     - 2 motorcycles with NFC tags
     - 2 promotions
  
  📝 Test endpoints:
     POST /api/auth/login
     POST /api/nfc/scan
     POST /api/transactions
     GET  /api/promotions
  `);
});

module.exports = app;
