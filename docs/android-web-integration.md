# CampusResQ — Android & Web Integration Contract

This document serves as the single authoritative technical contract between the **CampusResQ Android Mobile App** (Student & Mentor client) and the **CampusResQ Admin Web Dashboard** (Security Operations Center).

---

## 1. Unified Firebase Project Architecture

Both the Android application and the Web dashboard communicate with the **SAME Firebase project**, sharing:
- **Same Cloud Firestore Database**
- **Same Firebase Authentication instance**
- **Same Firebase Storage bucket**

### Client-Specific Configuration Separation:
- **Web Dashboard**: Configured via Vite environment variables (`.env` referencing `VITE_FIREBASE_*`).
- **Android App**: Configured via native `google-services.json` placed in `app/`.

---

## 2. Shared Firestore Collections & Schema Contract

```
Firestore Root
├── users/{uid}               -> Student, Mentor, and Admin user profiles
├── incidents/{incidentId}    -> Emergency reports, dispatch status & SLA tracking
├── alerts/{alertId}          -> Campus Safety Alert Network broadcasts
└── activityLogs/{logId}      -> Immutable platform audit trail
```

---

### Collection 1: `users/{uid}`
Stores profile documents keyed by the Firebase Auth `uid`.

| Field Name | Type | Required | Allowed Values / Description | Implemented Status |
| :--- | :--- | :--- | :--- | :--- |
| `id` | string | Yes | Firebase Auth UID | VERIFIED NOW |
| `name` | string | Yes | Full name of the user | VERIFIED NOW |
| `email` | string | Yes | University email address | VERIFIED NOW |
| `role` | string | Yes | `'student'`, `'mentor'`, `'admin'` | VERIFIED NOW |
| `department` | string | No | Academic branch or operations team | VERIFIED NOW |
| `phoneNumber` | string | No | Emergency phone number | VERIFIED NOW |
| `status` | string | No | `'active'`, `'inactive'`, `'suspended'` | VERIFIED NOW |
| `createdAt` | timestamp | Yes | Account creation timestamp | VERIFIED NOW |

---

### Collection 2: `incidents/{incidentId}`
The primary emergency entity powering **Module 1 (Campus Emergency Response)**.

| Field Name | Type | Required | Allowed Values / Description | Implemented Status |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | Yes | Incident title / brief summary | VERIFIED NOW |
| `description` | string | Yes | Detailed description of the situation | VERIFIED NOW |
| `category` | string | Yes | `'medical'`, `'fire'`, `'security'`, `'facility'`, `'ragging'`, `'harassment'`, `'other'` | VERIFIED NOW |
| `severity` | string | Yes | `'critical'`, `'high'`, `'medium'`, `'low'` | VERIFIED NOW |
| `status` | string | Yes | `'reported'`, `'assigned'`, `'in_progress'`, `'resolved'` | VERIFIED NOW |
| `location` | map | Yes | Geo-location and building details | VERIFIED NOW |
| `location.latitude` | number | Yes | GPS Latitude | PENDING ANDROID GPS |
| `location.longitude`| number | Yes | GPS Longitude | PENDING ANDROID GPS |
| `location.address`  | string | Yes | Human-readable address / landmark | VERIFIED NOW |
| `location.building` | string | No | Campus building name (used for hotspot analytics) | VERIFIED NOW |
| `location.floor`    | string | No | Floor / room level identifier | VERIFIED NOW |
| `reporterId` | string | Yes | Firebase Auth UID of reporting student | VERIFIED NOW |
| `reporterName` | string | Yes | Student full name (`'Anonymous Reporter'` if confidential) | VERIFIED NOW |
| `reporterEmail`| string | No | Reporter email (omitted if `isAnonymous: true`) | VERIFIED NOW |
| `reporterPhone`| string | No | Reporter phone (omitted if `isAnonymous: true`) | VERIFIED NOW |
| `isAnonymous` | boolean | Yes | `true` if reporter identity is shielded | VERIFIED NOW |
| `assignedTo` | string / null| No | UID of assigned faculty mentor / responder | VERIFIED NOW |
| `assignedToName` | string / null| No | Name of assigned responder | VERIFIED NOW |
| `assignedToEmail`| string / null| No | Email of assigned responder | VERIFIED NOW |
| `assignedToPhone`| string / null| No | Phone of assigned responder | VERIFIED NOW |
| `images` | array<string> | No | Array of Firebase Storage download URLs | PENDING ANDROID UPLOAD |
| `resolutionNotes` | string | No | Post-resolution report details | VERIFIED NOW |
| `createdAt` | timestamp | Yes | Report submission timestamp (`serverTimestamp()`) | VERIFIED NOW |
| `assignedAt` | timestamp | No | Timestamp when responder was assigned | VERIFIED NOW |
| `inProgressAt` | timestamp | No | Timestamp when responder reached on-scene | VERIFIED NOW |
| `resolvedAt` | timestamp | No | Timestamp when incident was resolved | VERIFIED NOW |
| `updatedAt` | timestamp | Yes | Most recent modification timestamp | VERIFIED NOW |

---

### Collection 3: `alerts/{alertId}`
Powers **Module 2 (Campus Safety Alert Network)**.

| Field Name | Type | Required | Allowed Values / Description | Implemented Status |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | Yes | Broadcast alert headline | VERIFIED NOW |
| `message` | string | Yes | Emergency instruction message | VERIFIED NOW |
| `severity` | string | Yes | `'critical'`, `'warning'`, `'advisory'` | VERIFIED NOW |
| `category` | string | Yes | `'emergency'`, `'fire'`, `'weather'`, `'security'`, `'health'`, `'facility'`, `'general'` | VERIFIED NOW |
| `targetArea` | string | Yes | Target campus zone (e.g. `'All Campus'`, `'Hostel Complex'`) | VERIFIED NOW |
| `active` | boolean | Yes | `true` if active broadcast, `false` if expired | VERIFIED NOW |
| `createdBy` | string | Yes | Admin UID who broadcasted the alert | VERIFIED NOW |
| `createdByName`| string | Yes | Admin name | VERIFIED NOW |
| `createdAt` | timestamp | Yes | Broadcast timestamp (`serverTimestamp()`) | VERIFIED NOW |
| `expiresAt` | timestamp | No | Scheduled expiration timestamp | VERIFIED NOW |
| `acknowledgedCount`| number | No | Number of client receipts | VERIFIED NOW |

---

## 3. End-to-End Integration Flows (A through I)

### Flow A: Emergency Incident Creation
- **Android App writes**:
  - Creates document in `incidents/{newId}` with `reporterId = auth.uid`, `status = 'reported'`, `createdAt = serverTimestamp()`.
  - Android Status: `PENDING ANDROID IMPLEMENTATION`.
- **Web Dashboard reads**:
  - Listens in real-time via `onSnapshot(collection(db, 'incidents'))`.
  - Instantly renders incident ticket, severity badge, and sound notification.
  - Web Status: `VERIFIED NOW (READY)`.

---

### Flow B: Threat Level & Immutability Contract
- **Allowed Severities**: `low`, `medium`, `high`, `critical`.
- **Business Rule**: Once an incident reaches `status: 'resolved'`, the `severity` field becomes **PERMANENTLY LOCKED & IMMUTABLE**.
- **Enforcement**:
  - Firestore Security Rules reject any write attempting to modify `severity` when `resource.data.status == 'resolved'`.
  - Web UI locks the selector and displays `[ LOCKED 🔒 ]`.
  - Android client must treat `severity` as read-only on resolved tickets.
- Status: Web/Firestore: `VERIFIED NOW (READY)` | Android: `PENDING ANDROID IMPLEMENTATION`.

---

### Flow C: Location Telemetry & Campus Radar
- **Android App sends**:
  - `location: { latitude: 20.3533, longitude: 85.8189, address: 'Central Library, 2nd Floor', building: 'Central Library', floor: '2nd Floor' }`.
- **Web Dashboard visualizer**:
  - Consumes exact coordinates and renders campus zone blueprint/radar coordinates.
- Status: Web Visualizer: `VERIFIED NOW (READY)` | Android GPS integration: `PENDING ANDROID IMPLEMENTATION`.

---

### Flow D: Evidence Upload & Storage Protection
- **Firebase Storage Path**:
  ```
  incidents/{incidentId}/evidence/{fileName}
  ```
- **Access Security Rules**:
  - Read access permitted strictly for: Verified Admins, Mentors, and the Student who reported the incident.
  - Public unauthenticated read access is **DENIED**.
- Status: Storage Security Rules & Preview UI: `VERIFIED NOW (READY)` | Android Camera/Upload flow: `PENDING ANDROID IMPLEMENTATION`.

---

### Flow E: Anonymous & Whistleblower Reporting
- **Android App sends**: `isAnonymous: true`.
- **Web Dashboard behavior**:
  - Displays "Anonymous Reporter" in responder-facing lists.
  - Shields contact phone and email.
- Status: Web Anonymity Shield: `VERIFIED NOW (READY)` | Android anonymous report toggle: `PENDING ANDROID IMPLEMENTATION`.

---

### Flow F: Responder Assignment
- **Web Dashboard writes**:
  - Updates `incidents/{incidentId}` with `assignedTo: mentorUid`, `assignedToName: mentorName`, `status: 'assigned'`, `assignedAt: serverTimestamp()`.
- **Android Responder reads**:
  - Mentors query `incidents` where `assignedTo == auth.uid` to view assigned tickets.
- Status: Web Assignment Data: `VERIFIED NOW (READY)` | Android Responder Inbox: `PENDING ANDROID IMPLEMENTATION`.

---

### Flow G: Incident Lifecycle State Machine
```
[ REPORTED ] ──(Admin Assigns)──> [ ASSIGNED ] ──(Responder Arrives)──> [ IN_PROGRESS ] ──(Issue Resolved)──> [ RESOLVED ]
                                                                                                                   │
                                                                                                          [ THREAT LEVEL LOCKED 🔒 ]
```
- Status: Web Lifecycle Transitions: `VERIFIED NOW (READY)` | Android Status Handler: `PENDING ANDROID IMPLEMENTATION`.

---

### Flow H: Campus Safety Alert Broadcasts
- **Web Dashboard writes**:
  - Admin creates document in `alerts/{alertId}` with `active: true`.
- **Android App reads**:
  - Subscribes to `where('active', '==', true)` and displays emergency banner.
- Status: Web Broadcast Console: `VERIFIED NOW (READY)` | Android Alert Banner: `PENDING ANDROID IMPLEMENTATION`.

---

### Flow I: Push Notifications Infrastructure (FCM)
- **FCM Topics Contract**:
  - All Campus Alerts: `/topics/campus_alerts`
  - Target Zone Alerts: `/topics/zone_{zone_id}`
- **Current Status**:
  - Firestore data contracts: `READY`
  - Actual FCM Android device notification receiver: `PENDING ANDROID/FCM INTEGRATION` (No fake push delivery claimed).
