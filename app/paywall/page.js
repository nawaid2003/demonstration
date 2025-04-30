"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, setDoc } from "../../firebase";
import { useLanguage } from "../../context/LanguageContext";

export default function Paywall() {
  const { user, loading, hasAnsweredQuestions } = useAuth();
  const router = useRouter();
  const { language, toggleLanguage, translations } = useLanguage();

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
  }, [user, loading, hasAnsweredQuestions, router]);

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
        <p>{translations[language].loading}</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>{translations[language].unlockBadge}</h1>
      <p
        className="paywall-text"
        dangerouslySetInnerHTML={{ __html: translations[language].paywallText }}
      ></p>
      <p className="fake-payment-note">
        {translations[language].fakePaymentNote}
      </p>
      <button className="pay-btn" onClick={handlePayment}>
        {translations[language].payNow}
      </button>
      <button onClick={toggleLanguage}>
        {translations[language].languageToggle}
      </button>
    </div>
  );
}
