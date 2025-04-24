import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import { Comfortaa, Poppins } from "next/font/google";

// Load Comfortaa font for headings and accent text
const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-comfortaa",
});

// Load Poppins for body text and UI elements
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${comfortaa.variable} ${poppins.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pronoun Pride" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#8e44ad" />
      </head>
      <body className={comfortaa.className}>
        {/* Pride flag gradient header */}
        <header className="pride-header"></header>

        {/* Main content wrapped in auth provider */}
        <AuthProvider>{children}</AuthProvider>

        {/* Optional: Add a subtle footer */}
        <footer className="app-footer">
          <p>Made with 💜 and Pride</p>
        </footer>
      </body>
    </html>
  );
}
