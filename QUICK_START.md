# MARKIR - Quick Start Guide

## 🚀 Cara Menjalankan (SEKARANG!)

```powershell
cd c:\MARKIR\markir-app
npx expo start --clear
```

Setelah QR code muncul:
1. **Buka Expo Go** di Android/iOS
2. **Scan QR code**
3. **Logo MARKIR akan muncul** dengan animasi
4. **Login** dengan tombol Google (mock login)

---

## 🎭 Testing Accounts (Mock Data)

### Admin Account
- Login → Otomatis dapat role admin
- Akses: Dashboard statistik, Penagihan, Registrasi Motor

### User Account  
- Login → Otomatis dapat role user
- Akses: Wallet, Profile, Top Up, Riwayat Transaksi

*(Role ditentukan otomatis oleh mock API)*

---

## ✅ Yang Sudah Diperbaiki

1. ✅ **Logo tampil di splash screen** - menggunakan gambar MARKIR Anda
2. ✅ **Error Boolean fixed** - app.json sudah disederhanakan
3. ✅ **Dependency conflicts resolved** - styled-components dihapus
4. ✅ **Semua screens tested** - tidak ada TypeScript errors
5. ✅ **Navigation working** - Admin & User flow

---

## 📱 Screenshots Flow

### 1. Splash Screen (2.5 detik)
- Logo MARKIR dengan animasi
- Text "MARKIR - Tap and Done"

### 2. Login Screen
- Logo MARKIR
- Button "Masuk dengan Google"
- Footer developer info

### 3. Admin Dashboard
- Total transaksi hari ini
- Stats: Lunas, Tunggakan
- Menu: Penagihan, Registrasi Motor

### 4. User Dashboard
- Saldo E-Wallet
- Status membership
- Motor terdaftar
- Quick actions

---

## ⚠️ Catatan Penting

### NFC Tidak Bekerja di Expo Go
NFC **HANYA** bekerja di:
- Custom development build
- Production APK/IPA

Untuk demo di Expo Go, gunakan **mock data** (sudah tersedia).

### Untuk Build Production dengan NFC:
```powershell
npm install -g eas-cli
eas login
eas build --platform android
```

---

## 🎨 Branding Final

- **Nama**: MARKIR (tanpa "E-Parking")
- **Tagline**: Tap and Done
- **Logo**: Icon dengan figure + motorcycle + NFC
- **Warna**: Biru (#0077B6) & Putih

---

## 📞 Support

**Developer**: Valdo Muhammad  
**Instagram**: @valdomuhammadd  
**Institusi**: UIGM Palembang

---

## 🎯 Next Steps untuk Production

1. Test di Expo Go ✅
2. Build custom development build untuk test NFC
3. Integrate Google Sign-In API key
4. Connect ke backend API
5. Build production APK/IPA
6. Publish ke Play Store/App Store

---

**Status**: ✅ READY FOR DEMO IN EXPO GO
