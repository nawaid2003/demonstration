"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, getDoc, auth } from "../../firebase";
import { useLanguage } from "../../context/LanguageContext";

export default function Profile() {
  const { user, loading, hasAnsweredQuestions, hasPaid } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { language, toggleLanguage, translations } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      console.log("Redirecting to /login: No user");
      router.push("/login");
      return;
    }

    if (user) {
      const fetchProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoadingProfile(false);
        }
      };

      fetchProfile();
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Successfully signed out");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{translations[language].loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header></header>
      <h1>{translations[language].yourProfile}</h1>

      <div className="profile-content">
        {profile && (
          <div className="profile-card">
            <h2>{translations[language].yourInfo}</h2>
            <p>
              <strong>{translations[language].emailLabel}</strong> {user.email}
            </p>
            {profile.answers && (
              <>
                <p>
                  <strong>{translations[language].identityLabel}</strong>{" "}
                  {profile.answers.identity ||
                    translations[language].notSpecified}
                </p>
                <p>
                  <strong>{translations[language].pronounsLabel}</strong>{" "}
                  {profile.answers.pronouns ||
                    translations[language].notSpecified}
                </p>
              </>
            )}
            <p>
              <strong>{translations[language].accountStatus}</strong>{" "}
              {hasPaid
                ? translations[language].premiumMember
                : translations[language].freeAccount}
            </p>
          </div>
        )}

        {hasAnsweredQuestions && hasPaid && (
          <div className="badge-preview-section">
            <h3>{translations[language].badgePreview}</h3>
            <p>{translations[language].badgePreviewDesc}</p>
          </div>
        )}
      </div>

      <div className="profile-actions">
        {hasAnsweredQuestions && hasPaid ? (
          <button
            onClick={() => router.push("/results")}
            className="view-badge-btn"
          >
            {translations[language].viewBadge}
          </button>
        ) : hasAnsweredQuestions ? (
          <button
            onClick={() => router.push("/paywall")}
            className="upgrade-btn"
          >
            {translations[language].upgrade}
          </button>
        ) : (
          <button
            onClick={() => router.push("/questions")}
            className="questions-btn"
          >
            {translations[language].completeQuestions}
          </button>
        )}

        <button onClick={() => router.push("/")} className="home-btn">
          {translations[language].backToHome}
        </button>

        <button onClick={handleLogout} className="signout-btn">
          {translations[language].signOut}
        </button>
      </div>
      <button onClick={toggleLanguage}>
        {translations[language].languageToggle}
      </button>
    </div>
  );
}
