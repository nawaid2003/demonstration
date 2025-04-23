"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, getDoc, auth } from "../../firebase"; // Added auth import here

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log("Profile: loading=", loading, "user=", !!user);
    if (!loading && !user) {
      console.log("Redirecting to /login: No user");
      router.push("/login");
    } else if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      fetchUserData();
    }
  }, [user, loading, router]);

  if (loading || !userData)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>Your Profile 🌟</h1>
      <p>Welcome back, {userData.displayName || userData.email}!</p>
      <div className="profile-card">
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        {userData.answers && (
          <>
            <p>
              <strong>Attraction:</strong> {userData.answers.attraction}
            </p>
            <p>
              <strong>Intensity:</strong> {userData.answers.intensity}
            </p>
            <p>
              <strong>Relationship:</strong> {userData.answers.relationship}
            </p>
            <p>
              <strong>Culture Influence:</strong> {userData.answers.culture}
            </p>
            <p>
              <strong>Identity:</strong> {userData.answers.identity}
            </p>
          </>
        )}
        <p>
          <strong>Has Paid:</strong> {userData.hasPaid ? "Yes" : "No"}
        </p>
      </div>
      {userData.hasPaid && (
        <button onClick={() => router.push("/results")}>View Your Badge</button>
      )}
      <button onClick={() => auth.signOut().then(() => router.push("/"))}>
        Sign Out
      </button>
    </div>
  );
}
