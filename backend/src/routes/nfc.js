const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// =====================================================
// NFC SCAN/READ - Get Vehicle Data by NFC UID
// =====================================================
// Endpoint: POST /api/nfc/scan
// Body: { nfc_uid: "NFC-UID-001" }
router.post('/scan', async (req, res) => {
  try {
    const { nfc_uid } = req.body;

    if (!nfc_uid) {
      return res.status(400).json({
        success: false,
        message: 'NFC UID is required',
      });
    }

    console.log('📡 NFC Scan Request:', nfc_uid);

    // Query motorcycle data with user info
    const result = await query(
      `SELECT 
        m.motorcycle_id,
        m.plat_nomor,
        m.nfc_uid,
        m.jenis_kendaraan,
        m.merk,
        m.warna,
        m.is_active,
        u.user_id,
        u.name AS owner_name,
        u.email AS owner_email,
        u.phone AS owner_phone,
        u.saldo_ewallet,
        u.membership_status
      FROM motorcycles m
      INNER JOIN users u ON m.user_id = u.user_id
      WHERE m.nfc_uid = $1 AND m.is_active = true`,
      [nfc_uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NFC Tag tidak terdaftar atau tidak aktif',
        nfc_uid,
      });
    }

    const vehicleData = result.rows[0];

    // Get last transaction for this vehicle
    const lastTrx = await query(
      `SELECT status_bayar, amount_charged, timestamp 
       FROM transactions 
       WHERE nfc_uid = $1 
       ORDER BY timestamp DESC 
       LIMIT 1`,
      [nfc_uid]
    );

    res.json({
      success: true,
      message: 'Data kendaraan berhasil ditemukan',
      data: {
        vehicle: {
          motorcycle_id: vehicleData.motorcycle_id,
          plat_nomor: vehicleData.plat_nomor,
          nfc_uid: vehicleData.nfc_uid,
          jenis_kendaraan: vehicleData.jenis_kendaraan,
          merk: vehicleData.merk,
          warna: vehicleData.warna,
        },
        owner: {
          user_id: vehicleData.user_id,
          name: vehicleData.owner_name,
          email: vehicleData.owner_email,
          phone: vehicleData.owner_phone,
          saldo_ewallet: parseFloat(vehicleData.saldo_ewallet),
          membership_status: vehicleData.membership_status,
        },
        last_transaction: lastTrx.rows.length > 0 ? lastTrx.rows[0] : null,
      },
    });
  } catch (error) {
    console.error('❌ NFC Scan Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memindai NFC',
      error: error.message,
    });
  }
});

// =====================================================
// NFC WRITE/REGISTER - Register New Vehicle with NFC Tag
// =====================================================
// Endpoint: POST /api/nfc/register
// Body: { user_id, plat_nomor, nfc_uid, jenis_kendaraan, merk, warna }
router.post('/register', async (req, res) => {
  try {
    const { user_id, plat_nomor, nfc_uid, jenis_kendaraan, merk, warna } = req.body;

    // Validasi
    if (!user_id || !plat_nomor || !nfc_uid || !jenis_kendaraan) {
      return res.status(400).json({
        success: false,
        message: 'user_id, plat_nomor, nfc_uid, dan jenis_kendaraan wajib diisi',
      });
    }

    console.log('✍️ NFC Register Request:', { user_id, plat_nomor, nfc_uid });

    // Check if user exists
    const userCheck = await query(
      'SELECT user_id, name FROM users WHERE user_id = $1',
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan',
      });
    }

    // Check if NFC UID already registered
    const nfcCheck = await query(
      'SELECT nfc_uid, plat_nomor FROM motorcycles WHERE nfc_uid = $1',
      [nfc_uid]
    );

    if (nfcCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'NFC UID sudah terdaftar untuk kendaraan lain',
        existing_plat: nfcCheck.rows[0].plat_nomor,
      });
    }

    // Check if plat nomor already registered
    const platCheck = await query(
      'SELECT plat_nomor, nfc_uid FROM motorcycles WHERE plat_nomor = $1',
      [plat_nomor]
    );

    if (platCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Plat nomor sudah terdaftar',
        existing_nfc_uid: platCheck.rows[0].nfc_uid,
      });
    }

    // Insert new motorcycle
    const result = await query(
      `INSERT INTO motorcycles (user_id, plat_nomor, nfc_uid, jenis_kendaraan, merk, warna)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, plat_nomor, nfc_uid, jenis_kendaraan, merk || null, warna || null]
    );

    const newVehicle = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Kendaraan berhasil didaftarkan dengan NFC Tag',
      data: {
        motorcycle_id: newVehicle.motorcycle_id,
        user_id: newVehicle.user_id,
        plat_nomor: newVehicle.plat_nomor,
        nfc_uid: newVehicle.nfc_uid,
        jenis_kendaraan: newVehicle.jenis_kendaraan,
        merk: newVehicle.merk,
        warna: newVehicle.warna,
        registered_at: newVehicle.registered_at,
      },
    });
  } catch (error) {
    console.error('❌ NFC Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendaftarkan kendaraan',
      error: error.message,
    });
  }
});

// =====================================================
// NFC UPDATE - Update Motorcycle Data
// =====================================================
// Endpoint: PUT /api/nfc/update/:nfc_uid
router.put('/update/:nfc_uid', async (req, res) => {
  try {
    const { nfc_uid } = req.params;
    const { plat_nomor, jenis_kendaraan, merk, warna, is_active } = req.body;

    // Check if motorcycle exists
    const check = await query(
      'SELECT * FROM motorcycles WHERE nfc_uid = $1',
      [nfc_uid]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kendaraan dengan NFC UID ini tidak ditemukan',
      });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (plat_nomor) {
      updates.push(`plat_nomor = $${paramCount}`);
      values.push(plat_nomor);
      paramCount++;
    }
    if (jenis_kendaraan) {
      updates.push(`jenis_kendaraan = $${paramCount}`);
      values.push(jenis_kendaraan);
      paramCount++;
    }
    if (merk) {
      updates.push(`merk = $${paramCount}`);
      values.push(merk);
      paramCount++;
    }
    if (warna) {
      updates.push(`warna = $${paramCount}`);
      values.push(warna);
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

    values.push(nfc_uid);

    const result = await query(
      `UPDATE motorcycles 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE nfc_uid = $${paramCount}
       RETURNING *`,
      values
    );

    res.json({
      success: true,
      message: 'Data kendaraan berhasil diupdate',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ NFC Update Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate data kendaraan',
      error: error.message,
    });
  }
});

module.exports = router;
