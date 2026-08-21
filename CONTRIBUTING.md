# Contributing to CampusResQ

Thank you for contributing to **CampusResQ**!

CampusResQ is a collaborative real-time campus emergency and incident response platform consisting of:

- **Android Application** — Kotlin + Jetpack Compose
- **Admin Web Dashboard** — React + TypeScript + Vite
- **Shared Firebase Backend** — Authentication, Firestore, Storage and Security Rules
- **AI Intelligence Layer** — AI-assisted incident analysis and prioritization

This document defines the contribution workflow and development standards used to keep the project organized, secure, and maintainable.

---

## 📋 Before You Start

Before making changes:

1. Read the main `README.md`.
2. Understand the existing project structure.
3. Check whether the feature already exists.
4. Create a dedicated branch for your changes.
5. Never commit sensitive credentials or secrets.

For Firebase setup and shared architecture, refer to the documentation inside:

```text
docs/
🌿 Branching Strategy

The project follows a branch-based Git workflow.

main

The main branch contains the integrated and stable version of the project.

Contributors should avoid directly committing unreviewed feature changes to main.

Feature Branches

All new development should be performed in a dedicated branch.

Recommended naming conventions:

feature/<feature-name>
fix/<issue-name>
docs/<documentation-name>
refactor/<component-name>

Examples:

feature/push-notifications
feature/incident-map
feature/responder-management
fix/incident-filter
fix/firebase-sync
docs/setup-guide
refactor/incident-service
Creating a Branch

Before creating a branch, update your local repository:

git checkout main
git pull origin main

Create a new feature branch:

git checkout -b feature/your-feature-name

Push the branch:

git push -u origin feature/your-feature-name
🔄 Pull Request Workflow

Follow this workflow when contributing a feature.

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
Push Branch
        │
        ▼
Create Pull Request
        │
        ▼
Review Changes
        │
        ▼
Resolve Feedback
        │
        ▼
Merge into main
Pull Request Guidelines

A Pull Request should clearly describe:

What was changed.
Why the change was required.
Which parts of the application were affected.
How the changes were tested.
Any Firebase or configuration changes required.

Example:

## What Changed
Added incident filtering by severity.

## Affected Areas
- IncidentTable
- IncidentFilters
- useIncidents hook

## Testing
- Tested LOW, MEDIUM, HIGH and CRITICAL filters.
- Verified real-time updates.
📝 Commit Message Guidelines

Use clear and meaningful commit messages.

Recommended format:

type: short description

Common types:

feat: add new functionality
fix: resolve a bug
docs: update documentation
refactor: improve internal code structure
style: update formatting or UI styling
test: add or update tests
chore: maintenance or configuration changes

Examples:

feat: add responder assignment
fix: resolve incident status sync
docs: update project README
refactor: improve Firebase service layer
chore: update project configuration

Avoid vague commit messages such as:

update
changes
fixed
final
done
📱 Android Application Contributions

The Android application is built using:

Kotlin
Jetpack Compose
Firebase Authentication
Cloud Firestore
Kotlin Coroutines
ViewModel-based state management

The Android source is located under:

app/

Important application areas include:

data/           # Data and Firebase operations
navigation/     # Navigation destinations and NavHost
presentation/   # Screens, UI state and ViewModels
Android Development Guidelines

When contributing to the Android application:

Follow existing Kotlin naming conventions.
Keep UI logic separate from data operations.
Reuse existing models and repositories where appropriate.
Keep Firebase operations organized in the data layer.
Avoid duplicating incident models.
Keep UI state predictable and easy to understand.
Use meaningful function and variable names.
Avoid hardcoding secrets or API credentials.

Before submitting Android changes:

1. Build the application.
2. Test the affected screen.
3. Verify navigation.
4. Verify Firebase synchronization if applicable.
5. Check for crashes or runtime errors.
💻 Web Dashboard Contributions

The administrative web dashboard is built using:

React
TypeScript
Vite
Tailwind CSS
Firebase Web SDK

The web source is located under:

web/

The project follows a structured organization:

components/   # Reusable UI components
context/      # Global application state
hooks/        # Reusable React logic
pages/        # Route-level screens
routes/       # Application routes
services/     # Firebase and business services
types/        # Shared TypeScript models
utils/        # Utility functions
Web Development Guidelines

When contributing to the web application:

Use TypeScript types instead of unnecessary any.
Keep components focused on a clear responsibility.
Reuse shared components where possible.
Keep Firebase logic inside the service layer.
Keep reusable logic inside hooks.
Keep shared application state inside the appropriate context.
Maintain consistency with the existing UI.
Avoid unnecessary duplication.

Before submitting changes:

cd web
npm install
npm run build

If the relevant scripts are configured, also run:

npm run lint
npm run test:rules
🔥 Firebase Contribution Guidelines

Firebase is shared across the Android and web applications.

Changes affecting Firebase must be considered from both client perspectives.

Key shared services include:

Firebase Authentication
Cloud Firestore
Firebase Storage
Security Rules
Firestore Changes

Before changing Firestore data structures:

Check the existing schema.
Review all affected Android models.
Review all affected web TypeScript types.
Maintain compatibility between clients.
Update documentation when required.

Relevant documentation:

docs/firebase-schema.md
docs/api-contract.md
docs/android-web-integration.md
🔒 Security and Secrets Policy

Never commit sensitive information to Git.

Do not commit:

.env files
API secrets
Private API keys
Service account JSON files
Private keys
Tokens
Credentials

Use:

.env.example

to provide environment variable templates.

Do not place production credentials inside source code.

Security Rules

Any modification to Firestore or Storage access should be reviewed carefully.

Relevant files include:

docs/firestore.rules
docs/storage.rules

Where applicable, test Firestore security rules using:

cd web
npm run test:rules

Security changes should not be merged without verifying that unauthorized access is prevented.

🤖 AI Intelligence Contributions

The AI intelligence layer is responsible for structured incident analysis.

AI-related changes should preserve the expected output format:

{
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "priorityScore": 1,
  "summary": "Short incident summary",
  "suggestedAction": "Recommended action",
  "requiresImmediateResponse": false
}

When modifying AI functionality:

Maintain structured output compatibility.
Handle malformed responses safely.
Preserve fallback behavior.
Avoid exposing private service credentials.
Verify that Android and web consumers remain compatible.
📚 Documentation Contributions

Documentation is an important part of the project.

Update documentation when changes affect:

Architecture
Setup process
Firebase schema
Shared data contracts
Security rules
Android-web integration
Independent modules

The documentation directory is:

docs/

Keep documentation:

Clear
Accurate
Consistent with the implementation
Updated when major architectural changes occur
🧪 Testing Expectations

Before opening a Pull Request, test the affected area.

Examples:

Android
Application builds successfully.
Affected screens work correctly.
Navigation works correctly.
Firebase operations complete successfully.
Web
Application starts successfully.
Production build succeeds.
Affected pages work correctly.
Real-time updates behave correctly.
Firebase
Authentication permissions are correct.
Firestore access is properly restricted.
Storage access is properly restricted.
Shared data remains compatible.
⚠️ Changes Requiring Extra Care

The following changes can affect multiple parts of the platform and should be reviewed carefully:

Firestore schema changes
User role changes
Incident lifecycle changes
Authentication changes
Security rule changes
AI response structure changes
Shared TypeScript/Kotlin model changes

Before making such changes, check all dependent components.

📖 Code Review Checklist

Before merging, review the Pull Request for:

 Clear and meaningful commit messages
 No secrets committed
 No unnecessary generated files
 Code follows the existing project structure
 Android build works
 Web build works
 Affected functionality was tested
 Firebase compatibility is maintained
 Documentation is updated when necessary
 Shared data models remain compatible
 Security changes were reviewed
🤝 Code of Collaboration

Contributors should:

Communicate clearly about major changes.
Avoid modifying unrelated files.
Review changes before merging.
Respect the existing project architecture.
Keep commits focused.
Prefer small, understandable Pull Requests.
Document important architectural decisions.
Help maintain a clean and understandable codebase.
⭐ Final Principle

Every contribution should aim to make CampusResQ:

More reliable
More secure
Easier to maintain
Easier to understand
Better for real-time emergency coordination

Thank you for contributing to CampusResQ! 🚨
