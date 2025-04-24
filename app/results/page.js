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

            // Clean canvas
            ctx.clearRect(0, 0, 500, 300);

            // Draw elegant gradient background
            const bgGradient = ctx.createLinearGradient(0, 0, 500, 300);
            bgGradient.addColorStop(0, "#f7f4f1");
            bgGradient.addColorStop(1, "#ffffff");
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, 500, 300);

            // Add a subtle pattern
            ctx.fillStyle = "rgba(140, 68, 173, 0.03)";
            for (let i = 0; i < 500; i += 20) {
              for (let j = 0; j < 300; j += 20) {
                if ((i + j) % 40 === 0) {
                  ctx.fillRect(i, j, 10, 10);
                }
              }
            }

            // Draw border
            ctx.strokeStyle = "#8e44ad";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.roundRect(10, 10, 480, 280, 16);
            ctx.stroke();

            // Draw Pride rainbow on the top
            const stripeHeight = 10;
            const prideColors = [
              "#ff0000", // Red
              "#ffa500", // Orange
              "#ffff00", // Yellow
              "#008000", // Green
              "#0000ff", // Blue
              "#800080", // Purple
            ];

            prideColors.forEach((color, i) => {
              ctx.fillStyle = color;
              ctx.fillRect(10, 10 + i * stripeHeight, 480, stripeHeight);
            });

            // Add a circular badge emblem
            const centerX = 250;
            const centerY = 130;
            const radius = 70;

            // Draw outer circle
            const circleGradient = ctx.createRadialGradient(
              centerX,
              centerY,
              0,
              centerX,
              centerY,
              radius
            );
            circleGradient.addColorStop(0, "#8e44ad");
            circleGradient.addColorStop(1, "#3498db");

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = circleGradient;
            ctx.fill();

            // Add some decorative elements
            for (let i = 0; i < 12; i++) {
              const angle = (i / 12) * Math.PI * 2;
              const x1 = centerX + (radius - 10) * Math.cos(angle);
              const y1 = centerY + (radius - 10) * Math.sin(angle);
              const x2 = centerX + (radius + 15) * Math.cos(angle);
              const y2 = centerY + (radius + 15) * Math.sin(angle);

              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.lineWidth = 3;
              ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
              ctx.stroke();
            }

            // Draw inner circle for text background
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 15, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fill();

            // Add user's identity text
            ctx.fillStyle = "#2c3e50";
            ctx.font = "bold 16px Comfortaa";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const identity = answers.identity || "Explorer";
            ctx.fillText(identity, centerX, centerY);

            // Add pronoun text below if exists
            if (answers.pronouns) {
              ctx.font = "14px Comfortaa";
              ctx.fillText(answers.pronouns, centerX, centerY + 25);
            }

            // Add certificate text
            ctx.font = "bold 20px Comfortaa";
            ctx.fillStyle = "#2c3e50";
            ctx.fillText("Pronoun Pride Certificate", 250, 220);

            // Add date
            const today = new Date();
            const dateStr = today.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            ctx.font = "14px Comfortaa";
            ctx.fillStyle = "#7f8c8d";
            ctx.fillText(dateStr, 250, 250);

            // Add sparkles effect
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            for (let i = 0; i < 20; i++) {
              const x = Math.random() * 500;
              const y = Math.random() * 300;
              const size = Math.random() * 3 + 1;

              // Draw a star shape
              ctx.beginPath();
              for (let j = 0; j < 5; j++) {
                const starAngle = (j * Math.PI * 2) / 5 - Math.PI / 2;
                const starX = x + Math.cos(starAngle) * size * 2;
                const starY = y + Math.sin(starAngle) * size * 2;

                if (j === 0) {
                  ctx.moveTo(starX, starY);
                } else {
                  ctx.lineTo(starX, starY);
                }

                const innerAngle = starAngle + Math.PI / 5;
                const innerX = x + Math.cos(innerAngle) * size;
                const innerY = y + Math.sin(innerAngle) * size;
                ctx.lineTo(innerX, innerY);
              }
              ctx.closePath();
              ctx.fillStyle = "rgba(243, 156, 18, 0.7)";
              ctx.fill();
            }

            // Add a small icon at the bottom
            ctx.font = "20px Arial";
            ctx.fillStyle = "#8e44ad";
            ctx.fillText("🌈", 250, 275);
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your beautiful badge...</p>
        </div>
      </div>
    );

  return (
    <div className="container">
      <header></header>
      <h1>Your Pronoun Badge 🌈</h1>
      <p>Here's your personalized certificate, crafted with love and pride!</p>
      <canvas
        ref={canvasRef}
        className="badge-canvas"
        style={{ width: "100%", maxWidth: "500px", height: "auto" }}
      />
      <button onClick={() => window.location.reload()}>Redraw Badge</button>
      <button onClick={() => router.push("/profile")}>View Profile</button>
    </div>
  );
}
