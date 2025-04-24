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
        <h1>Oops! Something Went Wrong</h1>
        <p className="error">{authError}</p>
        <button onClick={() => router.push("/login")}>Go to Login</button>
      </div>
    );
  }

  if (loading)
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your experience...</p>
        </div>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>Welcome to Pronoun Pride</h1>
      <p>
        Discover and celebrate your authentic identity with love, respect, and
        pride. Create your personalized identity badge that represents who you
        truly are.
      </p>
      {user ? (
        <>
          <p>
            Welcome back,{" "}
            <strong>{user.email || user.displayName || "Explorer"}</strong>!
            Continue your journey of self-expression.
          </p>
          <button onClick={() => router.push("/questions")}>
            Continue Your Journey
          </button>
          <button onClick={() => router.push("/profile")}>
            View Your Profile
          </button>
          <button
            onClick={() => auth.signOut().then(() => router.push("/"))}
            style={{
              background: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid #e2e8f0",
              boxShadow: "none",
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            <button onClick={() => router.push("/signup")}>
              Create Your Account
            </button>
            <button
              onClick={() => router.push("/login")}
              style={{
                background: "white",
                color: "var(--primary)",
                border: "2px solid var(--primary)",
                boxShadow: "0 4px 10px rgba(142, 68, 173, 0.1)",
              }}
            >
              Log In
            </button>
          </div>
          <p style={{ fontSize: "0.9rem", marginTop: "20px", opacity: "0.7" }}>
            Join our supportive community and create your unique identity badge
            today!
          </p>
        </>
      )}
    </div>
  );
}
