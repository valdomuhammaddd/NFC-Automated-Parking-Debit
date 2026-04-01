const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');

// =====================================================
// CREATE TRANSACTION - Parking Payment
// =====================================================
router.post('/', async (req, res) => {
  const client = await getClient();
  
  try {
    const {
      nfc_uid,
      petugas_id,
      amount_charged,
      location,
      notes,
    } = req.body;

    if (!nfc_uid || !petugas_id || !amount_charged) {
      return res.status(400).json({
        success: false,
        message: 'nfc_uid, petugas_id, dan amount_charged wajib diisi',
      });
    }

    await client.query('BEGIN');

    // Get motorcycle and user data
    const vehicleResult = await client.query(
      `SELECT m.motorcycle_id, m.user_id, m.plat_nomor, u.saldo_ewallet
       FROM motorcycles m
       INNER JOIN users u ON m.user_id = u.user_id
       WHERE m.nfc_uid = $1 AND m.is_active = true`,
      [nfc_uid]
    );

    if (vehicleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan atau tidak aktif',
      });
    }

    const vehicle = vehicleResult.rows[0];
    const user_id = vehicle.user_id;
    const plat_nomor = vehicle.plat_nomor;
    const initial_balance = parseFloat(vehicle.saldo_ewallet);
    const charge = parseFloat(amount_charged);

    let status_bayar;
    let final_balance;

    // Check if balance is sufficient
    if (initial_balance >= charge) {
      status_bayar = 'LUNAS';
      final_balance = initial_balance - charge;

      // Deduct balance from user
      await client.query(
        'UPDATE users SET saldo_ewallet = $1 WHERE user_id = $2',
        [final_balance, user_id]
      );
    } else {
      status_bayar = 'TERTUNGGAK';
      final_balance = initial_balance; // Balance tidak berubah
    }

    // Insert transaction
    const trxResult = await client.query(
      `INSERT INTO transactions (
        nfc_uid, user_id, petugas_id, plat_nomor, 
        amount_charged, status_bayar, initial_balance, 
        final_balance, location, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        nfc_uid, user_id, petugas_id, plat_nomor,
        charge, status_bayar, initial_balance,
        final_balance, location || null, notes || null
      ]
    );

    await client.query('COMMIT');

    const transaction = trxResult.rows[0];

    res.status(201).json({
      success: true,
      message: status_bayar === 'LUNAS' 
        ? 'Pembayaran berhasil' 
        : 'Saldo tidak cukup - Status TERTUNGGAK',
      data: {
        transaction_id: transaction.transaction_id,
        nfc_uid: transaction.nfc_uid,
        plat_nomor: transaction.plat_nomor,
        amount_charged: parseFloat(transaction.amount_charged),
        status_bayar: transaction.status_bayar,
        initial_balance: parseFloat(transaction.initial_balance),
        final_balance: parseFloat(transaction.final_balance),
        timestamp: transaction.timestamp,
        location: transaction.location,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memproses transaksi',
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// =====================================================
// GET ALL TRANSACTIONS - With Pagination & Filters
// =====================================================
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status_bayar,
      user_id,
      petugas_id,
      start_date,
      end_date,
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause dynamically
    if (status_bayar) {
      conditions.push(`t.status_bayar = $${paramCount}`);
      values.push(status_bayar);
      paramCount++;
    }
    if (user_id) {
      conditions.push(`t.user_id = $${paramCount}`);
      values.push(user_id);
      paramCount++;
    }
    if (petugas_id) {
      conditions.push(`t.petugas_id = $${paramCount}`);
      values.push(petugas_id);
      paramCount++;
    }
    if (start_date) {
      conditions.push(`t.timestamp >= $${paramCount}`);
      values.push(start_date);
      paramCount++;
    }
    if (end_date) {
      conditions.push(`t.timestamp <= $${paramCount}`);
      values.push(end_date);
      paramCount++;
    }

    const whereClause = conditions.length > 0 
      ? 'WHERE ' + conditions.join(' AND ') 
      : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM transactions t ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Get transactions with user and petugas info
    values.push(limit, offset);
    const result = await query(
      `SELECT 
        t.*,
        u.name AS user_name,
        u.email AS user_email,
        p.name AS petugas_name
      FROM transactions t
      INNER JOIN users u ON t.user_id = u.user_id
      INNER JOIN users p ON t.petugas_id = p.user_id
      ${whereClause}
      ORDER BY t.timestamp DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    res.json({
      success: true,
      data: result.rows.map(row => ({
        transaction_id: row.transaction_id,
        nfc_uid: row.nfc_uid,
        plat_nomor: row.plat_nomor,
        user_name: row.user_name,
        user_email: row.user_email,
        petugas_name: row.petugas_name,
        amount_charged: parseFloat(row.amount_charged),
        status_bayar: row.status_bayar,
        initial_balance: parseFloat(row.initial_balance),
        final_balance: parseFloat(row.final_balance),
        location: row.location,
        timestamp: row.timestamp,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Get Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data transaksi',
      error: error.message,
    });
  }
});

// =====================================================
// GET TRANSACTION BY ID
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        t.*,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        p.name AS petugas_name,
        m.jenis_kendaraan,
        m.merk,
        m.warna
      FROM transactions t
      INNER JOIN users u ON t.user_id = u.user_id
      INNER JOIN users p ON t.petugas_id = p.user_id
      INNER JOIN motorcycles m ON t.nfc_uid = m.nfc_uid
      WHERE t.transaction_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaksi tidak ditemukan',
      });
    }

    const trx = result.rows[0];

    res.json({
      success: true,
      data: {
        transaction_id: trx.transaction_id,
        nfc_uid: trx.nfc_uid,
        plat_nomor: trx.plat_nomor,
        user: {
          name: trx.user_name,
          email: trx.user_email,
          phone: trx.user_phone,
        },
        petugas: {
          name: trx.petugas_name,
        },
        vehicle: {
          jenis_kendaraan: trx.jenis_kendaraan,
          merk: trx.merk,
          warna: trx.warna,
        },
        amount_charged: parseFloat(trx.amount_charged),
        status_bayar: trx.status_bayar,
        initial_balance: parseFloat(trx.initial_balance),
        final_balance: parseFloat(trx.final_balance),
        location: trx.location,
        notes: trx.notes,
        timestamp: trx.timestamp,
      },
    });
  } catch (error) {
    console.error('❌ Get Transaction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data transaksi',
      error: error.message,
    });
  }
});

module.exports = router;
