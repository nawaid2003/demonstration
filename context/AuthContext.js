"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, doc, getDoc } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAnsweredQuestions, setHasAnsweredQuestions] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    console.log("Setting up auth state listener...");

    // Safety check for auth object
    if (!auth || typeof auth.onAuthStateChanged !== "function") {
      console.error("Auth object is invalid:", auth);
      setAuthError("Firebase authentication system unavailable");
      setLoading(false);
      return () => {};
    }

    try {
      const unsubscribe = auth.onAuthStateChanged(
        async (currentUser) => {
          console.log(
            "Auth state changed:",
            currentUser ? "User logged in" : "No user"
          );
          setUser(currentUser);

          if (currentUser) {
            try {
              // Check if db and required methods exist
              if (!db || !doc || !getDoc) {
                console.error("Firestore db or methods unavailable");
                setAuthError("Firestore database unavailable");
                setLoading(false);
                return;
              }

              try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                console.log("User document exists:", userDoc.exists());
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  setHasAnsweredQuestions(!!userData?.answers);
                  setHasPaid(!!userData?.hasPaid);
                } else {
                  setHasAnsweredQuestions(false);
                  setHasPaid(false);
                }
              } catch (firestoreError) {
                console.error("Firestore error:", firestoreError);
                setAuthError(`Database error: ${firestoreError.message}`);
              }
            } catch (error) {
              console.error("Error processing user data:", error);
              setAuthError(`Error processing user data: ${error.message}`);
            }
          } else {
            setHasAnsweredQuestions(false);
            setHasPaid(false);
          }

          setLoading(false);
        },
        (error) => {
          console.error("Auth state change error:", error);
          setAuthError(`Authentication error: ${error.message}`);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Failed to set up auth listener:", error);
      setAuthError(`Failed to set up authentication: ${error.message}`);
      setLoading(false);
      return () => {};
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, hasAnsweredQuestions, hasPaid, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
