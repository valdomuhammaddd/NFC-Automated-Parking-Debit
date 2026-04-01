-- =====================================================
-- MARKIR E-PARKING - Seed Data (Testing & Development)
-- =====================================================
-- Data ini untuk testing dengan 1000+ users dan tags
-- =====================================================

-- =====================================================
-- 1. INSERT ADMIN USERS
-- =====================================================
-- Password: admin123 (hashed dengan bcrypt)
-- Hash: $2b$10$YourHashedPasswordHere
INSERT INTO users (role_id, email, password_hash, name, phone, saldo_ewallet, membership_status) VALUES
(1, 'admin@markir.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Admin MARKIR', '081234567890', 1000000.00, 'Platinum'),
(1, 'superadmin@markir.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Super Admin', '081234567891', 5000000.00, 'Platinum');

-- =====================================================
-- 2. INSERT REGULAR USERS (Sample 14 + Generate 986 more)
-- =====================================================
-- Password: user123 (untuk testing)
INSERT INTO users (role_id, email, password_hash, name, phone, saldo_ewallet, membership_status) VALUES
(2, 'valdo@markir.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Valdo Rinaldi', '081234567892', 500000.00, 'Gold'),
(2, 'dewi@gmail.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Dewi Sartika', '081234567893', 450000.00, 'Gold'),
(2, 'user1@test.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Test User 1', '081234567894', 100000.00, 'Silver'),
(2, 'user2@test.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Test User 2', '081234567895', 85000.00, 'Silver'),
(2, 'user3@test.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Test User 3', '081234567896', 75000.00, 'Free'),
(2, 'andi@gmail.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Andi Wijaya', '081234567897', 200000.00, 'Silver'),
(2, 'budi@yahoo.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Budi Santoso', '081234567898', 150000.00, 'Silver'),
(2, 'citra@mail.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Citra Lestari', '081234567899', 300000.00, 'Gold'),
(2, 'dian@gmail.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Dian Pratama', '081234567800', 125000.00, 'Silver'),
(2, 'eka@test.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Eka Putra', '081234567801', 180000.00, 'Silver'),
(2, 'fani@gmail.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Fani Rahmawati', '081234567802', 220000.00, 'Silver'),
(2, 'gita@yahoo.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Gita Melati', '081234567803', 95000.00, 'Free'),
(2, 'hendra@mail.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Hendra Kusuma', '081234567804', 350000.00, 'Gold'),
(2, 'ika@gmail.com', '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', 'Ika Sari', '081234567805', 175000.00, 'Silver');

-- Generate 986 additional users (untuk testing 1000+ capacity)
DO $$
DECLARE
    i INTEGER;
    email_val VARCHAR(100);
    name_val VARCHAR(100);
    phone_val VARCHAR(20);
    saldo_val DECIMAL(10, 2);
    membership_val VARCHAR(20);
BEGIN
    FOR i IN 15..1000 LOOP
        email_val := 'user' || i || '@markir.com';
        name_val := 'User ' || i;
        phone_val := '0812' || LPAD(i::TEXT, 8, '0');
        saldo_val := (RANDOM() * 500000)::DECIMAL(10, 2); -- Random saldo 0-500k
        
        -- Random membership
        CASE (RANDOM() * 3)::INTEGER
            WHEN 0 THEN membership_val := 'Free';
            WHEN 1 THEN membership_val := 'Silver';
            WHEN 2 THEN membership_val := 'Gold';
            ELSE membership_val := 'Platinum';
        END CASE;
        
        INSERT INTO users (role_id, email, password_hash, name, phone, saldo_ewallet, membership_status)
        VALUES (2, email_val, '$2b$10$K7YzLVzXh5Pq9tX3QJ8Z7.rXHzVrHqN5J8xKdQ9tL4xVrPq9tX3QJ', name_val, phone_val, saldo_val, membership_val);
    END LOOP;
END $$;

-- =====================================================
-- 3. INSERT MOTORCYCLES (1000+ NFC Tags)
-- =====================================================
-- Sample motorcycles untuk users yang sudah ada
INSERT INTO motorcycles (user_id, plat_nomor, nfc_uid, jenis_kendaraan, merk, warna) VALUES
(3, 'B1234ABC', 'NFC-UID-001', 'Motor', 'Honda Vario', 'Merah'),
(4, 'B5678DEF', 'NFC-UID-002', 'Motor', 'Yamaha Mio', 'Hitam'),
(5, 'B9012GHI', 'NFC-UID-003', 'Motor', 'Suzuki Nex', 'Biru'),
(6, 'B3456JKL', 'NFC-UID-004', 'Motor', 'Honda Beat', 'Putih'),
(7, 'B7890MNO', 'NFC-UID-005', 'Motor', 'Yamaha Aerox', 'Abu-abu'),
(8, 'B1357PQR', 'NFC-UID-006', 'Motor', 'Honda PCX', 'Hitam'),
(9, 'B2468STU', 'NFC-UID-007', 'Motor', 'Yamaha Nmax', 'Putih'),
(10, 'B1111VWX', 'NFC-UID-008', 'Motor', 'Suzuki Satria', 'Merah'),
(11, 'B2222YZA', 'NFC-UID-009', 'Motor', 'Honda Scoopy', 'Pink'),
(12, 'B3333BCD', 'NFC-UID-010', 'Motor', 'Yamaha Fino', 'Biru'),
(13, 'B4444EFG', 'NFC-UID-011', 'Motor', 'Honda Revo', 'Hitam'),
(14, 'B5555HIJ', 'NFC-UID-012', 'Motor', 'Yamaha Jupiter', 'Merah'),
(15, 'B6666KLM', 'NFC-UID-013', 'Motor', 'Suzuki Smash', 'Kuning'),
(16, 'B7777NOP', 'NFC-UID-014', 'Motor', 'Honda CB150', 'Hitam');

-- Generate 986 additional motorcycles (1 per user)
DO $$
DECLARE
    i INTEGER;
    user_id_val INTEGER;
    plat_val VARCHAR(15);
    nfc_uid_val VARCHAR(50);
    jenis_val VARCHAR(10);
    merk_val VARCHAR(50);
    warna_val VARCHAR(30);
    merk_array TEXT[] := ARRAY['Honda Vario', 'Yamaha Mio', 'Suzuki Nex', 'Honda Beat', 'Yamaha Aerox', 'Honda PCX', 'Yamaha Nmax', 'Suzuki Satria'];
    warna_array TEXT[] := ARRAY['Merah', 'Hitam', 'Putih', 'Biru', 'Abu-abu', 'Kuning', 'Hijau', 'Silver'];
BEGIN
    FOR i IN 15..1000 LOOP
        user_id_val := i + 2; -- user_id offset (karena ada 2 admin)
        plat_val := 'B' || LPAD(i::TEXT, 4, '0') || CHR(65 + (i % 26)) || CHR(65 + ((i+1) % 26)) || CHR(65 + ((i+2) % 26));
        nfc_uid_val := 'NFC-UID-' || LPAD(i::TEXT, 6, '0');
        jenis_val := 'Motor';
        merk_val := merk_array[(i % 8) + 1];
        warna_val := warna_array[(i % 8) + 1];
        
        INSERT INTO motorcycles (user_id, plat_nomor, nfc_uid, jenis_kendaraan, merk, warna)
        VALUES (user_id_val, plat_val, nfc_uid_val, jenis_val, merk_val, warna_val);
    END LOOP;
END $$;

-- =====================================================
-- 4. INSERT SAMPLE TRANSACTIONS
-- =====================================================
INSERT INTO transactions (nfc_uid, user_id, petugas_id, plat_nomor, amount_charged, status_bayar, initial_balance, final_balance, location, notes) VALUES
('NFC-UID-001', 3, 1, 'B1234ABC', 5000.00, 'LUNAS', 500000.00, 495000.00, 'Parkir Mall A', 'Parkir 2 jam'),
('NFC-UID-002', 4, 1, 'B5678DEF', 3000.00, 'LUNAS', 450000.00, 447000.00, 'Parkir Gedung B', 'Parkir 1 jam'),
('NFC-UID-003', 5, 1, 'B9012GHI', 10000.00, 'TERTUNGGAK', 5000.00, 5000.00, 'Parkir Plaza C', 'Saldo tidak cukup'),
('NFC-UID-004', 6, 2, 'B3456JKL', 4000.00, 'LUNAS', 85000.00, 81000.00, 'Parkir Mall A', 'Parkir 1.5 jam'),
('NFC-UID-005', 7, 2, 'B7890MNO', 6000.00, 'LUNAS', 75000.00, 69000.00, 'Parkir Kantor D', 'Parkir 3 jam');

-- =====================================================
-- 5. INSERT SAMPLE TOP UP HISTORY
-- =====================================================
INSERT INTO top_up_history (user_id, amount, payment_method, status, initial_balance, final_balance) VALUES
(3, 100000.00, 'Bank Transfer', 'SUCCESS', 400000.00, 500000.00),
(4, 50000.00, 'E-Wallet', 'SUCCESS', 400000.00, 450000.00),
(5, 25000.00, 'Credit Card', 'SUCCESS', 75000.00, 100000.00),
(6, 100000.00, 'Bank Transfer', 'PENDING', 85000.00, 85000.00);

-- =====================================================
-- 6. INSERT SAMPLE PROMOTIONS
-- =====================================================
INSERT INTO promotions (title, description, code, discount_type, discount_value, valid_until, is_active) VALUES
('Diskon Member Baru', 'Dapatkan diskon 50% untuk transaksi pertama!', 'FIRST50', 'percentage', 50.00, '2025-12-31 23:59:59', true),
('Top Up Bonus 10%', 'Top up minimal 100rb dapat bonus 10%', 'TOPUP10', 'percentage', 10.00, '2025-12-31 23:59:59', true),
('Promo Weekend', 'Diskon Rp 1.000 untuk parkir di akhir pekan', 'WEEKEND', 'fixed', 1000.00, '2025-12-31 23:59:59', true),
('Promo Natal', 'Diskon 25% untuk semua transaksi bulan Desember', 'XMAS25', 'percentage', 25.00, '2025-12-25 23:59:59', false);

-- =====================================================
-- NOTES:
-- - Password hash adalah sample (gunakan bcrypt untuk production!)
-- - Script ini menghasilkan 1000+ users dan 1000+ motorcycles
-- - NFC UID format: NFC-UID-XXXXXX (6 digit)
-- - Plat nomor format: B####XXX
-- =====================================================
