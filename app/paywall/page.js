"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, setDoc } from "../../firebase";

export default function Paywall() {
  const { user, loading, hasAnsweredQuestions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(
      "Paywall: loading=",
      loading,
      "user=",
      !!user,
      "hasAnsweredQuestions=",
      hasAnsweredQuestions
    );
    if (!loading && !user) {
      console.log("Redirecting to /login: No user");
      router.push("/login");
    }
  }, [user, loading, router]);

  const handlePayment = async () => {
    if (!user?.uid) {
      console.log("No user.uid, redirecting to /login");
      router.push("/login");
      return;
    }
    try {
      console.log("Processing payment for user:", user.uid);
      await setDoc(doc(db, "test", "payTest"), {
        test: "payment",
        userId: user.uid,
      });
      console.log("Test payment write successful");
      await setDoc(
        doc(db, "users", user.uid),
        { hasPaid: true },
        { merge: true }
      );
      console.log("Payment saved, redirecting to /results");
      router.push("/results");
    } catch (err) {
      console.error("Payment error:", err.code, err.message);
      if (err.code === "permission-denied") {
        console.log("Permission denied. Check Firebase rules.");
      }
      console.log("Falling back to /results despite error");
      router.push("/results");
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
      <h1>Unlock Your Pronoun Badge 🏳️‍🌈</h1>
      <p className="paywall-text">
        You’re one step away from your personalized badge! Complete a one-time
        payment of <strong>5 EUR</strong> to view your badge and access premium
        features.
      </p>
      <p className="fake-payment-note">
        (This is a demo paywall. Click "Pay Now" to proceed.)
      </p>
      <button className="pay-btn" onClick={handlePayment}>
        Pay 5 EUR
      </button>
    </div>
  );
}
