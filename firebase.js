import { initializeApp, getApps } from "firebase/app";
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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-bucket",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:000000000000:web:0000000000000000000000",
};

// Initialize Firebase and define auth, db with fallbacks
let auth = null;
let db = null;

// Only initialize if not in a server-side static build context
const isBuildTime =
  process.env.NODE_ENV === "production" && typeof window === "undefined";

try {
  // Check if Firebase is already initialized
  if (isBuildTime) {
    console.log("Skipping Firebase initialization during build time");
  } else {
    const app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (err) {
  console.error("Firebase initialization failed:", err.message);
  // Don't throw error, just log it
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
