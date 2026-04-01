# CATATAN SIDANG SEMINAR PROPOSAL
## MARKIR E-Parking System

**Nama Aplikasi**: MARKIR (Mobile Application for Parking with IoT Recognition)  
**Tanggal**: November 26, 2025  
**Mahasiswa**: Valdo Muhammad  
**Dosen Pembimbing**: [Nama Dosen]

---

## 📱 TEKNOLOGI & FRAMEWORK

### **Frontend (Mobile Application)**

#### 1. **React Native**
- **Versi**: Latest (Expo SDK compatible)
- **Definisi**: Framework JavaScript untuk membangun aplikasi mobile native (Android & iOS) menggunakan React
- **Keunggulan**:
  - Cross-platform (1 codebase untuk Android & iOS)
  - Hot reload untuk development cepat
  - Performa mendekati native app
  - Ekosistem library yang besar
- **Use Case di MARKIR**: Membangun antarmuka mobile untuk user dan admin

#### 2. **Expo**
- **Versi**: Latest
- **Definisi**: Platform dan framework untuk React Native yang mempercepat development dan deployment
- **Keunggulan**:
  - Development lebih cepat dengan managed workflow
  - Built-in API untuk camera, location, NFC
  - EAS Build untuk compile APK/IPA
  - OTA (Over-The-Air) updates
- **Use Case di MARKIR**: Manajemen project, build APK, dan akses NFC hardware

#### 3. **TypeScript**
- **Versi**: ^5.x
- **Definisi**: Superset JavaScript dengan static typing
- **Keunggulan**:
  - Type safety untuk mengurangi bug
  - Better IDE support (autocomplete, refactoring)
  - Self-documenting code
- **Use Case di MARKIR**: Semua kode frontend ditulis dengan TypeScript untuk maintainability

#### 4. **Redux Toolkit (@reduxjs/toolkit)**
- **Versi**: ^2.x
- **Definisi**: State management library untuk aplikasi JavaScript/React
- **Keunggulan**:
  - Centralized state management
  - Predictable state updates
  - DevTools untuk debugging
  - Redux Toolkit menyederhanakan boilerplate code
- **Use Case di MARKIR**: Manage global state (user login, balance, transactions, promotions)

#### 5. **React Navigation**
- **Versi**: ^6.x
- **Definisi**: Routing dan navigation library untuk React Native
- **Komponen**:
  - Stack Navigator (untuk screen stack)
  - Bottom Tab Navigator (untuk tab navigation)
  - Custom Tab Bar (FAB untuk NFC scan)
- **Use Case di MARKIR**: Navigasi antar screen (Login, Home, NFC Scan, History, dll)

#### 6. **Expo Linear Gradient**
- **Definisi**: Library untuk membuat gradient background
- **Use Case di MARKIR**: UI/UX modern dengan gradient pada header, button, dan card

#### 7. **React Native NFC Manager**
- **Package**: react-native-nfc-manager
- **Definisi**: Library untuk membaca/menulis NFC tags di React Native
- **Use Case di MARKIR**: Core functionality - scan NFC tag untuk identifikasi kendaraan dan proses pembayaran parkir

---

### **Backend (Server Application)**

#### 1. **Node.js**
- **Versi**: 18.x atau 20.x (LTS)
- **Definisi**: JavaScript runtime untuk server-side programming
- **Keunggulan**:
  - Non-blocking I/O (high concurrency)
  - JavaScript di frontend & backend (full-stack JS)
  - NPM ecosystem yang besar
- **Use Case di MARKIR**: Server untuk REST API

#### 2. **Express.js**
- **Versi**: ^4.x
- **Definisi**: Minimal dan flexible Node.js web application framework
- **Keunggulan**:
  - Routing yang powerful
  - Middleware support
  - Lightweight dan fast
- **Use Case di MARKIR**: Membangun REST API endpoints untuk login, transactions, NFC scan, top-up

#### 3. **PostgreSQL**
- **Versi**: 18.1
- **Definisi**: Open-source relational database management system (RDBMS)
- **Keunggulan**:
  - ACID compliant (data consistency)
  - Support untuk complex queries
  - Scalable hingga millions of records
  - JSON support (hybrid SQL-NoSQL)
- **Use Case di MARKIR**: Menyimpan data users, kendaraan, NFC tags, transaksi, dan top-up history

#### 4. **bcrypt**
- **Definisi**: Library untuk hashing password
- **Keunggulan**:
  - Secure hashing algorithm
  - Salt rounds untuk protection
  - Industry standard
- **Use Case di MARKIR**: Enkripsi password user di database

#### 5. **JSON Web Token (JWT)**
- **Package**: jsonwebtoken
- **Definisi**: Standard untuk authentication token
- **Keunggulan**:
  - Stateless authentication
  - Secure dan compact
  - Bisa menyimpan user data di token
- **Use Case di MARKIR**: Authentication & authorization setelah login

#### 6. **CORS**
- **Package**: cors
- **Definisi**: Middleware untuk enable Cross-Origin Resource Sharing
- **Use Case di MARKIR**: Mengizinkan frontend (mobile) berkomunikasi dengan backend (server)

---

### **Development Tools**

#### 1. **Git & GitHub**
- **Definisi**: Version control system dan platform hosting
- **Use Case di MARKIR**: Source code management dan version control

#### 2. **EAS Build (Expo Application Services)**
- **Definisi**: Cloud build service untuk compile aplikasi React Native
- **Use Case di MARKIR**: Build APK untuk Android deployment

#### 3. **Visual Studio Code**
- **Definisi**: Code editor dengan extension support
- **Extensions**:
  - ES7+ React/Redux snippets
  - TypeScript support
  - Prettier (code formatter)
  - ESLint (code linting)

#### 4. **Android Studio**
- **Definisi**: IDE untuk Android development
- **Use Case di MARKIR**: Android emulator untuk testing

---

## 🗄️ DATABASE ARCHITECTURE

### **Database Management System (DBMS)**
**PostgreSQL 18.1** - Open-source relational database

### **Database Name**
`markir_db`

### **Total Tables**: 6

#### **1. roles**
- **Purpose**: Role-Based Access Control (RBAC)
- **Records**: 2 (admin, user)
- **Key Columns**: role_id (PK), role_name

#### **2. users**
- **Purpose**: Menyimpan data pengguna aplikasi
- **Capacity**: 1000+ users (scalable hingga 2+ miliar)
- **Key Columns**: 
  - user_id (PK)
  - role_id (FK → roles)
  - email, password_hash, name, phone
  - saldo_ewallet (e-wallet balance)
  - membership_status (Free/Silver/Gold/Platinum)
- **Security**: Password hashed dengan bcrypt

#### **3. motorcycles**
- **Purpose**: Data kendaraan dan NFC tags
- **Capacity**: 1000+ NFC tags
- **Key Columns**:
  - motorcycle_id (PK)
  - user_id (FK → users)
  - plat_nomor (UNIQUE)
  - **nfc_uid (UNIQUE)** ⚡ **KRITIS** - UID dari NFC Tag
  - jenis_kendaraan (Motor/Mobil)
  - merk, warna
- **Unique Constraint**: 1 NFC tag = 1 kendaraan

#### **4. transactions**
- **Purpose**: Audit trail untuk semua transaksi parkir (PAD - Pendapatan Asli Daerah)
- **Capacity**: Unlimited (audit trail)
- **Key Columns**:
  - transaction_id (PK)
  - nfc_uid (FK → motorcycles) ⚡ Tag yang di-scan
  - user_id (FK → users) - Pemilik kendaraan
  - petugas_id (FK → users) - Admin yang scan
  - amount_charged, status_bayar (LUNAS/TERTUNGGAK)
  - initial_balance, final_balance (audit trail)
  - location, timestamp
- **Status**: LUNAS (balance cukup), TERTUNGGAK (balance kurang), PENDING

#### **5. top_up_history**
- **Purpose**: Riwayat pengisian saldo e-wallet
- **Capacity**: Unlimited
- **Key Columns**:
  - topup_id (PK)
  - user_id (FK → users)
  - amount, payment_method
  - status (PENDING/SUCCESS/FAILED)
  - initial_balance, final_balance

#### **6. promotions**
- **Purpose**: Manajemen promo dan diskon
- **Key Columns**:
  - promotion_id (PK)
  - code (UNIQUE), title, description
  - discount_type (percentage/fixed)
  - discount_value, valid_until, is_active

---

## 📊 ENTITY RELATIONSHIP DIAGRAM (ERD)

### **Relationships**

1. **ROLES ──< USERS** (1:N)
   - 1 role dapat memiliki banyak users
   - FK: users.role_id → roles.role_id

2. **USERS ──< MOTORCYCLES** (1:N)
   - 1 user dapat memiliki banyak kendaraan
   - FK: motorcycles.user_id → users.user_id

3. **MOTORCYCLES ──< TRANSACTIONS** (1:N)
   - 1 kendaraan (NFC tag) dapat memiliki banyak transaksi
   - FK: transactions.nfc_uid → motorcycles.nfc_uid
   - ⚡ **CRITICAL PATH** untuk NFC scanning

4. **USERS ──< TRANSACTIONS** (1:N) - Owner
   - 1 user dapat memiliki banyak transaksi (sebagai pemilik)
   - FK: transactions.user_id → users.user_id

5. **USERS ──< TRANSACTIONS** (1:N) - Petugas
   - 1 petugas dapat memproses banyak transaksi
   - FK: transactions.petugas_id → users.user_id

6. **USERS ──< TOP_UP_HISTORY** (1:N)
   - 1 user dapat memiliki banyak riwayat top-up
   - FK: top_up_history.user_id → users.user_id

### **Database Constraints**

- **Primary Keys (PK)**: Semua tabel memiliki PK dengan SERIAL (auto-increment)
- **Foreign Keys (FK)**: Referential integrity untuk data consistency
- **Unique Constraints**: nfc_uid, plat_nomor, email, promo code
- **Check Constraints**: Saldo ≥ 0, amount > 0, enum validation
- **Indexes**: Pada kolom yang sering di-query (nfc_uid, email, timestamp)
- **Triggers**: Auto-update timestamp pada UPDATE

---

## 🔧 ISTILAH TEKNIS

### **A. Arsitektur Aplikasi**

#### **1. Client-Server Architecture**
- **Definisi**: Arsitektur dimana client (mobile app) berkomunikasi dengan server (backend API)
- **Implementasi**: Mobile app → REST API → Database

#### **2. REST API (REpresentational State Transfer)**
- **Definisi**: Arsitektur untuk web services menggunakan HTTP methods
- **Methods di MARKIR**:
  - GET: Retrieve data (get users, transactions)
  - POST: Create data (login, register, create transaction)
  - PUT/PATCH: Update data (update balance, edit promotion)
  - DELETE: Delete data (delete promotion)

#### **3. JSON (JavaScript Object Notation)**
- **Definisi**: Format pertukaran data antara client dan server
- **Contoh**:
```json
{
  "user_id": 1,
  "email": "user@markir.com",
  "name": "User Test",
  "saldo_ewallet": 500000
}
```

#### **4. CRUD Operations**
- **Definisi**: Create, Read, Update, Delete - operasi dasar database
- **Implementasi**: Semua fitur manajemen (users, motorcycles, promotions, transactions)

---

### **B. NFC Technology**

#### **1. NFC (Near Field Communication)**
- **Definisi**: Teknologi komunikasi wireless jarak dekat (< 10 cm) untuk pertukaran data
- **Frekuensi**: 13.56 MHz
- **Use Case**: Contactless payment, access control, **parking identification**

#### **2. NFC Tag**
- **Definisi**: Chip pasif yang menyimpan data (UID, NDEF)
- **UID (Unique Identifier)**: ID unik setiap NFC tag
- **Implementasi**: Setiap kendaraan memiliki NFC tag dengan UID unik

#### **3. NFC Reader**
- **Definisi**: Device yang membaca data dari NFC tag
- **Implementasi**: Smartphone Android dengan NFC (petugas parkir)

#### **4. NFC Scan Flow**
```
1. Petugas dekatkan smartphone ke NFC tag kendaraan
2. Baca nfc_uid dari tag
3. Query database: SELECT * FROM motorcycles WHERE nfc_uid = ?
4. Get data pemilik & balance
5. Calculate parking fee
6. Deduct balance if sufficient (LUNAS) atau mark TERTUNGGAK
7. Create transaction record
```

---

### **C. Security & Authentication**

#### **1. Hash Function**
- **Definisi**: One-way encryption untuk password
- **Algorithm**: bcrypt dengan salt rounds
- **Property**: Irreversible (tidak bisa di-decrypt kembali)

#### **2. JWT (JSON Web Token)**
- **Struktur**: Header.Payload.Signature
- **Payload**: User data (user_id, email, role)
- **Expiry**: Token expire setelah waktu tertentu (e.g., 24 jam)

#### **3. Role-Based Access Control (RBAC)**
- **Definisi**: Authorization berdasarkan role user
- **Roles**:
  - **Admin**: Access ke manajemen data, scan NFC, laporan
  - **User**: Access ke top-up, history, vehicles

#### **4. Authentication vs Authorization**
- **Authentication**: Memverifikasi identitas user (login)
- **Authorization**: Memverifikasi hak akses user (RBAC)

---

### **D. State Management**

#### **1. Global State**
- **Definisi**: State yang dapat diakses di semua komponen aplikasi
- **Implementasi**: Redux Toolkit
- **State di MARKIR**:
  - authSlice: User login, token, role
  - userSlice: Balance, profile
  - transactionSlice: Transaction history
  - promotionSlice: Active promotions

#### **2. Local State**
- **Definisi**: State yang hanya ada di 1 komponen
- **Implementasi**: React useState hook
- **Contoh**: Form input, modal visibility, loading states

#### **3. Actions & Reducers**
- **Action**: Event yang trigger state change
- **Reducer**: Pure function yang mengubah state
- **Example**: 
  - Action: `deductBalance(amount)`
  - Reducer: Update balance di state

---

### **E. Payment System**

#### **1. E-Wallet**
- **Definisi**: Digital wallet untuk menyimpan saldo elektronik
- **Implementasi**: `saldo_ewallet` di tabel users
- **Use Case**: Bayar parkir tanpa uang tunai

#### **2. Top-Up**
- **Definisi**: Pengisian saldo e-wallet
- **Payment Methods**: GoPay, OVO, DANA, QRIS, Bank Transfer
- **Implementation**: Mockup (simulasi) - real implementation perlu payment gateway

#### **3. Payment Gateway**
- **Definisi**: Service untuk proses pembayaran online
- **Examples**: Midtrans, Xendit, Stripe
- **Status**: Belum diimplementasi (mockup dulu)

---

### **F. Database Concepts**

#### **1. Relational Database**
- **Definisi**: Database dengan tabel yang saling berelasi via foreign keys
- **Keunggulan**: Data consistency, ACID properties

#### **2. ACID Properties**
- **Atomicity**: Transaksi all-or-nothing
- **Consistency**: Data selalu dalam state valid
- **Isolation**: Transaksi tidak interfere satu sama lain
- **Durability**: Data persisten setelah commit

#### **3. Normalization**
- **Definisi**: Proses mengurangi redundansi data
- **Normal Forms**: 1NF, 2NF, 3NF
- **Implementasi**: Database MARKIR di-design dengan 3NF

#### **4. Indexing**
- **Definisi**: Data structure untuk mempercepat query
- **Implementasi**: Index pada nfc_uid, email, timestamp
- **Trade-off**: Query cepat, insert/update sedikit lambat

#### **5. Foreign Key**
- **Definisi**: Kolom yang reference primary key di tabel lain
- **Purpose**: Maintain referential integrity
- **Example**: motorcycles.user_id → users.user_id

#### **6. Trigger**
- **Definisi**: Automatic action yang execute saat event tertentu
- **Implementasi**: Auto-update `updated_at` timestamp

---

### **G. Development Methodology**

#### **1. Agile Development**
- **Definisi**: Iterative development dengan sprint pendek
- **Implementasi**: Feature development step-by-step

#### **2. Version Control**
- **Tool**: Git & GitHub
- **Concept**: 
  - Commit: Save changes
  - Branch: Parallel development
  - Merge: Combine changes

#### **3. API Testing**
- **Tool**: Postman, curl, Thunder Client
- **Purpose**: Test backend endpoints sebelum integrate ke frontend

---

## 🎯 FITUR UTAMA APLIKASI

### **1. Authentication & Authorization**
- Login dengan email & password
- JWT token untuk session management
- RBAC untuk admin & user

### **2. NFC Parking Payment** ⚡ **FITUR UTAMA**
- Scan NFC tag kendaraan
- Otomatis identifikasi pemilik & kendaraan
- Calculate parking fee
- Deduct balance from e-wallet
- Real-time update balance
- Status LUNAS/TERTUNGGAK

### **3. E-Wallet Management**
- Check balance
- Top-up saldo (mockup: GoPay, OVO, DANA, QRIS, Bank)
- Transaction history
- Balance audit trail

### **4. Vehicle Management**
- Register kendaraan dengan NFC tag
- Link NFC UID ke plat nomor
- View registered vehicles
- Edit/delete vehicles

### **5. Admin Dashboard**
- Statistics (pendapatan, transaksi, tunggakan)
- Manage promotions (CRUD)
- Manage users
- Transaction reports
- NFC operations (scan & write)

### **6. Promotion System**
- Create/edit/delete promotions
- Discount types (percentage/fixed)
- Promo code system
- Active/inactive status

### **7. Transaction History**
- View all transactions
- Filter by status (LUNAS/TERTUNGGAK)
- Sort by date
- Transaction details (before/after balance)

---

## 📈 SCALABILITY & PERFORMANCE

### **Database Scalability**
- **Current Capacity**: 1000+ users, 1000+ NFC tags
- **Max Capacity (SERIAL)**: 2,147,483,647 records
- **Future**: BIGSERIAL untuk > 2 miliar records

### **Performance Optimizations**
1. **Indexes**: Fast query pada kolom kritikal
2. **Connection Pooling**: Reuse database connections
3. **Caching**: Redis untuk frequently accessed data (future)
4. **Load Balancing**: Multiple server instances (future)

### **Concurrency Handling**
- PostgreSQL transactions untuk data consistency
- Optimistic locking untuk concurrent updates

---

## 🔒 SECURITY MEASURES

1. **Password Security**: bcrypt hashing dengan salt
2. **Authentication**: JWT dengan expiry
3. **Authorization**: RBAC untuk access control
4. **SQL Injection Prevention**: Parameterized queries
5. **Input Validation**: Frontend & backend validation
6. **HTTPS**: Encrypted communication (production)

---

## 🚀 DEPLOYMENT

### **Frontend**
- **Development**: Expo Go (testing di smartphone)
- **Production**: APK via EAS Build
- **Distribution**: Direct APK download atau Google Play Store

### **Backend**
- **Development**: localhost:3000
- **Production Options**:
  - VPS (Digital Ocean, AWS EC2)
  - Platform as a Service (Heroku, Railway, Render)
  - Containerization (Docker)

### **Database**
- **Development**: Local PostgreSQL
- **Production**: Cloud PostgreSQL (AWS RDS, Google Cloud SQL, ElephantSQL)

---

## 📚 REFERENSI & LEARNING RESOURCES

### **Documentation**
1. React Native: https://reactnative.dev
2. Expo: https://docs.expo.dev
3. Redux Toolkit: https://redux-toolkit.js.org
4. PostgreSQL: https://www.postgresql.org/docs
5. Express.js: https://expressjs.com
6. NFC Forum: https://nfc-forum.org

### **Tutorials**
1. React Native NFC: https://github.com/revtel/react-native-nfc-manager
2. JWT Authentication: https://jwt.io
3. PostgreSQL Tutorials: https://www.postgresqltutorial.com

---

## 💡 NILAI TAMBAH APLIKASI

### **1. Inovasi Teknologi**
- Integrasi NFC untuk parkir cashless
- Real-time balance update
- Audit trail lengkap untuk PAD

### **2. User Experience**
- Modern UI/UX dengan gradient design
- One-tap payment via NFC scan
- Instant feedback (LUNAS/TERTUNGGAK)

### **3. Administrative Efficiency**
- Automated payment processing
- Real-time statistics dashboard
- Complete transaction reports

### **4. Scalability**
- Dapat menampung 1000+ users & vehicles
- Database architecture untuk growth
- Cloud-ready deployment

### **5. Security**
- Industry-standard encryption (bcrypt, JWT)
- Role-based access control
- Complete audit trail

---

## 📋 CHECKLIST UNTUK SIDANG

### **Persiapan Teknis**
- ✅ ERD diagram (complete with relationships)
- ✅ Database schema (6 tables dengan constraints)
- ✅ Technology stack explanation
- ✅ System architecture diagram
- ✅ NFC workflow explanation
- ✅ Security measures documentation

### **Demo Aplikasi**
- ✅ Login sebagai admin & user
- ✅ NFC scan simulation
- ✅ Top-up e-wallet (mockup)
- ✅ Transaction history
- ✅ Admin dashboard & statistics
- ✅ Promotion management (CRUD)

### **Pertanyaan yang Mungkin Ditanya**
1. **Mengapa pilih React Native?** → Cross-platform, 1 codebase untuk Android & iOS
2. **Mengapa PostgreSQL?** → ACID compliant, scalable, open-source
3. **Bagaimana NFC bekerja?** → Scan UID → Query DB → Process payment
4. **Keamanan password?** → bcrypt hashing dengan salt rounds
5. **Scalability?** → Support hingga 2+ miliar records (SERIAL)
6. **Payment gateway?** → Mockup dulu, real implementation perlu integrasi Midtrans/Xendit
7. **Deployment plan?** → VPS atau PaaS dengan cloud database

---

**Catatan**: Dokumen ini adalah ringkasan lengkap untuk referensi sidang seminar proposal. Setiap section dapat di-expand lebih detail sesuai pertanyaan penguji.

**Status Aplikasi**: ✅ Functional prototype dengan core features (NFC scan, e-wallet, CRUD operations)

---

**Good luck untuk sidang seminar proposal! 🎓🚀**
