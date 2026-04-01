# MARKIR - Testing & Deployment Guide

## ✅ Pre-Launch Testing Checklist

### 1. **Dependencies Fixed**
- ✅ Removed `styled-components` (causing peer dependency conflicts)
- ✅ Using native React Native StyleSheet
- ✅ All TypeScript types properly defined
- ⚠️ `react-native-screens@4.18.0` (works fine, update optional)

### 2. **Configuration Fixed**
- ✅ `app.json` simplified (removed conflicting plugins)
- ✅ Splash screen path corrected: `splash-icon.png`
- ✅ Logo akan tampil di splash screen dengan animasi
- ✅ Bundle identifier set correctly
- ✅ Permissions removed from Expo Go (NFC hanya untuk dev build)

### 3. **Screens Tested**
- ✅ **SplashScreen**: Logo MARKIR dengan animasi fade & scale
- ✅ **LoginScreen**: Gunakan logo image asset, tagline "Tap and Done"
- ✅ **AdminHomeScreen**: Stats, transactions, menu lengkap
- ✅ **UserHomeScreen**: Wallet, motorcycles, profile
- ✅ **All Navigators**: Root, Admin Stack, User Stack

### 4. **Redux State Management**
- ✅ Auth slice: Login, logout, isAuthenticated
- ✅ User slice: Profile, motorcycles, wallet
- ✅ Transaction slice: History, stats
- ✅ No boolean casting errors

### 5. **Assets**
- ✅ Logo: `assets/icon.png` (150x150 px di login, 200x200 di splash)
- ✅ Splash: `assets/splash-icon.png`
- ✅ Adaptive Icon: `assets/adaptive-icon.png`
- ✅ Favicon: `assets/favicon.png`

---

## 🚀 How to Run

### **Expo Go (Development)**
```powershell
cd c:\MARKIR\markir-app
npx expo start --clear
```

Lalu:
- **Android**: Scan QR code dengan Expo Go app
- **iOS**: Scan QR code dengan Camera app (requires Expo Go)
- **Web**: Tekan `w`

### **Known Limitations in Expo Go**
⚠️ **NFC tidak akan bekerja di Expo Go**
- NFC memerlukan **custom development build**
- Untuk testing NFC, harus build APK/IPA

---

## 📱 Build for Production

### **Android APK (dengan NFC support)**
```powershell
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build Android APK
eas build --platform android --profile preview
```

### **iOS IPA**
```powershell
eas build --platform ios --profile preview
```

---

## 🔧 NFC Configuration (for Custom Build Only)

Untuk mengaktifkan NFC di custom build, tambahkan di `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-nfc-manager",
        {
          "nfcPermission": "This app requires NFC access"
        }
      ]
    ],
    "android": {
      "permissions": [
        "android.permission.NFC"
      ]
    },
    "ios": {
      "infoPlist": {
        "NFCReaderUsageDescription": "This app requires NFC access"
      }
    }
  }
}
```

---

## 🧪 Testing Flow

### **Admin Flow:**
1. ✅ Login dengan Google (auto-detect role)
2. ✅ Dashboard: Lihat statistik transaksi
3. ✅ Penagihan: Scan NFC untuk charging (dev build only)
4. ✅ Registrasi Motor: Write NFC tag (dev build only)
5. ✅ About: Info developer

### **User Flow:**
1. ✅ Login dengan Google
2. ✅ Dashboard: Lihat saldo wallet & motor
3. ✅ Top Up: Tambah saldo via e-wallet
4. ✅ Profile: Edit profil
5. ✅ Riwayat: Lihat transaksi parkir
6. ✅ About: Info aplikasi

---

## 🐛 Common Issues & Solutions

### **Issue 1: java.lang.String cannot be cast to Boolean**
**Solution**: ✅ FIXED - Simplified app.json, removed plugins for Expo Go

### **Issue 2: Logo tidak muncul**
**Solution**: ✅ FIXED - Path corrected, using Image component with require()

### **Issue 3: styled-components peer dependency error**
**Solution**: ✅ FIXED - Removed styled-components, using StyleSheet

### **Issue 4: NFC tidak bekerja**
**Solution**: Expected behavior - NFC needs custom build, not available in Expo Go

---

## 📦 What's Working in Expo Go

✅ Login/Logout flow
✅ Redux state management
✅ Navigation (Admin/User)
✅ UI/UX all screens
✅ Mock API responses
✅ Splash screen with logo
✅ All styling & theming

## 🚧 What Needs Custom Build

❌ NFC Read (Penagihan)
❌ NFC Write (Registrasi Motor)
❌ Google Sign-In native flow

---

## 📝 Developer Info

**Name**: Valdo Muhammad  
**Institution**: Universitas Indo Global Mandiri Palembang  
**Program**: Sistem Komputer  
**Contact**: @valdomuhammadd (Instagram)

---

## 🎨 Branding

**App Name**: MARKIR  
**Tagline**: Tap and Done  
**Primary Color**: #0077B6 (Blue)  
**Logo**: Custom icon dengan figure + motorcycle + NFC symbol

---

## ✅ Ready for Demo

Aplikasi sekarang **SIAP untuk demo** di Expo Go dengan:
- ✅ Logo splash screen
- ✅ Semua UI screens
- ✅ Mock data flow
- ✅ No critical errors

**Untuk produksi dengan NFC**, build menggunakan EAS Build.
