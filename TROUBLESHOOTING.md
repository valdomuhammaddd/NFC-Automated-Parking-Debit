# MARKIR - Troubleshooting Guide

## Error: java.lang.String cannot be cast to java.lang.Boolean

### Penyebab:
Error ini terjadi di aplikasi React Native/Expo ketika ada masalah dengan tipe data di konfigurasi atau AsyncStorage.

### Solusi yang Telah Dilakukan:

1. **Perbaikan app.json**
   - ✅ Mengubah splash image path dari `./assets/splash.png` ke `./assets/splash-icon.png`
   - ✅ Menambahkan plugin NFC yang hilang
   - ✅ Memperbaiki format permissions Android: `["NFC"]` → `["android.permission.NFC"]`

2. **Perbaikan Redux Store**
   - ✅ Menambahkan serializable check yang lebih spesifik
   - ✅ Menghindari false casting dari string ke boolean

3. **Pembersihan Cache**
   - ✅ Menjalankan `npx expo start --clear`
   - ✅ Menghapus cache Metro Bundler
   - ✅ Restart semua proses Node.js

### Cara Menjalankan Aplikasi:

```powershell
# Kill semua proses node yang sedang berjalan
taskkill /F /IM node.exe

# Jalankan Expo dengan cache bersih
cd c:\MARKIR\markir-app
npx expo start --clear
```

### Jika Logo Tidak Muncul di Splash Screen:

1. Pastikan file `splash-icon.png` ada di folder `assets/`
2. Cek path di `app.json` sudah benar
3. Restart Expo dengan `--clear` flag
4. Di device, tutup dan buka ulang aplikasi Expo Go

### Update Package (Opsional):

```powershell
# Update react-native-screens ke versi yang direkomendasikan
npm install react-native-screens@~4.16.0
```

### Tips Debugging:

1. **Cek Terminal Output**: Lihat error lengkap di terminal
2. **Reload App**: Tekan `r` di terminal Expo untuk reload
3. **Clear Cache**: Tekan `shift+m` lalu pilih "Clear cache"
4. **Restart Device App**: Tutup dan buka ulang Expo Go di device

### Contact:
**Developer**: Valdo Muhammad  
**Instagram**: @valdomuhammadd
