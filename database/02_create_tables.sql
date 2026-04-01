-- =====================================================
-- MARKIR E-PARKING - Database Schema
-- =====================================================
-- Jalankan setelah connect ke database markir_db
-- \c markir_db;
-- =====================================================

-- Enable UUID extension (opsional, untuk future enhancement)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ROLES TABLE (Fondasi RBAC)
-- =====================================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL CHECK (role_name IN ('admin', 'user')),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (role_name) VALUES ('admin'), ('user');

-- =====================================================
-- 2. USERS TABLE (Kapasitas 1000+ Users)
-- =====================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    saldo_ewallet DECIMAL(10, 2) DEFAULT 0.00 CHECK (saldo_ewallet >= 0),
    membership_status VARCHAR(20) DEFAULT 'Free' CHECK (membership_status IN ('Free', 'Silver', 'Gold', 'Platinum')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query (email dan role)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- =====================================================
-- 3. MOTORCYCLES TABLE (Kapasitas 1000+ Tags/Vehicles)
-- =====================================================
CREATE TABLE motorcycles (
    motorcycle_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    plat_nomor VARCHAR(15) UNIQUE NOT NULL,
    nfc_uid VARCHAR(50) UNIQUE NOT NULL, -- KUNCI KRITIS: UID dari NFC Tag
    jenis_kendaraan VARCHAR(10) NOT NULL CHECK (jenis_kendaraan IN ('Motor', 'Mobil')),
    merk VARCHAR(50),
    warna VARCHAR(30),
    is_active BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query (nfc_uid adalah yang paling penting!)
CREATE UNIQUE INDEX idx_motorcycles_nfc_uid ON motorcycles(nfc_uid);
CREATE INDEX idx_motorcycles_plat_nomor ON motorcycles(plat_nomor);
CREATE INDEX idx_motorcycles_user_id ON motorcycles(user_id);
CREATE INDEX idx_motorcycles_is_active ON motorcycles(is_active);

-- =====================================================
-- 4. TRANSACTIONS TABLE (Audit Trail PAD)
-- =====================================================
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    nfc_uid VARCHAR(50) NOT NULL REFERENCES motorcycles(nfc_uid) ON DELETE RESTRICT,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    petugas_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    plat_nomor VARCHAR(15) NOT NULL,
    timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount_charged DECIMAL(10, 2) NOT NULL CHECK (amount_charged >= 0),
    status_bayar VARCHAR(15) NOT NULL CHECK (status_bayar IN ('LUNAS', 'TERTUNGGAK', 'PENDING')),
    initial_balance DECIMAL(10, 2),
    final_balance DECIMAL(10, 2),
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query (timestamp, nfc_uid, status)
CREATE INDEX idx_transactions_nfc_uid ON transactions(nfc_uid);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_petugas_id ON transactions(petugas_id);
CREATE INDEX idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX idx_transactions_status_bayar ON transactions(status_bayar);

-- =====================================================
-- 5. TOP_UP_HISTORY TABLE (Riwayat Top Up Saldo)
-- =====================================================
CREATE TABLE top_up_history (
    topup_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    initial_balance DECIMAL(10, 2),
    final_balance DECIMAL(10, 2),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_topup_user_id ON top_up_history(user_id);
CREATE INDEX idx_topup_created_at ON top_up_history(created_at DESC);

-- =====================================================
-- 6. PROMOTIONS TABLE (Untuk Fitur Promo)
-- =====================================================
CREATE TABLE promotions (
    promotion_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    code VARCHAR(20) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    valid_until TIMESTAMP WITHOUT TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_is_active ON promotions(is_active);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk tabel users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk tabel motorcycles
CREATE TRIGGER update_motorcycles_updated_at BEFORE UPDATE ON motorcycles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk tabel promotions
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- NOTES:
-- - SERIAL dapat menampung hingga 2,147,483,647 records
-- - Untuk >2 miliar records, gunakan BIGSERIAL
-- - nfc_uid adalah foreign key kritis untuk NFC scanning
-- - Semua tabel memiliki index untuk performa optimal
-- =====================================================
