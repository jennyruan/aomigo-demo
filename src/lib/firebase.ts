import { initializeApp, getApps } from 'firebase/app';
import {
	getAuth,
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

if (!getApps().length) {
	try {
		initializeApp(firebaseConfig);
	} catch (err) {
		// ignore initialization errors in dev if env vars missing
		console.warn('Firebase init skipped or failed:', err);
	}
}

const auth = getAuth();

export async function signIn(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
	return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
	return firebaseSignOut(auth);
}

export async function getIdToken() {
	const user = auth.currentUser;
	if (!user) return null;
	return firebaseGetIdToken(user);
}

export { auth };
