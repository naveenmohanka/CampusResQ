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

export async function loginWithEmail(email: string, password: string): Promise<UserProfile> {
  // If Firebase is configured and ready
  if (isFirebaseConfigured && auth && db) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;
    
    // Fetch profile from Firestore
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      const profile: UserProfile = {
        id: fbUser.uid,
        name: data.name || fbUser.displayName || email.split('@')[0],
        email: data.email || fbUser.email || email,
        role: data.role || 'student',
        department: data.department || '',
        phoneNumber: data.phoneNumber || '',
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
      };

      if (profile.role !== 'admin') {
        throw new Error('Access Denied: Only administrators have permission to access the CampusResQ Admin Dashboard.');
      }
      return profile;
    } else {
      throw new Error('Account profile not found in database. Please contact system administrator.');
    }
  }

  // Fallback demo authentication
  const normalizedEmail = email.trim().toLowerCase();
  const matchedUser = INITIAL_USERS.find(u => u.email.toLowerCase() === normalizedEmail);

  if (matchedUser) {
    if (matchedUser.role !== 'admin') {
      throw new Error(`Access Denied: The role "${matchedUser.role}" does not have admin privileges.`);
    }
    // Simple demo password verification
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }
    localStorage.setItem('campusresq_demo_user', JSON.stringify(matchedUser));
    return matchedUser;
  }

  // Allow test admin login in demo mode
  if (normalizedEmail.includes('admin') || email === 'admin@campusresq.edu') {
    const adminUser = INITIAL_USERS[0];
    localStorage.setItem('campusresq_demo_user', JSON.stringify(adminUser));
    return adminUser;
  }

  throw new Error('Invalid credentials. Use demo account: admin@campusresq.edu / password123');
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

  // Demo mode auth check from localStorage
  const savedDemo = localStorage.getItem('campusresq_demo_user');
  if (savedDemo) {
    try {
      const parsed = JSON.parse(savedDemo) as UserProfile;
      callback(parsed.role === 'admin' ? parsed : null, false);
    } catch {
      callback(null, false);
    }
  } else {
    // Check initial state
    callback(null, false);
  }

  return () => {};
}
