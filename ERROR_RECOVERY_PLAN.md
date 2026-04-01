# 🚨 ERROR RECOVERY PLAN

**Current Issue**: "Something went wrong" saat buka app  
**Status**: Server running OK, tapi app crash saat load

---

## 📋 LANGKAH TROUBLESHOOTING

### **STEP 1: CEK ERROR MESSAGE LENGKAP**

**Yang perlu Anda lakukan:**

1. Buka terminal Expo yang sedang running
2. Cari baris yang **MERAH** atau ada kata "ERROR"
3. Copy-paste **SELURUH error message** (minimal 5-10 baris)
4. Beritahu saya errornya

**Contoh error yang mungkin muncul:**
```
ERROR  Error: Cannot find module './src/navigation/RootNavigator'
ERROR  TypeError: undefined is not an object
ERROR  Unable to resolve module @react-navigation/native
```

---

### **STEP 2: TEST DENGAN MINIMAL APP** (Jika Step 1 tidak ada error jelas)

**Tujuan**: Cek apakah problem di React Native basic atau di kode kita

**Cara:**

```powershell
# 1. Stop server dulu (Ctrl+C di terminal Expo)

# 2. Backup App.tsx yang sekarang
Rename-Item App.tsx App.backup.tsx

# 3. Copy minimal app
Copy-Item App.minimal.txt App.tsx

# 4. Restart server
npx expo start --clear

# 5. Buka web (tekan 'w')
```

**Expected Result:**
- ✅ Jika muncul "MARKIR" dengan button "Test Button" → React Native OK, masalah di kode kita
- ❌ Jika masih error → Problem di setup/dependency

---

### **STEP 3: CHECK DEPENDENCY ISSUES**

**Jika minimal app juga error, run:**

```powershell
# Check for missing dependencies
npm install

# Clear ALL caches (nuclear option)
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path .expo -Recurse -Force
Remove-Item -Path package-lock.json -Force
npm install
npx expo start --clear
```

---

## 🔍 COMMON ERRORS & QUICK FIXES

### Error 1: "Cannot find module"
```
ERROR  Error: Cannot find module './src/navigation/RootNavigator'
```

**Fix:**
```powershell
# Check file exists
Test-Path src/navigation/RootNavigator.tsx

# If FALSE, restore from backup
```

---

### Error 2: "Element type is invalid"
```
ERROR  Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: undefined
```

**Cause**: Import/export mismatch

**Fix**: Check imports in App.tsx
```typescript
// WRONG
import { RootNavigator } from './src/navigation/RootNavigator';

// CORRECT (if using default export)
import RootNavigator from './src/navigation/RootNavigator';
```

---

### Error 3: "undefined is not an object (evaluating 'X.Y')"
```
ERROR  TypeError: undefined is not an object (evaluating 'theme.colors')
```

**Cause**: Missing import or wrong export

**Fix**: Check all imports and make sure exports exist

---

### Error 4: "Unable to resolve module @react-navigation/native"
```
ERROR  Unable to resolve module @react-navigation/native from App.tsx
```

**Fix:**
```powershell
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo start --clear
```

---

### Error 5: Web-specific: "Cannot read properties of undefined"
```
console error: Cannot read properties of undefined (reading 'push')
```

**Cause**: Navigation not initialized properly

**Fix**: Check NavigationContainer wraps everything

---

## 🎯 QUICK DIAGNOSTIC COMMANDS

**Run these di PowerShell untuk collect info:**

```powershell
# 1. Check Node version
node --version
# Should be: v18+ or v20+

# 2. Check npm version  
npm --version
# Should be: v9+ or v10+

# 3. Check Expo CLI
npx expo --version
# Should be: ~2.1.x

# 4. List installed packages
npm list --depth=0

# 5. Check for peer dependency warnings
npm install --dry-run
```

---

## 📸 SCREENSHOT CHECKLIST

**Kalau masih error, ambil screenshot:**

1. **Terminal Expo** - Full terminal output (scroll ke atas, capture semua)
2. **Browser Console** (jika buka web) - F12 → Console tab → Screenshot RED errors
3. **Package.json** - Show dependencies section
4. **File structure** - `tree src -L 2` atau screenshot folder structure

---

## 🔄 RESET TO WORKING STATE

**Jika semua gagal, restore ke kondisi yang pasti kerja:**

```powershell
# 1. Kill all Node processes
taskkill /F /IM node.exe

# 2. Remove all build artifacts
Remove-Item -Path .expo -Recurse -Force
Remove-Item -Path node_modules -Recurse -Force  
Remove-Item -Path package-lock.json -Force

# 3. Reinstall EXACT versions
npm install

# 4. Restore App.backup.tsx if you renamed it
if (Test-Path "App.backup.tsx") { 
    Rename-Item App.backup.tsx App.tsx -Force 
}

# 5. Clear and restart
npx expo start --clear
```

---

## 💡 WHAT TO TELL ME

**For fastest help, provide:**

1. **Exact error message** from terminal (copy-paste text)
2. **When error happens**: During bundling? After app loads? On specific screen?
3. **What you tried**: Minimal app? Clear cache? Reinstall?
4. **Screenshots**: Terminal + Browser console (if applicable)

---

## ✅ SUCCESS CRITERIA

**App is working when:**
- [ ] Splash screen shows (white bg, MARKIR logo)
- [ ] Splash disappears after 2 seconds
- [ ] Login screen appears
- [ ] Button press works (shows alert)
- [ ] No RED errors in console

**If minimal app works:**
- We know React Native setup is OK
- Problem is in our code (navigation, redux, etc)
- We can fix one component at a time

**If minimal app also fails:**
- Problem is in environment/dependencies
- Need to fix setup first before adding features

---

## 🚀 NEXT STEPS

1. **Run Step 1** - Find exact error message
2. **Tell me** the error (copy-paste)
3. **I will give** specific fix based on error
4. **We test** together until it works

**Remember**: Every error can be fixed! Just need to see exact error message. 😊

---

*Updated: November 9, 2025*
