import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import { LanguageProvider } from "../context/LanguageContext";

// Load Playfair Display for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  weights: [400, 700],
  display: "swap",
});

// Load Inter for body text
const inter = Inter({
  subsets: ["latin"],
  weights: [400, 600],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
