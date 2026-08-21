# CampusResQ — Admin Web Dashboard

Real-time Incident Response & Campus Emergency Operations Command Center built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Recharts**, and **Firebase Cloud Firestore**.

---

## Features

- **Live Emergency Command Center**: Real-time KPI telemetry (Total, Active, Critical, Resolved) and live incident streams.
- **Incident Management**: Multi-parameter search & filtering (status, severity, category), sorting, CSV export, and quick actions.
- **Detailed Incident Telemetry**: GPS campus coordinates visualizer, reporter details, responder panel, and resolution summaries.
- **Faculty / Security Mentor Assignment**: Seamlessly assign emergency response leads with instant notifications.
- **User & Role Management**: Directory of registered students, mentors, and administrators with role modification controls.
- **Immutable Audit Trail**: Chronological activity log of all incident creations, status modifications, assignments, and escalations.
- **Decoupled Architecture**: Fully decoupled from the Android client while sharing the exact same Cloud Firestore project.
- **Role-Based Security**: Strict access control verifying `role === 'admin'` from Firestore `users/{uid}`.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## Authentication Flow

```text
Login Form (Email + Password)
          │
          ▼
Firebase Auth (signInWithEmailAndPassword)
          │
          ▼
Firestore Lookup (users/{uid})
          │
          ▼
Check: role === 'admin'
 ├── True  --> Grant Access to Dashboard
 └── False --> Deny Access & Terminate Session
```
