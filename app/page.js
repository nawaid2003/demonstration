"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const router = useRouter();
  const [authError, setAuthError] = useState(null);
  const { language, toggleLanguage, translations } = useLanguage();

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
        <h1>{translations[language].oops}</h1>
        <p className="error">{translations[language].authError}</p>
        <button onClick={() => router.push("/login")}>
          {translations[language].goToLogin}
        </button>
        <button onClick={toggleLanguage}>
          {translations[language].languageToggle}
        </button>
      </div>
    );
  }

  if (loading)
    return (
      <div className="container">
        <p>{translations[language].loading}</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>{translations[language].welcome}</h1>
      <p>{translations[language].discover}</p>
      <button onClick={toggleLanguage}>
        {translations[language].languageToggle}
      </button>
      {user ? (
        <>
          <p>
            {translations[language].welcomeBack.replace(
              "{name}",
              user.email || user.displayName || "Explorer"
            )}
          </p>
          <button onClick={() => router.push("/questions")}>
            {translations[language].continueQuestions}
          </button>
          <button onClick={() => router.push("/profile")}>
            {translations[language].viewProfile}
          </button>
          <button onClick={() => auth.signOut().then(() => router.push("/"))}>
            {translations[language].signOut}
          </button>
        </>
      ) : (
        <>
          <button onClick={() => router.push("/signup")}>
            {translations[language].signup}
          </button>
          <button onClick={() => router.push("/login")}>
            {translations[language].login}
          </button>
        </>
      )}
    </div>
  );
}
