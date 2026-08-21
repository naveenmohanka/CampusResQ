# CampusResQ — Commercial Startup Modules Specification

This document defines the **Three Separable Commercial Product Modules** (plus one Whistleblower Shield Module) built into the CampusResQ platform. Each module is architected with clean service, component, and data boundaries so that it can be sold, acquired, or licensed independently in the university and enterprise safety marketplace.

---

## Architecture of Separable Modules

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               CampusResQ Platform                                      │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│         MODULE 1         │         MODULE 2         │             MODULE 3             │
│ Campus Emergency Response│Campus Safety Alert Net.  │ Campus Safety Intelligence & SLA │
├──────────────────────────┼──────────────────────────┼──────────────────────────────────┤
│ • Multimodal SOS Intake  │ • Emergency Broadcasts   │ • Repeated Hotspot Detection     │
│ • Geolocation & Blueprint│ • Threat Levels & Zones  │ • Average Response Time SLA      │
│ • Priority Dispatch      │ • Active Alert Widget    │ • 7-Day Volume & Resolution      │
│ • Resolution Tracking    │ • Push Delivery Schema   │ • Target SLA Compliance (<=15m)  │
└──────────────────────────┴──────────────────────────┴──────────────────────────────────┘
```

---

## Module 1: Campus Emergency Response

### 1. Purpose & Target Customer
- **Purpose**: Rapid intake, geolocation, threat prioritization, responder dispatch, and end-to-end resolution tracking for campus emergencies.
- **Target Customer**: University Security Operations, Campus Health Centers, Facility & Maintenance Departments, Corporate Campuses.

### 2. Core Capabilities & Features
- Multimodal emergency reporting (Medical, Fire, Security, Facility, Ragging, Harassment).
- Exact GPS coordinate capture with campus location blueprint visualizer.
- Photographic and media evidence attachments stored under access-controlled Firebase Storage.
- Threat severity classification (`critical`, `high`, `medium`, `low`).
- Faculty mentor / quick-response security lead dispatch and reassignment.
- Live operational status transitions (`reported` &rarr; `assigned` &rarr; `in_progress` &rarr; `resolved`).
- Resolution notes recording and immutable threat level locking upon resolution.

### 3. Firebase Dependencies & Collections
- **Firestore Collections**: `incidents/{incidentId}`, `users/{userId}`
- **Firebase Storage**: `incidents/{incidentId}/evidence/*`
- **Firebase Auth**: User identity & verification

### 4. Inputs & Outputs
- **Inputs**: Incident category, description, GPS lat/long, building/floor, optional evidence photos, reporter UID.
- **Outputs**: Live incident tickets, responder notifications, resolution summaries, response lifecycle timestamps (`createdAt`, `assignedAt`, `resolvedAt`).

### 5. Independent Operation
- Can be deployed as a standalone incident ticketing and dispatch system for campuses that already have third-party alert sirens or analytics tools.

---

## Module 2: Campus Safety Alert Network

### 1. Purpose & Target Customer
- **Purpose**: Authoritative broadcast network for sending real-time emergency alerts, severe weather warnings, building evacuations, and campus lockdown notices to students and faculty.
- **Target Customer**: Dean of Student Affairs, Disaster Management Teams, Campus Public Safety Officers.

### 2. Core Capabilities & Features
- Admin emergency broadcast console with threat levels (`critical`, `warning`, `advisory`).
- Geofenced target zones (e.g. *All Campus*, *Hostel Complex*, *Science Block C*, *Medical Gate*).
- Live active alert banners on command center dashboards and mobile clients.
- Automated alert expiration and manual deactivation controls.
- Delivery acknowledgement tracking.

### 3. Firebase Dependencies & Push Contract
- **Firestore Collections**: `alerts/{alertId}`
- **Firebase Cloud Messaging (FCM)**:
  - Topic: `/topics/campus_alerts` (All-campus emergencies)
  - Topic: `/topics/zone_{zone_id}` (Targeted zone broadcasts)

### 4. Inputs & Outputs
- **Inputs**: Alert title, safety instruction message, severity level, target zone, expiration duration.
- **Outputs**: Broadcast alert documents, real-time subscriber push notifications.

### 5. Independent Operation
- Can be integrated into existing university mobile portals or digital signage networks as an independent emergency broadcasting engine.

---

## Module 3: Campus Safety Intelligence & SLA Analytics

### 1. Purpose & Target Customer
- **Purpose**: Safety intelligence engine that aggregates historical incident data to identify repeated danger hotspots, monitor dispatch response times, and measure safety SLA compliance.
- **Target Customer**: University Executive Leadership, Campus Risk Management & Insurance Auditors, Accreditation Bodies.

### 2. Core Capabilities & Features
- **Repeated Incident Hotspot Analysis**: Groups incidents by building and campus zone to highlight hazard recurrence and critical emergency concentrations.
- **Response Time Analytics**: Computes real dispatch speed:
  $$\text{Average Response Time} = \text{Average}(\text{Timestamp}(\text{assignedAt}) - \text{Timestamp}(\text{createdAt}))$$
- Average and median response times broken down by emergency category and threat severity.
- Target SLA compliance measurement (CampusResQ configurable target SLA of &le; 15 min dispatch).
- 7-Day volume trends comparing reported cases against resolved cases.

### 3. Firebase Dependencies
- **Firestore Collections**: `incidents/{incidentId}`, `activityLogs/{logId}`

### 4. Inputs & Outputs
- **Inputs**: Historical and real-time Firestore incident lifecycle records.
- **Outputs**: Hotspot rankings, latency charts, category distribution, SLA compliance reports, CSV audit exports.

### 5. Independent Operation
- Can be packaged as an analytical add-on or compliance reporting dashboard connected to any standard incident database.

---

## Optional Module 4: Confidential Campus Safety & Whistleblower Shield

### 1. Purpose & Target Customer
- **Purpose**: Safe reporting channel for sensitive complaints (anti-ragging, harassment, internal disputes) protecting student identities.
- **Features**:
  - `isAnonymous: true` flag.
  - Reporter contact information hidden in responder-facing dashboards.
  - Access-controlled evidence protection under strict Firebase Storage rules.
