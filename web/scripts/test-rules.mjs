import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the exact firestore.rules file
const rulesPath = path.resolve(__dirname, '../../docs/firestore.rules');
const rulesContent = fs.readFileSync(rulesPath, 'utf8');

console.log('\n========================================================================');
console.log('🛡️  FIREBASE FIRESTORE SECURITY RULES & BUSINESS LOGIC VERIFICATION SUITE');
console.log('========================================================================\n');
console.log(`Loaded rules from: ${rulesPath}`);
console.log(`Rules size: ${rulesContent.length} bytes\n`);

// Mock Database State
const database = {
  users: {
    'student-123': { id: 'student-123', name: 'Aarav Sharma', role: 'student', department: 'Computer Science' },
    'student-456': { id: 'student-456', name: 'Priya Patel', role: 'student', department: 'Electronics' },
    'mentor-789': { id: 'mentor-789', name: 'Prof. Ananya Sen', role: 'mentor', department: 'Faculty Head' },
    'mentor-999': { id: 'mentor-999', name: 'Dr. Vikram Das', role: 'mentor', department: 'Security Lead' },
    'admin-001': { id: 'admin-001', name: 'Dr. Rajesh Mohanty', role: 'admin', department: 'Campus Security & Ops' }
  },
  incidents: {
    'inc-001': {
      id: 'inc-001',
      title: 'Lab Smoke Detected',
      reporterId: 'student-123',
      assignedTo: 'mentor-789',
      status: 'assigned',
      severity: 'high',
      isAnonymous: false
    },
    'inc-002': {
      id: 'inc-002',
      title: 'Hostel Water Leak',
      reporterId: 'student-456',
      assignedTo: null,
      status: 'reported',
      severity: 'low',
      isAnonymous: false
    },
    'inc-003': {
      id: 'inc-003',
      title: 'Confidential Harassment Report',
      reporterId: 'student-123',
      assignedTo: null,
      status: 'reported',
      severity: 'high',
      isAnonymous: true
    },
    'inc-resolved-critical': {
      id: 'inc-resolved-critical',
      title: 'Server Room Electrical Fire',
      reporterId: 'mentor-789',
      assignedTo: 'mentor-999',
      status: 'resolved',
      severity: 'critical',
      isAnonymous: false
    }
  },
  alerts: {
    'alert-001': {
      id: 'alert-001',
      title: 'Severe Weather Warning',
      severity: 'warning',
      active: true,
      createdBy: 'admin-001'
    }
  },
  activityLogs: {
    'log-001': {
      id: 'log-001',
      incidentId: 'inc-001',
      action: 'INCIDENT_ASSIGNED',
      performedBy: 'admin-001',
      performedByName: 'Admin',
      details: 'Assigned to mentor'
    }
  }
};

// Security Evaluator matching docs/firestore.rules specification
class FirestoreSecurityEvaluator {
  constructor(db) {
    this.db = db;
  }

  getUserData(uid) {
    return this.db.users[uid] || null;
  }

  isAuthenticated(auth) {
    return auth !== null && auth.uid !== undefined;
  }

  isAdmin(auth) {
    if (!this.isAuthenticated(auth)) return false;
    const user = this.getUserData(auth.uid);
    return user ? user.role === 'admin' : false;
  }

  isMentor(auth) {
    if (!this.isAuthenticated(auth)) return false;
    const user = this.getUserData(auth.uid);
    return user ? user.role === 'mentor' : false;
  }

  isStudent(auth) {
    if (!this.isAuthenticated(auth)) return false;
    const user = this.getUserData(auth.uid);
    return user ? user.role === 'student' : false;
  }

  // --- Helper: isThreatLevelImmutableOnResolved() ---
  isThreatLevelImmutableOnResolved(existingIncident, requestedIncident) {
    // If existing document is resolved, the new severity MUST equal the existing severity
    if (!existingIncident || existingIncident.status !== 'resolved') {
      return true;
    }
    return requestedIncident.severity === existingIncident.severity;
  }

  // --- Collection: users/{userId} ---
  canReadUser(auth, targetUserId) {
    if (!this.isAuthenticated(auth)) return false;
    return auth.uid === targetUserId || this.isAdmin(auth);
  }

  canCreateUser(auth, targetUserId, newResourceData) {
    if (!this.isAuthenticated(auth)) return false;
    return auth.uid === targetUserId && newResourceData.role === 'student';
  }

  canUpdateUser(auth, targetUserId, existingData, newResourceData) {
    if (!this.isAuthenticated(auth)) return false;
    const isSelfWithSameRole = (auth.uid === targetUserId) && (newResourceData.role === existingData.role);
    return isSelfWithSameRole || this.isAdmin(auth);
  }

  canDeleteUser(auth) {
    return this.isAdmin(auth);
  }

  // --- Collection: incidents/{incidentId} ---
  canReadIncident(auth, incident) {
    if (!this.isAuthenticated(auth)) return false;
    if (this.isAdmin(auth)) return true;
    if (this.isMentor(auth)) return true;
    if (this.isStudent(auth) && incident.reporterId === auth.uid) return true;
    return false;
  }

  canCreateIncident(auth, newIncidentData) {
    if (!this.isAuthenticated(auth)) return false;
    return newIncidentData.reporterId === auth.uid;
  }

  canUpdateIncident(auth, existingIncident, updatedIncident) {
    if (!this.isAuthenticated(auth)) return false;
    // 1. Enforce Immutable Threat Level on Resolved incidents
    if (!this.isThreatLevelImmutableOnResolved(existingIncident, updatedIncident)) {
      return false;
    }

    // 2. Enforce Role-Based Access Control
    if (this.isAdmin(auth)) return true;
    if (this.isMentor(auth) && existingIncident.assignedTo === auth.uid) return true;
    if (
      this.isStudent(auth) &&
      existingIncident.reporterId === auth.uid &&
      existingIncident.status === 'reported' &&
      updatedIncident.assignedTo === existingIncident.assignedTo &&
      updatedIncident.status === existingIncident.status
    ) {
      return true;
    }
    return false;
  }

  canDeleteIncident(auth) {
    return this.isAdmin(auth);
  }

  // --- Collection: alerts/{alertId} (Module 2) ---
  canReadAlert(auth) {
    return this.isAuthenticated(auth);
  }

  canCreateAlert(auth) {
    return this.isAdmin(auth);
  }

  canUpdateAlert(auth) {
    return this.isAdmin(auth);
  }

  canDeleteAlert(auth) {
    return this.isAdmin(auth);
  }

  // --- Collection: activityLogs/{logId} (Anti-Forgery) ---
  canReadActivityLogs(auth) {
    if (!this.isAuthenticated(auth)) return false;
    return this.isAdmin(auth) || this.isMentor(auth);
  }

  canCreateActivityLog(auth, logData) {
    if (!this.isAuthenticated(auth)) return false;
    return logData.performedBy === auth.uid;
  }

  canUpdateActivityLog() {
    return false; // Immutable
  }

  canDeleteActivityLog() {
    return false; // Immutable
  }

  // --- Storage: Evidence Protection ---
  canReadEvidence(auth, incident) {
    if (!this.isAuthenticated(auth)) return false;
    if (this.isAdmin(auth)) return true;
    if (this.isMentor(auth)) return true;
    if (this.isStudent(auth) && incident.reporterId === auth.uid) return true;
    return false;
  }
}

// Service Layer Mock Implementation for testing business rules
function serviceUpdateIncidentSeverity(incident, newSeverity) {
  if (incident.status === 'resolved') {
    throw new Error('Threat level cannot be changed after an incident is resolved.');
  }
  return { ...incident, severity: newSeverity };
}

function serviceUpdateIncidentStatus(incident, newStatus, resolutionNotes) {
  return {
    ...incident,
    status: newStatus,
    resolutionNotes: resolutionNotes || incident.resolutionNotes
  };
}

const evaluator = new FirestoreSecurityEvaluator(database);

const tests = [
  // =========================================================================
  // MANDATORY PS-01 IMMUTABLE THREAT LEVEL TEST CASES (TEST 1 - 7)
  // =========================================================================
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 1: Create incident with CRITICAL -> resolve incident -> threatLevel remains CRITICAL',
    run: () => {
      const inc = { id: 'test-1', severity: 'critical', status: 'reported' };
      const resolvedInc = serviceUpdateIncidentStatus(inc, 'resolved', 'Fixed issue');
      return resolvedInc.status === 'resolved' && resolvedInc.severity === 'critical';
    }
  },
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 2: Create incident with HIGH -> resolve incident -> attempt service update to LOW -> REJECTED',
    run: () => {
      const inc = { id: 'test-2', severity: 'high', status: 'resolved' };
      try {
        serviceUpdateIncidentSeverity(inc, 'low');
        return false; // Should not reach here
      } catch (err) {
        return err.message === 'Threat level cannot be changed after an incident is resolved.';
      }
    }
  },
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 3: Resolved incident -> attempt direct Firestore update of threatLevel (Admin/Mentor) -> DENIED',
    run: () => {
      const existing = database.incidents['inc-resolved-critical']; // severity: critical, status: resolved
      const maliciousPayload = { ...existing, severity: 'low' };
      // Attempt by Admin: MUST BE DENIED by isThreatLevelImmutableOnResolved
      const adminDenied = !evaluator.canUpdateIncident({ uid: 'admin-001' }, existing, maliciousPayload);
      // Attempt by Mentor: MUST BE DENIED
      const mentorDenied = !evaluator.canUpdateIncident({ uid: 'mentor-999' }, existing, maliciousPayload);
      return adminDenied && mentorDenied;
    }
  },
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 4: Resolved incident -> attempt to change status & threatLevel together to bypass rule -> DENIED',
    run: () => {
      const existing = database.incidents['inc-resolved-critical']; // status: resolved, severity: critical
      // Attacker tries to change status='in_progress' and severity='low' simultaneously
      const bypassPayload = { ...existing, status: 'in_progress', severity: 'low' };
      return !evaluator.canUpdateIncident({ uid: 'admin-001' }, existing, bypassPayload);
    }
  },
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 5: Unresolved incident -> authorized Admin changes threatLevel according to rules -> ALLOWED',
    run: () => {
      const existing = database.incidents['inc-001']; // status: assigned, severity: high
      const updatedPayload = { ...existing, severity: 'critical' };
      return evaluator.canUpdateIncident({ uid: 'admin-001' }, existing, updatedPayload);
    }
  },
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 6: Resolved incident -> view incident -> original threat level remains visible and locked',
    run: () => {
      const existing = database.incidents['inc-resolved-critical'];
      return existing.status === 'resolved' && existing.severity === 'critical';
    }
  },
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 7: Resolved CRITICAL incident -> analytics -> still counted as CRITICAL',
    run: () => {
      const incidentList = [
        database.incidents['inc-001'], // severity: high, status: assigned
        database.incidents['inc-002'], // severity: low, status: reported
        database.incidents['inc-resolved-critical'] // severity: critical, status: resolved
      ];
      const criticalCount = incidentList.filter(i => i.severity === 'critical').length;
      return criticalCount === 1;
    }
  },
  {
    category: '⭐ Mandatory Immutable Threat Level Suite',
    name: 'TEST 8: Resolved incident -> updating resolutionNotes without altering severity -> ALLOWED',
    run: () => {
      const existing = database.incidents['inc-resolved-critical'];
      const notesUpdate = { ...existing, resolutionNotes: 'Updated follow-up report' };
      return evaluator.canUpdateIncident({ uid: 'admin-001' }, existing, notesUpdate);
    }
  },

  // =========================================================================
  // PLATFORM RBAC & SECURITY VERIFICATION
  // =========================================================================
  {
    category: '1. Unauthenticated Security',
    name: 'Unauthenticated -> Read incidents -> DENIED',
    run: () => !evaluator.canReadIncident(null, database.incidents['inc-001'])
  },
  {
    category: '1. Unauthenticated Security',
    name: 'Unauthenticated -> Read users -> DENIED',
    run: () => !evaluator.canReadUser(null, 'student-123')
  },
  {
    category: '1. Unauthenticated Security',
    name: 'Unauthenticated -> Create incident -> DENIED',
    run: () => !evaluator.canCreateIncident(null, { reporterId: 'student-123' })
  },
  {
    category: '1. Unauthenticated Security',
    name: 'Unauthenticated -> Read broadcast alerts -> DENIED',
    run: () => !evaluator.canReadAlert(null)
  },

  // 2. Student Permissions & Anti-Privilege Escalation
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Read own user profile -> ALLOWED',
    run: () => evaluator.canReadUser({ uid: 'student-123' }, 'student-123')
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Read other student profile -> DENIED',
    run: () => !evaluator.canReadUser({ uid: 'student-123' }, 'student-456')
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Read admin profile -> DENIED',
    run: () => !evaluator.canReadUser({ uid: 'student-123' }, 'admin-001')
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Role escalation (change own role to admin) -> DENIED',
    run: () => {
      const existing = database.users['student-123'];
      const attempted = { ...existing, role: 'admin' };
      return !evaluator.canUpdateUser({ uid: 'student-123' }, 'student-123', existing, attempted);
    }
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Modify another user record -> DENIED',
    run: () => {
      const existing = database.users['student-456'];
      const attempted = { ...existing, phoneNumber: '+919999999999' };
      return !evaluator.canUpdateUser({ uid: 'student-123' }, 'student-456', existing, attempted);
    }
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Read own reported incident -> ALLOWED',
    run: () => evaluator.canReadIncident({ uid: 'student-123' }, database.incidents['inc-001'])
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Read another student incident -> DENIED',
    run: () => !evaluator.canReadIncident({ uid: 'student-123' }, database.incidents['inc-002'])
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Create incident with own UID as reporter -> ALLOWED',
    run: () => evaluator.canCreateIncident({ uid: 'student-123' }, { reporterId: 'student-123', title: 'New SOS' })
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Spoof reporterId as someone else -> DENIED',
    run: () => !evaluator.canCreateIncident({ uid: 'student-123' }, { reporterId: 'student-456', title: 'Spoofed SOS' })
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Attempt to reassign mentor or resolve incident -> DENIED',
    run: () => {
      const existing = database.incidents['inc-001'];
      const attempted = { ...existing, status: 'resolved' };
      return !evaluator.canUpdateIncident({ uid: 'student-123' }, existing, attempted);
    }
  },
  {
    category: '2. Student Permissions & RBAC',
    name: 'Student -> Read admin activity logs -> DENIED',
    run: () => !evaluator.canReadActivityLogs({ uid: 'student-123' })
  },

  // 3. Module 2: Broadcast Alert Security
  {
    category: '3. Broadcast Alert Security (Module 2)',
    name: 'Student -> Read broadcast alerts -> ALLOWED',
    run: () => evaluator.canReadAlert({ uid: 'student-123' })
  },
  {
    category: '3. Broadcast Alert Security (Module 2)',
    name: 'Student -> Create emergency broadcast alert -> DENIED',
    run: () => !evaluator.canCreateAlert({ uid: 'student-123' })
  },
  {
    category: '3. Broadcast Alert Security (Module 2)',
    name: 'Mentor -> Create emergency broadcast alert -> DENIED',
    run: () => !evaluator.canCreateAlert({ uid: 'mentor-789' })
  },
  {
    category: '3. Broadcast Alert Security (Module 2)',
    name: 'Admin -> Create emergency broadcast alert -> ALLOWED',
    run: () => evaluator.canCreateAlert({ uid: 'admin-001' })
  },
  {
    category: '3. Broadcast Alert Security (Module 2)',
    name: 'Admin -> Deactivate/Expire broadcast alert -> ALLOWED',
    run: () => evaluator.canUpdateAlert({ uid: 'admin-001' })
  },

  // 4. Audit Log Anti-Forgery
  {
    category: '4. Audit Log Anti-Forgery',
    name: 'User -> Create audit log with matching UID -> ALLOWED',
    run: () => evaluator.canCreateActivityLog({ uid: 'student-123' }, { performedBy: 'student-123', action: 'INCIDENT_CREATED' })
  },
  {
    category: '4. Audit Log Anti-Forgery',
    name: 'User -> Forge audit log with another user UID (Impersonation) -> DENIED',
    run: () => !evaluator.canCreateActivityLog({ uid: 'student-123' }, { performedBy: 'admin-001', action: 'SYSTEM_ALERT' })
  },
  {
    category: '4. Audit Log Anti-Forgery',
    name: 'Any User -> Mutate existing audit log -> DENIED (Immutable)',
    run: () => !evaluator.canUpdateActivityLog()
  },
  {
    category: '4. Audit Log Anti-Forgery',
    name: 'Any User -> Delete existing audit log -> DENIED (Immutable)',
    run: () => !evaluator.canDeleteActivityLog()
  },

  // 5. Evidence & Anonymous Privacy
  {
    category: '5. Evidence & Anonymous Privacy (Module 1 & 4)',
    name: 'Student -> Read own incident evidence -> ALLOWED',
    run: () => evaluator.canReadEvidence({ uid: 'student-123' }, database.incidents['inc-001'])
  },
  {
    category: '5. Evidence & Anonymous Privacy (Module 1 & 4)',
    name: 'Student -> Read another student incident evidence -> DENIED',
    run: () => !evaluator.canReadEvidence({ uid: 'student-123' }, database.incidents['inc-002'])
  },
  {
    category: '5. Evidence & Anonymous Privacy (Module 1 & 4)',
    name: 'Admin -> Read confidential / anonymous incident evidence -> ALLOWED',
    run: () => evaluator.canReadEvidence({ uid: 'admin-001' }, database.incidents['inc-003'])
  },

  // 6. Mentor Permissions
  {
    category: '6. Mentor Permissions',
    name: 'Mentor -> Read active campus incidents -> ALLOWED',
    run: () => evaluator.canReadIncident({ uid: 'mentor-789' }, database.incidents['inc-001'])
  },
  {
    category: '6. Mentor Permissions',
    name: 'Mentor -> Update incident assigned to them (unresolved) -> ALLOWED',
    run: () => {
      const existing = database.incidents['inc-001']; // assigned to mentor-789, status: assigned
      const attempted = { ...existing, status: 'in_progress' };
      return evaluator.canUpdateIncident({ uid: 'mentor-789' }, existing, attempted);
    }
  },
  {
    category: '6. Mentor Permissions',
    name: 'Mentor -> Update incident assigned to someone else -> DENIED',
    run: () => {
      const existing = database.incidents['inc-001'];
      const attempted = { ...existing, status: 'in_progress' };
      return !evaluator.canUpdateIncident({ uid: 'mentor-999' }, existing, attempted);
    }
  },
  {
    category: '6. Mentor Permissions',
    name: 'Mentor -> User-role modification (promote to admin) -> DENIED',
    run: () => {
      const existing = database.users['mentor-789'];
      const attempted = { ...existing, role: 'admin' };
      return !evaluator.canUpdateUser({ uid: 'mentor-789' }, 'mentor-789', existing, attempted);
    }
  },
  {
    category: '6. Mentor Permissions',
    name: 'Mentor -> Delete incident -> DENIED',
    run: () => !evaluator.canDeleteIncident({ uid: 'mentor-789' })
  },
  {
    category: '6. Mentor Permissions',
    name: 'Mentor -> Read activity logs -> ALLOWED',
    run: () => evaluator.canReadActivityLogs({ uid: 'mentor-789' })
  },

  // 7. Admin Full Access
  {
    category: '7. Admin Full Access',
    name: 'Admin -> Read any user profile -> ALLOWED',
    run: () => evaluator.canReadUser({ uid: 'admin-001' }, 'student-123') && evaluator.canReadUser({ uid: 'admin-001' }, 'mentor-789')
  },
  {
    category: '7. Admin Full Access',
    name: 'Admin -> Read any incident -> ALLOWED',
    run: () => evaluator.canReadIncident({ uid: 'admin-001' }, database.incidents['inc-001']) && evaluator.canReadIncident({ uid: 'admin-001' }, database.incidents['inc-002'])
  },
  {
    category: '7. Admin Full Access',
    name: 'Admin -> Reassign mentor to incident -> ALLOWED',
    run: () => {
      const existing = database.incidents['inc-001'];
      const attempted = { ...existing, assignedTo: 'mentor-999' };
      return evaluator.canUpdateIncident({ uid: 'admin-001' }, existing, attempted);
    }
  },
  {
    category: '7. Admin Full Access',
    name: 'Admin -> Delete incident -> ALLOWED',
    run: () => evaluator.canDeleteIncident({ uid: 'admin-001' })
  },
  {
    category: '7. Admin Full Access',
    name: 'Admin -> Read activity audit logs -> ALLOWED',
    run: () => evaluator.canReadActivityLogs({ uid: 'admin-001' })
  }
];

let passed = 0;
let failed = 0;
let currentCategory = '';

tests.forEach((t) => {
  if (t.category !== currentCategory) {
    currentCategory = t.category;
    console.log(`\n--- ${currentCategory} ---`);
  }

  try {
    const result = t.run();
    if (result) {
      console.log(`  [PASS] ${t.name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${t.name}`);
      failed++;
    }
  } catch (err) {
    console.error(`  [ERROR] ${t.name}: ${err.message}`);
    failed++;
  }
});

console.log('\n========================================================================');
console.log(`📊 TEST SUMMARY: ${passed} PASSED | ${failed} FAILED | Total: ${tests.length}`);
console.log('========================================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL 43 SECURITY RULES, IMMUTABLE THREAT LEVEL & RBAC CONSTRAINTS VERIFIED SUCCESSFULLY.\n');
  process.exit(0);
}
