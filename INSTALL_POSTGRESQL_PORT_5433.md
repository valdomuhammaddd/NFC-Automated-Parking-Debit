# 🚀 Install PostgreSQL di Port 5433 (Bypass Conflict)

## Karena port 5432 terblok, install di port 5433 saja!

### 1. Download PostgreSQL
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- Pilih: **PostgreSQL 16.x Windows x86-64**

### 2. Run Installer
- **Run as Administrator** (klik kanan installer → Run as Administrator)

### 3. Installation Steps
```
Components: [✓] PostgreSQL Server
            [✓] pgAdmin 4
            [✓] Command Line Tools

Password: markir2024_secure
          (password untuk user 'postgres')

Port: 5433  ← PENTING! Ganti dari 5432 ke 5433

Locale: [Default locale]
```

### 4. Install Dependencies
```powershell
cd c:\MARKIR\markir-app\backend
npm install pg dotenv
```

### 5. Create .env File
```env
DB_HOST=localhost
DB_PORT=5433
DB_NAME=markir_db
DB_USER=markir_user
DB_PASSWORD=markir2024_secure
PORT=3000
NODE_ENV=development
JWT_SECRET=markir_jwt_secret_key_2024_secure
```

### 6. Setup Database
```powershell
# Connect ke PostgreSQL
psql -U postgres -p 5433

# Jalankan di psql:
CREATE USER markir_user WITH PASSWORD 'markir2024_secure';
CREATE DATABASE markir_db OWNER markir_user;
GRANT ALL PRIVILEGES ON DATABASE markir_db TO markir_user;
\q
```

### 7. Run SQL Scripts
```powershell
cd c:\MARKIR\markir-app\database
psql -U markir_user -d markir_db -p 5433 -f 02_create_tables.sql
psql -U markir_user -d markir_db -p 5433 -f 03_seed_data.sql
```

### 8. Update Database Config
Edit `backend/src/config/database.js`:
```javascript
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,  // ← Ganti ke 5433
  database: process.env.DB_NAME || 'markir_db',
  user: process.env.DB_USER || 'markir_user',
  password: process.env.DB_PASSWORD || 'markir2024_secure',
});
```

### 9. Start Production Backend
```powershell
cd c:\MARKIR\markir-app\backend
node src/index.js
```

### 10. Test API
```powershell
curl http://localhost:3000/
curl http://localhost:3000/api/users
```

## ✅ DONE! PostgreSQL berjalan di port 5433, tidak ada conflict!
