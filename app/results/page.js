"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "../../firebase";
import { useLanguage } from "../../context/LanguageContext";

export default function Results() {
  const { user, loading, hasPaid } = useAuth();
  const router = useRouter();
  const { language, toggleLanguage, translations } = useLanguage();

  useEffect(() => {
    const checkUserData = async () => {
      if (!loading && !user) {
        console.log("Redirecting to /login: No user");
        router.push("/login");
        return;
      }
      if (!loading && user && !hasPaid) {
        console.log("Redirecting to /paywall: Payment not completed");
        router.push("/paywall");
        return;
      }
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            console.log("No user data, redirecting to /questions");
            router.push("/questions");
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          router.push("/questions");
        }
      }
    };
    checkUserData();
  }, [user, loading, hasPaid, router]);

  if (loading)
    return (
      <div className="container">
        <p>{translations[language].loading}</p>
      </div>
    );

  if (!user || !hasPaid) return null;

  return (
    <div className="container">
      <header></header>
      <h1>{translations[language].yourBadge}</h1>
      <p>{translations[language].badgeDescription}</p>
      <div className="badge-container">
        <span className="badge-text">They/Them</span>
      </div>
      <button onClick={() => router.push("/profile")}>
        {translations[language].viewProfile}
      </button>
      <button onClick={toggleLanguage}>
        {translations[language].languageToggle}
      </button>
    </div>
  );
}
