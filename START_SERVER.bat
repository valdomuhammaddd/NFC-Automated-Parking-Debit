@echo off
echo.
echo ================================================================
echo   🚀 MARKIR 2.0 - Starting Server on Port 8084
echo   📦 With FUNDAMENTAL FIX + CACHE CLEAR
echo ================================================================
echo.
echo ⚠️  JANGAN TUTUP WINDOW INI! (DO NOT CLOSE THIS WINDOW!)
echo.
echo Clearing caches...
cd /d "%~dp0"
rmdir /s /q .expo 2>nul
rmdir /s /q node_modules\.cache 2>nul
echo Caches cleared!
echo.
echo Starting server...
echo Server akan berjalan di: http://localhost:8084
echo.
echo ================================================================
echo.

npx expo start --clear --port 8084

echo.
echo Server stopped. Press any key to close...
pause >nul
