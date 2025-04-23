"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { db, doc, getDoc } from "../../firebase";

export default function Results() {
  const { user, loading, hasAnsweredQuestions, hasPaid } = useAuth();
  const router = useRouter();
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log(
      "Results: loading=",
      loading,
      "user=",
      !!user,
      "hasAnsweredQuestions=",
      hasAnsweredQuestions,
      "hasPaid=",
      hasPaid
    );
    if (!loading && !user) {
      console.log("Redirecting to /login: No user");
      router.push("/login");
    } else if (!loading && user && !hasAnsweredQuestions) {
      console.log("Redirecting to /questions: No answers");
      router.push("/questions");
    } else if (!loading && user && !hasPaid) {
      console.log("Redirecting to /paywall: Not paid");
      router.push("/paywall");
    }
  }, [user, loading, hasAnsweredQuestions, hasPaid, router]);

  useEffect(() => {
    if (!loading && user && hasAnsweredQuestions && hasPaid) {
      console.log("Drawing badge for user:", user.uid);
      const drawBadge = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const { answers } = userDoc.data();
            console.log("User answers:", answers);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Adjust canvas size for pixel density
            const dpr = window.devicePixelRatio || 1;
            canvas.width = 500 * dpr;
            canvas.height = 300 * dpr;
            ctx.scale(dpr, dpr);

            // Gradient background with Pride colors
            const gradient = ctx.createLinearGradient(0, 0, 500, 300);
            gradient.addColorStop(0, "#ff69b4");
            gradient.addColorStop(0.5, "#55cdfc");
            gradient.addColorStop(1, "#ffdab9");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 500, 300);

            // Pride flag stripes
            const flagColors = [
              "#FF0000",
              "#FFA500",
              "#FFFF00",
              "#008000",
              "#0000FF",
              "#800080",
            ];
            const flagHeight = 300 / 6;
            flagColors.forEach((color, i) => {
              ctx.fillStyle = color;
              ctx.fillRect(0, i * flagHeight, 500, flagHeight);
            });

            // Sparkles effect
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            for (let i = 0; i < 30; i++) {
              const x = Math.random() * 500;
              const y = Math.random() * 300;
              const size = Math.random() * 5 + 2;
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.fill();
            }

            // Text
            ctx.fillStyle = "#333";
            ctx.font = "24px Comfortaa";
            ctx.textAlign = "center";
            ctx.fillText(
              `Your Identity: ${answers.identity || "Explorer"}`,
              250,
              150
            );
            ctx.font = "18px Comfortaa";
            ctx.fillText("Pronoun Pride 🏳️‍🌈", 250, 180);
          }
        } catch (err) {
          console.error("Badge draw error:", err.code, err.message);
        }
      };
      drawBadge();
    }
  }, [user, loading, hasAnsweredQuestions, hasPaid]);

  if (loading)
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>Your Pronoun Badge 🏳️‍🌈</h1>
      <p>Here’s your personalized badge, crafted with love!</p>
      <canvas
        ref={canvasRef}
        className="badge-canvas"
        style={{ width: "500px", height: "300px" }}
      />
      <button onClick={() => window.location.reload()}>Redraw Badge</button>
      <button onClick={() => router.push("/profile")}>View Profile</button>
    </div>
  );
}
