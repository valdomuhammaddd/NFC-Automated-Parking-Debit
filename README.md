![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Android-green?style=flat-square&logo=android)
![Framework](https://img.shields.io/badge/framework-React%20Native-blue?style=flat-square&logo=react)
![Language](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square&logo=typescript)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue?style=flat-square&logo=postgresql)
![Cache](https://img.shields.io/badge/cache-Redis-red?style=flat-square&logo=redis)
![Architecture](https://img.shields.io/badge/architecture-MVVM%20%2B%20Clean-orange?style=flat-square)

# 📟 MARKIR: Enterprise E-Parking Ecosystem (High-Availability)

**MARKIR** is a production-grade E-Parking management solution engineered to solve revenue leakage and operational bottlenecks in industrial parking environments. By leveraging **Hardware-Software Co-Design**, this system bridges native **NFC (Near Field Communication)** protocols with a scalable backend architecture.

> **Key Architectural Goal:** To provide a fraud-resistant, low-latency settlement layer that ensures 100% transactional integrity.

---

## 🏗️ High-Level System Architecture

The following diagram illustrates the enterprise-grade infrastructure designed for high availability and security, utilizing an API Gateway and dedicated micro-services.

![System Architecture](./assets/mermaid-diagram-2026-04-07-181549.png) 
*(Note: Ensure you have uploaded the Mermaid diagram file to your /assets folder)*

### 🛡️ Architectural Highlights:
* **Ingress & Rate Limiting:** Implemented via **Redis** to prevent API abuse and ensure system stability during peak hours.
* **Stateful Integrity:** Utilizing **PostgreSQL** for ACID-compliant transaction logging, ensuring no data loss during financial settlement.
* **Security Layer:** JWT-based **RBAC (Role-Based Access Control)** orchestrating permissions between Admin, Operators, and Users.

---

## 📡 Hardware-to-Cloud Integration

### NFC Logic Workflow
Automated decision-making process at the edge, ensuring zero-latency response for field operators.

```mermaid
graph TD
    A([Start Billing]) --> B[Initialize NDEF Hardware]
    B --> C{NFC Tag Detected?}
    C -- No --> D[Fallback to Mock Mode]
    C -- Yes --> E[Extract Encrypted Card ID]
    E --> F[Auth Service: Validate Identity]
    F --> G{Active Member?}
    G -- Yes --> H[Apply Membership Logic: Rate=0]
    G -- No --> I[Apply Flat Rate Logic]
    H --> J[Commit Transaction to Ledger]
    I --> J
    J --> K[Update Redux State & Dispatch UI]
    K --> L[Release Hardware]
    L --> M([End Transaction])
````

-----

## ✨ Enterprise-Grade Features

  * 🛡️ **Native NFC Integration**: Direct communication via `react-native-nfc-manager` supporting NDEF Read/Write protocols for ISO 14443-4 tags.
  * ⚡ **Redis-Powered Performance**: Cached rate-limiting and session management to handle high-concurrency requests.
  * 💳 **Fintech Ledger System**: Decoupled settlement layer designed for seamless integration with e-wallet providers (GoPay, DANA, LinkAja).
  * 🔐 **Industrial Security**: Robust Identity Management via Google OAuth 2.0 and custom RBAC middleware.
  * 📊 **Admin Intelligence**: Real-time KPI dashboards for monitoring occupancy, revenue flow, and audit trails.

-----

## 🛠️ Technical Stack & Standards

| Component | Technology | Standard/Pattern |
| :--- | :--- | :--- |
| **Framework** | React Native (Expo) | Cross-Platform Stability |
| **Language** | TypeScript (Strict) | Type-Safety & Code Integrity |
| **State Management**| Redux Toolkit (RTK) | Flux / State Synchronization |
| **Backend Logic** | Node.js / Express | Non-blocking I/O |
| **Persistence** | PostgreSQL | ACID Compliance |
| **Caching/Security**| Redis | In-memory Rate Limiting |
| **Hardware** | NFC NDEF | ISO/IEC 14443-4 |

-----

## 📂 Industrial Boilerplate Structure

```text
markir-app/
├── src/
│   ├── components/      # Atomic Design UI (Atomic, Molecules, Organisms)
│   ├── data/            # MODEL: API Abstraction & Hardware Logic
│   │   ├── services/    # NFC Hardware Abstraction Layer (HAL)
│   │   └── repository/  # Data Access Object (DAO) Pattern
│   ├── redux/           # VIEWMODEL: Slices & Middleware Logic
│   ├── screens/         # Feature-based Screen Modules
│   └── utils/           # Hardware Helpers & Validation Schemas
├── App.tsx              # Root Provider & Navigation Logic
└── package.json         # Manifest
```

-----

## 🚀 Future Roadmap (US-Scale Expansion)

  - [ ] **Phase 1**: Migrating to AWS Lambda & DynamoDB for serverless scalability.
  - [ ] **Phase 2**: Implementation of **Offline-First** sync via WatermelonDB for low-connectivity environments.
  - [ ] **Phase 3**: Automated CI/CD pipelines via GitHub Actions with 90% Unit Test coverage.

-----

## 👨‍💻 Engineering Identity

**Valdo Muhammad**

  * **Role:** Technology Architect & Systems Engineer
  * **Specialization:** Industrial IoT, Distributed Systems, & Backend Scalability.
  * **Track Record:** Optimized industrial payroll systems for **70% operational efficiency boost**.

**Contact:** [LinkedIn](https://www.linkedin.com/in/valdomuhammad/) | [GitHub](https://www.google.com/search?q=https://github.com/mvaldo-it)

-----

© 2026 **Valdo Muhammad**. All Rights Reserved.  
*Engineered for performance. Built for scale.*
