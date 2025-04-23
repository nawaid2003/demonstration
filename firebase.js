import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Log environment variables (without exposing sensitive values)
console.log(
  "Firebase Config - API Key exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
);
console.log(
  "Firebase Config - Auth Domain exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
);
console.log(
  "Firebase Config - Project ID exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);
console.log(
  "Firebase Config - Storage Bucket exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
);
console.log(
  "Firebase Config - Messaging Sender ID exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
);
console.log(
  "Firebase Config - App ID exists:",
  !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase and define auth, db at top level
let auth, db;
try {
  const app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.error("Firebase initialization failed:", err.message);
  throw new Error(`Firebase initialization failed: ${err.message}`);
}

// Export all required Firebase functions and instances
export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  doc,
  setDoc,
  getDoc,
};
