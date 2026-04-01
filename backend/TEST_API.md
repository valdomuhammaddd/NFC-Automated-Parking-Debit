# Quick API Test

## 1. Start Server

```bash
cd C:\MARKIR\markir-app\backend
node src/index-mock.js
```

Server akan jalan di `http://localhost:3000`

---

## 2. Test di Browser

Buka browser dan test endpoints ini:

### Health Check
```
http://localhost:3000/
```

### Get Promotions
```
http://localhost:3000/api/promotions
```

### Get Users
```
http://localhost:3000/api/users
```

### Get Transactions
```
http://localhost:3000/api/transactions
```

---

## 3. Test Login (PowerShell)

```powershell
$body = @{email="admin@markir.com"; password="admin123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "mock_jwt_token_1_...",
    "user": {
      "email": "admin@markir.com",
      "saldo_ewallet": 1000000,
      "role": "admin"
    }
  }
}
```

---

## 4. Test NFC Scan (PowerShell)

```powershell
$body = @{nfc_uid="NFC-UID-001"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/nfc/scan" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "vehicle": {
      "plat_nomor": "B1234ABC",
      "nfc_uid": "NFC-UID-001",
      "merk": "Honda Vario"
    },
    "owner": {
      "name": "Valdo Rinaldi",
      "email": "valdo@markir.com",
      "saldo_ewallet": 500000
    }
  }
}
```

---

## 5. Test Create Transaction (PowerShell)

```powershell
$body = @{
  nfc_uid="NFC-UID-001"
  petugas_id=1
  amount_charged=5000
  location="Parkir Utama"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/transactions" -Method POST -Body $body -ContentType "application/json"
```

**Expected Response (LUNAS):**
```json
{
  "success": true,
  "data": {
    "status_bayar": "LUNAS",
    "amount_charged": 5000,
    "initial_balance": 500000,
    "final_balance": 495000
  }
}
```

---

## 🎯 Frontend Integration

### Step 1: Activate Backend API

Edit `src/redux/slices/authSlice_api.ts` line 26:
```typescript
const USE_BACKEND_API = true; // Change to true
```

### Step 2: Update Store

Edit `src/redux/store.ts`:
```typescript
import authReducer from './slices/authSlice_api';
```

### Step 3: Test Login

1. Start mock server
2. Open app
3. Login dengan:
   - Email: `admin@markir.com`
   - Password: `admin123`

Should work! Console akan show: `🌐 [Auth] Using Backend API`

---

## 📱 Test Accounts

| Email | Password | Balance | Role |
|-------|----------|---------|------|
| admin@markir.com | admin123 | 1,000,000 | admin |
| valdo@markir.com | valdo123 | 500,000 | user |

## 🚗 Test Vehicles

| NFC UID | Plat | Merk | Owner |
|---------|------|------|-------|
| NFC-UID-001 | B1234ABC | Honda Vario | Valdo |
| NFC-UID-002 | B5678DEF | Yamaha Mio | Valdo |

---

## ✅ Success Checklist

- [ ] Server started successfully
- [ ] Health check returns JSON
- [ ] Login admin works
- [ ] NFC scan returns vehicle data
- [ ] Transaction created with LUNAS status
- [ ] Balance deducted correctly
- [ ] Frontend login works with backend

---

**Happy Testing! 🎉**
