@echo off
echo ===============================================
echo TESTING MARKIR API ENDPOINTS
echo ===============================================
echo.

echo [1] Health Check...
curl -s http://localhost:3000/
echo.
echo.

echo [2] Login Admin...
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@markir.com\",\"password\":\"admin123\"}"
echo.
echo.

echo [3] Login User (Valdo)...
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"valdo@markir.com\",\"password\":\"valdo123\"}"
echo.
echo.

echo [4] NFC Scan - Honda Vario...
curl -s -X POST http://localhost:3000/api/nfc/scan ^
  -H "Content-Type: application/json" ^
  -d "{\"nfc_uid\":\"NFC-UID-001\"}"
echo.
echo.

echo [5] NFC Scan - Yamaha Mio...
curl -s -X POST http://localhost:3000/api/nfc/scan ^
  -H "Content-Type: application/json" ^
  -d "{\"nfc_uid\":\"NFC-UID-002\"}"
echo.
echo.

echo [6] Get Promotions...
curl -s http://localhost:3000/api/promotions
echo.
echo.

echo [7] Get Users...
curl -s http://localhost:3000/api/users
echo.
echo.

echo [8] Create Transaction (5000)...
curl -s -X POST http://localhost:3000/api/transactions ^
  -H "Content-Type: application/json" ^
  -d "{\"nfc_uid\":\"NFC-UID-001\",\"petugas_id\":1,\"amount_charged\":5000,\"location\":\"Parkir Utama\"}"
echo.
echo.

echo [9] Get Transactions...
curl -s http://localhost:3000/api/transactions
echo.
echo.

echo ===============================================
echo TEST COMPLETE
echo ===============================================
pause
