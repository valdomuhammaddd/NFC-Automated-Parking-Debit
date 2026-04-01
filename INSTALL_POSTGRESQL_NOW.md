# 🐘 INSTALASI POSTGRESQL - STEP BY STEP

**Status:** PostgreSQL belum terinstall  
**Tanggal:** 18 November 2025  
**Durasi Total:** ~15-20 menit

---

## ✅ CHECKLIST INSTALASI

- [ ] Download PostgreSQL installer
- [ ] Run installer (.exe)
- [ ] Catat password superuser
- [ ] Verifikasi instalasi
- [ ] Setup database MARKIR
- [ ] Run SQL scripts
- [ ] Install npm dependencies
- [ ] Create .env file
- [ ] Test connection
- [ ] Start backend production

---

## 📥 STEP 1: DOWNLOAD INSTALLER (5 menit)

Browser sudah terbuka ke halaman download PostgreSQL.

### Download:
- **Versi:** PostgreSQL 16.x (latest stable)
- **Platform:** Windows x86-64
- **Size:** ~300-350 MB
- **Link:** https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

### Lokasi download (biasanya):
```
C:\Users\[YourName]\Downloads\postgresql-16.x-windows-x64.exe
```

⏳ **Tunggu download selesai...**

---

## 🔧 STEP 2: INSTALL POSTGRESQL (5-7 menit)

### 2.1 Run Installer
1. Double-click file `postgresql-16.x-windows-x64.exe`
2. Klik "Yes" pada UAC prompt (Administrator access)
3. Klik "Next" di welcome screen

### 2.2 Installation Directory
```
C:\Program Files\PostgreSQL\16
```
✅ **Default location - Klik Next**

### 2.3 Select Components
✅ **Centang semua (recommended):**
- [x] PostgreSQL Server (WAJIB)
- [x] pgAdmin 4 (GUI tool - recommended)
- [x] Stack Builder (optional - bisa uncheck)
- [x] Command Line Tools (WAJIB)

✅ **Klik Next**

### 2.4 Data Directory
```
C:\Program Files\PostgreSQL\16\data
```
✅ **Default location - Klik Next**

### 2.5 Password ⚠️ PENTING!
```
Password: markir2024_secure
```

**⚠️ CATAT PASSWORD INI!**
- Akan digunakan untuk user `postgres` (superuser)
- Akan digunakan untuk setup database
- Simpan di notepad atau password manager

**Confirm password:** Ketik ulang password yang sama

✅ **Klik Next**

### 2.6 Port
```
Port: 5432
```
✅ **Default - Klik Next**

### 2.7 Advanced Options (Locale)
```
Locale: [Default locale]
```
✅ **Default - Klik Next**

### 2.8 Pre Installation Summary
- Review semua settings
- ✅ **Klik Next**

### 2.9 Installation Progress
⏳ **Tunggu 3-5 menit** (extracting files, installing...)

### 2.10 Completing Setup
- ❌ **Uncheck** "Launch Stack Builder at exit" (tidak perlu)
- ✅ **Klik Finish**

---

## ✅ STEP 3: VERIFIKASI INSTALASI (2 menit)

### 3.1 Buka PowerShell BARU (penting!)
```powershell
# Close PowerShell lama
# Buka PowerShell baru (untuk load PATH baru)
```

### 3.2 Test Command
```powershell
# Test 1: Check versi
psql --version

# Output yang diharapkan:
# psql (PostgreSQL) 16.x
```

### 3.3 Jika "psql not found"
**SOLUSI: Tambahkan ke PATH manually**

1. Open **System Properties** → Environment Variables
2. Edit **System Variable** "Path"
3. Klik "New"
4. Add:
   ```
   C:\Program Files\PostgreSQL\16\bin
   ```
5. Klik OK semua dialogs
6. **RESTART PowerShell**
7. Test lagi: `psql --version`

---

## 🗄️ STEP 4: SETUP DATABASE MARKIR (5 menit)

### 4.1 Login sebagai Superuser
```powershell
psql -U postgres
```

**Masukkan password:** `markir2024_secure`

**Jika berhasil, akan muncul:**
```
postgres=#
```

### 4.2 Create User & Database
Copy-paste perintah ini (satu per satu atau sekaligus):

```sql
-- Create user untuk MARKIR
CREATE USER markir_user WITH PASSWORD 'markir2024_secure';

-- Create database MARKIR
CREATE DATABASE markir_db OWNER markir_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE markir_db TO markir_user;

-- Verify
\l
```

**Output yang diharapkan:**
```
                                List of databases
   Name    |    Owner    | Encoding |   ...
-----------+-------------+----------+-------
 markir_db | markir_user | UTF8     | ...
```

### 4.3 Keluar dari psql
```sql
\q
```

---

## 📊 STEP 5: CREATE TABLES (3 menit)

### 5.1 Login ke database markir_db
```powershell
psql -U markir_user -d markir_db
```

**Password:** `markir2024_secure`

### 5.2 Run Script Create Tables
```sql
\i 'C:/MARKIR/markir-app/database/02_create_tables.sql'
```

**Output yang diharapkan:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
... (7 tables total)
```

### 5.3 Run Script Seed Data
```sql
\i 'C:/MARKIR/markir-app/database/03_seed_data.sql'
```

**Output yang diharapkan:**
```
INSERT 0 2  (roles)
INSERT 0 2  (users)
INSERT 0 2  (motorcycles)
INSERT 0 2  (promotions)
```

### 5.4 Verify Tables
```sql
-- List tables
\dt

-- Check data
SELECT * FROM users;
SELECT * FROM motorcycles;
SELECT * FROM promotions;
```

**Output yang diharapkan:**
```
                 List of relations
 Schema |       Name        | Type  |    Owner    
--------+-------------------+-------+-------------
 public | audit_logs        | table | markir_user
 public | motorcycles       | table | markir_user
 public | parking_locations | table | markir_user
 public | promotions        | table | markir_user
 public | roles             | table | markir_user
 public | transactions      | table | markir_user
 public | users             | table | markir_user
```

### 5.5 Keluar
```sql
\q
```

---

## 📦 STEP 6: INSTALL NODE DEPENDENCIES (2 menit)

```powershell
cd C:\MARKIR\markir-app\backend

# Install PostgreSQL driver & dotenv
npm install pg dotenv
```

**Output yang diharapkan:**
```
+ pg@8.11.3
+ dotenv@16.3.1
added 15 packages
```

---

## 🔐 STEP 7: CREATE .ENV FILE (1 menit)

### Option A: PowerShell
```powershell
cd C:\MARKIR\markir-app\backend

# Create .env file
@"
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=markir_db
DB_USER=markir_user
DB_PASSWORD=markir2024_secure

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=markir_jwt_secret_key_2024_secure_change_in_production
"@ | Out-File -FilePath .env -Encoding UTF8
```

### Option B: Manual
1. Buka folder `C:\MARKIR\markir-app\backend`
2. Create file baru: `.env` (dengan titik di depan)
3. Copy-paste isi:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=markir_db
DB_USER=markir_user
DB_PASSWORD=markir2024_secure
PORT=3000
NODE_ENV=development
JWT_SECRET=markir_jwt_secret_key_2024_secure
```
4. Save

---

## 🧪 STEP 8: TEST CONNECTION (1 menit)

### Test PostgreSQL Connection dari Node.js
```powershell
cd C:\MARKIR\markir-app\backend

# Run test script
node -e "const { Pool } = require('pg'); require('dotenv').config(); const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD }); pool.query('SELECT NOW() as time, current_database() as db', (err, res) => { if (err) { console.error('❌ Connection FAILED:', err.message); } else { console.log('✅ PostgreSQL Connection SUCCESS!'); console.log('   Database:', res.rows[0].db); console.log('   Time:', res.rows[0].time); } pool.end(); });"
```

**Output yang diharapkan:**
```
✅ PostgreSQL Connection SUCCESS!
   Database: markir_db
   Time: 2025-11-18 ...
```

---

## 🚀 STEP 9: START BACKEND PRODUCTION (FINAL!)

### 9.1 Stop Mock Server (jika masih running)
```powershell
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
```

### 9.2 Start Production Server
```powershell
cd C:\MARKIR\markir-app\backend
node src/index.js
```

**Output yang diharapkan:**
```
╔═══════════════════════════════════════════════╗
║   🚗 MARKIR E-Parking API Server             ║
║   📡 Running on: http://localhost:3000       ║
║   🔧 Mode: PRODUCTION (PostgreSQL)           ║
╚═══════════════════════════════════════════════╝

✅ Connected to PostgreSQL database
Server listening on port 3000
```

### 9.3 Test API (Terminal baru)
```powershell
# Test 1: Health check
Invoke-RestMethod -Uri "http://localhost:3000/" -Method GET

# Test 2: Login
$body = @{email="admin@markir.com";password="admin123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"

# Test 3: Get promotions
Invoke-RestMethod -Uri "http://localhost:3000/api/promotions" -Method GET

# Test 4: NFC Scan
$body = @{nfc_uid="NFC-UID-001"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/nfc/scan" -Method POST -Body $body -ContentType "application/json"
```

---

## ✅ SUCCESS INDICATORS

### Backend Console:
```
✅ Connected to PostgreSQL database
Server listening on port 3000
🔍 Query executed: { text: 'SELECT * FROM users WHERE ...', duration: 5, rows: 1 }
```

### API Responses:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin MARKIR",
    "role": "admin",
    "balance": 1000000
  }
}
```

---

## 🔧 TROUBLESHOOTING

### Problem 1: "psql: command not found"
**Solution:**
1. Restart PowerShell (load new PATH)
2. Atau add manual ke PATH: `C:\Program Files\PostgreSQL\16\bin`

### Problem 2: "password authentication failed"
**Solution:**
```powershell
# Reset password
psql -U postgres
ALTER USER markir_user WITH PASSWORD 'markir2024_secure';
\q
```

### Problem 3: "database does not exist"
**Solution:**
```powershell
psql -U postgres
CREATE DATABASE markir_db OWNER markir_user;
\q
```

### Problem 4: "Cannot find module 'pg'"
**Solution:**
```powershell
cd C:\MARKIR\markir-app\backend
npm install pg dotenv
```

### Problem 5: "Connection refused"
**Solution:**
```powershell
# Check if PostgreSQL service running
Get-Service -Name "postgresql*"

# Start service if stopped
Start-Service -Name "postgresql-x64-16"
```

### Problem 6: Backend error "Cannot read .env"
**Solution:**
1. Check file exists: `Test-Path C:\MARKIR\markir-app\backend\.env`
2. Check file content
3. Remove BOM encoding (save as UTF-8 without BOM)

---

## 📊 AFTER INSTALLATION

### Data You Have Now:
- **Users:** 2 (admin@markir.com, valdo@markir.com)
- **Motorcycles:** 2 (NFC-UID-001, NFC-UID-002)
- **Promotions:** 2 (Diskon Weekend, Promo Platinum)
- **Transactions:** Empty (will be created when testing)

### Test Accounts:
```
Admin:
  Email: admin@markir.com
  Password: admin123
  Balance: Rp 1,000,000

User:
  Email: valdo@markir.com
  Password: valdo123
  Balance: Rp 500,000
```

### pgAdmin 4 (Optional):
1. Open pgAdmin 4 from Start Menu
2. Connect to server: localhost
3. Password: `markir2024_secure`
4. Browse database: markir_db
5. View tables, data, run queries

---

## 🎯 NEXT STEPS AFTER SUCCESS

1. ✅ Backend production running
2. ✅ PostgreSQL database active
3. ⏭️ Start frontend: `npx expo start`
4. ⏭️ Test login in app
5. ⏭️ Test all features (CRUD, NFC, TopUp)

---

## 📞 NEED HELP?

Jika stuck di step tertentu, beritahu saya:
- "Error di step X"
- "Command Y tidak work"
- "Output tidak sesuai"

Saya akan bantu troubleshoot! 🚀

---

**GOOD LUCK! 🐘✨**
