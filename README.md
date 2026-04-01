# MARKIR E-Parking Management

Aplikasi E-Parking Management dengan teknologi NFC untuk pengelolaan retribusi parkir.

##  Developer

**Valdo Muhammad**  
Mahasiswa Sistem Komputer  
Universitas Indo Global Mandiri Palembang  
Instagram: [@valdomuhammadd](https://instagram.com/valdomuhammadd)

##  Features

-  **NFC Technology**: Read & Write NFC tags
-  **E-Wallet System**: GoPay, DANA, LinkAja integration
-  **Membership System**: Free parking for members
-  **Admin Dashboard**: Statistics and management
-  **Transaction History**: Complete audit trail
-  **Google OAuth**: Secure authentication
-  **Blue Ocean Theme**: Modern UI/UX (#0077B6)

##  Tech Stack

- **Framework**: React Native + TypeScript
- **State Management**: Redux Toolkit
- **Architecture**: MVVM Pattern
- **Navigation**: React Navigation 7.x
- **NFC**: react-native-nfc-manager
- **Auth**: @react-native-google-signin/google-signin
- **Styling**: React Native StyleSheet

##  Project Structure

\\\
markir-app/
 src/
    data/
       api/           # Mock API handlers
       types/         # TypeScript interfaces
    redux/
       slices/        # Redux slices (auth, user, transaction)
       store.ts       # Redux store configuration
       hooks.ts       # Typed Redux hooks
    navigation/        # Navigation stacks
    screens/
       admin/         # Admin screens
       user/          # User screens
       auth/          # Authentication screens
    components/        # Reusable components
    theme/             # Colors, spacing, typography
    utils/             # NFC service and utilities
 App.tsx                # Main entry point
 package.json
\\\

##  Installation

1. **Install Dependencies**
\\\ash
npm install
\\\

2. **Start Development Server**
\\\ash
npx expo start
\\\

3. **Run on Device**
- Scan QR code with Expo Go app
- Or press 'a' for Android / 'i' for iOS

##  User Roles

### Admin
- Dashboard with statistics
- NFC Tag Reading (Penagihan)
- NFC Tag Writing (Registrasi Motor)
- Transaction management

### User
- Wallet management
- Top up balance
- View profile & motorcycles
- Transaction history

##  Payment System

- **Non-Member**: Rp 2,000 per visit
- **Active Member**: FREE parking
- **E-Wallet**: GoPay, DANA, LinkAja

##  Design System

**Blue Ocean Theme**
- Primary: #0077B6
- Accent: #48CAE4
- Success: #06D6A0
- Danger: #EF476F
- Warning: #FFD166

##  NFC Features

### Read Tag (Admin - Penagihan)
1. Open Penagihan screen
2. Tap "Scan Tag NFC"
3. Bring phone close to NFC tag
4. View payment status automatically

### Write Tag (Admin - Registrasi)
1. Open Registrasi Motor screen
2. Fill owner and plate number
3. Tap "Tulis Tag NFC"
4. Bring phone close to blank NFC tag
5. Complete motorcycle information
6. Register in system

##  Authentication

Login menggunakan Google OAuth. Role (admin/user) ditentukan otomatis oleh sistem.

##  Mock API

Aplikasi menggunakan mock API untuk simulasi backend:
- Login simulation
- Tag checking
- Motor registration
- E-Wallet top up
- Profile management

##  Troubleshooting

**NFC Not Working?**
- Ensure NFC is enabled on device
- Check device supports NFC
- App will use mock mode if NFC unavailable

**Build Errors?**
\\\ash
npm install --legacy-peer-deps
npx expo start --clear
\\\

##  License

 2025 Valdo Muhammad. All Rights Reserved.

##  Contact

- Instagram: [@valdomuhammadd](https://instagram.com/valdomuhammadd)
- University: Universitas Indo Global Mandiri Palembang
- Major: Sistem Komputer

---

**Made with  by Valdo Muhammad**
