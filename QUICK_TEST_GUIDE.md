# 🚀 QUICK TEST GUIDE - MARKIR E-PARKING

**URL:** http://localhost:8081  
**Status:** ✅ READY FOR TESTING

---

## ⚡ QUICK ACCESS - TOP 5 ACCOUNTS

### 🔴 ADMIN
```
admin@markir.com / admin123
→ AdminHomeScreen (Dashboard)
```

### 🔵 USER PREMIUM (Saldo Tertinggi)
```
valdo@markir.com / valdo123
→ Balance: Rp 500,000 | Premium Member
```

### 🟢 USER PREMIUM (Saldo Sedang)
```
dewi@gmail.com / dewi123
→ Balance: Rp 450,000 | Premium Member
```

### 🟡 USER FREE (Saldo Rendah)
```
rudi@gmail.com / rudi123
→ Balance: Rp 50,000 | Free Member
```

### ⚪ GOOGLE SIGN-IN
```
Klik: "Login dengan Google"
→ Auto-generate random user
```

---

## 📋 COMPLETE ACCOUNT LIST

| No | Email | Password | Role | Balance | Member | ID |
|----|-------|----------|------|---------|--------|-----|
| 1 | admin@markir.com | admin123 | Admin | Rp 0 | ACTIVE | ADM001 |
| 2 | superadmin@markir.com | super123 | Admin | Rp 0 | ACTIVE | ADM002 |
| 3 | valdo@markir.com | valdo123 | User | Rp 500,000 | ACTIVE | USR001 |
| 4 | user1@test.com | user123 | User | Rp 100,000 | FREE | USR002 |
| 5 | user2@test.com | user123 | User | Rp 250,000 | FREE | USR003 |
| 6 | user3@test.com | user123 | User | Rp 75,000 | FREE | USR004 |
| 7 | budi@gmail.com | budi123 | User | Rp 150,000 | ACTIVE | USR005 |
| 8 | siti@gmail.com | siti123 | User | Rp 300,000 | FREE | USR006 |
| 9 | andi@gmail.com | andi123 | User | Rp 200,000 | ACTIVE | USR007 |
| 10 | dewi@gmail.com | dewi123 | User | Rp 450,000 | ACTIVE | USR008 |
| 11 | rudi@gmail.com | rudi123 | User | Rp 50,000 | FREE | USR009 |
| 12 | maya@gmail.com | maya123 | User | Rp 350,000 | ACTIVE | USR010 |
| 13 | agus@gmail.com | agus123 | User | Rp 125,000 | FREE | USR011 |
| 14 | rina@gmail.com | rina123 | User | Rp 275,000 | ACTIVE | USR012 |

---

## ✅ TEST SCENARIOS (Copy-Paste Ready)

### Test 1: Admin Login ✅
```
Email: admin@markir.com
Password: admin123
Expected: AdminHomeScreen dengan stats
Verify: Dashboard, Penagihan, Registrasi buttons
```

### Test 2: Premium User ✅
```
Email: dewi@gmail.com
Password: dewi123
Expected: UserHomeScreen, Balance Rp 450k
Verify: Badge "Member Premium" (green star)
```

### Test 3: Free User ✅
```
Email: rudi@gmail.com
Password: rudi123
Expected: UserHomeScreen, Balance Rp 50k
Verify: Badge "Member Free" (gray star)
```

### Test 4: Multiple Logins ✅
```
1. Login: admin@markir.com / admin123 → Logout
2. Login: valdo@markir.com / valdo123 → Verify different role
3. Login: Google Sign-In → Verify random data
```

### Test 5: Invalid Credentials ✅
```
Email: wrong@test.com
Password: wrong123
Expected: Alert "Email atau password salah!"
```

### Test 6: Navigation Flow ✅
```
Login as User → Home → Wallet → Account → About → Logout
```

---

## 🎯 FEATURE TESTING CHECKLIST

### Admin Features
- [ ] Login admin@markir.com
- [ ] View dashboard stats (Transaksi, Lunas, Tertunggak, Member)
- [ ] View revenue card (Rp 150,000)
- [ ] Navigate to Penagihan
- [ ] Navigate to Registrasi Motor
- [ ] Navigate to About
- [ ] Logout → back to LoginScreen

### User Features
- [ ] Login valdo@markir.com
- [ ] View balance card (Rp 500,000)
- [ ] Check membership badge (Premium/Free)
- [ ] Test 8 features grid (Scan, Find, History, Vehicles, Booking, Subscription, Promotion, Help)
- [ ] Navigate to Wallet screen
- [ ] Connect/disconnect e-wallets (DANA, GoPay, LinkAja, ShopeePay)
- [ ] Navigate to Account screen
- [ ] Test menu items (Informasi, Membership, Kendaraan, etc)
- [ ] Edit profile button
- [ ] Navigate to About screen
- [ ] Logout with confirmation

### Google Sign-In
- [ ] Click "Login dengan Google"
- [ ] Wait 1.5s for mock OAuth
- [ ] Verify random user created (USER[XXXX])
- [ ] Verify balance Rp 50,000
- [ ] Verify Free Member status

---

## 🐛 COMMON ISSUES

### Issue: Login button not working
**Fix:** Check console for errors, refresh browser

### Issue: Balance not showing
**Fix:** User might be admin (admin balance = 0)

### Issue: Membership badge wrong
**Fix:** Check MOCK_USERS in authSlice.ts

### Issue: Navigation broken
**Fix:** Clear cache: Stop server, delete node_modules/.cache, restart

---

## 📊 TEST SUMMARY TEMPLATE

```
=== TESTING SESSION ===
Date: __________
Tester: __________

Admin Login: [ ] Pass [ ] Fail
User Premium: [ ] Pass [ ] Fail
User Free: [ ] Pass [ ] Fail
Google Sign-In: [ ] Pass [ ] Fail
Navigation: [ ] Pass [ ] Fail
Logout: [ ] Pass [ ] Fail

Bugs Found:
1. _______________
2. _______________
3. _______________

Notes:
___________________
___________________
```

---

## 🔥 POWER USER COMBOS

### Combo 1: Full Admin Test
```
1. admin@markir.com / admin123
2. View all stats
3. Test all navigation
4. Logout
5. superadmin@markir.com / super123
6. Verify same access
```

### Combo 2: Balance Comparison
```
1. valdo@markir.com (Rp 500k) → Note UI
2. Logout
3. rudi@gmail.com (Rp 50k) → Compare UI
4. Verify same features available
```

### Combo 3: Membership Test
```
1. Login 5 Premium users (valdo, budi, andi, dewi, maya, rina)
2. Verify green star + "Member Premium"
3. Login 5 Free users (user1-3, siti, rudi, agus)
4. Verify gray star + "Member Free"
```

---

## 📞 SUPPORT

**Developer:** Valdo Muhammad  
**File:** TESTING_ACCOUNTS.md (full details)  
**Server:** http://localhost:8081  

---

**🎉 HAPPY TESTING!**

*Last updated: 15 Nov 2025*
