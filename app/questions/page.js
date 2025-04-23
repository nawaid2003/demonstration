"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, setDoc } from "../../firebase";

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
      setError("Please answer all questions");
      console.log("Validation failed: Missing answers");
      return;
    }
    if (!user?.uid) {
      setError("User not authenticated");
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
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>Explore Your Sexuality 💖</h1>
      <p>
        Answer these questions to discover your identity. Your responses are
        private.
      </p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>1. Who are you attracted to?</label>
          <select
            name="attraction"
            value={answers.attraction}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="nonbinary">Non-binary people</option>
            <option value="all">All genders</option>
            <option value="none">No one</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
        <div>
          <label>2. How strong is your attraction?</label>
          <select
            name="intensity"
            value={answers.intensity}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="strong">Very strong</option>
            <option value="moderate">Moderate</option>
            <option value="weak">Weak</option>
            <option value="none">None</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
        <div>
          <label>3. What relationship structure feels right?</label>
          <select
            name="relationship"
            value={answers.relationship}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="monogamous">Monogamous</option>
            <option value="polyamorous">Open/Polyamorous</option>
            <option value="none">No relationships</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
        <div>
          <label>4. How much does culture/religion influence you?</label>
          <select
            name="culture"
            value={answers.culture}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="a lot">A lot</option>
            <option value="some">Some</option>
            <option value="not much">Not much</option>
            <option value="not at all">Not at all</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
        <div>
          <label>5. How do you identify your sexuality?</label>
          <select
            name="identity"
            value={answers.identity}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="heterosexual">Heterosexual</option>
            <option value="homosexual">Homosexual</option>
            <option value="bisexual">Bisexual</option>
            <option value="asexual">Asexual</option>
            <option value="pansexual">Pansexual</option>
            <option value="queer">Queer</option>
            <option value="other">Other</option>
            <option value="unsure">Unsure</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
