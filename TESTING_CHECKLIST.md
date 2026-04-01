# ✅ MARKIR 2.0 - QUICK TESTING CHECKLIST

## 🚀 **SERVER STATUS**
- ✅ Server RUNNING at `exp://192.168.0.104:8081`
- ✅ QR Code ready for scanning
- ✅ Press `a` for Android | `w` for Web

---

## 📋 **TESTING CHECKLIST**

### **1. HOME SCREEN** ✅
- [ ] Balance card menampilkan saldo dengan gradient orange
- [ ] Active parking indicator (jika ada parking aktif)
- [ ] 8 Quick action buttons tampil dalam grid
- [ ] Promotions carousel bisa di-scroll horizontal
- [ ] 3 Nearby parking locations tampil
- [ ] Recent activity menampilkan 3 transaksi terakhir
- [ ] Notification bell dengan badge counter

### **2. ACTIVITY TAB** ✅ NEW!
- [ ] Filter tabs berfungsi (All/Parking/Top Up/Subscription)
- [ ] Summary cards menampilkan stats:
  - Total Parking sessions
  - Total Spent this month
  - Average Duration
- [ ] Transaction list menampilkan semua transaksi
- [ ] Status badges (success/warning/error/default)
- [ ] Amount positif untuk top-up (+), negatif untuk parking (-)
- [ ] Empty state jika filter tidak ada data

### **3. PAY/NFC TAB** ✅
- [ ] Center button elevated (floating effect)
- [ ] Placeholder screen dengan icon & text
- [ ] Tab icon berubah warna saat active

### **4. WALLET TAB** ✅ NEW!
- [ ] Current balance card tampil dengan badge "Active"
- [ ] Amount input bisa diisi manual
- [ ] Quick amount buttons (10K, 25K, 50K, 100K, 250K, 500K)
- [ ] Tap quick amount → amount ter-isi otomatis
- [ ] 6 Payment methods tampil (GoPay, OVO, DANA, QRIS, Bank, CC)
- [ ] Radio button berfungsi untuk select payment
- [ ] Credit Card disabled dengan badge "Soon"
- [ ] Summary card muncul saat amount ≥ 10K
- [ ] "Top Up Now" button disabled jika amount < 10K
- [ ] Tap "Top Up Now" → loading 2 detik
- [ ] Success alert muncul dengan amount
- [ ] Balance ter-update di semua screen
- [ ] Kembali ke Home screen setelah success

### **5. ACCOUNT TAB** ✅ NEW!
- [ ] Profile card dengan avatar/initial
- [ ] Stats row (Balance, Vehicles, Parkings)
- [ ] **Account section:**
  - Edit Profile
  - Change Password  
  - Email Settings (menampilkan email)
  - Phone Number
- [ ] **Vehicles section:**
  - My Vehicles (menampilkan jumlah)
  - Add New Vehicle
- [ ] **Preferences section:**
  - Push Notifications (toggle switch berfungsi)
  - Location Services (toggle switch berfungsi)
  - Language (menampilkan "Indonesia")
  - Dark Mode (menampilkan "Off")
- [ ] **Support section:**
  - Help Center
  - Terms & Conditions
  - Privacy Policy
  - Rate MARKIR
- [ ] Logout button (red text dengan icon 🚪)
- [ ] App version di footer "MARKIR v2.0.0 (Parkee Edition)"

### **6. BOTTOM TAB NAVIGATION** ✅
- [ ] 5 tabs tampil (Home, Activity, Pay, Wallet, Account)
- [ ] Tab icons: 🏠 📋 📱 💰 👤
- [ ] Active tab berwarna orange (#FF6B35)
- [ ] Inactive tab berwarna abu-abu
- [ ] Center tab (Pay/NFC) elevated dengan shadow
- [ ] Center tab size lebih besar
- [ ] Smooth animation saat ganti tab
- [ ] Tab label sesuai fungsi

### **7. VISUAL & UX CHECKS** ✅
- [ ] **Colors:**
  - Primary orange (#FF6B35) konsisten
  - Secondary blue (#0077B6) untuk accents
  - Gradients pada headers
- [ ] **Typography:**
  - Font sizes readable
  - Weights (regular, medium, semibold, bold) jelas
- [ ] **Spacing:**
  - Padding & margin consistent
  - No cramped layouts
- [ ] **Shadows:**
  - Cards dengan elevation
  - Center tab dengan shadow
- [ ] **Components:**
  - Button press effects (opacity change)
  - Card variants (elevated, outlined, filled)
  - Badge colors (success green, warning yellow, error red)
- [ ] **Scrolling:**
  - Smooth vertical scroll (Home, Activity, Account)
  - Smooth horizontal scroll (Promotions, Summary cards)
- [ ] **Loading States:**
  - Top Up processing (2 seconds)
  - Activity indicators visible

### **8. NAVIGATION FLOW** ✅
- [ ] Login → redirect ke Home screen
- [ ] Home tab sebagai initial screen
- [ ] Switch antar tab tanpa lag
- [ ] Back button (jika ada) berfungsi
- [ ] Logout → redirect ke Login screen

### **9. DATA INTEGRATION** ✅
- [ ] Balance display sama di Home & Wallet
- [ ] Transactions tampil di Activity tab
- [ ] User name tampil di Home & Account
- [ ] Vehicle count correct di Account stats
- [ ] Top-up amount ter-update real-time

### **10. ERROR HANDLING** ✅
- [ ] Top-up < 10K → warning message
- [ ] Top-up > 10M → warning message
- [ ] Empty transaction list → empty state
- [ ] Disabled payment method → badge "Soon"

---

## 🎯 **TESTING SCENARIOS**

### **Scenario 1: First Time User**
1. Login dengan email baru
2. Explore Home screen (scroll semua sections)
3. Tap quick actions (lihat navigation)
4. Check nearby parking
5. View recent activity (jika ada data mock)

### **Scenario 2: Top-Up Process**
1. Go to Wallet tab
2. Enter amount manually (ex: 75000)
3. Try quick amount button (ex: 100K)
4. Select payment method (ex: GoPay)
5. View summary card
6. Tap "Top Up Now"
7. Wait 2 seconds loading
8. See success alert
9. Verify balance updated
10. Check balance di Home screen

### **Scenario 3: Transaction History**
1. Go to Activity tab
2. View summary cards
3. Filter by "Parking"
4. Filter by "Top Up"
5. Filter by "All"
6. Scroll transaction list
7. Check transaction details

### **Scenario 4: Profile Management**
1. Go to Account tab
2. View stats (balance, vehicles, parkings)
3. Toggle notifications ON/OFF
4. Toggle location ON/OFF
5. Browse all menu items
6. Check logout button (don't tap yet)
7. Scroll to bottom → see version

### **Scenario 5: Navigation Test**
1. Start at Home
2. Tap Activity tab
3. Tap Pay tab (center button)
4. Tap Wallet tab
5. Tap Account tab
6. Back to Home tab
7. Repeat 3x → check performance

---

## 🐛 **KNOWN ISSUES (IF ANY)**

### **Minor Issues:**
- [ ] None reported yet

### **Enhancement Ideas:**
- [ ] Add animation to balance update
- [ ] Add pull-to-refresh on Home
- [ ] Add search bar on Activity
- [ ] Add date picker for transaction filter
- [ ] Add map view on Find Parking button

---

## ✅ **TESTING RESULT**

**Date Tested:** _________________  
**Tested By:** Valdo Muhammad  
**Device:** _________________  
**OS:** Android / iOS / Web  

### **Overall Rating:**
- UI/UX Design: ⭐⭐⭐⭐⭐
- Navigation Flow: ⭐⭐⭐⭐⭐
- Performance: ⭐⭐⭐⭐⭐
- Feature Completeness: ⭐⭐⭐⭐☆

### **Comments:**
_________________________________________________
_________________________________________________
_________________________________________________

### **Bugs Found:**
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### **Improvement Suggestions:**
1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

---

## 📞 **NEXT STEPS AFTER TESTING**

1. **If No Issues:** ✅
   - Mark as production-ready
   - Start Phase 3 (advanced features)
   - Backend integration planning

2. **If Minor Issues:** ⚠️
   - Document issues
   - Prioritize fixes
   - Quick iteration

3. **If Major Issues:** 🔴
   - Immediate debugging
   - Root cause analysis
   - Fix and re-test

---

**GOOD LUCK TESTING! 🚀**

Server sudah running, tinggal scan QR atau press `a`/`w` untuk testing!
