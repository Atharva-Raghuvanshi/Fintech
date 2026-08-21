import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Also export the custom database ID if available
export const firestoreDatabaseId = (firebaseConfig as any).firestoreDatabaseId;

// Initialize Firebase only if config is valid
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

let cachedAccessToken: string | null = null;
let isSigningIn = false;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = initializeFirestore(app, { experimentalForceLongPolling: true }, firestoreDatabaseId || undefined);
  
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      // If we're not signing in via popup right now, token might be lost on reload
      if (!isSigningIn && !cachedAccessToken) {
        cachedAccessToken = null;
      }
    } else {
      cachedAccessToken = null;
    }
  });
} else {
  console.warn("Firebase config is missing or incomplete.");
}

export { auth, db };

export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/spreadsheets.readonly');

export const loginWithGoogle = async () => {
  if (auth) {
    try {
      isSigningIn = true;
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
      }
      return result;
    } finally {
      isSigningIn = false;
    }
  }
  throw new Error("Firebase Auth not initialized");
};

export const logout = async () => {
  if (auth) {
    cachedAccessToken = null;
    return signOut(auth);
  }
  throw new Error("Firebase Auth not initialized");
};

export const getAccessToken = async (): Promise<string | null> => {
  // Return the cached token. If not available, we could force re-authentication, 
  // but for now we just return it.
  return cachedAccessToken;
};
