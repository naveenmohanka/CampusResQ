import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';
import { ActivityLog, ActivityFilters } from '../types/activity';
import { INITIAL_ACTIVITY_LOGS } from './mockData';

let localActivityLogs: ActivityLog[] = [...INITIAL_ACTIVITY_LOGS];
const activityListeners: Set<(logs: ActivityLog[]) => void> = new Set();

function notifyActivityListeners() {
  const list = [...localActivityLogs];
  activityListeners.forEach((cb) => cb(list));
}

export function subscribeToActivityLogs(
  callback: (logs: ActivityLog[], loading: boolean, error: Error | null) => void,
  filters?: ActivityFilters
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'activityLogs');
      const q = query(colRef, orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: ActivityLog[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              incidentId: data.incidentId,
              action: data.action || 'SYSTEM_ALERT',
              performedBy: data.performedBy || 'system',
              performedByName: data.performedByName || 'System',
              performedByRole: data.performedByRole || 'system',
              details: data.details || '',
              timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : (data.timestamp || new Date().toISOString()),
              metadata: data.metadata,
            };
          });

          const filtered = applyActivityFilters(items, filters);
          callback(filtered, false, null);
        },
        (err) => {
          console.error('Firestore activityLogs subscription error:', err);
          callback([], false, err);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Failed to setup Firestore activityLogs listener:', err);
      callback(applyActivityFilters(localActivityLogs, filters), false, null);
    }
  }

  // Fallback demo mode listener
  const handler = (list: ActivityLog[]) => {
    callback(applyActivityFilters(list, filters), false, null);
  };
  activityListeners.add(handler);
  setTimeout(() => handler(localActivityLogs), 50);

  return () => {
    activityListeners.delete(handler);
  };
}

export async function logActivity(log: Omit<ActivityLog, 'id'>): Promise<void> {
  const nowISO = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'activityLogs');
      await addDoc(colRef, {
        incidentId: log.incidentId || null,
        action: log.action,
        performedBy: log.performedBy,
        performedByName: log.performedByName,
        performedByRole: log.performedByRole,
        details: log.details,
        timestamp: serverTimestamp(),
        metadata: log.metadata || {},
      });
      return;
    } catch (err) {
      console.error('Error logging to Firestore:', err);
    }
  }

  // Local fallback
  const newLog: ActivityLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    ...log,
    timestamp: log.timestamp || nowISO,
  };
  localActivityLogs = [newLog, ...localActivityLogs];
  notifyActivityListeners();
}

function applyActivityFilters(logs: ActivityLog[], filters?: ActivityFilters): ActivityLog[] {
  if (!filters) return logs;

  return logs.filter((l) => {
    if (filters.action && filters.action !== 'all' && l.action !== filters.action) {
      return false;
    }
    if (filters.incidentId && l.incidentId !== filters.incidentId) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchDetails = l.details.toLowerCase().includes(q);
      const matchName = l.performedByName.toLowerCase().includes(q);
      const matchAction = l.action.toLowerCase().includes(q);
      const matchInc = (l.incidentId || '').toLowerCase().includes(q);
      if (!matchDetails && !matchName && !matchAction && !matchInc) return false;
    }
    return true;
  });
}
