# TROUBLESHOOTING: Delete Promotion Issue

## Symptoms
- Create promotion: ✅ Works
- Update promotion: ✅ Works  
- Delete promotion: ❌ Fails (tidak terhapus)
- Backend keeps crashing

## Root Causes Found

### 1. Backend Server Stability
Server crashes when handling certain requests.

### 2. Possible ID Mismatch
Frontend sends ID as string, backend expects number.

## Quick Fix Steps

### Step 1: Verify Backend is Running
```bash
# In terminal 1:
cd backend
node src/index-mock.js
```

Should show:
```
🚗 MARKIR E-Parking API Server (MOCK)
📡 Running on: http://localhost:3000
```

### Step 2: Test Delete Manually
```powershell
# Get promotions
Invoke-RestMethod -Uri "http://localhost:3000/api/promotions"

# Delete promotion ID 1
Invoke-RestMethod -Uri "http://localhost:3000/api/promotions/1" -Method DELETE
```

### Step 3: Check Frontend Console Logs
When you press delete in app, check console for:
```
🗑️ Deleting promotion ID: <id> Type: string
🗑️ Parsed ID: <number>
```

If you see error, it will show full details.

### Step 4: Check Backend Terminal
Should show:
```
🗑️ DELETE request for promotion ID: 1
🔍 Found at index: 0
✅ Deleted: <title>
DELETE /api/promotions/1 200
```

## Alternative: Simplified Delete Function

If still not working, we can simplify the delete flow:

1. **Remove confirmation alert** (test without it)
2. **Add inline delete** (swipe to delete)
3. **Use optimistic updates** (delete from UI immediately, sync later)

## Next Actions

Please try:
1. Reload app (`r` in Expo)
2. Go to ManagePromotions
3. Try to delete
4. Share with me:
   - ✅ Alert "Yakin hapus?" appeared?
   - ✅ Alert "Berhasil" appeared?
   - ✅ List refreshed?
   - ❌ Any error message?
   - Backend terminal logs

This will help me pinpoint exact issue!
