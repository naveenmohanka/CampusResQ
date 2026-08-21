# Shared Data & API Contract Specification

Even though CampusResQ utilizes Firebase Cloud Firestore as a serverless real-time database rather than a traditional REST API, this document specifies the shared data contract between the **Android Application** (Student & Mentor App) and the **Admin Web Dashboard**.

---

## 1. Authentication & Security Roles

Firebase Authentication (`firebase/auth`) manages user identities. Each user document is stored in Firestore under `/users/{uid}`.

### Role Permissions Matrix

| Capability | Student (Android) | Mentor (Android) | Admin (Web Dashboard) |
| :--- | :---: | :---: | :---: |
| Access Admin Web Portal | ❌ Denied | ❌ Denied | ✅ Allowed |
| Report Emergency / Incident | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| View Personal Reports | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| View Assigned Incidents | ❌ | ✅ Allowed | ✅ Allowed |
| View All Campus Incidents | ❌ | ❌ | ✅ Allowed |
| Reassign Incident Mentors | ❌ | ❌ | ✅ Allowed |
| Update Status (In Progress/Resolved) | ❌ | ✅ (Assigned) | ✅ Allowed |
| Modify User Roles | ❌ | ❌ | ✅ Allowed |
| View System Audit Logs | ❌ | ❌ | ✅ Allowed |

---

## 2. Shared Data Entities

### Enums & Constant Values

#### Incident Status (`IncidentStatus`)
- `'reported'`: Initial state when submitted by student
- `'assigned'`: Faculty mentor or security unit designated
- `'in_progress'`: Responder actively on-scene
- `'resolved'`: Emergency handled, report filed, closed

#### Incident Severity (`IncidentSeverity`)
- `'low'`: Minor non-urgent issue (e.g. broken classroom bench)
- `'medium'`: Requires timely attention (e.g. minor sports sprain, gate barrier issue)
- `'high'`: Urgent threat (e.g. chemical fume leak, hostel dispute)
- `'critical'`: Immediate life-safety emergency (e.g. cardiac arrest, structural fire)

#### Incident Category (`IncidentCategory`)
- `'medical'`
- `'fire'`
- `'security'`
- `'facility'`
- `'ragging'`
- `'harassment'`
- `'other'`

---

## 3. Real-Time Event Dispatch Protocol

1. **Student Reports Incident (Android App)**:
   - Creates a document in Firestore `incidents/{id}` with `status: 'reported'`.
   - Admin Web Dashboard `onSnapshot` listener receives instant notification without browser refresh.
   - Alert audio/toast triggers on command center monitors.

2. **Admin Assigns Mentor (Web Dashboard)**:
   - Updates `incidents/{id}` setting `assignedTo: mentorId`, `assignedToName: mentorName`, and `status: 'assigned'`.
   - Automatically writes entry to `activityLogs` with action `'INCIDENT_ASSIGNED'`.
   - Android mentor client receives real-time assignment push update.

3. **Mentor / Admin Updates Status or Resolves**:
   - Updates `status` to `'in_progress'` or `'resolved'`.
   - Records resolution summary in `resolutionNotes` and `resolvedAt`.
   - Audit trail updated in `activityLogs`.
