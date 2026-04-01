# MARKIR Backend - Quick Start

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Environment
```bash
copy .env.example .env
```
Edit `.env` dan sesuaikan dengan kredensial PostgreSQL Anda.

## 3. Setup Database
Jalankan script SQL di folder `../database/` dengan urutan:
1. `01_setup_database.sql` - Buat database dan user
2. `02_create_tables.sql` - Buat tabel
3. `03_seed_data.sql` - Insert data testing (1000+ users & tags)

## 4. Start Server
**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 5. Test API
Buka browser atau Postman:
```
http://localhost:3000/
```

## API Endpoints
- `POST /api/auth/login` - Login
- `POST /api/nfc/scan` - Scan NFC Tag
- `POST /api/nfc/register` - Register kendaraan baru
- `POST /api/transactions` - Buat transaksi parkir
- `GET /api/users` - Get semua users
- `POST /api/users/:id/topup` - Top up saldo

Lihat dokumentasi lengkap di `../database/API_DOCUMENTATION.md`

## Database Schema
- `users` - User data dengan saldo e-wallet
- `motorcycles` - Kendaraan dengan NFC UID (1000+ tags)
- `transactions` - Riwayat transaksi parkir
- `promotions` - Data promosi
- `top_up_history` - Riwayat top up

## Testing Accounts
**Admin:**
- Email: `admin@markir.com`, Password: `admin123`

**User:**
- Email: `valdo@markir.com`, Password: `user123`
- Email: `user1@test.com`, Password: `user123`

## Troubleshooting
Lihat `../database/POSTGRESQL_SETUP_GUIDE.md` section Troubleshooting
