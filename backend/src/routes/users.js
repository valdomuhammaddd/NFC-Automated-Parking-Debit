const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');

// =====================================================
// GET ALL USERS - With Pagination & Filters
// =====================================================
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      membership_status,
      is_active,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause
    if (role) {
      conditions.push(`r.role_name = $${paramCount}`);
      values.push(role);
      paramCount++;
    }
    if (membership_status) {
      conditions.push(`u.membership_status = $${paramCount}`);
      values.push(membership_status);
      paramCount++;
    }
    if (is_active !== undefined) {
      conditions.push(`u.is_active = $${paramCount}`);
      values.push(is_active === 'true');
      paramCount++;
    }
    if (search) {
      conditions.push(`(u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 
      ? 'WHERE ' + conditions.join(' AND ') 
      : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM users u 
       INNER JOIN roles r ON u.role_id = r.role_id 
       ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Get users
    values.push(limit, offset);
    const result = await query(
      `SELECT 
        u.user_id, u.email, u.name, u.phone, u.saldo_ewallet, 
        u.membership_status, u.is_active, u.created_at,
        r.role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.role_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    res.json({
      success: true,
      data: result.rows.map(row => ({
        user_id: row.user_id,
        email: row.email,
        name: row.name,
        phone: row.phone,
        role: row.role_name,
        saldo_ewallet: parseFloat(row.saldo_ewallet),
        membership_status: row.membership_status,
        is_active: row.is_active,
        created_at: row.created_at,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Get Users Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data user',
      error: error.message,
    });
  }
});

// =====================================================
// GET USER BY ID
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        u.user_id, u.email, u.name, u.phone, u.saldo_ewallet, 
        u.membership_status, u.is_active, u.created_at, u.updated_at,
        r.role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.role_id
      WHERE u.user_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    const user = result.rows[0];

    // Get user's motorcycles
    const vehiclesResult = await query(
      'SELECT * FROM motorcycles WHERE user_id = $1',
      [id]
    );

    // Get user's transactions (last 10)
    const trxResult = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 10',
      [id]
    );

    res.json({
      success: true,
      data: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role_name,
        saldo_ewallet: parseFloat(user.saldo_ewallet),
        membership_status: user.membership_status,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        motorcycles: vehiclesResult.rows,
        recent_transactions: trxResult.rows,
      },
    });
  } catch (error) {
    console.error('❌ Get User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data user',
      error: error.message,
    });
  }
});

// =====================================================
// TOP UP BALANCE
// =====================================================
router.post('/:id/topup', async (req, res) => {
  const client = await getClient();
  
  try {
    const { id } = req.params;
    const { amount, payment_method } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Jumlah top up harus lebih dari 0',
      });
    }

    await client.query('BEGIN');

    // Get current balance
    const userResult = await client.query(
      'SELECT saldo_ewallet FROM users WHERE user_id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    const initial_balance = parseFloat(userResult.rows[0].saldo_ewallet);
    const final_balance = initial_balance + parseFloat(amount);

    // Update balance
    await client.query(
      'UPDATE users SET saldo_ewallet = $1 WHERE user_id = $2',
      [final_balance, id]
    );

    // Insert top up history
    await client.query(
      `INSERT INTO top_up_history (user_id, amount, payment_method, status, initial_balance, final_balance)
       VALUES ($1, $2, $3, 'SUCCESS', $4, $5)`,
      [id, amount, payment_method || 'Unknown', initial_balance, final_balance]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Top up berhasil',
      data: {
        user_id: parseInt(id),
        amount: parseFloat(amount),
        initial_balance,
        final_balance,
        payment_method: payment_method || 'Unknown',
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Top Up Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat top up',
      error: error.message,
    });
  } finally {
    client.release();
  }
});

// =====================================================
// UPDATE USER
// =====================================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, membership_status, is_active } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (phone) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    if (membership_status) {
      updates.push(`membership_status = $${paramCount}`);
      values.push(membership_status);
      paramCount++;
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(is_active);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Tidak ada data yang diupdate',
      });
    }

    values.push(id);

    const result = await query(
      `UPDATE users 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $${paramCount}
       RETURNING user_id, email, name, phone, saldo_ewallet, membership_status, is_active`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Data user berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Update User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate user',
      error: error.message,
    });
  }
});

module.exports = router;
