"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";
import Image from "next/image"; // Import Image component

export default function Signup() {
  const { user, loading, authError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/questions");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(""); // Clear previous errors
      console.log("Starting Google sign-in");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Google sign-in successful");
      router.push("/questions");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(`Sign-in error: ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>Join Pronoun 🌟</h1>
      <p>Create an account to start your journey!</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {authError && <p className="error">Authentication error: {authError}</p>}
      <button className="google-btn" onClick={handleGoogleSignIn}>
        <Image
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          width={24}
          height={24}
        />
        Sign up with Google
      </button>
      <p>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#ff69b4" }}>
          Log In
        </a>
      </p>
    </div>
  );
}
