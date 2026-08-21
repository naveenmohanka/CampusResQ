import {
  collection,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';
import { Incident, IncidentFilters, IncidentStatus, IncidentSeverity } from '../types/incident';
import { INITIAL_INCIDENTS } from './mockData';
import { logActivity } from './activityService';

let localIncidents: Incident[] = [...INITIAL_INCIDENTS];
const incidentListeners: Set<(incidents: Incident[]) => void> = new Set();

function notifyLocalListeners() {
  const list = [...localIncidents];
  incidentListeners.forEach(cb => cb(list));
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
              severity: data.severity || 'medium',
              status: data.status || 'reported',
              location: data.location || {
                latitude: 20.3533,
                longitude: 85.8189,
                address: 'Main Campus',
                building: 'Main Campus Building',
              },
              reporterId: data.reporterId || '',
              reporterName: isAnon ? 'Anonymous Reporter' : (data.reporterName || 'Student Reporter'),
              reporterEmail: isAnon ? undefined : data.reporterEmail,
              reporterPhone: isAnon ? undefined : data.reporterPhone,
              isAnonymous: isAnon,
              assignedTo: data.assignedTo || null,
              assignedToName: data.assignedToName || null,
              assignedToEmail: data.assignedToEmail || null,
              assignedToPhone: data.assignedToPhone || null,
              resolutionNotes: data.resolutionNotes,
              images: data.images || [],
              evidence: data.evidence || [],
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
              assignedAt: data.assignedAt?.toDate ? data.assignedAt.toDate().toISOString() : data.assignedAt,
              acknowledgedAt: data.acknowledgedAt?.toDate ? data.acknowledgedAt.toDate().toISOString() : data.acknowledgedAt,
              inProgressAt: data.inProgressAt?.toDate ? data.inProgressAt.toDate().toISOString() : data.inProgressAt,
              resolvedAt: data.resolvedAt?.toDate ? data.resolvedAt.toDate().toISOString() : data.resolvedAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString()),
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
          severity: data.severity || 'medium',
          status: data.status || 'reported',
          location: data.location || {
            latitude: 20.3533,
            longitude: 85.8189,
            address: 'Main Campus',
            building: 'Main Campus Building',
          },
          reporterId: data.reporterId || '',
          reporterName: isAnon ? 'Anonymous Reporter' : (data.reporterName || 'Student Reporter'),
          reporterEmail: isAnon ? undefined : data.reporterEmail,
          reporterPhone: isAnon ? undefined : data.reporterPhone,
          isAnonymous: isAnon,
          assignedTo: data.assignedTo || null,
          assignedToName: data.assignedToName || null,
          assignedToEmail: data.assignedToEmail || null,
          assignedToPhone: data.assignedToPhone || null,
          resolutionNotes: data.resolutionNotes,
          images: data.images || [],
          evidence: data.evidence || [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
          assignedAt: data.assignedAt?.toDate ? data.assignedAt.toDate().toISOString() : data.assignedAt,
          acknowledgedAt: data.acknowledgedAt?.toDate ? data.acknowledgedAt.toDate().toISOString() : data.acknowledgedAt,
          inProgressAt: data.inProgressAt?.toDate ? data.inProgressAt.toDate().toISOString() : data.inProgressAt,
          resolvedAt: data.resolvedAt?.toDate ? data.resolvedAt.toDate().toISOString() : data.resolvedAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || new Date().toISOString()),
        };
      }
    } catch (err) {
      console.error('Error fetching incident:', err);
    }
  }

  const found = localIncidents.find((inc) => inc.id === id);
  return found || null;
}

export async function updateIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  performedBy: string,
  performedByName: string,
  resolutionNotes?: string
): Promise<void> {
  const nowISO = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'incidents', incidentId);
    const updateData: any = {
      status: newStatus,
      updatedAt: serverTimestamp(),
    };
    if (newStatus === 'in_progress') {
      updateData.inProgressAt = serverTimestamp();
    }
    if (newStatus === 'resolved') {
      updateData.resolvedAt = serverTimestamp();
      if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;
    }
    await updateDoc(docRef, updateData);
  } else {
    localIncidents = localIncidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: newStatus,
          resolutionNotes: resolutionNotes || inc.resolutionNotes,
          inProgressAt: newStatus === 'in_progress' ? nowISO : inc.inProgressAt,
          resolvedAt: newStatus === 'resolved' ? nowISO : inc.resolvedAt,
          updatedAt: nowISO,
        };
      }
      return inc;
    });
    notifyLocalListeners();
  }

  await logActivity({
    incidentId,
    action: newStatus === 'resolved' ? 'INCIDENT_RESOLVED' : 'STATUS_CHANGED',
    performedBy,
    performedByName,
    performedByRole: 'admin',
    details: `Incident status updated to "${newStatus.replace('_', ' ').toUpperCase()}"${
      resolutionNotes ? ` with resolution note: "${resolutionNotes}"` : ''
    }`,
    timestamp: nowISO,
  });
}

export async function assignMentorToIncident(
  incidentId: string,
  mentorId: string,
  mentorName: string,
  mentorEmail: string,
  performedBy: string,
  performedByName: string
): Promise<void> {
  const nowISO = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'incidents', incidentId);
    await updateDoc(docRef, {
      assignedTo: mentorId,
      assignedToName: mentorName,
      assignedToEmail: mentorEmail,
      status: 'assigned',
      assignedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    localIncidents = localIncidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          assignedTo: mentorId,
          assignedToName: mentorName,
          assignedToEmail: mentorEmail,
          status: inc.status === 'reported' ? 'assigned' : inc.status,
          assignedAt: inc.assignedAt || nowISO,
          updatedAt: nowISO,
        };
      }
      return inc;
    });
    notifyLocalListeners();
  }

  await logActivity({
    incidentId,
    action: 'INCIDENT_ASSIGNED',
    performedBy,
    performedByName,
    performedByRole: 'admin',
    details: `Assigned incident to responder ${mentorName} (${mentorEmail})`,
    timestamp: nowISO,
  });
}

export async function updateIncidentSeverity(
  incidentId: string,
  newSeverity: IncidentSeverity,
  performedBy: string,
  performedByName: string
): Promise<void> {
  const nowISO = new Date().toISOString();

  // Business Rule: The Threat Level cannot be modified once the incident is RESOLVED
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'incidents', incidentId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.status === 'resolved') {
        throw new Error('Threat level cannot be changed after an incident is resolved.');
      }
      if (data.severity === newSeverity) {
        return; // No-op if identical
      }
    }
    await updateDoc(docRef, {
      severity: newSeverity,
      updatedAt: serverTimestamp(),
    });
  } else {
    const existing = localIncidents.find((inc) => inc.id === incidentId);
    if (existing && existing.status === 'resolved') {
      throw new Error('Threat level cannot be changed after an incident is resolved.');
    }
    localIncidents = localIncidents.map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          severity: newSeverity,
          updatedAt: nowISO,
        };
      }
      return inc;
    });
    notifyLocalListeners();
  }

  await logActivity({
    incidentId,
    action: 'SEVERITY_UPDATED',
    performedBy,
    performedByName,
    performedByRole: 'admin',
    details: `Severity escalated to "${newSeverity.toUpperCase()}"`,
    timestamp: nowISO,
  });
}

function applyFilters(incidents: Incident[], filters?: IncidentFilters): Incident[] {
  if (!filters) return incidents;

  return incidents.filter((inc) => {
    if (filters.status && filters.status !== 'all' && inc.status !== filters.status) {
      return false;
    }
    if (filters.severity && filters.severity !== 'all' && inc.severity !== filters.severity) {
      return false;
    }
    if (filters.category && filters.category !== 'all' && inc.category !== filters.category) {
      return false;
    }
    if (filters.assignedTo && filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'unassigned' && inc.assignedTo) return false;
      if (filters.assignedTo !== 'unassigned' && inc.assignedTo !== filters.assignedTo) return false;
    }
    if (filters.isAnonymous !== undefined) {
      if (Boolean(inc.isAnonymous) !== filters.isAnonymous) return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchDesc = inc.description.toLowerCase().includes(q);
      const matchLoc = inc.location.address.toLowerCase().includes(q);
      const matchBldg = (inc.location.building || '').toLowerCase().includes(q);
      const matchReporter = (inc.reporterName || '').toLowerCase().includes(q);
      const matchId = inc.id.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchBldg && !matchReporter && !matchId) {
        return false;
      }
    }
    return true;
  });
}
