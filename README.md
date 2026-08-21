# 🚨 CampusResQ — Real-Time Campus Emergency & Safety Command Platform

> A real-time campus emergency and incident response platform connecting campus communities, response teams, and administrators through a shared Firebase-powered system.

CampusResQ enables users to report safety incidents from an Android application, allows administrators to monitor and manage incidents through a web dashboard, and enables approved response team members to receive assigned incidents and update their resolution status in real time.

---

## 🏗️ Architecture

CampusResQ comprises two client applications sharing a single, unified Google Firebase project backend:

```
                    SAME FIREBASE PROJECT
                     (campusresq-29f13)
                             │
              ┌──────────────┴──────────────┐
              │                             │
    Android Mobile App             Admin Web Dashboard
  (Reporters & Responders)      (Security & Ops Command)
   Jetpack Compose + Kotlin        React + TypeScript + Vite
              │                             │
              └──────────────┬──────────────┘
                             │
                     Shared Firestore
                     Shared Firebase Auth
                     Shared Firebase Storage
```

---

## ✨ Key Features

### 📱 Android Application
- **Firebase Authentication**: Email/Password and Google sign-in.
- **Reporter & Responder Roles**: Flexible role selection and responder approval request.
- **Incident Reporting**: Photographic evidence, geolocation, and AI-assisted triage analysis.
- **Assigned Incident Feeds**: Responders receive real-time incident notifications for tasks assigned to their Firebase Auth UID.
- **Lifecycle Status Updates**: `pending` → `accepted` → `in_progress` → `resolved`.

### 💻 Admin Web Dashboard
- **Live Command Feed**: Real-time Firestore synchronization of all incoming campus emergencies.
- **AI Triage & Severity Control**: Inspect Gemini AI analysis with human Admin severity override capabilities.
- **Approved Responder Assignment**: Assign verified response team members via their Firebase Auth UID.
- **Responder Approval Workflow**: Verify, approve, or reject responder access applications with audit tracking.
- **Emergency Broadcast Network**: Dispatch campus-wide emergency advisories.
- **Operational Analytics**: Multi-series line charts tracking incidents by category, severity, and volume.
- **Dual Themes**: Crisp, high-contrast Light and Dark mode options with instant toggle.

---

## ⚡ Real-Time Synchronization Workflow

```text
Android Reporter
       │
       ▼
 Report Incident
       │
       ▼
Shared Firebase / Firestore
       │
       ▼
Web Admin Dashboard
       │
       ▼
Approve / Assign Responder
       │
       ▼
Android Responder
       │
       ▼
Update Incident Status (in_progress -> resolved)
       │
       ▼
Web Admin + Reporter
```

---

## 📂 Repository Structure

```
CampusResQ/
│
├── android/                         # Android Mobile Application (Kotlin + Jetpack Compose)
│   ├── app/                         # App Source, Manifest & Resources
│   └── build.gradle.kts
│
├── web/                             # Admin Web Dashboard (React + TypeScript + Vite)
│   ├── public/                      # Static assets & icons
│   ├── src/
│   │   ├── components/              # UI, Layout, Dashboard, Incidents, Users, Alerts
│   │   ├── pages/                   # Login, Dashboard, Incidents, Detail, Users, Analytics
│   │   ├── services/                # Firebase Web SDK, Incident, User, Alert Services
│   │   ├── hooks/                   # useAuth, useIncidents, useUsers, useTheme
│   │   ├── context/                 # AuthContext, NotificationContext, ThemeContext
│   │   ├── types/                   # Incident, User, Alert, Analytics interfaces
│   │   └── routes/                  # React Router definitions
│   ├── .env.example                 # Environment configuration template
│   ├── package.json
│   └── vite.config.ts
│
├── docs/                            # Comprehensive Documentation & Architecture
│   ├── firebase-schema.md           # Firestore Collections & Data Types
│   ├── api-contract.md              # Shared Data & Event Protocol
│   ├── setup.md                     # Web Dashboard Setup Guide
│   └── firestore.rules              # Production Security Rules (54/54 automated tests passing)
│
├── README.md                        # Project Overview
└── CONTRIBUTING.md                  # Git & Contribution Guidelines
```

---

## 🚀 Web Dashboard Setup

```bash
cd web
npm install
npm run dev
```

For automated Firestore security rules testing:
```bash
npm run test:rules
```
