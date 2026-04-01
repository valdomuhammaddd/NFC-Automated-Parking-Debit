# 🧪 MARKIR API Testing Guide

## Status Saat Ini ✅

**Backend Mock Server:**
- ✅ File created: `backend/src/index-mock.js` (460 lines)
- ✅ Running on: `http://localhost:3000`
- ✅ Mode: MOCK (No PostgreSQL required)
- ✅ Mock Data:
  - 2 users (1 admin, 1 user)
  - 2 motorcycles with NFC tags
  - 2 promotions

**Frontend Integration:**
- ✅ API Service Layer: `src/data/api/markir-api.ts` (340 lines)
- ✅ Hybrid Auth Slice: `src/redux/slices/authSlice_api.ts` (310 lines)
- ✅ Switch flag: `USE_BACKEND_API = false` (change to `true` when ready)

---

## 🚀 Quick Start

### 1. Start Mock Server

```bash
cd C:\MARKIR\markir-app\backend
node src/index-mock.js
```

**Expected Output:**
```
╔═══════════════════════════════════════════════╗
║   🚗 MARKIR E-Parking API Server (MOCK)      ║
║   📡 Running on: http://localhost:3000     ║
║   🔧 Mode: MOCK (No PostgreSQL required)     ║
╚═══════════════════════════════════════════════╝

✅ Mock data loaded:
   - 2 users (1 admin, 1 user)
   - 2 motorcycles with NFC tags
   - 2 promotions
```

### 2. Test Dengan Browser

**Health Check:**
```
http://localhost:3000/
```

---

## 📝 Test Accounts

### Admin Account
```json
{
  "email": "admin@markir.com",
  "password": "admin123",
  "saldo_ewallet": 1000000,
  "role": "admin"
}
```

### User Account (Valdo)
```json
{
  "email": "valdo@markir.com",
  "password": "valdo123",
  "saldo_ewallet": 500000,
  "role": "user"
}
```

---

## 🚗 Test Vehicles (NFC Tags)

### Honda Vario
```json
{
  "nfc_uid": "NFC-UID-001",
  "plat_nomor": "B1234ABC",
  "merk": "Honda Vario",
  "warna": "Merah",
  "owner": "Valdo Rinaldi"
}
```

### Yamaha Mio
```json
{
  "nfc_uid": "NFC-UID-002",
  "plat_nomor": "B5678DEF",
  "merk": "Yamaha Mio",
  "warna": "Hitam",
  "owner": "Valdo Rinaldi"
}
```

---

## 🧪 API Endpoint Tests

### 1. Authentication

#### Login Admin
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
    "token": "mock_jwt_token_1_1234567890",
    "user": {
      "user_id": 1,
      "email": "admin@markir.com",
      "name": "Admin MARKIR",
      "role": "admin",
      "saldo_ewallet": 1000000,
      "membership_status": "Platinum"
    }
  }
}
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"valdo@markir.com\",\"password\":\"valdo123\"}"
```

### 2. NFC Operations (CRITICAL)

#### Scan NFC Tag - Honda Vario
```bash
curl -X POST http://localhost:3000/api/nfc/scan \
  -H "Content-Type: application/json" \
  -d "{\"nfc_uid\":\"NFC-UID-001\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Kendaraan ditemukan",
  "data": {
    "vehicle": {
      "motorcycle_id": 1,
      "plat_nomor": "B1234ABC",
      "nfc_uid": "NFC-UID-001",
      "jenis_kendaraan": "Motor",
      "merk": "Honda Vario",
      "warna": "Merah"
    },
    "owner": {
      "user_id": 3,
      "name": "Valdo Rinaldi",
      "email": "valdo@markir.com",
      "phone": "081234567892",
      "saldo_ewallet": 500000,
      "membership_status": "Gold"
    },
    "last_transaction": null
  }
}
```

#### Register New NFC Tag
```bash
curl -X POST http://localhost:3000/api/nfc/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":3,\"plat_nomor\":\"B9999XYZ\",\"nfc_uid\":\"NFC-UID-003\",\"jenis_kendaraan\":\"Motor\",\"merk\":\"Yamaha NMAX\",\"warna\":\"Putih\"}"
```

### 3. Transactions

#### Create Transaction - Sufficient Balance (LUNAS)
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"nfc_uid\":\"NFC-UID-001\",\"petugas_id\":1,\"amount_charged\":5000,\"location\":\"Parkir Utama\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Transaksi berhasil dibuat",
  "data": {
    "transaction_id": 1,
    "nfc_uid": "NFC-UID-001",
    "plat_nomor": "B1234ABC",
    "status_bayar": "LUNAS",
    "amount_charged": 5000,
    "initial_balance": 500000,
    "final_balance": 495000,
    "location": "Parkir Utama"
  }
}
```

#### Create Transaction - Insufficient Balance (TERTUNGGAK)
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"nfc_uid\":\"NFC-UID-001\",\"petugas_id\":1,\"amount_charged\":600000,\"location\":\"Parkir Utama\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Transaksi berhasil dibuat",
  "data": {
    "status_bayar": "TERTUNGGAK",
    "amount_charged": 600000,
    "initial_balance": 500000,
    "final_balance": 500000
  }
}
```

#### Get All Transactions
```bash
curl http://localhost:3000/api/transactions
```

### 4. Users Management

#### Get All Users
```bash
curl http://localhost:3000/api/users
```

#### Top Up Balance
```bash
curl -X POST http://localhost:3000/api/users/3/topup \
  -H "Content-Type: application/json" \
  -d "{\"amount\":100000,\"payment_method\":\"Virtual Account\"}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Top up berhasil",
  "data": {
    "user_id": 3,
    "initial_balance": 500000,
    "amount": 100000,
    "final_balance": 600000
  }
}
```

### 5. Promotions Management

#### Get All Promotions
```bash
curl http://localhost:3000/api/promotions
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "promotion_id": 1,
      "title": "Diskon Member Baru",
      "description": "Dapatkan diskon 50% untuk transaksi pertama!",
      "code": "FIRST50",
      "discount_type": "percentage",
      "discount_value": 50,
      "is_active": true
    },
    {
      "promotion_id": 2,
      "title": "Top Up Bonus 10%",
      "code": "TOPUP10",
      "discount_type": "percentage",
      "discount_value": 10,
      "is_active": true
    }
  ]
}
```

#### Create New Promotion
```bash
curl -X POST http://localhost:3000/api/promotions \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Diskon Weekend\",\"description\":\"Diskon khusus akhir pekan\",\"code\":\"WEEKEND20\",\"discount_type\":\"percentage\",\"discount_value\":20}"
```

#### Update Promotion
```bash
curl -X PUT http://localhost:3000/api/promotions/1 \
  -H "Content-Type: application/json" \
  -d "{\"discount_value\":60}"
```

#### Delete Promotion
```bash
curl -X DELETE http://localhost:3000/api/promotions/1
```

---

## 🔄 Frontend Integration Steps

### Step 1: Activate API in Redux

Edit `src/redux/slices/authSlice_api.ts`:
```typescript
// Change line 26:
const USE_BACKEND_API = true; // Change to true
```

### Step 2: Replace Auth Slice in Store

Edit `src/redux/store.ts`:
```typescript
// Replace import
import authReducer from './slices/authSlice_api'; // Use API version

export const store = configureStore({
  reducer: {
    auth: authReducer, // Now using backend API
    // ... other reducers
  },
});
```

### Step 3: Update LoginScreen

`src/screens/auth/LoginScreen.tsx` already uses:
```typescript
dispatch(loginWithEmail({ email, password }));
```
✅ No changes needed! It will automatically use backend when flag is true.

### Step 4: Update NFCPaymentScreen

Replace mock data with API calls:
```typescript
import * as MarkirAPI from '../../data/api/markir-api';

// In handleScan function:
const handleScan = async (tagId: string) => {
  try {
    setIsScanning(true);
    
    // Call API instead of mock
    const response = await MarkirAPI.nfcScan(tagId);
    
    if (response.success) {
      setVehicleData(response.data.vehicle);
      setOwnerData(response.data.owner);
      setLastTransaction(response.data.last_transaction);
      setStep('confirm');
    }
  } catch (error) {
    Alert.alert('Error', 'Kendaraan tidak ditemukan');
  } finally {
    setIsScanning(false);
  }
};
```

### Step 5: Update PenagihanScreen

Replace transaction creation:
```typescript
import * as MarkirAPI from '../../data/api/markir-api';

const handleCreateTransaction = async () => {
  try {
    const response = await MarkirAPI.createTransaction({
      nfc_uid: vehicleData.nfc_uid,
      petugas_id: currentUser.id, // From Redux auth state
      amount_charged: totalCharge,
      location: 'Parkir Utama',
    });
    
    if (response.success) {
      if (response.data.status_bayar === 'LUNAS') {
        // Update user balance in Redux
        dispatch(updateUserBalance(response.data.final_balance));
        Alert.alert('✅ Pembayaran LUNAS', `Sisa saldo: Rp ${response.data.final_balance.toLocaleString()}`);
      } else {
        Alert.alert('⚠️ Status TERTUNGGAK', 'Saldo tidak cukup');
      }
    }
  } catch (error) {
    Alert.alert('Error', 'Gagal membuat transaksi');
  }
};
```

### Step 6: Update TopUpScreen

```typescript
import * as MarkirAPI from '../../data/api/markir-api';

const handleTopUp = async () => {
  try {
    const response = await MarkirAPI.topUpBalance(
      currentUser.id,
      selectedAmount,
      selectedPaymentMethod
    );
    
    if (response.success) {
      dispatch(updateUserBalance(response.data.final_balance));
      Alert.alert('✅ Top Up Berhasil', `Saldo baru: Rp ${response.data.final_balance.toLocaleString()}`);
      navigation.goBack();
    }
  } catch (error) {
    Alert.alert('Error', 'Top up gagal');
  }
};
```

### Step 7: Update ManagePromotionsScreen

```typescript
import * as MarkirAPI from '../../data/api/markir-api';
import { useEffect, useState } from 'react';

// Load promotions from API
useEffect(() => {
  loadPromotions();
}, []);

const loadPromotions = async () => {
  try {
    const response = await MarkirAPI.getPromotions();
    if (response.success) {
      setPromotions(response.data);
    }
  } catch (error) {
    console.error('Failed to load promotions:', error);
  }
};

// Save promotion
const handleSave = async () => {
  try {
    if (editingPromotion) {
      // Update
      await MarkirAPI.updatePromotion(editingPromotion.promotion_id, formData);
    } else {
      // Create
      await MarkirAPI.createPromotion(formData);
    }
    
    loadPromotions(); // Reload list
    setModalVisible(false);
  } catch (error) {
    Alert.alert('Error', 'Gagal menyimpan promosi');
  }
};

// Delete promotion
const handleDelete = async (id: number) => {
  Alert.alert(
    'Konfirmasi',
    'Hapus promosi ini?',
    [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await MarkirAPI.deletePromotion(id);
            loadPromotions();
          } catch (error) {
            Alert.alert('Error', 'Gagal menghapus promosi');
          }
        },
      },
    ]
  );
};
```

---

## 🔄 Switching to Real PostgreSQL Backend

When ready to use real PostgreSQL database:

### 1. Install PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- Install with default settings
- Remember the password for `postgres` user

### 2. Run Database Scripts
```bash
# Open psql or pgAdmin
psql -U postgres

# Run scripts in order:
\i 'C:/MARKIR/markir-app/database/01_setup_database.sql'
\c markir_db
\i 'C:/MARKIR/markir-app/database/02_create_tables.sql'
\i 'C:/MARKIR/markir-app/database/03_seed_data.sql'
```

### 3. Verify Database
```sql
SELECT COUNT(*) FROM users;     -- Should be 1002
SELECT COUNT(*) FROM motorcycles; -- Should be 1000
SELECT * FROM users WHERE email = 'admin@markir.com';
```

### 4. Update Backend Configuration

No changes needed! The `.env` file is already configured:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=markir_db
DB_USER=markir_user
DB_PASSWORD=markir2024_secure
```

### 5. Switch Backend Server

**Stop mock server:**
```bash
# Ctrl+C in terminal running mock server
```

**Start real backend:**
```bash
cd backend
node src/index.js  # NOT index-mock.js
```

**Expected output:**
```
✅ Connected to PostgreSQL database
🚗 MARKIR E-Parking API Server
📡 Running on: http://localhost:3000
```

### 6. Update Frontend Flag

Edit `src/redux/slices/authSlice_api.ts`:
```typescript
const USE_BACKEND_API = true; // Already true from Step 1 above
```

### 7. Test Everything!

All API calls will now use real PostgreSQL database with 1000+ users and vehicles.

---

## 📊 Mock vs Real Backend Comparison

| Feature | Mock Backend | Real PostgreSQL Backend |
|---------|-------------|------------------------|
| **Setup Time** | ✅ Instant | ⏳ 30-60 minutes |
| **Data Persistence** | ❌ Lost on restart | ✅ Permanent |
| **Capacity** | 🔸 2 users, 2 vehicles | ✅ 1000+ users, 1000+ vehicles |
| **Performance** | ✅ Fast (in-memory) | ✅ Fast (indexed queries) |
| **Transactions** | ✅ Works | ✅ ACID compliant |
| **Production Ready** | ❌ Testing only | ✅ Yes |
| **Code Changes** | 0️⃣ Zero | 0️⃣ Zero (same API structure) |

---

## ✅ Current Status Summary

### Completed ✅
- [x] Mock backend server created (`backend/src/index-mock.js`)
- [x] API service layer (`src/data/api/markir-api.ts`)
- [x] Hybrid auth slice (`src/redux/slices/authSlice_api.ts`)
- [x] PostgreSQL database schema (3 SQL scripts)
- [x] Real backend API (`backend/src/index.js`)
- [x] Documentation complete

### Next Steps ⏭️
1. **Start mock server** (IMMEDIATE)
2. **Test endpoints** with curl/browser
3. **Update frontend screens** to use API
4. **Test full flow**: Login → NFC Scan → Transaction
5. **Install PostgreSQL** (when ready)
6. **Switch to real backend** (flip one flag)

---

## 🆘 Troubleshooting

### Server Won't Start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID <PID> /F
```

### Cannot Connect to Server
- Check if server is running: `curl http://localhost:3000/`
- Check firewall settings
- Verify correct IP address in `markir-api.ts`

### "Network Error" in Frontend
- Ensure backend server is running
- Check `BASE_URL` in `src/data/api/markir-api.ts`
- For React Native: Use local IP (192.168.x.x) not localhost
- Auto-fallback to mock mode should work

---

## 📚 Related Documentation

- `database/POSTGRESQL_SETUP_GUIDE.md` - Complete PostgreSQL setup
- `database/API_DOCUMENTATION.md` - Full API reference
- `INTEGRATION_STATUS_COMPLETE.md` - Integration checklist
- `QUICK_START_INTEGRATION.md` - Quick start guide

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Mock backend running ✅
