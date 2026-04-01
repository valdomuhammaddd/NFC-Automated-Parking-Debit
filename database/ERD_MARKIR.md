# ERD Database MARKIR E-Parking System

## 📊 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MARKIR E-PARKING DATABASE                            │
│                     Complete Entity Relationship Diagram                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│     ROLES        │
├──────────────────┤
│ PK role_id       │──┐
│    role_name     │  │
│    created_at    │  │
└──────────────────┘  │
                      │ 1
                      │
                      │ N
┌──────────────────────────────────┐
│           USERS                  │
├──────────────────────────────────┤
│ PK user_id                       │──┐─────────────────────┐
│ FK role_id                       │◄─┘                     │
│    email                         │                        │
│    password_hash                 │                        │
│    name                          │                        │
│    phone                         │                        │
│    saldo_ewallet                 │                        │
│    membership_status             │                        │
│    is_active                     │                        │
│    created_at                    │                        │
│    updated_at                    │                        │
└──────────────────────────────────┘                        │
         │ 1                                                │
         │                                                  │
         │ N                                                │
┌──────────────────────────────────┐                        │
│        MOTORCYCLES               │                        │
├──────────────────────────────────┤                        │
│ PK motorcycle_id                 │                        │
│ FK user_id                       │◄───────────────────────┘
│ UK plat_nomor                    │
│ UK nfc_uid ⚡ (KRITIS)           │──┐
│    jenis_kendaraan               │  │
│    merk                          │  │
│    warna                         │  │
│    is_active                     │  │
│    registered_at                 │  │
│    updated_at                    │  │
└──────────────────────────────────┘  │
                                      │ 1
                                      │
                                      │ N
┌──────────────────────────────────────────────────┐
│                TRANSACTIONS                      │
├──────────────────────────────────────────────────┤
│ PK transaction_id                                │
│ FK nfc_uid ⚡ (SCAN NFC)                         │◄─┘
│ FK user_id (Pemilik Kendaraan)                   │◄─────┐
│ FK petugas_id (Admin/Petugas)                    │◄───┐ │
│    plat_nomor                                    │    │ │
│    timestamp                                     │    │ │
│    amount_charged                                │    │ │
│    status_bayar (LUNAS/TERTUNGGAK/PENDING)       │    │ │
│    initial_balance                               │    │ │
│    final_balance                                 │    │ │
│    location                                      │    │ │
│    notes                                         │    │ │
│    created_at                                    │    │ │
└──────────────────────────────────────────────────┘    │ │
                                                        │ │
                                                        │ │
┌──────────────────────────────────┐                    │ │
│       TOP_UP_HISTORY             │                    │ │
├──────────────────────────────────┤                    │ │
│ PK topup_id                      │                    │ │
│ FK user_id                       │◄───────────────────┘ │
│    amount                        │                      │
│    payment_method                │                      │
│    status                        │                      │
│    initial_balance               │                      │
│    final_balance                 │                      │
│    created_at                    │                      │
└──────────────────────────────────┘                      │
                                                          │
                                                          │
┌──────────────────────────────────┐                      │
│         PROMOTIONS               │                      │
├──────────────────────────────────┤                      │
│ PK promotion_id                  │                      │
│ UK code                          │                      │
│    title                         │                      │
│    description                   │                      │
│    discount_type                 │                      │
│    discount_value                │                      │
│    valid_until                   │                      │
│    is_active                     │                      │
│    created_at                    │                      │
│    updated_at                    │                      │
└──────────────────────────────────┘                      │
                                                          │
                                                          │
USERS (as petugas/admin) ────────────────────────────────┘
```

---

## 🔑 Relationships Detail

### 1. **ROLES ──< USERS** (One-to-Many)
- **Cardinality**: 1:N
- **Description**: Setiap role (admin/user) dapat memiliki banyak users
- **Foreign Key**: `users.role_id` → `roles.role_id`
- **Delete Rule**: RESTRICT (tidak boleh hapus role yang masih dipakai)

### 2. **USERS ──< MOTORCYCLES** (One-to-Many)
- **Cardinality**: 1:N
- **Description**: Satu user dapat memiliki banyak kendaraan/NFC tags
- **Foreign Key**: `motorcycles.user_id` → `users.user_id`
- **Delete Rule**: CASCADE (hapus user = hapus semua kendaraannya)

### 3. **MOTORCYCLES ──< TRANSACTIONS** (One-to-Many)
- **Cardinality**: 1:N
- **Description**: Satu kendaraan (NFC tag) dapat memiliki banyak transaksi parkir
- **Foreign Key**: `transactions.nfc_uid` → `motorcycles.nfc_uid`
- **Delete Rule**: RESTRICT (tidak boleh hapus kendaraan yang punya transaksi)
- **⚡ CRITICAL**: `nfc_uid` adalah kunci utama untuk NFC scanning!

### 4. **USERS ──< TRANSACTIONS** (One-to-Many) - Owner
- **Cardinality**: 1:N
- **Description**: Satu user (pemilik) dapat memiliki banyak transaksi parkir
- **Foreign Key**: `transactions.user_id` → `users.user_id`
- **Delete Rule**: RESTRICT (tidak boleh hapus user yang punya transaksi)

### 5. **USERS ──< TRANSACTIONS** (One-to-Many) - Petugas
- **Cardinality**: 1:N
- **Description**: Satu petugas/admin dapat memproses banyak transaksi
- **Foreign Key**: `transactions.petugas_id` → `users.user_id`
- **Delete Rule**: RESTRICT (tidak boleh hapus petugas yang pernah proses transaksi)

### 6. **USERS ──< TOP_UP_HISTORY** (One-to-Many)
- **Cardinality**: 1:N
- **Description**: Satu user dapat memiliki banyak riwayat top up saldo
- **Foreign Key**: `top_up_history.user_id` → `users.user_id`
- **Delete Rule**: CASCADE (hapus user = hapus riwayat top up)

### 7. **PROMOTIONS** (Independent)
- **Cardinality**: N/A
- **Description**: Tabel standalone untuk promo/diskon, belum terintegrasi dengan tabel lain
- **Future**: Bisa ditambahkan relasi ke transactions untuk track penggunaan promo

---

## 📋 Table Details

### **1. ROLES**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| role_id | SERIAL | PK | ID unik role |
| role_name | VARCHAR(50) | UNIQUE, NOT NULL | Nama role: 'admin' atau 'user' |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan |

**Indexes:**
- PRIMARY KEY on `role_id`
- UNIQUE on `role_name`

---

### **2. USERS**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | SERIAL | PK | ID unik user |
| role_id | INTEGER | FK → roles.role_id | Role user (admin/user) |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Email login |
| password_hash | VARCHAR(255) | NOT NULL | Password terenkripsi |
| name | VARCHAR(100) | NOT NULL | Nama lengkap |
| phone | VARCHAR(20) | NULL | Nomor telepon |
| saldo_ewallet | DECIMAL(10,2) | DEFAULT 0, CHECK ≥ 0 | Saldo e-wallet untuk bayar parkir |
| membership_status | VARCHAR(20) | DEFAULT 'Free' | Status membership (Free/Silver/Gold/Platinum) |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif/nonaktif |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu registrasi |
| updated_at | TIMESTAMP | DEFAULT NOW() | Waktu update terakhir |

**Indexes:**
- PRIMARY KEY on `user_id`
- INDEX on `email`
- INDEX on `role_id`
- INDEX on `is_active`

**Triggers:**
- `update_users_updated_at`: Auto-update `updated_at` on UPDATE

**Business Rules:**
- Saldo tidak boleh negatif
- Email harus unik
- Membership status: Free, Silver, Gold, Platinum

---

### **3. MOTORCYCLES**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| motorcycle_id | SERIAL | PK | ID unik kendaraan |
| user_id | INTEGER | FK → users.user_id | Pemilik kendaraan |
| plat_nomor | VARCHAR(15) | UNIQUE, NOT NULL | Plat nomor kendaraan |
| nfc_uid | VARCHAR(50) | UNIQUE, NOT NULL | ⚡ UID dari NFC Tag (KRITIS!) |
| jenis_kendaraan | VARCHAR(10) | NOT NULL | Jenis: 'Motor' atau 'Mobil' |
| merk | VARCHAR(50) | NULL | Merk kendaraan |
| warna | VARCHAR(30) | NULL | Warna kendaraan |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif tag NFC |
| registered_at | TIMESTAMP | DEFAULT NOW() | Waktu registrasi |
| updated_at | TIMESTAMP | DEFAULT NOW() | Waktu update |

**Indexes:**
- PRIMARY KEY on `motorcycle_id`
- UNIQUE INDEX on `nfc_uid` ⚡ (PALING PENTING untuk scan NFC!)
- INDEX on `plat_nomor`
- INDEX on `user_id`
- INDEX on `is_active`

**Triggers:**
- `update_motorcycles_updated_at`: Auto-update `updated_at` on UPDATE

**Business Rules:**
- NFC UID harus unik (1 tag = 1 kendaraan)
- Plat nomor harus unik
- Jenis kendaraan: Motor atau Mobil

---

### **4. TRANSACTIONS**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| transaction_id | SERIAL | PK | ID unik transaksi |
| nfc_uid | VARCHAR(50) | FK → motorcycles.nfc_uid | NFC tag yang di-scan ⚡ |
| user_id | INTEGER | FK → users.user_id | Pemilik kendaraan |
| petugas_id | INTEGER | FK → users.user_id | Admin/petugas yang scan |
| plat_nomor | VARCHAR(15) | NOT NULL | Plat nomor (denormalized) |
| timestamp | TIMESTAMP | NOT NULL | Waktu transaksi |
| amount_charged | DECIMAL(10,2) | NOT NULL, CHECK ≥ 0 | Biaya parkir |
| status_bayar | VARCHAR(15) | NOT NULL | Status: LUNAS/TERTUNGGAK/PENDING |
| initial_balance | DECIMAL(10,2) | NULL | Saldo sebelum transaksi |
| final_balance | DECIMAL(10,2) | NULL | Saldo setelah transaksi |
| location | VARCHAR(100) | NULL | Lokasi parkir |
| notes | TEXT | NULL | Catatan tambahan |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pencatatan |

**Indexes:**
- PRIMARY KEY on `transaction_id`
- INDEX on `nfc_uid` ⚡ (untuk query transaksi per NFC tag)
- INDEX on `user_id`
- INDEX on `petugas_id`
- INDEX on `timestamp DESC` (untuk sorting)
- INDEX on `status_bayar`

**Business Rules:**
- Status bayar: LUNAS (saldo cukup), TERTUNGGAK (saldo kurang), PENDING (proses)
- Amount charged tidak boleh negatif
- Audit trail lengkap dengan initial & final balance

---

### **5. TOP_UP_HISTORY**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| topup_id | SERIAL | PK | ID unik top-up |
| user_id | INTEGER | FK → users.user_id | User yang top-up |
| amount | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Jumlah top-up |
| payment_method | VARCHAR(50) | NOT NULL | Metode: GoPay/OVO/DANA/QRIS/Bank |
| status | VARCHAR(20) | DEFAULT 'PENDING' | Status: PENDING/SUCCESS/FAILED |
| initial_balance | DECIMAL(10,2) | NULL | Saldo sebelum top-up |
| final_balance | DECIMAL(10,2) | NULL | Saldo setelah top-up |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu top-up |

**Indexes:**
- PRIMARY KEY on `topup_id`
- INDEX on `user_id`
- INDEX on `created_at DESC`

**Business Rules:**
- Amount harus > 0
- Status: PENDING (menunggu), SUCCESS (berhasil), FAILED (gagal)

---

### **6. PROMOTIONS**
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| promotion_id | SERIAL | PK | ID unik promosi |
| title | VARCHAR(100) | NOT NULL | Judul promosi |
| description | TEXT | NULL | Deskripsi detail |
| code | VARCHAR(20) | UNIQUE, NOT NULL | Kode promo unik |
| discount_type | VARCHAR(20) | NOT NULL | Tipe: 'percentage' atau 'fixed' |
| discount_value | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Nilai diskon |
| valid_until | TIMESTAMP | NULL | Tanggal kadaluarsa |
| is_active | BOOLEAN | DEFAULT TRUE | Status aktif promo |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan |
| updated_at | TIMESTAMP | DEFAULT NOW() | Waktu update |

**Indexes:**
- PRIMARY KEY on `promotion_id`
- INDEX on `code`
- INDEX on `is_active`

**Triggers:**
- `update_promotions_updated_at`: Auto-update `updated_at` on UPDATE

**Business Rules:**
- Kode promo harus unik
- Discount type: percentage (%) atau fixed (Rp)
- Discount value harus > 0

---

## 🔄 Key Workflows

### **1. NFC Scan Flow (CRITICAL)**
```
1. Admin scan NFC tag → Baca nfc_uid
2. Query: SELECT * FROM motorcycles WHERE nfc_uid = ?
3. Get user_id → Query balance dari users
4. Create transaction → Update user balance
5. INSERT INTO transactions (status_bayar berdasarkan balance)
```

### **2. Top-Up Flow**
```
1. User pilih nominal top-up
2. User pilih payment method
3. INSERT INTO top_up_history (status = 'PENDING')
4. Payment gateway process
5. UPDATE top_up_history SET status = 'SUCCESS'
6. UPDATE users SET saldo_ewallet = saldo_ewallet + amount
```

### **3. Transaction Flow**
```
1. Scan NFC → Get motorcycle data
2. Check user balance
3. Calculate parking fee
4. IF balance >= fee:
     status = 'LUNAS'
     Deduct balance
   ELSE:
     status = 'TERTUNGGAK'
5. INSERT transaction with full audit trail
```

---

## 📊 Database Statistics Capacity

| Table | Max Records (SERIAL) | Current Design |
|-------|---------------------|----------------|
| roles | 2,147,483,647 | 2 (admin, user) |
| users | 2,147,483,647 | 1000+ users |
| motorcycles | 2,147,483,647 | 1000+ NFC tags |
| transactions | 2,147,483,647 | Unlimited (audit trail) |
| top_up_history | 2,147,483,647 | Unlimited |
| promotions | 2,147,483,647 | Flexible |

**Note**: Jika perlu > 2 miliar records, gunakan BIGSERIAL (max: 9,223,372,036,854,775,807)

---

## 🛡️ Security Features

1. **Password**: Hashed dengan bcrypt (password_hash)
2. **Role-Based Access Control (RBAC)**: roles table
3. **Audit Trail**: Semua transaksi tercatat lengkap
4. **Balance Validation**: CHECK constraints untuk saldo tidak negatif
5. **Cascading Deletes**: Otomatis hapus data terkait saat user dihapus

---

## ⚡ Performance Optimizations

1. **Indexes** pada kolom yang sering di-query:
   - `nfc_uid` (UNIQUE) - untuk NFC scan
   - `email` - untuk login
   - `timestamp` - untuk sorting transaksi
   - `status_bayar` - untuk filter status

2. **Triggers** untuk auto-update timestamp

3. **Foreign Keys** dengan proper delete rules

4. **Denormalization**: `plat_nomor` di transactions untuk performa query

---

## 🚀 Future Enhancements

1. **Promotion Usage**: Tambah relasi promotions ↔ transactions
2. **Parking Zones**: Tabel untuk lokasi parkir dengan tarif berbeda
3. **Subscription**: Tabel untuk membership premium
4. **Notifications**: Tabel untuk push notifications
5. **Payment Gateway Integration**: Tabel untuk track payment gateway responses

---

**Generated**: November 26, 2025
**Database**: PostgreSQL 18.1
**Application**: MARKIR E-Parking System
