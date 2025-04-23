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

// Log environment variables availability
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

// Try using direct values instead of environment variables for debugging
const firebaseConfig = {
  apiKey: "AIzaSyAyRTFOvB3OEdgTsXRNeUfLTSPQHxFCrk4",
  authDomain: "pronouns-71f78.firebaseapp.com",
  projectId: "pronouns-71f78",
  storageBucket: "pronouns-71f78.appspot.com", // Note: corrected from .firebasestorage.app
  messagingSenderId: "675350212271",
  appId: "1:675350212271:web:caa74253deae263ffd2e5a",
};

// Fallback Firebase methods to prevent crashes
const createFallbackAuth = () => {
  return {
    onAuthStateChanged: (callback) => {
      console.warn("Using fallback auth - Firebase failed to initialize");
      setTimeout(() => callback(null), 0);
      return () => {};
    },
    signInWithEmailAndPassword: () => {
      console.error("Auth not initialized");
      return Promise.reject(
        new Error("Firebase authentication is not available")
      );
    },
    createUserWithEmailAndPassword: () => {
      console.error("Auth not initialized");
      return Promise.reject(
        new Error("Firebase authentication is not available")
      );
    },
    signInWithPopup: () => {
      console.error("Auth not initialized");
      return Promise.reject(
        new Error("Firebase authentication is not available")
      );
    },
    signOut: () => {
      console.error("Auth not initialized");
      return Promise.reject(
        new Error("Firebase authentication is not available")
      );
    },
    currentUser: null,
  };
};

// Initialize Firebase
let app, auth, db;

// Only attempt initialization in browser
if (typeof window !== "undefined") {
  try {
    // This may throw an error if config is invalid
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialization successful");

    try {
      auth = getAuth(app);
      console.log("Firebase auth initialized successfully");
    } catch (authError) {
      console.error("Failed to initialize Firebase auth:", authError);
      auth = createFallbackAuth();
    }

    try {
      db = getFirestore(app);
      console.log("Firebase Firestore initialized successfully");
    } catch (dbError) {
      console.error("Failed to initialize Firestore:", dbError);
      db = {};
    }
  } catch (appError) {
    console.error("Failed to initialize Firebase app:", appError);
    auth = createFallbackAuth();
    db = {};
  }
} else {
  console.log("Skipping Firebase initialization in server context");
  auth = createFallbackAuth();
  db = {};
}

// Export the same interfaces
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
