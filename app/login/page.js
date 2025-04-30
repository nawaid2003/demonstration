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
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";

export default function Login() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { language, toggleLanguage, translations } = useLanguage();

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
        <p>{translations[language].loading}</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>{translations[language].logInTitle}</h1>
      <p>{translations[language].continueJourney}</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={translations[language].email}
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={translations[language].password}
            required
          />
        </div>
        <button type="submit">{translations[language].signIn}</button>
      </form>
      <button className="google-btn" onClick={handleGoogleSignIn}>
        <Image
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google Logo"
          width={24}
          height={24}
        />
        {translations[language].signInWithGoogleLogin}
      </button>
      <p>
        {translations[language].dontHaveAccount}{" "}
        <a href="/signup" style={{ color: "#FF9A8B" }}>
          {translations[language].signUpLink}
        </a>
      </p>
      <button onClick={toggleLanguage}>
        {translations[language].languageToggle}
      </button>
    </div>
  );
}
