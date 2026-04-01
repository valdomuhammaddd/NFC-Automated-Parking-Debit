# QUICK SETUP COMMANDS - RUN AFTER POSTGRESQL INSTALLED
# Copy-paste ini ke PowerShell setelah PostgreSQL selesai diinstall

# ========================================
# STEP 1: VERIFY INSTALLATION
# ========================================
Write-Host "`n🔍 Verifying PostgreSQL installation..." -ForegroundColor Cyan
psql --version

# ========================================
# STEP 2: SETUP DATABASE (Manual - psql)
# ========================================
Write-Host "`n📊 Next: Create database and user" -ForegroundColor Yellow
Write-Host "Run this command:" -ForegroundColor White
Write-Host "  psql -U postgres`n" -ForegroundColor Cyan
Write-Host "Then copy-paste these SQL commands:" -ForegroundColor White
Write-Host @"

CREATE USER markir_user WITH PASSWORD 'markir2024_secure';
CREATE DATABASE markir_db OWNER markir_user;
GRANT ALL PRIVILEGES ON DATABASE markir_db TO markir_user;
\l
\q

"@ -ForegroundColor Gray

# Press Enter to continue
Read-Host "Press ENTER after database created"

# ========================================
# STEP 3: RUN SQL SCRIPTS
# ========================================
Write-Host "`n📋 Running SQL scripts..." -ForegroundColor Cyan

$sqlPath = "C:\MARKIR\markir-app\database"
$psqlExe = "C:\Program Files\PostgreSQL\16\bin\psql.exe"

if (Test-Path $psqlExe) {
    Write-Host "✅ Found psql.exe" -ForegroundColor Green
    
    Write-Host "`nRunning 02_create_tables.sql..." -ForegroundColor Yellow
    & $psqlExe -U markir_user -d markir_db -f "$sqlPath\02_create_tables.sql"
    
    Write-Host "`nRunning 03_seed_data.sql..." -ForegroundColor Yellow
    & $psqlExe -U markir_user -d markir_db -f "$sqlPath\03_seed_data.sql"
    
    Write-Host "`n✅ SQL scripts completed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  psql.exe not found. Run manually:" -ForegroundColor Yellow
    Write-Host "  psql -U markir_user -d markir_db" -ForegroundColor Cyan
    Write-Host "  \i 'C:/MARKIR/markir-app/database/02_create_tables.sql'" -ForegroundColor Gray
    Write-Host "  \i 'C:/MARKIR/markir-app/database/03_seed_data.sql'" -ForegroundColor Gray
    Write-Host "  \q" -ForegroundColor Gray
}

# ========================================
# STEP 4: INSTALL NPM DEPENDENCIES
# ========================================
Write-Host "`n📦 Installing npm dependencies..." -ForegroundColor Cyan
Set-Location "C:\MARKIR\markir-app\backend"
npm install pg dotenv

# ========================================
# STEP 5: CREATE .ENV FILE
# ========================================
Write-Host "`n🔐 Creating .env file..." -ForegroundColor Cyan
$envContent = @"
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
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8 -NoNewline
Write-Host "✅ .env file created" -ForegroundColor Green

# ========================================
# STEP 6: TEST CONNECTION
# ========================================
Write-Host "`n🧪 Testing PostgreSQL connection..." -ForegroundColor Cyan
node -e "const { Pool } = require('pg'); require('dotenv').config(); const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD }); pool.query('SELECT NOW() as time, current_database() as db, COUNT(*) as users FROM users', (err, res) => { if (err) { console.error('❌ Connection FAILED:', err.message); } else { console.log('✅ PostgreSQL Connection SUCCESS!'); console.log('   Database:', res.rows[0].db); console.log('   Time:', res.rows[0].time); console.log('   Users in DB:', res.rows[0].users); } pool.end(); });"

# ========================================
# STEP 7: START BACKEND
# ========================================
Write-Host "`n🚀 Ready to start backend!" -ForegroundColor Green
Write-Host "`nTo start production server:" -ForegroundColor Yellow
Write-Host "  node src/index.js`n" -ForegroundColor Cyan

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════`n" -ForegroundColor Gray
