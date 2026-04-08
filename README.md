![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Android-green?style=flat-square&logo=android)
![Framework](https://img.shields.io/badge/framework-React%20Native-blue?style=flat-square&logo=react)
![Language](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square&logo=typescript)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue?style=flat-square&logo=postgresql)
![Cache](https://img.shields.io/badge/cache-Redis-red?style=flat-square&logo=redis)
![Architecture](https://img.shields.io/badge/architecture-MVVM%20%2B%20Clean-orange?style=flat-square)

# 📟 MARKIR: Enterprise E-Parking Ecosystem

**MARKIR** is a high-integrity, industrial-scale E-Parking management solution. Engineered for low-latency hardware interaction, it bridges native **NFC (Near Field Communication)** capabilities with a secure, scalable backend architecture to provide contactless, real-time, and fraud-resistant parking settlement.

Built with a **"Hardware-Software Co-Design"** philosophy, MARKIR ensures reliable performance in mission-critical environments where data integrity and system uptime are paramount.

---

## 🏗️ System Architecture (Deep-Dive)

The following diagram illustrates the enterprise-grade infrastructure, showcasing the separation of concerns from physical hardware to data persistence.

```mermaid
graph TD
    %% Global Styles
    classDef hardware fill:#f8fafc,stroke:#0077B6,stroke-width:2px,color:#0077B6,stroke-dasharray: 5 5;
    classDef mobile fill:#ffffff,stroke:#0077B6,stroke-width:2px,color:#0077B6;
    classDef backend fill:#0077B6,stroke:#005F8D,stroke-width:2px,color:#ffffff;
    classDef database fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#1e293b;
    classDef cache fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#ffffff;

    %% LAYER 1: PHYSICAL / HARDWARE
    subgraph Layer_Physical [Physical Layer]
        NFC_TAG[("NFC Tag / Smart Card <br/>(ISO/IEC 14443)")]
    end

    %% LAYER 2: MOBILE CLIENT
    subgraph Layer_Mobile [Mobile Client Layer - React Native]
        NFC_MGR[NFC Manager Module]
        APP_LOGIC[Business Logic Controller]
        REDUX[Redux State Manager <br/>Auth & Role State]
        AXIOS[HTTP Client <br/>JWT Authenticated]
    end

    %% LAYER 3: BACKEND SERVICES
    subgraph Layer_Backend [API & Microservices Layer]
        GATEWAY[API Gateway / Ingress]
        AUTH_SVC[Auth & RBAC Service]
        NFC_VALIDATOR[NFC Validation Service]
        TRANS_MGR[Transaction Manager]
    end

    %% LAYER 4: DATA PERSISTENCE & CACHING
    subgraph Layer_Data [Infrastructure Layer]
        REDIS_CACHE[[Redis <br/>Rate Limiting & Session]]
        POSTGRES_DB[(PostgreSQL <br/>Transactional Data)]
    end

    %% DATA FLOW - TOP DOWN LOGIC
    NFC_TAG -- "Raw Data Transmit" --> NFC_MGR
    NFC_MGR --> APP_LOGIC
    APP_LOGIC --> REDUX
    REDUX --> AXIOS

    %% API FLOW WITH RATE LIMITING
    AXIOS -- "HTTPS Request" --> GATEWAY
    GATEWAY <--> REDIS_CACHE
    
    GATEWAY --> AUTH_SVC
    AUTH_SVC --> NFC_VALIDATOR
    NFC_VALIDATOR --> TRANS_MGR
    
    %% PERSISTENCE FLOW
    TRANS_MGR --> POSTGRES_DB
    AUTH_SVC --> POSTGRES_DB

    %% Applying Classes
    class NFC_TAG hardware;
    class NFC_MGR,APP_LOGIC,REDUX,AXIOS mobile;
    class GATEWAY,AUTH_SVC,NFC_VALIDATOR,TRANS_MGR backend;
    class POSTGRES_DB database;
    class REDIS_CACHE cache;
````

-----

## ⚙️ Core Logic & Workflows

### 🔄 Admin Billing via NFC

Automated decision-making process when an NFC tag is detected, ensuring ACID-compliant transaction.

```mermaid
graph TD
    A([Start Billing]) --> B[Initialize NDEF Hardware]
    B --> C{NFC Tag Detected?}
    C -- No --> D[Fallback to Mock Mode]
    C -- Yes --> E[Extract Card ID]
    E --> F[Auth Service: Validate Identity]
    F --> G{Active Member?}
    G -- Yes --> H[Apply Membership Logic: Rate=0]
    G -- No --> I[Apply Flat Rate Logic]
    H --> J[Commit Transaction to Ledger]
    I --> J
    J --> K[Update Redux State & Dispatch UI]
    K --> L[Release Hardware Resource]
    L --> M([End Transaction])
```

-----

## ✨ Enterprise Features

  * 🛡️ **Native NFC Integration**: Deep integration using `react-native-nfc-manager` supporting NDEF protocols for industrial tags.
  * ⚡ **High-Performance Caching**: Redis-integrated API Gateway for stateful **Rate Limiting** and session management.
  * 💳 **Fintech Ledger System**: Secure transactional flow designed for financial reconciliation and audit trail compliance.
  * 🔐 **OAuth 2.0 & RBAC**: Robust identity management with Role-Based Access Control (Admin/Operator/User).
  * ⚙️ **Hardware-Agnostic Fallback**: Intelligent detection that switches to **Mock Mode** when hardware is unavailable, ensuring development continuity.
  * 📊 **Scalable Persistence**: Designed for **PostgreSQL**, ensuring high data integrity for all parking logs.

-----

## 🛠️ Technical Specifications

| Component | Technology | Standard |
| :--- | :--- | :--- |
| **Framework** | React Native (Expo) | Cross-Platform Stability |
| **Language** | TypeScript (Strict) | Type-Safety & Code Integrity |
| **State Management**| Redux Toolkit (RTK) | Flux Architecture |
| **Backend Architecture**| Node.js / Microservices | Scalable Ingress Control |
| **Caching Layer** | Redis | In-memory Rate Limiting |
| **Database** | PostgreSQL | ACID Compliance |
| **Architecture Pattern**| MVVM + Clean Architecture| Modular & Maintainable |

-----

## 📂 Industrial Boilerplate Structure

```text
markir-app/
├── src/
│   ├── components/      # Atomic UI Components (Stateless & Reusable)
│   ├── data/            # MODEL: API Abstraction, NFC Logic, & Repositories
│   │   ├── api/         # Axios Interceptors & Service Contracts
│   │   └── hardware/    # NFC Hardware Abstraction Layer (HAL)
│   ├── redux/           # VIEWMODEL: Global State Slices & Typed Hooks
│   ├── screens/         # Feature-based Screen Modules
│   └── utils/           # Hardware Helpers & Business Logic Schemas
├── App.tsx              # Application Root & Store Configuration
└── package.json         # Dependency Manifest
```

-----

## 🚀 Future Roadmap

  - [ ] **Phase 1**: Migrating to AWS Lambda & DynamoDB for serverless global scale.
  - [ ] **Phase 2**: Implementation of **Offline-First** synchronization using WatermelonDB.
  - [ ] **Phase 3**: Automated CI/CD pipelines via GitHub Actions with 95% test coverage.

-----

## 👨‍💻 Engineering Identity

**Valdo Muhammad**

  * **Role:** Technology Architect & Systems Engineer
  * **Track Record:** Successfully optimized industrial systems for a **70% operational efficiency boost**.
  * **Expertise:** Distributed Systems, Industrial IoT, & Backend Scalability.

**Contact:** [LinkedIn](https://www.linkedin.com/in/valdomuhammad/) | [GitHub](https://www.google.com/search?q=https://github.com/valdomuhammad)

-----

© 2026 **Valdo Muhammad**. All Rights Reserved.  
*Engineered for performance. Built for scale.*
