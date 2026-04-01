@echo off
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║  🔥 MARKIR 2.0 - ULTRA CLEAN START 🔥                            ║
echo ║  FINAL FIX: Enhanced spacing object with borderRadius + shadow! ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo ⚠️  JANGAN TUTUP WINDOW INI! (DO NOT CLOSE THIS WINDOW!)
echo.
echo ════════════════════════════════════════════════════════════════════
echo   STEP 1: Killing old Node processes...
echo ════════════════════════════════════════════════════════════════════
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✅ Old processes killed!
echo.
echo ════════════════════════════════════════════════════════════════════
echo   STEP 2: Clearing ALL caches (Expo, Metro, System)...
echo ════════════════════════════════════════════════════════════════════
cd /d "%~dp0"
rmdir /s /q .expo 2>nul
rmdir /s /q node_modules\.cache 2>nul
rmdir /s /q "%LOCALAPPDATA%\Expo" 2>nul
del /q "%TEMP%\metro-*" 2>nul
del /q "%TEMP%\haste-map-*" 2>nul
echo ✅ All caches cleared!
echo.
echo ════════════════════════════════════════════════════════════════════
echo   STEP 3: Starting Expo with --clear flag...
echo ════════════════════════════════════════════════════════════════════
echo.
echo 📡 Server akan berjalan di: http://localhost:8084
echo.
echo ⏳ Tunggu sampai muncul QR Code (30-60 detik)...
echo.
echo ════════════════════════════════════════════════════════════════════
echo.

npx expo start --clear --port 8084

echo.
echo ════════════════════════════════════════════════════════════════════
echo   Server stopped. Press any key to close...
echo ════════════════════════════════════════════════════════════════════
pause >nul
