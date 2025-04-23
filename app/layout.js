import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import { Comfortaa } from "next/font/google"; // Import Comfortaa from next/font/google

// Load Comfortaa font
const comfortaa = Comfortaa({
  subsets: ["latin"],
  weights: [300, 400, 700],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={comfortaa.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
