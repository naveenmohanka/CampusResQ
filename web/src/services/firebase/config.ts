import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isForcedDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const isFirebaseConfigured = !isForcedDemoMode && Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'AIzaSyExampleKey123456789' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'campusresq-29f13-example'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
  }
} else {
  if (isForcedDemoMode) {
    console.info('CampusResQ: Running in DEMO MODE (VITE_DEMO_MODE=true)');
  } else {
    console.info('CampusResQ: Running in Demo / Offline mode (No active Firebase credentials in .env)');
  }
}

export { app, auth, db, storage, firebaseConfig };
