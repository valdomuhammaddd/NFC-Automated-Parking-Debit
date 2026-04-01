# 🚗 MARKIR E-Parking - PostgreSQL Setup Guide

## 📋 Daftar Isi
1. [Instalasi PostgreSQL](#instalasi-postgresql)
2. [Setup Database](#setup-database)
3. [Setup Backend API](#setup-backend-api)
4. [Konfigurasi Network](#konfigurasi-network)
5. [Testing API](#testing-api)
6. [Integrasi dengan React Native](#integrasi-dengan-react-native)

---

## 1️⃣ Instalasi PostgreSQL

### Windows
1. Download PostgreSQL dari https://www.postgresql.org/download/windows/
2. Jalankan installer (pilih versi 14 atau lebih baru)
3. Ikuti wizard, catat password untuk user `postgres`
4. Default port: `5432`
5. Install pgAdmin 4 (sudah termasuk dalam installer)

### Verifikasi Instalasi
Buka Command Prompt dan jalankan:
```bash
psql --version
```

---

## 2️⃣ Setup Database

### Langkah 1: Buka pgAdmin atau psql
**Menggunakan psql (Command Line):**
```bash
psql -U postgres
```

**Atau buka pgAdmin 4** (GUI)

### Langkah 2: Jalankan Script Setup
Jalankan script dalam urutan berikut:

#### A. Setup Database & User
```bash
# Di psql atau Query Tool pgAdmin
\i 'C:/MARKIR/markir-app/database/01_setup_database.sql'
```

**Atau copy-paste manual:**
```sql
CREATE USER markir_user WITH PASSWORD 'markir2024_secure';
CREATE DATABASE markir_db OWNER markir_user;
GRANT ALL PRIVILEGES ON DATABASE markir_db TO markir_user;
```

#### B. Connect ke Database MARKIR
```bash
\c markir_db
```

#### C. Buat Tabel
```bash
\i 'C:/MARKIR/markir-app/database/02_create_tables.sql'
```

**Atau jalankan lewat pgAdmin:**
1. Klik kanan `markir_db` → Query Tool
2. Open file `02_create_tables.sql`
3. Klik Execute (F5)

#### D. Insert Data Testing (1000+ Users & Tags)
```bash
\i 'C:/MARKIR/markir-app/database/03_seed_data.sql'
```

### Langkah 3: Verifikasi Data
```sql
-- Cek jumlah users
SELECT COUNT(*) FROM users;
-- Expected: 1002 (2 admin + 1000 users)

-- Cek jumlah motorcycles
SELECT COUNT(*) FROM motorcycles;
-- Expected: 1000+

-- Cek sample data
SELECT u.name, u.email, u.saldo_ewallet, m.plat_nomor, m.nfc_uid
FROM users u
LEFT JOIN motorcycles m ON u.user_id = m.user_id
LIMIT 10;
```

---

## 3️⃣ Setup Backend API

### Langkah 1: Install Dependencies
Buka terminal di folder `backend`:
```bash
cd C:\MARKIR\markir-app\backend
npm install
```

### Langkah 2: Konfigurasi Environment
Buat file `.env` dari template:
```bash
copy .env.example .env
```

Edit file `.env` dengan kredensial Anda:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=markir_db
DB_USER=markir_user
DB_PASSWORD=markir2024_secure

PORT=3000
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

CORS_ORIGIN=*
```

### Langkah 3: Jalankan Server
```bash
npm run dev
```

**Expected Output:**
```
✅ Connected to PostgreSQL database
╔═══════════════════════════════════════════════╗
║   🚗 MARKIR E-Parking API Server             ║
║   📡 Running on: http://localhost:3000       ║
║   🌍 Environment: development                 ║
╚═══════════════════════════════════════════════╝
```

---

## 4️⃣ Konfigurasi Network (Untuk React Native Dev)

### Langkah 1: Cek IP Lokal Anda
**Windows:**
```bash
ipconfig
```
Cari `IPv4 Address` (contoh: `192.168.0.104`)

### Langkah 2: Edit pg_hba.conf
**Lokasi file (Windows):**
```
C:\Program Files\PostgreSQL\15\data\pg_hba.conf
```

**Tambahkan baris ini:**
```
# Allow local network access for MARKIR
host    markir_db    markir_user    192.168.0.0/16    md5
```

**Atau untuk semua IP (TIDAK AMAN untuk production!):**
```
host    all          all            0.0.0.0/0         md5
```

### Langkah 3: Edit postgresql.conf
**Lokasi file:**
```
C:\Program Files\PostgreSQL\15\data\postgresql.conf
```

**Ubah baris ini:**
```
listen_addresses = '*'
```

### Langkah 4: Restart PostgreSQL
**Windows (Command Prompt as Administrator):**
```bash
net stop postgresql-x64-15
net start postgresql-x64-15
```

**Atau lewat Services:**
1. Tekan `Win + R` → ketik `services.msc`
2. Cari `postgresql-x64-15`
3. Klik kanan → Restart

### Langkah 5: Test Koneksi dari Perangkat Lain
Di React Native app atau terminal lain:
```bash
# Test ping
ping 192.168.0.104

# Test PostgreSQL port
telnet 192.168.0.104 5432
```

---

## 5️⃣ Testing API

### Gunakan Postman, Thunder Client, atau cURL

#### 1. Health Check
```bash
curl http://localhost:3000/
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "🚗 MARKIR E-Parking API is running!",
  "version": "1.0.0"
}
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@markir.com\",\"password\":\"admin123\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "email": "admin@markir.com",
      "name": "Admin MARKIR",
      "role": "admin",
      "saldo_ewallet": 1000000
    }
  }
}
```

#### 3. NFC Scan (Baca Data Kendaraan)
```bash
curl -X POST http://localhost:3000/api/nfc/scan \
  -H "Content-Type: application/json" \
  -d "{\"nfc_uid\":\"NFC-UID-001\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Data kendaraan berhasil ditemukan",
  "data": {
    "vehicle": {
      "plat_nomor": "B1234ABC",
      "nfc_uid": "NFC-UID-001",
      "jenis_kendaraan": "Motor",
      "merk": "Honda Vario"
    },
    "owner": {
      "user_id": 3,
      "name": "Valdo Rinaldi",
      "saldo_ewallet": 500000,
      "membership_status": "Gold"
    }
  }
}
```

#### 4. NFC Register (Tulis Data Baru)
```bash
curl -X POST http://localhost:3000/api/nfc/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":3,\"plat_nomor\":\"B9999ZZZ\",\"nfc_uid\":\"NFC-NEW-TEST\",\"jenis_kendaraan\":\"Motor\",\"merk\":\"Honda Beat\",\"warna\":\"Merah\"}"
```

#### 5. Buat Transaksi (Pembayaran Parkir)
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"nfc_uid\":\"NFC-UID-001\",\"petugas_id\":1,\"amount_charged\":5000,\"location\":\"Parkir Mall A\"}"
```

**Expected Response (LUNAS):**
```json
{
  "success": true,
  "message": "Pembayaran berhasil",
  "data": {
    "transaction_id": 123,
    "nfc_uid": "NFC-UID-001",
    "plat_nomor": "B1234ABC",
    "amount_charged": 5000,
    "status_bayar": "LUNAS",
    "initial_balance": 500000,
    "final_balance": 495000
  }
}
```

**Expected Response (TERTUNGGAK - Saldo Tidak Cukup):**
```json
{
  "success": true,
  "message": "Saldo tidak cukup - Status TERTUNGGAK",
  "data": {
    "status_bayar": "TERTUNGGAK",
    "initial_balance": 2000,
    "final_balance": 2000
  }
}
```

#### 6. Top Up Saldo
```bash
curl -X POST http://localhost:3000/api/users/3/topup \
  -H "Content-Type: application/json" \
  -d "{\"amount\":100000,\"payment_method\":\"Bank Transfer\"}"
```

---

## 6️⃣ Integrasi dengan React Native

### Langkah 1: Update API Base URL
Ganti IP dengan IP lokal Anda:
```typescript
// src/data/api/apiConfig.ts
export const API_BASE_URL = 'http://192.168.0.104:3000/api';
```

### Langkah 2: Buat API Service
```typescript
// src/data/api/markir-api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.104:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// NFC Scan
export const nfcScan = async (nfc_uid: string) => {
  const response = await api.post('/nfc/scan', { nfc_uid });
  return response.data;
};

// NFC Register
export const nfcRegister = async (data: {
  user_id: number;
  plat_nomor: string;
  nfc_uid: string;
  jenis_kendaraan: string;
  merk?: string;
  warna?: string;
}) => {
  const response = await api.post('/nfc/register', data);
  return response.data;
};

// Create Transaction
export const createTransaction = async (data: {
  nfc_uid: string;
  petugas_id: number;
  amount_charged: number;
  location?: string;
}) => {
  const response = await api.post('/transactions', data);
  return response.data;
};

// Login
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Top Up
export const topUp = async (user_id: number, amount: number, payment_method: string) => {
  const response = await api.post(`/users/${user_id}/topup`, {
    amount,
    payment_method,
  });
  return response.data;
};

export default api;
```

### Langkah 3: Gunakan di Screen
```typescript
// src/screens/user/NFCPaymentScreen.tsx
import { nfcScan, createTransaction } from '@/data/api/markir-api';

const handleNFCScan = async (nfc_uid: string) => {
  try {
    // Scan NFC untuk mendapatkan data kendaraan
    const scanResult = await nfcScan(nfc_uid);
    
    if (scanResult.success) {
      const { vehicle, owner } = scanResult.data;
      
      // Tampilkan data
      console.log('Plat Nomor:', vehicle.plat_nomor);
      console.log('Owner:', owner.name);
      console.log('Saldo:', owner.saldo_ewallet);
      
      // Buat transaksi
      const trxResult = await createTransaction({
        nfc_uid,
        petugas_id: currentUser.user_id,
        amount_charged: 5000,
        location: 'Parkir Mall A',
      });
      
      if (trxResult.data.status_bayar === 'LUNAS') {
        Alert.alert('Sukses', 'Pembayaran berhasil!');
      } else {
        Alert.alert('Tertunggak', 'Saldo tidak cukup!');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Terjadi kesalahan saat memindai NFC');
  }
};
```

---

## 🔐 Testing Accounts

### Admin Accounts
| Email | Password | Saldo |
|-------|----------|-------|
| admin@markir.com | admin123 | Rp 1.000.000 |
| superadmin@markir.com | admin123 | Rp 5.000.000 |

### User Accounts
| Email | Password | Saldo | NFC UID |
|-------|----------|-------|---------|
| valdo@markir.com | user123 | Rp 500.000 | NFC-UID-001 |
| dewi@gmail.com | user123 | Rp 450.000 | NFC-UID-002 |
| user1@test.com | user123 | Rp 100.000 | NFC-UID-003 |
| user2@test.com | user123 | Rp 85.000 | NFC-UID-004 |
| user3@test.com | user123 | Rp 75.000 | NFC-UID-005 |

**1000+ users:** `user15@markir.com` hingga `user1000@markir.com` (password: `user123`)

---

## 📊 Database Schema Summary

### Tabel Utama
- `users` - Data user dengan saldo e-wallet
- `motorcycles` - Data kendaraan dengan NFC UID (FK kritis!)
- `transactions` - Riwayat transaksi parkir (audit trail PAD)
- `top_up_history` - Riwayat top up saldo
- `promotions` - Data promosi
- `roles` - Role-based access control (admin/user)

### Foreign Key Relations
- `motorcycles.user_id` → `users.user_id`
- `motorcycles.nfc_uid` → `transactions.nfc_uid` (KUNCI SCANNING!)
- `transactions.user_id` → `users.user_id`
- `transactions.petugas_id` → `users.user_id`

---

## 🐛 Troubleshooting

### Error: "password authentication failed"
→ Cek kredensial di `.env`, pastikan sama dengan yang dibuat di script `01_setup_database.sql`

### Error: "could not connect to server"
→ Pastikan PostgreSQL service running:
```bash
net start postgresql-x64-15
```

### Error: "no pg_hba.conf entry for host"
→ Edit `pg_hba.conf` dan restart PostgreSQL

### Error: "ECONNREFUSED" di React Native
→ Pastikan:
1. Backend API running di `http://localhost:3000`
2. IP di API config sesuai dengan IP lokal Anda
3. Firewall tidak memblokir port 3000

### Error: "relation does not exist"
→ Pastikan sudah menjalankan `02_create_tables.sql`

---

## ✅ Checklist Setup

- [ ] PostgreSQL terinstall (versi 14+)
- [ ] Database `markir_db` sudah dibuat
- [ ] User `markir_user` sudah dibuat
- [ ] Tabel sudah dibuat (6 tabel)
- [ ] Seed data sudah diinsert (1000+ users & tags)
- [ ] Backend dependencies sudah diinstall (`npm install`)
- [ ] File `.env` sudah dikonfigurasi
- [ ] Backend API running di port 3000
- [ ] `pg_hba.conf` sudah diedit (untuk akses network)
- [ ] PostgreSQL sudah restart
- [ ] API bisa diakses dari Postman/cURL
- [ ] IP lokal sudah dikonfigurasi di React Native

---

## 📞 Next Steps

1. **Test API dengan Postman** - Pastikan semua endpoint berfungsi
2. **Integrasi dengan React Native** - Update API base URL
3. **Test NFC Scanning** - Gunakan `nfc_uid` untuk scan data
4. **Test NFC Writing** - Register kendaraan baru dengan NFC tag
5. **Build APK** - Build dengan backend PostgreSQL

---

**PENTING:** 
- Password di `03_seed_data.sql` adalah **sample hash**. Untuk production, gunakan password yang di-hash dengan `bcrypt`.
- Untuk testing, gunakan password `admin123` (admin) dan `user123` (user).
- Ganti `JWT_SECRET` di `.env` dengan string random yang kuat.

🚀 **Happy Coding!**
