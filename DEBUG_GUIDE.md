# MARKIR - Troubleshooting: Aplikasi Tidak Terbuka Setelah Scan QR Code

## ✅ Perbaikan yang Sudah Dilakukan:

### 1. **Restructured App.tsx**
- ✅ Splash screen sekarang **INSIDE** Redux Provider
- ✅ Added error handling di initialization
- ✅ Minimum 2 detik untuk splash screen
- ✅ App tetap jalan meskipun NFC init gagal

### 2. **Added ErrorBoundary**
- ✅ Catch semua React errors
- ✅ Display user-friendly error message
- ✅ Show error details di dev mode
- ✅ Button "Coba Lagi" untuk retry

### 3. **Better Console Logging**
- ✅ `✅ NFC initialized successfully` (jika berhasil)
- ✅ `⚠️ NFC not available` (expected di Expo Go)
- ✅ Error logs untuk debugging

---

## 🔍 Cara Debug Jika Masih Tidak Terbuka:

### Step 1: Cek Log di Terminal
Setelah scan QR code, lihat output di terminal:

```
Logs for your project will appear below.
```

**Jika ada error**, akan muncul di sini. Copy error message untuk debugging.

### Step 2: Cek Expo Go App
1. **Shake device** atau tekan menu
2. Pilih **"Reload"**
3. Atau pilih **"Debug Remote JS"**

### Step 3: Cek Console Log di Browser
1. Di terminal tekan **`j`** untuk open debugger
2. Browser akan terbuka
3. Buka **Developer Tools** (F12)
4. Lihat tab **Console** untuk error messages

### Step 4: Clear Cache
```powershell
# Di terminal yang sedang running Expo
# Tekan: shift+m
# Pilih: "Clear bundler cache and reload"
```

Atau:
```powershell
# Stop Expo (Ctrl+C)
cd c:\MARKIR\markir-app
npx expo start --clear
```

### Step 5: Reinstall Expo Go
1. Uninstall Expo Go dari device
2. Download versi terbaru dari Play Store/App Store
3. Install ulang
4. Scan QR code lagi

---

## 🐛 Common Issues & Solutions:

### Issue 1: "Cannot connect to Metro bundler"
**Symptoms**: Aplikasi stuck di loading atau error "Could not connect"

**Solutions**:
1. ✅ Pastikan PC dan phone di **NETWORK WIFI yang sama**
2. ✅ Disable firewall sementara
3. ✅ Gunakan **tunnel mode**:
   ```powershell
   npx expo start --tunnel
   ```

### Issue 2: "App keeps crashing immediately"
**Symptoms**: Splash screen muncul lalu langsung crash

**Solutions**:
1. ✅ Check terminal untuk error log
2. ✅ Pastikan semua dependencies ter-install:
   ```powershell
   npm install
   ```
3. ✅ Clear node_modules dan reinstall:
   ```powershell
   Remove-Item -Recurse -Force node_modules
   npm install
   ```

### Issue 3: "White screen / blank screen"
**Symptoms**: Aplikasi terbuka tapi layar putih kosong

**Solutions**:
1. ✅ Reload app (shake device → Reload)
2. ✅ Check if ErrorBoundary triggered:
   - Lihat apakah ada emoji ⚠️ dan pesan error
   - Tekan "Coba Lagi"
3. ✅ Clear Expo Go cache:
   - Settings → Clear cache

### Issue 4: "Stuck at splash screen"
**Symptoms**: Logo MARKIR muncul tapi tidak lanjut ke Login

**Solutions**:
1. ✅ Wait 2-3 detik (splash duration)
2. ✅ Check terminal untuk error
3. ✅ Reload app
4. ✅ Check network connection

---

## 📱 Langkah Testing yang Benar:

### 1. Start Expo Server
```powershell
cd c:\MARKIR\markir-app
npx expo start --clear
```

Tunggu hingga QR code muncul.

### 2. Scan QR Code
- **Android**: Buka Expo Go → Scan QR
- **iOS**: Buka Camera → Scan QR

### 3. Watch Terminal Output
Setelah scan, terminal akan show:

```
Android Bundled 500ms
› Running app on [Device Name]
```

**Jika ada error**, akan muncul di sini.

### 4. Wait for Splash Screen
- Logo MARKIR akan muncul (animasi 0.8 detik)
- Tampil 2 detik
- Auto redirect ke Login Screen

### 5. Expected Flow
```
Splash (2s) → Login Screen → Dashboard
```

---

## 🔧 Advanced Debugging:

### Enable Developer Menu in Expo Go
1. Shake device atau press menu button
2. Opsi yang tersedia:
   - **Reload**: Restart app
   - **Debug Remote JS**: Open Chrome DevTools
   - **Show Element Inspector**: Debug UI
   - **Performance Monitor**: Check performance

### Check React DevTools
```powershell
# Install React DevTools
npm install -g react-devtools

# Run
react-devtools
```

### Check Network Connection
```powershell
# Ping IP server dari phone browser
http://192.168.0.104:8081
```

Jika tidak bisa akses, berarti network issue.

---

## 🆘 Jika Semua Gagal:

### Option 1: Use Tunnel Mode
```powershell
npx expo start --tunnel
```

Lebih lambat tapi bisa bypass network issues.

### Option 2: Test di Web Browser
```powershell
# Di terminal Expo, tekan: w
# Atau jalankan:
npx expo start --web
```

Jika jalan di web, berarti issue di mobile setup.

### Option 3: Build Development APK
```powershell
npm install -g eas-cli
eas login
eas build --platform android --profile development
```

Install APK langsung tanpa Expo Go.

---

## 📞 Get Help:

**Developer**: Valdo Muhammad  
**Instagram**: @valdomuhammadd

**Include this info when asking for help**:
1. Screenshot terminal output
2. Screenshot Expo Go error (if any)
3. OS Version (Android/iOS)
4. Expo Go version
5. Network setup (same WiFi?)

---

## ✅ Checklist Sebelum Test:

- [ ] PC dan phone di WiFi yang sama
- [ ] Expo Go version terbaru
- [ ] Terminal tidak ada error
- [ ] QR code berhasil di-scan
- [ ] Wait 5-10 detik setelah scan
- [ ] Check terminal untuk logs
- [ ] Firewall tidak blocking port 8081

---

**Status**: ✅ App structure fixed, ready for testing!
