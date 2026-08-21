# Setup & Development Guide — CampusResQ Admin Web Dashboard

This guide provides instructions for setting up, configuring, and running the **CampusResQ Admin Web Dashboard**.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on `v20.18.0+`)
- **npm**: `v9.0.0` or higher
- **Modern Web Browser**: Chrome, Edge, Firefox, or Safari

---

## Directory Structure

```
CampusResQ/
├── AndroidStudioProjects/CampusResQ/ # Android Mobile Client
├── web/                             # React + Vite + TypeScript Admin Dashboard
│   ├── src/                         # Application source code
│   ├── .env.example                 # Environment variables template
│   ├── package.json
│   └── vite.config.ts
├── docs/                            # Architecture & Schema Specifications
└── README.md
```

---

## Getting Started

### 1. Navigate to the Web Project Directory
```bash
cd web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `web/.env` with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=campusresq-29f13.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campusresq-29f13
VITE_FIREBASE_STORAGE_BUCKET=campusresq-29f13.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=450575997759
VITE_FIREBASE_APP_ID=your_web_app_id_here
```

---

## Running the Dashboard

### Development Server
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173/`

### Production Build
```bash
npm run build
```
Creates an optimized production bundle inside `web/dist/`.

### TypeScript Validation
```bash
npm run lint
```

---

## Admin Authentication & Role-Based Access Control (RBAC)

Access to the Admin Web Dashboard is strictly guarded by Firebase Authentication and Firestore Security Rules:

```text
User enters Email & Password on /login
              │
              ▼
   Firebase Authentication
 (signInWithEmailAndPassword)
              │
              ▼
    Query Firestore Doc
      (users/{uid})
              │
              ▼
       Is role == 'admin'?
      /                 \
    YES                  NO
    /                     \
Access Granted       Access Denied
Dashboard Loads    Session Terminated
```

### Setting Up an Admin User in Firebase:
1. In the **Firebase Console**, create a user in **Authentication** $\rightarrow$ **Users** (or let them sign up).
2. In **Cloud Firestore**, create a document in the `users` collection with the document ID matching the user's `UID`:
   ```json
   {
     "name": "Dr. Rajesh Mohanty",
     "email": "admin@campusresq.edu",
     "role": "admin",
     "department": "Campus Safety & Emergency Operations",
     "createdAt": "timestamp"
   }
   ```
3. The user can now log into the Admin Command Center using their email and password.
