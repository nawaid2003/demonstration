// In firebase.js
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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// For debugging
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

// Initialize Firebase
let app;
let auth;
let db;

// Only initialize in browser context
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully in browser");
  } catch (error) {
    console.error("Firebase initialization error:", error.message);

    // Create a minimal implementation to prevent crashes
    auth = {
      onAuthStateChanged: (callback, onError) => {
        if (onError) {
          onError(new Error("Firebase auth failed to initialize"));
        } else {
          callback(null);
        }
        return () => {}; // Return unsubscribe function
      },
      currentUser: null,
      signInWithEmailAndPassword: () =>
        Promise.reject(new Error("Auth not initialized")),
      createUserWithEmailAndPassword: () =>
        Promise.reject(new Error("Auth not initialized")),
      signInWithPopup: () => Promise.reject(new Error("Auth not initialized")),
      signOut: () => Promise.reject(new Error("Auth not initialized")),
    };

    db = {
      collection: () => ({
        doc: () => ({
          get: () => Promise.reject(new Error("Firestore not initialized")),
          set: () => Promise.reject(new Error("Firestore not initialized")),
        }),
      }),
    };
  }
}

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
