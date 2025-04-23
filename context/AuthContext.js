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
    // Check if auth is properly initialized
    if (!auth) {
      console.error("Firebase auth is not initialized");
      setAuthError("Firebase authentication failed to initialize");
      setLoading(false);
      return () => {};
    }

    try {
      const unsubscribe = auth.onAuthStateChanged(
        async (currentUser) => {
          console.log("AuthContext: User changed:", !!currentUser);
          setUser(currentUser);
          if (currentUser) {
            const fetchUserData = async (attempt = 1, maxAttempts = 3) => {
              try {
                // Check if db is properly initialized
                if (!db) {
                  console.error("Firestore db is not initialized");
                  setAuthError("Firestore database failed to initialize");
                  setLoading(false);
                  return;
                }

                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                console.log(
                  "AuthContext: Fetched user doc (attempt",
                  attempt,
                  "):",
                  userDoc.exists(),
                  "answers:",
                  !!userDoc.data()?.answers,
                  "hasPaid:",
                  !!userDoc.data()?.hasPaid
                );
                if (userDoc.exists()) {
                  setHasAnsweredQuestions(!!userDoc.data()?.answers);
                  setHasPaid(!!userDoc.data()?.hasPaid);
                } else {
                  setHasAnsweredQuestions(false);
                  setHasPaid(false);
                }
                setLoading(false);
              } catch (err) {
                console.error(
                  "AuthContext Firestore error (attempt",
                  attempt,
                  "):",
                  err.code,
                  err.message
                );
                if (attempt < maxAttempts && err.code !== "permission-denied") {
                  console.log("Retrying fetch in 1s...");
                  setTimeout(
                    () => fetchUserData(attempt + 1, maxAttempts),
                    1000
                  );
                } else {
                  setHasAnsweredQuestions(false);
                  setHasPaid(false);
                  setLoading(false);
                }
              }
            };
            fetchUserData();
          } else {
            setHasAnsweredQuestions(false);
            setHasPaid(false);
            setLoading(false);
          }
        },
        (error) => {
          console.error("Auth state change error:", error);
          setAuthError(error.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setAuthError("Failed to setup authentication");
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
