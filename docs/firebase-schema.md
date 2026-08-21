# Firebase & Cloud Firestore Schema Documentation

CampusResQ utilizes Google Cloud Firestore as the single unified real-time backend shared between the **Android Mobile App** (Student & Mentor client) and the **Admin Web Dashboard** (Security Operations Command Center).

---

## Architecture Overview

```
                      FIREBASE PROJECT
                    (campusresq-29f13)
                            │
              ┌─────────────┴─────────────┐
              │                           │
      Android App (Client)        Web Admin Dashboard
    (google-services.json)          (VITE_FIREBASE_*)
              │                           │
              └─────────────┬─────────────┘
                            │
               Shared Cloud Firestore
               Shared Firebase Auth
               Shared Firebase Storage
```

---

## Collections & Documents

### 1. `users` Collection
Stores registered student, mentor, and administrator profile data.

**Document Path**: `users/{userId}` (where `{userId}` corresponds to the Firebase Auth UID)

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | string | Yes | Full name of the user |
| `email` | string | Yes | University email address |
| `role` | string | Yes | One of: `'student'`, `'mentor'`, `'admin'` |
| `department` | string | No | Academic branch or administrative unit (e.g. `'School of Computer Engineering'`) |
| `phoneNumber` | string | No | Mobile contact number for emergency dispatch |
| `avatarUrl` | string | No | URL to profile photo |
| `status` | string | No | `'active'`, `'inactive'`, `'suspended'` |
| `createdAt` | timestamp | Yes | Account creation timestamp |
| `updatedAt` | timestamp | No | Last update timestamp |

---

### 2. `incidents` Collection
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
| `location.building` | string | No | Campus building name |
| `location.floor` | string | No | Specific floor or room |
| `reporterId` | string | Yes | Firebase Auth UID of reporting student |
| `reporterName` | string | Yes | Full name of reporter |
| `reporterEmail` | string | Yes | Email of reporter |
| `reporterPhone` | string | No | Phone number of reporter |
| `assignedTo` | string / null | No | UID of assigned faculty mentor / security lead |
| `assignedToName` | string / null | No | Full name of assigned mentor |
| `assignedToEmail` | string / null | No | Email of assigned mentor |
| `resolutionNotes` | string | No | Summary of actions taken upon resolving the incident |
| `resolvedAt` | timestamp | No | Timestamp when marked resolved |
| `createdAt` | timestamp | Yes | Timestamp when incident was first logged |
| `updatedAt` | timestamp | Yes | Timestamp of most recent update |
| `images` | array<string> | No | Array of Firebase Storage image URLs |

---

### 3. `activityLogs` Collection
Immutable audit log tracking all actions performed across the platform.

**Document Path**: `activityLogs/{logId}`

| Field Name | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `incidentId` | string / null | No | Associated incident ID (if related to an incident) |
| `action` | string | Yes | `'INCIDENT_CREATED'`, `'INCIDENT_ASSIGNED'`, `'STATUS_CHANGED'`, `'SEVERITY_UPDATED'`, `'COMMENT_ADDED'`, `'INCIDENT_RESOLVED'`, `'USER_ROLE_CHANGED'`, `'SYSTEM_ALERT'` |
| `performedBy` | string | Yes | Firebase Auth UID of actor |
| `performedByName` | string | Yes | Full name of actor |
| `performedByRole` | string | Yes | Role of actor at execution time (`'admin'`, `'mentor'`, `'student'`, `'system'`) |
| `details` | string | Yes | Human-readable explanation of the action taken |
| `timestamp` | timestamp | Yes | Event timestamp |
| `metadata` | map | No | Optional structured payload |
