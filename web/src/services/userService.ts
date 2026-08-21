import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';
import { UserProfile, UserFilters } from '../types/user';
import { INITIAL_USERS } from './mockData';

let localUsers: UserProfile[] = [...INITIAL_USERS];
const userListeners: Set<(users: UserProfile[]) => void> = new Set();

export function subscribeToUsers(
  callback: (users: UserProfile[], loading: boolean, error: Error | null) => void,
  filters?: UserFilters
): () => void {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'users');
      const q = query(colRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: UserProfile[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              name: data.name || 'Anonymous User',
              email: data.email || '',
              role: data.role || 'student',
              department: data.department || '',
              phoneNumber: data.phoneNumber || '',
              status: data.status || 'active',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
            };
          });

          const filtered = applyUserFilters(items, filters);
          callback(filtered, false, null);
        },
        (err) => {
          console.error('Firestore users subscription error:', err);
          callback([], false, err);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Failed to setup Firestore users listener:', err);
      callback(applyUserFilters(localUsers, filters), false, null);
    }
  }

  const handler = (list: UserProfile[]) => {
    callback(applyUserFilters(list, filters), false, null);
  };
  userListeners.add(handler);
  setTimeout(() => handler(localUsers), 50);

  return () => {
    userListeners.delete(handler);
  };
}

export async function getMentors(): Promise<UserProfile[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'users');
      const q = query(colRef, where('role', '==', 'mentor'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || 'Mentor',
          email: data.email || '',
          role: 'mentor',
          department: data.department || '',
          phoneNumber: data.phoneNumber || '',
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
        };
      });
    } catch (err) {
      console.error('Error fetching mentors:', err);
    }
  }

  return localUsers.filter((u) => u.role === 'mentor');
}

function applyUserFilters(users: UserProfile[], filters?: UserFilters): UserProfile[] {
  if (!filters) return users;

  return users.filter((u) => {
    if (filters.role && filters.role !== 'all' && u.role !== filters.role) {
      return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchDept = (u.department || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchDept) return false;
    }
    return true;
  });
}
