import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
        const rawRole = (data.role || 'reporter').toLowerCase();

        // Strict Role-Based Access Control (RBAC)
        if (rawRole !== 'admin') {
          // Immediately revoke session for non-admin accounts
          await signOut(auth);
          throw new Error(`Access Denied: Account role is "${rawRole}". Only verified administrators can access the Command Center.`);
        }

        const profile: UserProfile = {
          id: fbUser.uid,
          name: data.name || fbUser.displayName || normalizedEmail.split('@')[0],
          email: data.email || fbUser.email || normalizedEmail,
          role: 'admin',
          responderApprovalStatus: data.responderApprovalStatus || 'approved',
          department: data.department || 'Campus Safety Command',
          phoneNumber: data.phoneNumber || '',
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        };

        return profile;
      } else {
        // If Firestore document doesn't exist yet for admin user (e.g. newly created in Auth console)
        const isAdminEmail = normalizedEmail === 'admin@campusresq.edu' || normalizedEmail.startsWith('admin');
        
        if (isAdminEmail) {
          const newAdminProfile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Administrator',
            email: fbUser.email || normalizedEmail,
            role: 'admin',
            responderApprovalStatus: 'approved',
            department: 'Campus Safety & Operations Command',
            status: 'active',
            createdAt: new Date().toISOString(),
          };

          try {
            await setDoc(userDocRef, {
              name: newAdminProfile.name,
              email: newAdminProfile.email,
              role: 'admin',
              responderApprovalStatus: 'approved',
              department: 'Campus Safety & Operations Command',
              status: 'active',
              createdAt: serverTimestamp(),
            });
          } catch (createErr) {
            console.warn('Could not auto-provision Firestore admin doc:', createErr);
          }

          return newAdminProfile;
        } else {
          await signOut(auth);
          throw new Error('Access Denied: User profile does not exist in the Firestore "users" collection. Please register an admin role profile.');
        }
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
      if (err.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password provider is disabled in Firebase Authentication Console. Please enable Email/Password provider in your Firebase project.');
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
          const role = (data.role || 'reporter').toLowerCase();
          if (role === 'admin') {
            const profile: UserProfile = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'Administrator',
              email: data.email || fbUser.email || '',
              role: 'admin',
              responderApprovalStatus: data.responderApprovalStatus || 'approved',
              department: data.department || 'Campus Safety Command',
              phoneNumber: data.phoneNumber || '',
              status: data.status || 'active',
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
            };
            callback(profile, false);
            return;
          }
          callback(null, false);
        } else if (fbUser.email?.toLowerCase() === 'admin@campusresq.edu' || fbUser.email?.toLowerCase().startsWith('admin')) {
          const profile: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Administrator',
            email: fbUser.email || '',
            role: 'admin',
            responderApprovalStatus: 'approved',
            department: 'Campus Safety Command',
            status: 'active',
            createdAt: new Date().toISOString(),
          };
          callback(profile, false);
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
