"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";

export default function Home() {
  const router = useRouter();
  const [authError, setAuthError] = useState(null);

  // Safely access useAuth with error handling
  let user = null;
  let loading = true;
  try {
    const authContext = useAuth();
    user = authContext.user;
    loading = authContext.loading;
    console.log("Home: useAuth succeeded - loading=", loading, "user=", !!user);
  } catch (err) {
    console.error("Home: useAuth failed:", err.message);
    setAuthError("Failed to load authentication state. Please try again.");
  }

  useEffect(() => {
    console.log(
      "Home: Rendered with loading=",
      loading,
      "user=",
      !!user,
      "authError=",
      authError
    );
  }, [user, loading, authError]);

  if (authError) {
    return (
      <div className="container">
        <header></header>
        <h1>Oops! Something Went Wrong 😔</h1>
        <p className="error">{authError}</p>
        <button onClick={() => router.push("/login")}>Go to Login</button>
      </div>
    );
  }

  if (loading)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>Welcome to Pronoun 🌈</h1>
      <p>
        Discover your identity with love and pride. Let’s create your
        personalized badge!
      </p>
      {user ? (
        <>
          <p>
            Welcome back, {user.email || user.displayName || "Explorer"}! Ready
            to explore?
          </p>
          <button onClick={() => router.push("/questions")}>
            Continue to Questions
          </button>
          <button onClick={() => router.push("/profile")}>View Profile</button>
          <button onClick={() => auth.signOut().then(() => router.push("/"))}>
            Sign Out
          </button>
        </>
      ) : (
        <>
          <button onClick={() => router.push("/signup")}>Sign Up</button>
          <button onClick={() => router.push("/login")}>Log In</button>
        </>
      )}
    </div>
  );
}
