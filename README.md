![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Android-green?style=flat-square&logo=android)
![Framework](https://img.shields.io/badge/framework-React%20Native-blue?style=flat-square&logo=react)
![Language](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square&logo=typescript)
![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Architecture](https://img.shields.io/badge/architecture-MVVM-orange?style=flat-square)

# 📟 MARKIR: Enterprise E-Parking Management Ecosystem

**MARKIR** is a high-integrity, industrial-scale E-Parking Management solution. Engineered for low-latency hardware interaction, it bridges native **NFC (Near Field Communication)** capabilities with a secure mobile fintech ecosystem to provide contactless, real-time, and fraud-resistant parking settlement.

Built with a **"Hardware-Software Co-Design"** philosophy, MARKIR ensures reliable performance in mission-critical environments.

---

## 👨‍💻 Engineering Identity
**Valdo Muhammad**
* **Role:** Technology Architect & Systems Engineer
* **Organization:** Independent Systems Consultant
* **Education:** Computer Systems, Indo Global Mandiri University
* **Specialization:** Industrial IoT, Backend Scalability, & Embedded Systems

---

## 🏗️ Architectural Blueprint

The system is built on **Clean Architecture** principles to ensure that business logic remains decoupled from hardware and UI frameworks.

### 📐 MVVM Pattern Implementation
1. **Model (Data Layer):** Encapsulates NDEF protocol logic, TypeScript interfaces, and API abstraction.
2. **View (Presentation Layer):** Stateless, reusable components following **Atomic Design** principles.
3. **ViewModel (Business Logic):** Powered by **Redux Toolkit (RTK)** to manage global state synchronization and hardware event triggers.

---

## ⚙️ System Logic & Workflows

### 🔄 Business Logic: Admin Billing via NFC
The following flowchart illustrates the automated decision-making process when an NFC tag is detected.

```mermaid
graph TD
    A([Start Billing Process]) --> B[Initialize NDEF Hardware Listener]
    B --> C{NFC Tag Detected?}
    C -- No / Timeout --> D[Fallback to Mock Mode / Error Notification]
    C -- Yes --> E[Read NDEF Payload: Card ID]
    E --> F[API/State: Validate Vehicle ID]
    F --> G{Is Active Member?}
    G -- Yes --> H[Apply Membership Logic: Rate = 0]
    G -- No --> I[Apply Flat Rate: Rp 2,000]
    H --> J[Commit Transaction to Ledger]
    I --> J
    J --> K[Update Redux State & Dispatch Toast]
    K --> L[Release Hardware Resource]
    L --> M([End Transaction])
````

### 📡 Hardware-to-State Sequence

This diagram shows the asynchronous interaction between the physical NFC chip and the application's state manager.

```mermaid
sequenceDiagram
    participant Hardware as NFC Chip (ISO 14443)
    participant App as MARKIR Mobile App
    participant RTK as Redux Toolkit (ViewModel)
    participant API as Mock/Cloud Backend

    App->>Hardware: Enable NDEF Discovery Mode
    Note right of Hardware: User Taps NFC Tag
    Hardware-->>App: NDEF Message Payload
    App->>RTK: Dispatch processTransaction(payload)
    RTK->>API: POST /v1/parking/settle
    API-->>RTK: 200 OK (Transaction Confirmed)
    RTK-->>App: Reactive UI Update (Success View)
    App->>Hardware: Disable Discovery
```

-----

## ✨ Enterprise Features

  * 🛡️ **Native NFC Integration**: Deep integration using `react-native-nfc-manager` supporting NDEF Read/Write for industrial tags.
  * 💳 **Fintech Simulation Layer**: Decoupled service layer for integrated e-wallet settlement (GoPay, DANA, LinkAja).
  * 🔐 **OAuth 2.0 Security**: Robust identity management via Google OAuth 2.0 with role-based access control (RBAC).
  * 📊 **Admin Intelligence**: Real-time KPI dashboard monitoring revenue, occupancy, and member conversion.
  * ⚙️ **Hardware-Agnostic Fallback**: Intelligent detection that switches to **Mock Mode** when hardware is unavailable, ensuring zero downtime for logic testing.
  * 📝 **Audit Trail Compliance**: Full transaction logging for security auditing and financial reconciliation.

-----

## 🛠️ Technical Specifications

| Component | Technology | Standard |
| :--- | :--- | :--- |
| **Framework** | React Native (Expo) | Cross-Platform Stability |
| **Language** | TypeScript (Strict) | Type-Safety & Code Integrity |
| **State Management**| Redux Toolkit (RTK) | Flux Architecture |
| **Protocol** | NFC NDEF | ISO/IEC 14443-4 |
| **Architecture** | MVVM | Clean Separation of Concerns |

-----

## 📂 Industrial Boilerplate Structure

```text
markir-app/
├── src/
│   ├── components/      # Atomic UI Components (Reusable)
│   ├── data/            # MODEL: API Services, Hardware Logic, & Types
│   │   ├── api/         # High-fidelity Mock API Handlers
│   │   └── services/    # NFC Hardware Abstraction Layer
│   ├── redux/           # VIEWMODEL: Slices, Store, & Typed Hooks
│   ├── screens/         # Feature-based Screen Modules (Admin/User)
│   ├── theme/           # Blue Ocean Design System (UX Tokens)
│   └── utils/           # Hardware Helpers & Validation Logic
├── App.tsx              # Application Root & Provider Config
├── eslintrc.js          # Code Quality & Linting Rules
└── package.json         # Dependency Manifest
```

-----

## 🚀 Deployment & Installation

### 1\. Environment Requirements

  * Node.js (LTS)
  * NPM / Yarn
  * NFC-enabled Android device for hardware testing.

### 2\. Dependency Management

```bash
npm install
```

### 3\. Execution (Industrial Pipeline)

```bash
# Start Metro Bundler with cache clear
npx expo start --clear

# Deploy to Android
# Use 'a' in terminal or scan QR code via Expo Go.
```

-----

## 🗺️ Future Roadmap (Scalability)

  - [ ] **Phase 1**: Integration with AWS Lambda & DynamoDB for production backend.
  - [ ] **Phase 2**: Implementation of Offline-First Synchronization via WatermelonDB.
  - [ ] **Phase 3**: Biometric Admin Verification (FaceID/Fingerprint).
  - [ ] **Phase 4**: Automated CI/CD pipelines via GitHub Actions.

-----

## 📜 License & Copyright

© 2025 **Valdo Muhammad**. All Rights Reserved.  
*Engineered with architectural precision and systems-thinking.*

-----

**Contact:** [Instagram](https://instagram.com/valdomuhammadd) | [LinkedIn](https://www.linkedin.com/in/mvaldo-it/)

