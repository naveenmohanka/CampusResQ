# 🚨 CampusResQ

> A real-time campus emergency and incident response platform connecting campus communities, response teams, and administrators through a shared Firebase-powered system.

CampusResQ enables users to report safety incidents from an Android application, allows administrators to monitor and manage incidents through a web dashboard, and enables approved response team members to receive assigned incidents and update their resolution status in real time.

---

## 🎯 Problem

During a campus emergency, communication is often fragmented. A safety incident may involve multiple people and departments, while the person reporting the incident may not know whom to contact or how the incident is being handled.

CampusResQ provides a unified platform for:

- Reporting campus safety incidents
- AI-assisted incident analysis
- Real-time incident monitoring
- Admin-controlled responder approval
- Incident assignment to approved responders
- Live response status tracking

---

## ✨ Key Features

### 📱 Android Application

- Firebase Authentication
- Reporter and Responder role selection
- Responder access request workflow
- Admin approval for response team members
- Incident reporting
- Personal report tracking
- AI-assisted incident analysis
- Assigned incident visibility for responders
- Incident lifecycle updates

### 💻 Admin Web Dashboard

- Secure Firebase authentication
- Real-time incident monitoring
- Dashboard analytics
- Incident detail view
- Reporter information display
- AI analysis and severity display
- Responder approval workflow
- Assignment of approved responders
- User management
- Activity and incident tracking
- Light and dark themes

### ⚡ Real-Time Synchronization

CampusResQ uses a shared Firebase backend so that updates synchronize across both clients in real time.

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
Update Incident Status
       │
       ▼
Web Admin + Reporter
