# Shared Firebase & Android/Web API Contract

This document defines the shared contract between the **CampusResQ Android Mobile App** and the **CampusResQ Admin Web Dashboard**.

---

## 1. Incident Lifecycle & Threat Level Immutability Contract

### Field Definitions:
- `severity` (Threat Level): `'critical'`, `'high'`, `'medium'`, `'low'`
- `status` (Operational Lifecycle): `'reported'`, `'assigned'`, `'in_progress'`, `'resolved'`

### Business Rule: **Immutable Threat Level After Resolution**
1. **Reporting & Active Investigation**:
   - The student reporter selects the initial `severity` during incident creation.
   - Authorized responders / administrators may adjust `severity` (threat level) during active investigation (`reported`, `assigned`, `in_progress`).
2. **Resolution Transition**:
   - When an incident reaches `status: 'resolved'`, the `severity` field becomes **PERMANENTLY LOCKED & IMMUTABLE**.
   - Neither Web administrators nor Android clients can change `severity` once `status == 'resolved'`.
   - `status: 'resolved'` does NOT change or downgrade `severity` (e.g., a resolved Critical incident retains `severity: 'critical'`).
3. **Enforcement**:
   - **Firestore Security Rules**: Reject any `update` operation where `resource.data.status == 'resolved'` and `request.resource.data.severity != resource.data.severity`.
   - **Service Layer**: Throws `"Threat level cannot be changed after an incident is resolved."`
   - **UI Layer**: Replaces interactive severity selector with locked indicator (`[ CRITICAL 🔒 ]`).
   - **Android Client**: Must disable severity modifications on resolved incident views and treat `severity` as read-only once `status == 'resolved'`.

---

## 2. Shared Firestore Document Contracts

### `incidents/{incidentId}`
```json
{
  "id": "inc-2026-001",
  "title": "Severe Asthma Attack",
  "description": "Student collapsed outside Central Library...",
  "category": "medical",
  "severity": "critical",
  "status": "resolved",
  "location": {
    "latitude": 20.3533,
    "longitude": 85.8189,
    "address": "Central Library, 2nd Floor",
    "building": "Central Library"
  },
  "reporterId": "student-201",
  "reporterName": "Priya Sharma",
  "isAnonymous": false,
  "assignedTo": "mentor-103",
  "assignedToName": "Capt. Suresh Panda",
  "resolutionNotes": "Administered inhaler and oxygen at health center.",
  "createdAt": "2026-08-21T10:00:00Z",
  "assignedAt": "2026-08-21T10:05:00Z",
  "resolvedAt": "2026-08-21T10:45:00Z",
  "updatedAt": "2026-08-21T10:45:00Z"
}
```

### `alerts/{alertId}`
```json
{
  "id": "alert-2026-001",
  "title": "FLASH FLOOD ADVISORY",
  "message": "Subway between Campus 3 and 11 is flooded.",
  "severity": "warning",
  "category": "weather",
  "targetArea": "Subway Connector",
  "active": true,
  "createdBy": "admin-001",
  "createdByName": "Dr. Rajesh Mohanty",
  "createdAt": "2026-08-21T10:00:00Z",
  "expiresAt": "2026-08-21T14:00:00Z"
}
```
