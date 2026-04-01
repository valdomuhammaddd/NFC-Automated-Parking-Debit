const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// =====================================================
// GET ALL PROMOTIONS - With Filters
// =====================================================
router.get('/', async (req, res) => {
  try {
    const { is_active, search } = req.query;

    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (is_active !== undefined) {
      conditions.push(`is_active = $${paramCount}`);
      values.push(is_active === 'true');
      paramCount++;
    }
    if (search) {
      conditions.push(`(title ILIKE $${paramCount} OR code ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 
      ? 'WHERE ' + conditions.join(' AND ') 
      : '';

    const result = await query(
      `SELECT * FROM promotions ${whereClause} ORDER BY created_at DESC`,
      values
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('❌ Get Promotions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data promosi',
      error: error.message,
    });
  }
});

// =====================================================
// CREATE PROMOTION
// =====================================================
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      discount_type,
      discount_value,
      valid_until,
      is_active = true,
    } = req.body;

    if (!title || !code || !discount_type || !discount_value) {
      return res.status(400).json({
        success: false,
        message: 'title, code, discount_type, dan discount_value wajib diisi',
      });
    }

    // Check if code already exists
    const codeCheck = await query(
      'SELECT code FROM promotions WHERE code = $1',
      [code]
    );

    if (codeCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Kode promosi sudah digunakan',
      });
    }

    const result = await query(
      `INSERT INTO promotions (title, description, code, discount_type, discount_value, valid_until, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, code, discount_type, discount_value, valid_until || null, is_active]
    );

    res.status(201).json({
      success: true,
      message: 'Promosi berhasil dibuat',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Create Promotion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat promosi',
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE PROMOTION
// =====================================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      discount_type,
      discount_value,
      valid_until,
      is_active,
    } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (discount_type) {
      updates.push(`discount_type = $${paramCount}`);
      values.push(discount_type);
      paramCount++;
    }
    if (discount_value) {
      updates.push(`discount_value = $${paramCount}`);
      values.push(discount_value);
      paramCount++;
    }
    if (valid_until !== undefined) {
      updates.push(`valid_until = $${paramCount}`);
      values.push(valid_until);
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
      `UPDATE promotions 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE promotion_id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Promosi tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Promosi berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Update Promotion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate promosi',
      error: error.message,
    });
  }
});

// =====================================================
// DELETE PROMOTION
// =====================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM promotions WHERE promotion_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Promosi tidak ditemukan',
      });
    }

    res.json({
      success: true,
      message: 'Promosi berhasil dihapus',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Delete Promotion Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus promosi',
      error: error.message,
    });
  }
});

module.exports = router;
