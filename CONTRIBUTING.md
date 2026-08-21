# Contributing to CampusResQ

Thank you for contributing to CampusResQ!

CampusResQ is a collaborative real-time emergency response platform consisting of:
- **Android Application** — Kotlin + Jetpack Compose
- **Admin Web Dashboard** — React + TypeScript + Vite
- **Shared Firebase Backend** — Firestore, Authentication, Storage, Security Rules

Please follow the guidelines below to keep development organized and production-ready.

---

## 🌿 Branching Strategy

1. **Main Branch**: The `main` branch is protected and contains stable releases.
2. **Feature Branches**: All feature development, fixes, and modifications should be conducted on dedicated feature branches:
   - Example: `feature/admin-dashboard`, `feature/push-notifications`, `fix/incident-filter`
3. **Pull Requests**: Submit a PR to `main` with detailed verification notes and test results.

---

## 🔒 Security & Secrets Policy

- **NEVER commit `.env` files**, API secrets, service account JSON files, or private keys to Git.
- Use `.env.example` templates with placeholder variables.
- Ensure Firestore Security Rules enforce strict role-based access before deploying (`npm run test:rules`).

---

## 📋 Code Quality Standards

### Web Dashboard
- TypeScript with strict type-checking (`npm run lint`).
- Clean separation of UI components, hooks, services, and centralized types.
- Production build validation (`npm run build`).

### Android Application
- Kotlin + Jetpack Compose.
- Single source of truth with Firebase Auth & Firestore models.
