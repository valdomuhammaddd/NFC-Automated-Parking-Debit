
# MARKIR E-Parking Management

MARKIR is an E-Parking Management application utilizing NFC technology for efficient parking fee management.

## Developer

**Valdo Muhammad**  
Computer Systems Student  
Indo Global Mandiri University, Palembang  
Instagram: [@valdomuhammadd](https://instagram.com/valdomuhammadd)

## Features

-  **NFC Technology**: Read & write NFC tags
-  **E-Wallet System**: Integration with GoPay, DANA, LinkAja
-  **Membership System**: Free parking for members
-  **Admin Dashboard**: Statistics and management tools
-  **Transaction History**: Complete audit trail
-  **Google OAuth**: Secure authentication
-  **Blue Ocean Theme**: Modern UI/UX (#0077B6)

## Tech Stack

- **Framework**: React Native + TypeScript
- **State Management**: Redux Toolkit
- **Architecture**: MVVM Pattern
- **Navigation**: React Navigation 7.x
- **NFC**: react-native-nfc-manager
- **Authentication**: @react-native-google-signin/google-signin
- **Styling**: React Native StyleSheet

## Project Structure

```
markir-app/
  src/
    data/
      api/           # Mock API handlers
      types/         # TypeScript interfaces
    redux/
      slices/        # Redux slices (auth, user, transaction)
      store.ts       # Redux store configuration
      hooks.ts       # Typed Redux hooks
    navigation/      # Navigation stacks
    screens/
      admin/         # Admin screens
      user/          # User screens
      auth/          # Authentication screens
    components/      # Reusable components
    theme/           # Colors, spacing, typography
    utils/           # NFC service and utilities
  App.tsx           # Main entry point
  package.json
```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Start Development Server**
   ```bash
   npx expo start
   ```
3. **Run on Device**
   - Scan the QR code with the Expo Go app
   - Or press 'a' for Android / 'i' for iOS in the terminal

## User Roles

### Admin
- Dashboard with statistics
- NFC Tag Reading (Billing)
- NFC Tag Writing (Motorcycle Registration)
- Transaction management

### User
- Wallet management
- Top up balance
- View profile & registered motorcycles
- Transaction history

## Payment System

- **Non-Member**: Rp 2,000 per visit
- **Active Member**: FREE parking
- **E-Wallet**: GoPay, DANA, LinkAja

## Design System

**Blue Ocean Theme**
- Primary: #0077B6
- Accent: #48CAE4
- Success: #06D6A0
- Danger: #EF476F
- Warning: #FFD166

## NFC Features

### Read Tag (Admin - Billing)
1. Open the Billing screen
2. Tap "Scan NFC Tag"
3. Bring the phone close to the NFC tag
4. Payment status will be displayed automatically

### Write Tag (Admin - Motorcycle Registration)
1. Open the Motorcycle Registration screen
2. Fill in owner and plate number
3. Tap "Write NFC Tag"
4. Bring the phone close to a blank NFC tag
5. Complete motorcycle information
6. Register in the system

## Authentication

Login uses Google OAuth. The role (admin/user) is determined automatically by the system.

## Mock API

The application uses a mock API to simulate backend operations:
- Login simulation
- Tag checking
- Motorcycle registration
- E-Wallet top up
- Profile management

## Troubleshooting

**NFC Not Working?**
- Make sure NFC is enabled on your device
- Check if your device supports NFC
- The app will use mock mode if NFC is unavailable

**Build Errors?**
   ```bash
   npm install --legacy-peer-deps
   npx expo start --clear
   ```

## License

© 2025 Valdo Muhammad. All Rights Reserved.

## Contact

- Instagram: [@valdomuhammadd](https://instagram.com/valdomuhammadd)
- University: Indo Global Mandiri University, Palembang
- Major: Computer Systems

---

**Made with ❤️ by Valdo Muhammad**
