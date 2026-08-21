# CampusResQ — Campus Emergency & Incident Response Platform

CampusResQ is a modern, real-time emergency response and safety management platform for university campuses. It connects students in distress directly with faculty mentors, campus health centers, and security operations.

---

## Architecture

CampusResQ comprises two client applications sharing a single, unified Google Firebase project backend:

```
                    SAME FIREBASE PROJECT
                     (campusresq-29f13)
                             │
              ┌──────────────┴──────────────┐
              │                             │
    Android Mobile App             Admin Web Dashboard
  (Students & Mentors)          (Security & Ops Command)
   Jetpack Compose + Kotlin        React + TypeScript + Vite
              │                             │
              └──────────────┬──────────────┘
                             │
                     Shared Firestore
                     Shared Firebase Auth
                     Shared Firebase Storage
```

---

## Repository Structure

```
CampusResQ/
│
├── AndroidStudioProjects/CampusResQ/ # Android Mobile Application
│   ├── app/                         # Android App Source & Manifest
│   ├── gradle/                      # Gradle Wrappers & Dependencies
│   └── build.gradle.kts
│
├── web/                             # Admin Web Dashboard
│   ├── public/                      # Static assets & icons
│   ├── src/
│   │   ├── components/              # UI, Layout, Dashboard, Incidents, Users
│   │   ├── pages/                   # Login, Dashboard, Incidents, Detail, Users, Logs, Settings
│   │   ├── services/                # Firebase Web SDK, Incident, User, Activity Services
│   │   ├── hooks/                   # useAuth, useIncidents, useUsers, useActivityLogs
│   │   ├── context/                 # AuthContext, NotificationContext
│   │   ├── types/                   # Incident, User, Activity TypeScript interfaces
│   │   └── routes/                  # React Router definitions
│   ├── .env.example                 # Environment configuration template
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                            # Documentation
│   ├── firebase-schema.md           # Firestore Collections & Data Types
│   ├── api-contract.md              # Shared Data & Event Protocol
│   ├── setup.md                     # Web Dashboard Setup Guide
│   └── firestore.rules              # Production Security Rules
│
├── README.md                        # Project Overview
└── CONTRIBUTING.md                  # Git & Contribution Guidelines
```

---

## Web Dashboard Setup

For full setup and running instructions, see [docs/setup.md](docs/setup.md).

```bash
cd web
npm install
npm run dev
```

---

## Data Schema & API Contract

- [Firestore Schema Specification](docs/firebase-schema.md)
- [Shared API & Event Protocol](docs/api-contract.md)
- [Firestore Security Rules](docs/firestore.rules)
