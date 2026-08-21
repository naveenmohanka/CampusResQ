# 🚨 CampusResQ

> **Report. Analyze. Respond. Resolve.**

A real-time campus emergency and safety command platform that connects **reporters, approved response team members, and administrators** through a shared Firebase-powered ecosystem.

CampusResQ enables campus users to report safety incidents from an Android application, administrators to monitor and coordinate incidents through a web-based command dashboard, and approved responders to receive and manage assigned incidents in real time.

---

## 🎯 Problem Statement

Campus emergency communication is often fragmented.

During an incident:

- Users may not know whom to contact.
- Emergency information may not reach the correct authority quickly.
- Response teams may not receive structured incident details.
- Administrators may lack real-time operational visibility.
- Reporters may not know whether their incident is being handled.
- Critical incidents may require faster prioritization than normal incidents.

CampusResQ addresses this problem through a unified digital workflow for:

- Incident reporting
- AI-assisted incident triage
- Real-time incident monitoring
- Response team coordination
- Responder approval and assignment
- Incident lifecycle tracking
- Administrative analytics and oversight

---

# 🏗️ System Architecture

CampusResQ consists of multiple connected applications sharing a common backend.

```text
                          CAMPUSRESQ
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Firebase Backend  │
                    │                     │
                    │ • Authentication    │
                    │ • Cloud Firestore   │
                    │ • Cloud Storage     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Android App       Admin Web App      AI Intelligence
        Reporter +        Command Center      Incident
        Response Team                         Analysis
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                     Real-Time Synchronization
The Android application and web dashboard communicate through a shared Firebase project.

👥 System Roles
📱 Reporter

A campus user who can:

Sign in to the application.
Select the appropriate user role.
Report a campus incident.
Provide incident details.
Provide location information.
Track submitted reports.
View incident status updates.
🚑 Response Team

Approved responders can:

Access the response team interface.
View incidents assigned to them.
Filter incidents based on status.
Review incident details.
Review AI-generated analysis.
Prioritize critical and high-severity incidents.
Update the incident lifecycle.
Mark completed incidents as resolved.
💻 Administrator

Administrators use the web dashboard to:

Monitor incoming incidents in real time.
Review incident information.
View AI-generated intelligence.
Manage users and responders.
Approve or reject responder access.
Assign incidents to response team members.
Update incident status.
Create and manage emergency alerts.
Monitor activity logs.
View analytics and operational metrics.
Configure dashboard settings.
✨ Core Features
📱 Android Application
🔐 Authentication and Role Management

The Android application supports:

User authentication.
Reporter access.
Response team access.
Role selection.
Responder access workflow.
Firebase-backed user information.
🚨 Incident Reporting

Users can submit structured emergency or safety reports.

Incident information can include:

Incident title.
Category.
Location.
Description.
Reporter information.
Incident status.
AI-generated analysis.

The report is stored in Firebase and becomes available to the administrative workflow.

🤖 AI-Assisted Incident Analysis

After incident information is collected, the system can analyze:

Title
Category
Location
Description

The AI produces structured intelligence including:

Severity
Priority score
Incident summary
Suggested action
Immediate response recommendation

Supported severity levels:

LOW
MEDIUM
HIGH
CRITICAL

Example analysis:

{
  "severity": "HIGH",
  "priorityScore": 8,
  "summary": "Potential safety incident requiring urgent attention.",
  "suggestedAction": "Assign an available response team member.",
  "requiresImmediateResponse": true
}
🚑 Response Team Workflow

Approved response team members can manage incidents through a dedicated response interface.

Features include:

Assigned incident feed.
Incident filtering.
Pending incidents.
Active incidents.
Resolved incidents.
Priority overview.
Critical incident count.
High-severity incident count.
AI analysis visibility.
Status management.

Incident lifecycle:

pending
   ↓
accepted
   ↓
in_progress
   ↓
resolved
📋 My Reports

Reporters can:

View their submitted incidents.
Review incident details.
Track current status.
Monitor progress from reporting to resolution.
💻 Admin Web Dashboard

The web application acts as the operational command center for CampusResQ.

It provides a centralized interface for administrators to monitor, coordinate, and manage the emergency response workflow.

📊 Dashboard

The dashboard provides operational visibility through:

Incident metrics.
Live incident information.
Recent activity.
Response-time information.
Severity visualization.
Status visualization.
Active emergency alerts.
🚨 Incident Management

Administrators can:

View incidents.
Filter incidents.
Inspect detailed incident information.
Review incident status.
Review AI-generated analysis.
Assign responders.
Update incident status.
Monitor incident progression.
👥 User Management

The user management system supports:

Viewing users.
Reviewing user information.
Managing user roles.
Identifying responder requests.
Managing approved responders.
🚑 Responder Approval Workflow

Response team access is controlled through an approval workflow.

Administrators can:

Review responder requests.
Approve eligible responders.
Reject requests when necessary.
Track responder approval status.

Approval states include:

not_requested
pending
approved
rejected
📢 Emergency Alerts

Administrators can:

View active alerts.
Create emergency alerts.
Publish advisories.
Manage alert information.

The alerts interface provides a mechanism for broadcasting important campus safety information.

📈 Analytics

The analytics section provides operational insights such as:

Incident volume.
Incident categories.
Incident severity.
Incident status.
Response performance.
Operational trends.
📜 Activity Logs

The platform maintains activity information for important administrative operations and incident-related events.

⚙️ Settings

The web application includes a settings area for platform and interface configuration.

🌓 Theme Support

The administrative dashboard supports:

Light mode.
Dark mode.
Theme preference management.
⚡ Complete Incident Workflow
1. Campus user opens Android application
                │
                ▼
2. User authenticates and selects role
                │
                ▼
3. Reporter creates an incident
                │
                ▼
4. Incident is stored in Firebase
                │
                ▼
5. AI analyzes incident details
                │
                ├── Severity
                ├── Priority Score
                ├── Summary
                ├── Suggested Action
                └── Immediate Response Requirement
                │
                ▼
6. Admin dashboard receives incident in real time
                │
                ▼
7. Administrator reviews incident
                │
                ▼
8. Administrator approves / assigns responder
                │
                ▼
9. Assigned responder receives incident
                │
                ▼
10. Responder accepts incident
                │
                ▼
11. Responder begins response
                │
                ▼
12. Incident status becomes in_progress
                │
                ▼
13. Responder resolves incident
                │
                ▼
14. Status becomes resolved
                │
                ▼
15. Updates synchronize across the ecosystem
🧩 Independent Project Modules

CampusResQ is designed around three independently demonstrable modules.

1️⃣ Emergency Reporting Module

The Emergency Reporting module handles the creation and tracking of campus safety incidents.

Responsibilities
Incident creation.
Incident title and description.
Category information.
Location information.
Incident status.
Reporter association.
Incident data storage.
Incident tracking.
Value

This module can function as an independent incident reporting system that enables organizations to collect structured safety reports.

Standalone Repository

CampusResQ-Emergency-Reporting

2️⃣ Live Response Module

The Live Response module manages incident coordination between administrators and responders.

Responsibilities
Incident assignment.
Assigned incident visibility.
Incident acceptance.
Response progress tracking.
Status updates.
Resolution management.
Real-time synchronization.
Value

This module can function as an operational response management system for coordinating assigned incidents and tracking their progress.

Standalone Repository

CampusResQ-Live-Response

3️⃣ AI Intelligence Module

The AI Intelligence module provides structured analysis of incident information.

Input

The module analyzes:

Incident title.
Category.
Location.
Description.
Output
{
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "priorityScore": 1,
  "summary": "Short incident summary",
  "suggestedAction": "Recommended response action",
  "requiresImmediateResponse": false
}
Responsibilities
AI-powered incident analysis.
Severity classification.
Priority scoring.
Incident summarization.
Suggested action generation.
Immediate response detection.
Structured JSON parsing.
Safe fallback handling.
Value

This module can function as an AI-powered intelligence layer for prioritizing and analyzing incoming incident reports.

Standalone Repository

CampusResQ-AI-Intelligence

🛠️ Technology Stack
Android Application
Kotlin
Jetpack Compose
Android SDK
ViewModel
Kotlin Coroutines
Firebase Authentication
Cloud Firestore
Web Application
React
TypeScript
Vite
Tailwind CSS
Firebase Web SDK
Backend and Cloud Services
Firebase Authentication
Cloud Firestore
Firebase Storage
Firebase Security Rules
AI Intelligence
LLM-powered incident analysis
Structured JSON output
Severity classification
Priority scoring
Recommended action generation
📂 Repository Structure
CampusResQ/
│
├── app/                              # Android application
│   │
│   ├── src/
│   │   └── main/
│   │       │
│   │       ├── AndroidManifest.xml   # Android application configuration
│   │       │
│   │       ├── java/
│   │       │   └── com/kiit/campusresq/
│   │       │       │
│   │       │       ├── data/         # Data layer
│   │       │       │   │
│   │       │       │   ├── ai/       # AI analysis models and repository
│   │       │       │   │
│   │       │       │   ├── auth/     # Authentication and user data
│   │       │       │   │
│   │       │       │   └── incident/ # Incident models and Firebase operations
│   │       │       │
│   │       │       ├── navigation/   # Application navigation
│   │       │       │   ├── AppDestination.kt
│   │       │       │   └── AppNavHost.kt
│   │       │       │
│   │       │       ├── presentation/ # Android UI and ViewModels
│   │       │       │   │
│   │       │       │   ├── auth/     # Authentication screens
│   │       │       │   │
│   │       │       │   ├── role/     # Reporter/responder role selection
│   │       │       │   │
│   │       │       │   ├── reporter/ # Reporter home experience
│   │       │       │   │
│   │       │       │   ├── report/   # Incident reporting and report history
│   │       │       │   │
│   │       │       │   ├── incident/ # Incident details and AI analysis UI
│   │       │       │   │
│   │       │       │   └── mentor/   # Response team workflow and status updates
│   │       │       │
│   │       │       └── MainActivity.kt # Android application entry point
│   │       │
│   │       └── res/                  # Android resources
│   │
│   ├── build.gradle.kts              # App-level Gradle configuration
│   └── google-services.json          # Firebase Android configuration
│
├── web/                              # React + TypeScript admin dashboard
│   │
│   ├── public/
│   │   └── favicon.svg               # Web application icon
│   │
│   ├── scripts/
│   │   └── test-rules.mjs            # Firebase rules testing script
│   │
│   ├── src/
│   │   │
│   │   ├── App.tsx                   # Root React application
│   │   ├── main.tsx                  # Web application entry point
│   │   ├── index.css                 # Global styles
│   │   │
│   │   ├── components/               # Reusable UI components
│   │   │   │
│   │   │   ├── activity/
│   │   │   │   └── ActivityTimeline.tsx
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── ActiveAlertsWidget.tsx
│   │   │   │   └── CreateAlertModal.tsx
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── IncidentMap.tsx
│   │   │   │   ├── LoadingSkeleton.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── StatCard.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── LiveIncidentsWidget.tsx
│   │   │   │   ├── MetricsGrid.tsx
│   │   │   │   ├── RecentActivityWidget.tsx
│   │   │   │   ├── ResponseTimeWidget.tsx
│   │   │   │   ├── SeverityChart.tsx
│   │   │   │   └── StatusChart.tsx
│   │   │   │
│   │   │   ├── incidents/
│   │   │   │   ├── AssignMentorModal.tsx
│   │   │   │   ├── IncidentFilters.tsx
│   │   │   │   ├── IncidentTable.tsx
│   │   │   │   └── UpdateStatusModal.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   │
│   │   │   └── users/
│   │   │       └── UserTable.tsx
│   │   │
│   │   ├── context/                  # Global React state
│   │   │   ├── AuthContext.tsx
│   │   │   ├── NotificationContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useActivityLogs.ts
│   │   │   ├── useAlerts.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useIncidents.ts
│   │   │   ├── useIntelligence.ts
│   │   │   ├── useTheme.ts
│   │   │   └── useUsers.ts
│   │   │
│   │   ├── pages/                    # Application pages
│   │   │   │
│   │   │   ├── ActivityLogs/
│   │   │   │   └── ActivityLogs.tsx
│   │   │   │
│   │   │   ├── Alerts/
│   │   │   │   └── Alerts.tsx
│   │   │   │
│   │   │   ├── Analytics/
│   │   │   │   └── Analytics.tsx
│   │   │   │
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   │
│   │   │   ├── Incidents/
│   │   │   │   ├── IncidentDetail.tsx
│   │   │   │   └── Incidents.tsx
│   │   │   │
│   │   │   ├── Login/
│   │   │   │   └── Login.tsx
│   │   │   │
│   │   │   ├── Settings/
│   │   │   │   └── Settings.tsx
│   │   │   │
│   │   │   └── Users/
│   │   │       └── Users.tsx
│   │   │
│   │   ├── routes/
│   │   │   └── index.tsx             # React route definitions
│   │   │
│   │   ├── services/                 # Business and Firebase services
│   │   │   ├── activityService.ts
│   │   │   ├── alertService.ts
│   │   │   ├── analyticsService.ts
│   │   │   ├── incidentService.ts
│   │   │   ├── mockData.ts
│   │   │   ├── userService.ts
│   │   │   │
│   │   │   └── firebase/
│   │   │       ├── auth.ts
│   │   │       ├── config.ts
│   │   │       └── firestore.ts
│   │   │
│   │   ├── types/                    # TypeScript data models
│   │   │   ├── activity.ts
│   │   │   ├── alert.ts
│   │   │   ├── analytics.ts
│   │   │   ├── incident.ts
│   │   │   └── user.ts
│   │   │
│   │   └── utils/                    # Shared utility functions
│   │       ├── aiAnalysis.ts
│   │       ├── dateUtils.ts
│   │       └── formatters.ts
│   │
│   ├── .env.example                  # Environment variable template
│   ├── package.json                  # Node.js dependencies and scripts
│   ├── vite.config.ts                # Vite configuration
│   ├── tailwind.config.js            # Tailwind configuration
│   └── README.md                     # Web-specific documentation
│
├── functions/                        # Firebase/Cloud backend functions
│
├── docs/                             # Project documentation
│   ├── android-web-integration.md    # Android and web integration guide
│   ├── api-contract.md               # Shared API/data contract
│   ├── commercial-modules.md         # Independent module documentation
│   ├── firebase-schema.md            # Firestore data schema
│   ├── firestore.rules               # Firestore security rules
│   ├── setup.md                      # Project setup guide
│   └── storage.rules                 # Firebase Storage security rules
│
├── README.md                         # Main project documentation
├── CONTRIBUTING.md                   # Contribution guidelines
├── AGENT.md                          # Agent/project instructions
├── AGENT_RULE.md                     # Development rules
└── .gitignore                        # Git ignore configuration

Build output directories and generated files are intentionally excluded from the structure above.

🔥 Android Application Architecture

The Android application follows a structured separation between data, navigation, and presentation concerns.

Android App
    │
    ├── Data Layer
    │     ├── Authentication
    │     ├── Incident Data
    │     └── AI Intelligence
    │
    ├── Navigation Layer
    │     ├── Role Selection
    │     ├── Login
    │     ├── Reporter Home
    │     ├── Report Incident
    │     ├── My Reports
    │     └── Response Team
    │
    └── Presentation Layer
          ├── Screens
          ├── UI Components
          ├── AI Analysis
          └── ViewModels

The presentation layer handles the user interface, while data-related operations communicate with Firebase and other application services.

🌐 Web Application Architecture

The web dashboard is organized into separate layers.

React Application
        │
        ├── Pages
        │     └── Route-level screens
        │
        ├── Components
        │     └── Reusable interface elements
        │
        ├── Context
        │     └── Global application state
        │
        ├── Hooks
        │     └── Reusable application logic
        │
        ├── Services
        │     └── Firebase and business operations
        │
        ├── Types
        │     └── Shared TypeScript models
        │
        └── Utils
              └── Common utility functions
🔄 Real-Time Data Flow
Android Reporter
       │
       ▼
Submit Incident
       │
       ▼
Cloud Firestore
       │
       ├──────────────────────► AI Analysis
       │                              │
       │                              ▼
       │                       Structured Intelligence
       │
       ▼
Admin Web Dashboard
       │
       ▼
Review Incident
       │
       ▼
Assign Response Team Member
       │
       ▼
Cloud Firestore
       │
       ▼
Android Response Team
       │
       ▼
accepted
       │
       ▼
in_progress
       │
       ▼
resolved
       │
       ▼
Real-Time Synchronization
🗄️ Core Data Entities

The platform manages important entities such as:

users
incidents
alerts
activity logs
responder approval information

Detailed schema information is documented in:

docs/firebase-schema.md
docs/api-contract.md
🚀 Running the Project
Prerequisites
Android
Android Studio
Android SDK
Java/Kotlin environment
Firebase configuration
Web
Node.js
npm
Firebase project configuration
📱 Run Android Application

Open the main project in Android Studio.

Sync the Gradle project and run the application using:

Android Emulator, or
Physical Android Device.

Ensure the Firebase configuration is available before running the application.

💻 Run Web Dashboard
cd web
npm install
npm run dev

The development server will start locally.

🔐 Environment Configuration

Sensitive credentials must never be committed to the repository.

Use the environment configuration template:

web/.env.example

Example Firebase environment variables:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
🧪 Firestore Rules Testing

The web project includes a rules testing script.

Run:

cd web
npm run test:rules

Security rule definitions are maintained under:

docs/firestore.rules
docs/storage.rules
📚 Documentation

Detailed documentation is available in the docs/ directory.

Document	Purpose
android-web-integration.md	Android and web integration workflow
api-contract.md	Shared application data and API contract
commercial-modules.md	Documentation for the three independent modules
firebase-schema.md	Firestore collections and data schema
firestore.rules	Firestore security rules
setup.md	Project setup documentation
storage.rules	Firebase Storage security rules
🤝 Contribution Workflow

The project follows a branch-based Git workflow.

Create Feature Branch
        │
        ▼
Implement Feature
        │
        ▼
Test Changes
        │
        ▼
Commit Changes
        │
        ▼
Push Feature Branch
        │
        ▼
Create Pull Request
        │
        ▼
Review Changes
        │
        ▼
Merge into main

The main branch represents the integrated project state.

For detailed contribution guidelines, see:

CONTRIBUTING.md
📋 Development Standards

The project documentation and development workflow include:

GitHub collaboration workflow
Feature branches
Pull Requests
Code review
Repository documentation
Shared API/data contracts
Firebase security rules
Separation of independent modules
Agent instructions and development rules

Project-specific development guidance is maintained in:

AGENT.md
AGENT_RULE.md
🎥 Suggested Demonstration Flow

A complete demonstration of CampusResQ can follow this sequence:

1. User opens CampusResQ Android application

2. User authenticates

3. User selects Reporter role

4. User creates an emergency or safety incident

5. Incident is submitted to Firebase

6. AI analyzes the incident

7. AI generates:
   • Severity
   • Priority score
   • Summary
   • Suggested action

8. Admin dashboard receives the incident

9. Administrator reviews the incident

10. Administrator approves/assigns a responder

11. Responder accesses assigned incident

12. Responder accepts the incident

13. Response begins

14. Incident status becomes in_progress

15. Responder resolves the incident

16. Incident status becomes resolved

17. Updates synchronize across the platform
📈 Future Enhancements

Potential future improvements include:

Push notifications
Emergency SOS shortcut
Live campus map
Location-based responder routing
Incident image analysis
Offline incident reporting
Automated escalation policies
Response-time analytics
Advanced AI recommendations
Multi-campus support
👨‍💻 Team

CampusResQ was developed collaboratively as a software engineering and campus safety project.

The project combines:

Android development
Web development
Firebase backend services
Real-time data synchronization
AI-assisted intelligence
Emergency workflow design
⭐ CampusResQ

Report. Analyze. Respond. Resolve.

Building a more connected and responsive campus emergency ecosystem.
