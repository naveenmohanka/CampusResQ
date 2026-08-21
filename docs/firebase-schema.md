# Firebase & Cloud Firestore Schema Documentation

CampusResQ utilizes Google Cloud Firestore and Firebase Storage as the single unified real-time backend shared between the **Android Mobile App** (Student & Mentor client) and the **Admin Web Dashboard** (Security Operations Command Center).

---

## Collections & Documents

### 1. `users` Collection
Stores registered student, mentor, and administrator profile data.

**Document Path**: `users/{userId}` (where `{userId}` is the Firebase Auth UID)

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Full name of the user |
| `email` | string | Yes | University email address |
| `role` | string | Yes | One of: `'student'`, `'mentor'`, `'admin'` |
| `department` | string | No | Academic branch or administrative unit |
| `phoneNumber` | string | No | Mobile contact number for emergency dispatch |
| `status` | string | No | `'active'`, `'inactive'`, `'suspended'` |
| `createdAt` | timestamp | Yes | Account creation timestamp |

---

### 2. `incidents` Collection (Module 1 & 4)
Stores all reported emergency dispatches, student SOS requests, hazard alerts, and security reports.

**Document Path**: `incidents/{incidentId}`

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | string | Yes | Summary of the emergency |
| `description` | string | Yes | Detailed description of the incident |
| `category` | string | Yes | `'medical'`, `'fire'`, `'security'`, `'facility'`, `'ragging'`, `'harassment'`, `'other'` |
| `severity` | string | Yes | `'low'`, `'medium'`, `'high'`, `'critical'` |
| `status` | string | Yes | `'reported'`, `'assigned'`, `'in_progress'`, `'resolved'` |
| `location` | map | Yes | Geolocation and building details |
| `location.latitude` | number | Yes | GPS Latitude |
| `location.longitude` | number | Yes | GPS Longitude |
| `location.address` | string | Yes | Landmark / Address string |
| `location.building` | string | No | Campus building name (used for hotspot intelligence) |
| `location.floor` | string | No | Specific floor or room |
| `reporterId` | string | Yes | Firebase Auth UID of reporting student |
| `reporterName` | string | Yes | Full name of reporter (or `'Anonymous Reporter'` if confidential) |
| `reporterEmail` | string | No | Email of reporter (omitted if `isAnonymous: true`) |
| `reporterPhone` | string | No | Phone of reporter (omitted if `isAnonymous: true`) |
| `isAnonymous` | boolean | No | Flag indicating confidential whistleblower report |
| `assignedTo` | string / null | No | UID of assigned faculty mentor / security lead |
| `assignedToName` | string / null | No | Full name of assigned mentor |
| `assignedToEmail` | string / null | No | Email of assigned mentor |
| `assignedToPhone` | string / null | No | Phone of assigned mentor |
| `images` | array<string> | No | Array of Firebase Storage image URLs |
| `resolutionNotes` | string | No | Summary of actions taken upon resolving the incident |
| `createdAt` | timestamp | Yes | Incident creation timestamp |
| `assignedAt` | timestamp | No | Timestamp when first responder was assigned (powers SLA response time) |
| `inProgressAt` | timestamp | No | Timestamp when responder arrived on-scene |
| `resolvedAt` | timestamp | No | Timestamp when marked resolved |
| `updatedAt` | timestamp | Yes | Timestamp of most recent update |

---

### 3. `alerts` Collection (Module 2: Campus Safety Alert Network)
Stores broadcast advisories, weather warnings, and emergency lockdown orders.

**Document Path**: `alerts/{alertId}`

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | string | Yes | Broadcast headline / title |
| `message` | string | Yes | Emergency instruction and safety details |
| `severity` | string | Yes | `'critical'`, `'warning'`, `'advisory'` |
| `category` | string | Yes | `'emergency'`, `'fire'`, `'weather'`, `'security'`, `'health'`, `'facility'`, `'general'` |
| `targetArea` | string | Yes | Target campus zone (e.g. `'All Campus'`, `'Hostel Complex'`, `'Science Block'`) |
| `active` | boolean | Yes | Whether the alert is currently active and broadcasting |
| `createdBy` | string | Yes | Administrator UID |
| `createdByName` | string | Yes | Administrator name |
| `createdAt` | timestamp | Yes | Publication timestamp |
| `expiresAt` | timestamp | No | Expiration timestamp |
| `acknowledgedCount` | number | No | Number of mobile clients that confirmed receipt |

---

### 4. `activityLogs` Collection (Immutable Audit Trail)
Immutable audit log tracking all actions performed across the platform.

**Document Path**: `activityLogs/{logId}`

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `incidentId` | string / null | No | Associated incident ID |
| `action` | string | Yes | `'INCIDENT_CREATED'`, `'INCIDENT_ASSIGNED'`, `'STATUS_CHANGED'`, `'SEVERITY_UPDATED'`, `'INCIDENT_RESOLVED'`, `'USER_ROLE_CHANGED'`, `'SYSTEM_ALERT'` |
| `performedBy` | string | Yes | Firebase Auth UID of actor (must match `request.auth.uid`) |
| `performedByName` | string | Yes | Full name of actor |
| `performedByRole` | string | Yes | Role of actor at execution time (`'admin'`, `'mentor'`, `'student'`) |
| `details` | string | Yes | Human-readable explanation of the action taken |
| `timestamp` | timestamp | Yes | Event timestamp |
