# 📡 MARKIR E-Parking API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Authentication

### POST `/auth/login`
Login dengan email dan password.

**Request Body:**
```json
{
  "email": "admin@markir.com",
  "password": "admin123"
}
```

**Response (Success):**
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
      "phone": "081234567890",
      "role": "admin",
      "saldo_ewallet": 1000000,
      "membership_status": "Platinum"
    }
  }
}
```

### POST `/auth/register`
Registrasi user baru.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "phone": "08123456789",
  "role": "user"
}
```

---

## 📡 NFC Operations

### POST `/nfc/scan`
**[KUNCI UTAMA]** Scan NFC Tag untuk mendapatkan data kendaraan dan owner.

**Request Body:**
```json
{
  "nfc_uid": "NFC-UID-001"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Data kendaraan berhasil ditemukan",
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
    "last_transaction": {
      "status_bayar": "LUNAS",
      "amount_charged": 5000,
      "timestamp": "2024-11-17T10:30:00Z"
    }
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "NFC Tag tidak terdaftar atau tidak aktif",
  "nfc_uid": "NFC-UID-999"
}
```

### POST `/nfc/register`
**[NFC WRITE]** Register kendaraan baru dengan NFC Tag.

**Request Body:**
```json
{
  "user_id": 3,
  "plat_nomor": "B5555XYZ",
  "nfc_uid": "NFC-UID-NEW-001",
  "jenis_kendaraan": "Motor",
  "merk": "Yamaha Nmax",
  "warna": "Hitam"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Kendaraan berhasil didaftarkan dengan NFC Tag",
  "data": {
    "motorcycle_id": 1001,
    "user_id": 3,
    "plat_nomor": "B5555XYZ",
    "nfc_uid": "NFC-UID-NEW-001",
    "jenis_kendaraan": "Motor",
    "merk": "Yamaha Nmax",
    "warna": "Hitam",
    "registered_at": "2024-11-17T10:00:00Z"
  }
}
```

**Response (Conflict):**
```json
{
  "success": false,
  "message": "NFC UID sudah terdaftar untuk kendaraan lain",
  "existing_plat": "B1234ABC"
}
```

### PUT `/nfc/update/:nfc_uid`
Update data kendaraan berdasarkan NFC UID.

**Request Body:**
```json
{
  "plat_nomor": "B5555NEW",
  "merk": "Yamaha Aerox",
  "warna": "Biru",
  "is_active": true
}
```

---

## 💳 Transactions

### POST `/transactions`
Buat transaksi parkir (dengan pengecekan saldo otomatis).

**Request Body:**
```json
{
  "nfc_uid": "NFC-UID-001",
  "petugas_id": 1,
  "amount_charged": 5000,
  "location": "Parkir Mall A",
  "notes": "Parkir 2 jam"
}
```

**Response (LUNAS - Saldo Cukup):**
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
    "final_balance": 495000,
    "timestamp": "2024-11-17T10:30:00Z",
    "location": "Parkir Mall A"
  }
}
```

**Response (TERTUNGGAK - Saldo Tidak Cukup):**
```json
{
  "success": true,
  "message": "Saldo tidak cukup - Status TERTUNGGAK",
  "data": {
    "transaction_id": 124,
    "nfc_uid": "NFC-UID-003",
    "plat_nomor": "B9012GHI",
    "amount_charged": 10000,
    "status_bayar": "TERTUNGGAK",
    "initial_balance": 5000,
    "final_balance": 5000,
    "timestamp": "2024-11-17T10:35:00Z"
  }
}
```

### GET `/transactions`
Get semua transaksi dengan pagination dan filter.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status_bayar` (LUNAS | TERTUNGGAK | PENDING)
- `user_id` (filter by user)
- `petugas_id` (filter by petugas)
- `start_date` (YYYY-MM-DD)
- `end_date` (YYYY-MM-DD)

**Example Request:**
```
GET /transactions?page=1&limit=10&status_bayar=LUNAS
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "transaction_id": 1,
      "nfc_uid": "NFC-UID-001",
      "plat_nomor": "B1234ABC",
      "user_name": "Valdo Rinaldi",
      "user_email": "valdo@markir.com",
      "petugas_name": "Admin MARKIR",
      "amount_charged": 5000,
      "status_bayar": "LUNAS",
      "initial_balance": 500000,
      "final_balance": 495000,
      "location": "Parkir Mall A",
      "timestamp": "2024-11-17T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1234,
    "total_pages": 124
  }
}
```

### GET `/transactions/:id`
Get detail transaksi by ID.

---

## 👥 Users

### GET `/users`
Get semua users dengan pagination dan filter.

**Query Parameters:**
- `page`, `limit`
- `role` (admin | user)
- `membership_status` (Free | Silver | Gold | Platinum)
- `is_active` (true | false)
- `search` (cari by name atau email)

**Example:**
```
GET /users?page=1&limit=20&role=user&membership_status=Gold
```

### GET `/users/:id`
Get detail user by ID (dengan data kendaraan dan transaksi).

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 3,
    "email": "valdo@markir.com",
    "name": "Valdo Rinaldi",
    "phone": "081234567892",
    "role": "user",
    "saldo_ewallet": 500000,
    "membership_status": "Gold",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "motorcycles": [
      {
        "motorcycle_id": 1,
        "plat_nomor": "B1234ABC",
        "nfc_uid": "NFC-UID-001",
        "jenis_kendaraan": "Motor",
        "merk": "Honda Vario"
      }
    ],
    "recent_transactions": [...]
  }
}
```

### POST `/users/:id/topup`
Top up saldo user.

**Request Body:**
```json
{
  "amount": 100000,
  "payment_method": "Bank Transfer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Top up berhasil",
  "data": {
    "user_id": 3,
    "amount": 100000,
    "initial_balance": 500000,
    "final_balance": 600000,
    "payment_method": "Bank Transfer"
  }
}
```

### PUT `/users/:id`
Update data user.

**Request Body:**
```json
{
  "name": "Valdo Updated",
  "phone": "08199999999",
  "membership_status": "Platinum",
  "is_active": true
}
```

---

## 🚗 Motorcycles

### GET `/motorcycles`
Get semua kendaraan dengan pagination dan filter.

**Query Parameters:**
- `page`, `limit`
- `user_id` (filter by owner)
- `jenis_kendaraan` (Motor | Mobil)
- `is_active` (true | false)
- `search` (cari by plat nomor atau NFC UID)

### GET `/motorcycles/:id`
Get detail kendaraan by ID.

### DELETE `/motorcycles/:id`
Hapus kendaraan.

---

## 🎉 Promotions

### GET `/promotions`
Get semua promosi.

**Query Parameters:**
- `is_active` (true | false)
- `search` (cari by title atau code)

**Response:**
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
      "valid_until": "2025-12-31T23:59:59Z",
      "is_active": true
    }
  ]
}
```

### POST `/promotions`
Buat promosi baru.

**Request Body:**
```json
{
  "title": "Promo Akhir Tahun",
  "description": "Diskon 30% untuk semua transaksi bulan Desember",
  "code": "DEC30",
  "discount_type": "percentage",
  "discount_value": 30,
  "valid_until": "2024-12-31T23:59:59",
  "is_active": true
}
```

### PUT `/promotions/:id`
Update promosi.

### DELETE `/promotions/:id`
Hapus promosi.

---

## 🔑 Key Concepts

### NFC Scanning Flow
1. **Tap NFC Tag** → Dapatkan `nfc_uid`
2. **POST `/nfc/scan`** dengan `nfc_uid`
3. **Terima data:** Vehicle info + Owner info + Balance
4. **Proses pembayaran:** POST `/transactions`
5. **Status:** LUNAS (balance cukup) atau TERTUNGGAK (balance tidak cukup)

### NFC Writing Flow
1. **Admin/Petugas** pilih user dari database
2. **Input** plat nomor dan data kendaraan
3. **Write ke NFC Tag** → Dapatkan `nfc_uid` dari tag
4. **POST `/nfc/register`** dengan data lengkap
5. **Kendaraan terdaftar** → Siap digunakan untuk parkir

### Transaction Logic
- Jika `saldo_ewallet >= amount_charged` → **LUNAS**, saldo dikurangi
- Jika `saldo_ewallet < amount_charged` → **TERTUNGGAK**, saldo tidak berubah
- Semua transaksi disimpan untuk audit trail (PAD)

---

## 🛡️ Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | OK | Request berhasil |
| 201 | Created | Resource berhasil dibuat |
| 400 | Bad Request | Input tidak valid |
| 401 | Unauthorized | Authentication gagal |
| 404 | Not Found | Resource tidak ditemukan |
| 409 | Conflict | Data sudah exists (duplicate) |
| 500 | Internal Server Error | Error di server |

---

## 📝 Notes

- Semua endpoint mengembalikan JSON
- Untuk endpoint yang memerlukan authentication, tambahkan header:
  ```
  Authorization: Bearer <token>
  ```
- `nfc_uid` adalah **kunci kritis** untuk semua operasi NFC
- Foreign key `motorcycles.nfc_uid` → `transactions.nfc_uid` menjamin data tepat

---

🚀 **Happy API Testing!**
