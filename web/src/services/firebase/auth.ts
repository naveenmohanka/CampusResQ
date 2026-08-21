import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { UserProfile } from '../../types/user';
import { INITIAL_USERS } from '../mockData';

/**
 * Real Authentication Flow:
 * Email + Password -> Firebase Auth -> Firestore users/{uid} -> role === 'admin' -> Allow Access
 */
export async function loginWithEmail(email: string, password: string): Promise<UserProfile> {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Production / Live Firebase Flow
  if (isFirebaseConfigured && auth && db) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const fbUser = userCredential.user;
      
      // Query user role document in Firestore
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile: UserProfile = {
          id: fbUser.uid,
          name: data.name || fbUser.displayName || normalizedEmail.split('@')[0],
          email: data.email || fbUser.email || normalizedEmail,
          role: data.role || 'student',
          department: data.department || '',
          phoneNumber: data.phoneNumber || '',
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        };

        // Strict Role-Based Access Control (RBAC)
        if (profile.role !== 'admin') {
          // Immediately revoke session for non-admin accounts
          await signOut(auth);
          throw new Error(`Access Denied: Account role is "${profile.role}". Only verified administrators can access the Command Center.`);
        }

        return profile;
      } else {
        await signOut(auth);
        throw new Error('Access Denied: User profile does not exist in the Firestore "users" collection. Please register an admin role profile.');
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      if (err.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Account access temporarily disabled due to too many failed attempts. Try again later.');
      }
      throw err;
    }
  }

  // 2. Offline Simulation Fallback (When Firebase credentials are not yet configured in .env)
  const matchedUser = INITIAL_USERS.find(u => u.email.toLowerCase() === normalizedEmail);

  if (matchedUser) {
    if (matchedUser.role !== 'admin') {
      throw new Error(`Access Denied: Account role is "${matchedUser.role}". Only administrators have access.`);
    }
    if (password !== 'password123' && password.length < 6) {
      throw new Error('Invalid password. Please enter the correct password.');
    }
    localStorage.setItem('campusresq_demo_user', JSON.stringify(matchedUser));
    return matchedUser;
  }

  throw new Error('Authentication failed: User account not found in database.');
}

export async function logoutCurrentSession(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem('campusresq_demo_user');
}

export function subscribeToAuthState(
  callback: (user: UserProfile | null, loading: boolean) => void
): () => void {
  if (isFirebaseConfigured && auth && db) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        callback(null, false);
        return;
      }
      try {
        if (!db) {
          callback(null, false);
          return;
        }
        const userDocRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          const profile: UserProfile = {
            id: fbUser.uid,
            name: data.name || fbUser.displayName || 'Admin',
            email: data.email || fbUser.email || '',
            role: data.role || 'student',
            department: data.department || '',
            phoneNumber: data.phoneNumber || '',
            status: data.status || 'active',
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          };
          callback(profile.role === 'admin' ? profile : null, false);
        } else {
          callback(null, false);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        callback(null, false);
      }
    });
  }

  const savedUser = localStorage.getItem('campusresq_demo_user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser) as UserProfile;
      callback(parsed.role === 'admin' ? parsed : null, false);
    } catch {
      callback(null, false);
    }
  } else {
    callback(null, false);
  }

  return () => {};
}
