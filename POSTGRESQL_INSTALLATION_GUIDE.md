# 🐘 PANDUAN INSTALASI & AKTIVASI POSTGRESQL - MARKIR

**Tanggal:** 18 November 2025  
**Status:** PostgreSQL belum terinstall - perlu instalasi manual

---

## 📋 LANGKAH-LANGKAH INSTALASI

### **STEP 1: Download PostgreSQL**

1. Buka browser dan kunjungi: **https://www.postgresql.org/download/windows/**
2. Download **PostgreSQL 16** (versi terbaru) atau minimal versi 14
3. Pilih "Windows x86-64" installer
4. File size sekitar 300-400 MB

**Direct Link:** https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

---

### **STEP 2: Install PostgreSQL**

1. **Run Installer** (double-click file .exe yang sudah didownload)

2. **Installation Directory:**
   ```
   C:\Program Files\PostgreSQL\16
   ```
   (Default - klik Next)

3. **Select Components:**
   - ✅ PostgreSQL Server (wajib)
   - ✅ pgAdmin 4 (GUI tool - recommended)
   - ✅ Stack Builder (optional)
   - ✅ Command Line Tools (wajib)

4. **Data Directory:**
   ```
   C:\Program Files\PostgreSQL\16\data
   ```
   (Default - klik Next)

5. **Superuser Password:**
   ```
   Password: markir2024_secure
   ```
   ⚠️ **PENTING:** Catat password ini! Akan digunakan untuk setup database.

6. **Port:**
   ```
   5432
   ```
   (Default - klik Next)

7. **Locale:**
   ```
   [Default locale]
   ```
   (Klik Next)

8. **Klik "Next" dan tunggu proses instalasi** (3-5 menit)

9. **Finish** - Uncheck "Launch Stack Builder" jika tidak perlu

---

### **STEP 3: Verifikasi Instalasi**

Buka **Command Prompt atau PowerShell baru** dan test:

```powershell
# Test 1: Check versi
psql --version

# Output yang diharapkan:
# psql (PostgreSQL) 16.x

# Test 2: Login sebagai superuser
psql -U postgres

# Masukkan password: markir2024_secure
# Jika berhasil, akan muncul prompt: postgres=#
```

**Jika command `psql` not found**, tambahkan ke PATH:
1. Buka **System Environment Variables**
2. Edit **Path** variable
3. Tambahkan: `C:\Program Files\PostgreSQL\16\bin`
4. Restart PowerShell

---

### **STEP 4: Setup Database MARKIR**

#### **Option A: Menggunakan psql (Command Line)**

```powershell
# 1. Login sebagai postgres
psql -U postgres

# 2. Copy-paste script ini:
CREATE USER markir_user WITH PASSWORD 'markir2024_secure';
CREATE DATABASE markir_db OWNER markir_user;
GRANT ALL PRIVILEGES ON DATABASE markir_db TO markir_user;

# 3. Keluar
\q

# 4. Login ke database markir_db
psql -U markir_user -d markir_db

# 5. Jalankan script create tables
\i 'C:/MARKIR/markir-app/database/02_create_tables.sql'

# 6. Jalankan script seed data
\i 'C:/MARKIR/markir-app/database/03_seed_data.sql'

# 7. Verifikasi tables
\dt

# Output yang diharapkan:
# roles, users, motorcycles, transactions, promotions, parking_locations, audit_logs

# 8. Test query
SELECT * FROM users;

# 9. Keluar
\q
```

#### **Option B: Menggunakan pgAdmin 4 (GUI)**

1. **Buka pgAdmin 4** (Start Menu → pgAdmin 4)

2. **Connect to Server:**
   - Klik "Servers" → "PostgreSQL 16"
   - Masukkan password: `markir2024_secure`

3. **Create Database:**
   - Right-click "Databases" → "Create" → "Database"
   - Database name: `markir_db`
   - Owner: pilih `postgres` dulu
   - Klik "Save"

4. **Create User:**
   - Expand "Login/Group Roles"
   - Right-click → "Create" → "Login/Group Role"
   - Name: `markir_user`
   - Tab "Definition": Password: `markir2024_secure`
   - Tab "Privileges": Aktifkan "Can login"
   - Klik "Save"

5. **Grant Privileges:**
   - Right-click database `markir_db` → "Properties"
   - Tab "Security": Add `markir_user` dengan ALL privileges
   - Klik "Save"

6. **Run SQL Scripts:**
   - Klik database `markir_db`
   - Klik icon "Query Tool" (atau Tools → Query Tool)
   - Klik "Open File" → Pilih `database/02_create_tables.sql`
   - Klik "Execute" (icon play)
   - Ulangi untuk `database/03_seed_data.sql`

7. **Verifikasi:**
   - Di Query Tool, jalankan:
   ```sql
   SELECT * FROM users;
   SELECT * FROM motorcycles;
   SELECT * FROM promotions;
   ```

---

### **STEP 5: Install Node.js Dependencies**

```powershell
cd C:\MARKIR\markir-app\backend
npm install pg dotenv
```

**Output yang diharapkan:**
```
+ pg@8.11.3
+ dotenv@16.3.1
```

---

### **STEP 6: Create .env File**

Buat file `.env` di folder `backend/`:

```powershell
cd C:\MARKIR\markir-app\backend
New-Item -Path ".env" -ItemType File -Force
```

Edit file `.env` dengan isi:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=markir_db
DB_USER=markir_user
DB_PASSWORD=markir2024_secure

# API Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (untuk production, ganti dengan random string)
JWT_SECRET=markir_jwt_secret_key_2024_very_secure_change_in_production
```

---

### **STEP 7: Test PostgreSQL Connection dari Backend**

```powershell
cd C:\MARKIR\markir-app\backend

# Test connection script
node -e "const { Pool } = require('pg'); const pool = new Pool({ host: 'localhost', port: 5432, database: 'markir_db', user: 'markir_user', password: 'markir2024_secure' }); pool.query('SELECT NOW()', (err, res) => { if (err) { console.error('❌ Connection failed:', err.message); } else { console.log('✅ PostgreSQL connected!', res.rows[0]); } pool.end(); });"
```

**Output yang diharapkan:**
```
✅ PostgreSQL connected! { now: 2025-11-18T... }
```

---

### **STEP 8: Update Backend untuk Gunakan PostgreSQL**

Saat ini backend menggunakan file `index-mock.js` (in-memory).  
Untuk menggunakan PostgreSQL, ada 2 file:

1. **`src/index.js`** - Production mode dengan PostgreSQL
2. **`src/index-mock.js`** - Development mode tanpa PostgreSQL (current)

**Check apakah index.js sudah ada:**

```powershell
Test-Path "C:\MARKIR\markir-app\backend\src\index.js"
```

Jika **False**, file belum dibuat. Saya akan membuat file production server.

---

### **STEP 9: Start Backend dengan PostgreSQL**

Setelah semua setup selesai:

```powershell
cd C:\MARKIR\markir-app\backend

# Stop mock server dulu jika masih running
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# Start production server dengan PostgreSQL
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

---

## 🧪 TESTING AFTER ACTIVATION

### **Test 1: Health Check**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/" -Method GET
```

### **Test 2: Login**
```powershell
$body = @{email="admin@markir.com";password="admin123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

### **Test 3: Get Promotions**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/promotions" -Method GET
```

### **Test 4: NFC Scan**
```powershell
$body = @{nfc_uid="NFC-UID-001"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/nfc/scan" -Method POST -Body $body -ContentType "application/json"
```

---

## 📊 COMPARISON: Mock vs PostgreSQL

| Fitur | Mock Mode (Current) | PostgreSQL Mode |
|-------|-------------------|-----------------|
| **Data Storage** | RAM (in-memory) | Disk (persistent) |
| **Data Persistence** | ❌ Hilang saat restart | ✅ Permanent |
| **Concurrent Users** | Limited | Unlimited |
| **Transaction Safety** | No ACID | ✅ ACID compliant |
| **Performance** | Fast (no I/O) | Production-ready |
| **Backup** | ❌ Not possible | ✅ Database backup |
| **Scalability** | Single process | Multi-process |
| **Real-world Ready** | ❌ Testing only | ✅ Production ready |

---

## ⚠️ TROUBLESHOOTING

### **Error: "psql: command not found"**
**Solution:** Tambahkan PostgreSQL ke PATH:
1. System Properties → Environment Variables
2. Edit "Path" variable
3. Add: `C:\Program Files\PostgreSQL\16\bin`
4. Restart terminal

### **Error: "connection refused"**
**Solution:** Start PostgreSQL service:
```powershell
Start-Service -Name "postgresql-x64-16"
```

### **Error: "password authentication failed"**
**Solution:** Reset password:
```powershell
psql -U postgres
ALTER USER markir_user WITH PASSWORD 'markir2024_secure';
```

### **Error: "database does not exist"**
**Solution:** Create database:
```sql
psql -U postgres
CREATE DATABASE markir_db OWNER markir_user;
```

### **Error: "pg module not found"**
**Solution:** Install dependencies:
```powershell
cd backend
npm install pg dotenv
```

---

## 🎯 NEXT STEPS AFTER INSTALLATION

1. ✅ Install PostgreSQL (Step 1-2)
2. ✅ Setup database & user (Step 3-4)
3. ✅ Run SQL scripts (create tables + seed data)
4. ✅ Install npm dependencies (`pg`, `dotenv`)
5. ✅ Create `.env` file
6. ✅ Test connection
7. ✅ Create/Update `src/index.js` untuk production mode
8. ✅ Start backend dengan PostgreSQL
9. ✅ Test semua endpoints
10. ✅ Update frontend jika perlu

---

## 📞 BANTUAN TAMBAHAN

**Jika butuh bantuan, beritahu saya di tahap mana Anda stuck:**
- "PostgreSQL sudah terinstall" → Lanjut ke setup database
- "Database sudah dibuat" → Lanjut ke backend setup
- "Error di step X" → Saya bantu troubleshoot

---

**STATUS SAAT INI:**
- ❌ PostgreSQL: **BELUM TERINSTALL**
- ✅ Mock Backend: Running (in-memory)
- ⏳ Next: Install PostgreSQL dari link di atas

**Download PostgreSQL:**  
👉 https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
