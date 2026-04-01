const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// =====================================================
// LOGIN - Email & Password
// =====================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
      });
    }

    // Get user with role
    const result = await query(
      `SELECT u.*, r.role_name 
       FROM users u
       INNER JOIN roles r ON u.role_id = r.role_id
       WHERE u.email = $1 AND u.is_active = true`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role_name,
      },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    delete user.password_hash;

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
          saldo_ewallet: parseFloat(user.saldo_ewallet),
          membership_status: user.membership_status,
        },
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat login',
      error: error.message,
    });
  }
});

// =====================================================
// REGISTER - New User
// =====================================================
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, dan nama wajib diisi',
      });
    }

    // Check if email already exists
    const emailCheck = await query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar',
      });
    }

    // Get role_id (default: user)
    const roleResult = await query(
      'SELECT role_id FROM roles WHERE role_name = $1',
      [role || 'user']
    );

    const role_id = roleResult.rows[0]?.role_id || 2; // Default to user

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await query(
      `INSERT INTO users (role_id, email, password_hash, name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, email, name, phone, saldo_ewallet, membership_status, created_at`,
      [role_id, email, password_hash, name, phone || null]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user_id: newUser.user_id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        saldo_ewallet: parseFloat(newUser.saldo_ewallet),
        membership_status: newUser.membership_status,
      },
    });
  } catch (error) {
    console.error('❌ Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message,
    });
  }
});

module.exports = router;
