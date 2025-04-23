// pages/debug.js or app/debug/page.js
"use client";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";

export default function Debug() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const checks = {
      windowDefined: typeof window !== "undefined",
      authExists: !!auth,
      authMethods: auth ? Object.keys(auth).join(", ") : "N/A",
      firebaseEnvVars: {
        apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId:
          !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      },
    };

    setStatus(JSON.stringify(checks, null, 2));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Firebase Debug</h1>
      <pre>{status}</pre>
    </div>
  );
}
