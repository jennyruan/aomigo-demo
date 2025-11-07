import { initializeApp, getApps } from 'firebase/app';
import {
	getAuth as firebaseGetAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut as firebaseSignOut,
	getIdToken as firebaseGetIdToken,
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

let cachedAuth: ReturnType<typeof firebaseGetAuth> | null = null;

function ensureInitialized() {
	if (!getApps().length) {
		try {
			initializeApp(firebaseConfig);
		} catch (err) {
			// Ignore initialization errors here; callers will handle runtime errors when attempting auth ops
			console.warn('Firebase init skipped or failed:', err);
		}
	}
}

export function getAuth() {
	if (cachedAuth) return cachedAuth;
	ensureInitialized();
	try {
		cachedAuth = firebaseGetAuth();
	} catch (err) {
		console.warn('Failed to get Firebase auth instance:', err);
		cachedAuth = null;
	}
	return cachedAuth as ReturnType<typeof firebaseGetAuth> | null;
}

export async function signIn(email: string, password: string) {
	const auth = getAuth();
	if (!auth) throw new Error('Firebase Auth not initialized');
	return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
	const auth = getAuth();
	if (!auth) throw new Error('Firebase Auth not initialized');
	return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
	const auth = getAuth();
	if (!auth) return;
	return firebaseSignOut(auth);
}

export async function getIdToken() {
	const auth = getAuth();
	if (!auth) return null;
	const user = auth.currentUser;
	if (!user) return null;
	return firebaseGetIdToken(user);
}
