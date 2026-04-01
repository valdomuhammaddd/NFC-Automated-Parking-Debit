![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Android-green?style=flat-square&logo=android)
![Framework](https://img.shields.io/badge/framework-React%20Native-blue?style=flat-square&logo=react)
![Language](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square&logo=typescript)
![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)

# MARKIR E-Parking Management

**MARKIR** is a high-performance E-Parking Management ecosystem. It leverages **NFC (Near Field Communication)** hardware integration to provide secure, contactless, and real-time parking fee settlement.

---

## 👨‍💻 Developer
**Valdo Muhammad** *Computer Systems Student* Indo Global Mandiri University, Palembang  
Instagram: [@valdomuhammadd](https://instagram.com/valdomuhammadd)

---

## ✨ Features
* **NFC Technology**: Seamless Read & Write capabilities for NFC tags.
* **E-Wallet System**: Integrated simulation with GoPay, DANA, and LinkAja.
* **Membership System**: Automated logic for free parking for registered members.
* **Admin Dashboard**: Real-time statistics and management tools.
* **Transaction History**: Complete and secure audit trail for all activities.
* **Google OAuth**: Secure authentication via Google Sign-In.
* **Blue Ocean Theme**: Modern and sleek UI/UX design (#0077B6).

---

## 🛠️ Tech Stack
* **Framework**: React Native + TypeScript
* **State Management**: Redux Toolkit
* **Architecture**: MVVM (Model-View-ViewModel) Pattern
* **Navigation**: React Navigation 7.x
* **NFC**: `react-native-nfc-manager`
* **Authentication**: `@react-native-google-signin/google-signin`
* **Styling**: React Native StyleSheet

---

## 📂 Project Structure
```text
markir-app/
├── src/
│   ├── data/
│   │   ├── api/           # Mock API handlers & simulation logic
│   │   └── types/         # TypeScript interfaces & types
│   ├── redux/
│   │   ├── slices/        # Redux slices (auth, user, transaction)
│   │   ├── store.ts       # Central Redux store configuration
│   │   └── hooks.ts       # Typed Redux hooks for TypeScript
│   ├── navigation/        # Stack & Tab navigation configurations
│   ├── screens/
│   │   ├── admin/         # Admin-specific modules
│   │   ├── user/          # User-facing modules
│   │   └── auth/          # Authentication flows
│   ├── components/        # Reusable UI components
│   ├── theme/             # Global colors, spacing, and typography
│   └── utils/             # NFC services and helper utilities
├── App.tsx                # Main entry point
└── package.json           # Project dependencies & scripts
```

---

## 🚀 Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npx expo start
```

### 3. Run on Device
* Scan the QR code with the **Expo Go** app.
* Or press **'a'** for Android / **'i'** for iOS in the terminal.

---

## 👤 User Roles

### Admin
* Full Dashboard access with real-time statistics.
* **NFC Tag Reading**: Used for billing and payment verification.
* **NFC Tag Writing**: Used for new motorcycle registration.
* Complete transaction management.

### User
* Personal wallet management.
* Simulated Top-up balance.
* View profile & registered vehicles.
* Personal transaction history.

---

## 💳 Payment System
* **Non-Member**: Rp 2,000 per visit.
* **Active Member**: **FREE** parking.
* **Supported E-Wallets**: GoPay, DANA, LinkAja.

---

## 🎨 Design System (Blue Ocean)
* **Primary**: `#0077B6`
* **Accent**: `#48CAE4`
* **Success**: `#06D6A0`
* **Danger**: `#EF476F`
* **Warning**: `#FFD166`

---

## 📟 NFC Features

### Read Tag (Admin - Billing)
1.  Navigate to the **Billing** screen.
2.  Tap the **"Scan NFC Tag"** button.
3.  Bring the phone close to the target NFC tag.
4.  Payment status and details will be displayed automatically.

### Write Tag (Admin - Vehicle Registration)
1.  Navigate to the **Motorcycle Registration** screen.
2.  Input the owner's name and license plate number.
3.  Tap the **"Write NFC Tag"** button.
4.  Bring the phone close to a blank/writable NFC tag.
5.  System confirms registration and saves to the database.

---

## 🔒 Authentication & Mock API
* **OAuth**: Uses Google OAuth 2.0. Roles are determined server-side/logic-based automatically.
* **Simulated Backend**: The app uses a robust mock API for:
    * Login & Session simulation.
    * NFC Tag validation.
    * Vehicle registration data persistence.
    * E-Wallet balance updates.

---

## 🛠️ Troubleshooting

**NFC Not Responding?**
* Ensure NFC is physically enabled in your device settings.
* Verify that your hardware supports NFC (Near Field Communication).
* The application will automatically switch to **Mock Mode** if hardware is unavailable.

**Build or Dependency Errors?**
```bash
npm install --legacy-peer-deps
npx expo start --clear
```

---

## 📜 License
© 2025 Valdo Muhammad. All Rights Reserved.

## 📞 Contact
* **Instagram**: [@valdomuhammadd](https://instagram.com/valdomuhammadd)
* **University**: Indo Global Mandiri University, Palembang
* **Major**: Computer Systems

---
**Engineered with precision by Valdo Muhammad**
```
