# NAVIGATION DEBUG REPORT - MARKIR

## Architecture Overview

```
RootNavigator
└── UserStackNavigator (Stack)
    ├── UserHome (Tab Navigator) ← Initial Route
    │   ├── Home Tab → UserHomeScreen
    │   ├── Account Tab → AccountScreen
    │   ├── Wallet Tab → WalletScreen
    │   ├── Pay Tab (center) → NFC functionality
    │   └── About Tab → AboutScreen
    │
    ├── About (Stack Screen)
    ├── NFCPayment (Stack Screen)
    ├── FindParking (Stack Screen)
    ├── History (Stack Screen)
    ├── Vehicles (Stack Screen)
    ├── Booking (Stack Screen)
    ├── Subscription (Stack Screen)
    ├── Promotion (Stack Screen)
    ├── Help (Stack Screen)
    ├── InformasiPribadi (Stack Screen)
    ├── StatusMembership (Stack Screen)
    ├── KendaraanSaya (Stack Screen)
    ├── Notifikasi (Stack Screen)
    └── PusatBantuan (Stack Screen)
```

## Navigation Methods

### ✅ CORRECT - From Screens Inside TabNavigator

**UserHomeScreen** (Home Tab):
```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation<any>();
// To navigate to Stack screens:
navigation.getParent()?.navigate('NFCPayment');
navigation.getParent()?.navigate('FindParking');
// etc.
```

**AccountScreen** (Account Tab):
```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation<any>();
// To navigate to Stack screens:
navigation.getParent()?.navigate('InformasiPribadi');
navigation.getParent()?.navigate('StatusMembership');
navigation.getParent()?.navigate('KendaraanSaya');
navigation.getParent()?.navigate('Notifikasi');
navigation.getParent()?.navigate('PusatBantuan');
navigation.getParent()?.navigate('About');
// To navigate within Tab:
navigation.navigate('Wallet');
```

### ✅ CORRECT - From Stack Screens

**InformasiPribadiScreen**, **StatusMembershipScreen**, etc:
```tsx
const InformasiPribadiScreen = ({ navigation }: any) => {
  // To go back:
  navigation.goBack();
  // To navigate to other Stack screens:
  navigation.navigate('StatusMembership');
}
```

## Issues Found & Fixed

### 1. ✅ FIXED - AccountScreen Navigation
**Before:**
```tsx
export const AccountScreen = ({ navigation }: any) => {
```

**After:**
```tsx
import { useNavigation } from '@react-navigation/native';

export const AccountScreen = () => {
  const navigation = useNavigation<any>();
```

**Why:** Tab screens should use `useNavigation()` hook for consistent navigation access.

### 2. ⚠️ POTENTIAL ISSUE - WalletScreen
**Current:**
```tsx
export const WalletScreen = ({ navigation }: any) => {
```

**Recommendation:** If WalletScreen needs to navigate to Stack screens, should also use `useNavigation()` hook.

## Testing Checklist

### UserHomeScreen (Home Tab)
- [ ] Click "Scan NFC" → Should navigate to NFCPaymentScreen
- [ ] Click "Find Parking" → Should navigate to FindParkingScreen
- [ ] Click "History" → Should navigate to HistoryScreen
- [ ] Click "Vehicles" → Should navigate to VehiclesScreen
- [ ] Click "Booking" → Should navigate to BookingScreen
- [ ] Click "Subscription" → Should navigate to SubscriptionScreen
- [ ] Click "Promotion" → Should navigate to PromotionScreen
- [ ] Click "Help" → Should navigate to HelpScreen

### AccountScreen (Account Tab)
- [ ] Click "Informasi Pribadi" → Should navigate to InformasiPribadiScreen
- [ ] Click "Status Membership" → Should navigate to StatusMembershipScreen
- [ ] Click "Kendaraan Saya" → Should navigate to KendaraanSayaScreen
- [ ] Click "Notifikasi" → Should navigate to NotifikasiScreen
- [ ] Click "Pusat Bantuan" → Should navigate to PusatBantuanScreen
- [ ] Click "E-Wallet" → Should navigate to Wallet tab (within TabNavigator)
- [ ] Click "Tentang Aplikasi" → Should navigate to AboutScreen (Stack)

### All Stack Screens
- [ ] Back button works (navigation.goBack())
- [ ] Cross-navigation between Stack screens works

## Common Errors

### Error: "The action 'NAVIGATE' with payload ... was not handled by any navigator"
**Cause:** Screen name not registered in Stack.Navigator or wrong navigator level.
**Solution:** Ensure screen is registered in UserStackNavigator.tsx and use correct navigation method.

### Error: "Cannot read property 'navigate' of undefined"
**Cause:** Navigation prop/hook not available.
**Solution:** Use `useNavigation()` hook or ensure component receives navigation prop.

## Stack Screen Registration (UserStackNavigator.tsx)

✅ Registered Screens:
1. UserHome (TabNavigator)
2. About
3. NFCPayment
4. FindParking
5. History
6. Vehicles
7. Booking
8. Subscription
9. Promotion
10. Help
11. InformasiPribadi
12. StatusMembership
13. KendaraanSaya
14. Notifikasi
15. PusatBantuan

## TypeScript Types (src/data/types/index.ts)

✅ UserStackParamList includes:
- UserHome
- About
- NFCPayment, FindParking, History, Vehicles, Booking, Subscription, Promotion, Help
- InformasiPribadi, StatusMembership, KendaraanSaya, Notifikasi, PusatBantuan

## Recommendations

1. **All Tab screens** should use `useNavigation()` hook
2. **All Stack screens** can use props `({ navigation }: any)` 
3. Use `navigation.getParent()?.navigate()` when navigating from Tab to Stack
4. Use `navigation.navigate()` when navigating within same navigator level
5. Always add `Vibration.vibrate(50)` for haptic feedback before navigation

## Debug Steps

1. Check if screen is registered in UserStackNavigator
2. Check if screen name matches exactly (case-sensitive)
3. Check if using correct navigation method (getParent for Tab→Stack)
4. Check console for navigation errors
5. Verify navigation hook/prop is available in component
