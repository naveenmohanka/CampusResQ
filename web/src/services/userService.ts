import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
    orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase/config';
import { UserProfile, UserRole, UserFilters, ResponderApprovalStatus } from '../types/user';
import { INITIAL_USERS } from './mockData';
import { logActivity } from './activityService';

let localUsers: UserProfile[] = [...INITIAL_USERS];
const userListeners: Set<(users: UserProfile[]) => void> = new Set();

function normalizeRole(role?: string): UserRole {
  const lower = (role || 'reporter').toLowerCase();
  if (lower === 'admin') return 'admin';
  if (lower === 'responder' || lower === 'mentor') return 'responder';
  return 'reporter';
}

function normalizeApprovalStatus(status?: string, role?: string): ResponderApprovalStatus {
  if (status) {
    const lower = status.toLowerCase();
    if (lower === 'pending' || lower === 'approved' || lower === 'rejected' || lower === 'not_requested') {
      return lower as ResponderApprovalStatus;
    }
  }
  const normRole = normalizeRole(role);
  if (normRole === 'responder' || normRole === 'admin') {
    return 'approved';
  }
  return 'not_requested';
}

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
            const role = normalizeRole(data.role);
            return {
              id: docSnap.id,
              name: data.name || 'Anonymous User',
              email: data.email || '',
              role,
              responderApprovalStatus: normalizeApprovalStatus(data.responderApprovalStatus, data.role),
              responderRequestedAt: data.responderRequestedAt?.toDate ? data.responderRequestedAt.toDate().toISOString() : data.responderRequestedAt,
              responderApprovedAt: data.responderApprovedAt?.toDate ? data.responderApprovedAt.toDate().toISOString() : data.responderApprovedAt,
              responderApprovedBy: data.responderApprovedBy,
              responderApprovedByName: data.responderApprovedByName,
              responderRejectionReason: data.responderRejectionReason,
              department: data.department || '',
              phoneNumber: data.phoneNumber || data.phone || '',
              hostelBlock: data.hostelBlock,
              roomNumber: data.roomNumber,
              avatarUrl: data.avatarUrl,
              status: data.status || 'active',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
              lastActiveAt: data.lastActiveAt?.toDate ? data.lastActiveAt.toDate().toISOString() : data.lastActiveAt,
            };
          });

          callback(applyFilters(items, filters), false, null);
        },
        (err) => {
          console.error('Firestore users subscription error:', err);
          callback([], false, err);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Failed to setup users subscription:', err);
      callback(applyFilters(localUsers, filters), false, null);
    }
  }

  const handler = (list: UserProfile[]) => {
    callback(applyFilters(list, filters), false, null);
  };
  userListeners.add(handler);
  setTimeout(() => handler(localUsers), 50);

  return () => {
    userListeners.delete(handler);
  };
}

export async function getUsers(filters?: UserFilters): Promise<UserProfile[]> {
  if (isFirebaseConfigured && db) {
    try {
      const colRef = collection(db, 'users');
      const snap = await getDocs(colRef);
      const items: UserProfile[] = snap.docs.map((docSnap) => {
        const data = docSnap.data();
        const role = normalizeRole(data.role);
        return {
          id: docSnap.id,
          name: data.name || 'Anonymous User',
          email: data.email || '',
          role,
          responderApprovalStatus: normalizeApprovalStatus(data.responderApprovalStatus, data.role),
          responderRequestedAt: data.responderRequestedAt?.toDate ? data.responderRequestedAt.toDate().toISOString() : data.responderRequestedAt,
          responderApprovedAt: data.responderApprovedAt?.toDate ? data.responderApprovedAt.toDate().toISOString() : data.responderApprovedAt,
          responderApprovedBy: data.responderApprovedBy,
          responderApprovedByName: data.responderApprovedByName,
          responderRejectionReason: data.responderRejectionReason,
          department: data.department || '',
          phoneNumber: data.phoneNumber || data.phone || '',
          hostelBlock: data.hostelBlock,
          roomNumber: data.roomNumber,
          avatarUrl: data.avatarUrl,
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
          lastActiveAt: data.lastActiveAt?.toDate ? data.lastActiveAt.toDate().toISOString() : data.lastActiveAt,
        };
      });

      return applyFilters(items, filters);
    } catch (err) {
      console.error('Error fetching users from Firestore:', err);
    }
  }

  return applyFilters(localUsers, filters);
}

/**
 * Responders query for incident assignment:
 * Returns users whose role is 'responder' and whose responderApprovalStatus is 'approved'.
 */
export async function getResponders(): Promise<UserProfile[]> {
  const users = await getUsers({ role: 'responder' });
  return users.filter(
    (u) => (u.status || 'active') === 'active' && u.responderApprovalStatus === 'approved'
  );
}

// Alias for backward compatibility
export const getMentors = getResponders;

export async function getUserById(id: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        const role = normalizeRole(data.role);
        return {
          id: snap.id,
          name: data.name || 'User',
          email: data.email || '',
          role,
          responderApprovalStatus: normalizeApprovalStatus(data.responderApprovalStatus, data.role),
          responderRequestedAt: data.responderRequestedAt?.toDate ? data.responderRequestedAt.toDate().toISOString() : data.responderRequestedAt,
          responderApprovedAt: data.responderApprovedAt?.toDate ? data.responderApprovedAt.toDate().toISOString() : data.responderApprovedAt,
          responderApprovedBy: data.responderApprovedBy,
          responderApprovedByName: data.responderApprovedByName,
          responderRejectionReason: data.responderRejectionReason,
          department: data.department || '',
          phoneNumber: data.phoneNumber || data.phone || '',
          hostelBlock: data.hostelBlock,
          roomNumber: data.roomNumber,
          avatarUrl: data.avatarUrl,
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || new Date().toISOString()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
          lastActiveAt: data.lastActiveAt?.toDate ? data.lastActiveAt.toDate().toISOString() : data.lastActiveAt,
        };
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  }

  return localUsers.find((u) => u.id === id) || null;
}

/**
 * Admin Approval Workflow: Approve a pending responder request.
 * - Sets responderApprovalStatus = 'approved'
 * - Sets role = 'responder'
 * - Records approver metadata
 */
export async function approveResponderRequest(
  userId: string,
  adminId: string,
  adminName: string
): Promise<void> {
  const nowISO = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      responderApprovalStatus: 'approved',
      role: 'responder',
      responderApprovedAt: serverTimestamp(),
      responderApprovedBy: adminId,
      responderApprovedByName: adminName,
      updatedAt: serverTimestamp(),
    });
  } else {
    localUsers = localUsers.map((u) =>
      u.id === userId
        ? {
            ...u,
            responderApprovalStatus: 'approved',
            role: 'responder',
            responderApprovedAt: nowISO,
            responderApprovedBy: adminId,
            responderApprovedByName: adminName,
            updatedAt: nowISO,
          }
        : u
    );
    notifyUserListeners();
  }

  await logActivity({
    action: 'USER_ROLE_UPDATED',
    performedBy: adminId,
    performedByName: adminName,
    performedByRole: 'admin',
    targetUserId: userId,
    details: `Approved responder request for user ${userId}. Role promoted to RESPONDER.`,
    timestamp: nowISO,
  });
}

/**
 * Admin Approval Workflow: Reject a pending responder request.
 * - Sets responderApprovalStatus = 'rejected'
 * - Role remains 'reporter' (or current role)
 * - Records rejection reason and metadata
 */
export async function rejectResponderRequest(
  userId: string,
  adminId: string,
  adminName: string,
  reason?: string
): Promise<void> {
  const nowISO = new Date().toISOString();
  const finalReason = reason?.trim() || 'Application did not meet operational response criteria.';

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      responderApprovalStatus: 'rejected',
      responderRejectionReason: finalReason,
      responderApprovedAt: serverTimestamp(),
      responderApprovedBy: adminId,
      responderApprovedByName: adminName,
      updatedAt: serverTimestamp(),
    });
  } else {
    localUsers = localUsers.map((u) =>
      u.id === userId
        ? {
            ...u,
            responderApprovalStatus: 'rejected',
            responderRejectionReason: finalReason,
            responderApprovedAt: nowISO,
            responderApprovedBy: adminId,
            responderApprovedByName: adminName,
            updatedAt: nowISO,
          }
        : u
    );
    notifyUserListeners();
  }

  await logActivity({
    action: 'USER_ROLE_UPDATED',
    performedBy: adminId,
    performedByName: adminName,
    performedByRole: 'admin',
    targetUserId: userId,
    details: `Rejected responder request for user ${userId}. Reason: ${finalReason}`,
    timestamp: nowISO,
  });
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole,
  adminId: string,
  adminName: string
): Promise<void> {
  const nowISO = new Date().toISOString();
  const normalized = normalizeRole(newRole);

  const updates: any = {
    role: normalized,
    updatedAt: nowISO,
  };

  // If manually granting responder role, also set responderApprovalStatus to approved
  if (normalized === 'responder') {
    updates.responderApprovalStatus = 'approved';
    updates.responderApprovedBy = adminId;
    updates.responderApprovedByName = adminName;
    updates.responderApprovedAt = nowISO;
  }

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      ...(normalized === 'responder' ? { responderApprovedAt: serverTimestamp() } : {}),
    });
  } else {
    localUsers = localUsers.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    notifyUserListeners();
  }

  await logActivity({
    action: 'USER_ROLE_UPDATED',
    performedBy: adminId,
    performedByName: adminName,
    performedByRole: 'admin',
    targetUserId: userId,
    details: `Changed user role to ${normalized.toUpperCase()}`,
    timestamp: nowISO,
  });
}

export async function updateUserStatus(
  userId: string,
  newStatus: 'active' | 'suspended',
  adminId: string,
  adminName: string
): Promise<void> {
  const nowISO = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  } else {
    localUsers = localUsers.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
    notifyUserListeners();
  }

  await logActivity({
    action: 'USER_STATUS_UPDATED',
    performedBy: adminId,
    performedByName: adminName,
    performedByRole: 'admin',
    targetUserId: userId,
    details: `Set status to ${newStatus.toUpperCase()}`,
    timestamp: nowISO,
  });
}

export async function createUser(
  userData: Omit<UserProfile, 'id' | 'createdAt'>,
  adminId: string,
  adminName: string
): Promise<string> {
  const nowISO = new Date().toISOString();
  const newId = `user-${Date.now()}`;
  const normalizedRole = normalizeRole(userData.role);
  const approvalStatus = userData.responderApprovalStatus || (normalizedRole === 'responder' ? 'approved' : 'not_requested');

  const newRecord: UserProfile = {
    ...userData,
    id: newId,
    role: normalizedRole,
    responderApprovalStatus: approvalStatus,
    createdAt: nowISO,
  };

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', newId);
    await setDoc(docRef, {
      ...newRecord,
      createdAt: serverTimestamp(),
    });
  } else {
    localUsers.push(newRecord);
    notifyUserListeners();
  }

  await logActivity({
    action: 'USER_CREATED',
    performedBy: adminId,
    performedByName: adminName,
    performedByRole: 'admin',
    targetUserId: newId,
    details: `Created user account for ${userData.name} (${normalizedRole.toUpperCase()})`,
    timestamp: nowISO,
  });

  return newId;
}

export async function deleteUser(
  userId: string,
  adminId: string,
  adminName: string
): Promise<void> {
  const nowISO = new Date().toISOString();

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, 'users', userId);
    await deleteDoc(docRef);
  } else {
    localUsers = localUsers.filter((u) => u.id !== userId);
    notifyUserListeners();
  }

  await logActivity({
    action: 'USER_DELETED',
    performedBy: adminId,
    performedByName: adminName,
    performedByRole: 'admin',
    targetUserId: userId,
    details: `Deleted user profile with ID ${userId}`,
    timestamp: nowISO,
  });
}

function notifyUserListeners() {
  userListeners.forEach((fn) => fn([...localUsers]));
}

function applyFilters(users: UserProfile[], filters?: UserFilters): UserProfile[] {
  if (!filters) return users;

  return users.filter((u) => {
    // Role filter
    if (filters.role && filters.role !== 'all') {
      const target = normalizeRole(filters.role);
      const userRole = normalizeRole(u.role);
      if (userRole !== target) return false;
    }

    // Responder Approval Status filter
    if (filters.responderApprovalStatus && filters.responderApprovalStatus !== 'all') {
      const current = (u.responderApprovalStatus || 'not_requested').toLowerCase();
      if (current !== filters.responderApprovalStatus.toLowerCase()) return false;
    }

    // Account Status filter
    if (filters.status && filters.status !== 'all') {
      if ((u.status || 'active') !== filters.status) return false;
    }

    // Department filter
    if (filters.department && filters.department !== 'all') {
      if (u.department !== filters.department) return false;
    }

    // Search query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = (u.name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchPhone = (u.phoneNumber || '').toLowerCase().includes(q);
      const matchDept = (u.department || '').toLowerCase().includes(q);
      const matchId = (u.id || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchDept && !matchId) {
        return false;
      }
    }

    return true;
  });
}
