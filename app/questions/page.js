"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, setDoc } from "../../firebase";
import { useLanguage } from "../../context/LanguageContext";

export default function Questions() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [answers, setAnswers] = useState({
    attraction: "",
    intensity: "",
    relationship: "",
    culture: "",
    identity: "",
  });
  const [error, setError] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { language, toggleLanguage, translations } = useLanguage();

  useEffect(() => {
    console.log("Questions: loading=", loading, "user=", !!user);
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting answers:", answers);
    const allAnswered = Object.values(answers).every(
      (val) => val && val !== ""
    );
    if (!allAnswered) {
      setError(translations[language].errorAllQuestions);
      console.log("Validation failed: Missing answers");
      return;
    }
    if (!user?.uid) {
      setError(translations[language].errorNotAuthenticated);
      console.log("Error: No user.uid");
      router.push("/login");
      return;
    }
    try {
      console.log("Testing Firestore write to test/testDoc");
      await setDoc(doc(db, "test", "testDoc"), {
        test: "test",
        userId: user.uid,
      });
      console.log("Test write successful");

      const userData = {
        email: user.email,
        displayName: user.displayName || null,
        answers,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasPaid: false,
      };
      console.log("Saving to Firestore: users/", user.uid, userData);
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, userData);
      console.log("Firestore save successful");
      setHasSubmitted(true);
    } catch (err) {
      console.error("Firestore error:", err.code, err.message);
      setError(`Failed to save answers: ${err.message}`);
      if (err.code === "permission-denied") {
        console.log("Permission denied. Check Firebase rules and auth state.");
      }
    }
    console.log("Redirecting to /paywall");
    router.push("/paywall");
  };

  if (loading || !user)
    return (
      <div className="container">
        <p>{translations[language].loading}</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>{translations[language].questionsTitle}</h1>
      <p>{translations[language].questionsSubtitle}</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>{translations[language].attractionQuestion}</label>
          <select
            name="attraction"
            value={answers.attraction}
            onChange={handleChange}
            required
          >
            <option value="">{translations[language].attractionSelect}</option>
            <option value="men">{translations[language].attractionMen}</option>
            <option value="women">
              {translations[language].attractionWomen}
            </option>
            <option value="nonbinary">
              {translations[language].attractionNonbinary}
            </option>
            <option value="all">{translations[language].attractionAll}</option>
            <option value="none">
              {translations[language].attractionNone}
            </option>
            <option value="unsure">
              {translations[language].attractionUnsure}
            </option>
          </select>
        </div>
        <div>
          <label>{translations[language].intensityQuestion}</label>
          <select
            name="intensity"
            value={answers.intensity}
            onChange={handleChange}
            required
          >
            <option value="">{translations[language].intensitySelect}</option>
            <option value="strong">
              {translations[language].intensityStrong}
            </option>
            <option value="moderate">
              {translations[language].intensityModerate}
            </option>
            <option value="weak">{translations[language].intensityWeak}</option>
            <option value="none">{translations[language].intensityNone}</option>
            <option value="unsure">
              {translations[language].intensityUnsure}
            </option>
          </select>
        </div>
        <div>
          <label>{translations[language].relationshipQuestion}</label>
          <select
            name="relationship"
            value={answers.relationship}
            onChange={handleChange}
            required
          >
            <option value="">
              {translations[language].relationshipSelect}
            </option>
            <option value="monogamous">
              {translations[language].relationshipMonogamous}
            </option>
            <option value="polyamorous">
              {translations[language].relationshipPolyamorous}
            </option>
            <option value="none">
              {translations[language].relationshipNone}
            </option>
            <option value="unsure">
              {translations[language].relationshipUnsure}
            </option>
          </select>
        </div>
        <div>
          <label>{translations[language].cultureQuestion}</label>
          <select
            name="culture"
            value={answers.culture}
            onChange={handleChange}
            required
          >
            <option value="">{translations[language].cultureSelect}</option>
            <option value="a lot">{translations[language].cultureALot}</option>
            <option value="some">{translations[language].cultureSome}</option>
            <option value="not much">
              {translations[language].cultureNotMuch}
            </option>
            <option value="not at all">
              {translations[language].cultureNotAtAll}
            </option>
            <option value="unsure">
              {translations[language].cultureUnsure}
            </option>
          </select>
        </div>
        <div>
          <label>{translations[language].identityQuestion}</label>
          <select
            name="identity"
            value={answers.identity}
            onChange={handleChange}
            required
          >
            <option value="">{translations[language].identitySelect}</option>
            <option value="heterosexual">
              {translations[language].identityHeterosexual}
            </option>
            <option value="homosexual">
              {translations[language].identityHomosexual}
            </option>
            <option value="bisexual">
              {translations[language].identityBisexual}
            </option>
            <option value="asexual">
              {translations[language].identityAsexual}
            </option>
            <option value="pansexual">
              {translations[language].identityPansexual}
            </option>
            <option value="queer">
              {translations[language].identityQueer}
            </option>
            <option value="other">
              {translations[language].identityOther}
            </option>
            <option value="unsure">
              {translations[language].identityUnsure}
            </option>
          </select>
        </div>
        <button type="submit">{translations[language].submit}</button>
      </form>
      <button onClick={toggleLanguage}>
        {translations[language].languageToggle}
      </button>
    </div>
  );
}
