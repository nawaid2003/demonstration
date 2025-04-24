"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, getDoc, auth } from "../../firebase"; // Import auth

export default function Profile() {
  const { user, loading, hasAnsweredQuestions, hasPaid } = useAuth(); // Removed unused logout
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

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
      await auth.signOut(); // Use auth.signOut directly
      console.log("Successfully signed out");
      router.push("/login"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header></header>
      <h1>Your Profile</h1>

      {/* Profile content with proper spacing */}
      <div className="profile-content">
        {profile && (
          <div className="profile-card">
            <h2>Your Information</h2>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            {profile.answers && (
              <>
                <p>
                  <strong>Identity:</strong>{" "}
                  {profile.answers.identity || "Not specified"}
                </p>
                <p>
                  <strong>Pronouns:</strong>{" "}
                  {profile.answers.pronouns || "Not specified"}
                </p>
              </>
            )}
            <p>
              <strong>Account Status:</strong>{" "}
              {hasPaid ? "Premium Member" : "Free Account"}
            </p>
          </div>
        )}

        {/* Badge preview if applicable */}
        {hasAnsweredQuestions && hasPaid && (
          <div className="badge-preview-section">
            <h3>Your Badge</h3>
            <p>View your personalized pronoun badge.</p>
          </div>
        )}
      </div>

      {/* Button container with proper spacing */}
      <div className="profile-actions">
        {hasAnsweredQuestions && hasPaid ? (
          <button
            onClick={() => router.push("/results")}
            className="view-badge-btn"
          >
            View Your Badge
          </button>
        ) : hasAnsweredQuestions ? (
          <button
            onClick={() => router.push("/paywall")}
            className="upgrade-btn"
          >
            Upgrade to See Your Badge
          </button>
        ) : (
          <button
            onClick={() => router.push("/questions")}
            className="questions-btn"
          >
            Complete Questions
          </button>
        )}

        <button onClick={() => router.push("/")} className="home-btn">
          Back to Home
        </button>

        <button onClick={handleLogout} className="signout-btn">
          Sign Out
        </button>
      </div>
    </div>
  );
}
