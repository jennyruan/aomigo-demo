import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  type Auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  type User,
} from 'firebase/auth';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function initFirebase() {
  if (getApps().length > 0) {
    app = getApps()[0];
    return;
  }

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  } as const;

  app = initializeApp(firebaseConfig);
}

function getAuthClient(): Auth | null {
  if (!app) initFirebase();
  if (!app) return null;
  if (!auth) auth = getAuth(app);
  return auth;
}

export function onAuthChange(callback: (user: User | null) => void) {
  const a = getAuthClient();
  if (!a) return () => undefined;
  return onAuthStateChanged(a, callback);
}

export async function signUpWithEmail(email: string, password: string) {
  const a = getAuthClient();
  if (!a) throw new Error('Firebase not configured');
  const result = await createUserWithEmailAndPassword(a, email, password);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const a = getAuthClient();
  if (!a) throw new Error('Firebase not configured');
  const result = await signInWithEmailAndPassword(a, email, password);
  return result.user;
}

export async function signOut() {
  const a = getAuthClient();
  if (!a) return;
  await firebaseSignOut(a);
}

export async function sendResetEmail(email: string) {
  const a = getAuthClient();
  if (!a) throw new Error('Firebase not configured');
  await sendPasswordResetEmail(a, email);
}

export function tryGetFirebaseAuth(): Auth | null {
  return getAuthClient();
}

initFirebase();

export default {
  initFirebase,
  tryGetFirebaseAuth,
  onAuthChange,
  signUpWithEmail,
  signInWithEmail,
  signOut,
  sendResetEmail,
};
