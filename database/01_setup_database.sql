-- =====================================================
-- MARKIR E-PARKING - PostgreSQL Database Setup
-- =====================================================
-- Setup Awal: Buat User dan Database
-- Jalankan script ini sebagai superuser PostgreSQL
-- =====================================================

-- 1. Buat User Khusus untuk MARKIR
-- GANTI 'your_password' dengan password yang kuat!
CREATE USER markir_user WITH PASSWORD 'markir2024_secure';

-- 2. Buat Database MARKIR
CREATE DATABASE markir_db OWNER markir_user;

-- 3. Beri Hak Akses Penuh
GRANT ALL PRIVILEGES ON DATABASE markir_db TO markir_user;

-- 4. Instruksi Koneksi untuk Development
-- Untuk akses dari React Native (IP lokal), edit file pg_hba.conf:
-- 
-- Lokasi file (Windows): C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf
-- Lokasi file (Linux/Mac): /etc/postgresql/<version>/main/pg_hba.conf
--
-- Tambahkan baris ini:
-- host    markir_db    markir_user    0.0.0.0/0    md5
--
-- Atau untuk keamanan lebih baik, gunakan IP range lokal:
-- host    markir_db    markir_user    192.168.0.0/16    md5
--
-- Kemudian restart PostgreSQL service

-- =====================================================
-- NOTES:
-- - Default port PostgreSQL: 5432
-- - Connection String Format:
--   postgresql://markir_user:your_password@localhost:5432/markir_db
-- =====================================================
