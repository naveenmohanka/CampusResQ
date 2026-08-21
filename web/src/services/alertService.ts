import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';
import { CampusAlert, AlertSeverity, AlertCategory } from '../types/alert';
import { INITIAL_ALERTS } from './mockData';
import { logActivity } from './activityService';

let localAlerts: CampusAlert[] = [...INITIAL_ALERTS];
const alertListeners: Set<(alerts: CampusAlert[]) => void> = new Set();

function notifyAlertListeners() {
  const list = [...localAlerts];
  alertListeners.forEach((cb) => cb(list));
}

export function subscribeToActiveAlerts(
  callback: (alerts: CampusAlert[], loading: boolean, error: Error | null) => void,
  activeOnly: boolean = false
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'alerts');
      const q = activeOnly
        ? query(colRef, where('active', '==', true), orderBy('createdAt', 'desc'))
        : query(colRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: CampusAlert[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || 'Campus Advisory',
              message: data.message || '',
              severity: data.severity || 'advisory',
              category: data.category || 'general',
              targetArea: data.targetArea || 'All Campus',
              radiusMeters: data.radiusMeters,
              active: data.active !== undefined ? data.active : true,
              createdBy: data.createdBy || '',
              createdByName: data.createdByName || 'Campus Authority',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
              expiresAt: data.expiresAt?.toDate ? data.expiresAt.toDate().toISOString() : data.expiresAt,
              acknowledgedCount: data.acknowledgedCount || 0,
            };
          });
          callback(items, false, null);
        },
        (err) => {
          console.error('Firestore alerts subscription error:', err);
          callback([], false, err);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Failed to setup alerts listener:', err);
      const filtered = activeOnly ? localAlerts.filter(a => a.active) : localAlerts;
      callback(filtered, false, null);
    }
  }

  const handler = (list: CampusAlert[]) => {
    const filtered = activeOnly ? list.filter(a => a.active) : list;
    callback(filtered, false, null);
  };
  alertListeners.add(handler);
  setTimeout(() => handler(localAlerts), 50);

  return () => {
    alertListeners.delete(handler);
  };
}

export async function createCampusAlert(
  title: string,
  message: string,
  severity: AlertSeverity,
  category: AlertCategory,
  targetArea: string,
  createdBy: string,
  createdByName: string,
  expiresHours: number = 4
): Promise<string> {
  const nowISO = new Date().toISOString();
  const expiresAtISO = new Date(Date.now() + expiresHours * 3600000).toISOString();

  if (isFirebaseConfigured && db) {
    const colRef = collection(db, 'alerts');
    const docRef = await addDoc(colRef, {
      title,
      message,
      severity,
      category,
      targetArea,
      active: true,
      createdBy,
      createdByName,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + expiresHours * 3600000),
      acknowledgedCount: 0,
    });

    await logActivity({
      action: 'SYSTEM_ALERT',
      performedBy: createdBy,
      performedByName: createdByName,
      performedByRole: 'admin',
      details: `Broadcasted ${severity.toUpperCase()} campus alert: "${title}" targeting ${targetArea}`,
      timestamp: nowISO,
    });

    return docRef.id;
  }

  const newId = `alert-${Date.now()}`;
  const newAlert: CampusAlert = {
    id: newId,
    title,
    message,
    severity,
    category,
    targetArea,
    active: true,
    createdBy,
    createdByName,
    createdAt: nowISO,
    expiresAt: expiresAtISO,
    acknowledgedCount: 0,
  };

  localAlerts = [newAlert, ...localAlerts];
  notifyAlertListeners();

  await logActivity({
    action: 'SYSTEM_ALERT',
    performedBy: createdBy,
    performedByName: createdByName,
    performedByRole: 'admin',
    details: `Broadcasted ${severity.toUpperCase()} campus alert: "${title}" targeting ${targetArea}`,
    timestamp: nowISO,
  });

  return newId;
}

export async function deactivateCampusAlert(
  alertId: string,
  performedBy: string,
  performedByName: string
): Promise<void> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'alerts', alertId);
    await updateDoc(docRef, { active: false });
  } else {
    localAlerts = localAlerts.map(a => a.id === alertId ? { ...a, active: false } : a);
    notifyAlertListeners();
  }

  await logActivity({
    action: 'SYSTEM_ALERT',
    performedBy,
    performedByName,
    performedByRole: 'admin',
    details: `Deactivated broadcast alert ID ${alertId}`,
    timestamp: new Date().toISOString(),
  });
}

export async function deleteCampusAlert(alertId: string): Promise<void> {
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'alerts', alertId);
    await deleteDoc(docRef);
  } else {
    localAlerts = localAlerts.filter(a => a.id !== alertId);
    notifyAlertListeners();
  }
}
