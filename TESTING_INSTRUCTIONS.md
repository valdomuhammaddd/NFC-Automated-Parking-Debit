# 🧪 MARKIR - TESTING INSTRUCTIONS

**Status**: ✅ Server Running  
**URL**: exp://192.168.0.104:8081  
**Compile Errors**: 0 ✅  
**Date**: November 9, 2025

---

## 📱 CARA BUKA APLIKASI

### **Opsi 1: Web Browser** (RECOMMENDED untuk debugging cepat)

1. **Tekan `w`** di terminal Expo yang sedang running
2. Browser akan terbuka otomatis di: `http://localhost:19006`
3. Tunggu bundling selesai (biasanya 30-60 detik pertama kali)
4. App akan muncul di browser

**Jika stuck di "Loading..."**:
- Buka **Developer Console** (F12)
- Lihat tab **Console** untuk error messages
- Screenshot error dan beritahu saya

---

### **Opsi 2: Android Emulator**

1. **Pastikan Android Emulator sudah running**
2. **Tekan `a`** di terminal Expo
3. Expo akan auto-install app di emulator
4. Tunggu bundling selesai

---

### **Opsi 3: Expo Go (Physical Device)**

**Android**:
1. Install **Expo Go** dari Play Store
2. Scan QR code di terminal menggunakan Expo Go app
3. Tunggu download bundle

**iOS**:
1. Install **Expo Go** dari App Store
2. Scan QR code menggunakan Camera app
3. Akan buka di Expo Go

---

## 🐛 JIKA APP STUCK DI "LOADING..."

### Kemungkinan Penyebab:

#### 1. **Bundle JavaScript masih loading** (Normal)
- **Gejala**: White screen dengan loading spinner
- **Solusi**: **Tunggu 1-2 menit** untuk bundling pertama kali
- **Check**: Lihat terminal Expo, harus ada log seperti:
  ```
  Bundling complete! 100% (1234 modules)
  ```

#### 2. **Runtime Error di App**
- **Gejala**: Stuck di splash screen atau crash
- **Solusi**: 
  ```bash
  # Di terminal Expo, tekan 'j' untuk buka debugger
  j
  
  # Atau reload app
  r
  ```
- **Check Console**: Buka Chrome DevTools (F12) → Console tab

#### 3. **Cache Issue**
- **Gejala**: Error aneh atau stuck loading
- **Solusi**:
  ```powershell
  # Kill server
  Ctrl+C di terminal Expo
  
  # Clear all caches
  taskkill /F /IM node.exe
  Remove-Item -Path .expo -Recurse -Force
  Remove-Item -Path node_modules\.cache -Recurse -Force
  
  # Restart fresh
  npx expo start --clear
  ```

#### 4. **Network Issue**
- **Gejala**: Tidak bisa connect ke server
- **Check**: Pastikan device dan laptop di **WiFi yang sama**
- **Check**: Firewall tidak block port 8081
- **Solusi**: Gunakan **Web version** (tekan 'w')

---

## 🎯 TESTING CHECKLIST

### Phase 1: Basic Loading ✅
- [ ] Splash screen muncul (logo MARKIR)
- [ ] Splash hilang setelah 2 detik
- [ ] Login screen muncul

### Phase 2: Login Flow
- [ ] Tombol "Masuk dengan Google" visible
- [ ] Klik tombol → Alert "Login Berhasil" muncul
- [ ] Setelah login → Redirect ke Home (Admin atau User)

### Phase 3: User Screens
- [ ] **Home**: 5 sections (Balance, Quick Actions, Promos, Parking, Activity)
- [ ] **Activity**: Filter tabs dan transaction list
- [ ] **Pay/NFC**: Center button (mock NFC scan)
- [ ] **Wallet**: Top-up form dengan 6 payment methods
- [ ] **Account**: Profile info dan menu settings

### Phase 4: Admin Screens
- [ ] **Admin Home**: Stats cards (Total, Lunas, Tunggakan, Transaksi)
- [ ] **Penagihan**: NFC scan button → Mock transaction
- [ ] **Registrasi Motor**: Form input → Mock registration
- [ ] **About**: Developer info

### Phase 5: Navigation
- [ ] Bottom tabs work (User)
- [ ] Stack navigation (push/pop)
- [ ] Back button di header
- [ ] Logout button (Admin)

---

## 🔍 DEBUGGING COMMANDS

Saat server running, Anda bisa tekan:

| Key | Action | Kapan Digunakan |
|-----|--------|-----------------|
| `w` | Open web | Testing cepat di browser |
| `a` | Open Android | Test di emulator |
| `r` | Reload app | Setelah edit code |
| `j` | Open debugger | Lihat console logs |
| `m` | Toggle menu | Dev menu options |
| `c` | Clear bundler cache | Jika ada cache issue |
| `?` | Show all commands | Help |

---

## 📊 EXPECTED BEHAVIOR

### Splash Screen (2 seconds)
```
┌─────────────────────┐
│                     │
│    [LOGO MARKIR]    │
│      MARKIR         │
│  Tap & Park with    │
│       NFC           │
│                     │
└─────────────────────┘
```

### Login Screen
```
┌─────────────────────┐
│   [LOGO MARKIR]     │
│     MARKIR          │
│ Tap & Park with NFC │
│                     │
│  ┌───────────────┐  │
│  │ Masuk ke      │  │
│  │ MARKIR        │  │
│  │               │  │
│  │ [G] Masuk dgn │  │
│  │    Google     │  │
│  └───────────────┘  │
│                     │
│  Valdo Muhammad     │
│  @valdomuhammadd    │
└─────────────────────┘
```

### User Home Screen
```
┌─────────────────────┐
│ Hi, Valdo 👋        │
│                     │
│ ┌─────────────────┐ │
│ │ Balance         │ │
│ │ Rp 50,000       │ │
│ └─────────────────┘ │
│                     │
│ [8 Quick Actions]   │
│                     │
│ [Promotions Slider] │
│                     │
│ [Nearby Parking]    │
│                     │
│ [Recent Activity]   │
└─────────────────────┘
```

---

## ⚠️ COMMON ISSUES & SOLUTIONS

### Issue 1: "Cannot connect to Metro bundler"
**Cause**: Device dan laptop beda WiFi atau firewall block  
**Solution**:
```bash
# Check firewall
# Allow Node.js in Windows Firewall

# Or use web version
w
```

### Issue 2: "Unable to resolve module"
**Cause**: Cache atau missing dependency  
**Solution**:
```bash
# Clear and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Issue 3: "Error: spawn EACCES"
**Cause**: Permission issue  
**Solution**:
```bash
# Run as Administrator or fix permissions
npm cache clean --force
```

### Issue 4: App crashes immediately
**Cause**: Runtime error in code  
**Solution**:
```bash
# Open debugger
j

# Check console for error stack trace
# Look for RED ERROR messages
```

---

## 📸 SCREENSHOT UNTUK DEBUGGING

Jika ada masalah, ambil screenshot:

1. **Terminal Expo** (full output dengan error)
2. **Browser Console** (F12 → Console tab)
3. **App Screen** (apa yang terlihat)
4. **Network Tab** (F12 → Network, jika ada fetch errors)

---

## 🎬 QUICK START GUIDE

```bash
# 1. Pastikan server running
# Check terminal ada QR code ✅

# 2. Buka di WEB (termudah)
w

# 3. Tunggu bundling (1-2 menit pertama kali)
# Lihat progress di terminal

# 4. Jika muncul error di console:
# - Screenshot error
# - Beritahu saya details error nya
# - Jangan panik! Kita bisa fix 😊

# 5. Jika berhasil load:
# - Test login button
# - Klik "Masuk dengan Google"
# - Harusnya redirect ke Home screen
```

---

## 🆘 NEED HELP?

**Jika stuck lebih dari 5 menit:**

1. **Tekan Ctrl+C** di terminal (stop server)
2. **Copy-paste error message** dari terminal atau console
3. **Beritahu saya** error nya
4. Saya akan bantu debug!

**Info yang berguna untuk debugging:**
- Error message lengkap
- Screenshot app screen
- Screenshot console/terminal
- Langkah apa yang sudah dicoba

---

## ✅ SUCCESS CHECKLIST

App dianggap berhasil jika:
- [ ] Splash screen muncul dan hilang
- [ ] Login screen muncul dengan button Google
- [ ] Klik login → Alert "Login Berhasil"
- [ ] Redirect ke Home screen
- [ ] Bottom tabs visible dan bisa diklik
- [ ] Minimal 1 screen bisa dibuka tanpa crash

**Jika semua checklist ✅ → APP SIAP! 🎉**

---

*Happy Testing! 🚀*
