const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// =====================================================
// GET ALL MOTORCYCLES - With Pagination & Filters
// =====================================================
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      user_id,
      jenis_kendaraan,
      is_active,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramCount = 1;

    // Build WHERE clause
    if (user_id) {
      conditions.push(`m.user_id = $${paramCount}`);
      values.push(user_id);
      paramCount++;
    }
    if (jenis_kendaraan) {
      conditions.push(`m.jenis_kendaraan = $${paramCount}`);
      values.push(jenis_kendaraan);
      paramCount++;
    }
    if (is_active !== undefined) {
      conditions.push(`m.is_active = $${paramCount}`);
      values.push(is_active === 'true');
      paramCount++;
    }
    if (search) {
      conditions.push(`(m.plat_nomor ILIKE $${paramCount} OR m.nfc_uid ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 
      ? 'WHERE ' + conditions.join(' AND ') 
      : '';

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) FROM motorcycles m ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Get motorcycles
    values.push(limit, offset);
    const result = await query(
      `SELECT 
        m.*,
        u.name AS owner_name,
        u.email AS owner_email
      FROM motorcycles m
      INNER JOIN users u ON m.user_id = u.user_id
      ${whereClause}
      ORDER BY m.registered_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      values
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Get Motorcycles Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kendaraan',
      error: error.message,
    });
  }
});

// =====================================================
// GET MOTORCYCLE BY ID
// =====================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        m.*,
        u.name AS owner_name,
        u.email AS owner_email,
        u.phone AS owner_phone,
        u.saldo_ewallet
      FROM motorcycles m
      INNER JOIN users u ON m.user_id = u.user_id
      WHERE m.motorcycle_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Get Motorcycle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data kendaraan',
      error: error.message,
    });
  }
});

// =====================================================
// DELETE MOTORCYCLE
// =====================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM motorcycles WHERE motorcycle_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kendaraan tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Kendaraan berhasil dihapus',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Delete Motorcycle Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus kendaraan',
      error: error.message,
    });
  }
});

module.exports = router;
