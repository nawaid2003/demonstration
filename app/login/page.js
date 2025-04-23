"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase";
import Image from "next/image"; // Import Image component

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Login: loading=", loading, "user=", !!user);
    if (!loading && user) {
      console.log("Redirecting to /questions");
      router.push("/questions");
    }
  }, [user, loading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/questions");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/questions");
    } catch (err) {
      setError(err.message);
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
      <h1>Log In to Pronoun 💖</h1>
      <p>Sign in to continue your journey with us!</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Log In</button>
      </form>
      <button className="google-btn" onClick={handleGoogleSignIn}>
        <Image
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          width={24}
          height={24}
        />
        Sign in with Google
      </button>
      <p>
        Don’t have an account?{" "}
        <a href="/signup" style={{ color: "#ff69b4" }}>
          Sign Up
        </a>
      </p>
    </div>
  );
}
