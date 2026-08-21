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

> **Note**: If `.env` is omitted or contains placeholder values, the dashboard automatically enters **Interactive Demo / Simulation Mode**, providing pre-seeded campus emergency data and mock real-time event updates without throwing errors.

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

### Preview Production Build
```bash
npm run preview
```

### TypeScript Validation
```bash
npm run lint
```

---

## Default Admin Credentials (Demo Mode)

- **Email**: `admin@campusresq.edu`
- **Password**: `password123`
- Or click **"One-Click Admin Demo Login"** on the login screen.
