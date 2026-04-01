# EAS Build Setup Guide for MARKIR

## ✅ Setup Selesai!

File konfigurasi EAS sudah dibuat:
- ✅ `eas.json` - Konfigurasi build profiles
- ✅ `app.json` - Update dengan permissions NFC dan bundle identifier

## Langkah Selanjutnya:

### 1. Login ke Expo Account
```powershell
eas login
```
Jika belum punya account, buat di: https://expo.dev/signup

### 2. Link Project ke EAS
```powershell
eas build:configure
```

### 3. Build Development APK (untuk testing NFC)
```powershell
eas build --profile development --platform android
```

**Proses build akan:**
- Upload kode ke Expo server
- Build APK di cloud (5-15 menit)
- Berikan link download APK

### 4. Install ke Android Device
- Download APK dari link yang diberikan
- Install ke device fisik (bukan emulator)
- Pastikan NFC aktif di device settings

### 5. Testing NFC
- Buka app MARKIR
- Login (akan otomatis redirect ke Home)
- Buka PenagihanScreen atau RegistrasiMotorScreen
- Tap tombol scan/write
- Tempelkan tag NFC

## Build Profiles:

### Development Build
```powershell
eas build --profile development --platform android
```
- Untuk testing NFC di device
- Include debug tools
- APK size lebih besar

### Production Build
```powershell
eas build --profile production --platform android
```
- Untuk publish ke Play Store atau distribusi
- Optimized & minified
- APK size lebih kecil

## Troubleshooting:

### Error: "Not logged in"
```powershell
eas login
```

### Error: "Project not configured"
```powershell
eas build:configure
```

### Check Build Status
```powershell
eas build:list
```

### View Build Logs
Buka: https://expo.dev/accounts/[username]/projects/markir-app/builds

## Note:
- Build pertama mungkin lambat (10-15 menit)
- Build berikutnya lebih cepat (5-10 menit)
- Butuh koneksi internet stabil
- Free account: 30 builds/month

---

**Next:** Jalankan `eas login` untuk mulai!
