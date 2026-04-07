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

![System Architecture]
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
