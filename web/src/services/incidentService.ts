import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';
import { Incident, IncidentFilters, IncidentStats } from '../types/incident';
import { INITIAL_INCIDENTS } from './mockData';
import { getEffectiveSeverity, parseAiAnalysis } from '../utils/aiAnalysis';

let localIncidents: Incident[] = [...INITIAL_INCIDENTS];
const incidentListeners: Set<(incidents: Incident[]) => void> = new Set();

function parseTimestampField(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  if (typeof val === 'string') {
    const num = Number(val);
    if (!isNaN(num) && val.length >= 12 && !val.includes('-')) {
      const d = new Date(num);
      return isNaN(d.getTime()) ? val : d.toISOString();
    }
    return val;
  }
  if (val && typeof val.toDate === 'function') {
    const d = val.toDate();
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  if (val && typeof val.seconds === 'number') {
    const d = new Date(val.seconds * 1000);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  return new Date().toISOString();
}

function parseOptionalTimestamp(val: any): string | undefined {
  if (!val) return undefined;
  return parseTimestampField(val);
}

export function calculateIncidentStats(incidents: Incident[]): IncidentStats {
  let pending = 0;
  let active = 0;
  let resolved = 0;
  let criticalHigh = 0;

  incidents.forEach((inc) => {
    const status = (inc.status || 'pending').toLowerCase();
    if (status === 'pending' || status === 'reported') {
      pending++;
    } else if (status === 'accepted' || status === 'in_progress') {
      active++;
    } else if (status === 'resolved') {
      resolved++;
    }

    const effSev = getEffectiveSeverity(inc);
    if (effSev === 'CRITICAL' || effSev === 'HIGH') {
      criticalHigh++;
    }
  });

  return {
    total: incidents.length,
    pending,
    active,
    resolved,
    criticalHigh,
  };
}

export function subscribeToIncidents(
  callback: (incidents: Incident[], loading: boolean, error: Error | null) => void,
  filters?: IncidentFilters
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'incidents');
      const q = query(colRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: Incident[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const isAnon = Boolean(data.isAnonymous);
            return {
              id: docSnap.id,
              title: data.title || 'Untitled Incident',
              description: data.description || '',
              category: data.category || 'other',
              severity: data.severity,
              adminSeverity: data.adminSeverity || null,
              adminSeverityChangedBy: data.adminSeverityChangedBy || null,
              adminSeverityChangedAt: parseOptionalTimestamp(data.adminSeverityChangedAt),
              status: data.status || 'pending',
              location: data.location || 'Main Campus',
              reporterId: data.reporterId || '',
              reporterName: isAnon ? 'Anonymous Reporter' : (data.reporterName || 'Student Reporter'),
              reporterEmail: isAnon ? undefined : data.reporterEmail,
              reporterPhone: isAnon ? undefined : data.reporterPhone,
              isAnonymous: isAnon,
              aiAnalysisStatus: data.aiAnalysisStatus,
              aiAnalysis: data.aiAnalysis,
              assignedTo: data.assignedTo || null,
              assignedToName: data.assignedToName || null,
              assignedToEmail: data.assignedToEmail || null,
              assignedToPhone: data.assignedToPhone || null,
              resolutionNotes: data.resolutionNotes,
              images: data.images || [],
              createdAt: parseTimestampField(data.createdAt),
              assignedAt: parseOptionalTimestamp(data.assignedAt),
              inProgressAt: parseOptionalTimestamp(data.inProgressAt),
              resolvedAt: parseOptionalTimestamp(data.resolvedAt),
              updatedAt: parseOptionalTimestamp(data.updatedAt) || new Date().toISOString(),
            };
          });

          const filtered = applyFilters(items, filters);
          callback(filtered, false, null);
        },
        (err) => {
          console.error('Firestore incidents subscription error:', err);
          callback([], false, err);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Failed to setup Firestore listener:', err);
      callback(applyFilters(localIncidents, filters), false, null);
    }
  }

  const handler = (list: Incident[]) => {
    callback(applyFilters(list, filters), false, null);
  };
  incidentListeners.add(handler);
  setTimeout(() => handler(localIncidents), 50);

  return () => {
    incidentListeners.delete(handler);
  };
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'incidents', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        const isAnon = Boolean(data.isAnonymous);
        return {
          id: snap.id,
          title: data.title || 'Untitled Incident',
          description: data.description || '',
          category: data.category || 'other',
          severity: data.severity,
          adminSeverity: data.adminSeverity || null,
          adminSeverityChangedBy: data.adminSeverityChangedBy || null,
          adminSeverityChangedAt: parseOptionalTimestamp(data.adminSeverityChangedAt),
          status: data.status || 'pending',
          location: data.location || 'Main Campus',
          reporterId: data.reporterId || '',
          reporterName: isAnon ? 'Anonymous Reporter' : (data.reporterName || 'Student Reporter'),
          reporterEmail: isAnon ? undefined : data.reporterEmail,
          reporterPhone: isAnon ? undefined : data.reporterPhone,
          isAnonymous: isAnon,
          aiAnalysisStatus: data.aiAnalysisStatus,
          aiAnalysis: data.aiAnalysis,
          assignedTo: data.assignedTo || null,
          assignedToName: data.assignedToName || null,
          assignedToEmail: data.assignedToEmail || null,
          assignedToPhone: data.assignedToPhone || null,
          resolutionNotes: data.resolutionNotes,
          images: data.images || [],
          createdAt: parseTimestampField(data.createdAt),
          assignedAt: parseOptionalTimestamp(data.assignedAt),
          inProgressAt: parseOptionalTimestamp(data.inProgressAt),
          resolvedAt: parseOptionalTimestamp(data.resolvedAt),
          updatedAt: parseOptionalTimestamp(data.updatedAt) || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error('Error fetching incident:', err);
    }
  }

  const found = localIncidents.find((inc) => inc.id === id);
  return found || null;
}

/**
 * Admin Severity Override:
 * - Allowed ONLY when status is 'pending', 'accepted', or 'in_progress'.
 * - FORBIDDEN when status is 'resolved' (Strict permanent lock).
 * - Leaves original aiAnalysis untouched.
 */
export async function updateIncidentAdminSeverity(
  incidentId: string,
  newSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  adminId?: string,
  adminName?: string
): Promise<void> {
  const target = await getIncidentById(incidentId);
  if (!target) throw new Error('Incident not found');

  const currentStatus = (target.status || 'pending').toLowerCase();
  if (currentStatus === 'resolved') {
    throw new Error('Threat level cannot be changed after an incident is resolved.');
  }

  const normalizedSeverity = newSeverity.toUpperCase().trim() as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'incidents', incidentId);
    await updateDoc(docRef, {
      adminSeverity: normalizedSeverity,
      severity: normalizedSeverity.toLowerCase(),
      adminSeverityChangedBy: adminName || adminId || 'Administrator',
      adminSeverityChangedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  localIncidents = localIncidents.map((inc) =>
    inc.id === incidentId
      ? {
          ...inc,
          adminSeverity: normalizedSeverity,
          severity: normalizedSeverity.toLowerCase() as any,
          adminSeverityChangedBy: adminName || adminId || 'Administrator',
          adminSeverityChangedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : inc
  );
  notifyListeners();
}

/**
 * Assign an approved responder to an incident:
 * Stamped in Firestore with:
 * - assignedTo: <RESPONDER FIREBASE AUTH UID>
 * - assignedToName: <RESPONDER NAME>
 * - status: 'accepted'
 */
export async function assignMentorToIncident(
  incidentId: string,
  responderIdOrObj: any,
  responderName?: string,
  responderEmail?: string,
  _adminId?: string,
  _adminName?: string
): Promise<void> {
  const rId = typeof responderIdOrObj === 'object' ? responderIdOrObj.id : responderIdOrObj;
  const rName = typeof responderIdOrObj === 'object' ? responderIdOrObj.name : responderName;
  const rEmail = typeof responderIdOrObj === 'object' ? responderIdOrObj.email : responderEmail;

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'incidents', incidentId);
    await updateDoc(docRef, {
      assignedTo: rId,
      assignedToName: rName,
      assignedToEmail: rEmail,
      status: 'accepted',
      assignedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return;
  }

  localIncidents = localIncidents.map((inc) =>
    inc.id === incidentId
      ? {
          ...inc,
          assignedTo: rId,
          assignedToName: rName,
          assignedToEmail: rEmail,
          status: 'accepted',
          assignedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : inc
  );
  notifyListeners();
}

export async function updateIncidentStatus(
  incidentId: string,
  status: any,
  _actorIdOrNotes?: string,
  _actorName?: string,
  notes?: string
): Promise<void> {
  const target = await getIncidentById(incidentId);
  if (!target) throw new Error('Incident not found');

  const resolutionNotes = typeof _actorIdOrNotes === 'string' && !notes && (status === 'resolved') ? _actorIdOrNotes : notes;

  const updates: any = {
    status,
    updatedAt: new Date().toISOString(),
  };

  if (resolutionNotes) {
    updates.resolutionNotes = resolutionNotes;
  }

  if (status === 'resolved') {
    updates.resolvedAt = new Date().toISOString();
  } else if (status === 'in_progress' && !target.inProgressAt) {
    updates.inProgressAt = new Date().toISOString();
  }

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'incidents', incidentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      ...(status === 'resolved' ? { resolvedAt: serverTimestamp() } : {}),
      ...(status === 'in_progress' && !target.inProgressAt ? { inProgressAt: serverTimestamp() } : {}),
    });
    return;
  }

  localIncidents = localIncidents.map((inc) =>
    inc.id === incidentId ? { ...inc, ...updates } : inc
  );
  notifyListeners();
}

export async function updateIncidentSeverity(
  incidentId: string,
  severity: any
): Promise<void> {
  return updateIncidentAdminSeverity(incidentId, severity.toUpperCase());
}

function notifyListeners() {
  incidentListeners.forEach((fn) => fn([...localIncidents]));
}

function applyFilters(incidents: Incident[], filters?: IncidentFilters): Incident[] {
  if (!filters) return incidents;

  let result = incidents.filter((inc) => {
    // Status filter
    if (filters.status && filters.status !== 'all') {
      const s = (inc.status || 'pending').toLowerCase();
      const target = filters.status.toLowerCase();
      if (target === 'pending') {
        if (s !== 'pending' && s !== 'reported') return false;
      } else if (target === 'in_progress') {
        if (s !== 'in_progress') return false;
      } else if (target === 'accepted') {
        if (s !== 'accepted') return false;
      } else if (target === 'resolved') {
        if (s !== 'resolved') return false;
      }
    }

    // AI / Effective Severity filter
    if (filters.aiSeverity && filters.aiSeverity !== 'all') {
      const effSev = getEffectiveSeverity(inc);
      if (effSev !== filters.aiSeverity) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if ((inc.category || '').toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = (inc.title || '').toLowerCase().includes(q);
      const matchDesc = (inc.description || '').toLowerCase().includes(q);
      const matchCategory = (inc.category || '').toLowerCase().includes(q);
      const locStr = typeof inc.location === 'string' ? inc.location : (inc.location?.address || inc.location?.building || '');
      const matchLoc = locStr.toLowerCase().includes(q);
      const matchId = (inc.id || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCategory && !matchLoc && !matchId) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  if (filters.sortBy === 'priority') {
    const scoreMap = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    result = [...result].sort((a, b) => {
      const aParsed = parseAiAnalysis(a.aiAnalysis);
      const bParsed = parseAiAnalysis(b.aiAnalysis);
      const aScore = aParsed?.priorityScore ?? (scoreMap[getEffectiveSeverity(a)] * 2);
      const bScore = bParsed?.priorityScore ?? (scoreMap[getEffectiveSeverity(b)] * 2);
      if (bScore !== aScore) {
        return bScore - aScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } else {
    // Default newest
    result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}
